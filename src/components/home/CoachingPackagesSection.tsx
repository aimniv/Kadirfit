import React, { useState } from 'react';
import { Check, Star, Zap, Shield, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CoachingPackage } from '../../types';

interface CoachingPackagesSectionProps {
  onNavigate: (view: string, param?: string) => void;
}

export const CoachingPackagesSection: React.FC<CoachingPackagesSectionProps> = ({ onNavigate }) => {
  const { coachingPackages, addToCart } = useApp();
  const [selectedDuration, setSelectedDuration] = useState<1 | 3 | 6>(3); // 3 months default popular

  const handleBuyPackage = (pkg: CoachingPackage) => {
    const durationObj = pkg.durations.find(d => d.months === selectedDuration) || pkg.durations[0];
    
    addToCart({
      id: `cart-coaching-${pkg.id}-${selectedDuration}`,
      productId: pkg.id,
      isCoachingPackage: true,
      coachingDurationMonths: selectedDuration,
      title: `${pkg.name} (${selectedDuration} Ay)`,
      price: durationObj.price,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
      quantity: 1
    });
  };

  return (
    <section id="kocluk" className="py-20 sm:py-28 bg-[#0A0A0A] border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A1F] tracking-widest uppercase mb-3">
            <span className="w-6 h-0.5 bg-[#FF5A1F]" />
            <span>KİŞİYE ÖZEL PROGRAMLAR</span>
            <span className="w-6 h-0.5 bg-[#FF5A1F]" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight">
            ONLINE FITNESS & BESLENME <span className="text-[#FF5A1F]">KOÇLUK PAKETLERİ</span>
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            Hedefine ve seviyene en uygun paketi seç. Süre uzadıkça aylık maliyet avantajından faydalan.
          </p>

          {/* Duration Toggle Buttons (Segmented Controls) */}
          <div className="mt-8 inline-flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
            <button
              onClick={() => setSelectedDuration(1)}
              className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                selectedDuration === 1
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              1 Ay (Standart)
            </button>
            <button
              onClick={() => setSelectedDuration(3)}
              className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all relative ${
                selectedDuration === 3
                  ? 'bg-[#FF5A1F] text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              3 Ay (%15 İndirimli)
              <span className="absolute -top-2.5 -right-1 px-1.5 py-0.2 bg-emerald-500 text-black text-[9px] font-black rounded uppercase">
                Popüler
              </span>
            </button>
            <button
              onClick={() => setSelectedDuration(6)}
              className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                selectedDuration === 6
                  ? 'bg-[#FF5A1F] text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              6 Ay (%25 İndirimli)
            </button>
          </div>
        </div>

        {/* 3 Package Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {coachingPackages.map((pkg) => {
            const currentDuration = pkg.durations.find(d => d.months === selectedDuration) || pkg.durations[0];
            const isPop = pkg.isPopular;

            return (
              <div
                key={pkg.id}
                className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  isPop
                    ? 'bg-neutral-900/90 border-2 border-[#FF5A1F] shadow-2xl shadow-[#FF5A1F]/15 -translate-y-2 lg:-translate-y-3'
                    : 'bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Popular / Elite Banner Tag */}
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#FF5A1F] text-white shadow-lg">
                    {pkg.badge}
                  </div>
                )}

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-3xl font-black text-white uppercase tracking-wide">
                      {pkg.name}
                    </h3>
                    {pkg.isElite ? (
                      <Star className="w-5 h-5 text-[#FF5A1F] fill-[#FF5A1F]" />
                    ) : isPop ? (
                      <Zap className="w-5 h-5 text-[#FF5A1F]" />
                    ) : (
                      <Shield className="w-5 h-5 text-neutral-500" />
                    )}
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed min-h-[38px]">
                    {pkg.tagline}
                  </p>

                  {/* Price Block */}
                  <div className="mt-6 p-4 rounded-xl bg-black/40 border border-neutral-800/80">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                        {currentDuration.price.toLocaleString('tr-TR')} ₺
                      </span>
                      <span className="text-xs text-neutral-400 font-medium">
                        / {selectedDuration} Ay Toplam
                      </span>
                    </div>

                    {selectedDuration > 1 && (
                      <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                        Aylık sadece {currentDuration.monthlyPriceEquivalent.toLocaleString('tr-TR')} ₺ denk gelir
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="mt-8 space-y-3">
                    <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
                      Pakete Dahil Hizmetler:
                    </p>
                    <ul className="space-y-2.5">
                      {pkg.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-200">
                          <Check className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom CTA Area */}
                <div className="mt-8 pt-6 border-t border-neutral-800 space-y-3">
                  <button
                    onClick={() => handleBuyPackage(pkg)}
                    className={`w-full py-4 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md ${
                      isPop
                        ? 'bg-[#FF5A1F] hover:bg-[#e04e18] text-white shadow-[#FF5A1F]/30'
                        : 'bg-white hover:bg-neutral-200 text-black'
                    }`}
                  >
                    <span>Hemen Satın Al ({selectedDuration} Ay)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onNavigate('assessment')}
                    className="w-full text-center text-[11px] text-neutral-400 hover:text-white transition-colors"
                  >
                    Önce Ön Değerlendirme Formunu Doldur →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-14 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 text-center text-xs text-neutral-400 max-w-2xl mx-auto flex items-center justify-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Tüm paketlerde ilk 7 gün içinde sürece uyum sağlayamadığınızı belirtirseniz koşulsuz paket dondurma veya değişim garantisi.
          </span>
        </div>
      </div>
    </section>
  );
};
