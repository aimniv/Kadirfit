import { randomInt, randomUUID } from 'node:crypto';
import express from 'express';
import type { Address, Order, OrderItem, OrderStatus } from '../src/types/index.js';
import { sessionUser } from './auth.js';
import { fail, jsonErrors, clientIp, text, wrap } from './http.js';
import { sendOrderEmails } from './mailer.js';
import {
  CASH_ON_DELIVERY_FEE,
  COACHING_IMAGE,
  couponDiscount,
  couponProblem,
  findCoachingPackage,
  paymentOptions,
  round2,
  shippingFee
} from './shop.js';
import type { Store, StoredUser } from './store.js';

const HOUR = 60 * 60 * 1000;
const ORDER_ADMIN_ROLES = new Set(['SUPER_ADMIN', 'ORDER_MANAGER']);
const STATUSES: OrderStatus[] = ['Beklemede', 'Hazırlanıyor', 'Kargoda', 'Teslim Edildi', 'İptal / İade'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+0-9 ()-]{7,20}$/;

export const ordersRouter = express.Router();
ordersRouter.use(express.json({ limit: '32kb' }));

async function requireOrderAdmin(req: express.Request, res: express.Response, db: Store): Promise<StoredUser | null> {
  const user = await sessionUser(req, db);
  if (!user) {
    fail(res, 401, 'Oturum açmanız gerekiyor.');
    return null;
  }
  if (!ORDER_ADMIN_ROLES.has(user.role)) {
    fail(res, 403, 'Siparişleri yönetme yetkiniz yok.');
    return null;
  }
  return user;
}

const variantText = (parts: Array<[string, string | undefined]>) =>
  parts.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(' • ');

// ---- place an order -------------------------------------------------------------

