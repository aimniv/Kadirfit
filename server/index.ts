import http from 'node:http';
import path from 'node:path';
import express from 'express';
import authRouter from './auth';
import { APP_URL, PORT, isProd } from './config';
import { seedUsers } from './seed';

const app = express();
const server = http.createServer(app);

app.disable('x-powered-by');
app.set('trust proxy', 1); // behind Cloud Run / Vercel / nginx, so req.ip is the real client

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

await seedUsers();

if (isProd) {
  const dist = path.resolve(process.cwd(), 'dist');
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    appType: 'spa',
    server: {
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR === 'true' ? false : { server }
    }
  });
  app.use(vite.middlewares);
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Kadirfit running on ${APP_URL} (${isProd ? 'production' : 'development'})`);
});
