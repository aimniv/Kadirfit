import fs from 'node:fs';
import path from 'node:path';
import type { User } from '../src/types';
import { DATA_DIR } from './config';
import { randomToken, sha256 } from './security';

/**
 * Minimal JSON-file persistence for accounts and one-time tokens.
 * Fine for a single instance; swap this module for a real database (DATABASE_URL)
 * before running several instances or on an ephemeral filesystem.
 */

export interface StoredUser extends User {
  passwordHash: string;
  sessionVersion: number;
}

export type TokenType = 'verify' | 'reset';

interface StoredToken {
  hash: string;
  userId: string;
  type: TokenType;
  expiresAt: number;
}

interface Db {
  users: StoredUser[];
  tokens: StoredToken[];
}

const DB_FILE = path.join(DATA_DIR, 'auth.json');

function load(): Db {
  try {
    const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) as Partial<Db>;
    return { users: parsed.users ?? [], tokens: parsed.tokens ?? [] };
  } catch {
    return { users: [], tokens: [] };
  }
}

const db: Db = load();

function persist(): void {
  const now = Date.now();
  db.tokens = db.tokens.filter(t => t.expiresAt > now);
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${DB_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), { mode: 0o600 });
  fs.renameSync(tmp, DB_FILE);
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function findUserByEmail(email: string): StoredUser | undefined {
  const needle = normalizeEmail(email);
  return db.users.find(u => u.email.toLowerCase() === needle);
}

export function findUserById(id: string): StoredUser | undefined {
  return db.users.find(u => u.id === id);
}

export function insertUser(user: StoredUser): void {
  db.users.push(user);
  persist();
}

export function updateUser(id: string, patch: Partial<StoredUser>): StoredUser | undefined {
  const user = findUserById(id);
  if (!user) return undefined;
  Object.assign(user, patch);
  persist();
  return user;
}

export function removeUser(id: string): void {
  db.users = db.users.filter(u => u.id !== id);
  db.tokens = db.tokens.filter(t => t.userId !== id);
  persist();
}

export function userCount(): number {
  return db.users.length;
}

/** Issues a fresh single-use token, replacing any earlier token of the same type for that user. */
export function issueToken(userId: string, type: TokenType, ttlMs: number): string {
  const raw = randomToken();
  db.tokens = db.tokens.filter(t => !(t.userId === userId && t.type === type));
  db.tokens.push({ hash: sha256(raw), userId, type, expiresAt: Date.now() + ttlMs });
  persist();
  return raw;
}

/** Validates a token without using it up. */
export function peekToken(raw: string, type: TokenType): string | null {
  const hash = sha256(raw);
  const found = db.tokens.find(t => t.hash === hash && t.type === type && t.expiresAt > Date.now());
  return found ? found.userId : null;
}

/** Validates and burns a token; returns the owning user id. */
export function consumeToken(raw: string, type: TokenType): string | null {
  const userId = peekToken(raw, type);
  if (!userId) return null;
  const hash = sha256(raw);
  db.tokens = db.tokens.filter(t => t.hash !== hash);
  persist();
  return userId;
}

export function clearTokens(userId: string, type: TokenType): void {
  db.tokens = db.tokens.filter(t => !(t.userId === userId && t.type === type));
  persist();
}
