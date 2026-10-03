import React, { useEffect, useState } from 'react';
import { ArrowRight, Trophy, Users, ShieldCheck, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeroSectionProps {
  onNavigate: (view: string, param?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { settings } = useApp();

  // Animated counter effect
  const [studentCount, setStudentCount] = useState(0);
  const [expCount, setExpCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const endStudents = settings.statsStudents;
    const duration = 1500;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = endStudents / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= endStudents) {
        setStudentCount(endStudents);
        clearInterval(timer);
      } else {
        setStudentCount(Math.floor(start));
      }
    }, stepTime);

    setExpCount(settings.statsExperienceYears);

    return () => clearInterval(timer);
  }, [settings.statsStudents, settings.statsExperienceYears]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-[#080808] overflow-hidden">
      {/* Background Cinematic Visual with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.heroBgImage}
          alt="Kadirfit Atletik Antrenman"
          className="w-full h-full object-cover object-center brightness-[0.28] contrast-125 scale-105 transition-transform duration-1000"
        />
        {/* Subtle noise and radial gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/80" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#0A0A0A]/60 to-[#0A0A0A]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        
        {/* Athletic Accent Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818]/90 border border-neutral-700/80 text-[11px] font-bold text-neutral-300 uppercase tracking-widest mb-6 animate-fade-in shadow-xl">
          <Flame className="w-3.5 h-3.5 text-[#FF5A1F]" />
          <span>BİLİMSEL FITNESS & PERFORMANS KOÇLUĞU</span>
        </div>

        {/* Big Bold Headline */}
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white uppercase leading-[0.9] text-balance max-w-4xl drop-shadow-2xl">
          {settings.heroHeadline.split(' ').map((word, idx) => (
            <span
              key={idx}
              className={idx === 1 || idx === 3 ? 'text-[#FF5A1F]' : 'text-white'}
            >
              {word}{' '}
            </span>
          ))}
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl font-normal leading-relaxed text-pretty">
          {settings.heroSubheadline}
        </p>

        {/* Two Primary CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('coaching')}
            className="w-full sm:w-auto px-8 py-4 bg-[#FF5A1F] hover:bg-[#e04e18] text-white font-bold text-sm uppercase tracking-wider rounded transition-all shadow-xl shadow-[#FF5A1F]/30 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{settings.heroCtaText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('shop')}
            className="w-full sm:w-auto px-8 py-4 bg-neutral-900/90 hover:bg-neutral-800 text-white font-bold text-sm uppercase tracking-wider rounded border border-neutral-700 hover:border-neutral-500 transition-all flex items-center justify-center gap-2"
          >
            <span>{settings.heroSecondaryCtaText}</span>
          </button>
        </div>

        {/* 3 Animated Stats Counters */}
        <div className="mt-16 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t border-neutral-800/80">
          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-[#FF5A1F] mb-1">
              <Users className="w-4 h-4" />
              <span className="font-display text-3xl sm:text-4xl font-black text-white">
                {studentCount}+
              </span>
            </div>
            <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
              Başarılı Dönüşüm
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-[#FF5A1F] mb-1">
              <Trophy className="w-4 h-4" />
              <span className="font-display text-3xl sm:text-4xl font-black text-white">
                {expCount}+ Yıl
              </span>
            </div>
            <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
              Koçluk & Sahne Deneyimi
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-[#FF5A1F] mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-display text-3xl sm:text-4xl font-black text-white">
                %100
              </span>
            </div>
            <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
              Kişiye Özel Protokol
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
