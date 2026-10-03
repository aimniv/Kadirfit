import React, { useState } from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ResultsPage: React.FC = () => {
  const { transformations } = useApp();
  const [filter, setFilter] = useState<'all' | 'kilo_verme' | 'kas_kazanimi'>('all');
  const [sliderPositions, setSliderPositions] = useState<Record<string, number>>({});

  const filtered = transformations.filter(t => t.approved && (filter === 'all' || t.category === filter));

  const handleSliderChange = (id: string, val: number) => {
    setSliderPositions(prev => ({ ...prev, [id]: val }));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A1F] uppercase tracking-widest">
            <Flame className="w-4 h-4" />
            <span>GERÇEK KİŞİLER, GERÇEK DÖNÜŞÜMLER</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-white uppercase tracking-tight">
            BAŞARI <span className="text-[#FF5A1F]">HİKAYELERİ</span>
          </h1>
          <p className="text-neutral-400 text-sm">
            Disiplin ve doğru bilimsel metodoloji birleştiğinde ortaya çıkan somut sonuçlar.
          </p>

          {/* Filter tabs */}
          <div className="mt-6 inline-flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                filter === 'all' ? 'bg-[#FF5A1F] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Tümü
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
              Yağsız Kas Kazanımı
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
                className="rounded-2xl bg-neutral-900/60 border border-neutral-800 overflow-hidden flex flex-col justify-between group shadow-xl"
              >
                {/* Interactive Slider */}
                <div className="relative aspect-[4/5] overflow-hidden select-none bg-black">
                  <img
                    src={item.afterImg}
                    alt={`${item.studentName} Sonra`}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  <div className="absolute top-3 right-3 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    SONRA
                  </div>

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

                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.8)] flex items-center justify-center"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center shadow-lg -ml-2.5">
                      ↔
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPos}
                    onChange={(e) => handleSliderChange(item.id, Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                  />
                </div>

                <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-display text-2xl font-bold text-white uppercase tracking-wide">
                        {item.studentName}
                      </h4>
                      <span className="text-xs text-neutral-400">{item.age} Yaşında</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 text-[#FF5A1F] text-xs font-bold mb-3">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{item.weightChange}</span>
                      <span className="text-neutral-500">•</span>
                      <span className="text-neutral-300">{item.durationWeeks} Haftada</span>
                    </div>

                    <p className="text-xs text-neutral-300 italic leading-relaxed">
                      {item.quote}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Doğrulanmış Öğrenci
                    </span>
                    <span className="text-neutral-400">Önce/Sonra Kaydır</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
