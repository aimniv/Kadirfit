import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useApp();
  const [showTooltip, setShowTooltip] = useState(true);

  const cleanPhone = settings.contactWhatsApp.replace(/[^0-9]/g, '');
  const message = encodeURIComponent('Merhaba Kadir Hoca, Kadirfit online koçluk paketleri ve ürünler hakkında bilgi almak istiyorum.');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 pointer-events-none">
      {/* Speech Bubble / Tooltip */}
      {showTooltip && (
        <div className="pointer-events-auto bg-[#161616] text-white text-xs px-3.5 py-2.5 rounded-xl border border-neutral-700 shadow-2xl relative max-w-xs animate-fade-in hidden sm:flex items-center gap-2">
          <div>
            <p className="font-bold text-[#FF5A1F] text-[11px] uppercase tracking-wide">Kadirfit Danışma</p>
            <p className="text-neutral-300 text-xs">Soruların mı var? WhatsApp'tan hemen yaz!</p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-neutral-500 hover:text-white p-0.5 ml-1"
            title="Kapat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-xl shadow-[#25D366]/30 hover:scale-105 active:scale-95 transition-all group"
        title="WhatsApp ile İletişime Geç"
      >
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366] group-hover:rotate-12 transition-transform" />
      </a>
    </div>
  );
};
