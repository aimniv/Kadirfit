import { SEED_DEMO_USERS, isProd } from './config.js';
import { hashPassword } from './security.js';
import { INITIAL_COUPONS, INITIAL_PRODUCTS } from '../src/data/initialData.js';
import type { Store, StoredUser } from './store.js';

// Same ids/profiles as src/data/initialData.ts so demo orders, assessments and check-ins keep matching.
const DEMO_USERS: Array<Omit<StoredUser, 'passwordHash' | 'sessionVersion'> & { password: string }> = [
  {
    id: 'user-admin-1',
    firstName: 'Kadir',
    lastName: 'Arslan',
    email: 'admin@kadirfit.com',
    password: 'Admin123!',
    phone: '+905321234567',
    role: 'SUPER_ADMIN',
    createdAt: '2024-01-10T10:00:00Z',
    emailVerified: true,
    suspended: false,
    avatarUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80',
    marketingConsent: true
  },
  {
    id: 'user-demo-1',
    firstName: 'Emre',
    lastName: 'Demir',
    email: 'kullanici@kadirfit.com',
    password: 'Kullanici123!',
    phone: '+905449876543',
    role: 'USER',
    createdAt: '2024-08-15T14:30:00Z',
    emailVerified: true,
    suspended: false,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    activeCoachingPackageId: 'pkg-donusum',
    coachingStartDate: '2026-08-01',
    coachingEndDate: '2026-11-01',
    marketingConsent: true
  }
];

export async function seedUsers(store: Store): Promise<void> {
  if (SEED_DEMO_USERS) {
    for (const { password, ...profile } of DEMO_USERS) {
      if (await store.findUserByEmail(profile.email)) continue;
      await store.insertUser({ ...profile, passwordHash: await hashPassword(password), sessionVersion: 0 });
      console.log(`[seed] Demo account created: ${profile.email}`);
    }
  }

  // Production: bootstrap the first super admin from the environment.
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword && !(await store.findUserByEmail(adminEmail))) {
    await store.insertUser({
      id: `user-admin-${Date.now()}`,
      firstName: process.env.ADMIN_FIRST_NAME || 'Kadir',
      lastName: process.env.ADMIN_LAST_NAME || 'Arslan',
      email: adminEmail.trim().toLowerCase(),
      phone: '',
      role: 'SUPER_ADMIN',
      createdAt: new Date().toISOString(),
      emailVerified: true,
      suspended: false,
      marketingConsent: false,
      passwordHash: await hashPassword(adminPassword),
      sessionVersion: 0
    });
    console.log(`[seed] Super admin created: ${adminEmail}`);
  } else if (isProd && !SEED_DEMO_USERS && !adminEmail) {
    console.warn('[seed] No ADMIN_EMAIL/ADMIN_PASSWORD set — set them once to create the first admin account.');
  }
}

/** First run only: load the starter catalogue so the shop isn't empty. */
export async function seedCatalogue(store: Store): Promise<void> {
  await store.seedProducts(INITIAL_PRODUCTS);
}

/**
 * First run only. The sample codes come in switched off with a zeroed counter, so a new store never
 * has public discount codes running until the owner decides to turn them on.
 */
export async function seedCoupons(store: Store): Promise<void> {
  await store.seedCoupons(INITIAL_COUPONS.map(c => ({ ...c, usageCount: 0, isActive: false })));
}
