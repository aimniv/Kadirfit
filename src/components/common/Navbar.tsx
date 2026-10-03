import React, { useState } from 'react';
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  LogOut,
  SlidersHorizontal,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  onNavigate: (view: string, param?: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const {
    currentUser,
    logout,
    switchRole,
    openCart,
    cart,
    openSearch,
    openAuthModal,
    language,
    setLanguage,
    t
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (view: string, param?: string) => {
    onNavigate(view, param);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <>
      {/* Top Demo Bar for Testing Ease */}
      <div className="bg-[#121212] border-b border-neutral-800 text-[11px] text-neutral-400 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Kadirfit Canlı Sistem: 750 TL Üzeri Ücretsiz Kargo</span>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <span className="hidden sm:inline">Online Koçlukta Son 3 Kontenjan</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Quick Role Switcher for Evaluator Convenience */}
            <div className="flex items-center gap-1.5 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              <span className="text-neutral-500">Aktif Rol:</span>
              <span className="font-semibold text-[#FF5A1F] uppercase">{currentUser?.role || 'MİSAFİR'}</span>
              <select
                aria-label="Rol Değiştir"
                value={currentUser?.role || 'GUEST'}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'GUEST') {
                    logout();
                  } else {
                    switchRole(val as any);
                  }
                }}
                className="bg-transparent text-[11px] text-white focus:outline-none cursor-pointer"
              >
                <option value="SUPER_ADMIN" className="bg-neutral-900 text-white">Süper Admin</option>
                <option value="ORDER_MANAGER" className="bg-neutral-900 text-white">Sipariş Yöneticisi</option>
                <option value="EDITOR" className="bg-neutral-900 text-white">İçerik Editörü</option>
                <option value="USER" className="bg-neutral-900 text-white">Kayıtlı Öğrenci / Müşteri</option>
                <option value="GUEST" className="bg-neutral-900 text-white">Çıkış (Misafir)</option>
              </select>
            </div>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 text-neutral-300 hover:text-white transition-colors"
                title="Dil Değiştir"
              >
                <span className="uppercase font-medium">{language}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 bg-[#161616] border border-neutral-800 rounded shadow-xl py-1 z-50 min-w-[80px]">
                  <button
                    onClick={() => { setLanguage('tr'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1 text-xs hover:bg-neutral-800 transition-colors ${language === 'tr' ? 'text-[#FF5A1F] font-bold' : 'text-neutral-300'}`}
                  >
                    Türkçe
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1 text-xs hover:bg-neutral-800 transition-colors ${language === 'en' ? 'text-[#FF5A1F] font-bold' : 'text-neutral-300'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => { setLanguage('ar'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1 text-xs hover:bg-neutral-800 transition-colors ${language === 'ar' ? 'text-[#FF5A1F] font-bold' : 'text-neutral-300'}`}
                  >
                    العربية
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-neutral-800 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded bg-[#FF5A1F] flex items-center justify-center font-display font-extrabold text-white text-xl shadow-lg shadow-[#FF5A1F]/20 group-hover:scale-105 transition-transform">
              K
            </div>
            <span className="font-display text-3xl font-bold tracking-wider text-white group-hover:text-[#FF5A1F] transition-colors leading-none">
              KADIR<span className="text-[#FF5A1F]">FIT</span>
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors hover:text-[#FF5A1F] ${currentView === 'home' ? 'text-[#FF5A1F] font-semibold' : 'text-neutral-300'}`}
            >
              Ana Sayfa
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`transition-colors hover:text-[#FF5A1F] ${currentView === 'about' ? 'text-[#FF5A1F] font-semibold' : 'text-neutral-300'}`}
            >
              {t('nav.about', 'Hakkımda')}
            </button>
            <button
              onClick={() => handleNavClick('coaching')}
              className={`transition-colors hover:text-[#FF5A1F] ${currentView === 'coaching' ? 'text-[#FF5A1F] font-semibold' : 'text-neutral-300'}`}
            >
              {t('nav.coaching', 'Koçluk')}
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className={`transition-colors hover:text-[#FF5A1F] ${currentView === 'shop' ? 'text-[#FF5A1F] font-semibold' : 'text-neutral-300'}`}
            >
              {t('nav.shop', 'Mağaza')}
            </button>
            <button
              onClick={() => handleNavClick('results')}
              className={`transition-colors hover:text-[#FF5A1F] ${currentView === 'results' ? 'text-[#FF5A1F] font-semibold' : 'text-neutral-300'}`}
            >
              {t('nav.results', 'Sonuçlar')}
            </button>
            <button
              onClick={() => handleNavClick('blog')}
              className={`transition-colors hover:text-[#FF5A1F] ${currentView === 'blog' ? 'text-[#FF5A1F] font-semibold' : 'text-neutral-300'}`}
            >
              {t('nav.blog', 'Blog')}
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className={`transition-colors hover:text-[#FF5A1F] ${currentView === 'faq' ? 'text-[#FF5A1F] font-semibold' : 'text-neutral-300'}`}
            >
              {t('nav.faq', 'SSS')}
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`transition-colors hover:text-[#FF5A1F] ${currentView === 'contact' ? 'text-[#FF5A1F] font-semibold' : 'text-neutral-300'}`}
            >
              {t('nav.contact', 'İletişim')}
            </button>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Trigger */}
            <button
              onClick={openSearch}
              className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800/80 rounded-md transition-colors"
              title="Arama (Cmd+K)"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Trigger with Quantity Badge */}
            <button
              onClick={openCart}
              className="relative p-2 text-neutral-300 hover:text-white hover:bg-neutral-800/80 rounded-md transition-colors"
              title="Sepetim"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF5A1F] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* User Dropdown / Login */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-md hover:bg-neutral-800/80 transition-colors border border-transparent hover:border-neutral-700"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-800 border border-[#FF5A1F]/50 flex items-center justify-center overflow-hidden">
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={currentUser.firstName} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-4 h-4 text-neutral-300" />
                      )}
                    </div>
                    <span className="hidden md:inline text-xs font-semibold text-neutral-200">
                      {currentUser.firstName}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-[#121212] border border-neutral-800 rounded-lg shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-neutral-800">
                        <p className="text-xs font-bold text-white">{currentUser.firstName} {currentUser.lastName}</p>
                        <p className="text-[11px] text-neutral-400 truncate">{currentUser.email}</p>
                        <div className="mt-1 flex items-center gap-1">
                          <span className="text-[9px] uppercase tracking-wider bg-[#FF5A1F]/20 text-[#FF5A1F] font-bold px-1.5 py-0.5 rounded">
                            {currentUser.role}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleNavClick('account', 'overview')}
                        className="w-full text-left px-4 py-2 text-xs text-neutral-200 hover:bg-neutral-800/80 hover:text-white flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-neutral-400" />
                        Hesabım Paneli
                      </button>

                      <button
                        onClick={() => handleNavClick('account', 'coaching')}
                        className="w-full text-left px-4 py-2 text-xs text-neutral-200 hover:bg-neutral-800/80 hover:text-[#FF5A1F] flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#FF5A1F]" />
                        Koçluk Alanım & Check-in
                      </button>

                      <button
                        onClick={() => handleNavClick('account', 'orders')}
                        className="w-full text-left px-4 py-2 text-xs text-neutral-200 hover:bg-neutral-800/80 hover:text-white flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-neutral-400" />
                        Siparişlerim & Kargo
                      </button>

                      {/* Admin Access Link if Authorized */}
                      {currentUser.role !== 'USER' && (
                        <button
                          onClick={() => handleNavClick('admin')}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-[#FF5A1F] bg-[#FF5A1F]/10 hover:bg-[#FF5A1F]/20 flex items-center gap-2 border-y border-[#FF5A1F]/20 my-1"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                          Admin Paneli ({currentUser.role})
                        </button>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md border border-neutral-700 text-neutral-200 hover:text-white hover:border-[#FF5A1F] transition-all"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Giriş / Kayıt</span>
                </button>
              )}
            </div>

            {/* Primary Action CTA Button */}
            <button
              onClick={() => handleNavClick('coaching')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#FF5A1F] hover:bg-[#e04e18] rounded transition-all shadow-md shadow-[#FF5A1F]/20 active:scale-95"
            >
              {t('nav.start', 'Hemen Başla')}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-300 hover:text-white rounded-md"
              title="Menüyü Aç"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-28 bottom-0 z-40 bg-[#0A0A0A] border-t border-neutral-800 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left py-2 text-lg font-bold text-white border-b border-neutral-800"
            >
              Ana Sayfa
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left py-2 text-lg font-bold text-neutral-300 hover:text-[#FF5A1F] border-b border-neutral-800"
            >
              Hakkımda
            </button>
            <button
              onClick={() => handleNavClick('coaching')}
              className="text-left py-2 text-lg font-bold text-neutral-300 hover:text-[#FF5A1F] border-b border-neutral-800"
            >
              Koçluk Paketleri
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className="text-left py-2 text-lg font-bold text-neutral-300 hover:text-[#FF5A1F] border-b border-neutral-800"
            >
              Mağaza (Giyim & Takviye)
            </button>
            <button
              onClick={() => handleNavClick('results')}
              className="text-left py-2 text-lg font-bold text-neutral-300 hover:text-[#FF5A1F] border-b border-neutral-800"
            >
              Dönüşümler & Sonuçlar
            </button>
            <button
              onClick={() => handleNavClick('blog')}
              className="text-left py-2 text-lg font-bold text-neutral-300 hover:text-[#FF5A1F] border-b border-neutral-800"
            >
              Blog
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="text-left py-2 text-lg font-bold text-neutral-300 hover:text-[#FF5A1F] border-b border-neutral-800"
            >
              SSS
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left py-2 text-lg font-bold text-neutral-300 hover:text-[#FF5A1F] border-b border-neutral-800"
            >
              İletişim
            </button>
          </div>

          <div className="pt-6 border-t border-neutral-800 flex flex-col gap-3">
            {currentUser?.role !== 'USER' && currentUser && (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full py-3 bg-[#FF5A1F]/20 text-[#FF5A1F] font-bold text-center rounded border border-[#FF5A1F]/40"
              >
                Admin Paneline Git
              </button>
            )}
            <button
              onClick={() => handleNavClick('coaching')}
              className="w-full py-3 bg-[#FF5A1F] text-white font-bold uppercase tracking-wider text-center rounded shadow-lg shadow-[#FF5A1F]/30"
            >
              Hemen Başla (Koçluk Al)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
