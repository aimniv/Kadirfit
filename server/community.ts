import { randomUUID } from 'node:crypto';
import express from 'express';
import type { AssessmentForm, CheckIn } from '../src/types/index.js';
import { sessionUser } from './auth.js';
import { clientIp, fail, jsonErrors, text, wrap } from './http.js';
import type { Store } from './store.js';

const HOUR = 60 * 60 * 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const COACH_ROLES = new Set(['SUPER_ADMIN']);
const LIST_ROLES = new Set(['SUPER_ADMIN', 'EDITOR']);

const oneOf = <T extends string>(v: unknown, options: readonly T[]): T | null => (options.includes(v as T) ? (v as T) : null);
const inRange = (v: unknown, min: number, max: number): number | null => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
};

async function requireRole(req: express.Request, res: express.Response, db: Store, roles: Set<string>) {
  const user = await sessionUser(req, db);
  if (!user) {
    fail(res, 401, 'Oturum açmanız gerekiyor.');
    return null;
  }
  if (!roles.has(user.role)) {
    fail(res, 403, 'Bu işlem için yetkiniz yok.');
    return null;
  }
  return user;
}

// ---- newsletter -----------------------------------------------------------------

export const newsletterRouter = express.Router();
newsletterRouter.use(express.json({ limit: '4kb' }));

