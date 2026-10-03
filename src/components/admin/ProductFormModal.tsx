import React, { useRef, useState } from 'react';
import { X, Upload, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { productsApi } from '../../lib/productsApi';
import type { Product, ProductCategory } from '../../types';

interface ProductFormModalProps {
  /** The product being edited, or null to create a new one. */
  product: Product | null;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  clothing: 'Giyim',
  supplements: 'Takviye & Protein',
  accessories: 'Aksesuar & Kemer'
};

const SUBCATEGORY_HINTS: Record<ProductCategory, string> = {
  clothing: 'Tişört, Şort, Atlet...',
  supplements: 'Protein Tozu, Kreatin, Pre-Workout...',
  accessories: 'Kemer, Shaker...'
};

const inputCls =
  'w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]';
const labelCls = 'text-xs text-neutral-400 mb-1 block';

const splitList = (v: string, sep: RegExp) => v.split(sep).map(x => x.trim()).filter(Boolean);

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useApp();
  const editing = product !== null;

  const [title, setTitle] = useState(product?.title ?? '');
  const [category, setCategory] = useState<ProductCategory>(product?.category ?? 'clothing');
  const [subcategory, setSubcategory] = useState(product?.subcategory ?? '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [discountedPrice, setDiscountedPrice] = useState(product?.discountedPrice ? String(product.discountedPrice) : '');
  const [stock, setStock] = useState(product ? String(product.stock) : '');
  const [sku, setSku] = useState(product?.sku ?? '');
  const [brand, setBrand] = useState(product?.brand ?? 'Kadirfit');
  const [shortDescription, setShortDescription] = useState(product?.shortDescription ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [features, setFeatures] = useState((product?.features ?? []).join('\n'));
  const [tags, setTags] = useState((product?.tags ?? []).join(', '));
  const [sizes, setSizes] = useState((product?.sizes ?? []).join(', '));
  const [colors, setColors] = useState((product?.colors ?? []).join(', '));
  const [flavors, setFlavors] = useState((product?.flavors ?? []).join(', '));
  const [weights, setWeights] = useState((product?.weights ?? []).join(', '));
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller ?? false);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    setUploading(true);
    for (const file of Array.from(files)) {
      if (images.length >= 8) {
        setError('En fazla 8 görsel eklenebilir.');
        break;
      }
      const res = await productsApi.uploadImage(file);
      if (res.success && res.url) setImages(prev => [...prev, res.url!]);
      else {
        setError(res.message || 'Görsel yüklenemedi.');
        break;
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const priceNum = Number(price.replace(',', '.'));
    const discountNum = discountedPrice.trim() ? Number(discountedPrice.replace(',', '.')) : undefined;
    const stockNum = Number(stock);

    if (!title.trim()) return setError('Ürün adı zorunludur.');
    if (!(priceNum > 0)) return setError('Geçerli bir fiyat giriniz.');
    if (discountNum !== undefined && !(discountNum > 0 && discountNum < priceNum)) {
      return setError('İndirimli fiyat, normal fiyattan düşük olmalıdır.');
    }
    if (!Number.isInteger(stockNum) || stockNum < 0) return setError('Stok adedi 0 veya daha büyük bir tam sayı olmalıdır.');
    if (images.length === 0) return setError('En az bir ürün görseli ekleyin.');

    const payload: Partial<Product> = {
      title: title.trim(),
      category,
      subcategory: subcategory.trim(),
      price: priceNum,
      // null tells the server to clear an existing discount
      discountedPrice: (discountNum ?? null) as number | undefined,
      stock: stockNum,
      sku: sku.trim() || undefined,
      brand: brand.trim(),
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      features: splitList(features, /\n/),
      tags: splitList(tags, /,/),
      sizes: splitList(sizes, /,/),
      colors: splitList(colors, /,/),
      flavors: splitList(flavors, /,/),
      weights: splitList(weights, /,/),
      images,
      isFeatured,
      isNew,
      isBestSeller
    };

    setSaving(true);
    const res = editing ? await updateProduct({ ...payload, id: product!.id }) : await addProduct(payload);
    setSaving(false);
    if (res.success) onClose();
    else setError(res.message || 'Ürün kaydedilemedi.');
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/85 backdrop-blur-sm flex items-start justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl my-6 bg-[#121212] border border-neutral-800 rounded-2xl shadow-2xl relative"
      >
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <h3 className="font-heading uppercase text-sm font-bold text-white tracking-wider">
            {editing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
          </h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800" title="Kapat">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg text-xs flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className={labelCls}>Ürün Adı *</label>
            <input className={inputCls} value={title} onChange={e => setTitle(e.target.value)} placeholder="KADIRFIT Pro-Heavyweight Oversize Tişört" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Kategori *</label>
              <select className={inputCls} value={category} onChange={e => setCategory(e.target.value as ProductCategory)}>
                {(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map(c => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Alt Kategori</label>
              <input className={inputCls} value={subcategory} onChange={e => setSubcategory(e.target.value)} placeholder={SUBCATEGORY_HINTS[category]} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Fiyat (₺) *</label>
              <input className={inputCls} inputMode="decimal" value={price} onChange={e => setPrice(e.target.value)} placeholder="799" required />
            </div>
            <div>
              <label className={labelCls}>İndirimli Fiyat (₺)</label>
              <input className={inputCls} inputMode="decimal" value={discountedPrice} onChange={e => setDiscountedPrice(e.target.value)} placeholder="boş = indirim yok" />
            </div>
            <div>
              <label className={labelCls}>Stok (adet) *</label>
              <input className={inputCls} inputMode="numeric" value={stock} onChange={e => setStock(e.target.value)} placeholder="50" required />
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className={labelCls}>Görseller * (ilk görsel vitrinde görünür)</label>
            <div className="flex flex-wrap gap-2">
              {images.map((url, i) => (
                <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-neutral-800 bg-black group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {i === 0 && <span className="absolute bottom-0 inset-x-0 text-[9px] text-center bg-[#FF5A1F] text-white font-bold">VİTRİN</span>}
                  <button
                    type="button"
                    onClick={() => setImages(prev => prev.filter(u => u !== url))}
                    className="absolute top-1 right-1 p-1 rounded bg-black/70 text-rose-400 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Görseli kaldır"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading || images.length >= 8}
                className="w-20 h-20 rounded-lg border border-dashed border-neutral-700 text-neutral-400 hover:text-white hover:border-[#FF5A1F] flex flex-col items-center justify-center gap-1 text-[10px] disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Yükleniyor' : 'Fotoğraf Ekle'}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={e => handleFiles(e.target.files)} />
            <p className="text-[10px] text-neutral-500 mt-1.5">JPG, PNG veya WebP. Büyük fotoğraflar otomatik küçültülür.</p>
          </div>

          <div>
            <label className={labelCls}>Kısa Açıklama</label>
            <input className={inputCls} value={shortDescription} onChange={e => setShortDescription(e.target.value)} placeholder="Listede ürün adının altında görünen tek cümle" maxLength={300} />
          </div>

          <div>
            <label className={labelCls}>Açıklama</label>
            <textarea className={`${inputCls} min-h-24`} value={description} onChange={e => setDescription(e.target.value)} placeholder="Ürün detay sayfasındaki açıklama" />
          </div>

          <div>
            <label className={labelCls}>Özellikler (her satıra bir özellik)</label>
            <textarea className={`${inputCls} min-h-20`} value={features} onChange={e => setFeatures(e.target.value)} placeholder={'%100 pamuk\n380 GSM ağır kumaş'} />
          </div>

          {category === 'clothing' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Bedenler (virgülle ayırın)</label>
                <input className={inputCls} value={sizes} onChange={e => setSizes(e.target.value)} placeholder="S, M, L, XL, XXL" />
              </div>
              <div>
                <label className={labelCls}>Renkler (virgülle ayırın)</label>
                <input className={inputCls} value={colors} onChange={e => setColors(e.target.value)} placeholder="Siyah, Beyaz" />
              </div>
            </div>
          )}

          {category === 'supplements' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Aromalar (virgülle ayırın)</label>
                <input className={inputCls} value={flavors} onChange={e => setFlavors(e.target.value)} placeholder="Çikolata, Vanilya" />
              </div>
              <div>
                <label className={labelCls}>Boyutlar (virgülle ayırın)</label>
                <input className={inputCls} value={weights} onChange={e => setWeights(e.target.value)} placeholder="1000g, 2000g" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>SKU (boşsa otomatik)</label>
              <input className={inputCls} value={sku} onChange={e => setSku(e.target.value)} placeholder="KF-TEE-004" />
            </div>
            <div>
              <label className={labelCls}>Marka</label>
              <input className={inputCls} value={brand} onChange={e => setBrand(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Etiketler (virgülle)</label>
              <input className={inputCls} value={tags} onChange={e => setTags(e.target.value)} placeholder="oversize, yaz" />
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#FF5A1F]" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
              Ana sayfada öne çıkar
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#FF5A1F]" checked={isNew} onChange={e => setIsNew(e.target.checked)} />
              "Yeni" rozeti
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#FF5A1F]" checked={isBestSeller} onChange={e => setIsBestSeller(e.target.checked)} />
              "Çok satan" rozeti
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-5 border-t border-neutral-800">
          <button type="button" onClick={onClose} className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg">
            Vazgeç
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-5 py-2.5 bg-[#FF5A1F] hover:bg-[#e04e18] disabled:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {editing ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle'}
          </button>
        </div>
      </form>
    </div>
  );
};
