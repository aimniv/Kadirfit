import pg from 'pg';
import { DATABASE_SSL_NO_VERIFY, DATABASE_URL } from './config.js';
import { randomToken, sha256 } from './security.js';
import type { AssessmentForm, CheckIn, Coupon, Order, Product } from '../src/types/index.js';
import { normalizeEmail, type PlaceOrderResult, type RateResult, type Store, type StoredUser, type TokenType } from './store.js';

/**
 * PostgreSQL store (Neon, Supabase, any Postgres). Tables are created on first use.
 * Users are kept as a JSONB document next to a unique e-mail column, which keeps the schema
 * in step with the User type and makes concurrent duplicate sign-ups fail on the unique index.
 * Rate-limit counters live in the database too, because serverless instances share no memory.
 */

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS kf_users (
     id text PRIMARY KEY,
     email text NOT NULL UNIQUE,
     data jsonb NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS kf_tokens (
     hash text PRIMARY KEY,
     user_id text NOT NULL,
     type text NOT NULL,
     expires_at timestamptz NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS kf_tokens_user_idx ON kf_tokens (user_id, type)`,
  `CREATE TABLE IF NOT EXISTS kf_rate_limits (
     key text PRIMARY KEY,
     count integer NOT NULL,
     reset_at timestamptz NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS kf_products (
     id text PRIMARY KEY,
     data jsonb NOT NULL,
     created_at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS kf_images (
     id text PRIMARY KEY,
     mime text NOT NULL,
     data bytea NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS kf_meta (key text PRIMARY KEY)`,
  `CREATE TABLE IF NOT EXISTS kf_orders (
     id text PRIMARY KEY,
     order_number text NOT NULL UNIQUE,
     user_id text,
     customer_email text NOT NULL,
     data jsonb NOT NULL,
     created_at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS kf_orders_user_idx ON kf_orders (user_id)`,
  `CREATE INDEX IF NOT EXISTS kf_orders_email_idx ON kf_orders (customer_email)`,
  `CREATE TABLE IF NOT EXISTS kf_coupons (
     id text PRIMARY KEY,
     code text NOT NULL UNIQUE,
     data jsonb NOT NULL,
     created_at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS kf_content (
     key text PRIMARY KEY,
     data jsonb NOT NULL,
     updated_at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS kf_subscribers (
     email text PRIMARY KEY,
     created_at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS kf_assessments (
     id text PRIMARY KEY,
     user_id text NOT NULL,
     user_email text NOT NULL,
     data jsonb NOT NULL,
     created_at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS kf_assessments_user_idx ON kf_assessments (user_id)`,
  `CREATE TABLE IF NOT EXISTS kf_checkins (
     id text PRIMARY KEY,
     user_id text NOT NULL,
     data jsonb NOT NULL,
     created_at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS kf_checkins_user_idx ON kf_checkins (user_id)`
];

const toUser = (row: { data: StoredUser } | undefined) => row?.data;

export class PgStore implements Store {
  private pool = new pg.Pool({
    connectionString: DATABASE_URL,
    // One connection per serverless instance; use the provider's pooled connection string.
    max: 3,
    idleTimeoutMillis: 10_000,
    ssl: DATABASE_SSL_NO_VERIFY ? { rejectUnauthorized: false } : undefined
  });

  async init(): Promise<void> {
    for (const statement of SCHEMA) await this.pool.query(statement);
  }

  async findUserByEmail(email: string) {
    const { rows } = await this.pool.query('SELECT data FROM kf_users WHERE email = $1', [normalizeEmail(email)]);
    return toUser(rows[0]);
  }

  async findUserById(id: string) {
    const { rows } = await this.pool.query('SELECT data FROM kf_users WHERE id = $1', [id]);
    return toUser(rows[0]);
  }

  async insertUser(user: StoredUser) {
    const { rowCount } = await this.pool.query(
      'INSERT INTO kf_users (id, email, data) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [user.id, normalizeEmail(user.email), JSON.stringify(user)]
    );
    return rowCount === 1;
  }

  async updateUser(id: string, patch: Partial<StoredUser>) {
    const { rows } = await this.pool.query(
      'UPDATE kf_users SET data = data || $2::jsonb WHERE id = $1 RETURNING data',
      [id, JSON.stringify(patch)]
    );
    return toUser(rows[0]);
  }

  async removeUser(id: string) {
    await this.pool.query('DELETE FROM kf_tokens WHERE user_id = $1', [id]);
    await this.pool.query('DELETE FROM kf_users WHERE id = $1', [id]);
  }

  async issueToken(userId: string, type: TokenType, ttlMs: number) {
    const raw = randomToken();
    await this.pool.query('DELETE FROM kf_tokens WHERE expires_at < now() OR (user_id = $1 AND type = $2)', [userId, type]);
    await this.pool.query(
      "INSERT INTO kf_tokens (hash, user_id, type, expires_at) VALUES ($1, $2, $3, now() + ($4 || ' milliseconds')::interval)",
      [sha256(raw), userId, type, String(ttlMs)]
    );
    return raw;
  }

  async consumeToken(raw: string, type: TokenType) {
    // A single DELETE ... RETURNING makes "validate and burn" atomic, so a token can't be used twice concurrently.
    const { rows } = await this.pool.query(
      'DELETE FROM kf_tokens WHERE hash = $1 AND type = $2 AND expires_at > now() RETURNING user_id',
      [sha256(raw), type]
    );
    return (rows[0]?.user_id as string | undefined) ?? null;
  }

  async clearTokens(userId: string, type: TokenType) {
    await this.pool.query('DELETE FROM kf_tokens WHERE user_id = $1 AND type = $2', [userId, type]);
  }

  async rateHit(key: string, limit: number, windowMs: number): Promise<RateResult> {
    const { rows } = await this.pool.query(
      `INSERT INTO kf_rate_limits (key, count, reset_at)
       VALUES ($1, 1, now() + ($2 || ' milliseconds')::interval)
       ON CONFLICT (key) DO UPDATE SET
         count = CASE WHEN kf_rate_limits.reset_at <= now() THEN 1 ELSE kf_rate_limits.count + 1 END,
         reset_at = CASE WHEN kf_rate_limits.reset_at <= now() THEN EXCLUDED.reset_at ELSE kf_rate_limits.reset_at END
       RETURNING count, GREATEST(0, CEIL(EXTRACT(EPOCH FROM (reset_at - now()))))::int AS retry`,
      [key, String(windowMs)]
    );
    const { count, retry } = rows[0] as { count: number; retry: number };
    return { limited: count > limit, count, retryAfterSec: retry };
  }

  async rateBlocked(key: string, limit: number) {
    const { rows } = await this.pool.query(
      'SELECT count, GREATEST(0, CEIL(EXTRACT(EPOCH FROM (reset_at - now()))))::int AS retry FROM kf_rate_limits WHERE key = $1 AND reset_at > now()',
      [key]
    );
    if (!rows[0]) return { limited: false, retryAfterSec: 0 };
    return { limited: rows[0].count >= limit, retryAfterSec: rows[0].retry as number };
  }

  async rateReset(key: string) {
    await this.pool.query('DELETE FROM kf_rate_limits WHERE key = $1', [key]);
  }

  async listProducts() {
    const { rows } = await this.pool.query('SELECT data FROM kf_products ORDER BY created_at DESC, id');
    return rows.map(r => r.data as Product);
  }

  async getProduct(id: string) {
    const { rows } = await this.pool.query('SELECT data FROM kf_products WHERE id = $1', [id]);
    return rows[0]?.data as Product | undefined;
  }

  async saveProduct(product: Product) {
    await this.pool.query(
      `INSERT INTO kf_products (id, data) VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
      [product.id, JSON.stringify(product)]
    );
  }

  async removeProduct(id: string) {
    const { rowCount } = await this.pool.query('DELETE FROM kf_products WHERE id = $1', [id]);
    return rowCount === 1;
  }

  async seedProducts(products: Product[]) {
    // The meta row is claimed atomically, so concurrent cold starts seed only once.
    const claimed = await this.pool.query("INSERT INTO kf_meta (key) VALUES ('products_seeded') ON CONFLICT DO NOTHING");
    if (claimed.rowCount !== 1) return;
    // One shared base time, so the starter catalogue keeps its original order (the list is newest-first).
    const base = Date.now();
    for (const [i, product] of products.entries()) {
      await this.pool.query(
        'INSERT INTO kf_products (id, data, created_at) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [product.id, JSON.stringify(product), new Date(base - i * 1000)]
      );
    }
  }

  async saveImage(id: string, mime: string, data: Buffer) {
    await this.pool.query('INSERT INTO kf_images (id, mime, data) VALUES ($1, $2, $3)', [id, mime, data]);
  }

  async getImage(id: string) {
    const { rows } = await this.pool.query('SELECT mime, data FROM kf_images WHERE id = $1', [id]);
    return rows[0] ? { mime: rows[0].mime as string, data: rows[0].data as Buffer } : undefined;
  }

  async adjustStock(productId: string, delta: number) {
    await this.pool.query(
      `UPDATE kf_products SET data = jsonb_set(data, '{stock}', to_jsonb(GREATEST(0, (data->>'stock')::int + $2::int))) WHERE id = $1`,
      [productId, delta]
    );
  }

  async listOrders() {
    const { rows } = await this.pool.query('SELECT data FROM kf_orders ORDER BY created_at DESC');
    return rows.map(r => r.data as Order);
  }

  async listOrdersForCustomer(userId: string, email: string) {
    const { rows } = await this.pool.query(
      'SELECT data FROM kf_orders WHERE user_id = $1 OR customer_email = $2 ORDER BY created_at DESC',
      [userId, normalizeEmail(email)]
    );
    return rows.map(r => r.data as Order);
  }

  async getOrder(id: string) {
    const { rows } = await this.pool.query('SELECT data FROM kf_orders WHERE id = $1', [id]);
    return rows[0]?.data as Order | undefined;
  }

  async updateOrder(id: string, patch: Partial<Order>) {
    const { rows } = await this.pool.query('UPDATE kf_orders SET data = data || $2::jsonb WHERE id = $1 RETURNING data', [
      id,
      JSON.stringify(patch)
    ]);
    return rows[0]?.data as Order | undefined;
  }

  async placeOrder(order: Order, stock: Array<{ productId: string; quantity: number }>, couponId?: string): Promise<PlaceOrderResult> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      // Lock products in a fixed order so two carts with the same items can't deadlock each other.
      for (const { productId, quantity } of [...stock].sort((a, b) => a.productId.localeCompare(b.productId))) {
        const r = await client.query(
          `UPDATE kf_products SET data = jsonb_set(data, '{stock}', to_jsonb((data->>'stock')::int - $2::int))
           WHERE id = $1 AND (data->>'stock')::int >= $2::int`,
          [productId, quantity]
        );
        if (r.rowCount !== 1) {
          await client.query('ROLLBACK');
          return { ok: false, reason: 'stock', productId };
        }
      }
      if (couponId) {
        const r = await client.query(
          `UPDATE kf_coupons SET data = jsonb_set(data, '{usageCount}', to_jsonb((data->>'usageCount')::int + 1))
           WHERE id = $1 AND (data->>'isActive')::boolean AND (data->>'usageCount')::int < (data->>'usageLimit')::int`,
          [couponId]
        );
        if (r.rowCount !== 1) {
          await client.query('ROLLBACK');
          return { ok: false, reason: 'coupon' };
        }
      }
      await client.query(
        'INSERT INTO kf_orders (id, order_number, user_id, customer_email, data) VALUES ($1, $2, $3, $4, $5)',
        [order.id, order.orderNumber, order.userId ?? null, normalizeEmail(order.customerEmail), JSON.stringify(order)]
      );
      await client.query('COMMIT');
      return { ok: true };
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      if ((err as { code?: string }).code === '23505') return { ok: false, reason: 'number' }; // order number collision
      throw err;
    } finally {
      client.release();
    }
  }

  async listCoupons() {
    const { rows } = await this.pool.query('SELECT data FROM kf_coupons ORDER BY created_at DESC');
    return rows.map(r => r.data as Coupon);
  }

  async getCouponByCode(code: string) {
    const { rows } = await this.pool.query('SELECT data FROM kf_coupons WHERE code = $1', [code.toUpperCase()]);
    return rows[0]?.data as Coupon | undefined;
  }

  async getCoupon(id: string) {
    const { rows } = await this.pool.query('SELECT data FROM kf_coupons WHERE id = $1', [id]);
    return rows[0]?.data as Coupon | undefined;
  }

  async insertCoupon(coupon: Coupon) {
    const { rowCount } = await this.pool.query(
      'INSERT INTO kf_coupons (id, code, data) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [coupon.id, coupon.code.toUpperCase(), JSON.stringify(coupon)]
    );
    return rowCount === 1;
  }

  async updateCoupon(id: string, patch: Partial<Coupon>) {
    const { rows } = await this.pool.query('UPDATE kf_coupons SET data = data || $2::jsonb WHERE id = $1 RETURNING data', [
      id,
      JSON.stringify(patch)
    ]);
    return rows[0]?.data as Coupon | undefined;
  }

  async removeCoupon(id: string) {
    const { rowCount } = await this.pool.query('DELETE FROM kf_coupons WHERE id = $1', [id]);
    return rowCount === 1;
  }

  async seedCoupons(coupons: Coupon[]) {
    const claimed = await this.pool.query("INSERT INTO kf_meta (key) VALUES ('coupons_seeded') ON CONFLICT DO NOTHING");
    if (claimed.rowCount !== 1) return;
    for (const c of coupons) await this.insertCoupon(c);
  }

  async getContent(key: string) {
    const { rows } = await this.pool.query('SELECT data FROM kf_content WHERE key = $1', [key]);
    return rows[0]?.data as unknown;
  }

  async setContent(key: string, data: unknown) {
    await this.pool.query(
      `INSERT INTO kf_content (key, data) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      [key, JSON.stringify(data)]
    );
  }

  async listContent() {
    const { rows } = await this.pool.query('SELECT key, data FROM kf_content');
    return Object.fromEntries(rows.map(r => [r.key as string, r.data as unknown]));
  }

  async addSubscriber(email: string) {
    const { rowCount } = await this.pool.query('INSERT INTO kf_subscribers (email) VALUES ($1) ON CONFLICT DO NOTHING', [normalizeEmail(email)]);
    return rowCount === 1;
  }

  async listSubscribers() {
    const { rows } = await this.pool.query('SELECT email FROM kf_subscribers ORDER BY created_at DESC');
    return rows.map(r => r.email as string);
  }

  async listUsers() {
    const { rows } = await this.pool.query("SELECT data FROM kf_users ORDER BY data->>'createdAt' DESC");
    return rows.map(r => r.data as StoredUser);
  }

  async saveAssessment(a: AssessmentForm) {
    await this.pool.query(
      `INSERT INTO kf_assessments (id, user_id, user_email, data) VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
      [a.id, a.userId, normalizeEmail(a.userEmail || ''), JSON.stringify(a)]
    );
  }

  async getAssessment(id: string) {
    const { rows } = await this.pool.query('SELECT data FROM kf_assessments WHERE id = $1', [id]);
    return rows[0]?.data as AssessmentForm | undefined;
  }

  async updateAssessment(id: string, patch: Partial<AssessmentForm>) {
    const { rows } = await this.pool.query('UPDATE kf_assessments SET data = data || $2::jsonb WHERE id = $1 RETURNING data', [id, JSON.stringify(patch)]);
    return rows[0]?.data as AssessmentForm | undefined;
  }

  async listAssessments() {
    const { rows } = await this.pool.query('SELECT data FROM kf_assessments ORDER BY created_at DESC');
    return rows.map(r => r.data as AssessmentForm);
  }

  async listAssessmentsFor(userId: string, email: string) {
    const { rows } = await this.pool.query(
      'SELECT data FROM kf_assessments WHERE user_id = $1 OR user_email = $2 ORDER BY created_at DESC',
      [userId, normalizeEmail(email)]
    );
    return rows.map(r => r.data as AssessmentForm);
  }

  async saveCheckIn(c: CheckIn) {
    await this.pool.query(
      `INSERT INTO kf_checkins (id, user_id, data) VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
      [c.id, c.userId, JSON.stringify(c)]
    );
  }

  async getCheckIn(id: string) {
    const { rows } = await this.pool.query('SELECT data FROM kf_checkins WHERE id = $1', [id]);
    return rows[0]?.data as CheckIn | undefined;
  }

  async updateCheckIn(id: string, patch: Partial<CheckIn>) {
    const { rows } = await this.pool.query('UPDATE kf_checkins SET data = data || $2::jsonb WHERE id = $1 RETURNING data', [id, JSON.stringify(patch)]);
    return rows[0]?.data as CheckIn | undefined;
  }

  async listCheckIns() {
    const { rows } = await this.pool.query('SELECT data FROM kf_checkins ORDER BY created_at DESC');
    return rows.map(r => r.data as CheckIn);
  }

  async listCheckInsFor(userId: string) {
    const { rows } = await this.pool.query('SELECT data FROM kf_checkins WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return rows.map(r => r.data as CheckIn);
  }
}
