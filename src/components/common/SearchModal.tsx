import React, { useState, useEffect } from 'react';
import { Search, X, Dumbbell, Tag, ArrowRight, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

interface SearchModalProps {
  onNavigate: (view: string, param?: string) => void;
  onSelectProduct: (p: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onNavigate, onSelectProduct }) => {
  const { searchOpen, closeSearch, products, coachingPackages, blogPosts } = useApp();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (searchOpen) closeSearch();
      }
      if (e.key === 'Escape' && searchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, closeSearch]);

  if (!searchOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const filteredProducts = cleanQuery
    ? products.filter(
        p =>
          p.title.toLowerCase().includes(cleanQuery) ||
          p.category.toLowerCase().includes(cleanQuery) ||
          p.subcategory.toLowerCase().includes(cleanQuery) ||
          p.tags.some(t => t.toLowerCase().includes(cleanQuery))
      )
    : [];

  const filteredPackages = cleanQuery
    ? coachingPackages.filter(
        pkg =>
          pkg.name.toLowerCase().includes(cleanQuery) ||
          pkg.tagline.toLowerCase().includes(cleanQuery) ||
          pkg.features.some(f => f.toLowerCase().includes(cleanQuery))
      )
    : [];

  const filteredBlogs = cleanQuery
    ? blogPosts.filter(
        b =>
          b.title.toLowerCase().includes(cleanQuery) ||
          b.excerpt.toLowerCase().includes(cleanQuery) ||
          b.category.toLowerCase().includes(cleanQuery)
      )
    : [];

  const totalResults = filteredProducts.length + filteredPackages.length + filteredBlogs.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-[#121212] border border-neutral-700/80 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-800 gap-3">
          <Search className="w-5 h-5 text-[#FF5A1F] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün, koçluk paketi veya blog yazısı ara (Örn: Whey, Tişört, Kreatin, Dönüşüm)..."
            className="w-full bg-transparent text-white placeholder-neutral-500 text-sm focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-neutral-500 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={closeSearch}
            className="px-2 py-1 bg-neutral-800 text-neutral-400 text-xs rounded hover:text-white hover:bg-neutral-700 transition-colors ml-1"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="py-8 text-center text-neutral-500 text-xs">
              <p className="font-semibold text-neutral-400 mb-2">Hızlı Öneriler</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Oversized Tişört', 'Whey Isolate', 'Creapure Kreatin', 'Dönüşüm Planı', 'Lever Kemer'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-neutral-400 hover:text-[#FF5A1F] hover:border-[#FF5A1F]/50 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="py-12 text-center text-neutral-400 text-sm">
              <p className="font-semibold text-white mb-1">"{query}" ile eşleşen sonuç bulunamadı.</p>
              <p className="text-xs text-neutral-500">Lütfen farklı bir anahtar kelime deneyin.</p>
            </div>
          )}

          {/* Coaching Results */}
          {filteredPackages.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#FF5A1F] mb-2 flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5" /> Koçluk Paketleri ({filteredPackages.length})
              </p>
              <div className="space-y-2">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => {
                      onNavigate('coaching');
                      closeSearch();
                    }}
                    className="p-3 rounded-lg bg-neutral-900/70 hover:bg-neutral-800/80 border border-neutral-800 hover:border-[#FF5A1F]/40 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <h5 className="font-bold text-sm text-white">{pkg.name}</h5>
                      <p className="text-xs text-neutral-400 line-clamp-1">{pkg.tagline}</p>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <span className="text-xs font-bold text-[#FF5A1F]">
                        {pkg.durations[0].price.toLocaleString('tr-TR')} ₺'den başlayan
                      </span>
                      <ArrowRight className="w-4 h-4 text-neutral-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Results */}
          {filteredProducts.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#FF5A1F] mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Mağaza Ürünleri ({filteredProducts.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p);
                      closeSearch();
                    }}
                    className="p-2.5 rounded-lg bg-neutral-900/70 hover:bg-neutral-800/80 border border-neutral-800 hover:border-[#FF5A1F]/40 cursor-pointer flex items-center gap-3 transition-colors"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-12 h-12 rounded object-cover bg-neutral-800 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-semibold text-white truncate">{p.title}</h5>
                      <p className="text-[11px] text-neutral-400">{p.subcategory}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-white">
                          {(p.discountedPrice || p.price).toLocaleString('tr-TR')} ₺
                        </span>
                        {p.discountedPrice && (
                          <span className="text-[10px] text-neutral-500 line-through">
                            {p.price.toLocaleString('tr-TR')} ₺
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blog Results */}
          {filteredBlogs.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#FF5A1F] mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Blog & Makaleler ({filteredBlogs.length})
              </p>
              <div className="space-y-2">
                {filteredBlogs.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      onNavigate('blog_detail', b.id);
                      closeSearch();
                    }}
                    className="p-3 rounded-lg bg-neutral-900/70 hover:bg-neutral-800/80 border border-neutral-800 hover:border-[#FF5A1F]/40 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="min-w-0 pr-4">
                      <h5 className="font-semibold text-xs text-white truncate">{b.title}</h5>
                      <p className="text-[11px] text-neutral-400 line-clamp-1">{b.excerpt}</p>
                    </div>
                    <span className="text-[10px] text-neutral-500 whitespace-nowrap">{b.readTime}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
