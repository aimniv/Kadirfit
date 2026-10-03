import React from 'react';
import { X, MapPin, Phone, Mail, Package, CreditCard, Undo2 } from 'lucide-react';
import type { Order } from '../../types';

const METHOD_LABELS: Record<Order['paymentMethod'], string> = {
  credit_card: 'Kredi / Banka Kartı',
  bank_transfer: 'Havale / EFT',
  cash_on_delivery: 'Kapıda Ödeme'
};

const TRY = (n: number) => `${n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`;

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onTogglePaid: (order: Order) => void;
}

/** Everything staff need to pack and ship an order: items, delivery address, contact and payment. */
export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose, onTogglePaid }) => {
  const a = order.shippingAddress;
  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-black/85 backdrop-blur-sm flex items-start justify-center p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-label={`Sipariş ${order.orderNumber}`} className="w-full max-w-2xl my-6 bg-[#121212] border border-neutral-800 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <div>
            <h3 className="font-heading uppercase text-sm font-bold text-white tracking-wider">Sipariş {order.orderNumber}</h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">{new Date(order.createdAt).toLocaleString('tr-TR')} · {order.status}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800" title="Kapat">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs text-neutral-300">
          {order.returnRequested && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-2">
              <Undo2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">İade / iptal talebi var</p>
                <p className="text-amber-200/80 mt-0.5">{order.returnReason}</p>
                <p className="text-amber-200/60 mt-1">Kabul etmek için durumu "İptal / İade" yapın; ürünler stoğa geri eklenir.</p>
              </div>
            </div>
          )}

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <h4 className="font-heading uppercase text-[11px] text-neutral-500 tracking-wider">Müşteri</h4>
              <p className="text-white font-semibold">{order.customerName}</p>
              <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-neutral-500" />{order.customerEmail}</p>
              <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-neutral-500" />{order.customerPhone}</p>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-heading uppercase text-[11px] text-neutral-500 tracking-wider">Teslimat Adresi</h4>
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 mt-0.5 shrink-0" />
                <span>{a.fullAddress}<br />{a.district} / {a.city} {a.postalCode}</span>
              </p>
              {a.isCorporate && (
                <p className="text-neutral-400">Kurumsal fatura: {a.companyName} · {a.taxOffice} V.D. · {a.taxNumber}</p>
              )}
            </div>
          </section>

          <section className="space-y-2">
            <h4 className="font-heading uppercase text-[11px] text-neutral-500 tracking-wider flex items-center gap-1.5"><Package className="w-3.5 h-3.5" />Ürünler</h4>
            <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-lg overflow-hidden">
              {order.items.map((i, idx) => (
                <div key={`${i.productId}-${idx}`} className="flex items-center gap-3 p-2.5">
                  {i.image && <img src={i.image} alt="" className="w-10 h-10 rounded object-cover bg-black" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{i.title}</p>
                    {i.selectedVariantText && <p className="text-[10px] text-neutral-500">{i.selectedVariantText}</p>}
                  </div>
                  <span className="text-neutral-400 whitespace-nowrap">{i.quantity} × {TRY(i.unitPrice)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1 pt-1 text-right">
              <p>Ara toplam: {TRY(order.subtotal)}</p>
              {order.discountAmount > 0 && <p className="text-emerald-400">İndirim ({order.couponCode}): -{TRY(order.discountAmount)}</p>}
              <p>Kargo: {order.shippingFee ? TRY(order.shippingFee) : 'Ücretsiz'}</p>
              {order.paymentFee ? <p>Kapıda ödeme bedeli: {TRY(order.paymentFee)}</p> : null}
              <p className="text-base font-bold text-[#FF5A1F]">Toplam: {TRY(order.total)}</p>
            </div>
          </section>

          <section className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-neutral-900 border border-neutral-800">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-neutral-500" />
              <span className="text-white font-semibold">{METHOD_LABELS[order.paymentMethod]}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {order.paymentStatus === 'paid' ? 'Ödendi' : 'Ödeme bekleniyor'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onTogglePaid(order)}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-[#FF5A1F] text-white rounded text-[11px] font-bold transition-colors"
            >
              {order.paymentStatus === 'paid' ? 'Ödenmedi olarak işaretle' : 'Ödeme alındı olarak işaretle'}
            </button>
          </section>

          {order.notes && <p className="text-neutral-400"><strong className="text-neutral-300">Müşteri notu:</strong> {order.notes}</p>}
        </div>
      </div>
    </div>
  );
};
