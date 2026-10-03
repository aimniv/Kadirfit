import React from 'react';
import { Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AboutSectionProps {
  onNavigate: (view: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate }) => {
  const { settings } = useApp();

  return (
    <section className="py-20 sm:py-28 bg-[#0A0A0A] border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Trainer Portrait with Athletic Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-neutral-800 group shadow-2xl">
              <img
                src={settings.coachPortraitUrl}
                alt={settings.coachBioTitle}
                className="w-full aspect-[4/5] object-cover object-top filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#141414]/90 border border-neutral-700/80 backdrop-blur-md">
                <p className="text-[11px] font-bold text-[#FF5A1F] uppercase tracking-wider">
                  BAŞ ANTRENÖR & KURUCU
                </p>
                <h4 className="font-display text-2xl font-black text-white uppercase">
                  {settings.coachBioTitle}
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  IFBB Pro Coach & Sporcu Beslenmesi Uzmanı
                </p>
              </div>
            </div>

            {/* Decorative Accent box */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-[#FF5A1F]/60 rounded-tl-xl pointer-events-none" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-[#FF5A1F]/60 rounded-br-xl pointer-events-none" />
          </div>

          {/* Coach Bio & Certificates */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A1F] tracking-widest uppercase">
              <span className="w-6 h-0.5 bg-[#FF5A1F]" />
              <span>HAKKIMDA & FELSEFEM</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight leading-none">
              "DİSİPLİN, DUYGULARDAN <span className="text-[#FF5A1F]">GÜÇLÜDÜR.</span>"
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              {settings.coachBioText}
            </p>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Her bireyin biyomekaniği, kas lifi dağılımı, insülin duyarlılığı ve günlük stres faktörleri birbirinden farklıdır. Bu yüzden internetteki kopyala-yapıştır antrenman ve aç bırakan şok diyetler kalıcı sonuç vermez. Kadirfit sistemi, seni bir atlet disipliniyle eğiterek hayat boyu sürdürülebilir estetik bir fiziğe kavuşturur.
            </p>

            {/* Certificates & Achievements Badges */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#FF5A1F]" />
                Akreditasyonlar ve Uzmanlıklar
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {settings.coachCertificates.map((cert, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                    <span className="font-medium">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('assessment')}
                className="px-6 py-3.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center gap-2 shadow-lg shadow-[#FF5A1F]/20 active:scale-95"
              >
                <span>Ücretsiz Ön Değerlendirme Formunu Doldur</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('about')}
                className="px-5 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-semibold text-xs rounded border border-neutral-800 transition-colors"
              >
                Detaylı Biyografiyi Oku
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
