import type { User } from '../types';

export interface AuthResult {
  success: boolean;
  message: string;
  /** Machine-readable reason, e.g. EMAIL_NOT_VERIFIED, RATE_LIMITED, INVALID_TOKEN. */
  code?: string;
  user?: User;
  email?: string;
  /** False when the server could not hand the e-mail to an SMTP server. */
  mailSent?: boolean;
  /** Development only: action link returned when no SMTP server is configured. */
  devLink?: string;
}

async function request(method: string, path: string, body?: unknown): Promise<AuthResult> {
  try {
    const res = await fetch(`/api/auth${path}`, {
      method,
      credentials: 'same-origin',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    const data = await res.json();
    return { success: res.ok && data.success !== false, message: '', ...data };
  } catch {
    return { success: false, message: 'Sunucuya ulaşılamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.' };
  }
}

export const authApi = {
  async me(): Promise<User | null> {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
      const data = await res.json();
      return data.user ?? null;
    } catch {
      return null;
    }
  },
  login: (email: string, password: string, remember: boolean) =>
    request('POST', '/login', { email, password, remember }),
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    marketingConsent: boolean;
    kvkkAccepted: boolean;
    termsAccepted: boolean;
  }) => request('POST', '/register', data),
  logout: () => request('POST', '/logout', {}),
  verifyEmail: (token: string) => request('POST', '/verify-email', { token }),
  resendVerification: (email: string) => request('POST', '/resend-verification', { email }),
  forgotPassword: (email: string) => request('POST', '/forgot-password', { email }),
  resetPassword: (token: string, password: string) => request('POST', '/reset-password', { token, password }),
  updateProfile: (data: Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'marketingConsent'>>) =>
    request('PATCH', '/me', data),
  deleteAccount: () => request('DELETE', '/me')
};
