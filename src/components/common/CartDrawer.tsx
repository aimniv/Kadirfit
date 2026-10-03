import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onContinueShopping
}) => {
  const {
    isCartOpen,
    closeCart,
    cart,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
    settings
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    setCouponError('');
    setCouponSuccess('');
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const amountNeededForFreeShipping = Math.max(0, settings.freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / settings.freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#101010] border-l border-neutral-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#FF5A1F]" />
              <h3 className="font-heading uppercase text-base font-bold text-white tracking-wider">
                Sepetiniz ({cart.reduce((sum, i) => sum + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={closeCart}
              className="p-1 text-neutral-400 hover:text-white rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cart.length > 0 && (
            <div className="px-5 py-3 bg-neutral-900/60 border-b border-neutral-800 text-xs">
              {amountNeededForFreeShipping > 0 ? (
                <p className="text-neutral-300 font-medium mb-1.5">
                  <span className="text-[#FF5A1F] font-bold">{amountNeededForFreeShipping.toFixed(0)} ₺</span> daha ekleyin, <strong className="text-white">kargo bedava</strong> olsun!
                </p>
              ) : (
                <p className="text-emerald-400 font-bold mb-1.5 flex items-center gap-1">
                  ✓ Tebrikler! Ücretsiz Kargo Kazandınız.
                </p>
              )}
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#FF5A1F] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-white text-base mb-1">Sepetiniz Boş</h4>
                <p className="text-neutral-400 text-xs max-w-xs mb-6">
                  Henüz sepetinize bir ürün veya koçluk paketi eklemediniz.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    onContinueShopping();
                  }}
                  className="px-6 py-2.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
                >
                  Mağazayı Keşfet
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-neutral-900/70 border border-neutral-800 rounded-lg flex items-start gap-3 relative group"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded object-cover bg-neutral-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0 pr-6">
                    <h5 className="font-semibold text-xs text-white line-clamp-1">
                      {item.title}
                    </h5>

                    {/* Variant tags */}
                    <div className="flex flex-wrap gap-1 mt-1 text-[11px] text-neutral-400">
                      {item.isCoachingPackage && (
                        <span className="text-[#FF5A1F] font-bold">
                          {item.coachingDurationMonths} Aylık Koçluk
                        </span>
                      )}
                      {item.selectedSize && <span>Beden: {item.selectedSize}</span>}
                      {item.selectedColor && <span>• {item.selectedColor}</span>}
                      {item.selectedFlavor && <span>Aroma: {item.selectedFlavor}</span>}
                      {item.selectedWeight && <span>• {item.selectedWeight}</span>}
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Quantity Controls (Only for products, not coaching packages) */}
                      {!item.isCoachingPackage ? (
                        <div className="flex items-center border border-neutral-700 rounded bg-neutral-950">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="p-1 text-neutral-400 hover:text-white"
                            title="Azalt"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="p-1 text-neutral-400 hover:text-white"
                            title="Artır"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-neutral-400 italic">
                          1 Kişilik Kontenjan
                        </span>
                      )}

                      <span className="font-bold text-xs text-[#FF5A1F]">
                        {(item.price * item.quantity).toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-3 right-3 text-neutral-500 hover:text-rose-400 transition-colors"
                    title="Sepetten Çıkar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-800 bg-[#0d0d0d] space-y-4">
              {/* Coupon input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Tag className="w-3.5 h-3.5" />
                      <span className="font-bold">{appliedCoupon.code}</span>
                      <span className="text-[11px]">
                        ({appliedCoupon.type === 'percentage' ? `%${appliedCoupon.value}` : `${appliedCoupon.value} TL`} indirim)
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-neutral-400 hover:text-rose-400 text-xs underline"
                    >
                      Kaldır
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="İndirim kuponu (Örn: KADIRFIT10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white uppercase placeholder-neutral-500 focus:outline-none focus:border-[#FF5A1F]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded transition-colors"
                    >
                      Uygula
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-400 mt-1">{couponSuccess}</p>}
              </div>

              {/* Price Calculation Summary */}
              <div className="space-y-1.5 text-xs text-neutral-400 border-t border-neutral-800/80 pt-3">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span className="text-white font-medium">{cartSubtotal.toLocaleString('tr-TR')} ₺</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Kupon İndirimi</span>
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
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                  <span>Genel Toplam</span>
                  <span className="text-[#FF5A1F] text-base font-black">
                    {cartTotal.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
              </div>

              {/* Complete Order Button */}
              <button
                onClick={() => {
                  closeCart();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/20 active:scale-95"
              >
                <span>Ödemeye Geç</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-Bit SSL Şifreleme & 3D Secure Güvencesi</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
