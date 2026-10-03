import React, { useEffect, useState } from 'react';
import { X, Lock, Mail, AlertCircle, CheckCircle2, Loader2, MailCheck } from 'lucide-react';
import { useApp, AuthTab } from '../../context/AppContext';

interface AuthModalProps {
  onOpenLegal: (page: string) => void;
}

const passwordChecks = (pw: string) => {
  const hasMinLength = pw.length >= 8;
  const hasUpperCase = /[A-Z]/.test(pw);
  const hasLowerCase = /[a-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  return { score: [hasMinLength, hasUpperCase, hasLowerCase, hasNumber].filter(Boolean).length };
};

const PasswordMeter: React.FC<{ password: string }> = ({ password }) => {
  if (!password) return null;
  const { score } = passwordChecks(password);
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1 h-1">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`flex-1 rounded-full ${
              step <= score
                ? score >= 4
                  ? 'bg-emerald-500'
                  : score === 3
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
                : 'bg-neutral-800'
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-neutral-500">
        <span>Güç: {score >= 4 ? 'Güçlü' : score === 3 ? 'Orta' : 'Zayıf'}</span>
        <span>8+ karakter, büyük/küçük harf, rakam</span>
      </div>
    </div>
  );
};

/** Shown when the server has no SMTP configured (development only): the e-mail link, so the flow can still be tried. */
const DevLinkBox: React.FC<{ link: string }> = ({ link }) => (
  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 space-y-1 text-left">
    <p className="font-semibold">Geliştirme modu: SMTP ayarlı olmadığı için e-posta gönderilmedi.</p>
    <a href={link} className="underline break-all">{link}</a>
  </div>
);

type ModalTab = AuthTab | 'check-email';

