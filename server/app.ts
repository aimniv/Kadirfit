import express from 'express';
import authRouter from './auth.js';

/** The API only (no static files, no Vite). Shared by the local server and the Vercel function. */
export function createApiApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1); // behind Vercel / Cloud Run / nginx, so req.ip is the real client

  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  app.use('/api', (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  app.use('/api/auth', authRouter);
  app.use('/api', (_req, res) => {
    res.status(404).json({ success: false, message: 'Bulunamadı.' });
  });

  return app;
}
