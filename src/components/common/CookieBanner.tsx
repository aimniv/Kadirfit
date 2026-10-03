import React, { useState, useEffect } from 'react';
import { Cookie, Shield } from 'lucide-react';

interface CookieBannerProps {
  onOpenLegal: (page: string) => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenLegal }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('kadirfit_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('kadirfit_cookie_consent', 'accepted_all');
    setVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('kadirfit_cookie_consent', 'essential_only');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 bg-[#141414] border border-neutral-700/80 rounded-xl p-5 shadow-2xl animate-fade-up">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] shrink-0 mt-0.5">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-white">Çerez ve Gizlilik Tercihleri</h4>
            <Shield className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Sitemizdeki alışveriş ve koçluk deneyiminizi geliştirmek, sepetinizi güvenle saklamak ve yasal mevzuata uygun analizler yapmak amacıyla çerezler kullanmaktayız.{' '}
            <button
              onClick={() => onOpenLegal('cerez')}
              className="text-[#FF5A1F] underline hover:text-[#ff7442]"
            >
              Çerez Politikası
            </button>
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold rounded uppercase tracking-wider transition-colors"
            >
              Tümünü Kabul Et
            </button>
            <button
              onClick={handleAcceptEssential}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium rounded transition-colors"
            >
              Sadece Zorunlular
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
