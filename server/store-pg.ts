import pg from 'pg';
import { DATABASE_SSL_NO_VERIFY, DATABASE_URL } from './config.js';
import { randomToken, sha256 } from './security.js';
import { normalizeEmail, type RateResult, type Store, type StoredUser, type TokenType } from './store.js';

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
   )`
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
}
