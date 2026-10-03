import React from 'react';
import { CheckCircle2, PackageCheck, Mail, ArrowRight, Download, FileText } from 'lucide-react';
import { Order } from '../../types';
import { useApp } from '../../context/AppContext';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onNavigateToAccount: (tab: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onNavigateToAccount
}) => {
  const { shopConfig } = useApp();
  if (!order) return null;

  const hasCoaching = order.items.some(i => i.isCoaching);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-[#121212] border border-neutral-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-center">
        
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-widest block mb-1">
            SİPARİŞ ALINDI
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            TEBRİKLER, SİPARİŞİNİZ ALINDI!
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-2">
            Sipariş No: <strong className="text-white font-mono">{order.orderNumber}</strong>
          </p>
        </div>

        {/* Email notification simulator card */}
        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 text-[#FF5A1F] font-bold">
            <Mail className="w-4 h-4" />
            <span>Onay E-Postası Gönderildi</span>
          </div>
          <p className="text-neutral-300">
            Sipariş onayınız <strong>{order.customerEmail}</strong> adresine gönderildi. Gelmediyse spam klasörünü kontrol edin.
          </p>
        </div>

        {/* Order Details Mini-Card */}
        <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 text-left text-xs space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
            <span className="text-neutral-400">Toplam Tutar:</span>
            <span className="text-base font-bold text-[#FF5A1F]">{order.total.toLocaleString('tr-TR')} ₺</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Teslimat Adresi:</span>
            <span className="text-neutral-200 text-right max-w-xs truncate">{order.shippingAddress.fullAddress}, {order.shippingAddress.city}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Ödeme Şekli:</span>
            <span className="text-neutral-200 font-semibold">
              {{ credit_card: 'Kredi / Banka Kartı', bank_transfer: 'Havale / EFT', cash_on_delivery: 'Kapıda Ödeme' }[order.paymentMethod]}
            </span>
          </div>
        </div>

        {order.paymentMethod === 'bank_transfer' && shopConfig.bankTransferDetails.length > 0 && (
          <div className="p-4 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 text-left text-xs space-y-2">
            <p className="text-neutral-200">
              Siparişinizin hazırlanması için tutarı aşağıdaki hesaba gönderin ve açıklama kısmına <strong>{order.orderNumber}</strong> yazın:
            </p>
            {shopConfig.bankTransferDetails.map(line => (
              <p key={line} className="font-mono text-white font-bold text-[11px]">{line}</p>
            ))}
          </div>
        )}
        {order.paymentMethod === 'cash_on_delivery' && (
          <p className="text-xs text-neutral-400">Tutarı kargo tesliminde ödeyeceksiniz.</p>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {hasCoaching ? (
            <button
              onClick={() => {
                onClose();
                onNavigateToAccount('coaching');
              }}
              className="w-full sm:w-auto px-6 py-3 bg-[#FF5A1F] hover:bg-[#e04e18] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/30"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Koçluk Alanıma Git & Formu Doldur</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onNavigateToAccount('orders');
              }}
              className="w-full sm:w-auto px-6 py-3 bg-[#FF5A1F] hover:bg-[#e04e18] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/30"
            >
              <FileText className="w-4 h-4" />
              <span>Siparişlerimi Görüntüle</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-semibold text-xs rounded-lg border border-neutral-700 transition-colors"
          >
            Alışverişe Devam Et
          </button>
        </div>
      </div>
    </div>
  );
};
