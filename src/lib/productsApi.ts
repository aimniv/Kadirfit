import type { Product } from '../types';

export interface ProductResult {
  success: boolean;
  message: string;
  product?: Product;
  url?: string;
}

async function request(method: string, path: string, body?: unknown): Promise<ProductResult> {
  try {
    const res = await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    const data = await res.json();
    return { success: res.ok && data.success !== false, message: '', ...data };
  } catch {
    return { success: false, message: 'Sunucuya ulaşılamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.' };
  }
}

export const productsApi = {
  /** Resolves to null when the server can't be reached, so the app can fall back to its built-in catalogue. */
  async list(): Promise<Product[] | null> {
    try {
      const res = await fetch('/api/products', { credentials: 'same-origin' });
      if (!res.ok) return null;
      const data = await res.json();
      return Array.isArray(data.products) ? data.products : null;
    } catch {
      return null;
    }
  },
  create: (product: Partial<Product>) => request('POST', '/products', product),
  update: (id: string, product: Partial<Product>) => request('PUT', `/products/${encodeURIComponent(id)}`, product),
  remove: (id: string) => request('DELETE', `/products/${encodeURIComponent(id)}`),

  /** Shrinks the photo in the browser (max 1200px, JPEG) and uploads it; returns the hosted URL. */
  async uploadImage(file: File): Promise<ProductResult> {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      return { success: false, message: 'Yalnızca JPG, PNG veya WebP görseller yüklenebilir.' };
    }
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff'; // transparent PNGs would otherwise turn black as JPEG
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      return request('POST', '/images', { data: dataUrl.split(',')[1] });
    } catch {
      return { success: false, message: 'Görsel okunamadı. Başka bir dosya deneyin.' };
    }
  }
};
