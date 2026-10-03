import nodemailer from 'nodemailer';
import { APP_URL, SMTP, isProd } from './config';

const smtpConfigured = Boolean(SMTP.host);

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: SMTP.host,
      port: SMTP.port,
      secure: SMTP.secure,
      auth: SMTP.user ? { user: SMTP.user, pass: SMTP.pass } : undefined
    })
  : null;

if (!smtpConfigured) {
  console.warn(
    isProd
      ? '[mail] SMTP_HOST is not set — verification and password-reset e-mails CANNOT be delivered.'
      : '[mail] SMTP_HOST is not set — e-mails are printed to this console instead (dev mode).'
  );
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function layout(title: string, bodyHtml: string, buttonLabel: string, link: string, footnote: string): string {
  return `<!doctype html>
<html lang="tr"><body style="margin:0;padding:24px;background:#0A0A0A;font-family:Inter,Arial,sans-serif;color:#EDEDED">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;background:#121212;border:1px solid #262626;border-radius:12px">
      <tr><td style="padding:28px 32px 8px;font-size:22px;font-weight:800;letter-spacing:2px;color:#FF5A1F">KADIRFIT</td></tr>
      <tr><td style="padding:8px 32px 0;font-size:18px;font-weight:700;color:#fff">${escapeHtml(title)}</td></tr>
      <tr><td style="padding:12px 32px;font-size:14px;line-height:1.6;color:#B5B5B5">${bodyHtml}</td></tr>
      <tr><td style="padding:8px 32px 20px">
        <a href="${link}" style="display:inline-block;background:#FF5A1F;color:#fff;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:1px;text-transform:uppercase;padding:13px 26px;border-radius:8px">${escapeHtml(buttonLabel)}</a>
      </td></tr>
      <tr><td style="padding:0 32px 8px;font-size:12px;line-height:1.5;color:#7A7A7A">Buton çalışmazsa bu bağlantıyı tarayıcınıza yapıştırın:<br><span style="word-break:break-all;color:#9A9A9A">${link}</span></td></tr>
      <tr><td style="padding:12px 32px 28px;font-size:12px;line-height:1.5;color:#7A7A7A">${footnote}</td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

export interface MailResult {
  /** True when the message was handed to an SMTP server. */
  sent: boolean;
  /** Dev-mode only: the action link, because no mail could be sent. Never set in production. */
  devLink?: string;
}

async function deliver(to: string, subject: string, html: string, text: string, link: string): Promise<MailResult> {
  if (!transporter) {
    if (!isProd) {
      console.log(`\n[mail:dev] To: ${to}\n[mail:dev] Subject: ${subject}\n[mail:dev] Link: ${link}\n`);
      return { sent: false, devLink: link };
    }
    console.error(`[mail] Cannot send "${subject}" to ${to}: SMTP is not configured.`);
    return { sent: false };
  }
  try {
    await transporter.sendMail({ from: SMTP.from, to, subject, html, text });
    return { sent: true };
  } catch (err) {
    console.error(`[mail] Failed to send "${subject}" to ${to}:`, err instanceof Error ? err.message : err);
    return { sent: false };
  }
}

export function sendVerificationEmail(to: string, firstName: string, token: string): Promise<MailResult> {
  const link = `${APP_URL}/?verify=${token}`;
  const name = escapeHtml(firstName);
  const html = layout(
    'E-posta adresinizi doğrulayın',
    `Merhaba ${name},<br>Kadirfit'e hoş geldiniz! Hesabınızı etkinleştirmek için e-posta adresinizi doğrulamanız gerekiyor. Bağlantı <strong>24 saat</strong> geçerlidir.`,
    'E-postamı Doğrula',
    link,
    'Bu hesabı siz oluşturmadıysanız bu e-postayı yok sayabilirsiniz.'
  );
  const text = `Merhaba ${firstName},\n\nKadirfit hesabınızı etkinleştirmek için bağlantıya tıklayın (24 saat geçerli):\n${link}\n\nBu hesabı siz oluşturmadıysanız bu e-postayı yok sayabilirsiniz.`;
  return deliver(to, 'Kadirfit — E-posta adresinizi doğrulayın', html, text, link);
}

export function sendPasswordResetEmail(to: string, firstName: string, token: string): Promise<MailResult> {
  const link = `${APP_URL}/?reset=${token}`;
  const name = escapeHtml(firstName);
  const html = layout(
    'Şifre sıfırlama isteği',
    `Merhaba ${name},<br>Hesabınız için şifre sıfırlama talebi aldık. Yeni şifre belirlemek için aşağıdaki butonu kullanın. Bağlantı <strong>1 saat</strong> geçerlidir ve yalnızca bir kez kullanılabilir.`,
    'Şifremi Sıfırla',
    link,
    'Bu talebi siz yapmadıysanız bu e-postayı yok sayın; şifreniz değişmeyecektir.'
  );
  const text = `Merhaba ${firstName},\n\nŞifrenizi sıfırlamak için bağlantıya tıklayın (1 saat geçerli, tek kullanımlık):\n${link}\n\nBu talebi siz yapmadıysanız bu e-postayı yok sayın.`;
  return deliver(to, 'Kadirfit — Şifre sıfırlama', html, text, link);
}
