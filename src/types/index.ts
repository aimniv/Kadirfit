export type Role = 'USER' | 'EDITOR' | 'ORDER_MANAGER' | 'SUPER_ADMIN';

export type Language = 'tr' | 'en' | 'ar';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: string;
  emailVerified: boolean;
  suspended: boolean;
  avatarUrl?: string;
  activeCoachingPackageId?: string;
  coachingStartDate?: string;
  coachingEndDate?: string;
  marketingConsent?: boolean;
}

export type ProductCategory = 'clothing' | 'supplements' | 'accessories';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "S / Siyah" or "2000g / Çikolata"
  type: 'size' | 'color' | 'flavor' | 'weight';
  value: string;
  stock: number;
  priceModifier?: number;
}

export interface NutritionFacts {
  servingSize: string;
  servingsPerContainer: number;
  energyKcal: number;
  protein: number; // grams
  carbohydrates: number; // grams
  sugar: number; // grams
  fat: number; // grams
  saturatedFat: number; // grams
  bcaa?: number; // grams
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  isVerifiedBuyer: boolean;
  approved: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  discountedPrice?: number;
  sku: string;
  images: string[];
  description: string;
  shortDescription: string;
  features: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  brand: string;
  tags: string[];
  // Apparel specific
  sizes?: string[];
  colors?: string[];
  sizeChartUrl?: string;
  // Supplement specific
  flavors?: string[];
  weights?: string[];
  nutritionFacts?: NutritionFacts;
  usageInstructions?: string;
  supplementWarning?: string;
  variants?: ProductVariant[];
  reviews?: ProductReview[];
}

export interface CoachingPackage {
  id: string;
  name: string;
  tagline: string;
  slug: string;
  isPopular?: boolean;
  isElite?: boolean;
  durations: {
    months: 1 | 3 | 6;
    price: number;
    discountPercent?: number;
    monthlyPriceEquivalent: number;
  }[];
  features: string[];
  suitableFor: string;
  badge?: string;
}

export interface CartItem {
  id: string; // unique item cart row id
  productId: string;
  isCoachingPackage?: boolean;
  coachingDurationMonths?: 1 | 3 | 6;
  title: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedFlavor?: string;
  selectedWeight?: string;
}

export type OrderStatus = 'Beklemede' | 'Hazırlanıyor' | 'Kargoda' | 'Teslim Edildi' | 'İptal / İade';

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  selectedVariantText?: string;
  image: string;
  isCoaching?: boolean;
}

export interface Address {
  id: string;
  title: string; // "Evim", "İş Yeri"
  fullName: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
  postalCode?: string;
  isCorporate?: boolean;
  taxNumber?: string;
  taxOffice?: string;
  companyName?: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingFee: number;
  /** Cash-on-delivery collection fee, when applicable. */
  paymentFee?: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash_on_delivery';
  paymentStatus: 'paid' | 'pending';
  cargoCompany?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
  notes?: string;
  returnRequested?: boolean;
  returnReason?: string;
}

export interface AssessmentForm {
  id: string;
  userId: string;
  userEmail: string;
  fullName: string;
  age: number;
  gender: 'erkek' | 'kadin' | 'diger';
  height: number; // cm
  weight: number; // kg
  targetWeight: number; // kg
  primaryGoal: 'kilo_verme' | 'kas_kazanimi' | 'yag_yakimi' | 'kondisyon' | 'yarisma_hazirligi';
  experienceLevel: 'baslangic' | 'orta' | 'ileri' | 'yarisici';
  trainingDaysPerWeek: number;
  gymOrHome: 'salon' | 'ev';
  injuriesOrHealthIssues: string;
  dietaryRestrictions: string;
  dailyActivityLevel: 'dusuk' | 'orta' | 'yuksek';
  submittedAt: string;
  reviewedByCoach: boolean;
  coachFeedback?: string;
}

export interface CheckIn {
  id: string;
  userId: string;
  weekNumber: number;
  date: string;
  weight: number;
  chestCm?: number;
  waistCm?: number;
  armCm?: number;
  hipsCm?: number;
  frontPhotoUrl?: string;
  backPhotoUrl?: string;
  sidePhotoUrl?: string;
  energyLevelRating: number; // 1-5
  sleepQualityRating: number; // 1-5
  dietAdherenceRating: number; // 1-5
  clientNotes: string;
  coachNotes?: string;
  coachReviewedAt?: string;
}

export interface TransformationStory {
  id: string;
  studentName: string;
  age: number;
  durationWeeks: number;
  weightChange: string; // e.g. "-16 kg" or "+8 kg kas"
  beforeImg: string;
  afterImg: string;
  quote: string;
  category: 'kilo_verme' | 'kas_kazanimi' | 'yarisma';
  approved: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  roleOrCity: string;
  rating: number;
  comment: string;
  avatarUrl: string;
  programType: string;
  verified: boolean;
  approved: boolean;
}

export interface FaqItem {
  id: string;
  category: 'kocluk' | 'siparis' | 'antrenman' | 'odeme';
  question: string;
  answer: string;
  order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  publishDate: string;
  author: string;
  coverImage: string;
  excerpt: string;
  content: string;
  published: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // 10% or 150 TL
  minCartAmount: number;
  expiresAt: string;
  usageCount: number;
  usageLimit: number;
  isActive: boolean;
}

export interface CMSSection {
  id: string;
  key: string;
  name: string;
  enabled: boolean;
  order: number;
}

export interface SiteSettings {
  brandName: string;
  slogan: string;
  accentColor: string;
  logoText: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  heroBgImage: string;
  statsStudents: number;
  statsExperienceYears: number;
  statsSatisfactionRate: number;
  coachBioTitle: string;
  coachBioText: string;
  coachPortraitUrl: string;
  coachCertificates: string[];
  contactEmail: string;
  contactPhone: string;
  contactWhatsApp: string;
  contactAddress: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  paymentGatewayIyzico: boolean;
  paymentGatewayPayTR: boolean;
  paymentGatewayBankTransfer: boolean;
  paymentGatewayCashOnDelivery: boolean;
  bankIbanGaranti: string;
  bankIbanZiraat: string;
  maintenanceMode: boolean;
  // Legal texts (editable)
  kvkkText: string;
  distanceSalesContractText: string;
  preInformationFormText: string;
  cookiePolicyText: string;
  membershipAgreementText: string;
  returnPolicyText: string;
}
