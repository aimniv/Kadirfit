import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CtaNewsletterSectionProps {
  onStartNow: () => void;
}

export const CtaNewsletterSection: React.FC<CtaNewsletterSectionProps> = ({ onStartNow }) => {
  const { subscribeNewsletter } = useApp();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<{ text: string; success: boolean } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = subscribeNewsletter(email);
    setMsg({ text: res.message, success: res.success });
    if (res.success) setEmail('');
  };

  return (
    <section className="relative py-24 sm:py-32 bg-black overflow-hidden border-b border-neutral-800">
      {/* Background Graphic Accent */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF5A1F] rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Slogan */}
        <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-[0.3em] block mb-4">
          ERTELEMEK KAYBETMEKTİR
        </span>

        {/* Big Impact Headline */}
        <h2 className="font-display text-5xl sm:text-7xl md:text-8xl font-black text-white uppercase tracking-tight leading-none mb-6">
          BAHANELER BİTTİ. <br />
          <span className="text-[#FF5A1F]">BUGÜN BAŞLA.</span>
        </h2>

        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
          Pazartesileri beklemekten vazgeç. Doğru antrenman bilimi, sürdürülebilir beslenme ve profesyonel koçluk ile kendi potansiyelini inşa et.
        </p>

        {/* Action Button */}
        <div className="mb-14">
          <button
            onClick={onStartNow}
            className="px-10 py-4 bg-[#FF5A1F] hover:bg-[#e04e18] text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all shadow-xl shadow-[#FF5A1F]/30 hover:scale-105 active:scale-95 inline-flex items-center gap-2"
          >
            <span>Koçluk Paketlerini İncele & Başla</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Newsletter Box */}
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-md">
          <div className="flex items-center justify-center gap-2 text-white font-bold text-sm mb-1">
            <Mail className="w-4 h-4 text-[#FF5A1F]" />
            <span>Kadirfit VIP Bülten</span>
          </div>
          <p className="text-[11px] text-neutral-400 mb-4">
            Her hafta bilimsel antrenman ipuçları, makro tarifler ve üyelere özel indirim kodları e-postanda.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresinizi giriniz..."
              className="flex-1 bg-black/60 border border-neutral-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF5A1F]"
              required
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold uppercase rounded-lg transition-colors shrink-0"
            >
              Abone Ol
            </button>
          </form>

          {msg && (
            <p className={`text-[11px] mt-2.5 flex items-center justify-center gap-1 ${msg.success ? 'text-emerald-400' : 'text-rose-400'}`}>
              {msg.success && <CheckCircle2 className="w-3.5 h-3.5" />}
              {msg.text}
            </p>
          )}

          <p className="text-[10px] text-neutral-500 mt-3">
            Spam yok. Dilediğiniz an tek tıkla abonelikten ayrılabilirsiniz.
          </p>
        </div>

      </div>
    </section>
  );
};
