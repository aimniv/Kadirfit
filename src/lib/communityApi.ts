import type { AssessmentForm, CheckIn, User } from '../types';
import type { ApiResult } from './shopApi';

async function request<T extends object>(method: string, path: string, body?: unknown): Promise<ApiResult & Partial<T>> {
  try {
    const res = await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    const data = await res.json();
    return { success: res.ok && data.success !== false, message: '', ...data };
  } catch {
    return { success: false, message: 'Sunucuya ulaşılamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.' } as ApiResult & Partial<T>;
  }
}

export type ContentKey = 'settings' | 'cms_sections' | 'coaching_packages' | 'blog_posts' | 'testimonials' | 'transformations';

export const contentApi = {
  /** Resolves to null when the server can't be reached, so the built-in defaults stay in place. */
  async load(): Promise<Partial<Record<ContentKey, unknown>> | null> {
    try {
      const res = await fetch('/api/content', { credentials: 'same-origin' });
      if (!res.ok) return null;
      return (await res.json()).content ?? null;
    } catch {
      return null;
    }
  },
  save: (key: ContentKey, data: unknown) => request<{}>('PUT', `/content/${key}`, { data })
};

export const newsletterApi = {
  subscribe: (email: string) => request<{}>('POST', '/newsletter', { email }),
  list: () => request<{ subscribers: string[] }>('GET', '/newsletter')
};

export const assessmentsApi = {
  submit: (a: Omit<AssessmentForm, 'id' | 'userId' | 'submittedAt' | 'reviewedByCoach' | 'coachFeedback'>) =>
    request<{ assessment: AssessmentForm }>('POST', '/assessments', a),
  list: () => request<{ assessments: AssessmentForm[] }>('GET', '/assessments'),
  review: (id: string, coachFeedback: string) => request<{ assessment: AssessmentForm }>('PATCH', `/assessments/${encodeURIComponent(id)}`, { coachFeedback })
};

export const checkInsApi = {
  submit: (c: Omit<CheckIn, 'id' | 'userId' | 'weekNumber' | 'date'>) => request<{ checkIn: CheckIn }>('POST', '/checkins', c),
  list: () => request<{ checkIns: CheckIn[] }>('GET', '/checkins'),
  addCoachNotes: (id: string, coachNotes: string) => request<{ checkIn: CheckIn }>('PATCH', `/checkins/${encodeURIComponent(id)}`, { coachNotes })
};

export const membersApi = {
  list: () => request<{ users: User[] }>('GET', '/members'),
  setSuspended: (id: string, suspended: boolean) => request<{ user: User }>('PATCH', `/members/${encodeURIComponent(id)}`, { suspended })
};
