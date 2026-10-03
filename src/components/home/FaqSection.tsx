import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { INITIAL_FAQS } from '../../data/initialData';

interface FaqSectionProps {
  onNavigateToContact: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onNavigateToContact }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'kocluk' | 'antrenman' | 'siparis' | 'odeme'>('all');
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const filteredFaqs = INITIAL_FAQS.filter(
    f => activeCategory === 'all' || f.category === activeCategory
  );

  const toggleAccordion = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section className="py-20 sm:py-24 bg-[#0D0D0D] border-b border-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A1F] tracking-widest uppercase mb-3">
            <span className="w-6 h-0.5 bg-[#FF5A1F]" />
            <span>SIKÇA SORULAN SORULAR</span>
            <span className="w-6 h-0.5 bg-[#FF5A1F]" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
            MERAK EDİLEN <span className="text-[#FF5A1F]">HER ŞEY</span>
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            Online koçluk süreci, siparişler, teslimat ve ödeme yöntemleri hakkında aklınıza takılan sorular.
          </p>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              { id: 'all', label: 'Tüm Sorular' },
              { id: 'kocluk', label: 'Online Koçluk' },
              { id: 'antrenman', label: 'Antrenman & Beslenme' },
              { id: 'siparis', label: 'Mağaza & Kargo' },
              { id: 'odeme', label: 'Ödeme & Güvenlik' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeCategory === tab.id
                    ? 'bg-[#FF5A1F] text-white'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl bg-neutral-900/60 border border-neutral-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-neutral-800/40 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base text-white">
                    {faq.question}
                  </span>
                  <div className={`w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#FF5A1F]' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/80 pt-3 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions card */}
        <div className="mt-12 p-6 rounded-xl bg-neutral-900/40 border border-neutral-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-[#FF5A1F]/15 text-[#FF5A1F] flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Başka bir sorun mu var?</h5>
              <p className="text-xs text-neutral-400">Kadir Hoca ve ekibimize anında ulaşabilirsiniz.</p>
            </div>
          </div>
          <button
            onClick={onNavigateToContact}
            className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-lg transition-colors uppercase tracking-wider shrink-0"
          >
            Bize Ulaşın
          </button>
        </div>
      </div>
    </section>
  );
};
