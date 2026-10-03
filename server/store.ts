import type { AssessmentForm, CheckIn, Coupon, Order, Product, User } from '../src/types/index.js';
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

  /** Products, newest first. */
  listProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  /** Insert or replace. New ids are listed first. */
  saveProduct(product: Product): Promise<void>;
  removeProduct(id: string): Promise<boolean>;
  /** Loads the starter catalogue exactly once per database, so deleting every product later doesn't bring them back. */
  seedProducts(products: Product[]): Promise<void>;
  saveImage(id: string, mime: string, data: Buffer): Promise<void>;
  getImage(id: string): Promise<{ mime: string; data: Buffer } | undefined>;
  /** Adds `delta` (may be negative) to a product's stock, never below zero. */
  adjustStock(productId: string, delta: number): Promise<void>;

  /** Newest first. */
  listOrders(): Promise<Order[]>;
  listOrdersForCustomer(userId: string, email: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  updateOrder(id: string, patch: Partial<Order>): Promise<Order | undefined>;
  /**
   * Places an order as one all-or-nothing step: reserves stock, counts the coupon use, saves the order.
   * Fails (and changes nothing) when stock or the coupon allowance ran out in the meantime.
   */
  placeOrder(order: Order, stock: Array<{ productId: string; quantity: number }>, couponId?: string): Promise<PlaceOrderResult>;

  listCoupons(): Promise<Coupon[]>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  getCoupon(id: string): Promise<Coupon | undefined>;
  /** Returns false when the code already exists. */
  insertCoupon(coupon: Coupon): Promise<boolean>;
  updateCoupon(id: string, patch: Partial<Coupon>): Promise<Coupon | undefined>;
  removeCoupon(id: string): Promise<boolean>;
  /** Loads starter coupons once per database. */
  seedCoupons(coupons: Coupon[]): Promise<void>;

  /** Site content the owner edits in the admin panel (settings, blog, testimonials...), one JSON document per key. */
  getContent(key: string): Promise<unknown | undefined>;
  setContent(key: string, data: unknown): Promise<void>;
  listContent(): Promise<Record<string, unknown>>;

  /** Returns false when the address was already subscribed. */
  addSubscriber(email: string): Promise<boolean>;
  listSubscribers(): Promise<string[]>;

  listUsers(): Promise<StoredUser[]>;

  saveAssessment(a: AssessmentForm): Promise<void>;
  getAssessment(id: string): Promise<AssessmentForm | undefined>;
  updateAssessment(id: string, patch: Partial<AssessmentForm>): Promise<AssessmentForm | undefined>;
  listAssessments(): Promise<AssessmentForm[]>;
  listAssessmentsFor(userId: string, email: string): Promise<AssessmentForm[]>;

  saveCheckIn(c: CheckIn): Promise<void>;
  getCheckIn(id: string): Promise<CheckIn | undefined>;
  updateCheckIn(id: string, patch: Partial<CheckIn>): Promise<CheckIn | undefined>;
  listCheckIns(): Promise<CheckIn[]>;
  listCheckInsFor(userId: string): Promise<CheckIn[]>;
}

export type PlaceOrderResult =
  | { ok: true }
  | { ok: false; reason: 'stock'; productId: string }
  | { ok: false; reason: 'coupon' }
  | { ok: false; reason: 'number' };

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

let ready: Promise<Store> | null = null;

/** The active store: PostgreSQL when DATABASE_URL is set, otherwise a JSON file (local development only). */
export function getStore(): Promise<Store> {
  ready ??= (async () => {
    const store: Store = DATABASE_URL
      ? new (await import('./store-pg.js')).PgStore()
      : new (await import('./store-json.js')).JsonStore();
    await store.init();
    const seed = await import('./seed.js');
    await seed.seedUsers(store);
    await seed.seedCatalogue(store);
    await seed.seedCoupons(store);
    return store;
  })().catch(err => {
    ready = null; // let the next request retry instead of caching a failure
    throw err;
  });
  return ready;
}
