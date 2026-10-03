import React from 'react';
import { ArrowUpRight, Shirt, Zap, Dumbbell } from 'lucide-react';
import { ProductCategory } from '../../types';

interface CategoriesSectionProps {
  onSelectCategory: (cat: ProductCategory) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'clothing' as ProductCategory,
      title: 'Fitness Kıyafetleri',
      desc: '280 GSM Heavyweight Oversize Tişörtler, Kompresyon Şortlar ve Stringer Atletler',
      itemCount: '12 Model',
      bgImg: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      icon: Shirt
    },
    {
      id: 'supplements' as ProductCategory,
      title: 'Protein & Takviyeler',
      desc: 'CFM Whey Isolate, Saf Creapure® Kreatin ve Klinik Dozajlı Pre-Workout',
      itemCount: '18 Ürün',
      bgImg: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=800&q=80',
      icon: Zap
    },
    {
      id: 'accessories' as ProductCategory,
      title: 'Aksesuar & Ekipman',
      desc: '10mm Çelik Tokalı Hakiki Deri Kemerler, Çift Duvarlı Termos Çelik Shakerlar',
      itemCount: '9 Ekipman',
      bgImg: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      icon: Dumbbell
    }
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#080808] border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A1F] tracking-widest uppercase mb-2">
              <span className="w-6 h-0.5 bg-[#FF5A1F]" />
              <span>KOLEKSİYONLARI KEŞFET</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
              PERFORMANS <span className="text-[#FF5A1F]">KATEGORİLERİ</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
            Antrenmanında limitleri zorlamak için tasarlanmış birinci sınıf sporcu giyim ve klinik ham maddeli takviyeler.
          </p>
        </div>

        {/* 3 Large Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer border border-neutral-800 hover:border-[#FF5A1F] transition-all duration-500 shadow-xl"
              >
                {/* Background Image */}
                <img
                  src={cat.bgImg}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center filter grayscale brightness-50 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-75 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-neutral-700">
                      {cat.itemCount}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-black/60 border border-neutral-700 flex items-center justify-center text-white group-hover:bg-[#FF5A1F] group-hover:border-[#FF5A1F] transition-colors">
                      <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  <div>
                    <div className="w-8 h-8 rounded-lg bg-[#FF5A1F]/20 border border-[#FF5A1F]/40 flex items-center justify-center text-[#FF5A1F] mb-3">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-display text-3xl font-black text-white uppercase tracking-wide group-hover:text-[#FF5A1F] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
