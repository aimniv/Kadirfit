import { randomUUID } from 'node:crypto';
import express from 'express';
import type { Coupon } from '../src/types/index.js';
import { sessionUser } from './auth.js';
import { clientIp, fail, jsonErrors, text, wrap } from './http.js';
import { couponProblem, todayIso } from './shop.js';
import type { Store } from './store.js';

const HOUR = 60 * 60 * 1000;
const COUPON_ROLES = new Set(['SUPER_ADMIN', 'EDITOR']);
const CODE_RE = /^[A-Z0-9_-]{3,30}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const couponsRouter = express.Router();
couponsRouter.use(express.json({ limit: '8kb' }));

async function requireCouponEditor(req: express.Request, res: express.Response, db: Store) {
  const user = await sessionUser(req, db);
  if (!user) {
    fail(res, 401, 'Oturum açmanız gerekiyor.');
    return null;
  }
  if (!COUPON_ROLES.has(user.role)) {
    fail(res, 403, 'Kuponları yönetme yetkiniz yok.');
    return null;
  }
  return user;
}

const num = (v: unknown) => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : NaN;
};

/** Checkout / cart: is this code usable for this basket? Reveals only that one coupon, never the list. */
couponsRouter.post('/validate', wrap(async (req, res, db) => {
  const ip = await db.rateHit(`coupon-ip:${clientIp(req)}`, 40, HOUR);
  if (ip.limited) return fail(res, 429, 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.');
  const code = text(req.body?.code, 40).toUpperCase();
  const subtotal = Math.max(0, num(req.body?.subtotal) || 0);
  const coupon = code ? await db.getCouponByCode(code) : undefined;
  const problem = couponProblem(coupon, subtotal);
  if (problem) return fail(res, 400, problem);
  const { id, type, value, minCartAmount } = coupon!;
  res.json({ success: true, coupon: { id, code: coupon!.code, type, value, minCartAmount } });
}));

/** Staff see every coupon; signed-in customers see the ones currently usable ("Kuponlarım"). */
couponsRouter.get('/', wrap(async (req, res, db) => {
  const user = await sessionUser(req, db);
  if (!user) return fail(res, 401, 'Oturum açmanız gerekiyor.');
  const all = await db.listCoupons();
  if (COUPON_ROLES.has(user.role)) return res.json({ coupons: all });
  res.json({ coupons: all.filter(c => couponProblem(c, Infinity) === null) });
}));

couponsRouter.post('/', wrap(async (req, res, db) => {
  if (!(await requireCouponEditor(req, res, db))) return;
  const b = req.body ?? {};
  const code = text(b.code, 30).toUpperCase().replace(/\s+/g, '');
  const type = b.type === 'fixed' ? 'fixed' : b.type === 'percentage' ? 'percentage' : null;
  const value = num(b.value);
  const minCartAmount = num(b.minCartAmount ?? 0);
  const usageLimit = Math.floor(num(b.usageLimit ?? 500));
  const expiresAt = text(b.expiresAt ?? '2027-12-31', 10);

  if (!CODE_RE.test(code)) return fail(res, 400, 'Kupon kodu 3-30 karakter olmalı; yalnızca harf, rakam, - ve _ kullanılabilir.');
  if (!type) return fail(res, 400, 'İndirim türü geçersiz.');
  if (!(value > 0) || (type === 'percentage' && value > 100) || value > 1_000_000) return fail(res, 400, 'İndirim değeri geçersiz.');
  if (!(minCartAmount >= 0)) return fail(res, 400, 'Minimum sepet tutarı geçersiz.');
  if (!(usageLimit >= 1)) return fail(res, 400, 'Kullanım limiti en az 1 olmalıdır.');
  if (!DATE_RE.test(expiresAt) || expiresAt < todayIso()) return fail(res, 400, 'Son kullanma tarihi geçersiz veya geçmişte.');

  const coupon: Coupon = {
    id: `coup-${randomUUID()}`,
    code,
    type,
    value,
    minCartAmount,
    expiresAt,
    usageCount: 0,
    usageLimit,
    isActive: b.isActive !== false
  };
  if (!(await db.insertCoupon(coupon))) return fail(res, 409, 'Bu kupon kodu zaten mevcut.');
  res.status(201).json({ success: true, coupon });
}));

couponsRouter.patch('/:id', wrap(async (req, res, db) => {
  if (!(await requireCouponEditor(req, res, db))) return;
  const patch: Partial<Coupon> = {};
  const b = req.body ?? {};
  if (typeof b.isActive === 'boolean') patch.isActive = b.isActive;
  if (b.usageLimit !== undefined) {
    const n = Math.floor(num(b.usageLimit));
    if (!(n >= 1)) return fail(res, 400, 'Kullanım limiti en az 1 olmalıdır.');
    patch.usageLimit = n;
  }
  if (b.expiresAt !== undefined) {
    const d = text(b.expiresAt, 10);
    if (!DATE_RE.test(d)) return fail(res, 400, 'Son kullanma tarihi geçersiz.');
    patch.expiresAt = d;
  }
  const updated = await db.updateCoupon(req.params.id, patch);
  if (!updated) return fail(res, 404, 'Kupon bulunamadı.');
  res.json({ success: true, coupon: updated });
}));

couponsRouter.delete('/:id', wrap(async (req, res, db) => {
  if (!(await requireCouponEditor(req, res, db))) return;
  if (!(await db.removeCoupon(req.params.id))) return fail(res, 404, 'Kupon bulunamadı.');
  res.json({ success: true });
}));

couponsRouter.use(jsonErrors('coupons'));
