import {
  Product,
  CoachingPackage,
  TransformationStory,
  Testimonial,
  FaqItem,
  BlogPost,
  Coupon,
  CMSSection,
  SiteSettings,
  User,
  Order
} from '../types';

export const INITIAL_SETTINGS: SiteSettings = {
  brandName: 'KADIRFIT',
  slogan: 'Güç • Disiplin • Dönüşüm',
  accentColor: '#FF5A1F',
  logoText: 'KADIRFIT',
  heroHeadline: 'SENİN İÇİN TASARLANMIŞ DÖNÜŞÜM',
  heroSubheadline: 'Genetik potansiyelini maksimuma çıkar. Kişiye özel antrenman, bilimsel beslenme stratejileri ve 7/24 kesintisiz koçluk desteği ile hayalindeki fiziğe disiplinle ulaş.',
  heroCtaText: 'Koçluk Paketleri',
  heroCtaLink: '#kocluk',
  heroSecondaryCtaText: 'Mağazaya Git',
  heroSecondaryCtaLink: '#magaza',
  heroBgImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80',
  statsStudents: 1450,
  statsExperienceYears: 8,
  statsSatisfactionRate: 99,
  coachBioTitle: 'KADİR ARSLAN',
  coachBioText: '8 yılı aşkın süredir 1.400\'den fazla sporcunun fiziksel ve zihinsel sınırlarını aşmasını sağladım. IFBB Pro antrenörlük lisansım ve Sporcu Beslenmesi uzmanlığımla, popüler hurafelerden uzak, kanıta dayalı ve tamamen senin yaşam tarzına uyarlanmış bir sistem sunuyorum.',
  coachPortraitUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1000&q=80',
  coachCertificates: [
    'IFBB Pro Fitness Coach',
    'ISSA Master Certified Personal Trainer',
    'Tüm Vücut Postür & Biyomekanik Uzmanı',
    'Klinik ve Sporcu Beslenmesi Danışmanı'
  ],
  contactEmail: 'destek@kadirfit.com',
  contactPhone: '+90 (212) 809 45 45',
  contactWhatsApp: '+905321234567',
  contactAddress: 'Levent Mah. Büyükdere Cad. No: 194/B Şişli, İstanbul',
  instagramUrl: 'https://instagram.com/kadirfit',
  youtubeUrl: 'https://youtube.com/@kadirfit',
  tiktokUrl: 'https://tiktok.com/@kadirfit',
  freeShippingThreshold: 750,
  standardShippingFee: 59,
  paymentGatewayIyzico: true,
  paymentGatewayPayTR: true,
  paymentGatewayBankTransfer: true,
  paymentGatewayCashOnDelivery: true,
  bankIbanGaranti: '',
  bankIbanZiraat: '',
  maintenanceMode: false,
  kvkkText: `KADİRFİT KİŞİSEL VERİLERİN KORUNMASI VE İŞLENMESİ AYDINLATMA METNİ
Veri Sorumlusu: Kadirfit Spor ve Sağlıklı Yaşam Anonim Şirketi ("Kadirfit").
6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; siparişlerin işlenmesi, antrenman ve beslenme programlarının kişiselleştirilmesi, fatura düzenlenmesi ve yasal yükümlülüklerin yerine getirilmesi amacıyla hukuka ve dürüstlük kurallarına uygun olarak işlenmektedir.`,
  distanceSalesContractText: `MESAFELİ SATIŞ SÖZLEŞMESİ
Madde 1 - Taraflar:
Satıcı: Kadirfit Spor ve Sağlıklı Yaşam A.Ş. Adres: Levent Mah. Büyükdere Cad. No:194/B Şişli/İstanbul.
Alıcı: Siteden sipariş veren müşteri.
Madde 2 - Sözleşmenin Konusu:
İşbu sözleşmenin konusu, Alıcı'nın Satıcı'ya ait web sitesinden elektronik ortamda siparişini yaptığı ürün ve hizmetlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.`,
  preInformationFormText: `ÖN BİLGİLENDİRME FORMU
1. Satıcı Bilgileri: Kadirfit Spor A.Ş. İletişim: destek@kadirfit.com, Tel: 0212 809 45 45.
2. Ürün ve Hizmet Özellikleri: Satın alınan koçluk veya ürünün temel nitelikleri, vergiler dahil toplam satış bedeli ve teslimat bilgileri sipariş özetinde belirtilmiştir.
3. Cayma Hakkı: Dijital hazırlanan ve kişiye özel üretilen koçluk programlarında Tüketici Kanunu uyarınca ifasına başlanmış hizmetlerde cayma hakkı kullanılamaz. Fiziksel ürünlerde 14 gün içinde ambalajı açılmamış ürünler iade edilebilir.`,
  cookiePolicyText: `ÇEREZ (COOKIE) POLİTİKASI
Sitemizde gezinme deneyiminizi optimize etmek, sepetinizi korumak ve güvenli oturum açmanızı sağlamak amacıyla zorunlu ve analitik çerezler kullanılmaktadır. Tarayıcı ayarlarınızdan çerez tercihlerinizi dilediğiniz zaman değiştirebilirsiniz.`,
  membershipAgreementText: `KADİRFİT ÜYELİK SÖZLEŞMESİ
Üye, Kadirfit platformuna kayıt olarak tüm üyelik şartlarını, gizlilik politikasını ve kullanım koşullarını kabul etmiş sayılır. Üye şifresinin güvenliğinden kendisi sorumludur.`,
  returnPolicyText: `İADE VE DEĞİŞİM POLİTİKASI
Fiziksel ürünlerde (Giyim ve Aksesuarlar) teslimat tarihinden itibaren 14 gün içinde, ürün kullanılmamış, etiketleri sökülmemiş ve orijinal ambalajında olmak kaydıyla ücretsiz iade veya beden değişimi yapılabilir. Takviye edici gıdalarda emniyet bandı açılmış ürünlerin sağlık ve hijyen kuralları gereği iadesi kabul edilmemektedir.`
};

