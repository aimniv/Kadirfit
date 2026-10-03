import type { User } from '../src/types/index.js';
import { DATABASE_URL } from './config.js';

export interface StoredUser extends User {
  passwordHash: string;
  sessionVersion: number;
}

export type TokenType = 'verify' | 'reset';

export interface RateResult {
  limited: boolean;
  count: number;
  retryAfterSec: number;
}

/** Everything the auth routes need from persistence. Two backends: PostgreSQL and a local JSON file. */
export interface Store {
  /** Create tables / load data. Called (and awaited) once before first use. */
  init(): Promise<void>;
  findUserByEmail(email: string): Promise<StoredUser | undefined>;
  findUserById(id: string): Promise<StoredUser | undefined>;
  /** Returns false when the e-mail address is already registered. */
  insertUser(user: StoredUser): Promise<boolean>;
  updateUser(id: string, patch: Partial<StoredUser>): Promise<StoredUser | undefined>;
  removeUser(id: string): Promise<void>;
  /** Issues a fresh single-use token, replacing any earlier token of the same type for that user. */
  issueToken(userId: string, type: TokenType, ttlMs: number): Promise<string>;
  /** Validates and burns a token; returns the owning user id. */
  consumeToken(raw: string, type: TokenType): Promise<string | null>;
  clearTokens(userId: string, type: TokenType): Promise<void>;
  /** Counts one hit in a fixed window; `limited` once the count exceeds `limit`. */
  rateHit(key: string, limit: number, windowMs: number): Promise<RateResult>;
  /** Read-only: is `key` already at or over `limit`? */
  rateBlocked(key: string, limit: number): Promise<{ limited: boolean; retryAfterSec: number }>;
  rateReset(key: string): Promise<void>;
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

let ready: Promise<Store> | null = null;

/** The active store: PostgreSQL when DATABASE_URL is set, otherwise a JSON file (local development only). */
export function getStore(): Promise<Store> {
  ready ??= (async () => {
    const store: Store = DATABASE_URL
      ? new (await import('./store-pg.js')).PgStore()
      : new (await import('./store-json.js')).JsonStore();
    await store.init();
    await (await import('./seed.js')).seedUsers(store);
    return store;
  })().catch(err => {
    ready = null; // let the next request retry instead of caching a failure
    throw err;
  });
  return ready;
}
