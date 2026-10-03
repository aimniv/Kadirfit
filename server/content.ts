import express from 'express';
import { sessionUser } from './auth.js';
import { fail, jsonErrors, wrap } from './http.js';

/** Owner-editable site content. Everyone can read it; only SUPER_ADMIN / EDITOR can change it. */
const EDITOR_ROLES = new Set(['SUPER_ADMIN', 'EDITOR']);
const OBJECT_KEYS = new Set(['settings']);
const ARRAY_KEYS = new Set(['cms_sections', 'coaching_packages', 'blog_posts', 'testimonials', 'transformations']);

export const contentRouter = express.Router();
contentRouter.use(express.json({ limit: '600kb' }));

contentRouter.get('/', wrap(async (_req, res, db) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({ content: await db.listContent() });
}));

contentRouter.put('/:key', wrap(async (req, res, db) => {
  const user = await sessionUser(req, db);
  if (!user) return fail(res, 401, 'Oturum açmanız gerekiyor.');
  if (!EDITOR_ROLES.has(user.role)) return fail(res, 403, 'İçerik düzenleme yetkiniz yok.');

  const { key } = req.params;
  const data = req.body?.data;
  if (OBJECT_KEYS.has(key)) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return fail(res, 400, 'Geçersiz içerik.');
  } else if (ARRAY_KEYS.has(key)) {
    if (!Array.isArray(data) || data.length > 500 || data.some(x => !x || typeof x !== 'object' || typeof x.id !== 'string')) {
      return fail(res, 400, 'Geçersiz içerik.');
    }
  } else {
    return fail(res, 404, 'Bilinmeyen içerik türü.');
  }
  await db.setContent(key, data);
  res.json({ success: true });
}));

contentRouter.use(jsonErrors('content'));
