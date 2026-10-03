import React, { useState } from 'react';
import { Flame, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TransformationGallerySectionProps {
  onNavigate: (view: string) => void;
}

export const TransformationGallerySection: React.FC<TransformationGallerySectionProps> = ({ onNavigate }) => {
  const { transformations } = useApp();
  const [filter, setFilter] = useState<'all' | 'kilo_verme' | 'kas_kazanimi'>('all');
  const [sliderPositions, setSliderPositions] = useState<Record<string, number>>({});

  const filtered = transformations.filter(t => t.approved && (filter === 'all' || t.category === filter));

  const handleSliderChange = (id: string, val: number) => {
    setSliderPositions(prev => ({ ...prev, [id]: val }));
  };

  return (
    <section className="py-20 sm:py-28 bg-[#0D0D0D] border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A1F] tracking-widest uppercase mb-3">
            <span className="w-6 h-0.5 bg-[#FF5A1F]" />
            <span>KANITLANMIŞ GERÇEK SONUÇLAR</span>
            <span className="w-6 h-0.5 bg-[#FF5A1F]" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight">
            ÖĞRENCİ <span className="text-[#FF5A1F]">DÖNÜŞÜM GALERİSİ</span>
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            Sadece söz vermiyoruz, haftalık check-in ve bilimsel beslenmeyle somut fiziksel evrimler yaratıyoruz.
          </p>

          {/* Interactive Filter Controls */}
          <div className="mt-8 inline-flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                filter === 'all' ? 'bg-[#FF5A1F] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Tüm Dönüşümler
            </button>
            <button
              onClick={() => setFilter('kilo_verme')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                filter === 'kilo_verme' ? 'bg-[#FF5A1F] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Yağ Yakımı & Kilo Verme
            </button>
            <button
              onClick={() => setFilter('kas_kazanimi')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                filter === 'kas_kazanimi' ? 'bg-[#FF5A1F] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Yağsız Kas Kütlesi
            </button>
          </div>
        </div>

        {/* Transformations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((item) => {
            const sliderPos = sliderPositions[item.id] ?? 50;

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-neutral-900/60 border border-neutral-800 overflow-hidden flex flex-col justify-between group shadow-xl hover:border-neutral-700 transition-all"
              >
                {/* Interactive Before / After Split Slider */}
                <div className="relative aspect-[4/5] overflow-hidden select-none bg-black">
                  {/* After Image (Background) */}
                  <img
                    src={item.afterImg}
                    alt={`${item.studentName} Sonra`}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  <div className="absolute top-3 right-3 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    SONRA
                  </div>

                  {/* Before Image (Clipped by slider) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPos}%` }}
                  >
                    <img
                      src={item.beforeImg}
                      alt={`${item.studentName} Önce`}
                      className="absolute inset-0 w-full h-full object-cover object-center max-w-none"
                      style={{ width: '100%', height: '100%' }}
                    />
                    <div className="absolute top-3 left-3 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-neutral-300 border border-neutral-700">
                      ÖNCE
                    </div>
                  </div>

                  {/* Divider Line */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.8)] flex items-center justify-center"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center shadow-lg -ml-2.5">
                      ↔
                    </div>
                  </div>

                  {/* Range Input Overlay for Dragging */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPos}
                    onChange={(e) => handleSliderChange(item.id, Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    title="Önce / Sonra kaydırıcıyı hareket ettirin"
                  />
                </div>

                {/* Card Content & Stats */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-display text-2xl font-bold text-white uppercase tracking-wide">
                        {item.studentName}
                      </h4>
                      <span className="text-xs text-neutral-400">{item.age} Yaşında</span>
                    </div>

                    {/* Weight change badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 text-[#FF5A1F] text-xs font-bold mb-3">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{item.weightChange}</span>
                      <span className="text-neutral-500">•</span>
                      <span className="text-neutral-300">{item.durationWeeks} Haftada</span>
                    </div>

                    <p className="text-xs text-neutral-300 italic leading-relaxed line-clamp-3">
                      {item.quote}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Doğrulanmış Öğrenci
                    </span>
                    <span className="text-neutral-400">Kaydırarak İncele</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={() => onNavigate('results')}
            className="px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded border border-neutral-700 transition-colors inline-flex items-center gap-2"
          >
            <span>Tüm 50+ Dönüşüm Hikayesini İncele</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
