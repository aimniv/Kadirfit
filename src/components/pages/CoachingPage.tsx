import React, { useState } from 'react';
import { Check, Star, Zap, Shield, ArrowRight, ClipboardCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CoachingPackage } from '../../types';

interface CoachingPageProps {
  onOpenAssessment: () => void;
}

export const CoachingPage: React.FC<CoachingPageProps> = ({ onOpenAssessment }) => {
  const { coachingPackages, addToCart } = useApp();
  const [selectedDuration, setSelectedDuration] = useState<1 | 3 | 6>(3);

  const handleBuy = (pkg: CoachingPackage) => {
    const dur = pkg.durations.find(d => d.months === selectedDuration) || pkg.durations[0];
    addToCart({
      id: `cart-coach-page-${pkg.id}-${selectedDuration}`,
      productId: pkg.id,
      isCoachingPackage: true,
      coachingDurationMonths: selectedDuration,
      title: `${pkg.name} (${selectedDuration} Ay)`,
      price: dur.price,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
      quantity: 1
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A1F] uppercase tracking-widest">
            <Shield className="w-4 h-4" />
            <span>BİREBİR ONLINE KOÇLUK SİSTEMİ</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-white uppercase tracking-tight">
            GENETİK POTANSİYELİNİ <br />
            <span className="text-[#FF5A1F]">ZİRVEYE ÇIKAR</span>
          </h1>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Standart hazır PDF programları unutun. Her hafta check-in ile takip edilen, kan tahlilleriniz ve postürünüze göre anlık revize edilen bilimsel koçluk.
          </p>

          {/* Duration Selector */}
          <div className="mt-8 inline-flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
            <button
              onClick={() => setSelectedDuration(1)}
              className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                selectedDuration === 1 ? 'bg-white text-black shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              1 Ay (Standart)
            </button>
            <button
              onClick={() => setSelectedDuration(3)}
              className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                selectedDuration === 3 ? 'bg-[#FF5A1F] text-white shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              3 Ay (%15 İndirimli)
            </button>
            <button
              onClick={() => setSelectedDuration(6)}
              className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                selectedDuration === 6 ? 'bg-[#FF5A1F] text-white shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              6 Ay (%25 İndirimli)
            </button>
          </div>
        </div>

        {/* 3 Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {coachingPackages.map((pkg) => {
            const curDuration = pkg.durations.find(d => d.months === selectedDuration) || pkg.durations[0];
            const isPop = pkg.isPopular;

            return (
              <div
                key={pkg.id}
                className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  isPop
                    ? 'bg-neutral-900/90 border-2 border-[#FF5A1F] shadow-2xl shadow-[#FF5A1F]/15 -translate-y-2'
                    : 'bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#FF5A1F] text-white shadow-lg">
                    {pkg.badge}
                  </div>
                )}

                <div>
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

                  <div className="mt-6 p-4 rounded-xl bg-black/40 border border-neutral-800/80">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-4xl sm:text-5xl font-black text-white">
                        {curDuration.price.toLocaleString('tr-TR')} ₺
                      </span>
                      <span className="text-xs text-neutral-400 font-medium">
                        / {selectedDuration} Ay Toplam
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
                      Pakete Dahil Olanlar:
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

                <div className="mt-8 pt-6 border-t border-neutral-800 space-y-3">
                  <button
                    onClick={() => handleBuy(pkg)}
                    className={`w-full py-4 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md ${
                      isPop
                        ? 'bg-[#FF5A1F] hover:bg-[#e04e18] text-white shadow-[#FF5A1F]/30'
                        : 'bg-white hover:bg-neutral-200 text-black'
                    }`}
                  >
                    <span>Hemen Satın Al ({selectedDuration} Ay)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free Assessment Banner */}
        <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FF5A1F]/15 text-[#FF5A1F] flex items-center justify-center shrink-0">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display text-2xl font-bold text-white uppercase">Hangi Paket Sana Uygun?</h4>
              <p className="text-xs text-neutral-400">Ücretsiz ön değerlendirme formunu doldur, Kadir Hoca hedefine göre seni yönlendirsin.</p>
            </div>
          </div>

          <button
            onClick={onOpenAssessment}
            className="px-6 py-3.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shrink-0 shadow-lg shadow-[#FF5A1F]/20"
          >
            Ön Değerlendirme Formunu Aç
          </button>
        </div>

      </div>
    </div>
  );
};
