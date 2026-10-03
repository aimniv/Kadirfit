import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useApp();

  const approved = testimonials.filter(t => t.approved);

  return (
    <section className="py-20 sm:py-24 bg-[#0A0A0A] border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A1F] tracking-widest uppercase mb-3">
            <span className="w-6 h-0.5 bg-[#FF5A1F]" />
            <span>MEMNUNİYET & DEĞERLENDİRMELER</span>
            <span className="w-6 h-0.5 bg-[#FF5A1F]" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
            ÖĞRENCİLERİMİZ <span className="text-[#FF5A1F]">NE DİYOR?</span>
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            Kadirfit ailesine katılarak disiplin kazanan ve hedeflerine ulaşan yüzlerce sporcunun samimi deneyimleri.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approved.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex flex-col justify-between hover:border-neutral-700 transition-colors relative"
            >
              <Quote className="w-8 h-8 text-neutral-800 absolute top-5 right-5 pointer-events-none" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-6">
                  "{item.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-neutral-800/80 flex items-center gap-3">
                <img
                  src={item.avatarUrl}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover bg-neutral-800 border border-neutral-700"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-bold text-xs text-white">{item.name}</h5>
                    {item.verified && (
                      <span title="Doğrulanmış Öğrenci">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A1F]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400">{item.roleOrCity}</p>
                  <p className="text-[10px] text-[#FF5A1F] font-semibold">{item.programType}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
