import express from 'express';
import authRouter from './auth.js';
import { assessmentsRouter, checkInsRouter, newsletterRouter } from './community.js';
import { contentRouter } from './content.js';
import { couponsRouter } from './coupons.js';
import { membersRouter } from './members.js';
import { ordersRouter } from './orders.js';
import { paymentOptions } from './shop.js';
import { imagesRouter, productsRouter } from './products.js';

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

  app.use('/api/images', imagesRouter); // cacheable, so it sits before the no-store default below
  app.use('/api', (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  app.use('/api/auth', authRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/coupons', couponsRouter);
  app.use('/api/content', contentRouter);
  app.use('/api/newsletter', newsletterRouter);
  app.use('/api/assessments', assessmentsRouter);
  app.use('/api/checkins', checkInsRouter);
  app.use('/api/members', membersRouter);
  app.get('/api/config', (_req, res) => res.json(paymentOptions()));
  app.use('/api', (_req, res) => {
    res.status(404).json({ success: false, message: 'Bulunamadı.' });
  });

  return app;
}
