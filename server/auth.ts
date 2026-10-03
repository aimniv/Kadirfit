import { randomUUID } from 'node:crypto';
import express, { type Request, type Response, type NextFunction } from 'express';
import type { User } from '../src/types/index.js';
import { COOKIE_SECURE, isProd } from './config.js';
import { sendPasswordResetEmail, sendVerificationEmail, type MailResult } from './mailer.js';
import {
  checkPasswordPolicy,
  hashPassword,
  readSession,
  signSession,
  verifyAgainstDummy,
  verifyPassword
} from './security.js';
import { getStore, normalizeEmail, type Store, type StoredUser } from './store.js';

const SESSION_COOKIE = 'kf_session';
const HOUR = 60 * 60 * 1000;
const VERIFY_TTL = 24 * HOUR;
const RESET_TTL = HOUR;
const REMEMBER_TTL = 30 * 24 * HOUR;
const SHORT_SESSION_TTL = 12 * HOUR;

const LOGIN_MAX_FAILURES = 5;
const LOGIN_WINDOW = 15 * 60 * 1000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+0-9 ()-]{0,20}$/;

const router = express.Router();
router.use(express.json({ limit: '10kb' }));

/** Express 4 doesn't catch rejected promises from async handlers; forward them to the error middleware. */
const wrap =
  (fn: (req: Request, res: Response, db: Store) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    getStore()
      .then(db => fn(req, res, db))
      .catch(next);
  };

// ---- helpers ---------------------------------------------------------------

const str = (v: unknown, max = 200): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export const toPublicUser = ({ passwordHash: _h, sessionVersion: _s, ...user }: StoredUser): User => user;

const clientIp = (req: Request) => req.ip || 'unknown';

function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of (header || '').split(';')) {
    const idx = part.indexOf('=');
    if (idx > 0) out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

function setSessionCookie(res: Response, user: StoredUser, remember: boolean): void {
  const ttl = remember ? REMEMBER_TTL : SHORT_SESSION_TTL;
  const token = signSession({ uid: user.id, sv: user.sessionVersion, exp: Date.now() + ttl });
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: COOKIE_SECURE,
    path: '/',
    ...(remember ? { maxAge: ttl } : {})
  });
}

const clearSessionCookie = (res: Response) =>
  res.clearCookie(SESSION_COOKIE, { httpOnly: true, sameSite: 'lax', secure: COOKIE_SECURE, path: '/' });

export async function sessionUser(req: Request, db: Store): Promise<StoredUser | null> {
  const session = readSession(parseCookies(req.headers.cookie)[SESSION_COOKIE]);
  if (!session) return null;
  const user = await db.findUserById(session.uid);
  if (!user || user.sessionVersion !== session.sv || user.suspended) return null;
  return user;
}

const fail = (res: Response, status: number, message: string, extra: Record<string, unknown> = {}) =>
  res.status(status).json({ success: false, message, ...extra });

const tooMany = (res: Response, retryAfterSec: number, message: string) => {
  res.setHeader('Retry-After', String(retryAfterSec));
  return fail(res, 429, message, { code: 'RATE_LIMITED', retryAfterSec });
};

const waitText = (sec: number) => (sec >= 90 ? `${Math.ceil(sec / 60)} dakika` : `${sec} saniye`);

/** Dev-only: expose the action link when no mail server is configured, so the flow stays testable. */
const devLinkOf = (mail: MailResult) => (!isProd && mail.devLink ? { devLink: mail.devLink } : {});

async function sendVerification(db: Store, user: StoredUser): Promise<MailResult> {
  return sendVerificationEmail(user.email, user.firstName, await db.issueToken(user.id, 'verify', VERIFY_TTL));
}

// ---- routes ----------------------------------------------------------------

