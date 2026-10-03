import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  AlertTriangle,
  Ruler,
  ChevronRight
} from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectProduct
}) => {
  const { addToCart, wishlist, toggleWishlist, currentUser, products } = useApp();

  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes ? product.sizes[0] : '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors ? product.colors[0] : '');
  const [selectedFlavor, setSelectedFlavor] = useState<string>(product.flavors ? product.flavors[0] : '');
  const [selectedWeight, setSelectedWeight] = useState<string>(product.weights ? product.weights[0] : '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'nutrition' | 'reviews'>('details');
  const [showSizeChart, setShowSizeChart] = useState(false);

  // New review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isFavorite = wishlist.includes(product.id);
  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;

  const handleAddToCart = () => {
    addToCart({
      id: `cart-${product.id}-${selectedSize}-${selectedColor}-${selectedFlavor}-${selectedWeight}-${Date.now()}`,
      productId: product.id,
      title: product.title,
      price: product.discountedPrice || product.price,
      image: product.images[activeImageIndex] || product.images[0],
      quantity,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined,
      selectedFlavor: selectedFlavor || undefined,
      selectedWeight: selectedWeight || undefined
    });
    onClose();
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setReviewSubmitted(true);
    // In a real database this gets saved; for now show confirmation
  };

  // Related products from same category
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="w-full max-w-4xl bg-[#121212] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-colors border border-neutral-700"
          title="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Visual Gallery with Thumbnails & Zoom container */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 relative group">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 cursor-zoom-in"
                />
                {hasDiscount && (
                  <div className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-black uppercase px-2.5 py-1 rounded">
                    İNDİRİM
                  </div>
                )}
              </div>

              {/* Thumbnails row */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx
                          ? 'border-[#FF5A1F] scale-95'
                          : 'border-neutral-800 hover:border-neutral-600'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta & Buying Actions */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                  <span className="uppercase tracking-wider font-semibold text-[#FF5A1F]">
                    {product.brand}
                  </span>
                  <span className="text-[11px] text-neutral-500">SKU: {product.sku}</span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-wide">
                  {product.title}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-neutral-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-white">{product.rating}</span>
                  <span className="text-neutral-500">({product.reviewCount} Değerlendirme)</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <span className="font-display text-3xl font-black text-white">
                  {(product.discountedPrice || product.price).toLocaleString('tr-TR')} ₺
                </span>
                {hasDiscount && (
                  <span className="text-sm text-neutral-500 line-through">
                    {product.price.toLocaleString('tr-TR')} ₺
                  </span>
                )}
                <span className="ml-auto text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Stokta ({product.stock} Adet)
                </span>
              </div>

              {/* Variants Section */}
              {/* 1. Apparel Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-300 uppercase tracking-wider">
                      Beden Seçiniz:
                    </span>
                    <button
                      onClick={() => setShowSizeChart(true)}
                      className="text-[#FF5A1F] hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Ruler className="w-3 h-3" />
                      Beden Tablosu
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-all ${
                          selectedSize === s
                            ? 'bg-[#FF5A1F] border-[#FF5A1F] text-white shadow-md'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Apparel Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                    Renk Seçiniz:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          selectedColor === c
                            ? 'bg-neutral-800 border-[#FF5A1F] text-[#FF5A1F]'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Supplement Flavors */}
              {product.flavors && product.flavors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                    Aroma Seçiniz:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.flavors.map((fl) => (
                      <button
                        key={fl}
                        onClick={() => setSelectedFlavor(fl)}
                        className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
                          selectedFlavor === fl
                            ? 'bg-[#FF5A1F] border-[#FF5A1F] text-white'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-600'
                        }`}
                      >
                        {fl}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Supplement Weights */}
              {product.weights && product.weights.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                    Gramaj / Servis Sayısı:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.weights.map((w) => (
                      <button
                        key={w}
                        onClick={() => setSelectedWeight(w)}
                        className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
                          selectedWeight === w
                            ? 'bg-[#FF5A1F] border-[#FF5A1F] text-white'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-600'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Buy Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-900 px-2 py-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-1 text-neutral-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="p-1 text-neutral-400 hover:text-white"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/30 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Sepete Ekle ({(quantity * (product.discountedPrice || product.price)).toLocaleString('tr-TR')} ₺)</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-lg border transition-colors ${
                    isFavorite
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-500'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                  title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Shipping & Guarantee perks */}
              <div className="pt-3 border-t border-neutral-800/80 grid grid-cols-3 gap-2 text-[11px] text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  <span>Aynı Gün Kargo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  <span>14 Gün İade</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Orijinal Ürün</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details / Nutrition / Reviews Tabs */}
          <div className="border-t border-neutral-800 pt-6">
            <div className="flex items-center gap-4 border-b border-neutral-800 pb-3 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-1 transition-colors relative ${
                  activeTab === 'details' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Ürün Açıklaması & Özellikler
                {activeTab === 'details' && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-[#FF5A1F]" />
                )}
              </button>

              {product.category === 'supplements' && (
                <button
                  onClick={() => setActiveTab('nutrition')}
                  className={`pb-1 transition-colors relative ${
                    activeTab === 'nutrition' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Besin Değerleri Tablosu & Kullanım
                  {activeTab === 'nutrition' && (
                    <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-[#FF5A1F]" />
                  )}
                </button>
              )}

              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-1 transition-colors relative ${
                  activeTab === 'reviews' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Müşteri Yorumları ({product.reviewCount})
                {activeTab === 'reviews' && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-[#FF5A1F]" />
                )}
              </button>
            </div>

            {/* Tab 1: Description & Features */}
            {activeTab === 'details' && (
              <div className="pt-6 space-y-4 text-xs text-neutral-300 leading-relaxed">
                <p>{product.description}</p>

                {product.features && (
                  <div>
                    <h5 className="font-bold text-white uppercase text-[11px] mb-2">Öne Çıkan Detaylar:</h5>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Nutrition Facts for Supplements */}
            {activeTab === 'nutrition' && product.nutritionFacts && (
              <div className="pt-6 space-y-6">
                <div className="max-w-md rounded-xl bg-black border border-neutral-800 p-5 font-mono text-xs">
                  <h4 className="font-sans font-black text-lg text-white border-b-4 border-white pb-1 mb-2">
                    BESİN DEĞERLERİ TABLOSU
                  </h4>
                  <div className="flex justify-between text-neutral-400 pb-2 border-b border-neutral-700">
                    <span>Porsiyon Büyüklüğü:</span>
                    <span className="text-white font-bold">{product.nutritionFacts.servingSize}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400 py-2 border-b border-neutral-700">
                    <span>Toplam Porsiyon:</span>
                    <span className="text-white font-bold">{product.nutritionFacts.servingsPerContainer}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold py-2 border-b-2 border-white text-sm">
                    <span>Kalori:</span>
                    <span className="text-[#FF5A1F]">{product.nutritionFacts.energyKcal} kcal</span>
                  </div>
                  <div className="space-y-1.5 pt-2 text-neutral-300">
                    <div className="flex justify-between">
                      <span className="font-bold text-white">Protein:</span>
                      <span className="font-bold text-emerald-400">{product.nutritionFacts.protein}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Karbonhidrat:</span>
                      <span>{product.nutritionFacts.carbohydrates}g</span>
                    </div>
                    <div className="flex justify-between text-neutral-500 pl-4 text-[11px]">
                      <span>- Şeker:</span>
                      <span>{product.nutritionFacts.sugar}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Yağ:</span>
                      <span>{product.nutritionFacts.fat}g</span>
                    </div>
                    {product.nutritionFacts.bcaa && (
                      <div className="flex justify-between pt-1 border-t border-neutral-800 text-white font-semibold">
                        <span>Doğal BCAA:</span>
                        <span className="text-amber-400">{product.nutritionFacts.bcaa}g</span>
                      </div>
                    )}
                  </div>
                </div>

                {product.usageInstructions && (
                  <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs">
                    <h5 className="font-bold text-white uppercase text-[11px] mb-1">Kullanım Önerisi:</h5>
                    <p className="text-neutral-300 leading-relaxed">{product.usageInstructions}</p>
                  </div>
                )}

                {/* Mandatory Legal Warning for Supplements */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Yasal Uyarı: </strong>
                    Takviye edici gıdalar ilaç değildir, hastalıkların önlenmesi veya tedavi edilmesi amacıyla kullanılmaz.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Customer Reviews */}
            {activeTab === 'reviews' && (
              <div className="pt-6 space-y-6">
                {/* Form to leave review (Only for logged in members) */}
                <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <h5 className="font-bold text-white text-xs uppercase mb-2">
                    Bu Ürünü Satın Aldınız Mı? Değerlendirin:
                  </h5>
                  {currentUser ? (
                    reviewSubmitted ? (
                      <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> Değerlendirmeniz kaydedildi! Editör onayından sonra yayınlanacaktır.
                      </p>
                    ) : (
                      <form onSubmit={handleAddReview} className="space-y-3">
                        <div className="flex items-center gap-2 text-xs text-neutral-300">
                          <span>Puanınız:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className={`text-base ${star <= reviewRating ? 'text-amber-400' : 'text-neutral-600'}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>

                        <textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Ürünün kumaşı, kalitesi, tadı veya karışımı hakkında deneyimlerinizi yazınız..."
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF5A1F] h-20"
                          required
                        />

                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#FF5A1F] text-white text-xs font-bold uppercase rounded-lg hover:bg-[#e04e18] transition-colors"
                        >
                          Yorumu Gönder
                        </button>
                      </form>
                    )
                  ) : (
                    <p className="text-xs text-neutral-400">
                      Sadece sipariş vermiş kayıtlı üyeler değerlendirme yapabilir. Lütfen giriş yapınız.
                    </p>
                  )}
                </div>

                {/* Sample Verified Reviews */}
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-800 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">Caner Y.</span>
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                          <Check className="w-3 h-3" /> Doğrulanmış Alıcı
                        </span>
                      </div>
                      <span className="text-amber-400">★★★★★</span>
                    </div>
                    <p className="text-neutral-300">
                      Kumaş kalitesi inanılmaz ağır ve tok duruyor. 1.84 boy 86 kiloyum L beden tam istediğim oversize dökümü verdi. Yıkamada çekme yapmadı.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Related Products Carousel */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-neutral-800 pt-6">
              <h4 className="font-heading uppercase text-sm font-bold text-white mb-4">
                Benzer Ürünler
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectProduct(rel)}
                    className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 cursor-pointer flex items-center gap-3 transition-colors"
                  >
                    <img
                      src={rel.images[0]}
                      alt={rel.title}
                      className="w-14 h-14 rounded-lg object-cover bg-neutral-950 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="font-semibold text-xs text-white truncate">{rel.title}</h5>
                      <span className="font-bold text-xs text-[#FF5A1F] mt-1 block">
                        {(rel.discountedPrice || rel.price).toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#161616] border border-neutral-700 rounded-xl p-6 relative">
            <button
              onClick={() => setShowSizeChart(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="font-heading text-lg font-bold text-white uppercase mb-1">
              KADIRFIT Beden Ölçü Tablosu (cm)
            </h4>
            <p className="text-xs text-neutral-400 mb-4">
              Ürünlerimiz sporcu anatomisine uygun geniş omuz dökümlü (oversize) kalıptır.
            </p>
            <table className="w-full text-xs text-left border-collapse border border-neutral-800">
              <thead>
                <tr className="bg-neutral-800 text-white font-bold">
                  <th className="p-2 border border-neutral-700">Beden</th>
                  <th className="p-2 border border-neutral-700">Göğüs (cm)</th>
                  <th className="p-2 border border-neutral-700">Boy (cm)</th>
                  <th className="p-2 border border-neutral-700">Tavsiye Kilo</th>
                </tr>
              </thead>
              <tbody className="text-neutral-300">
                <tr>
                  <td className="p-2 border border-neutral-800 font-bold text-[#FF5A1F]">S</td>
                  <td className="p-2 border border-neutral-800">106</td>
                  <td className="p-2 border border-neutral-800">72</td>
                  <td className="p-2 border border-neutral-800">65 - 75 kg</td>
                </tr>
                <tr>
                  <td className="p-2 border border-neutral-800 font-bold text-[#FF5A1F]">M</td>
                  <td className="p-2 border border-neutral-800">112</td>
                  <td className="p-2 border border-neutral-800">74</td>
                  <td className="p-2 border border-neutral-800">75 - 85 kg</td>
                </tr>
                <tr>
                  <td className="p-2 border border-neutral-800 font-bold text-[#FF5A1F]">L</td>
                  <td className="p-2 border border-neutral-800">118</td>
                  <td className="p-2 border border-neutral-800">76</td>
                  <td className="p-2 border border-neutral-800">85 - 95 kg</td>
                </tr>
                <tr>
                  <td className="p-2 border border-neutral-800 font-bold text-[#FF5A1F]">XL</td>
                  <td className="p-2 border border-neutral-800">124</td>
                  <td className="p-2 border border-neutral-800">78</td>
                  <td className="p-2 border border-neutral-800">95 - 110 kg</td>
                </tr>
                <tr>
                  <td className="p-2 border border-neutral-800 font-bold text-[#FF5A1F]">XXL</td>
                  <td className="p-2 border border-neutral-800">130</td>
                  <td className="p-2 border border-neutral-800">80</td>
                  <td className="p-2 border border-neutral-800">110+ kg</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
