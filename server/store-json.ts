import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR } from './config.js';
import { randomToken, sha256 } from './security.js';
import type { Product } from '../src/types/index.js';
import { normalizeEmail, type RateResult, type Store, type StoredUser, type TokenType } from './store.js';

/**
 * Local-development store: a JSON file plus an in-memory rate limiter.
 * Not suitable for production (single process, needs a writable disk).
 */

interface StoredToken {
  hash: string;
  userId: string;
  type: TokenType;
  expiresAt: number;
}

interface Db {
  users: StoredUser[];
  tokens: StoredToken[];
  products: Product[];
  productsSeeded: boolean;
  images: Record<string, { mime: string; data: string }>;
}

const emptyDb = (): Db => ({ users: [], tokens: [], products: [], productsSeeded: false, images: {} });

const DB_FILE = path.join(DATA_DIR, 'auth.json');

export class JsonStore implements Store {
  private db: Db = emptyDb();
  private buckets = new Map<string, { count: number; resetAt: number }>();

  async init(): Promise<void> {
    try {
      const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) as Partial<Db>;
      this.db = { ...emptyDb(), ...parsed };
    } catch {
      this.db = emptyDb();
    }
    setInterval(() => {
      const now = Date.now();
      for (const [key, bucket] of this.buckets) if (bucket.resetAt <= now) this.buckets.delete(key);
    }, 60_000).unref();
  }

  private persist(): void {
    this.db.tokens = this.db.tokens.filter(t => t.expiresAt > Date.now());
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmp = `${DB_FILE}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(this.db, null, 2), { mode: 0o600 });
    fs.renameSync(tmp, DB_FILE);
  }

  async findUserByEmail(email: string) {
    const needle = normalizeEmail(email);
    return this.db.users.find(u => u.email.toLowerCase() === needle);
  }

  async findUserById(id: string) {
    return this.db.users.find(u => u.id === id);
  }

  async insertUser(user: StoredUser) {
    if (await this.findUserByEmail(user.email)) return false;
    this.db.users.push(user);
    this.persist();
    return true;
  }

  async updateUser(id: string, patch: Partial<StoredUser>) {
    const user = await this.findUserById(id);
    if (!user) return undefined;
    Object.assign(user, patch);
    this.persist();
    return user;
  }

  async removeUser(id: string) {
    this.db.users = this.db.users.filter(u => u.id !== id);
    this.db.tokens = this.db.tokens.filter(t => t.userId !== id);
    this.persist();
  }

  async issueToken(userId: string, type: TokenType, ttlMs: number) {
    const raw = randomToken();
    this.db.tokens = this.db.tokens.filter(t => !(t.userId === userId && t.type === type));
    this.db.tokens.push({ hash: sha256(raw), userId, type, expiresAt: Date.now() + ttlMs });
    this.persist();
    return raw;
  }

  async consumeToken(raw: string, type: TokenType) {
    const hash = sha256(raw);
    const found = this.db.tokens.find(t => t.hash === hash && t.type === type && t.expiresAt > Date.now());
    if (!found) return null;
    this.db.tokens = this.db.tokens.filter(t => t.hash !== hash);
    this.persist();
    return found.userId;
  }

  async clearTokens(userId: string, type: TokenType) {
    this.db.tokens = this.db.tokens.filter(t => !(t.userId === userId && t.type === type));
    this.persist();
  }

  async rateHit(key: string, limit: number, windowMs: number): Promise<RateResult> {
    const now = Date.now();
    let bucket = this.buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      this.buckets.set(key, bucket);
    }
    bucket.count += 1;
    return { limited: bucket.count > limit, count: bucket.count, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  async rateBlocked(key: string, limit: number) {
    const bucket = this.buckets.get(key);
    if (!bucket || bucket.resetAt <= Date.now()) return { limited: false, retryAfterSec: 0 };
    return { limited: bucket.count >= limit, retryAfterSec: Math.ceil((bucket.resetAt - Date.now()) / 1000) };
  }

  async rateReset(key: string) {
    this.buckets.delete(key);
  }

  async listProducts() {
    return this.db.products;
  }

  async getProduct(id: string) {
    return this.db.products.find(p => p.id === id);
  }

  async saveProduct(product: Product) {
    const i = this.db.products.findIndex(p => p.id === product.id);
    if (i >= 0) this.db.products[i] = product;
    else this.db.products.unshift(product);
    this.persist();
  }

  async removeProduct(id: string) {
    const before = this.db.products.length;
    this.db.products = this.db.products.filter(p => p.id !== id);
    this.persist();
    return this.db.products.length < before;
  }

  async seedProducts(products: Product[]) {
    if (this.db.productsSeeded) return;
    this.db.productsSeeded = true;
    this.db.products = [...products];
    this.persist();
  }

  async saveImage(id: string, mime: string, data: Buffer) {
    this.db.images[id] = { mime, data: data.toString('base64') };
    this.persist();
  }

  async getImage(id: string) {
    const img = this.db.images[id];
    return img ? { mime: img.mime, data: Buffer.from(img.data, 'base64') } : undefined;
  }
}
