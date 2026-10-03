import http from 'node:http';
import path from 'node:path';
import express from 'express';
import { createApiApp } from './app.js';
import { APP_URL, PORT, isProd } from './config.js';
import { getStore } from './store.js';

const app = createApiApp();
const server = http.createServer(app);

await getStore(); // create tables / seed accounts now, so a bad DATABASE_URL fails at startup

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
