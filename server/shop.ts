import { INITIAL_COACHING_PACKAGES, INITIAL_SETTINGS } from '../src/data/initialData.js';
import type { Coupon, CoachingPackage } from '../src/types/index.js';

/**
 * Prices, shipping rules and coupon math live here so the server never trusts totals sent by the browser.
 * The shop's rules come from the same defaults the storefront shows to every visitor.
 */

export const FREE_SHIPPING_THRESHOLD = INITIAL_SETTINGS.freeShippingThreshold;
export const STANDARD_SHIPPING_FEE = INITIAL_SETTINGS.standardShippingFee;
/** Matches the "Kapıda ödeme hizmet bedeli 30 TL" notice shown at checkout. */
export const CASH_ON_DELIVERY_FEE = 30;

export const COACHING_IMAGE =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80';

export const findCoachingPackage = (id: string): CoachingPackage | undefined =>
  INITIAL_COACHING_PACKAGES.find(p => p.id === id);

const round2 = (n: number) => Math.round(n * 100) / 100;

export const todayIso = () => new Date().toISOString().slice(0, 10);

/** Why a coupon can't be used right now, or null when it can. */
export function couponProblem(coupon: Coupon | undefined, subtotal: number): string | null {
  if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt < todayIso()) || coupon.usageCount >= coupon.usageLimit) {
    return 'Geçersiz veya süresi dolmuş kupon kodu.';
  }
  if (subtotal < coupon.minCartAmount) {
    return `Bu kupon en az ${coupon.minCartAmount} TL sepet tutarında geçerlidir.`;
  }
  return null;
}

export function couponDiscount(coupon: Coupon, subtotal: number): number {
  return round2(coupon.type === 'percentage' ? (subtotal * coupon.value) / 100 : Math.min(subtotal, coupon.value));
}

export function shippingFee(subtotal: number, onlyCoaching: boolean): number {
  return onlyCoaching || subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
}

export { round2 };

/** Payment methods the shop can really accept today. Card payments need a payment provider (iyzico / PayTR). */
export function paymentOptions(): { methods: Array<'bank_transfer' | 'cash_on_delivery'>; bankTransferDetails: string[] } {
  const bankTransferDetails = (process.env.BANK_TRANSFER_DETAILS || '')
    .split(';')
    .map(s => s.trim())
    .filter(Boolean);
  return {
    methods: [...(bankTransferDetails.length ? (['bank_transfer'] as const) : []), 'cash_on_delivery'],
    bankTransferDetails
  };
}
