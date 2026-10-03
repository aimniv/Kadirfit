import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Product,
  CoachingPackage,
  CartItem,
  Order,
  OrderStatus,
  AssessmentForm,
  CheckIn,
  TransformationStory,
  Testimonial,
  BlogPost,
  Coupon,
  CMSSection,
  SiteSettings,
  Language
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_CMS_SECTIONS,
  INITIAL_USERS,
  INITIAL_COACHING_PACKAGES,
  INITIAL_PRODUCTS,
  INITIAL_TRANSFORMATIONS,
  INITIAL_TESTIMONIALS,
  INITIAL_BLOG_POSTS,
  INITIAL_COUPONS,
  INITIAL_ORDERS
} from '../data/initialData';
import { authApi, AuthResult } from '../lib/authApi';
import { productsApi, ProductResult } from '../lib/productsApi';
import { useDialog } from './DialogContext';

export type AuthTab = 'login' | 'register' | 'forgot' | 'reset';

export interface AuthModalOptions {
  /** Single-use token from a password-reset e-mail link. */
  resetToken?: string;
  /** Message shown at the top of the modal, e.g. the result of an e-mail verification. */
  notice?: { text: string; error: boolean };
}

interface AppContextType {
  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText: string) => string;

  // Settings & CMS
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  cmsSections: CMSSection[];
  updateCmsSections: (sections: CMSSection[]) => void;
  toggleCmsSection: (id: string) => void;
  reorderCmsSection: (fromIndex: number, toIndex: number) => void;

  // Auth & Users
  currentUser: User | null;
  users: User[];
  login: (email: string, pass: string, remember?: boolean) => Promise<AuthResult>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    marketingConsent: boolean;
    kvkkAccepted: boolean;
    termsAccepted: boolean;
  }) => Promise<AuthResult>;
  logout: () => void;
  resendVerification: (email: string) => Promise<AuthResult>;
  forgotPassword: (email: string) => Promise<AuthResult>;
  resetPassword: (token: string, password: string) => Promise<AuthResult>;
  updateProfile: (data: Partial<User>) => Promise<AuthResult>;
  updateUserStatus: (userId: string, suspended: boolean) => void;
  deleteUser: (userId: string) => Promise<void>;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Products & Coaching
  products: Product[];
  addProduct: (product: Partial<Product>) => Promise<ProductResult>;
  updateProduct: (product: Partial<Product> & { id: string }) => Promise<ProductResult>;
  deleteProduct: (id: string) => Promise<ProductResult>;
  coachingPackages: CoachingPackage[];
  updateCoachingPackage: (pkg: CoachingPackage) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNo?: string, cargoCompany?: string) => void;
  requestOrderReturn: (orderId: string, reason: string) => void;

  // Assessments & Check-ins
  assessments: AssessmentForm[];
  submitAssessment: (data: Omit<AssessmentForm, 'id' | 'submittedAt' | 'reviewedByCoach'>) => void;
  reviewAssessment: (id: string, feedback: string) => void;
  checkIns: CheckIn[];
  submitCheckIn: (data: Omit<CheckIn, 'id' | 'date'>) => void;
  addCoachNotesToCheckIn: (checkInId: string, notes: string) => void;

  // Blog & Content
  blogPosts: BlogPost[];
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: string) => void;
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (id: string) => void;
  transformations: TransformationStory[];
  addTransformation: (trans: TransformationStory) => void;
  toggleTransformationApproval: (id: string) => void;
  testimonials: Testimonial[];
  addTestimonial: (test: Testimonial) => void;
  toggleTestimonialApproval: (id: string) => void;
  newsletterSubscribers: string[];
  subscribeNewsletter: (email: string) => { success: boolean; message: string };

  // Modals & Navigation Helpers
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  authModalOpen: boolean;
  authModalTab: AuthTab;
  authModalOptions: AuthModalOptions;
  openAuthModal: (tab?: AuthTab, options?: AuthModalOptions) => void;
  closeAuthModal: () => void;
  selectedProductDetail: Product | null;
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;
  assessmentModalOpen: boolean;
  openAssessmentModal: () => void;
  closeAssessmentModal: () => void;

  // Reset to initial
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Safe local storage helper
const loadStorage = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(`kadirfit_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage`, e);
    return fallback;
  }
};

const saveStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(`kadirfit_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage`, e);
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notify } = useDialog();
  // Language
  const [language, setLanguageState] = useState<Language>(() => loadStorage('language', 'tr'));

  // Settings
  const [settings, setSettings] = useState<SiteSettings>(() => loadStorage('settings', INITIAL_SETTINGS));
  const [cmsSections, setCmsSections] = useState<CMSSection[]>(() => loadStorage('cms_sections', INITIAL_CMS_SECTIONS));

  // Users & Auth
  const [users, setUsers] = useState<User[]>(() => loadStorage('users', INITIAL_USERS));
  // The signed-in user comes from the server session (httpOnly cookie), never from localStorage.
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => loadStorage('cart', []));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => loadStorage('applied_coupon', null));
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => loadStorage('wishlist', ['prod-heavy-tee-black', 'prod-whey-isolate']));

  // Products & Coaching
  // The catalogue lives on the server; the built-in list only shows until it loads (or if the server is unreachable).
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [coachingPackages, setCoachingPackages] = useState<CoachingPackage[]>(() => loadStorage('coaching_packages', INITIAL_COACHING_PACKAGES));

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => loadStorage('orders', INITIAL_ORDERS));

  // Assessments & Check-ins
  const [assessments, setAssessments] = useState<AssessmentForm[]>(() => loadStorage('assessments', [
    {
      id: 'asmt-1',
      userId: 'user-demo-1',
      userEmail: 'kullanici@kadirfit.com',
      fullName: 'Emre Demir',
      age: 26,
      gender: 'erkek',
      height: 182,
      weight: 88,
      targetWeight: 79,
      primaryGoal: 'yag_yakimi',
      experienceLevel: 'orta',
      trainingDaysPerWeek: 4,
      gymOrHome: 'salon',
      injuriesOrHealthIssues: 'Hafif sağ omuz sıkışması (impingement), aşırı ağır overhead press yapamıyor.',
      dietaryRestrictions: 'Laktoz intoleransı var, izole protein veya laktozsuz süt tercih ediyor.',
      dailyActivityLevel: 'orta',
      submittedAt: '2026-08-02T10:00:00Z',
      reviewedByCoach: true,
      coachFeedback: 'Omuz sıkışması için lateral raise varyasyonlarında nötr tutuş uygulayacağız. Laktozsuz izole whey ve kalori açığı protokolün hazırlandı.'
    }
  ]));

  const [checkIns, setCheckIns] = useState<CheckIn[]>(() => loadStorage('checkins', [
    {
      id: 'chk-1',
      userId: 'user-demo-1',
      weekNumber: 1,
      date: '2026-08-09',
      weight: 87.8,
      chestCm: 104,
      waistCm: 89,
      armCm: 38.5,
      hipsCm: 102,
      energyLevelRating: 4,
      sleepQualityRating: 4,
      dietAdherenceRating: 5,
      clientNotes: 'İlk hafta kardiyolar biraz zorladı ama beslenme planına %100 sadık kaldım.',
      coachNotes: 'Harika başlangıç Emre! İlk haftada 1 cm bel incelmesi muazzam. Aynen devam.',
      coachReviewedAt: '2026-08-10'
    },
    {
      id: 'chk-2',
      userId: 'user-demo-1',
      weekNumber: 4,
      date: '2026-08-30',
      weight: 85.2,
      chestCm: 104.5,
      waistCm: 85,
      armCm: 39,
      hipsCm: 99,
      energyLevelRating: 5,
      sleepQualityRating: 4,
      dietAdherenceRating: 4,
      clientNotes: 'Enerjim çok yüksek, kuvvetim arttı. Bench 95 kg 4 tekrar çıktı.',
      coachNotes: 'Kuvvet artarken belden 4 cm gitmesi ideal bir body recomp göstergesi. Kaloriyi sabit tutuyoruz.',
      coachReviewedAt: '2026-08-31'
    }
  ]));

  // Blog, Coupons, Transformations, Testimonials, Newsletter
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => loadStorage('blog_posts', INITIAL_BLOG_POSTS));
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadStorage('coupons', INITIAL_COUPONS));
  const [transformations, setTransformations] = useState<TransformationStory[]>(() => loadStorage('transformations', INITIAL_TRANSFORMATIONS));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => loadStorage('testimonials', INITIAL_TESTIMONIALS));
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<string[]>(() => loadStorage('newsletter', ['ornek.ogrenci@gmail.com']));

  // Modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthTab>('login');
  const [authModalOptions, setAuthModalOptions] = useState<AuthModalOptions>({});
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);

  // Sync brand CSS variable when accentColor changes
  useEffect(() => {
    if (settings.accentColor) {
      document.documentElement.style.setProperty('--color-accent', settings.accentColor);
    }
  }, [settings.accentColor]);

  // Sync RTL when language is Arabic
  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', language);
    }
    saveStorage('language', language);
  }, [language]);

  // Storage syncs
  useEffect(() => saveStorage('settings', settings), [settings]);
  useEffect(() => saveStorage('cms_sections', cmsSections), [cmsSections]);
  useEffect(() => saveStorage('users', users), [users]);
  useEffect(() => saveStorage('cart', cart), [cart]);
  useEffect(() => saveStorage('applied_coupon', appliedCoupon), [appliedCoupon]);
  useEffect(() => saveStorage('wishlist', wishlist), [wishlist]);
  useEffect(() => saveStorage('coaching_packages', coachingPackages), [coachingPackages]);
  useEffect(() => saveStorage('orders', orders), [orders]);
  useEffect(() => saveStorage('assessments', assessments), [assessments]);
  useEffect(() => saveStorage('checkins', checkIns), [checkIns]);
  useEffect(() => saveStorage('blog_posts', blogPosts), [blogPosts]);
  useEffect(() => saveStorage('coupons', coupons), [coupons]);
  useEffect(() => saveStorage('transformations', transformations), [transformations]);
  useEffect(() => saveStorage('testimonials', testimonials), [testimonials]);
  useEffect(() => saveStorage('newsletter', newsletterSubscribers), [newsletterSubscribers]);

  // Restore the signed-in user from the server session on first load.
  useEffect(() => {
    let cancelled = false;
    authApi.me().then(user => {
      if (!cancelled && user) adoptUser(user);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load the shared catalogue from the server.
  useEffect(() => {
    productsApi.list().then(list => {
      if (list) setProducts(list);
    });
  }, []);

  // Handle the links in verification (?verify=) and password-reset (?reset=) e-mails.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyToken = params.get('verify');
    const resetToken = params.get('reset');
    if (!verifyToken && !resetToken) return;

    // Strip the token from the address bar straight away so it can't be bookmarked or shared by accident.
    params.delete('verify');
    params.delete('reset');
    const qs = params.toString();
    window.history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash);

    if (resetToken) {
      openAuthModal('reset', { resetToken });
    } else if (verifyToken) {
      authApi.verifyEmail(verifyToken).then(res =>
        openAuthModal('login', { notice: { text: res.message, error: !res.success } })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Basic i18n translation dictionary
  const t = (key: string, defaultText: string): string => {
    if (language === 'tr') return defaultText;

    const DICT: Record<Language, Record<string, string>> = {
      en: {
        'nav.about': 'About',
        'nav.coaching': 'Coaching',
        'nav.shop': 'Shop',
        'nav.results': 'Results',
        'nav.blog': 'Blog',
        'nav.faq': 'FAQ',
        'nav.contact': 'Contact',
        'nav.start': 'Start Now',
        'nav.account': 'My Account',
        'nav.login': 'Sign In / Register',
        'hero.cta1': 'Coaching Plans',
        'hero.cta2': 'Visit Store',
        'cart.title': 'Shopping Cart',
        'cart.checkout': 'Proceed to Checkout',
        'cart.empty': 'Your cart is currently empty.',
        'coaching.title': '1-ON-1 ONLINE COACHING',
        'coaching.subtitle': 'Customized workout and nutrition plans engineered for your goals.',
        'shop.title': 'KADIRFIT OFFICIAL STORE',
        'shop.subtitle': 'Apparel engineered for performance, lab-tested pure supplements.',
        'auth.login': 'Login to Your Account',
        'auth.register': 'Create a New Account',
        'disclaimer.supplement': 'Food supplements are not medicine and cannot be used to prevent or treat diseases.'
      },
      ar: {
        'nav.about': 'من نحن',
        'nav.coaching': 'التدريب',
        'nav.shop': 'المتجر',
        'nav.results': 'النتائج',
        'nav.blog': 'المدونة',
        'nav.faq': 'الأسئلة الشائعة',
        'nav.contact': 'اتصل بنا',
        'nav.start': 'ابدأ الآن',
        'nav.account': 'حسابي',
        'nav.login': 'تسجيل الدخول / إنشاء حساب',
        'hero.cta1': 'باقات التدريب',
        'hero.cta2': 'زيارة المتجر',
        'cart.title': 'سلة التسوق',
        'cart.checkout': 'متابعة الدفع',
        'cart.empty': 'سلة التسوق فارغة حالياً.',
        'coaching.title': 'تدريب وتغذية مخصصة أونلاين',
        'coaching.subtitle': 'برامج تمارين وتغذية مخصصة ومصممة لتحقيق أهدافك.',
        'shop.title': 'متجر قادر فيت الرسمي',
        'shop.subtitle': 'ملابس رياضية عالية الأداء ومكملات غذائية نقية ومختبرة.',
        'auth.login': 'تسجيل الدخول',
        'auth.register': 'إنشاء حساب جديد',
        'disclaimer.supplement': 'المكملات الغذائية ليست أدوية ولا تستخدم للوقاية من الأمراض أو علاجها.'
      },
      tr: {}
    };

    return DICT[language]?.[key] || defaultText;
  };

  // CMS Section controls
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateCmsSections = (sections: CMSSection[]) => {
    setCmsSections(sections);
  };

  const toggleCmsSection = (id: string) => {
    setCmsSections(prev =>
      prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    );
  };

  const reorderCmsSection = (fromIndex: number, toIndex: number) => {
    setCmsSections(prev => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  // Auth methods (all real work happens on the server; see server/auth.ts)

  /** Keeps the admin panel's local member list in step with the signed-in server account. */
  const adoptUser = (user: User) => {
    setCurrentUser(user);
    setUsers(prev => (prev.some(u => u.id === user.id) ? prev.map(u => (u.id === user.id ? { ...u, ...user } : u)) : [...prev, user]));
  };

  const login = async (email: string, pass: string, remember = true) => {
    if (!email || !pass) {
      return { success: false, message: 'Lütfen tüm alanları doldurunuz.' };
    }
    const res = await authApi.login(email, pass, remember);
    if (res.success && res.user) adoptUser(res.user);
    return res;
  };

  // Registration does not sign the user in: they must verify their e-mail address first.
  const register = (userData: Parameters<AppContextType['register']>[0]) => authApi.register(userData);

  const resendVerification = (email: string) => authApi.resendVerification(email);
  const forgotPassword = (email: string) => authApi.forgotPassword(email);
  const resetPassword = (token: string, password: string) => authApi.resetPassword(token, password);

  const logout = () => {
    setCurrentUser(null);
    void authApi.logout();
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!currentUser) return { success: false, message: 'Oturum açmanız gerekiyor.' };
    const res = await authApi.updateProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      marketingConsent: data.marketingConsent
    });
    if (res.success && res.user) adoptUser(res.user);
    return res;
  };

  const updateUserStatus = (userId: string, suspended: boolean) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, suspended } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, suspended } : null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (currentUser?.id === userId) {
      const res = await authApi.deleteAccount();
      if (!res.success) {
        notify(res.message || 'Hesap silinemedi. Lütfen tekrar deneyin.', 'error');
        return;
      }
      setCurrentUser(null);
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Cart operations
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i =>
        i.productId === item.productId &&
        i.selectedSize === item.selectedSize &&
        i.selectedColor === item.selectedColor &&
        i.selectedFlavor === item.selectedFlavor &&
        i.selectedWeight === item.selectedWeight &&
        i.coachingDurationMonths === item.coachingDurationMonths
      );
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i => {
          if (i.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);
    if (!coupon) {
      return { success: false, message: 'Geçersiz veya süresi dolmuş kupon kodu.' };
    }
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (subtotal < coupon.minCartAmount) {
      return { success: false, message: `Bu kupon en az ${coupon.minCartAmount} TL sepet tutarında geçerlidir.` };
    }
    setAppliedCoupon(coupon);
    return { success: true, message: `"${coupon.code}" kuponu başarıyla uygulandı!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartDiscount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? (cartSubtotal * appliedCoupon.value) / 100
      : Math.min(cartSubtotal, appliedCoupon.value)
    : 0;

  const hasOnlyCoaching = cart.length > 0 && cart.every(i => i.isCoachingPackage);
  const cartShippingFee = hasOnlyCoaching || cartSubtotal >= settings.freeShippingThreshold || cart.length === 0
    ? 0
    : settings.standardShippingFee;

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShippingFee);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Products
  const addProduct = async (p: Partial<Product>) => {
    const res = await productsApi.create(p);
    if (res.success && res.product) setProducts(prev => [res.product!, ...prev]);
    return res;
  };
  const updateProduct = async (p: Partial<Product> & { id: string }) => {
    const res = await productsApi.update(p.id, p);
    if (res.success && res.product) setProducts(prev => prev.map(item => item.id === p.id ? res.product! : item));
    return res;
  };
  const deleteProduct = async (id: string) => {
    const res = await productsApi.remove(id);
    if (res.success) setProducts(prev => prev.filter(p => p.id !== id));
    return res;
  };

  // Coaching
  const updateCoachingPackage = (pkg: CoachingPackage) => {
    setCoachingPackages(prev => prev.map(p => p.id === pkg.id ? pkg : p));
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `KF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNo?: string, cargoCompany?: string) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            trackingNumber: trackingNo || o.trackingNumber,
            cargoCompany: cargoCompany || o.cargoCompany,
            trackingUrl: trackingNo ? `https://kargotakip.ornek.com/?code=${trackingNo}` : o.trackingUrl
          };
        }
        return o;
      })
    );
  };

  const requestOrderReturn = (orderId: string, reason: string) => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, returnRequested: true, returnReason: reason } : o)
    );
  };

  // Assessments & Check-ins
  const submitAssessment = (data: Omit<AssessmentForm, 'id' | 'submittedAt' | 'reviewedByCoach'>) => {
    const newForm: AssessmentForm = {
      ...data,
      id: `asmt-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      reviewedByCoach: false
    };
    setAssessments(prev => [newForm, ...prev]);
  };

  const reviewAssessment = (id: string, feedback: string) => {
    setAssessments(prev =>
      prev.map(a => a.id === id ? { ...a, reviewedByCoach: true, coachFeedback: feedback } : a)
    );
  };

  const submitCheckIn = (data: Omit<CheckIn, 'id' | 'date'>) => {
    const newCheckIn: CheckIn = {
      ...data,
      id: `chk-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setCheckIns(prev => [newCheckIn, ...prev]);
  };

  const addCoachNotesToCheckIn = (checkInId: string, notes: string) => {
    setCheckIns(prev =>
      prev.map(c => c.id === checkInId ? { ...c, coachNotes: notes, coachReviewedAt: new Date().toISOString() } : c)
    );
  };

  // Blog, Coupons, Content
  const addBlogPost = (p: BlogPost) => setBlogPosts(prev => [p, ...prev]);
  const updateBlogPost = (p: BlogPost) => setBlogPosts(prev => prev.map(item => item.id === p.id ? p : item));
  const deleteBlogPost = (id: string) => setBlogPosts(prev => prev.filter(item => item.id !== id));

  const addCoupon = (c: Coupon) => setCoupons(prev => [c, ...prev]);
  const deleteCoupon = (id: string) => setCoupons(prev => prev.filter(c => c.id !== id));

  const addTransformation = (t: TransformationStory) => setTransformations(prev => [t, ...prev]);
  const toggleTransformationApproval = (id: string) => {
    setTransformations(prev => prev.map(t => t.id === id ? { ...t, approved: !t.approved } : t));
  };

  const addTestimonial = (test: Testimonial) => setTestimonials(prev => [test, ...prev]);
  const toggleTestimonialApproval = (id: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, approved: !t.approved } : t));
  };

  const subscribeNewsletter = (email: string) => {
    const clean = email.trim().toLowerCase();
    if (!clean.includes('@') || !clean.includes('.')) {
      return { success: false, message: 'Lütfen geçerli bir e-posta adresi giriniz.' };
    }
    if (newsletterSubscribers.includes(clean)) {
      return { success: false, message: 'Bu e-posta adresi bültenimize zaten kayıtlıdır.' };
    }
    setNewsletterSubscribers(prev => [...prev, clean]);
    return { success: true, message: 'Tebrikler! Bültenimize başarıyla kaydoldunuz.' };
  };

  // Modals
  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);

  const openAuthModal = (tab: AuthTab = 'login', options: AuthModalOptions = {}) => {
    setAuthModalTab(tab);
    setAuthModalOptions(options);
    setAuthModalOpen(true);
  };
  const closeAuthModal = () => setAuthModalOpen(false);

  const openProductDetail = (p: Product) => setSelectedProductDetail(p);
  const closeProductDetail = () => setSelectedProductDetail(null);

  const openAssessmentModal = () => setAssessmentModalOpen(true);
  const closeAssessmentModal = () => setAssessmentModalOpen(false);

  const resetDemoData = () => {
    setSettings(INITIAL_SETTINGS);
    setCmsSections(INITIAL_CMS_SECTIONS);
    setUsers(INITIAL_USERS);
    setCoachingPackages(INITIAL_COACHING_PACKAGES);
    setOrders(INITIAL_ORDERS);
    setTransformations(INITIAL_TRANSFORMATIONS);
    setTestimonials(INITIAL_TESTIMONIALS);
    setBlogPosts(INITIAL_BLOG_POSTS);
    setCoupons(INITIAL_COUPONS);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        settings,
        updateSettings,
        cmsSections,
        updateCmsSections,
        toggleCmsSection,
        reorderCmsSection,
        currentUser,
        users,
        login,
        register,
        logout,
        resendVerification,
        forgotPassword,
        resetPassword,
        updateProfile,
        updateUserStatus,
        deleteUser,
        cart,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartDiscount,
        cartShippingFee,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        coachingPackages,
        updateCoachingPackage,
        orders,
        createOrder,
        updateOrderStatus,
        requestOrderReturn,
        assessments,
        submitAssessment,
        reviewAssessment,
        checkIns,
        submitCheckIn,
        addCoachNotesToCheckIn,
        blogPosts,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        coupons,
        addCoupon,
        deleteCoupon,
        transformations,
        addTransformation,
        toggleTransformationApproval,
        testimonials,
        addTestimonial,
        toggleTestimonialApproval,
        newsletterSubscribers,
        subscribeNewsletter,
        searchOpen,
        openSearch,
        closeSearch,
        authModalOpen,
        authModalTab,
        authModalOptions,
        openAuthModal,
        closeAuthModal,
        selectedProductDetail,
        openProductDetail,
        closeProductDetail,
        assessmentModalOpen,
        openAssessmentModal,
        closeAssessmentModal,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