newsletterRouter.post('/', wrap(async (req, res, db) => {
  const ip = await db.rateHit(`news-ip:${clientIp(req)}`, 10, HOUR);
  if (ip.limited) return fail(res, 429, 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.');
  const email = text(req.body?.email, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) return fail(res, 400, 'Lütfen geçerli bir e-posta adresi giriniz.');
  if (!(await db.addSubscriber(email))) return fail(res, 409, 'Bu e-posta adresi bültenimize zaten kayıtlıdır.');
  res.status(201).json({ success: true, message: 'Tebrikler! Bültenimize başarıyla kaydoldunuz.' });
}));

newsletterRouter.get('/', wrap(async (req, res, db) => {
  if (!(await requireRole(req, res, db, LIST_ROLES))) return;
  res.json({ subscribers: await db.listSubscribers() });
}));
newsletterRouter.use(jsonErrors('newsletter'));

// ---- pre-assessment forms -------------------------------------------------------

export const assessmentsRouter = express.Router();
assessmentsRouter.use(express.json({ limit: '16kb' }));

assessmentsRouter.post('/', wrap(async (req, res, db) => {
  const ip = await db.rateHit(`assess-ip:${clientIp(req)}`, 10, HOUR);
  if (ip.limited) return fail(res, 429, 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.');
  const b = req.body ?? {};
  const email = text(b.userEmail, 254).toLowerCase();
  const fullName = text(b.fullName, 120);
  const age = inRange(b.age, 12, 100);
  const height = inRange(b.height, 100, 250);
  const weight = inRange(b.weight, 25, 400);
  const targetWeight = inRange(b.targetWeight, 25, 400);
  const days = inRange(b.trainingDaysPerWeek, 1, 7);
  const gender = oneOf(b.gender, ['erkek', 'kadin', 'diger'] as const);
  const goal = oneOf(b.primaryGoal, ['kilo_verme', 'kas_kazanimi', 'yag_yakimi', 'kondisyon', 'yarisma_hazirligi'] as const);
  const level = oneOf(b.experienceLevel, ['baslangic', 'orta', 'ileri', 'yarisici'] as const);
  const place = oneOf(b.gymOrHome, ['salon', 'ev'] as const);
  const activity = oneOf(b.dailyActivityLevel, ['dusuk', 'orta', 'yuksek'] as const);
  if (!fullName || !EMAIL_RE.test(email)) return fail(res, 400, 'Lütfen ad soyad ve geçerli bir e-posta giriniz.');
  if ([age, height, weight, targetWeight, days].includes(null) || !gender || !goal || !level || !place || !activity) {
    return fail(res, 400, 'Formdaki bazı alanlar geçersiz. Lütfen kontrol ediniz.');
  }

  const user = await sessionUser(req, db);
  const form: AssessmentForm = {
    id: `asmt-${randomUUID()}`,
    userId: user?.id ?? `guest-${randomUUID()}`,
    userEmail: email,
    fullName,
    age: age!, gender, height: height!, weight: weight!, targetWeight: targetWeight!,
    primaryGoal: goal, experienceLevel: level, trainingDaysPerWeek: days!, gymOrHome: place,
    injuriesOrHealthIssues: text(b.injuriesOrHealthIssues, 1000),
    dietaryRestrictions: text(b.dietaryRestrictions, 1000),
    dailyActivityLevel: activity,
    submittedAt: new Date().toISOString(),
    reviewedByCoach: false
  };
  await db.saveAssessment(form);
  res.status(201).json({ success: true, assessment: form });
}));

assessmentsRouter.get('/', wrap(async (req, res, db) => {
  const user = await sessionUser(req, db);
  if (!user) return fail(res, 401, 'Oturum açmanız gerekiyor.');
  res.json({ assessments: COACH_ROLES.has(user.role) ? await db.listAssessments() : await db.listAssessmentsFor(user.id, user.email) });
}));

assessmentsRouter.patch('/:id', wrap(async (req, res, db) => {
  if (!(await requireRole(req, res, db, COACH_ROLES))) return;
  const feedback = text(req.body?.coachFeedback, 4000);
  if (!feedback) return fail(res, 400, 'Geri bildirim boş olamaz.');
  const updated = await db.updateAssessment(req.params.id, { coachFeedback: feedback, reviewedByCoach: true });
  if (!updated) return fail(res, 404, 'Form bulunamadı.');
  res.json({ success: true, assessment: updated });
}));
assessmentsRouter.use(jsonErrors('assessments'));

// ---- weekly check-ins -----------------------------------------------------------

export const checkInsRouter = express.Router();
checkInsRouter.use(express.json({ limit: '16kb' }));

checkInsRouter.post('/', wrap(async (req, res, db) => {
  const user = await sessionUser(req, db);
  if (!user) return fail(res, 401, 'Oturum açmanız gerekiyor.');
  const b = req.body ?? {};
  const weight = inRange(b.weight, 20, 400);
  const energy = inRange(b.energyLevelRating, 1, 5);
  const sleep = inRange(b.sleepQualityRating, 1, 5);
  const diet = inRange(b.dietAdherenceRating, 1, 5);
  if (weight === null || energy === null || sleep === null || diet === null) {
    return fail(res, 400, 'Kilo ve puanlar geçerli aralıkta olmalıdır.');
  }
  const optional = (v: unknown) => (v === undefined || v === null || v === '' ? undefined : inRange(v, 10, 300) ?? NaN);
  const [chest, waist, arm, hips] = [b.chestCm, b.waistCm, b.armCm, b.hipsCm].map(optional);
  if ([chest, waist, arm, hips].some(v => Number.isNaN(v))) return fail(res, 400, 'Ölçü değerleri geçersiz.');

  const previous = await db.listCheckInsFor(user.id);
  const checkIn: CheckIn = {
    id: `chk-${randomUUID()}`,
    userId: user.id,
    weekNumber: previous.length + 1,
    date: new Date().toISOString().slice(0, 10),
    weight,
    chestCm: chest, waistCm: waist, armCm: arm, hipsCm: hips,
    energyLevelRating: Math.round(energy), sleepQualityRating: Math.round(sleep), dietAdherenceRating: Math.round(diet),
    clientNotes: text(b.clientNotes, 1000)
  };
  await db.saveCheckIn(checkIn);
  res.status(201).json({ success: true, checkIn });
}));

checkInsRouter.get('/', wrap(async (req, res, db) => {
  const user = await sessionUser(req, db);
  if (!user) return fail(res, 401, 'Oturum açmanız gerekiyor.');
  res.json({ checkIns: COACH_ROLES.has(user.role) ? await db.listCheckIns() : await db.listCheckInsFor(user.id) });
}));

checkInsRouter.patch('/:id', wrap(async (req, res, db) => {
  if (!(await requireRole(req, res, db, COACH_ROLES))) return;
  const notes = text(req.body?.coachNotes, 4000);
  if (!notes) return fail(res, 400, 'Not boş olamaz.');
  const updated = await db.updateCheckIn(req.params.id, { coachNotes: notes, coachReviewedAt: new Date().toISOString() });
  if (!updated) return fail(res, 404, 'Check-in bulunamadı.');
  res.json({ success: true, checkIn: updated });
}));
checkInsRouter.use(jsonErrors('checkins'));