ordersRouter.post('/', wrap(async (req, res, db) => {
  const ip = await db.rateHit(`order-ip:${clientIp(req)}`, 20, HOUR);
  if (ip.limited) return fail(res, 429, 'Çok fazla sipariş denemesi. Lütfen daha sonra tekrar deneyin.');

  const b = req.body ?? {};
  const firstName = text(b.customer?.firstName, 60);
  const lastName = text(b.customer?.lastName, 60);
  const email = text(b.customer?.email, 254).toLowerCase();
  const phone = text(b.customer?.phone, 20);
  if (!firstName || !lastName) return fail(res, 400, 'Lütfen ad ve soyad bilgilerinizi giriniz.');
  if (!EMAIL_RE.test(email)) return fail(res, 400, 'Lütfen geçerli bir e-posta adresi giriniz.');
  if (!PHONE_RE.test(phone)) return fail(res, 400, 'Lütfen geçerli bir telefon numarası giriniz.');

  const a = b.shippingAddress ?? {};
  const fullAddress = text(a.fullAddress, 400);
  const city = text(a.city, 60);
  const district = text(a.district, 60);
  if (!fullAddress || !city || !district) return fail(res, 400, 'Lütfen teslimat adresinizi eksiksiz giriniz.');
  const isCorporate = a.isCorporate === true;
  if (isCorporate && (!text(a.companyName, 120) || !text(a.taxNumber, 20))) {
    return fail(res, 400, 'Kurumsal fatura için şirket adı ve vergi numarası gereklidir.');
  }

  if (b.agreed !== true) return fail(res, 400, 'Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi onaylanmalıdır.');

  const { methods } = paymentOptions();
  const paymentMethod = b.paymentMethod as Order['paymentMethod'];
  if (!(methods as string[]).includes(paymentMethod)) {
    return fail(res, 400, 'Seçilen ödeme yöntemi şu anda kullanılamıyor.');
  }

  // Everything below is priced from the catalogue, never from what the browser sent.
  const rawItems = Array.isArray(b.items) ? b.items.slice(0, 30) : [];
  if (!rawItems.length) return fail(res, 400, 'Sepetiniz boş.');

  const items: OrderItem[] = [];
  const stock = new Map<string, number>();
  for (const raw of rawItems) {
    const productId = text(raw?.productId, 100);
    const quantity = Number(raw?.quantity);
    if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return fail(res, 400, 'Sepetinizdeki ürün bilgileri geçersiz.');
    }

    const pkg = raw?.isCoachingPackage ? findCoachingPackage(productId) : undefined;
    if (raw?.isCoachingPackage) {
      const months = Number(raw?.coachingDurationMonths);
      const duration = pkg?.durations.find(d => d.months === months);
      if (!pkg || !duration) return fail(res, 400, 'Seçilen koçluk paketi bulunamadı.');
      items.push({
        productId,
        title: `${pkg.name} (${months} Ay)`,
        quantity: 1,
        unitPrice: duration.price,
        selectedVariantText: `${months} Ay Koçluk`,
        image: COACHING_IMAGE,
        isCoaching: true
      });
      continue;
    }

    const product = await db.getProduct(productId);
    if (!product) return fail(res, 400, 'Sepetinizdeki bir ürün artık satışta değil. Lütfen sepetinizi güncelleyin.');
    // No choice sent (e.g. "add to cart" straight from the shop grid) means the first option, as the storefront does;
    // a choice that isn't offered is rejected (null).
    const pick = (value: unknown, options: string[] | undefined): string | undefined | null => {
      if (!options?.length) return undefined;
      const v = text(value, 60);
      if (!v) return options[0];
      return options.includes(v) ? v : null;
    };
    const size = pick(raw?.selectedSize, product.sizes);
    const color = pick(raw?.selectedColor, product.colors);
    const flavor = pick(raw?.selectedFlavor, product.flavors);
    const weight = pick(raw?.selectedWeight, product.weights);
    if (size === null || color === null || flavor === null || weight === null) {
      return fail(res, 400, `"${product.title}" için seçtiğiniz varyant geçersiz.`);
    }
    stock.set(productId, (stock.get(productId) ?? 0) + quantity);
    items.push({
      productId,
      title: product.title,
      quantity,
      unitPrice: product.discountedPrice ?? product.price,
      selectedVariantText: variantText([['Beden', size], ['Renk', color], ['Aroma', flavor], ['Gramaj', weight]]),
      image: product.images[0] ?? '',
      isCoaching: false
    });
  }

  const subtotal = round2(items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0));

  let discountAmount = 0;
  let couponCode: string | undefined;
  let couponId: string | undefined;
  const code = text(b.couponCode, 40).toUpperCase();
  if (code) {
    const coupon = await db.getCouponByCode(code);
    const problem = couponProblem(coupon, subtotal);
    if (problem) return fail(res, 400, problem, { code: 'COUPON' });
    discountAmount = couponDiscount(coupon!, subtotal);
    couponCode = coupon!.code;
    couponId = coupon!.id;
  }

  const shipping = shippingFee(subtotal, items.every(i => i.isCoaching));
  const paymentFee = paymentMethod === 'cash_on_delivery' && !items.every(i => i.isCoaching) ? CASH_ON_DELIVERY_FEE : 0;
  const total = round2(Math.max(0, subtotal - discountAmount + shipping + paymentFee));

  const user = await sessionUser(req, db);
  const fullName = `${firstName} ${lastName}`;
  const shippingAddress: Address = {
    id: `addr-${randomUUID()}`,
    title: text(a.title, 40) || 'Teslimat',
    fullName,
    phone,
    city,
    district,
    fullAddress,
    postalCode: text(a.postalCode, 10) || undefined,
    isCorporate,
    companyName: isCorporate ? text(a.companyName, 120) : undefined,
    taxOffice: isCorporate ? text(a.taxOffice, 80) : undefined,
    taxNumber: isCorporate ? text(a.taxNumber, 20) : undefined
  };

  for (let attempt = 0; attempt < 5; attempt++) {
    const order: Order = {
      id: `ord-${randomUUID()}`,
      orderNumber: `KF-${new Date().getFullYear()}-${randomInt(100000, 1000000)}`,
      userId: user?.id,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress,
      billingAddress: shippingAddress,
      items,
      subtotal,
      discountAmount,
      couponCode,
      shippingFee: shipping,
      paymentFee: paymentFee || undefined,
      total,
      status: 'Beklemede',
      paymentMethod,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      notes: text(b.notes, 500) || undefined
    };

    const result = await db.placeOrder(order, [...stock].map(([productId, quantity]) => ({ productId, quantity })), couponId);
    if (result.ok) {
      // E-mail is best effort: a mail problem must never undo a placed order.
      sendOrderEmails(order).catch(err => console.error('[orders] mail failed:', err));
      return res.status(201).json({ success: true, order });
    }
    if (result.reason === 'stock') {
      const title = items.find(i => i.productId === result.productId)?.title ?? 'Bir ürün';
      return fail(res, 409, `"${title}" için yeterli stok kalmadı. Lütfen sepetinizi güncelleyin.`, { code: 'STOCK' });
    }
    if (result.reason === 'coupon') return fail(res, 400, 'Geçersiz veya süresi dolmuş kupon kodu.', { code: 'COUPON' });
    // 'number': order-number collision, try again with a fresh number
  }
  return fail(res, 500, 'Sipariş oluşturulamadı. Lütfen tekrar deneyin.');
}));

