import type { Coupon, Order, OrderStatus } from '../types';

export interface ApiResult {
  success: boolean;
  message: string;
  code?: string;
}

async function request<T extends object>(method: string, path: string, body?: unknown): Promise<ApiResult & Partial<T>> {
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
    return { success: false, message: 'Sunucuya ulaşılamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.' } as ApiResult & Partial<T>;
  }
}

export interface PlaceOrderPayload {
  customer: { firstName: string; lastName: string; email: string; phone: string };
  shippingAddress: {
    title: string;
    city: string;
    district: string;
    fullAddress: string;
    postalCode?: string;
    isCorporate?: boolean;
    companyName?: string;
    taxOffice?: string;
    taxNumber?: string;
  };
  items: Array<{
    productId: string;
    quantity: number;
    isCoachingPackage?: boolean;
    coachingDurationMonths?: number;
    selectedSize?: string;
    selectedColor?: string;
    selectedFlavor?: string;
    selectedWeight?: string;
  }>;
  paymentMethod: Order['paymentMethod'];
  couponCode?: string;
  agreed: boolean;
}

export interface ShopConfig {
  methods: Array<'bank_transfer' | 'cash_on_delivery'>;
  bankTransferDetails: string[];
}

export const ordersApi = {
  place: (payload: PlaceOrderPayload) => request<{ order: Order }>('POST', '/orders', payload),
  listAll: () => request<{ orders: Order[] }>('GET', '/orders'),
  listMine: () => request<{ orders: Order[] }>('GET', '/orders/mine'),
  update: (id: string, patch: { status?: OrderStatus; trackingNumber?: string; cargoCompany?: string; paymentStatus?: 'paid' | 'pending' }) =>
    request<{ order: Order }>('PATCH', `/orders/${encodeURIComponent(id)}`, patch),
  requestReturn: (id: string, reason: string) => request<{ order: Order }>('POST', `/orders/${encodeURIComponent(id)}/return`, { reason })
};

export const couponsApi = {
  validate: (code: string, subtotal: number) =>
    request<{ coupon: Pick<Coupon, 'id' | 'code' | 'type' | 'value' | 'minCartAmount'> }>('POST', '/coupons/validate', { code, subtotal }),
  list: () => request<{ coupons: Coupon[] }>('GET', '/coupons'),
  create: (c: { code: string; type: Coupon['type']; value: number; minCartAmount: number; usageLimit?: number; expiresAt?: string }) =>
    request<{ coupon: Coupon }>('POST', '/coupons', c),
  update: (id: string, patch: Partial<Pick<Coupon, 'isActive' | 'usageLimit' | 'expiresAt'>>) =>
    request<{ coupon: Coupon }>('PATCH', `/coupons/${encodeURIComponent(id)}`, patch),
  remove: (id: string) => request<{}>('DELETE', `/coupons/${encodeURIComponent(id)}`)
};

export async function fetchShopConfig(): Promise<ShopConfig | null> {
  try {
    const res = await fetch('/api/config');
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