export const AuthModal: React.FC<AuthModalProps> = ({ onOpenLegal }) => {
  const {
    authModalOpen,
    authModalTab,
    authModalOptions,
    closeAuthModal,
    login,
    register,
    resendVerification,
    forgotPassword,
    resetPassword
  } = useApp();

  // Mode
  const [tab, setTab] = useState<ModalTab>(authModalTab || 'login');
  const [busy, setBusy] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

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

  // "Check your inbox" screen after sign-up
  const [pendingEmail, setPendingEmail] = useState('');
  const [mailSent, setMailSent] = useState(true);
  const [devLink, setDevLink] = useState<string | undefined>();
  const [resendCooldown, setResendCooldown] = useState(0);

  // Forgot password form
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Reset password form (reached from the e-mailed link)
  const [resetPass, setResetPass] = useState('');
  const [resetPassConfirm, setResetPassConfirm] = useState('');

  // Status message
  const [statusMsg, setStatusMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Whenever the modal is (re)opened, jump to the requested tab and show any notice (e.g. e-mail verified).
  useEffect(() => {
    if (!authModalOpen) return;
    setTab(authModalTab);
    setStatusMsg(authModalOptions.notice ?? null);
    setUnverifiedEmail(null);
    setForgotSubmitted(false);
    setDevLink(undefined);
  }, [authModalOpen, authModalTab, authModalOptions]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [resendCooldown]);

  if (!authModalOpen) return null;

  const switchTab = (next: ModalTab) => {
    setTab(next);
    setStatusMsg(null);
    setUnverifiedEmail(null);
  };

  const strengthScore = passwordChecks(regPassword).score;
  const passwordsMatch = regPassword && regPassword === regPasswordConfirm;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setUnverifiedEmail(null);
    setBusy(true);
    const res = await login(loginEmail, loginPassword, rememberMe);
    setBusy(false);
    if (res.success) {
      setStatusMsg({ text: res.message, error: false });
      setLoginPassword('');
      setTimeout(() => closeAuthModal(), 800);
    } else {
      setStatusMsg({ text: res.message, error: true });
      if (res.code === 'EMAIL_NOT_VERIFIED') setUnverifiedEmail(res.email || loginEmail);
    }
  };

  const handleResend = async (email: string) => {
    if (resendCooldown > 0) return;
    setBusy(true);
    const res = await resendVerification(email);
    setBusy(false);
    setPendingEmail(email);
    setDevLink(res.devLink);
    setMailSent(!res.success || res.mailSent !== false);
    setStatusMsg({ text: res.message, error: !res.success });
    if (res.success) {
      setResendCooldown(60);
      setUnverifiedEmail(null);
      setTab('check-email');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!regFirstName || !regLastName || !regEmail) {
      setStatusMsg({ text: 'Lütfen zorunlu alanları doldurunuz.', error: true });
      return;
    }

    if (strengthScore < 4) {
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

    setBusy(true);
    const res = await register({
      firstName: regFirstName,
      lastName: regLastName,
      email: regEmail,
      phone: regPhone.trim() === '+90' ? '' : regPhone,
      password: regPassword,
      marketingConsent: marketingAccepted,
      kvkkAccepted,
      termsAccepted
    });
    setBusy(false);

    if (res.success) {
      setPendingEmail(res.email || regEmail);
      setMailSent(res.mailSent !== false);
      setDevLink(res.devLink);
      setResendCooldown(60);
      setRegPassword('');
      setRegPasswordConfirm('');
      setLoginEmail(res.email || regEmail);
      setStatusMsg(null);
      setTab('check-email');
    } else {
      setStatusMsg({ text: res.message, error: true });
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setStatusMsg(null);
    setBusy(true);
    const res = await forgotPassword(forgotEmail);
    setBusy(false);
    if (res.success) {
      setDevLink(res.devLink);
      setForgotSubmitted(true);
    } else {
      setStatusMsg({ text: res.message, error: true });
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    if (passwordChecks(resetPass).score < 4) {
      setStatusMsg({ text: 'Şifreniz en az 8 karakter olmalı; büyük harf, küçük harf ve rakam içermelidir.', error: true });
      return;
    }
    if (resetPass !== resetPassConfirm) {
      setStatusMsg({ text: 'Girdiğiniz şifreler birbiriyle eşleşmiyor.', error: true });
      return;
    }
    setBusy(true);
    const res = await resetPassword(authModalOptions.resetToken || '', resetPass);
    setBusy(false);
    if (res.success) {
      setResetPass('');
      setResetPassConfirm('');
      setTab('login');
      setStatusMsg({ text: res.message, error: false });
    } else {
      setStatusMsg({ text: res.message, error: true });
    }
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
            onClick={() => switchTab('login')}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider text-center transition-colors relative ${
              (tab === 'login' || tab === 'forgot' || tab === 'reset') ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Giriş Yap
            {(tab === 'login' || tab === 'forgot' || tab === 'reset') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5A1F]" />}
          </button>
          <button
            onClick={() => switchTab('register')}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider text-center transition-colors relative ${
              (tab === 'register' || tab === 'check-email') ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Kayıt Ol
            {(tab === 'register' || tab === 'check-email') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5A1F]" />}
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
                    autoComplete="current-password"
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
                  onClick={() => { switchTab('forgot'); setForgotEmail(loginEmail); }}
                  className="text-[#FF5A1F] hover:underline"
                >
                  Şifremi Unuttum
                </button>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 bg-[#FF5A1F] hover:bg-[#e04e18] disabled:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-lg shadow-[#FF5A1F]/20 active:scale-95 flex items-center justify-center gap-2"
              >
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                Giriş Yap
              </button>

              {unverifiedEmail && (
                <button
                  type="button"
                  disabled={busy || resendCooldown > 0}
                  onClick={() => handleResend(unverifiedEmail)}
                  className="w-full py-2.5 border border-[#FF5A1F]/50 text-[#FF5A1F] hover:bg-[#FF5A1F]/10 disabled:opacity-50 text-xs font-semibold rounded-lg transition-colors"
                >
                  {resendCooldown > 0 ? `Yeniden gönder (${resendCooldown} sn)` : 'Doğrulama e-postasını tekrar gönder'}
                </button>
              )}

              {/* Demo Quick Logins (accounts are only seeded when the server runs in development) */}
              {import.meta.env.DEV && (
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
              )}
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

                <PasswordMeter password={regPassword} />
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
                disabled={busy}
                className="w-full py-3 bg-[#FF5A1F] hover:bg-[#e04e18] disabled:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-lg shadow-[#FF5A1F]/20 active:scale-95 flex items-center justify-center gap-2"
              >
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                Hesap Oluştur
              </button>
            </form>
          )}

          {/* TAB: CHECK YOUR INBOX (after sign-up / resend) */}
          {tab === 'check-email' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] mx-auto">
                <MailCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-sm">E-postanızı Doğrulayın</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {mailSent || devLink ? (
                  <>
                    <strong className="text-white">{pendingEmail}</strong> adresine bir doğrulama bağlantısı gönderdik.
                    Hesabınızı etkinleştirmek için bağlantıya tıklayın (24 saat geçerli). Gelmediyse spam klasörünü kontrol edin.
                  </>
                ) : (
                  <>
                    Hesabınız oluşturuldu ancak <strong className="text-white">{pendingEmail}</strong> adresine e-posta gönderilemedi.
                    Lütfen aşağıdaki butonla yeniden deneyin.
                  </>
                )}
              </p>
              {devLink && <DevLinkBox link={devLink} />}
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  disabled={busy || resendCooldown > 0}
                  onClick={() => handleResend(pendingEmail)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-200 hover:bg-neutral-800 disabled:opacity-50 text-xs font-semibold rounded"
                >
                  {resendCooldown > 0 ? `Tekrar gönder (${resendCooldown} sn)` : 'Tekrar Gönder'}
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className="px-4 py-2 bg-neutral-800 text-white text-xs font-semibold rounded hover:bg-neutral-700"
                >
                  Giriş Ekranına Dön
                </button>
              </div>
            </div>
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
                    <strong>{forgotEmail}</strong> kayıtlıysa, 1 saat geçerli tek kullanımlık şifre sıfırlama bağlantısı bu adrese iletildi. Gelmediyse spam klasörünü kontrol edin.
                  </p>
                  {devLink && <DevLinkBox link={devLink} />}
                  <button
                    onClick={() => { switchTab('login'); setForgotSubmitted(false); }}
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
                    disabled={busy}
                    className="w-full py-3 bg-[#FF5A1F] hover:bg-[#e04e18] disabled:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                    Sıfırlama Linki Gönder
                  </button>

                  <button
                    type="button"
                    onClick={() => switchTab('login')}
                    className="w-full text-center text-xs text-neutral-400 hover:text-white"
                  >
                    ← Giriş Yap'a Geri Dön
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB: SET A NEW PASSWORD (reached from the e-mailed reset link) */}
          {tab === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <p className="text-xs text-neutral-400 leading-relaxed">
                Hesabınız için yeni bir şifre belirleyin. Şifre değiştiğinde tüm açık oturumlarınız sonlandırılır.
              </p>

              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Yeni Şifre</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={resetPass}
                    onChange={(e) => setResetPass(e.target.value)}
                    autoComplete="new-password"
                    placeholder="En az 8 karakter, büyük-küçük harf, rakam"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF5A1F]"
                    required
                  />
                </div>
                <PasswordMeter password={resetPass} />
              </div>

              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Yeni Şifre Tekrarı</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={resetPassConfirm}
                    onChange={(e) => setResetPassConfirm(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Şifrenizi tekrar giriniz"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF5A1F]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 bg-[#FF5A1F] hover:bg-[#e04e18] disabled:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                Şifreyi Güncelle
              </button>

              <button
                type="button"
                onClick={() => switchTab('forgot')}
                className="w-full text-center text-xs text-neutral-400 hover:text-white"
              >
                Bağlantı geçersiz mi? Yeni bağlantı iste
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
