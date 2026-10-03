import React from 'react';
import { ClipboardList, Utensils, Activity, TrendingUp, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onNavigate: (view: string) => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onNavigate }) => {
  const steps = [
    {
      number: '01',
      title: 'Ön Değerlendirme',
      desc: 'Formunu doldur: Yaş, boy, kilo, sakatlık geçmişi, antrenman ortamı ve beslenme tercihlerini eksiksiz analiz edelim.',
      icon: ClipboardList
    },
    {
      number: '02',
      title: 'Kişiye Özel Plan',
      desc: '48 saat içinde sana özel kalori, makro, hipertrofi temelli antrenman ve supplement stratejin panelinde aktif olur.',
      icon: Utensils
    },
    {
      number: '03',
      title: 'Haftalık Check-in',
      desc: 'Her Pazar güncel kilonu, ölçülerini ve form fotoğraflarını yükle. Kadir Hoca santim santim ilerlemeni incelesin.',
      icon: Activity
    },
    {
      number: '04',
      title: 'Plan Güncelleme & Sonuç',
      desc: 'Platoya düşmeden sürekli gelişim için kalori ve antrenman periyodizasyonu dinamik olarak güncellenir.',
      icon: TrendingUp
    }
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#0D0D0D] border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A1F] tracking-widest uppercase mb-3">
            <span className="w-6 h-0.5 bg-[#FF5A1F]" />
            <span>SİSTEM NASIL ÇALIŞIR?</span>
            <span className="w-6 h-0.5 bg-[#FF5A1F]" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
            4 ADIMDA HAYALİNDEKİ <span className="text-[#FF5A1F]">FİZİKSEL DÖNÜŞÜM</span>
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            Şansa yer yok. Biyomekanik, periyodizasyon ve haftalık disiplinli takip ile hedefinize garantili ulaşın.
          </p>
        </div>

        {/* 4 Steps Grid with Horizontal Connection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-[#FF5A1F]/50 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-display text-4xl font-black text-neutral-700 group-hover:text-[#FF5A1F] transition-colors">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[#FF5A1F] group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-bold text-white uppercase tracking-wide mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center text-[11px] font-bold text-neutral-500 group-hover:text-[#FF5A1F] transition-colors">
                  <span>Adım {step.number}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-14 text-center">
          <button
            onClick={() => onNavigate('assessment')}
            className="px-8 py-3.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white font-bold text-xs uppercase tracking-wider rounded transition-all shadow-lg shadow-[#FF5A1F]/20 active:scale-95 inline-flex items-center gap-2"
          >
            <span>Ön Değerlendirmeyi Başlat</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