export const INITIAL_CMS_SECTIONS: CMSSection[] = [
  { id: 'sec-hero', key: 'hero', name: 'Hero (Giriş & Başlık)', enabled: true, order: 1 },
  { id: 'sec-about', key: 'about', name: 'Hakkımda (Antrenör Hikayesi & Başarılar)', enabled: true, order: 2 },
  { id: 'sec-how-it-works', key: 'how_it_works', name: 'Nasıl Çalışır (4 Adımlı Süreç)', enabled: true, order: 3 },
  { id: 'sec-coaching', key: 'coaching_packages', name: 'Koçluk Paketleri (Başlangıç, Dönüşüm, Elite)', enabled: true, order: 4 },
  { id: 'sec-categories', key: 'categories', name: 'Kategoriler Vitrini', enabled: true, order: 5 },
  { id: 'sec-featured', key: 'featured_products', name: 'Öne Çıkan Ürünler (Mağaza)', enabled: true, order: 6 },
  { id: 'sec-transformations', key: 'transformations', name: 'Dönüşüm Galerisi (Before / After)', enabled: true, order: 7 },
  { id: 'sec-testimonials', key: 'testimonials', name: 'Öğrenci Yorumları', enabled: true, order: 8 },
  { id: 'sec-faq', key: 'faq', name: 'Sıkça Sorulan Sorular (SSS)', enabled: true, order: 9 },
  { id: 'sec-cta', key: 'cta_newsletter', name: 'Son Çağrı & Bülten Aboneliği', enabled: true, order: 10 },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    firstName: 'Kadir',
    lastName: 'Arslan',
    email: 'admin@kadirfit.com',
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

export const INITIAL_COACHING_PACKAGES: CoachingPackage[] = [
  {
    id: 'pkg-baslangic',
    name: 'BAŞLANGIÇ PLANI',
    tagline: 'Temel disiplin ve forma giriş için sağlam ilk adım',
    slug: 'baslangic-plani',
    badge: 'Yeni Başlayanlar',
    durations: [
      { months: 1, price: 1850, monthlyPriceEquivalent: 1850 },
      { months: 3, price: 4700, discountPercent: 15, monthlyPriceEquivalent: 1566 },
      { months: 6, price: 8300, discountPercent: 25, monthlyPriceEquivalent: 1383 }
    ],
    features: [
      'Kişiselleştirilmiş Antrenman Programı (Ev veya Salon)',
      'Hedef Kalori & Makro Beslenme Planı',
      'Mobil PDF Egzersiz Rehberi & Video Anlatımları',
      'Haftalık Form Kontrolü (Haftada 1 Gün Check-in)',
      'E-posta & WhatsApp Soru Destek (Hafta içi 09:00 - 18:00)',
      'Temel Supplement Tavsiye Listesi'
    ],
    suitableFor: 'Hareketsiz yaşamdan spora geçmek, yağ yakımını başlatmak ve doğru antrenman formunu oturtmak isteyenler.'
  },
  {
    id: 'pkg-donusum',
    name: 'DÖNÜŞÜM PLANI',
    tagline: 'Maksimum kas kütlesi, sert hatlar ve kesin estetik sonuç',
    slug: 'donusum-plani',
    isPopular: true,
    badge: 'EN POPÜLER',
    durations: [
      { months: 1, price: 2950, monthlyPriceEquivalent: 2950 },
      { months: 3, price: 7500, discountPercent: 15, monthlyPriceEquivalent: 2500 },
      { months: 6, price: 13200, discountPercent: 25, monthlyPriceEquivalent: 2200 }
    ],
    features: [
      'Gelişmiş Hipertrofi & Yağ Yakımı Antrenman Periyodizasyonu',
      'Dinamik Öğün Planı (Favori yiyeceklerinize göre esnek diyet)',
      'Haftalık Detaylı Check-in & Ölçüm Analizi',
      'Hareket Form Analizi (Antrenman videolarına birebir düzeltme)',
      'Öncelikli WhatsApp İletişim Hattı (7/24 Kesintisiz)',
      'Kapsamlı Kan Tahlili Yorumlama & Bireysel Supplement Protokolü',
      'Tüm Kadirfit Mağaza Alışverişlerinde %15 Özel İndirim'
    ],
    suitableFor: 'Vücudunda radikal bir değişim hedefleyen, platoyu kırmak ve fit bir atletik fiziğe kavuşmak isteyenler.'
  },
  {
    id: 'pkg-elite',
    name: 'ELITE / YARIŞMACI',
    tagline: 'Sınırları yok et. Sahne kondisyonu ve profesyonel rehberlik',
    slug: 'elite-yarisici',
    isElite: true,
    badge: 'V.I.P REHBERLİK',
    durations: [
      { months: 1, price: 4850, monthlyPriceEquivalent: 4850 },
      { months: 3, price: 12350, discountPercent: 15, monthlyPriceEquivalent: 4116 },
      { months: 6, price: 21800, discountPercent: 25, monthlyPriceEquivalent: 3633 }
    ],
    features: [
      'Haftalık Birebir Görüntülü Strateji Görüşmesi (30 Dk Zoom)',
      'Haftada 2 Kez İlerleme Check-in ve Anlık Kalori Ayarlamaları',
      'Peak Week (Yarışma / Çekim Haftası) Su, Sodyum ve Karb Yükleme Planı',
      'Biyomekanik Zayıf Bölge İzolasyon ve Postür Düzeltme',
      'Doğrudan Kadir Arslan Özel Telefon Hattı',
      'Ücretsiz Kadirfit Atletik Giyim Paketi Hediye',
      'Tüm Kadirfit Mağaza Alışverişlerinde %25 Özel İndirim'
    ],
    suitableFor: 'Müsabık atletler, profesyonel modeller ve vücudunu limitlerine kadar zorlayacak kararlı sporcular.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Giyim - Oversized Heavyweight T-Shirt
  {
    id: 'prod-heavy-tee-black',
    title: 'KADIRFIT Pro-Heavyweight Oversized Tişört - Mat Siyah',
    slug: 'pro-heavyweight-oversized-tisort-siyah',
    category: 'clothing',
    subcategory: 'Tişört',
    price: 849,
    discountedPrice: 699,
    sku: 'KF-TEE-001-BLK',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'
    ],
    description: '280 GSM %100 taranmış pamuklu ağır kumaş dokusuyla omuz ve sırt hatlarını ön plana çıkaran atletik kesim. Yıkamalara karşı formunu koruyan yakası ve nefes alabilir pamuk dokusuyla antrenmanda ve günlük sokak tarzında rakipsiz.',
    shortDescription: '280 GSM %100 Pamuk, omuzları geniş gösteren özel kalıp, dikişsiz konfor.',
    features: [
      '%100 Premium Kompakt Taranmış Pamuk',
      '280 GSM Ağır Kumaş (Heavyweight)',
      'Geniş omuz & daralan bel atletik illüzyon kesimi',
      'Çift dikişli güçlendirilmiş nervür yaka',
      'Terletmeyen nefes alabilir doku'
    ],
    stock: 45,
    rating: 4.9,
    reviewCount: 128,
    isFeatured: true,
    isBestSeller: true,
    brand: 'Kadirfit Apparel',
    tags: ['oversize', 'tişört', 'pamuk', 'gym wear'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Mat Siyah', 'Kül Grisi', 'Haki Yeşil'],
    sizeChartUrl: '/size-chart'
  },

  // 2. Giyim - Performance Compression Shorts
  {
    id: 'prod-compression-short',
    title: 'KADIRFIT Dual-Layer Performans Şortu - Dahili Kompresyon Taytlı',
    slug: 'dual-layer-performans-sortu',
    category: 'clothing',
    subcategory: 'Şort',
    price: 990,
    discountedPrice: 799,
    sku: 'KF-SHRT-002-CHAR',
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Ağır bacak antrenmanları, deadlift ve squat için özel dizayn edilmiş çift katmanlı şort. İç kısımdaki esnek kompresyon taytı uyluk sürtünmesini engeller ve telefon cebiyle antrenman boyunca telefonunuzu sabit tutar.',
    shortDescription: 'Dahili kompresyon taytlı, fermuarlı gizli cepli, 4 yöne esneyen kumaş.',
    features: [
      'Dahili nem emici 4 yöne esneyen kompresyon taytı',
      'Hafif su itici ve yırtılmaz dış katman',
      'Gizli telefon cebi ve havlu asma halkası',
      'Reflektif Kadirfit logo baskısı'
    ],
    stock: 32,
    rating: 4.8,
    reviewCount: 94,
    isFeatured: true,
    brand: 'Kadirfit Apparel',
    tags: ['şort', 'kompresyon', 'leg day', 'squat'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Antrasit / Siyah', 'Askeri Yeşil']
  },

  // 3. Giyim - Iron Stringer Tank Top
  {
    id: 'prod-stringer-black',
    title: 'KADIRFIT Iron Y-Back Stringer Atlet - Derin Kesim',
    slug: 'iron-y-back-stringer-atlet',
    category: 'clothing',
    subcategory: 'Atlet',
    price: 590,
    discountedPrice: 479,
    sku: 'KF-STR-003-BLK',
    images: [
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Sırt ve göğüs kaslarını tamamen serbest bırakan klasik derin Y-Back kesim. Hafif pamuk-elastan karışımı sayesinde maksimum hareket kabiliyeti ve pump hissi sunar.',
    shortDescription: 'Y-Back ince askılı, derin koltuk altı kesimi, kas hatlarını vurgulayan yapı.',
    features: ['%95 Pamuk %5 Elastan', 'Derin Y-Back sırt kesimi', 'Ultra esnek kumaş'],
    stock: 28,
    rating: 4.7,
    reviewCount: 65,
    isFeatured: false,
    brand: 'Kadirfit Apparel',
    tags: ['stringer', 'atlet', 'pump'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Siyah', 'Beyaz', 'Turuncu']
  },

  // 4. Takviye - Whey Isolate
  {
    id: 'prod-whey-isolate',
    title: 'KADIRFIT 100% Native Whey Protein Isolate (2000g)',
    slug: '100-native-whey-protein-isolate-2000g',
    category: 'supplements',
    subcategory: 'Protein Tozu',
    price: 2490,
    discountedPrice: 2099,
    sku: 'KF-SUP-WHEY-2K',
    images: [
      'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Soğuk mikrofiltrasyon (CFM) teknolojisiyle izole edilmiş, porsiyon başına 26g saf protein, 6.2g doğal BCAA ve 0g şeker içeren ultra saf protein tozu. Şişkinlik yapmaz, laktozsuz ve anında karışır.',
    shortDescription: 'Porsiyonda 26g Saf CFM Protein, Sıfır Şeker, Laktozsuz, 66 Servis.',
    features: [
      'CFM Çapraz Akışlı Mikrofiltrasyon Teknolojisi',
      'Servis başına 26g Net Protein',
      '6.2g Doğal BCAA ve 4.8g Glutamin Öncüleri',
      'Sıfır İlave Şeker, Düşük Yağ (<0.3g)',
      'DigeZyme® Sindirim Enzimleri Kompleksi ile Kolay Sindirim'
    ],
    stock: 80,
    rating: 5.0,
    reviewCount: 312,
    isFeatured: true,
    isBestSeller: true,
    brand: 'Kadirfit Nutrition',
    tags: ['protein', 'whey', 'isolate', 'bcaa'],
    flavors: ['Belçika Çikolatası', 'Çilekli Cheesecake', 'Tuzlu Karamel', 'Aromasız'],
    weights: ['2000g (66 Servis)', '900g (30 Servis)'],
    nutritionFacts: {
      servingSize: '30g (1 Ölçek)',
      servingsPerContainer: 66,
      energyKcal: 112,
      protein: 26.2,
      carbohydrates: 0.8,
      sugar: 0.2,
      fat: 0.4,
      saturatedFat: 0.1,
      bcaa: 6.2
    },
    usageInstructions: '1 ölçek (30g) ürünü 250-300 ml soğuk su veya az yağlı süt ile karıştırınız. Antrenmandan hemen sonra veya gün içinde protein ihtiyacınıza göre tüketiniz.',
    supplementWarning: 'Takviye edici gıdalar ilaç değildir, hastalıkların önlenmesi veya tedavi edilmesi amacıyla kullanılmaz. Dengeli ve çeşitli beslenme ile sağlıklı yaşam tarzı önemlidir.'
  },

  // 5. Takviye - Creapure Creatine Monohydrate
  {
    id: 'prod-creatine-creapure',
    title: 'KADIRFIT Creapure® %100 Mikronize Kreatin Monohidrat (500g)',
    slug: 'creapure-mikronize-kreatin-monohidrat-500g',
    category: 'supplements',
    subcategory: 'Kreatin',
    price: 950,
    discountedPrice: 799,
    sku: 'KF-SUP-CREA-500',
    images: [
      'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Almanya Alzchem tesislerinde üretilen dünyanın en saf kreatin ham maddesi Creapure®. ATP üretimini hızlandırarak patlayıcı güç, kas hacmi ve toparlanma süresinde klinik olarak kanıtlanmış artış sağlar.',
    shortDescription: 'Dünyanın 1 Numaralı Saf Alman Ham Maddesi Creapure®, 100 Servis.',
    features: [
      '%99.99 Saf Creapure® Kreatin Monohidrat',
      '200 Mesh Ultra İnce Mikronize Form (Topaklanma yapmaz)',
      '100 Servis (Porsiyon başına 5000mg)',
      'Aromasız, her türlü içecekle karıştırılabilir'
    ],
    stock: 120,
    rating: 4.9,
    reviewCount: 420,
    isFeatured: true,
    isBestSeller: true,
    brand: 'Kadirfit Nutrition',
    tags: ['kreatin', 'creapure', 'güç', 'atp'],
    flavors: ['Aromasız (Saf)'],
    weights: ['500g (100 Servis)'],
    nutritionFacts: {
      servingSize: '5g (1 Ölçek)',
      servingsPerContainer: 100,
      energyKcal: 0,
      protein: 0,
      carbohydrates: 0,
      sugar: 0,
      fat: 0,
      saturatedFat: 0
    },
    usageInstructions: 'Günde 1 ölçek (5g) ürünü 200 ml su, meyve suyu veya protein tozunuza ilave edip içiniz. Gün boyunca bol su tüketmeyi ihmal etmeyiniz.',
    supplementWarning: 'Takviye edici gıdalar ilaç değildir, hastalıkların önlenmesi veya tedavi edilmesi amacıyla kullanılmaz.'
  },

  // 6. Takviye - Pre-Workout Rage
  {
    id: 'prod-pre-workout',
    title: 'KADIRFIT Storm Pre-Workout Pump & Focus Matrisi (360g)',
    slug: 'storm-pre-workout-pump-focus-360g',
    category: 'supplements',
    subcategory: 'Pre-Workout',
    price: 1350,
    discountedPrice: 1099,
    sku: 'KF-SUP-PRE-360',
    images: [
      'https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1579722822168-3f8e652435dc?auto=format&fit=crop&w=1000&q=80'
    ],
    description: '6000mg L-Citrulline Malate, 3200mg Beta-Alanine, 350mg Susuz Kafein ve nootropik odaklanma bileşenleriyle damar genişletici muazzam pump ve kesintisiz lazer odaklanması sağlar.',
    shortDescription: '6000mg L-Sitrülin, 3200mg Beta-Alanin, 350mg Kafein, 30 Patlayıcı Servis.',
    features: [
      'Klinik Dozajlı Formül',
      'Damarları belirginleştiren nitrik oksit pompası',
      'Crash yapmayan dengeli enerji salınımı'
    ],
    stock: 55,
    rating: 4.8,
    reviewCount: 180,
    isFeatured: true,
    brand: 'Kadirfit Nutrition',
    tags: ['preworkout', 'pump', 'enerji', 'kafein'],
    flavors: ['Ekşi Elma', 'Kırmızı Orman Meyveleri', 'Mavi Ahududu'],
    weights: ['360g (30 Servis)'],
    usageInstructions: 'Antrenmandan 25-30 dakika önce 1 ölçek (12g) ürünü 300 ml soğuk su ile karıştırıp tüketiniz.',
    supplementWarning: 'Takviye edici gıdalar ilaç değildir, hastalıkların önlenmesi veya tedavi edilmesi amacıyla kullanılmaz. Kafein içerir, çocuklar ve hamileler için tavsiye edilmez.'
  },

  // 7. Aksesuar - 10mm Lever Weightlifting Belt
  {
    id: 'prod-lever-belt',
    title: 'KADIRFIT Pro 10mm Hakiki Deri Lever Ağırlık Kemeri',
    slug: 'pro-10mm-deri-lever-agirlik-kemeri',
    category: 'accessories',
    subcategory: 'Kemer',
    price: 2200,
    discountedPrice: 1790,
    sku: 'KF-ACC-BELT-10M',
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=1000&q=80'
    ],
    description: '10mm kalınlığında endüstriyel hakiki manda derisinden üretilmiş, kırılmaz çelik lever tokalı profesyonel powerlifting ve vücut geliştirme kemeri. Karın içi basıncını maksimum seviyeye çıkararak omurganızı ağır kilolarda korur.',
    shortDescription: '10mm Kalın Hakiki Deri, Çelik Lever Toka, IPF Standartlarına Uygun.',
    features: [
      '10mm kalınlık, 10cm homojen genişlik',
      'Mat siyah paslanmaz çelik döküm hızlı kilit toka',
      'İçi süet astarlı kaymaz yüzey',
      'Lazer kazıma Kadirfit logosu'
    ],
    stock: 25,
    rating: 5.0,
    reviewCount: 88,
    isFeatured: true,
    brand: 'Kadirfit Gear',
    tags: ['kemer', 'lever belt', 'powerlifting', 'squat'],
    sizes: ['S (65-80 cm)', 'M (75-90 cm)', 'L (85-100 cm)', 'XL (95-115 cm)'],
    colors: ['Mat Siyah', 'Kadirfit Turuncu']
  },

  // 8. Aksesuar - Paslanmaz Çelik Termos Shaker
  {
    id: 'prod-steel-shaker',
    title: 'KADIRFIT 750ml Çift Duvarlı Paslanmaz Çelik Mat Shaker',
    slug: '750ml-paslanmaz-celik-mat-shaker',
    category: 'accessories',
    subcategory: 'Shaker',
    price: 650,
    discountedPrice: 499,
    sku: 'KF-ACC-SHKR-STL',
    images: [
      'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Koku yapmayan gıda sınıfı 304 paslanmaz çelikten üretilmiş, 24 saat soğuk tutan çift duvarlı vakum yalıtımlı termos shaker. Sızdırmaz kapağı ve sessiz karıştırma ızgarasıyla antrenman çantalarının vazgeçilmezi.',
    shortDescription: 'Koku yapmaz 304 Çelik, 24 saat soğuk tutma, %100 sızdırmaz.',
    features: [
      '304 Paslanmaz Çelik Gövde (BPA Free)',
      '24 Saat Soğuk / 12 Saat Sıcak İzolasyonu',
      'Dahili sessiz süzgeç ızgarası',
      'Ergonomik taşıma kulplu kapak'
    ],
    stock: 70,
    rating: 4.9,
    reviewCount: 145,
    isFeatured: false,
    brand: 'Kadirfit Gear',
    tags: ['shaker', 'çelik', 'termos', 'aksesuar'],
    colors: ['Mat Siyah', 'Fırçalanmış Çelik']
  }
];

export const INITIAL_TRANSFORMATIONS: TransformationStory[] = [
  {
    id: 'trans-1',
    studentName: 'Burak Korkmaz',
    age: 28,
    durationWeeks: 16,
    weightChange: '-19 kg & -%14 Yağ Oranı',
    beforeImg: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    quote: '"Yıllarca aç kalarak kardiyo yapıp başarısız olmuştum. Kadir Hoca\'nın beslenme periyodizasyonu ve haftalık check-in takipleri sayesinde aç kalmadan hayatımın en düşük yağ oranına ulaştım."',
    category: 'kilo_verme',
    approved: true
  },
  {
    id: 'trans-2',
    studentName: 'Canberk Yıldız',
    age: 24,
    durationWeeks: 24,
    weightChange: '+9 kg Yağsız Kas Kütlesi',
    beforeImg: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    quote: '"Ektomorf vücut yapımla kilo alamayacağımı düşünüyordum. 6 aylık Dönüşüm Paketi boyunca her hafta aldığım mikro kalori ayarlamalarıyla omuzlarım ve göğsüm tamamen evrim geçirdi."',
    category: 'kas_kazanimi',
    approved: true
  },
  {
    id: 'trans-3',
    studentName: 'Mert Aksoy',
    age: 31,
    durationWeeks: 20,
    weightChange: '-12 kg Yağ / +4 kg Kas',
    beforeImg: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=800&q=80',
    quote: '"Masa başı işimde enerjim tükenmişti. 20 haftada hem bel çevrem 18 cm inceldi hem de bench press rekorum 60 kg\'dan 125 kg\'a fırladı. Disiplin her şeydir."',
    category: 'kilo_verme',
    approved: true
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Serdar Güneş',
    roleOrCity: 'Yazılım Mühendisi / İstanbul',
    rating: 5,
    comment: 'Kadir Hoca sadece program yazıp kenara çekilmiyor. Her pazar check-in fotoğraflarımı santim santim inceleyip video ile geri bildirim verdi. Verilen paranın her kuruşunu hak ediyor.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    programType: 'Dönüşüm Planı (6 Ay)',
    verified: true,
    approved: true
  },
  {
    id: 'test-2',
    name: 'Alp Tunç',
    roleOrCity: 'Mimar / İzmir',
    rating: 5,
    comment: 'Mağazadan aldığım oversize tişört ve Creapure kreatin inanılmaz kaliteli. Hem koçluk hem ürün kalitesi Türkiye\'de eşsiz seviyede. Teşekkürler Kadirfit ekibi.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    programType: 'Mağaza Alışverişi & Koçluk',
    verified: true,
    approved: true
  },
  {
    id: 'test-3',
    name: 'Tolga Çelik',
    roleOrCity: 'Girişimci / Ankara',
    rating: 5,
    comment: 'Daha önce 3 farklı koçla çalışmıştım ama hiçbiri Kadir Arslan kadar biyomekanik ve sakatlık geçmişime dikkat etmemişti. Bel fıtığı ağrılarım bitti, karın kaslarım çıktı.',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    programType: 'Elite Plan (3 Ay)',
    verified: true,
    approved: true
  }
];

export const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'kocluk',
    question: 'Programlar nasıl hazırlanıyor ve bana ne zaman teslim edilecek?',
    answer: 'Satın alma işleminizin ardından sitedeki "Ön Değerlendirme Formu"nu doldurursunuz. Yaşınız, boyunuz, kilonuz, spor geçmişiniz, sakatlıklarınız, antrenman yapacağınız ortam (ev/salon) ve beslenme alışkanlıklarınız titizlikle incelenir. 48 saat içerisinde tamamen size özel hazırlanan antrenman ve beslenme programınız kullanıcı panelinize yüklenir.',
    order: 1
  },
  {
    id: 'faq-2',
    category: 'kocluk',
    question: 'Haftalık check-in süreci nasıl işliyor?',
    answer: 'Her hafta belirlediğimiz check-in gününde (genellikle Pazar sabahı aç karnına) güncel kilonuzu, mezura ölçülerinizi ve ilerleme fotoğraflarınızı Hesabım > Koçluk Alanım sekmesinden yüklersiniz. Kadir Hoca ilerlemenizi değerlendirip gerekirse kalori ve antrenman hacminde güncellemeler yapar.',
    order: 2
  },
  {
    id: 'faq-3',
    category: 'antrenman',
    question: 'Evde antrenman yapıyorum, salona gitmeden sonuç alabilir miyim?',
    answer: 'Kesinlikle evet. Evde sahip olduğunuz ekipmanlara (dambıl, direnç bandı veya sadece vücut ağırlığı) göre hipertrofiyi tetikleyen özel tükeniş ve tempo prensipleriyle ev programınızı oluşturuyoruz.',
    order: 3
  },
  {
    id: 'faq-4',
    category: 'siparis',
    question: 'Siparişler ne kadar sürede kargoya verilir?',
    answer: 'Hafta içi saat 15:00\'e kadar verilen tüm mağaza siparişleri aynı gün Yurtiçi Kargo güvencesiyle kargoya teslim edilir. Kargo takip kodunuz SMS ve e-posta ile otomatik olarak tarafınıza iletilir.',
    order: 4
  },
  {
    id: 'faq-5',
    category: 'odeme',
    question: 'Ödeme seçenekleri ve taksit imkanı var mı?',
    answer: 'Kredi kartı ve banka kartı ile 12 aya varan taksit seçenekleri mevcuttur. Ayrıca Havale / EFT ve Kapıda Nakit / Kredi Kartı ile ödeme seçeneklerimiz bulunmaktadır. Tüm kartlı işlemler 256-bit SSL ve 3D Secure güvencesi altındadır.',
    order: 5
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Doğal Olarak Kas Kazanırken Yağ Yakmak (Body Recomposition) Mümkün Mü?',
    slug: 'dogal-kas-kazanirken-yag-yakmak-body-recomposition',
    category: 'Beslenme & Bilim',
    readTime: '6 dk okuma',
    publishDate: '2026-09-15',
    author: 'Kadir Arslan',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'Aynı anda hem kas yapıp hem yağ yakmanın fizyolojik şartları, doğru kalori açığı miktarı ve protein sentezini maksimumda tutmanın altın kuralları.',
    content: `Fitness dünyasında yıllardır süregelen en büyük mitlerden biri: "Aynı anda hem kas yapamaz hem de yağ yakamazsın."

Bilimsel araştırmalar ve binlerce öğrencimde uyguladığım protokoller gösteriyor ki "Body Recomposition" özellikle yeni başlayanlar, spora uzun ara verip geri dönenler ve vücut yağ oranı %18'in üzerinde olan bireyler için tamamen gerçektir.

İşte dikkat etmeniz gereken 3 ana kural:
1. Hafif Kalori Açığı (%10-15): Sert bir kalori kısıtlaması kas protein sentezini baltalar. Günlük harcamanızdan sadece 300-400 kcal eksik beslenin.
2. Yüksek Protein Alımı (2.0 - 2.4g / kg): Yetersiz protein alımında vücut açık verirken kas dokusunu enerjiye çevirebilir.
3. Aşamalı Aşırı Yükleme (Progressive Overload): Kalori açığında olsanız dahi antrenmanda ağırlık ve tekrar sayılarını korumak, hatta artırmak için savaşmalısınız.`,
    published: true
  },
  {
    id: 'blog-2',
    title: 'Kreatin Monohidrat Rehberi: Yükleme Şart Mı? Ne Zaman İçilmeli?',
    slug: 'kreatin-monohidrat-kullanim-rehberi',
    category: 'Takviyeler',
    readTime: '5 dk okuma',
    publishDate: '2026-08-28',
    author: 'Kadir Arslan',
    coverImage: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'Hakkında en çok araştırma yapılan sporcu takviyesi kreatin hakkında bilmeniz gereken tüm doğrular, saç dökülmesi miti ve optimal kullanım saatleri.',
    content: `Kreatin monohidrat, kas hücrelerindeki fosfokreatin depolarını doldurarak yüksek yoğunluklu antrenmanlarda ATP (hücresel enerji) yenilenmesini hızlandırır.

Yükleme Fazı Gerekli Mi?
Günde 20g (4x5g) yükleme yaparak 5-7 günde depoları doldurabilirsiniz. Ancak günde 5g düzenli alarak da 3-4 hafta içinde aynı doyum seviyesine ulaşırsınız. Mide hassasiyeti yaşamamak için günde tek doz 5g almanızı tavsiye ediyorum.

Ne Zaman İçilmeli?
Zamanlama kritik değildir; önemli olan günlük düzenliliktir. Ancak antrenman sonrası karbonhidrat ve protein içeren bir öğünle tüketildiğinde insülin etkisiyle kas içine emilim oranı bir miktar artmaktadır.`,
    published: true
  },
  {
    id: 'blog-3',
    title: 'Geniş Sırt ve V-Taper Fiziğin Anatomisi: En Etkili Sırt Egzersizleri',
    slug: 'genis-sirt-ve-v-taper-anatomisi',
    category: 'Antrenman',
    readTime: '7 dk okuma',
    publishDate: '2026-08-10',
    author: 'Kadir Arslan',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'Latissimus dorsi kasının alt ve üst liflerini izole etme teknikleri, dirsek çekiş açıları ve omuz-bel oranını maksimize eden haftalık antrenman şablonu.',
    content: `V-Taper fizik, ince bir bel ve geniş, kanat gibi açılan bir sırt yapısıyla elde edilir.

Sırt antrenmanlarında en sık yapılan hata: Ağırlığı kollar ve biseps ile çekmektir.
Dirseklerinizi birer kanca gibi düşünün. Çekişi elinizle değil, dirseğinizi arkaya ve aşağıya doğru sürerek başlatmalısınız.

Olmazsa Olmaz 3 Egzersiz:
1. Nötr Tutuş Göğse Lat Pulldown
2. Destekli Göğüs Dayamalı T-Bar Row
3. Tek Kol Kablo Lat Çekişi (İliac Lat Fiber İzolasyonu)`,
    published: true
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'KADIRFIT10',
    type: 'percentage',
    value: 10,
    minCartAmount: 500,
    expiresAt: '2027-12-31',
    usageCount: 142,
    usageLimit: 1000,
    isActive: true
  },
  {
    id: 'coup-2',
    code: 'DISIPLIN100',
    type: 'fixed',
    value: 100,
    minCartAmount: 1000,
    expiresAt: '2027-12-31',
    usageCount: 88,
    usageLimit: 500,
    isActive: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'KF-2026-8910',
    userId: 'user-demo-1',
    customerName: 'Emre Demir',
    customerEmail: 'kullanici@kadirfit.com',
    customerPhone: '+905449876543',
    shippingAddress: {
      id: 'addr-1',
      title: 'Evim',
      fullName: 'Emre Demir',
      phone: '+905449876543',
      city: 'İstanbul',
      district: 'Kadıköy',
      fullAddress: 'Caferağa Mah. Moda Cad. No: 42 Daire: 6',
      postalCode: '34710',
      isDefault: true
    },
    billingAddress: {
      id: 'addr-1',
      title: 'Evim',
      fullName: 'Emre Demir',
      phone: '+905449876543',
      city: 'İstanbul',
      district: 'Kadıköy',
      fullAddress: 'Caferağa Mah. Moda Cad. No: 42 Daire: 6',
      postalCode: '34710',
      isDefault: true
    },
    items: [
      {
        productId: 'prod-heavy-tee-black',
        title: 'KADIRFIT Pro-Heavyweight Oversized Tişört - Mat Siyah',
        quantity: 1,
        unitPrice: 699,
        selectedVariantText: 'Beden: L, Renk: Mat Siyah',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'
      },
      {
        productId: 'prod-creatine-creapure',
        title: 'KADIRFIT Creapure® %100 Mikronize Kreatin Monohidrat (500g)',
        quantity: 1,
        unitPrice: 799,
        selectedVariantText: 'Gramaj: 500g',
        image: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=1000&q=80'
      }
    ],
    subtotal: 1498,
    discountAmount: 149.8,
    couponCode: 'KADIRFIT10',
    shippingFee: 0,
    total: 1348.2,
    status: 'Kargoda',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    cargoCompany: 'Yurtiçi Kargo',
    trackingNumber: 'YK-48920194812',
    trackingUrl: 'https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=YK-48920194812',
    createdAt: '2026-09-28T11:20:00Z'
  }
];
