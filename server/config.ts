import 'dotenv/config';
import path from 'node:path';

export const isProd = process.env.NODE_ENV === 'production';
export const PORT = Number(process.env.PORT) || 3000;

const rawAppUrl = process.env.APP_URL || '';
// .env.example ships with a "MY_APP_URL" placeholder; ignore anything that isn't a real URL.
export const APP_URL = (/^https?:\/\//.test(rawAppUrl) ? rawAppUrl : `http://localhost:${PORT}`).replace(/\/+$/, '');
export const COOKIE_SECURE = APP_URL.startsWith('https://');

const PLACEHOLDER_SECRET = 'your-super-secret-jwt-key-32-chars-minimum';
const rawSecret = process.env.AUTH_SECRET || '';
if (isProd && (rawSecret.length < 32 || rawSecret === PLACEHOLDER_SECRET)) {
  throw new Error('AUTH_SECRET must be set to a random string of at least 32 characters in production.');
}
export const AUTH_SECRET = rawSecret.length >= 32 ? rawSecret : 'kadirfit-dev-only-secret-do-not-use-in-production';

export const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), 'data'));

export const SMTP = {
  host: process.env.SMTP_HOST || '',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  from: process.env.MAIL_FROM || 'Kadirfit <no-reply@kadirfit.com>'
};

export const SEED_DEMO_USERS = process.env.SEED_DEMO_USERS
  ? process.env.SEED_DEMO_USERS === 'true'
  : !isProd;
