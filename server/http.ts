import type { Request, Response, NextFunction } from 'express';
import { getStore, type Store } from './store.js';

/** Express 4 doesn't catch rejected promises from async handlers; forward them to the error middleware. */
export const wrap =
  (fn: (req: Request, res: Response, db: Store) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    getStore()
      .then(db => fn(req, res, db))
      .catch(next);
  };

export const fail = (res: Response, status: number, message: string, extra: Record<string, unknown> = {}) =>
  res.status(status).json({ success: false, message, ...extra });

export const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export const clientIp = (req: Request) => req.ip || 'unknown';

/** JSON error handling shared by the routers. */
export function jsonErrors(label: string) {
  return (err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
    if (err.status === 413) return fail(res, 413, 'Gönderilen veri çok büyük.');
    if (err.status === 400 || err instanceof SyntaxError) return fail(res, 400, 'Geçersiz istek.');
    console.error(`[${label}] Unhandled error:`, err);
    fail(res, 500, 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
  };
}
