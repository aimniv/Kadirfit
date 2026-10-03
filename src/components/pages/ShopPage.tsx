import React, { useState } from 'react';
import {
  Filter,
  Grid,
  List,
  Star,
  ShoppingBag,
  SlidersHorizontal,
  X,
  Search,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory } from '../../types';

interface ShopPageProps {
  initialCategory?: ProductCategory | 'all';
  onOpenProduct: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory = 'all',
  onOpenProduct
}) => {
  const { products, addToCart } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering
  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedSubcategory !== 'all' && p.subcategory !== selectedSubcategory) return false;
    const finalPrice = p.discountedPrice || p.price;
    if (finalPrice > maxPrice) return false;
    if (selectedSize !== 'all' && (!p.sizes || !p.sizes.includes(selectedSize))) return false;
    if (selectedFlavor !== 'all' && (!p.flavors || !p.flavors.includes(selectedFlavor))) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountedPrice || a.price;
    const priceB = b.discountedPrice || b.price;
    if (sortBy === 'price_asc') return priceA - priceB;
    if (sortBy === 'price_desc') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const handleQuickAdd = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    addToCart({
      id: `cart-${p.id}-${Date.now()}`,
      productId: p.id,
      title: p.title,
      price: p.discountedPrice || p.price,
      image: p.images[0],
      quantity: 1,
      selectedSize: p.sizes ? p.sizes[0] : undefined,
      selectedFlavor: p.flavors ? p.flavors[0] : undefined
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Banner */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A1F] tracking-widest uppercase mb-2">
              <span className="w-6 h-0.5 bg-[#FF5A1F]" />
              <span>RESMİ MAĞAZA</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
              PERFORMANS <span className="text-[#FF5A1F]">KOLEKSİYONU</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              280 GSM Heavyweight sporcu giyim, CFM izole whey, Creapure® kreatin ve paslanmaz ekipmanlar.
            </p>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-end">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 bg-neutral-900 border border-neutral-800 text-xs font-bold text-white rounded-lg flex items-center gap-2"
            >
              <Filter className="w-4 h-4 text-[#FF5A1F]" />
              <span>Filtreler</span>
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}
                title="Grid Görünüm"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}
                title="Liste Görünüm"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded-lg p-2 focus:outline-none focus:border-[#FF5A1F]"
            >
              <option value="featured">Öne Çıkanlar</option>
              <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
              <option value="rating">En Yüksek Puanlılar</option>
            </select>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block space-y-6">
            
            {/* Search Input */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ürün adı ara..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <h4 className="font-heading uppercase text-xs font-bold text-white tracking-wider">
                Kategoriler
              </h4>
              <div className="space-y-1 text-xs">
                {[
                  { id: 'all', label: 'Tüm Ürünler' },
                  { id: 'clothing', label: 'Fitness Kıyafetleri' },
                  { id: 'supplements', label: 'Protein & Takviyeler' },
                  { id: 'accessories', label: 'Aksesuar & Kemer' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id as any);
                      setSelectedSubcategory('all');
                    }}
                    className={`w-full text-left py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'bg-[#FF5A1F]/15 text-[#FF5A1F] font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-heading uppercase font-bold text-white tracking-wider">
                  Maksimum Fiyat
                </span>
                <span className="font-bold text-[#FF5A1F]">{maxPrice} ₺</span>
              </div>
              <input
                type="range"
                min="400"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#FF5A1F] cursor-pointer"
              />
            </div>

            {/* Apparel Sizes (If clothing selected or all) */}
            {(selectedCategory === 'clothing' || selectedCategory === 'all') && (
              <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <h4 className="font-heading uppercase text-xs font-bold text-white tracking-wider">
                  Beden Filtresi
                </h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {['all', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 rounded border transition-colors ${
                        selectedSize === sz
                          ? 'bg-[#FF5A1F] border-[#FF5A1F] text-white font-bold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {sz === 'all' ? 'Hepsi' : sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reset Filters button */}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubcategory('all');
                setMaxPrice(3000);
                setSelectedSize('all');
                setSelectedFlavor('all');
                setSearchQuery('');
              }}
              className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-semibold rounded border border-neutral-800 transition-colors"
            >
              Filtreleri Sıfırla
            </button>
          </aside>

          {/* Right Main Grid */}
          <div className="lg:col-span-3">
            {sortedProducts.length === 0 ? (
              <div className="py-20 text-center rounded-2xl bg-neutral-900/30 border border-neutral-800">
                <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h3 className="font-bold text-white text-base">Filtrelerle Eşleşen Ürün Bulunamadı</h3>
                <p className="text-xs text-neutral-400 mt-1">Lütfen filtre kriterlerinizi değiştiriniz.</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((p) => {
                  const hasDiscount = p.discountedPrice && p.discountedPrice < p.price;
                  return (
                    <div
                      key={p.id}
                      onClick={() => onOpenProduct(p)}
                      className="group rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
                    >
                      <div>
                        <div className="relative aspect-square overflow-hidden bg-neutral-950">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {hasDiscount && (
                            <div className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                              İNDİRİM
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                            <span className="uppercase tracking-wider">{p.subcategory}</span>
                            <div className="flex items-center gap-1 text-amber-400">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span className="font-bold text-white">{p.rating}</span>
                              <span className="text-neutral-500">({p.reviewCount})</span>
                            </div>
                          </div>

                          <h3 className="font-semibold text-sm text-white group-hover:text-[#FF5A1F] transition-colors line-clamp-2 leading-snug">
                            {p.title}
                          </h3>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="font-display text-2xl font-black text-white">
                            {(p.discountedPrice || p.price).toLocaleString('tr-TR')} ₺
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-neutral-500 line-through">
                              {p.price.toLocaleString('tr-TR')} ₺
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleQuickAdd(e, p)}
                          className="w-full py-2.5 bg-neutral-800 hover:bg-[#FF5A1F] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-95"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Sepete Ekle</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // List View
              <div className="space-y-4">
                {sortedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onOpenProduct(p)}
                    className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 flex flex-col sm:flex-row items-center gap-4 cursor-pointer transition-colors"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-24 h-24 rounded-lg object-cover bg-neutral-950 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] text-[#FF5A1F] uppercase font-bold">{p.subcategory}</span>
                      <h4 className="font-bold text-sm text-white">{p.title}</h4>
                      <p className="text-xs text-neutral-400 line-clamp-1 mt-1">{p.shortDescription}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-display text-2xl font-bold text-white block">
                        {(p.discountedPrice || p.price).toLocaleString('tr-TR')} ₺
                      </span>
                      <button
                        onClick={(e) => handleQuickAdd(e, p)}
                        className="mt-2 px-4 py-2 bg-[#FF5A1F] text-white text-xs font-bold uppercase rounded"
                      >
                        Sepete Ekle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
