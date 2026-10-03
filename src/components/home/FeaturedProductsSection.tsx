import React from 'react';
import { Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

interface FeaturedProductsSectionProps {
  onNavigateToShop: () => void;
  onOpenProduct: (product: Product) => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  onNavigateToShop,
  onOpenProduct
}) => {
  const { products, addToCart } = useApp();

  const featured = products.filter(p => p.isFeatured).slice(0, 4);

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
      selectedColor: p.colors ? p.colors[0] : undefined,
      selectedFlavor: p.flavors ? p.flavors[0] : undefined,
      selectedWeight: p.weights ? p.weights[0] : undefined
    });
  };

  return (
    <section className="py-20 sm:py-28 bg-[#0A0A0A] border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A1F] tracking-widest uppercase mb-2">
              <span className="w-6 h-0.5 bg-[#FF5A1F]" />
              <span>RESMİ MAĞAZA</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
              ÖNE ÇIKAN <span className="text-[#FF5A1F]">SPORCU ÜRÜNLERİ</span>
            </h2>
          </div>

          <button
            onClick={onNavigateToShop}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-[#FF5A1F] transition-colors"
          >
            <span>Tüm Mağazayı Gör</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => {
            const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
            const discountPercent = hasDiscount
              ? Math.round(((product.price - product.discountedPrice!) / product.price) * 100)
              : 0;

            return (
              <div
                key={product.id}
                onClick={() => onOpenProduct(product)}
                className="group rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative aspect-square overflow-hidden bg-neutral-950">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge top-left */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                      {product.isBestSeller && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/80 text-[#FF5A1F] border border-[#FF5A1F]/30 backdrop-blur-sm">
                          Çok Satan
                        </span>
                      )}
                      {hasDiscount && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white">
                          -%{discountPercent}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                      <span className="uppercase tracking-wider">{product.subcategory}</span>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="font-bold text-white">{product.rating}</span>
                        <span className="text-neutral-500">({product.reviewCount})</span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-sm text-white group-hover:text-[#FF5A1F] transition-colors line-clamp-2 leading-snug">
                      {product.title}
                    </h3>

                    <p className="mt-1 text-xs text-neutral-400 line-clamp-1">
                      {product.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Footer Price & Add Button */}
                <div className="p-4 pt-0">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-display text-2xl font-black text-white">
                      {(product.discountedPrice || product.price).toLocaleString('tr-TR')} ₺
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-neutral-500 line-through">
                        {product.price.toLocaleString('tr-TR')} ₺
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
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
      </div>
    </section>
  );
};