router.post('/register', wrap(async (req, res, db) => {
  const ip = await db.rateHit(`register-ip:${clientIp(req)}`, 10, HOUR);
  if (ip.limited) return tooMany(res, ip.retryAfterSec, 'Çok fazla kayıt denemesi. Lütfen daha sonra tekrar deneyin.');

  const firstName = str(req.body?.firstName, 60);
  const lastName = str(req.body?.lastName, 60);
  const email = normalizeEmail(str(req.body?.email, 254));
  const phone = str(req.body?.phone, 20);
  const password = req.body?.password;

  if (!firstName || !lastName || !email) return fail(res, 400, 'Lütfen zorunlu alanları doldurunuz.');
  if (!EMAIL_RE.test(email)) return fail(res, 400, 'Lütfen geçerli bir e-posta adresi giriniz.');
  if (!PHONE_RE.test(phone)) return fail(res, 400, 'Telefon numarası geçersiz.');
  const policy = checkPasswordPolicy(password);
  if (!policy.ok) return fail(res, 400, policy.message!);
  if (req.body?.kvkkAccepted !== true || req.body?.termsAccepted !== true) {
    return fail(res, 400, 'Lütfen KVKK Aydınlatma Metni ve Üyelik Sözleşmesini onaylayınız.');
  }
  if (await db.findUserByEmail(email)) {
    return fail(res, 409, 'Bu e-posta adresi zaten kullanımda. Giriş yapmayı veya şifrenizi sıfırlamayı deneyin.', {
      code: 'EMAIL_TAKEN'
    });
  }

  const user: StoredUser = {
    id: `user-${randomUUID()}`,
    firstName,
    lastName,
    email,
    phone,
    role: 'USER',
    createdAt: new Date().toISOString(),
    emailVerified: false,
    suspended: false,
    marketingConsent: req.body?.marketingConsent === true,
    passwordHash: await hashPassword(password as string),
    sessionVersion: 0
  };
  // The unique e-mail index decides races between two parallel sign-ups for the same address.
  if (!(await db.insertUser(user))) {
    return fail(res, 409, 'Bu e-posta adresi zaten kullanımda.', { code: 'EMAIL_TAKEN' });
  }

  const mail = await sendVerification(db, user);
  res.status(201).json({
    success: true,
    message: 'Kayıt başarılı! Hesabınızı etkinleştirmek için e-posta adresinize gönderilen doğrulama bağlantısına tıklayın.',
    email,
    mailSent: mail.sent,
    ...devLinkOf(mail)
  });
}));

