import crypto from 'node:crypto';
import { AUTH_SECRET } from './config.js';

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 64;

const scrypt = (password: string, salt: Buffer, n: number, r: number, p: number): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, KEY_LEN, { N: n, r, p }, (err, key) => (err ? reject(err) : resolve(key)));
  });

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const key = await scrypt(password, salt, SCRYPT_N, SCRYPT_R, SCRYPT_P);
  return ['scrypt', SCRYPT_N, SCRYPT_R, SCRYPT_P, salt.toString('base64'), key.toString('base64')].join('$');
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, n, r, p, saltB64, keyB64] = stored.split('$');
  if (scheme !== 'scrypt' || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, 'base64');
  const actual = await scrypt(password, Buffer.from(saltB64, 'base64'), Number(n), Number(r), Number(p));
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

// Used to burn the same CPU time when the account doesn't exist, so response timing doesn't reveal it.
let dummyHash: Promise<string> | null = null;
export async function verifyAgainstDummy(password: string): Promise<void> {
  dummyHash ??= hashPassword('dummy-password-for-timing');
  await verifyPassword(password, await dummyHash);
}

export function randomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

const b64url = (buf: Buffer | string) => Buffer.from(buf).toString('base64url');
const hmac = (data: string) => crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('base64url');

export interface SessionPayload {
  uid: string;
  /** Session version; bumping it on the user record invalidates every existing session. */
  sv: number;
  /** Expiry, epoch ms. */
  exp: number;
}

export function signSession(payload: SessionPayload): string {
  const body = b64url(JSON.stringify(payload));
  return `${body}.${hmac(body)}`;
}

export function readSession(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = hmac(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (typeof payload.uid !== 'string' || typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export interface PasswordCheck {
  ok: boolean;
  message?: string;
}

export function checkPasswordPolicy(password: unknown): PasswordCheck {
  if (typeof password !== 'string' || password.length < 8) {
    return { ok: false, message: 'Şifreniz en az 8 karakter olmalıdır.' };
  }
  if (password.length > 128) {
    return { ok: false, message: 'Şifreniz en fazla 128 karakter olabilir.' };
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    return { ok: false, message: 'Şifreniz en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.' };
  }
  return { ok: true };
}
