import React from 'react';
import { ShieldCheck, Instagram, Youtube, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useApp();

  return (
    <footer className="bg-[#080808] border-t border-neutral-800 text-neutral-400 text-xs">
      {/* Top Value Banner */}
      <div className="border-b border-neutral-800/80 bg-neutral-900/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">%100 Bireysel Program</h4>
              <p className="text-neutral-400 text-[11px]">Kişiye özel kalori, makro ve antrenman</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">256-Bit SSL Güvenli Ödeme</h4>
              <p className="text-neutral-400 text-[11px]">iyzico & PayTR altyapısı ile 3D Secure koruma</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] shrink-0">
              <span className="font-bold text-sm">24S</span>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Hızlı Kargo & Teslimat</h4>
              <p className="text-neutral-400 text-[11px]">Saat 15:00'e kadar aynı gün kargo avantajı</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] shrink-0">
              <span className="font-bold text-sm">7/24</span>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Kesintisiz Destek</h4>
              <p className="text-neutral-400 text-[11px]">WhatsApp & e-posta ile soru yanıtlama</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#FF5A1F] flex items-center justify-center font-display font-black text-white text-lg">
                K
              </div>
              <span className="font-display text-2xl font-bold tracking-wider text-white">
                KADIR<span className="text-[#FF5A1F]">FIT</span>
              </span>
            </div>
            <p className="text-sm font-semibold text-neutral-300">
              {settings.slogan}
            </p>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              Bilimsel temelli online antrenman ve beslenme koçluğu ile birlikte yüksek performanslı sporcu kıyafetleri ve saf takviyeler sunan resmi Kadirfit platformudur.
            </p>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 hover:border-[#FF5A1F] hover:text-[#FF5A1F] flex items-center justify-center text-neutral-400 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 hover:border-[#FF5A1F] hover:text-[#FF5A1F] flex items-center justify-center text-neutral-400 transition-colors"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 hover:border-[#FF5A1F] hover:text-[#FF5A1F] flex items-center justify-center text-neutral-400 transition-colors font-bold text-xs"
                title="TikTok"
              >
                TT
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-heading uppercase text-xs tracking-wider text-white font-bold mb-4">
              Hızlı Erişim
            </h5>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Ana Sayfa
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Hakkımda & Biyografi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('coaching')} className="hover:text-white transition-colors">
                  Online Koçluk Paketleri
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('assessment')} className="hover:text-white transition-colors text-[#FF5A1F] font-semibold">
                  Ön Değerlendirme Formu
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('results')} className="hover:text-white transition-colors">
                  Dönüşüm Galerisi (Before/After)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-white transition-colors">
                  Blog & Bilimsel Makaleler
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  İletişim & Lokasyon
                </button>
              </li>
            </ul>
          </div>

          {/* Shop Categories */}
          <div>
            <h5 className="font-heading uppercase text-xs tracking-wider text-white font-bold mb-4">
              Resmi Mağaza
            </h5>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('shop', 'clothing')} className="hover:text-white transition-colors">
                  Fitness Kıyafetleri & Oversize
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'supplements')} className="hover:text-white transition-colors">
                  Protein Tozu (Whey Isolate)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'supplements')} className="hover:text-white transition-colors">
                  Kreatin (Creapure®)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'supplements')} className="hover:text-white transition-colors">
                  Pre-Workout & Pump
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'accessories')} className="hover:text-white transition-colors">
                  Ağırlık Kemeri & Shaker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Tüm Ürünleri İncele
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Türkiye Yasal Sayfalar */}
          <div>
            <h5 className="font-heading uppercase text-xs tracking-wider text-white font-bold mb-4">
              Kurumsal & Yasal
            </h5>
            <ul className="space-y-2.5 text-[11px]">
              <li>
                <button onClick={() => onNavigate('legal', 'kvkk')} className="hover:text-white transition-colors">
                  KVKK Aydınlatma Metni
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', 'mesafeli_satis')} className="hover:text-white transition-colors">
                  Mesafeli Satış Sözleşmesi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', 'on_bilgilendirme')} className="hover:text-white transition-colors">
                  Ön Bilgilendirme Formu
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', 'uyelik')} className="hover:text-white transition-colors">
                  Üyelik Sözleşmesi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', 'cerez')} className="hover:text-white transition-colors">
                  Çerez Politikası
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', 'iade_degisim')} className="hover:text-white transition-colors">
                  İade ve Değişim Koşulları
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box required by Turkish Law */}
        <div className="mt-10 p-4 rounded-lg bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-400 text-center leading-relaxed">
          <strong className="text-neutral-300">Yasal Uyarı: </strong>
          Sitemizde satışı yapılan takviye edici gıdalar ilaç niteliği taşımaz, hastalıkların teşhis, tedavi veya önlenmesi amacıyla kullanılmaz. Beslenme ve antrenman tavsiyeleri genel sağlık durumunuz gözetilerek kişiselleştirilir; kronik bir rahatsızlığınız varsa doktorunuza danışınız.
        </div>

        {/* Bottom Bar & Trust Badges */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-400 text-[11px]">
            © {new Date().getFullYear()} Kadirfit Spor A.Ş. Tüm hakları saklıdır. "Kadirfit" tescilli bir markadır.
          </p>

          {/* Payment Trust Logos */}
          <div className="flex items-center gap-3 text-neutral-400 text-[10px] font-semibold">
            <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">VISA</span>
            <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">Mastercard</span>
            <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">TROY</span>
            <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-emerald-400">3D Secure</span>
            <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">iyzico</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