router.post('/verify-email', wrap(async (req, res, db) => {
  const ip = await db.rateHit(`verify-ip:${clientIp(req)}`, 30, HOUR);
  if (ip.limited) return tooMany(res, ip.retryAfterSec, 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.');

  const userId = await db.consumeToken(str(req.body?.token, 128), 'verify');
  if (!userId) {
    return fail(res, 400, 'Doğrulama bağlantısı geçersiz veya süresi dolmuş. Giriş yapmayı deneyin; gerekirse yeni bir doğrulama e-postası isteyebilirsiniz.', {
      code: 'INVALID_TOKEN'
    });
  }
  await db.updateUser(userId, { emailVerified: true });
  res.json({ success: true, message: 'E-posta adresiniz doğrulandı! Artık giriş yapabilirsiniz.' });
}));

router.post('/resend-verification', wrap(async (req, res, db) => {
  const ip = await db.rateHit(`resend-ip:${clientIp(req)}`, 10, HOUR);
  if (ip.limited) return tooMany(res, ip.retryAfterSec, 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.');

  const email = normalizeEmail(str(req.body?.email, 254));
  const generic = {
    success: true,
    message: 'Bu adres kayıtlı ve henüz doğrulanmamışsa yeni bir doğrulama e-postası gönderildi.'
  };
  if (!EMAIL_RE.test(email)) return fail(res, 400, 'Lütfen geçerli bir e-posta adresi giriniz.');

  const perEmail = await db.rateHit(`resend-email:${email}`, 3, HOUR);
  const user = await db.findUserByEmail(email);
  if (perEmail.limited || !user || user.emailVerified) return res.json(generic);

  const mail = await sendVerification(db, user);
  res.json({ ...generic, ...devLinkOf(mail) });
}));

router.post('/login', wrap(async (req, res, db) => {
  const email = normalizeEmail(str(req.body?.email, 254));
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!email || !password) return fail(res, 400, 'Lütfen tüm alanları doldurunuz.');

  const emailKey = `login:${email}`;
  const ipKey = `login-ip:${clientIp(req)}`;
  const blocked = await db.rateBlocked(emailKey, LOGIN_MAX_FAILURES);
  const ipBlocked = await db.rateBlocked(ipKey, 30);
  if (blocked.limited || ipBlocked.limited) {
    const wait = Math.max(blocked.retryAfterSec, ipBlocked.retryAfterSec);
    return tooMany(res, wait, `Çok fazla başarısız deneme. Lütfen ${waitText(wait)} sonra tekrar deneyin.`);
  }

  const user = await db.findUserByEmail(email);
  let ok = false;
  if (user) ok = await verifyPassword(password, user.passwordHash);
  else await verifyAgainstDummy(password);

  if (!user || !ok) {
    const e = await db.rateHit(emailKey, LOGIN_MAX_FAILURES, LOGIN_WINDOW);
    await db.rateHit(ipKey, 30, LOGIN_WINDOW);
    if (e.count >= LOGIN_MAX_FAILURES) {
      return tooMany(res, e.retryAfterSec, `Güvenlik kilidi: ${LOGIN_MAX_FAILURES} hatalı deneme nedeniyle giriş ${waitText(e.retryAfterSec)} süreyle kilitlendi.`);
    }
    return fail(res, 401, `E-posta veya şifre hatalı. (Kalan deneme hakkı: ${LOGIN_MAX_FAILURES - e.count})`, {
      code: 'INVALID_CREDENTIALS'
    });
  }

  if (user.suspended) {
    return fail(res, 403, 'Hesabınız askıya alınmıştır. Lütfen destek ile iletişime geçiniz.', { code: 'SUSPENDED' });
  }
  if (!user.emailVerified) {
    return fail(res, 403, 'E-posta adresiniz henüz doğrulanmamış. Lütfen gelen kutunuzdaki doğrulama bağlantısına tıklayın.', {
      code: 'EMAIL_NOT_VERIFIED',
      email: user.email
    });
  }

  await db.rateReset(emailKey);
  setSessionCookie(res, user, req.body?.remember !== false);
  res.json({ success: true, message: `Hoş geldiniz, ${user.firstName}!`, user: toPublicUser(user) });
}));

router.post('/logout', (_req, res) => {
  clearSessionCookie(res);
  res.json({ success: true });
});

router.get('/me', wrap(async (req, res, db) => {
  const user = await sessionUser(req, db);
  if (!user) clearSessionCookie(res);
  res.json({ user: user ? toPublicUser(user) : null });
}));

router.patch('/me', wrap(async (req, res, db) => {
  const user = await sessionUser(req, db);
  if (!user) return fail(res, 401, 'Oturum açmanız gerekiyor.');

  const patch: Partial<StoredUser> = {};
  if (req.body?.firstName !== undefined) {
    patch.firstName = str(req.body.firstName, 60);
    if (!patch.firstName) return fail(res, 400, 'Ad boş olamaz.');
  }
  if (req.body?.lastName !== undefined) {
    patch.lastName = str(req.body.lastName, 60);
    if (!patch.lastName) return fail(res, 400, 'Soyad boş olamaz.');
  }
  if (req.body?.phone !== undefined) {
    patch.phone = str(req.body.phone, 20);
    if (!PHONE_RE.test(patch.phone)) return fail(res, 400, 'Telefon numarası geçersiz.');
  }
  if (typeof req.body?.marketingConsent === 'boolean') patch.marketingConsent = req.body.marketingConsent;

  const updated = (await db.updateUser(user.id, patch))!;
  res.json({ success: true, user: toPublicUser(updated) });
}));

router.delete('/me', wrap(async (req, res, db) => {
  const user = await sessionUser(req, db);
  if (!user) return fail(res, 401, 'Oturum açmanız gerekiyor.');
  await db.removeUser(user.id);
  clearSessionCookie(res);
  res.json({ success: true });
}));

router.post('/forgot-password', wrap(async (req, res, db) => {
  const ip = await db.rateHit(`forgot-ip:${clientIp(req)}`, 10, HOUR);
  if (ip.limited) return tooMany(res, ip.retryAfterSec, 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.');

  const email = normalizeEmail(str(req.body?.email, 254));
  if (!EMAIL_RE.test(email)) return fail(res, 400, 'Lütfen geçerli bir e-posta adresi giriniz.');

  // Same answer whether or not the account exists, so this endpoint can't be used to probe for members.
  const generic = {
    success: true,
    message: 'Bu e-posta adresi kayıtlıysa 1 saat geçerli, tek kullanımlık bir şifre sıfırlama bağlantısı gönderildi.'
  };
  const perEmail = await db.rateHit(`forgot-email:${email}`, 3, HOUR);
  const user = await db.findUserByEmail(email);
  if (perEmail.limited || !user || user.suspended) return res.json(generic);

  const mail = await sendPasswordResetEmail(user.email, user.firstName, await db.issueToken(user.id, 'reset', RESET_TTL));
  res.json({ ...generic, ...devLinkOf(mail) });
}));

router.post('/reset-password', wrap(async (req, res, db) => {
  const ip = await db.rateHit(`reset-ip:${clientIp(req)}`, 20, HOUR);
  if (ip.limited) return tooMany(res, ip.retryAfterSec, 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.');

  const token = str(req.body?.token, 128);
  const password = req.body?.password;
  // Check the policy first so a weak password doesn't burn the single-use token.
  const policy = checkPasswordPolicy(password);
  if (!policy.ok) return fail(res, 400, policy.message!);

  const passwordHash = await hashPassword(password as string);
  const userId = await db.consumeToken(token, 'reset');
  const user = userId ? await db.findUserById(userId) : undefined;
  if (!user) {
    return fail(res, 400, 'Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni bir bağlantı isteyin.', {
      code: 'INVALID_TOKEN'
    });
  }

  await db.updateUser(user.id, {
    passwordHash,
    sessionVersion: user.sessionVersion + 1, // signs out every existing session
    emailVerified: true // they just proved they control the mailbox
  });
  await db.clearTokens(user.id, 'verify');
  await db.rateReset(`login:${user.email.toLowerCase()}`);
  clearSessionCookie(res);
  res.json({ success: true, message: 'Şifreniz güncellendi. Yeni şifrenizle giriş yapabilirsiniz.' });
}));

// Unknown /api/auth/* paths and body-parser errors stay JSON.
router.use((_req, res) => fail(res, 404, 'Bulunamadı.'));
router.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  if (err.status === 400 || err instanceof SyntaxError) return fail(res, 400, 'Geçersiz istek.');
  console.error('[auth] Unhandled error:', err);
  fail(res, 500, 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
});

export default router;
