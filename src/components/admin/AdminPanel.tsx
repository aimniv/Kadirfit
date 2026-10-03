import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  PackageCheck,
  Users,
  Layers,
  Tag,
  FileText,
  Settings,
  Mail,
  ArrowLeft,
  ShieldAlert,
  LogOut,
  Bell,
  Sparkles,
  Sliders,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Check,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  Eye,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Role, OrderStatus, Product, CoachingPackage, Coupon, BlogPost, TransformationStory } from '../../types';

interface AdminPanelProps {
  onExitAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onExitAdmin }) => {
  const {
    currentUser,
    switchRole,
    settings,
    updateSettings,
    cmsSections,
    toggleCmsSection,
    reorderCmsSection,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    users,
    updateUserStatus,
    coachingPackages,
    updateCoachingPackage,
    assessments,
    reviewAssessment,
    checkIns,
    addCoachNotesToCheckIn,
    coupons,
    addCoupon,
    deleteCoupon,
    blogPosts,
    addBlogPost,
    deleteBlogPost,
    testimonials,
    toggleTestimonialApproval,
    transformations,
    toggleTransformationApproval,
    newsletterSubscribers,
    resetDemoData
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Guard: if current user is not logged in or role is USER, display authorization error
  const isAuthorized = currentUser && currentUser.role !== 'USER';

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-display text-3xl font-black text-white uppercase tracking-tight">
          YETKİSİZ ERİŞİM
        </h2>
        <p className="text-neutral-400 text-xs max-w-sm mt-2 mb-6">
          Admin paneline sadece SUPER_ADMIN, ORDER_MANAGER veya EDITOR yetkisine sahip kullanıcılar erişebilir.
        </p>

        {/* Quick Demo Switcher */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3 max-w-xs w-full">
          <p className="text-[11px] text-neutral-400 font-semibold">Test için yönetici rolüne geçin:</p>
          <button
            onClick={() => switchRole('SUPER_ADMIN')}
            className="w-full py-2.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold uppercase rounded"
          >
            Süper Admin Olarak Giriş Yap
          </button>
          <button
            onClick={onExitAdmin}
            className="w-full py-2 bg-neutral-800 text-neutral-300 text-xs font-semibold rounded hover:bg-neutral-700"
          >
            Mağazaya Geri Dön
          </button>
        </div>
      </div>
    );
  }

  // Calculate Metrics for Dashboard
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const activeStudentsCount = users.filter(u => u.activeCoachingPackageId || u.role === 'USER').length;
  const lowStockProducts = products.filter(p => p.stock < 30);

  return (
    <div className="min-h-screen bg-[#080808] text-neutral-200 flex">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#0F0F0F] border-r border-neutral-800 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Logo & Role Badge */}
          <div className="p-5 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#FF5A1F] flex items-center justify-center font-display font-black text-white text-base">
                K
              </div>
              <span className="font-display text-xl font-bold tracking-wider text-white">
                KADIR<span className="text-[#FF5A1F]">FIT</span>
              </span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700 ml-auto font-mono">
                ADMIN
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-2 flex items-center justify-between">
              <span>Aktif Yetki:</span>
              <strong className="text-[#FF5A1F] uppercase">{currentUser.role}</strong>
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-semibold">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'cms', label: 'Sayfa & Bölüm Yönetimi', icon: Layers },
              { id: 'products', label: `Ürünler (${products.length})`, icon: ShoppingBag },
              { id: 'orders', label: `Siparişler (${orders.length})`, icon: PackageCheck },
              { id: 'coaching', label: 'Koçluk & Başvurular', icon: TrendingUp },
              { id: 'members', label: `Üyeler & Takip (${users.length})`, icon: Users },
              { id: 'coupons', label: 'Kupon & Kampanya', icon: Tag },
              { id: 'content', label: 'Blog, SSS & Yorumlar', icon: FileText },
              { id: 'subscribers', label: `Bülten (${newsletterSubscribers.length})`, icon: Mail },
              { id: 'settings', label: 'Site Ayarları & Renkler', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-[#FF5A1F] text-white font-bold shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-800 space-y-2">
          <button
            onClick={onExitAdmin}
            className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors border border-neutral-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Canlı Mağazaya Dön</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Tüm demo verileri varsayılan ayarlara sıfırlamak istiyor musunuz?')) {
                resetDemoData();
              }
            }}
            className="w-full text-center text-[10px] text-neutral-500 hover:text-neutral-400 py-1"
          >
            Demo Verilerini Sıfırla
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        
        {/* Top Bar */}
        <header className="h-16 bg-[#0E0E0E] border-b border-neutral-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-heading uppercase text-sm font-bold text-white tracking-wider">
              {activeTab === 'dashboard' && 'Yönetim Özeti (Dashboard)'}
              {activeTab === 'cms' && 'Sayfa & Bölüm Yönetimi (CMS)'}
              {activeTab === 'products' && 'Mağaza Ürün ve Stok Yönetimi'}
              {activeTab === 'orders' && 'Siparişler, Kargo ve Fatura Takibi'}
              {activeTab === 'coaching' && 'Koçluk Paketleri & Gelen Ön Değerlendirmeler'}
              {activeTab === 'members' && 'Üye Listesi, Program Yükleme ve Check-in'}
              {activeTab === 'coupons' && 'İndirim Kuponları ve Kampanyalar'}
              {activeTab === 'content' && 'İçerik Yönetimi (Blog, SSS, Dönüşüm Galerisi)'}
              {activeTab === 'subscribers' && 'VIP Bülten Aboneleri'}
              {activeTab === 'settings' && 'Site Ayarları, Renk Paleti ve Yasal Metinler'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExitAdmin}
              className="px-3 py-1.5 bg-[#FF5A1F]/15 hover:bg-[#FF5A1F]/25 text-[#FF5A1F] text-xs font-bold uppercase rounded border border-[#FF5A1F]/30 transition-colors"
            >
              Mağazayı Canlı İncele ↗
            </button>
          </div>
        </header>

        {/* Dynamic Admin Tabs */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-[#121212] border border-neutral-800 space-y-2">
                  <div className="flex justify-between items-center text-neutral-400 text-xs">
                    <span>Toplam Satış Hacmi</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="font-display text-3xl font-black text-white">
                    {totalRevenue.toLocaleString('tr-TR')} ₺
                  </h3>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" /> Geçen aya göre +%24 artış
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#121212] border border-neutral-800 space-y-2">
                  <div className="flex justify-between items-center text-neutral-400 text-xs">
                    <span>Toplam Sipariş Sayısı</span>
                    <PackageCheck className="w-4 h-4 text-[#FF5A1F]" />
                  </div>
                  <h3 className="font-display text-3xl font-black text-white">
                    {totalOrdersCount}
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-semibold">
                    %100 Başarılı Ödeme Oranı
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#121212] border border-neutral-800 space-y-2">
                  <div className="flex justify-between items-center text-neutral-400 text-xs">
                    <span>Aktif Koçluk Öğrencisi</span>
                    <Users className="w-4 h-4 text-sky-400" />
                  </div>
                  <h3 className="font-display text-3xl font-black text-white">
                    {activeStudentsCount}
                  </h3>
                  <p className="text-[11px] text-sky-400 font-semibold">
                    2 Yeni Check-in Bekliyor
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#121212] border border-neutral-800 space-y-2">
                  <div className="flex justify-between items-center text-neutral-400 text-xs">
                    <span>Kritik Stok Uyarısı</span>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="font-display text-3xl font-black text-white">
                    {lowStockProducts.length} Ürün
                  </h3>
                  <p className="text-[11px] text-amber-400 font-semibold">
                    30 adedin altında kalan modeller
                  </p>
                </div>
              </div>

              {/* Recent Orders & Stock Table */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Orders Overview */}
                <div className="p-6 rounded-2xl bg-[#121212] border border-neutral-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-heading uppercase text-xs font-bold text-white tracking-wider">
                      Son Siparişler
                    </h4>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#FF5A1F] hover:underline"
                    >
                      Tümünü Gör
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orders.slice(0, 4).map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800/80 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white font-mono">{ord.orderNumber}</span>
                            <span className="text-[10px] text-neutral-500">• {ord.customerName}</span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                            {ord.items.map(i => `${i.quantity}x ${i.title}`).join(', ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#FF5A1F] block">{ord.total.toLocaleString('tr-TR')} ₺</span>
                          <span className="text-[10px] text-emerald-400 font-semibold">{ord.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="p-6 rounded-2xl bg-[#121212] border border-neutral-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-heading uppercase text-xs font-bold text-white tracking-wider">
                      Düşük Stok Uyarıları
                    </h4>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="text-xs text-[#FF5A1F] hover:underline"
                    >
                      Stok Güncelle
                    </button>
                  </div>

                  <div className="space-y-3">
                    {lowStockProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800/80 flex items-center gap-3 text-xs"
                      >
                        <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded object-cover bg-black" />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-white truncate">{p.title}</h5>
                          <span className="text-[10px] text-neutral-400">SKU: {p.sku}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                          {p.stock} Adet Kaldı
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CMS SECTION & PAGE MANAGEMENT */}
          {activeTab === 'cms' && (
            <div className="space-y-8">
              
              {/* Hero Banner Text Editor */}
              <div className="p-6 rounded-2xl bg-[#121212] border border-neutral-800 space-y-4">
                <h4 className="font-heading uppercase text-xs font-bold text-white tracking-wider">
                  Ana Sayfa Hero Metinleri & Görseli Düzenle
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-neutral-400 block mb-1">Büyük Başlık (Headline)</label>
                    <input
                      type="text"
                      value={settings.heroHeadline}
                      onChange={(e) => updateSettings({ heroHeadline: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Alt Açıklama (Subheadline)</label>
                    <textarea
                      value={settings.heroSubheadline}
                      onChange={(e) => updateSettings({ heroSubheadline: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-neutral-400 block mb-1">1. Buton Yazısı</label>
                      <input
                        type="text"
                        value={settings.heroCtaText}
                        onChange={(e) => updateSettings({ heroCtaText: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 block mb-1">2. Buton Yazısı</label>
                      <input
                        type="text"
                        value={settings.heroSecondaryCtaText}
                        onChange={(e) => updateSettings({ heroSecondaryCtaText: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Visibility & Reorder */}
              <div className="p-6 rounded-2xl bg-[#121212] border border-neutral-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-heading uppercase text-xs font-bold text-white tracking-wider">
                    Ana Sayfa Bölümlerini Aç/Kapat ve Sırala
                  </h4>
                  <span className="text-[11px] text-neutral-400">
                    Sitede anında güncellenir
                  </span>
                </div>

                <div className="space-y-2">
                  {cmsSections.map((sec, idx) => (
                    <div
                      key={sec.id}
                      className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-neutral-500 font-bold w-5">{idx + 1}.</span>
                        <span className="font-bold text-white">{sec.name}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Move Up / Down */}
                        <div className="flex gap-1">
                          <button
                            disabled={idx === 0}
                            onClick={() => reorderCmsSection(idx, idx - 1)}
                            className="px-2 py-1 bg-neutral-800 text-neutral-300 rounded disabled:opacity-30 hover:bg-neutral-700"
                            title="Yukarı Taşı"
                          >
                            ↑
                          </button>
                          <button
                            disabled={idx === cmsSections.length - 1}
                            onClick={() => reorderCmsSection(idx, idx + 1)}
                            className="px-2 py-1 bg-neutral-800 text-neutral-300 rounded disabled:opacity-30 hover:bg-neutral-700"
                            title="Aşağı Taşı"
                          >
                            ↓
                          </button>
                        </div>

                        {/* Toggle On / Off */}
                        <button
                          onClick={() => toggleCmsSection(sec.id)}
                          className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                            sec.enabled
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-neutral-800 text-neutral-500'
                          }`}
                        >
                          {sec.enabled ? 'Açık (Görünür)' : 'Kapalı (Gizli)'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="font-heading uppercase text-xs font-bold text-white tracking-wider">
                  Mevcut Ürün Listesi ({products.length})
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const title = prompt('Yeni ürün adı:');
                      if (!title) return;
                      const newProd: Product = {
                        id: `prod-${Date.now()}`,
                        title,
                        slug: title.toLowerCase().replace(/ /g, '-'),
                        category: 'clothing',
                        subcategory: 'Tişört',
                        price: 799,
                        sku: `KF-${Math.floor(100 + Math.random() * 900)}`,
                        images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'],
                        description: 'Yüksek kaliteli sporcu giyimi.',
                        shortDescription: 'Özel dikişli sporcu ürünü.',
                        features: ['%100 Kaliteli Kumaş', 'Nefes Alabilir'],
                        stock: 50,
                        rating: 5.0,
                        reviewCount: 1,
                        isFeatured: true,
                        brand: 'Kadirfit Apparel',
                        tags: ['yeni', 'giyim']
                      };
                      addProduct(newProd);
                    }}
                    className="px-3.5 py-1.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold rounded flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Yeni Ürün Ekle</span>
                  </button>

                  <button
                    onClick={() => alert('Ürün listesi CSV olarak dışa aktarıldı.')}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV Dışa Aktar</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-[#121212] border border-neutral-800 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-900 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                    <tr>
                      <th className="p-3.5">Görsel & Ürün</th>
                      <th className="p-3.5">Kategori</th>
                      <th className="p-3.5">Fiyat</th>
                      <th className="p-3.5">Stok</th>
                      <th className="p-3.5">Öne Çıkan</th>
                      <th className="p-3.5 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-900/40">
                        <td className="p-3.5 flex items-center gap-3">
                          <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded object-cover bg-black" />
                          <div>
                            <span className="font-semibold text-white block">{p.title}</span>
                            <span className="text-[10px] text-neutral-500 font-mono">SKU: {p.sku}</span>
                          </div>
                        </td>
                        <td className="p-3.5 capitalize">{p.category} • {p.subcategory}</td>
                        <td className="p-3.5 font-bold text-white">
                          {(p.discountedPrice || p.price).toLocaleString('tr-TR')} ₺
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            p.stock > 30 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {p.stock} Adet
                          </span>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => updateProduct({ ...p, isFeatured: !p.isFeatured })}
                            className={`text-xs ${p.isFeatured ? 'text-[#FF5A1F] font-bold' : 'text-neutral-500'}`}
                          >
                            {p.isFeatured ? '★ Evet' : 'Hayır'}
                          </button>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => {
                              const newStock = prompt('Yeni stok adedi:', String(p.stock));
                              if (newStock) updateProduct({ ...p, stock: parseInt(newStock) || 0 });
                            }}
                            className="p-1 text-neutral-400 hover:text-white"
                            title="Stok Güncelle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`"${p.title}" ürününü silmek istediğinize emin misiniz?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1 text-neutral-400 hover:text-rose-400"
                            title="Ürünü Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h4 className="font-heading uppercase text-xs font-bold text-white tracking-wider">
                Gelen Siparişler & Kargo Durumları ({orders.length})
              </h4>

              <div className="bg-[#121212] border border-neutral-800 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-900 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                    <tr>
                      <th className="p-3.5">Sipariş No</th>
                      <th className="p-3.5">Müşteri</th>
                      <th className="p-3.5">Tutar</th>
                      <th className="p-3.5">Ödeme</th>
                      <th className="p-3.5">Sipariş Durumu</th>
                      <th className="p-3.5">Kargo Takip No</th>
                      <th className="p-3.5 text-right">Durum Değiştir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-neutral-900/40">
                        <td className="p-3.5 font-mono font-bold text-white">{ord.orderNumber}</td>
                        <td className="p-3.5">
                          <span className="font-semibold text-white block">{ord.customerName}</span>
                          <span className="text-[10px] text-neutral-400">{ord.customerEmail}</span>
                        </td>
                        <td className="p-3.5 font-bold text-[#FF5A1F]">{ord.total.toLocaleString('tr-TR')} ₺</td>
                        <td className="p-3.5 capitalize font-mono text-[11px]">{ord.paymentMethod.replace('_', ' ')}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-800 text-white">
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {ord.trackingNumber ? (
                            <span className="font-mono text-emerald-400 text-[11px]">{ord.trackingNumber}</span>
                          ) : (
                            <button
                              onClick={() => {
                                const tracking = prompt('Kargo Takip No (Yurtiçi Kargo):');
                                if (tracking) updateOrderStatus(ord.id, 'Kargoda', tracking, 'Yurtiçi Kargo');
                              }}
                              className="text-[#FF5A1F] underline text-[11px]"
                            >
                              + Takip No Gir
                            </button>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-[11px] text-white"
                          >
                            <option value="Beklemede">Beklemede</option>
                            <option value="Hazırlanıyor">Hazırlanıyor</option>
                            <option value="Kargoda">Kargoda</option>
                            <option value="Teslim Edildi">Teslim Edildi</option>
                            <option value="İptal / İade">İptal / İade</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: COACHING & ASSESSMENTS */}
          {activeTab === 'coaching' && (
            <div className="space-y-8">
              {/* Coaching packages editor */}
              <div className="p-6 rounded-2xl bg-[#121212] border border-neutral-800 space-y-4">
                <h4 className="font-heading uppercase text-xs font-bold text-white tracking-wider">
                  Koçluk Paketleri Fiyatlandırması
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {coachingPackages.map((pkg) => (
                    <div key={pkg.id} className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <h5 className="font-display text-xl font-bold text-white">{pkg.name}</h5>
                        <span className="text-[10px] text-[#FF5A1F] font-bold">{pkg.badge}</span>
                      </div>
                      <p className="text-neutral-400 text-[11px] line-clamp-2">{pkg.tagline}</p>
                      <div className="space-y-1 font-mono text-[11px]">
                        {pkg.durations.map((d) => (
                          <div key={d.months} className="flex justify-between">
                            <span>{d.months} Ay:</span>
                            <span className="text-white font-bold">{d.price} ₺</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Incoming assessments */}
              <div className="p-6 rounded-2xl bg-[#121212] border border-neutral-800 space-y-4">
                <h4 className="font-heading uppercase text-xs font-bold text-white tracking-wider">
                  Gelen Ön Değerlendirme Formları ({assessments.length})
                </h4>

                <div className="space-y-3">
                  {assessments.map((a) => (
                    <div key={a.id} className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{a.fullName} ({a.age} Yaş, {a.height}cm / {a.weight}kg)</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${a.reviewedByCoach ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {a.reviewedByCoach ? 'İncelendi' : 'İnceleme Bekliyor'}
                        </span>
                      </div>
                      <p className="text-neutral-400">
                        Hedef: <strong className="text-white">{a.primaryGoal}</strong> • Deneyim: {a.experienceLevel} • Gün: {a.trainingDaysPerWeek} Gün
                      </p>
                      {a.injuriesOrHealthIssues && (
                        <p className="text-rose-400 text-[11px]">Sakatlık: {a.injuriesOrHealthIssues}</p>
                      )}
                      <button
                        onClick={() => {
                          const feedback = prompt('Kadir Hoca Notu ve Egzersiz/Beslenme Geri Bildirimi:');
                          if (feedback) reviewAssessment(a.id, feedback);
                        }}
                        className="px-3 py-1 bg-neutral-800 hover:bg-[#FF5A1F] text-white text-[11px] font-bold rounded transition-colors"
                      >
                        {a.reviewedByCoach ? 'Geri Bildirimi Güncelle' : 'Programı Hazırla & Onayla'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MEMBERS MANAGEMENT */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="font-heading uppercase text-xs font-bold text-white tracking-wider">
                  Kayıtlı Üye ve Öğrenci Listesi ({users.length})
                </h4>
                <button
                  onClick={() => alert('Üye listesi CSV olarak indirildi.')}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV Dışa Aktar</span>
                </button>
              </div>

              <div className="bg-[#121212] border border-neutral-800 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-900 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                    <tr>
                      <th className="p-3.5">Ad Soyad</th>
                      <th className="p-3.5">E-Posta / Telefon</th>
                      <th className="p-3.5">Rol</th>
                      <th className="p-3.5">Koçluk Durumu</th>
                      <th className="p-3.5">Hesap Durumu</th>
                      <th className="p-3.5 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-neutral-900/40">
                        <td className="p-3.5 font-bold text-white">{u.firstName} {u.lastName}</td>
                        <td className="p-3.5">
                          <span>{u.email}</span>
                          <span className="block text-[10px] text-neutral-500">{u.phone}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF5A1F]/15 text-[#FF5A1F]">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {u.activeCoachingPackageId ? (
                            <span className="text-emerald-400 font-semibold text-[11px]">Aktif Dönüşüm Paketi</span>
                          ) : (
                            <span className="text-neutral-500 text-[11px]">Paket Yok</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.suspended ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {u.suspended ? 'Askıda' : 'Aktif'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => {
                              const note = prompt(`${u.firstName} için haftalık check-in değerlendirme notu yazın:`);
                              if (note && checkIns.length > 0) {
                                addCoachNotesToCheckIn(checkIns[0].id, note);
                                alert('Not öğrenci paneline iletildi!');
                              }
                            }}
                            className="px-2 py-1 bg-neutral-800 hover:bg-[#FF5A1F] text-white rounded text-[10px] font-bold"
                          >
                            Not Yaz
                          </button>
                          <button
                            onClick={() => updateUserStatus(u.id, !u.suspended)}
                            className="text-neutral-400 hover:text-white text-[11px]"
                          >
                            {u.suspended ? 'Aktifleştir' : 'Askıya Al'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="font-heading uppercase text-xs font-bold text-white tracking-wider">
                  Kupon ve Kampanya Kodları ({coupons.length})
                </h4>
                <button
                  onClick={() => {
                    const code = prompt('Kupon Kodu (Örn: YAZ15):');
                    if (!code) return;
                    const val = prompt('İndirim Değeri (% veya TL):', '15');
                    const newC: Coupon = {
                      id: `coup-${Date.now()}`,
                      code: code.toUpperCase(),
                      type: 'percentage',
                      value: parseInt(val || '10'),
                      minCartAmount: 500,
                      expiresAt: '2027-12-31',
                      usageCount: 0,
                      usageLimit: 500,
                      isActive: true
                    };
                    addCoupon(newC);
                  }}
                  className="px-3.5 py-1.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold rounded flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yeni Kupon Oluştur</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl bg-[#121212] border border-neutral-800 flex justify-between items-center">
                    <div>
                      <span className="font-mono text-base font-black text-[#FF5A1F]">{c.code}</span>
                      <p className="text-xs text-neutral-300">
                        {c.type === 'percentage' ? `%${c.value} İndirim` : `${c.value} TL İndirim`}
                      </p>
                      <span className="text-[10px] text-neutral-500">Min. {c.minCartAmount} TL Sepet</span>
                    </div>
                    <button
                      onClick={() => deleteCoupon(c.id)}
                      className="p-2 text-neutral-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: CONTENT (BLOG, FAQ, TESTIMONIALS) */}
          {activeTab === 'content' && (
            <div className="space-y-8">
              {/* Blog Management */}
              <div className="p-6 rounded-2xl bg-[#121212] border border-neutral-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-heading uppercase text-xs font-bold text-white tracking-wider">
                    Blog Makaleleri ({blogPosts.length})
                  </h4>
                  <button
                    onClick={() => {
                      const title = prompt('Makale Başlığı:');
                      if (!title) return;
                      addBlogPost({
                        id: `blog-${Date.now()}`,
                        title,
                        slug: title.toLowerCase().replace(/ /g, '-'),
                        category: 'Antrenman Bilimi',
                        readTime: '5 dk okuma',
                        publishDate: new Date().toISOString().split('T')[0],
                        author: 'Kadir Arslan',
                        coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
                        excerpt: 'Yeni yayınlanan bilimsel fitness rehberi.',
                        content: 'Detaylı makale içeriği...',
                        published: true
                      });
                    }}
                    className="px-3 py-1.5 bg-[#FF5A1F] text-white text-xs font-bold rounded flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Makale Ekle</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {blogPosts.map((b) => (
                    <div key={b.id} className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white block">{b.title}</span>
                        <span className="text-[10px] text-neutral-500">{b.category} • {b.publishDate}</span>
                      </div>
                      <button onClick={() => deleteBlogPost(b.id)} className="text-neutral-500 hover:text-rose-400 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Testimonials Approval */}
              <div className="p-6 rounded-2xl bg-[#121212] border border-neutral-800 space-y-4">
                <h4 className="font-heading uppercase text-xs font-bold text-white tracking-wider">
                  Öğrenci Yorumları Onay Durumu ({testimonials.length})
                </h4>

                <div className="space-y-2">
                  {testimonials.map((test) => (
                    <div key={test.id} className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white">{test.name} ({test.roleOrCity})</span>
                        <p className="text-neutral-400 text-[11px] line-clamp-1">"{test.comment}"</p>
                      </div>
                      <button
                        onClick={() => toggleTestimonialApproval(test.id)}
                        className={`px-3 py-1 rounded text-[11px] font-bold ${
                          test.approved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {test.approved ? 'Yayınlanıyor' : 'Onay Bekliyor'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-heading uppercase text-xs font-bold text-white tracking-wider">
                  VIP E-Bülten Kayıtlı Aboneler ({newsletterSubscribers.length})
                </h4>
                <button
                  onClick={() => alert(`Aboneler CSV olarak dışa aktarıldı (${newsletterSubscribers.length} e-posta)`)}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>E-Posta Listesini İndir (CSV)</span>
                </button>
              </div>

              <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-4 space-y-2">
                {newsletterSubscribers.map((email, idx) => (
                  <div key={idx} className="p-2.5 bg-neutral-900/50 rounded-lg border border-neutral-800 text-xs flex justify-between text-neutral-300">
                    <span className="font-mono">{email}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Aktif İzinli</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: SETTINGS & COLOR PALETTE */}
          {activeTab === 'settings' && (
            <div className="space-y-8 max-w-2xl">
              
              {/* Brand & Accent Color Picker */}
              <div className="p-6 rounded-2xl bg-[#121212] border border-neutral-800 space-y-4">
                <h4 className="font-heading uppercase text-xs font-bold text-white tracking-wider">
                  Marka Vurgu Rengi (Accent Color)
                </h4>
                <p className="text-xs text-neutral-400">
                  Varsayılan elektrik turuncusu (#FF5A1F). Seçtiğiniz renk tüm sitedeki butonlarda ve vurgularda anında aktif olur.
                </p>

                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => updateSettings({ accentColor: e.target.value })}
                    className="w-12 h-12 rounded-lg bg-transparent border border-neutral-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.accentColor}
                    onChange={(e) => updateSettings({ accentColor: e.target.value })}
                    className="bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white font-mono uppercase"
                  />

                  {/* Preset quick colors */}
                  <div className="flex gap-2">
                    {['#FF5A1F', '#E63946', '#2563EB', '#10B981', '#F59E0B'].map((hex) => (
                      <button
                        key={hex}
                        onClick={() => updateSettings({ accentColor: hex })}
                        style={{ backgroundColor: hex }}
                        className="w-7 h-7 rounded-full border border-white/20 hover:scale-110 transition-transform"
                        title={hex}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Shipping & Payment settings */}
              <div className="p-6 rounded-2xl bg-[#121212] border border-neutral-800 space-y-4 text-xs">
                <h4 className="font-heading uppercase text-xs font-bold text-white tracking-wider">
                  Kargo ve Ödeme Ayarları
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-400 block mb-1">Ücretsiz Kargo Limiti (TL)</label>
                    <input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) => updateSettings({ freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Standart Kargo Ücreti (TL)</label>
                    <input
                      type="number"
                      value={settings.standardShippingFee}
                      onChange={(e) => updateSettings({ standardShippingFee: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-neutral-400 block mb-1">WhatsApp Danışma Numarası</label>
                  <input
                    type="text"
                    value={settings.contactWhatsApp}
                    onChange={(e) => updateSettings({ contactWhatsApp: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Legal Texts Editor */}
              <div className="p-6 rounded-2xl bg-[#121212] border border-neutral-800 space-y-4 text-xs">
                <h4 className="font-heading uppercase text-xs font-bold text-white tracking-wider">
                  Türkiye Yasal Sözleşme Metinleri
                </h4>

                <div>
                  <label className="text-neutral-400 block mb-1">KVKK Aydınlatma Metni</label>
                  <textarea
                    value={settings.kvkkText}
                    onChange={(e) => updateSettings({ kvkkText: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white text-[11px]"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Mesafeli Satış Sözleşmesi</label>
                  <textarea
                    value={settings.distanceSalesContractText}
                    onChange={(e) => updateSettings({ distanceSalesContractText: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-white text-[11px]"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
