import { createApiApp } from '../server/app.js';

// Vercel serverless entry: vercel.json rewrites every /api/* request here.
export default createApiApp();
