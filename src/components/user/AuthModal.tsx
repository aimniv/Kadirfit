import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuthModalProps {
  onOpenLegal: (page: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onOpenLegal }) => {
  const {
    authModalOpen,
    authModalTab,
    closeAuthModal,
    openAuthModal,
    login,
    register
  } = useApp();

  // Mode
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(authModalTab || 'login');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Register form
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+90 ');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(true);

  // Forgot password form
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Status message
  const [statusMsg, setStatusMsg] = useState<{ text: string; error: boolean } | null>(null);

  if (!authModalOpen) return null;

  // Password Strength Calculation
  const hasMinLength = regPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(regPassword);
  const hasLowerCase = /[a-z]/.test(regPassword);
  const hasNumber = /[0-9]/.test(regPassword);
  const passwordsMatch = regPassword && regPassword === regPasswordConfirm;

  const strengthScore = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber].filter(Boolean).length;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (isLocked) {
      setStatusMsg({ text: 'Çok fazla başarısız deneme yapıldı. Lütfen 1 dakika bekleyiniz.', error: true });
      return;
    }

    const res = login(loginEmail, loginPassword);
    if (res.success) {
      setStatusMsg({ text: res.message, error: false });
      setTimeout(() => closeAuthModal(), 800);
    } else {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 4) {
        setIsLocked(true);
        setTimeout(() => {
          setIsLocked(false);
          setFailedAttempts(0);
        }, 60000);
        setStatusMsg({ text: 'Güvenlik kilidi: 4 kez hatalı deneme nedeniyle hesap 60 saniye kilitlendi.', error: true });
      } else {
        setStatusMsg({ text: `${res.message} (Kalan deneme hakkı: ${4 - attempts})`, error: true });
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!regFirstName || !regLastName || !regEmail) {
      setStatusMsg({ text: 'Lütfen zorunlu alanları doldurunuz.', error: true });
      return;
    }

    if (strengthScore < 3) {
      setStatusMsg({ text: 'Şifreniz yeterince güçlü değil. Lütfen en az 8 karakter, büyük-küçük harf ve rakam kullanın.', error: true });
      return;
    }

    if (!passwordsMatch) {
      setStatusMsg({ text: 'Girdiğiniz şifreler birbiriyle eşleşmiyor.', error: true });
      return;
    }

    if (!kvkkAccepted || !termsAccepted) {
      setStatusMsg({ text: 'Lütfen KVKK Aydınlatma Metni ve Üyelik Sözleşmesini onaylayınız.', error: true });
      return;
    }

    const res = register({
      firstName: regFirstName,
      lastName: regLastName,
      email: regEmail,
      phone: regPhone,
      marketingConsent: marketingAccepted
    });

    if (res.success) {
      setStatusMsg({ text: res.message, error: false });
      setTimeout(() => closeAuthModal(), 1000);
    } else {
      setStatusMsg({ text: res.message, error: true });
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div
        className="w-full max-w-md bg-[#121212] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Headers */}
        <div className="flex border-b border-neutral-800 bg-neutral-900/50">
          <button
            onClick={() => { setTab('login'); setStatusMsg(null); }}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider text-center transition-colors relative ${
              tab === 'login' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Giriş Yap
            {tab === 'login' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5A1F]" />}
          </button>
          <button
            onClick={() => { setTab('register'); setStatusMsg(null); }}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider text-center transition-colors relative ${
              tab === 'register' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Kayıt Ol
            {tab === 'register' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5A1F]" />}
          </button>
        </div>

        {/* Status Alert Banner */}
        {statusMsg && (
          <div className={`p-3 text-xs flex items-center gap-2 ${
            statusMsg.error ? 'bg-rose-500/10 text-rose-400 border-b border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-b border-emerald-500/30'
          }`}>
            {statusMsg.error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          
          {/* TAB 1: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">E-Posta Adresi</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="ornek@kadirfit.com"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF5A1F]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Şifre</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF5A1F]"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-400 hover:text-white">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#FF5A1F] rounded"
                  />
                  <span>Beni Hatırla</span>
                </label>

                <button
                  type="button"
                  onClick={() => { setTab('forgot'); setStatusMsg(null); }}
                  className="text-[#FF5A1F] hover:underline"
                >
                  Şifremi Unuttum
                </button>
              </div>

              <button
                type="submit"
                disabled={isLocked}
                className="w-full py-3 bg-[#FF5A1F] hover:bg-[#e04e18] disabled:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-lg shadow-[#FF5A1F]/20 active:scale-95"
              >
                Giriş Yap
              </button>

              {/* Demo Quick Logins */}
              <div className="pt-4 border-t border-neutral-800 space-y-2 text-center">
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">
                  Hızlı Demo Girişi:
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('admin@kadirfit.com');
                      setLoginPassword('Admin123!');
                    }}
                    className="flex-1 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-[11px] text-[#FF5A1F] rounded border border-neutral-800 font-semibold"
                  >
                    Admin Doldur
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('kullanici@kadirfit.com');
                      setLoginPassword('Kullanici123!');
                    }}
                    className="flex-1 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-[11px] text-neutral-300 rounded border border-neutral-800 font-semibold"
                  >
                    Öğrenci Doldur
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Ad *</label>
                  <input
                    type="text"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5A1F]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1 block">Soyad *</label>
                  <input
                    type="text"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5A1F]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 mb-1 block">E-Posta *</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="ornek@kadirfit.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5A1F]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Telefon (+90 formatında)</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+90 5XX XXX XX XX"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              {/* Password & Live Strength Meter */}
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Şifre *</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="En az 8 karakter, büyük-küçük harf, rakam"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5A1F]"
                  required
                />

                {/* Password strength visual meter */}
                {regPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`flex-1 rounded-full ${
                            step <= strengthScore
                              ? strengthScore >= 3
                                ? 'bg-emerald-500'
                                : strengthScore === 2
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                              : 'bg-neutral-800'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-500">
                      <span>Güç: {strengthScore >= 3 ? 'Güçlü' : strengthScore === 2 ? 'Orta' : 'Zayıf'}</span>
                      <span>8+ karakter, büyük/küçük harf, rakam</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Şifre Tekrarı *</label>
                <input
                  type="password"
                  value={regPasswordConfirm}
                  onChange={(e) => setRegPasswordConfirm(e.target.value)}
                  placeholder="Şifrenizi tekrar giriniz"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5A1F]"
                  required
                />
              </div>

              {/* Mandatory Checkboxes for Turkey KVKK */}
              <div className="space-y-2 pt-1 text-[11px] text-neutral-400">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={kvkkAccepted}
                    onChange={(e) => setKvkkAccepted(e.target.checked)}
                    className="accent-[#FF5A1F] mt-0.5 rounded"
                    required
                  />
                  <span>
                    <button
                      type="button"
                      onClick={() => onOpenLegal('kvkk')}
                      className="text-[#FF5A1F] underline"
                    >
                      KVKK Aydınlatma Metni
                    </button>
                    'ni okudum ve kabul ediyorum. *
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="accent-[#FF5A1F] mt-0.5 rounded"
                    required
                  />
                  <span>
                    <button
                      type="button"
                      onClick={() => onOpenLegal('uyelik')}
                      className="text-[#FF5A1F] underline"
                    >
                      Üyelik Sözleşmesi
                    </button>
                    'ni okudum ve onaylıyorum. *
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingAccepted}
                    onChange={(e) => setMarketingAccepted(e.target.checked)}
                    className="accent-[#FF5A1F] mt-0.5 rounded"
                  />
                  <span>Kampanya, indirim ve koçluk duyurularından haberdar olmak istiyorum (ETK İzni).</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF5A1F] hover:bg-[#e04e18] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-lg shadow-[#FF5A1F]/20 active:scale-95"
              >
                Hesap Oluştur
              </button>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {tab === 'forgot' && (
            <div className="space-y-4">
              {forgotSubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Sıfırlama Bağlantısı Gönderildi</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    <strong>{forgotEmail}</strong> adresinize 1 saat geçerli tek kullanımlık şifre sıfırlama linki iletilmiştir.
                  </p>
                  <button
                    onClick={() => { setTab('login'); setForgotSubmitted(false); }}
                    className="px-4 py-2 bg-neutral-800 text-white text-xs font-semibold rounded hover:bg-neutral-700"
                  >
                    Giriş Ekranına Dön
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Kayıtlı e-posta adresinizi giriniz. Size süresi sınırlı (1 saat) bir şifre yenileme bağlantısı göndereceğiz.
                  </p>

                  <div>
                    <label className="text-xs text-neutral-400 mb-1 block">E-Posta Adresi</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="ornek@kadirfit.com"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#FF5A1F]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#FF5A1F] hover:bg-[#e04e18] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                  >
                    Sıfırlama Linki Gönder
                  </button>

                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="w-full text-center text-xs text-neutral-400 hover:text-white"
                  >
                    ← Giriş Yap'a Geri Dön
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