// ---- read ------------------------------------------------------------------------

ordersRouter.get('/', wrap(async (req, res, db) => {
  if (!(await requireOrderAdmin(req, res, db))) return;
  res.json({ orders: await db.listOrders() });
}));

ordersRouter.get('/mine', wrap(async (req, res, db) => {
  const user = await sessionUser(req, db);
  if (!user) return fail(res, 401, 'Oturum açmanız gerekiyor.');
  // The e-mail match only counts because sessions exist solely for verified addresses.
  res.json({ orders: await db.listOrdersForCustomer(user.id, user.email) });
}));

// ---- change (staff) --------------------------------------------------------------

ordersRouter.patch('/:id', wrap(async (req, res, db) => {
  if (!(await requireOrderAdmin(req, res, db))) return;
  const order = await db.getOrder(req.params.id);
  if (!order) return fail(res, 404, 'Sipariş bulunamadı.');

  const patch: Partial<Order> = {};
  const b = req.body ?? {};
  if (b.status !== undefined) {
    if (!STATUSES.includes(b.status)) return fail(res, 400, 'Geçersiz sipariş durumu.');
    patch.status = b.status;
  }
  if (b.paymentStatus !== undefined) {
    if (b.paymentStatus !== 'paid' && b.paymentStatus !== 'pending') return fail(res, 400, 'Geçersiz ödeme durumu.');
    patch.paymentStatus = b.paymentStatus;
  }
  if (b.cargoCompany !== undefined) patch.cargoCompany = text(b.cargoCompany, 60) || undefined;
  if (b.trackingNumber !== undefined) {
    const tn = text(b.trackingNumber, 60);
    patch.trackingNumber = tn || undefined;
    patch.trackingUrl = tn
      ? `https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=${encodeURIComponent(tn)}`
      : undefined;
  }

  // Cash on delivery is collected when the parcel arrives.
  if (patch.status === 'Teslim Edildi' && order.paymentMethod === 'cash_on_delivery' && patch.paymentStatus === undefined) {
    patch.paymentStatus = 'paid';
  }
  // A cancelled / returned order puts its stock back on the shelf (once).
  if (patch.status === 'İptal / İade' && order.status !== 'İptal / İade') {
    for (const item of order.items) if (!item.isCoaching) await db.adjustStock(item.productId, item.quantity);
  }

  const updated = await db.updateOrder(order.id, patch);
  res.json({ success: true, order: updated });
}));

// ---- return request (customer) ---------------------------------------------------

ordersRouter.post('/:id/return', wrap(async (req, res, db) => {
  const user = await sessionUser(req, db);
  if (!user) return fail(res, 401, 'Oturum açmanız gerekiyor.');
  const order = await db.getOrder(req.params.id);
  const mine = order && (order.userId === user.id || order.customerEmail.toLowerCase() === user.email.toLowerCase());
  if (!order || !mine) return fail(res, 404, 'Sipariş bulunamadı.');
  if (order.returnRequested || order.status === 'İptal / İade') return fail(res, 409, 'Bu sipariş için zaten bir iade/iptal süreci var.');
  const reason = text(req.body?.reason, 500);
  if (!reason) return fail(res, 400, 'Lütfen iade nedenini yazınız.');
  const updated = await db.updateOrder(order.id, { returnRequested: true, returnReason: reason });
  res.json({ success: true, order: updated });
}));

ordersRouter.use(jsonErrors('orders'));
