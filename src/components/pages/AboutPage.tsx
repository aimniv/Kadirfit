import React from 'react';
import { Award, CheckCircle2, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AboutPageProps {
  onStartCoaching: () => void;
  onOpenAssessment: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onStartCoaching, onOpenAssessment }) => {
  const { settings } = useApp();

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Hero Banner */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A1F] uppercase tracking-widest">
            <Flame className="w-4 h-4" />
            <span>KADİR ARSLAN HİKAYESİ</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-white uppercase tracking-tight">
            "HER BEDEN BİR HEYKELDİR. <br />
            <span className="text-[#FF5A1F]">ÇEKİCİ ELİNE AL."</span>
          </h1>
          <p className="text-neutral-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Spor bilimini, anatomi bilgisini ve mental disiplini birleştirerek 1400'den fazla bireyin hayatını kökten değiştirdik.
          </p>
        </div>

        {/* Coach Story with Portrait */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5 relative">
            <img
              src={settings.coachPortraitUrl}
              alt={settings.coachBioTitle}
              className="w-full aspect-[4/5] object-cover rounded-2xl border-2 border-neutral-800 shadow-2xl filter grayscale contrast-125"
            />
          </div>

          <div className="md:col-span-7 space-y-5 text-neutral-300 text-xs sm:text-sm leading-relaxed">
            <h3 className="font-display text-3xl font-black text-white uppercase">
              {settings.coachBioTitle} KİMDİR?
            </h3>
            <p>
              Fitness yolculuğum 12 yıl önce, zayıf ve özgüvensiz bir genç olarak salona ilk adımı atmamla başladı. Yıllarca yanlış beslenme, sakatlıklar ve etkisiz programlarla vakit kaybettikten sonra işin bilimine odaklandım.
            </p>
            <p>
              Uluslararası IFBB Pro ve ISSA sertifikalarımı tamamladıktan sonra sporcu biyomekaniği, hipertrofi temelli yükleme ve esnek diyet modellerini sentezleyerek Kadirfit sistemini kurdum.
            </p>
            <p>
              Bugün Kadirfit; sadece antrenman listesi veren bir platform değil, bireyin yaşam tarzına, uyku kalitesine ve psikolojisine entegre olan komple bir performans ekosistemidir.
            </p>

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={onStartCoaching}
                className="px-6 py-3 bg-[#FF5A1F] hover:bg-[#e04e18] text-white font-bold text-xs uppercase tracking-wider rounded transition-all"
              >
                Koçluk Paketlerini İncele
              </button>
              <button
                onClick={onOpenAssessment}
                className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded border border-neutral-700 transition-all"
              >
                Ön Değerlendirme Formu
              </button>
            </div>
          </div>
        </div>

        {/* Certificates & Credentials Grid */}
        <div className="p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-6">
          <h3 className="font-heading uppercase text-sm font-bold text-white tracking-wider flex items-center gap-2">
            <Award className="w-5 h-5 text-[#FF5A1F]" />
            Profesyonel Akreditasyonlar & Lisanslar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {settings.coachCertificates.map((cert, i) => (
              <div key={i} className="p-4 bg-black/60 rounded-xl border border-neutral-800 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                <span className="font-medium text-white">{cert}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
