import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Building2,
  Truck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Address, Order } from '../../types';

interface CheckoutPageProps {
  onBackToShop: () => void;
  onOrderCompleted: (order: Order) => void;
  onOpenLegal: (type: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBackToShop,
  onOrderCompleted,
  onOpenLegal
}) => {
  const {
    cart,
    currentUser,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
    appliedCoupon,
    createOrder,
    settings
  } = useApp();

  // Customer Contact
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+90 ');

  // Address
  const [addressTitle, setAddressTitle] = useState('Evim');
  const [city, setCity] = useState('İstanbul');
  const [district, setDistrict] = useState('Kadıköy');
  const [fullAddress, setFullAddress] = useState('');
  const [postalCode, setPostalCode] = useState('34710');

  // Corporate Invoice Option
  const [isCorporate, setIsCorporate] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [taxOffice, setTaxOffice] = useState('');
  const [taxNumber, setTaxNumber] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'bank_transfer' | 'cash_on_delivery'>('credit_card');

  // Card details (simulation)
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installment, setInstallment] = useState('1');

  // Mandatory Legal Agreements
  const [agreedPreInfo, setAgreedPreInfo] = useState(false);
  const [agreedDistanceSales, setAgreedDistanceSales] = useState(false);

  // Form error
  const [formError, setFormError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const turkishCities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya',
    'Gaziantep', 'Kocaeli', 'Eskişehir', 'Mersin', 'Kayseri', 'Samsun', 'Trabzon'
  ];

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!firstName || !lastName || !email || !phone) {
      setFormError('Lütfen ad, soyad, e-posta ve telefon bilgilerinizi eksiksiz doldurunuz.');
      return;
    }

    if (!fullAddress) {
      setFormError('Lütfen açık teslimat adresinizi yazınız.');
      return;
    }

    if (!agreedPreInfo || !agreedDistanceSales) {
      setFormError('Siparişi tamamlamak için Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi onaylanmalıdır.');
      return;
    }

    if (paymentMethod === 'credit_card' && (!cardNumber || !cardHolder || !cardExpiry || !cardCvv)) {
      setFormError('Lütfen kredi kartı bilgilerinizi eksiksiz doldurunuz.');
      return;
    }

    setIsProcessing(true);

    const shippingAddress: Address = {
      id: `addr-${Date.now()}`,
      title: addressTitle,
      fullName: `${firstName} ${lastName}`,
      phone,
      city,
      district,
      fullAddress,
      postalCode,
      isCorporate,
      companyName: isCorporate ? companyName : undefined,
      taxOffice: isCorporate ? taxOffice : undefined,
      taxNumber: isCorporate ? taxNumber : undefined
    };

    setTimeout(() => {
      const order = createOrder({
        userId: currentUser?.id,
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress,
        billingAddress: shippingAddress,
        items: cart.map(item => ({
          productId: item.productId,
          title: item.title,
          quantity: item.quantity,
          unitPrice: item.price,
          selectedVariantText: [
            item.selectedSize ? `Beden: ${item.selectedSize}` : null,
            item.selectedColor ? `Renk: ${item.selectedColor}` : null,
            item.selectedFlavor ? `Aroma: ${item.selectedFlavor}` : null,
            item.selectedWeight ? `Gramaj: ${item.selectedWeight}` : null,
            item.coachingDurationMonths ? `${item.coachingDurationMonths} Ay Koçluk` : null
          ].filter(Boolean).join(' • '),
          image: item.image,
          isCoaching: item.isCoachingPackage
        })),
        subtotal: cartSubtotal,
        discountAmount: cartDiscount,
        couponCode: appliedCoupon?.code,
        shippingFee: cartShippingFee,
        total: cartTotal,
        status: 'Hazırlanıyor',
        paymentMethod,
        paymentStatus: paymentMethod === 'credit_card' ? 'paid' : 'pending'
      });

      setIsProcessing(false);
      onOrderCompleted(order);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Back bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToShop}
            className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Alışverişe Dön</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Güvenli Ödeme Aşaması</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Customer & Delivery & Payment details */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Customer Contact */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
              <h3 className="font-heading uppercase text-base font-bold text-white tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FF5A1F] text-white text-xs flex items-center justify-center font-bold">1</span>
                İletişim Bilgileri
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Ad *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5A1F]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Soyad *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5A1F]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">E-posta (Sipariş Takibi İçin) *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5A1F]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Telefon (+90...) *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+90 5XX XXX XX XX"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5A1F]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
              <h3 className="font-heading uppercase text-base font-bold text-white tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FF5A1F] text-white text-xs flex items-center justify-center font-bold">2</span>
                Teslimat ve Fatura Adresi
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Adres Başlığı</label>
                  <input
                    type="text"
                    value={addressTitle}
                    onChange={(e) => setAddressTitle(e.target.value)}
                    placeholder="Evim, İş Yeri..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Şehir / İl *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5A1F]"
                  >
                    {turkishCities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">İlçe *</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5A1F]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Açık Adres (Cadde, Mahalle, Sokak, No, Daire) *</label>
                <textarea
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="Kargonuzun hatasız ulaşması için lütfen apartman adı, kat ve kapı numarasını eksiksiz belirtiniz."
                  rows={2}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5A1F]"
                  required
                />
              </div>

              {/* Corporate Invoice Option */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={isCorporate}
                    onChange={(e) => setIsCorporate(e.target.checked)}
                    className="accent-[#FF5A1F] rounded"
                  />
                  <span>Kurumsal Fatura İstiyorum (Şirket Bilgileri)</span>
                </label>

                {isCorporate && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 p-3 bg-black/40 rounded-lg border border-neutral-800">
                    <div>
                      <label className="text-[11px] text-neutral-400 mb-1 block">Şirket Unvanı</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-neutral-400 mb-1 block">Vergi Dairesi</label>
                      <input
                        type="text"
                        value={taxOffice}
                        onChange={(e) => setTaxOffice(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-neutral-400 mb-1 block">Vergi Numarası / TCKN</label>
                      <input
                        type="text"
                        value={taxNumber}
                        onChange={(e) => setTaxNumber(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
              <h3 className="font-heading uppercase text-base font-bold text-white tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FF5A1F] text-white text-xs flex items-center justify-center font-bold">3</span>
                Ödeme Yöntemi
              </h3>

              {/* Tabs for payment methods */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center gap-2 transition-all ${
                    paymentMethod === 'credit_card'
                      ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#FF5A1F]" />
                  <span className="text-xs font-bold">Kredi / Banka Kartı</span>
                  <span className="text-[10px] text-neutral-400">iyzico / PayTR 3D Secure</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center gap-2 transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-[#FF5A1F]" />
                  <span className="text-xs font-bold">Havale / EFT</span>
                  <span className="text-[10px] text-neutral-400">Garanti / Ziraat Bankası</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center gap-2 transition-all ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Truck className="w-5 h-5 text-[#FF5A1F]" />
                  <span className="text-xs font-bold">Kapıda Ödeme</span>
                  <span className="text-[10px] text-neutral-400">Nakit veya Kart (+30 TL)</span>
                </button>
              </div>

              {/* Credit card inputs */}
              {paymentMethod === 'credit_card' && (
                <div className="pt-2 space-y-3">
                  <div>
                    <label className="text-xs text-neutral-400 mb-1 block">Kart Numarası</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#FF5A1F]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-xs text-neutral-400 mb-1 block">Kart Üzerindeki İsim</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="AD SOYAD"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white uppercase focus:outline-none focus:border-[#FF5A1F]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400 mb-1 block">Son Kullanma (AA/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-center font-mono focus:outline-none focus:border-[#FF5A1F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-neutral-400 mb-1 block">CVV / Güvenlik Kodu</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="***"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-center font-mono focus:outline-none focus:border-[#FF5A1F]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400 mb-1 block">Taksit Seçeneği</label>
                      <select
                        value={installment}
                        onChange={(e) => setInstallment(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5A1F]"
                      >
                        <option value="1">Tek Çekim - {cartTotal.toLocaleString('tr-TR')} ₺</option>
                        <option value="3">3 Taksit - {(cartTotal / 3).toFixed(2)} ₺ / ay</option>
                        <option value="6">6 Taksit - {(cartTotal / 6).toFixed(2)} ₺ / ay</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer info */}
              {paymentMethod === 'bank_transfer' && (
                <div className="p-4 rounded-xl bg-black border border-neutral-800 text-xs space-y-3">
                  <p className="text-neutral-300">
                    Siparişinizi tamamladıktan sonra lütfen açıklama kısmına <strong>Adınızı ve Sipariş Numaranızı</strong> yazarak aşağıdaki hesaplardan birine tutarı transfer ediniz:
                  </p>
                  <div className="p-3 bg-neutral-900 rounded border border-neutral-800 font-mono text-[11px]">
                    <p className="text-white font-bold">{settings.bankIbanGaranti}</p>
                    <p className="text-white font-bold mt-1">{settings.bankIbanZiraat}</p>
                  </div>
                </div>
              )}

              {/* Cash on delivery notice */}
              {paymentMethod === 'cash_on_delivery' && (
                <div className="p-4 rounded-xl bg-black border border-neutral-800 text-xs text-neutral-300">
                  Kargonuzu teslim alırken kapıda kuryeye <strong>Nakit veya Kredi Kartı</strong> ile ödeme yapabilirsiniz. Kapıda tahsilat hizmet bedeli olarak 30 TL faturanıza yansıtılacaktır.
                </div>
              )}
            </div>

            {/* Mandatory Checkboxes */}
            <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={agreedPreInfo}
                  onChange={(e) => setAgreedPreInfo(e.target.checked)}
                  className="accent-[#FF5A1F] mt-0.5 rounded"
                  required
                />
                <span>
                  <button
                    type="button"
                    onClick={() => onOpenLegal('on_bilgilendirme')}
                    className="text-[#FF5A1F] underline hover:text-[#ff7442]"
                  >
                    Ön Bilgilendirme Formu
                  </button>
                  'nu okudum, içeriğini anladım ve kabul ediyorum. *
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={agreedDistanceSales}
                  onChange={(e) => setAgreedDistanceSales(e.target.checked)}
                  className="accent-[#FF5A1F] mt-0.5 rounded"
                  required
                />
                <span>
                  <button
                    type="button"
                    onClick={() => onOpenLegal('mesafeli_satis')}
                    className="text-[#FF5A1F] underline hover:text-[#ff7442]"
                  >
                    Mesafeli Satış Sözleşmesi
                  </button>
                  'ni okudum ve tüm şartları onaylıyorum. *
                </span>
              </label>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {formError}
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Trigger */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 sticky top-28 space-y-5">
              <h3 className="font-heading uppercase text-base font-bold text-white tracking-wider flex items-center justify-between">
                <span>Sipariş Özeti</span>
                <span className="text-xs text-neutral-400 font-normal">({cart.length} Kalem)</span>
              </h3>

              {/* Items preview list */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 rounded object-cover bg-neutral-950 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="text-white font-semibold truncate">{item.title}</h5>
                      <p className="text-[11px] text-neutral-400">
                        {item.quantity} Adet {item.selectedSize ? `• Beden: ${item.selectedSize}` : ''}
                      </p>
                    </div>
                    <span className="font-bold text-white whitespace-nowrap">
                      {(item.price * item.quantity).toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations breakdown */}
              <div className="space-y-2 pt-4 border-t border-neutral-800 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span className="text-white font-medium">{cartSubtotal.toLocaleString('tr-TR')} ₺</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>İndirim Kuponu ({appliedCoupon?.code})</span>
                    <span>-{cartDiscount.toLocaleString('tr-TR')} ₺</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Kargo Ücreti</span>
                  {cartShippingFee === 0 ? (
                    <span className="text-emerald-400 font-bold">ÜCRETSİZ</span>
                  ) : (
                    <span className="text-white">{cartShippingFee} ₺</span>
                  )}
                </div>
                {paymentMethod === 'cash_on_delivery' && (
                  <div className="flex justify-between text-neutral-300">
                    <span>Kapıda Ödeme Hizmet Bedeli</span>
                    <span>30 ₺</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-neutral-800">
                  <span>Toplam Tutar</span>
                  <span className="text-[#FF5A1F] text-xl font-black">
                    {(cartTotal + (paymentMethod === 'cash_on_delivery' ? 30 : 0)).toLocaleString('tr-TR')} ₺
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-[#FF5A1F] hover:bg-[#e04e18] disabled:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#FF5A1F]/30 active:scale-95"
              >
                {isProcessing ? (
                  <span>Ödeme İşleniyor...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Siparişi Güvenle Tamamla</span>
                  </>
                )}
              </button>

              <div className="space-y-2 text-[11px] text-neutral-500 pt-2 border-t border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Sipariş onayınız e-posta adresinize anında gönderilir.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Koçluk paketlerinde paneliniz 5 dakika içinde aktifleşir.</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
