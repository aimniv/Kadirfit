import { randomUUID } from 'node:crypto';
import express, { type Request, type Response, type NextFunction } from 'express';
import type { Product, ProductCategory } from '../src/types/index.js';
import { sessionUser } from './auth.js';
import { getStore, type Store } from './store.js';

/** Roles allowed to change the catalogue. */
const CATALOGUE_ROLES = new Set(['SUPER_ADMIN', 'EDITOR']);
const CATEGORIES: ProductCategory[] = ['clothing', 'supplements', 'accessories'];
const MAX_IMAGE_BYTES = 1_500_000;
const MAX_IMAGES_PER_PRODUCT = 8;

const wrap =
  (fn: (req: Request, res: Response, db: Store) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    getStore()
      .then(db => fn(req, res, db))
      .catch(next);
  };

const fail = (res: Response, status: number, message: string) => res.status(status).json({ success: false, message });

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

const list = (v: unknown, maxItems: number, maxLen: number): string[] =>
  Array.isArray(v) ? v.map(x => text(x, maxLen)).filter(Boolean).slice(0, maxItems) : [];

const money = (v: unknown): number | undefined => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) && n >= 0 && n < 10_000_000 ? Math.round(n * 100) / 100 : undefined;
};

/** Only images we host ourselves or plain https URLs; never javascript:/data: URLs. */
const imageUrl = (v: unknown): string | null => {
  const url = text(v, 500);
  return /^\/api\/images\/[A-Za-z0-9-]+$/.test(url) || /^https:\/\/[^\s"'<>]+$/.test(url) ? url : null;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'urun';

type Parsed = { ok: true; fields: Partial<Product> } | { ok: false; message: string };

/** Validates the editable fields. Fields we don't edit (variants, reviews, nutrition...) are left untouched on update. */
function parseProduct(body: any, requireAll: boolean): Parsed {
  const f: Partial<Product> = {};
  const has = (k: string) => body?.[k] !== undefined;

  if (requireAll || has('title')) {
    f.title = text(body?.title, 200);
    if (!f.title) return { ok: false, message: 'Ürün adı zorunludur.' };
  }
  if (requireAll || has('category')) {
    if (!CATEGORIES.includes(body?.category)) return { ok: false, message: 'Geçerli bir kategori seçiniz.' };
    f.category = body.category;
  }
  if (requireAll || has('price')) {
    const price = money(body?.price);
    if (price === undefined || price <= 0) return { ok: false, message: 'Geçerli bir fiyat giriniz.' };
    f.price = price;
  }
  if (has('discountedPrice')) {
    if (body.discountedPrice === null || body.discountedPrice === '' || body.discountedPrice === 0) {
      f.discountedPrice = undefined;
    } else {
      const d = money(body.discountedPrice);
      const price = f.price ?? money(body?.price);
      if (d === undefined || (price !== undefined && d >= price)) {
        return { ok: false, message: 'İndirimli fiyat, normal fiyattan düşük olmalıdır.' };
      }
      f.discountedPrice = d;
    }
  }
  if (requireAll || has('stock')) {
    const stock = Number(body?.stock);
    if (!Number.isInteger(stock) || stock < 0 || stock > 1_000_000) return { ok: false, message: 'Stok adedi geçersiz.' };
    f.stock = stock;
  }
  if (has('subcategory')) f.subcategory = text(body.subcategory, 60);
  if (has('sku')) f.sku = text(body.sku, 60);
  if (has('brand')) f.brand = text(body.brand, 80);
  if (has('shortDescription')) f.shortDescription = text(body.shortDescription, 300);
  if (has('description')) f.description = text(body.description, 5000);
  if (has('usageInstructions')) f.usageInstructions = text(body.usageInstructions, 2000) || undefined;
  if (has('features')) f.features = list(body.features, 20, 200);
  if (has('tags')) f.tags = list(body.tags, 20, 40);
  if (has('sizes')) f.sizes = list(body.sizes, 20, 30);
  if (has('colors')) f.colors = list(body.colors, 20, 30);
  if (has('flavors')) f.flavors = list(body.flavors, 30, 40);
  if (has('weights')) f.weights = list(body.weights, 20, 30);
  if (has('isFeatured')) f.isFeatured = body.isFeatured === true;
  if (has('isNew')) f.isNew = body.isNew === true;
  if (has('isBestSeller')) f.isBestSeller = body.isBestSeller === true;
  if (requireAll || has('images')) {
    const images = (Array.isArray(body?.images) ? body.images : []).map(imageUrl);
    if (images.some((u: string | null) => u === null)) return { ok: false, message: 'Geçersiz görsel adresi.' };
    if (images.length > MAX_IMAGES_PER_PRODUCT) return { ok: false, message: `En fazla ${MAX_IMAGES_PER_PRODUCT} görsel eklenebilir.` };
    f.images = images as string[];
  }
  return { ok: true, fields: f };
}

/** Sniffs the real file type; we never trust the client-declared one. */
function sniffImage(buf: Buffer): string | null {
  if (buf.length > 12 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.length > 12 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buf.length > 12 && buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP') return 'image/webp';
  return null;
}

async function requireCatalogueEditor(req: Request, res: Response, db: Store) {
  const user = await sessionUser(req, db);
  if (!user) {
    fail(res, 401, 'Oturum açmanız gerekiyor.');
    return null;
  }
  if (!CATALOGUE_ROLES.has(user.role)) {
    fail(res, 403, 'Ürünleri düzenleme yetkiniz yok.');
    return null;
  }
  return user;
}

export const productsRouter = express.Router();
productsRouter.use(express.json({ limit: '32kb' }));

productsRouter.get('/', wrap(async (_req, res, db) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({ products: await db.listProducts() });
}));

productsRouter.post('/', wrap(async (req, res, db) => {
  if (!(await requireCatalogueEditor(req, res, db))) return;
  const parsed = parseProduct(req.body, true);
  if (!parsed.ok) return fail(res, 400, parsed.message);

  const f = parsed.fields;
  const id = `prod-${randomUUID()}`;
  const defaults = {
    subcategory: '',
    brand: 'Kadirfit',
    shortDescription: '',
    description: '',
    features: [] as string[],
    tags: [] as string[],
    isFeatured: false
  };
  const product = {
    ...defaults,
    ...f,
    id,
    slug: `${slugify(f.title!)}-${id.slice(5, 11)}`,
    sku: f.sku || `KF-${id.slice(5, 11).toUpperCase()}`,
    rating: 5,
    reviewCount: 0
  } as Product;
  await db.saveProduct(product);
  res.status(201).json({ success: true, product });
}));

productsRouter.put('/:id', wrap(async (req, res, db) => {
  if (!(await requireCatalogueEditor(req, res, db))) return;
  const existing = await db.getProduct(req.params.id);
  if (!existing) return fail(res, 404, 'Ürün bulunamadı.');
  const parsed = parseProduct(req.body, false);
  if (!parsed.ok) return fail(res, 400, parsed.message);

  const merged: Product = { ...existing, ...parsed.fields, id: existing.id, slug: existing.slug };
  // An explicit "no discount" must remove the key, not leave a stale value behind.
  if ('discountedPrice' in parsed.fields && parsed.fields.discountedPrice === undefined) delete merged.discountedPrice;
  if (merged.discountedPrice !== undefined && merged.discountedPrice >= merged.price) {
    return fail(res, 400, 'İndirimli fiyat, normal fiyattan düşük olmalıdır.');
  }
  await db.saveProduct(merged);
  res.json({ success: true, product: merged });
}));

productsRouter.delete('/:id', wrap(async (req, res, db) => {
  if (!(await requireCatalogueEditor(req, res, db))) return;
  if (!(await db.removeProduct(req.params.id))) return fail(res, 404, 'Ürün bulunamadı.');
  res.json({ success: true });
}));

// ---- images -----------------------------------------------------------------

export const imagesRouter = express.Router();

// Upload: JSON { data: <base64> }, ~1.5 MB max. The browser shrinks photos before sending.
imagesRouter.post('/', express.json({ limit: '2.2mb' }), wrap(async (req, res, db) => {
  if (!(await requireCatalogueEditor(req, res, db))) return;
  const b64 = typeof req.body?.data === 'string' ? req.body.data : '';
  const buf = Buffer.from(b64, 'base64');
  if (!buf.length || buf.length > MAX_IMAGE_BYTES) return fail(res, 400, 'Görsel boş veya çok büyük (en fazla 1,5 MB).');
  const mime = sniffImage(buf);
  if (!mime) return fail(res, 400, 'Yalnızca JPG, PNG veya WebP görseller yüklenebilir.');
  const id = randomUUID();
  await db.saveImage(id, mime, buf);
  res.status(201).json({ success: true, url: `/api/images/${id}` });
}));

imagesRouter.get('/:id', wrap(async (req, res, db) => {
  const img = /^[A-Za-z0-9-]+$/.test(req.params.id) ? await db.getImage(req.params.id) : undefined;
  if (!img) return fail(res, 404, 'Görsel bulunamadı.');
  res.setHeader('Content-Type', img.mime);
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // ids are never reused
  res.setHeader('Content-Disposition', 'inline');
  res.send(img.data);
}));

// JSON errors for everything under these routers
for (const r of [productsRouter, imagesRouter]) {
  r.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
    if (err.status === 413) return fail(res, 413, 'Gönderilen veri çok büyük.');
    if (err.status === 400 || err instanceof SyntaxError) return fail(res, 400, 'Geçersiz istek.');
    console.error('[products] Unhandled error:', err);
    fail(res, 500, 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
  });
}
