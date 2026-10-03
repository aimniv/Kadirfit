import React, { useState } from 'react';
import {
  User as UserIcon,
  ShoppingBag,
  ShieldCheck,
  Heart,
  MapPin,
  Tag,
  Settings,
  Activity,
  FileText,
  Download,
  Upload,
  Calendar,
  ChevronRight,
  TrendingDown,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useDialog } from '../../context/DialogContext';
import { Order, CheckIn, Address } from '../../types';

interface UserDashboardProps {
  initialTab?: string;
  onNavigateToShop: () => void;
  onOpenAssessment: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  initialTab = 'overview',
  onNavigateToShop,
  onOpenAssessment
}) => {
  const {
    currentUser,
    orders,
    checkIns,
    submitCheckIn,
    assessments,
    wishlist,
    products,
    coupons,
    addToCart,
    toggleWishlist,
    updateProfile,
    openAuthModal,
    deleteUser,
    requestOrderReturn
  } = useApp();

  const { confirm, notify } = useDialog();
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Return request modal
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnSuccess, setReturnSuccess] = useState(false);

  // New check-in form state
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInWeight, setCheckInWeight] = useState('');
  const [checkInWaist, setCheckInWaist] = useState('');
  const [checkInChest, setCheckInChest] = useState('');
  const [checkInArm, setCheckInArm] = useState('');
  const [checkInEnergy, setCheckInEnergy] = useState(5);
  const [checkInSleep, setCheckInSleep] = useState(5);
  const [checkInDiet, setCheckInDiet] = useState(5);
  const [checkInNotes, setCheckInNotes] = useState('');

  // User addresses state
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 'addr-1',
      title: 'Evim',
      fullName: `${currentUser?.firstName || 'Emre'} ${currentUser?.lastName || 'Demir'}`,
      phone: currentUser?.phone || '+90 544 987 65 43',
      city: 'İstanbul',
      district: 'Kadıköy',
      fullAddress: 'Caferağa Mah. Moda Cad. No: 42 Daire: 6',
      postalCode: '34710',
      isDefault: true
    }
  ]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('İstanbul');
  const [newAddrDistrict, setNewAddrDistrict] = useState('');
  const [newAddrFull, setNewAddrFull] = useState('');

  // Profile update form state
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [profileSaved, setProfileSaved] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#0A0A0A]">
        <UserIcon className="w-12 h-12 text-neutral-600 mb-4" />
        <h3 className="font-heading uppercase text-xl font-bold text-white mb-2">
          Hesabınıza Giriş Yapınız
        </h3>
        <p className="text-neutral-400 text-xs max-w-sm mb-6">
          Siparişlerinizi ve koçluk alanınızı görüntülemek için lütfen oturum açın.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold uppercase tracking-wider rounded-lg"
        >
          Giriş Yap / Kayıt Ol
        </button>
      </div>
    );
  }

  // Filter user data
  const userOrders = orders.filter(o => o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() || o.userId === currentUser.id);
  const userCheckIns = checkIns.filter(c => c.userId === currentUser.id);
  const userAssessment = assessments.find(a => a.userId === currentUser.id || a.userEmail === currentUser.email);
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  // Handle return request
  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnOrderId || !returnReason) return;
    requestOrderReturn(returnOrderId, returnReason);
    setReturnSuccess(true);
    setTimeout(() => {
      setReturnSuccess(false);
      setReturnOrderId(null);
      setReturnReason('');
    }, 1500);
  };

  // Handle check-in submit
  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInWeight) return;

    submitCheckIn({
      userId: currentUser.id,
      weekNumber: userCheckIns.length + 1,
      weight: parseFloat(checkInWeight),
      waistCm: checkInWaist ? parseFloat(checkInWaist) : undefined,
      chestCm: checkInChest ? parseFloat(checkInChest) : undefined,
      armCm: checkInArm ? parseFloat(checkInArm) : undefined,
      energyLevelRating: checkInEnergy,
      sleepQualityRating: checkInSleep,
      dietAdherenceRating: checkInDiet,
      clientNotes: checkInNotes
    });

    setShowCheckInModal(false);
    setCheckInWeight('');
    setCheckInWaist('');
    setCheckInNotes('');
  };

  // Handle add address
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrTitle || !newAddrDistrict || !newAddrFull) return;
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      title: newAddrTitle,
      fullName: `${currentUser.firstName} ${currentUser.lastName}`,
      phone: currentUser.phone || '',
      city: newAddrCity,
      district: newAddrDistrict,
      fullAddress: newAddrFull,
      isDefault: false
    };
    setAddresses(prev => [...prev, newAddr]);
    setShowAddAddress(false);
    setNewAddrTitle('');
    setNewAddrDistrict('');
    setNewAddrFull('');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header Card */}
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-full bg-neutral-800 border-2 border-[#FF5A1F] flex items-center justify-center font-display font-black text-white text-2xl overflow-hidden shrink-0">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.firstName} className="w-full h-full object-cover" />
              ) : (
                <span>{currentUser.firstName[0]}</span>
              )}
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-wide">
                  {currentUser.firstName} {currentUser.lastName}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FF5A1F]/20 text-[#FF5A1F] border border-[#FF5A1F]/40">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          {/* Active Coaching Badge */}
          <div className="p-3 bg-black/60 rounded-xl border border-neutral-800 text-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF5A1F]/15 flex items-center justify-center text-[#FF5A1F]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-neutral-400 uppercase font-semibold">Aktif Koçluk</p>
              <p className="text-white font-bold">Dönüşüm Planı (32 Gün Kaldı)</p>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 border-b border-neutral-800 text-xs font-semibold uppercase tracking-wider">
          {[
            { id: 'overview', label: 'Genel Bakış', icon: Activity },
            { id: 'orders', label: `Siparişlerim (${userOrders.length})`, icon: ShoppingBag },
            { id: 'coaching', label: 'Koçluk Alanım & Check-in', icon: ShieldCheck },
            { id: 'wishlist', label: `Favorilerim (${wishlistProducts.length})`, icon: Heart },
            { id: 'addresses', label: 'Adreslerim', icon: MapPin },
            { id: 'coupons', label: 'Kuponlarım', icon: Tag },
            { id: 'settings', label: 'Hesap Ayarları', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FF5A1F] border-[#FF5A1F] text-white shadow-md'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Quick Card 1: Active Coaching Package */}
              <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-wider">Aktif Paket</span>
                  <ShieldCheck className="w-5 h-5 text-[#FF5A1F]" />
                </div>
                <h4 className="font-display text-2xl font-black text-white">DÖNÜŞÜM PLANI</h4>
                <p className="text-xs text-neutral-400">
                  Antrenör: Kadir Arslan • Haftalık Check-in: Her Pazar
                </p>
                <button
                  onClick={() => setActiveTab('coaching')}
                  className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase rounded transition-colors"
                >
                  Koçluk Alanına Git
                </button>
              </div>

              {/* Quick Card 2: Recent Order */}
              <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Son Sipariş</span>
                  <ShoppingBag className="w-5 h-5 text-neutral-400" />
                </div>
                {userOrders.length > 0 ? (
                  <>
                    <h4 className="font-display text-xl font-bold text-white truncate">
                      {userOrders[0].items[0]?.title}
                    </h4>
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Durum: <strong className="text-emerald-400">{userOrders[0].status}</strong></span>
                      <span>{userOrders[0].total.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase rounded transition-colors"
                    >
                      Sipariş Detayı & Kargo
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-neutral-500 py-4">Henüz siparişiniz bulunmamaktadır.</p>
                )}
              </div>

              {/* Quick Card 3: Free Assessment */}
              <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Ön Değerlendirme</span>
                  <Activity className="w-5 h-5 text-neutral-400" />
                </div>
                <h4 className="font-display text-xl font-bold text-white">
                  {userAssessment ? 'FORMUNUZ ALINDI' : 'FORMUNUZU DOLDURUN'}
                </h4>
                <p className="text-xs text-neutral-400">
                  {userAssessment ? 'Kadir Hoca verilerinizi inceledi.' : 'Koçunuzun programı yazması için formu iletin.'}
                </p>
                <button
                  onClick={onOpenAssessment}
                  className="w-full py-2 bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold uppercase rounded transition-colors"
                >
                  {userAssessment ? 'Formu Görüntüle / Güncelle' : 'Formu Şimdi Doldur'}
                </button>
              </div>
            </div>

            {/* Quick coaching progress snapshot */}
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
              <h3 className="font-heading uppercase text-sm font-bold text-white tracking-wider flex items-center justify-between">
                <span>Vücut Ağırlığı İlerleme Özeti</span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" /> -2.6 kg (4 Haftada)
                </span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-black/60 rounded-xl border border-neutral-800">
                  <span className="text-neutral-500 block">Başlangıç Kilosu:</span>
                  <span className="font-bold text-white text-base">87.8 kg</span>
                </div>
                <div className="p-3 bg-black/60 rounded-xl border border-neutral-800">
                  <span className="text-neutral-500 block">Son Ölçülen Kilo:</span>
                  <span className="font-bold text-[#FF5A1F] text-base">85.2 kg</span>
                </div>
                <div className="p-3 bg-black/60 rounded-xl border border-neutral-800">
                  <span className="text-neutral-500 block">Bel İncelmesi:</span>
                  <span className="font-bold text-emerald-400 text-base">-4 cm</span>
                </div>
                <div className="p-3 bg-black/60 rounded-xl border border-neutral-800">
                  <span className="text-neutral-500 block">Kol Çevresi:</span>
                  <span className="font-bold text-amber-400 text-base">+0.5 cm (39 cm)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {userOrders.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800">
                <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">Henüz Siparişiniz Yok</h4>
                <p className="text-xs text-neutral-400 mb-4">Giyim, takviye veya koçluk paketlerimizi inceleyin.</p>
                <button
                  onClick={onNavigateToShop}
                  className="px-6 py-2.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold uppercase rounded"
                >
                  Mağazaya Git
                </button>
              </div>
            ) : (
              userOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4"
                >
                  {/* Order header row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800 text-xs">
                    <div>
                      <span className="text-neutral-400">Sipariş No: </span>
                      <strong className="text-white font-mono">{ord.orderNumber}</strong>
                      <span className="text-neutral-600 mx-2">|</span>
                      <span className="text-neutral-400">{new Date(ord.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                        ord.status === 'Teslim Edildi' ? 'bg-emerald-500/20 text-emerald-400' :
                        ord.status === 'Kargoda' ? 'bg-sky-500/20 text-sky-400' :
                        ord.status === 'Hazırlanıyor' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-neutral-800 text-neutral-300'
                      }`}>
                        {ord.status}
                      </span>
                      <span className="font-bold text-sm text-[#FF5A1F]">
                        {ord.total.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-3">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded object-cover bg-black shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-white truncate">{item.title}</h5>
                          <p className="text-[11px] text-neutral-400">
                            {item.quantity} Adet {item.selectedVariantText ? `• ${item.selectedVariantText}` : ''}
                          </p>
                        </div>
                        <span className="font-semibold text-white">
                          {(item.unitPrice * item.quantity).toLocaleString('tr-TR')} ₺
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tracking & Invoice Actions */}
                  <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    {ord.trackingNumber ? (
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400">{ord.cargoCompany || 'Yurtiçi Kargo'}:</span>
                        <a
                          href={ord.trackingUrl || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#FF5A1F] font-mono hover:underline font-bold"
                        >
                          {ord.trackingNumber} ↗
                        </a>
                      </div>
                    ) : (
                      <span className="text-neutral-500 italic text-[11px]">Kargo takip kodu hazırlanıyor</span>
                    )}

                    <div className="flex items-center gap-2 ml-auto">
                      {/* Invoice PDF download simulator */}
                      <button
                        onClick={() => notify(`Fatura (${ord.orderNumber}.pdf) indiriliyor...`)}
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>E-Fatura</span>
                      </button>

                      {/* Return/Exchange request */}
                      {!ord.returnRequested && ord.status !== 'İptal / İade' && (
                        <button
                          onClick={() => setReturnOrderId(ord.id)}
                          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>İade / Değişim Talebi</span>
                        </button>
                      )}
                      {ord.returnRequested && (
                        <span className="text-amber-400 text-[11px] font-semibold">
                          İade Talebi İnceleniyor
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: COACHING HUB & CHECK-IN */}
        {activeTab === 'coaching' && (
          <div className="space-y-8">
            
            {/* Coaching Header Card */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-wider block mb-1">
                  KADIRFIT VIP ÖĞRENCİ PANELİ
                </span>
                <h3 className="font-display text-3xl font-black text-white">DÖNÜŞÜM PLANI (3 AY)</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-lg">
                  Kişiye özel hipertrofi ve yağ yakımı antrenman programınız, beslenme stratejiniz ve haftalık check-in alanınız buradadır.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowCheckInModal(true)}
                  className="px-5 py-3 bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Haftalık Check-in Yap</span>
                </button>

                <button
                  onClick={onOpenAssessment}
                  className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg transition-colors text-center"
                >
                  Ön Değerlendirme Formum
                </button>
              </div>
            </div>

            {/* Program Downloads (PDF Simulation) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-neutral-900/40 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">Antrenman Programım v2.4 (PDF)</h5>
                    <p className="text-[11px] text-neutral-400">Push-Pull-Legs 4 Günlük Bölünme</p>
                  </div>
                </div>
                <button
                  onClick={() => notify('Antrenman_Programi_Kadirfit.pdf indirildi.', 'success')}
                  className="p-2 bg-neutral-800 hover:bg-[#FF5A1F] text-white rounded transition-colors"
                  title="İndir"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 rounded-xl bg-neutral-900/40 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">Beslenme & Makro Rehberim (PDF)</h5>
                    <p className="text-[11px] text-neutral-400">2.400 kcal • 185g Protein • Esnek Diyet</p>
                  </div>
                </div>
                <button
                  onClick={() => notify('Beslenme_Programi_Kadirfit.pdf indirildi.', 'success')}
                  className="p-2 bg-neutral-800 hover:bg-[#FF5A1F] text-white rounded transition-colors"
                  title="İndir"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Check-ins Timeline & Coach Feedback */}
            <div className="space-y-4">
              <h4 className="font-heading uppercase text-sm font-bold text-white tracking-wider">
                Geçmiş Check-in'ler ve Kadir Hoca'nın Notları
              </h4>

              {userCheckIns.map((chk) => (
                <div
                  key={chk.id}
                  className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-800 text-xs">
                    <span className="font-bold text-white">
                      Hafta {chk.weekNumber} Raporu ({chk.date})
                    </span>
                    <div className="flex items-center gap-4 text-neutral-300">
                      <span>Kilo: <strong className="text-[#FF5A1F] font-bold">{chk.weight} kg</strong></span>
                      {chk.waistCm && <span>Bel: <strong className="text-white">{chk.waistCm} cm</strong></span>}
                      {chk.armCm && <span>Kol: <strong className="text-white">{chk.armCm} cm</strong></span>}
                    </div>
                  </div>

                  {/* Student note */}
                  <div className="text-xs text-neutral-300">
                    <p className="text-[11px] text-neutral-500 font-semibold mb-1">Senin Notun:</p>
                    <p className="italic bg-black/40 p-3 rounded-lg border border-neutral-800">
                      "{chk.clientNotes}"
                    </p>
                  </div>

                  {/* Coach feedback */}
                  {chk.coachNotes && (
                    <div className="p-4 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 text-xs">
                      <div className="flex items-center gap-1.5 text-[#FF5A1F] font-bold mb-1">
                        <Check className="w-4 h-4" />
                        <span>Kadir Hoca'nın Değerlendirmesi:</span>
                      </div>
                      <p className="text-neutral-200 leading-relaxed">
                        {chk.coachNotes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800">
                <Heart className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">Favori Listeniz Boş</h4>
                <p className="text-xs text-neutral-400 mb-4">Beğendiğiniz ürünlerin kalbine tıklayarak buraya ekleyebilirsiniz.</p>
                <button
                  onClick={onNavigateToShop}
                  className="px-6 py-2.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold uppercase rounded"
                >
                  Ürünleri Keşfet
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {wishlistProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <img src={p.images[0]} alt={p.title} className="w-full aspect-square rounded-lg object-cover bg-black mb-3" />
                      <h5 className="font-semibold text-xs text-white line-clamp-1">{p.title}</h5>
                      <span className="font-bold text-sm text-[#FF5A1F] block mt-1">
                        {(p.discountedPrice || p.price).toLocaleString('tr-TR')} ₺
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-neutral-800">
                      <button
                        onClick={() => addToCart({
                          id: `cart-fav-${p.id}-${Date.now()}`,
                          productId: p.id,
                          title: p.title,
                          price: p.discountedPrice || p.price,
                          image: p.images[0],
                          quantity: 1
                        })}
                        className="flex-1 py-2 bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold rounded uppercase transition-colors"
                      >
                        Sepete Ekle
                      </button>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="p-2 bg-neutral-800 hover:text-rose-400 text-neutral-400 rounded"
                        title="Favorilerden Kaldır"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-heading uppercase text-sm font-bold text-white">
                Kayıtlı Teslimat ve Fatura Adreslerim
              </h4>
              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="px-3.5 py-1.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold rounded flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yeni Adres Ekle</span>
              </button>
            </div>

            {/* Add Address Form */}
            {showAddAddress && (
              <form onSubmit={handleAddAddress} className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
                <h5 className="font-bold text-xs text-white uppercase">Yeni Adres Bilgileri</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Adres Başlığı (Örn: İş Yerim)"
                    value={newAddrTitle}
                    onChange={(e) => setNewAddrTitle(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Şehir (Örn: İstanbul)"
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="İlçe (Örn: Kadıköy)"
                    value={newAddrDistrict}
                    onChange={(e) => setNewAddrDistrict(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white"
                    required
                  />
                </div>
                <textarea
                  placeholder="Cadde, Mahalle, Sokak, No, Daire..."
                  value={newAddrFull}
                  onChange={(e) => setNewAddrFull(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white"
                  rows={2}
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF5A1F] text-white text-xs font-bold uppercase rounded"
                >
                  Adresi Kaydet
                </button>
              </form>
            )}

            {/* Addresses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="p-5 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white uppercase text-xs">{addr.title}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                        Varsayılan
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-300 font-medium">{addr.fullName} ({addr.phone})</p>
                  <p className="text-neutral-400">{addr.fullAddress}</p>
                  <p className="text-neutral-400">{addr.district} / {addr.city}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-4">
            <h4 className="font-heading uppercase text-sm font-bold text-white mb-2">
              Hesabınıza Tanımlı Kampanya ve İndirim Kuponları
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-xl bg-neutral-900/60 border border-dashed border-[#FF5A1F]/50 flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono text-base font-black text-[#FF5A1F] tracking-wider block">
                      {c.code}
                    </span>
                    <p className="text-xs text-neutral-300 mt-0.5">
                      {c.type === 'percentage' ? `%${c.value} İndirim` : `${c.value} TL İndirim`}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Minimum {c.minCartAmount} TL sepet tutarında geçerli
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(c.code);
                      notify(`"${c.code}" kodu kopyalandı!`, 'success');
                    }}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-[#FF5A1F] text-white text-xs font-bold rounded transition-colors"
                  >
                    Kodu Kopyala
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS & KVKK ACCOUNT DELETION */}
        {activeTab === 'settings' && (
          <div className="max-w-xl space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
              <h4 className="font-heading uppercase text-sm font-bold text-white">
                Profil Bilgilerimi Güncelle
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Ad</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Soyad</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Telefon Numarası</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white"
                />
              </div>

              <button
                onClick={async () => {
                  const res = await updateProfile({ firstName, lastName, phone });
                  if (!res.success) {
                    notify(res.message || 'Profil güncellenemedi.', 'error');
                    return;
                  }
                  setProfileSaved(true);
                  setTimeout(() => setProfileSaved(false), 2000);
                }}
                className="px-5 py-2.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold uppercase rounded transition-colors"
              >
                Değişiklikleri Kaydet
              </button>

              {profileSaved && (
                <span className="text-xs text-emerald-400 ml-3 font-semibold">
                  ✓ Profil güncellendi!
                </span>
              )}
            </div>

            {/* KVKK Account Deletion */}
            <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
              <h4 className="font-heading uppercase text-sm font-bold text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Hesabımı Sil (KVKK Unutulma Hakkı)
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                6698 sayılı KVKK uyarınca üyeliğinizi ve kişisel verilerinizi platformumuzdan kalıcı olarak silebilirsiniz. Aktif koçluk süreciniz sonlanır.
              </p>
              <button
                onClick={async () => {
                  const ok = await confirm({
                    title: 'Hesabı kalıcı olarak sil',
                    message: 'Hesabınız ve tüm verileriniz kalıcı olarak silinecek. Bu işlem geri alınamaz.',
                    confirmLabel: 'Hesabımı Sil',
                    danger: true
                  });
                  if (ok) deleteUser(currentUser.id);
                }}
                className="px-4 py-2 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold rounded uppercase transition-colors"
              >
                Hesabımı Kalıcı Olarak Sil
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Check-in Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#161616] border border-neutral-700 rounded-2xl p-6 relative space-y-4">
            <button
              onClick={() => setShowCheckInModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              ×
            </button>
            <h4 className="font-heading uppercase text-base font-bold text-white">
              Haftalık İlerleme Check-in Formu
            </h4>
            <p className="text-xs text-neutral-400">
              Pazar sabahı aç karnına tartılıp ölçülerinizi giriniz.
            </p>

            <form onSubmit={handleCheckInSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Aç Karnına Kilo (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={checkInWeight}
                    onChange={(e) => setCheckInWeight(e.target.value)}
                    placeholder="84.5"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Bel Çevresi (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={checkInWaist}
                    onChange={(e) => setCheckInWaist(e.target.value)}
                    placeholder="84"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Göğüs Çevresi (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={checkInChest}
                    onChange={(e) => setCheckInChest(e.target.value)}
                    placeholder="104"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Kol Çevresi (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={checkInArm}
                    onChange={(e) => setCheckInArm(e.target.value)}
                    placeholder="39"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Bu Haftaki Antrenman & Diyet Notların:</label>
                <textarea
                  value={checkInNotes}
                  onChange={(e) => setCheckInNotes(e.target.value)}
                  placeholder="Kaldırdığın ağırlıklardaki artışlar, halsizlik, açlık durumu veya soruların..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white"
                  rows={3}
                />
              </div>

              <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#FF5A1F]" />
                <span>Form fotoğrafları (Ön, Yan, Arka) WhatsApp hattından iletilmektedir.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold uppercase rounded-lg transition-colors"
              >
                Raporu Kadir Hoca'ya Gönder
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Return Order Modal */}
      {returnOrderId && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#161616] border border-neutral-700 rounded-2xl p-6 relative space-y-4">
            <button
              onClick={() => setReturnOrderId(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              ×
            </button>
            <h4 className="font-heading uppercase text-base font-bold text-white">
              İade / Değişim Talebi Oluştur
            </h4>
            <p className="text-xs text-neutral-400">
              14 gün içinde kullanılmamış fiziksel ürünler için ücretsiz Yurtiçi Kargo iade kodu alabilirsiniz.
            </p>

            {returnSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded text-center">
                ✓ İade talebiniz onaylandı! Kargo iade kodunuz: <strong>YK-984210</strong>
              </div>
            ) : (
              <form onSubmit={handleSubmitReturn} className="space-y-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">İade / Değişim Sebebi</label>
                  <textarea
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    placeholder="Beden uymadı, renk değişimi istiyorum..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-xs text-white"
                    rows={3}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold uppercase rounded"
                >
                  Talebi Gönder
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
