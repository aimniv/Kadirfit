import express from 'express';
import { sessionUser, toPublicUser } from './auth.js';
import { fail, jsonErrors, wrap } from './http.js';

/** Member list and suspension for the owner. */
export const membersRouter = express.Router();
membersRouter.use(express.json({ limit: '2kb' }));

membersRouter.get('/', wrap(async (req, res, db) => {
  const me = await sessionUser(req, db);
  if (!me) return fail(res, 401, 'Oturum açmanız gerekiyor.');
  if (me.role !== 'SUPER_ADMIN') return fail(res, 403, 'Bu işlem için yetkiniz yok.');
  res.json({ users: (await db.listUsers()).map(toPublicUser) });
}));

membersRouter.patch('/:id', wrap(async (req, res, db) => {
  const me = await sessionUser(req, db);
  if (!me) return fail(res, 401, 'Oturum açmanız gerekiyor.');
  if (me.role !== 'SUPER_ADMIN') return fail(res, 403, 'Bu işlem için yetkiniz yok.');
  if (typeof req.body?.suspended !== 'boolean') return fail(res, 400, 'Geçersiz istek.');
  if (req.params.id === me.id) return fail(res, 400, 'Kendi hesabınızı askıya alamazsınız.');
  // The session check looks at `suspended` on every request, so this signs the member out immediately.
  const updated = await db.updateUser(req.params.id, { suspended: req.body.suspended });
  if (!updated) return fail(res, 404, 'Üye bulunamadı.');
  res.json({ success: true, user: toPublicUser(updated) });
}));
membersRouter.use(jsonErrors('members'));
