import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

/**
 * Site-styled replacements for the browser's prompt() / confirm() / alert().
 * Every call returns a Promise, so call sites stay as short as the native versions.
 */

export interface FormField {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'select';
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  hint?: string;
  options?: Array<{ value: string; label: string }>;
}

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Red confirm button, for destructive actions. */
  danger?: boolean;
}

interface FormOptions {
  title: string;
  description?: string;
  fields: FormField[];
  submitLabel?: string;
}

type Tone = 'success' | 'error' | 'info';

interface DialogApi {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  /** Resolves with the entered values, or null when cancelled. */
  form: (options: FormOptions) => Promise<Record<string, string> | null>;
  /** Short, non-blocking message that disappears by itself. */
  notify: (message: string, tone?: Tone) => void;
}

type ActiveDialog =
  | { kind: 'confirm'; options: ConfirmOptions; resolve: (v: boolean) => void }
  | { kind: 'form'; options: FormOptions; resolve: (v: Record<string, string> | null) => void };

interface Toast {
  id: number;
  message: string;
  tone: Tone;
}

const DialogContext = createContext<DialogApi | undefined>(undefined);

const inputCls =
  'w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]';

const Shell: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md bg-[#121212] border border-neutral-800 rounded-2xl shadow-2xl relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Kapat"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
};

const ConfirmDialog: React.FC<{ options: ConfirmOptions; onResult: (v: boolean) => void }> = ({ options, onResult }) => {
  const confirmRef = useRef<HTMLButtonElement>(null);
  useEffect(() => confirmRef.current?.focus(), []);

  return (
    <Shell title={options.title ?? 'Onay'} onClose={() => onResult(false)}>
      <div className="p-6 space-y-5">
        <div className="flex items-start gap-3 pr-6">
          <div
            className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border ${
              options.danger ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-[#FF5A1F]/10 border-[#FF5A1F]/30 text-[#FF5A1F]'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-heading uppercase text-sm font-bold text-white tracking-wider">{options.title ?? 'Emin misiniz?'}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">{options.message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onResult(false)}
            className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg"
          >
            {options.cancelLabel ?? 'Vazgeç'}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={() => onResult(true)}
            className={`px-5 py-2.5 text-white text-xs font-bold uppercase tracking-wider rounded-lg ${
              options.danger ? 'bg-rose-600 hover:bg-rose-500' : 'bg-[#FF5A1F] hover:bg-[#e04e18]'
            }`}
          >
            {options.confirmLabel ?? 'Onayla'}
          </button>
        </div>
      </div>
    </Shell>
  );
};

const FormDialog: React.FC<{ options: FormOptions; onResult: (v: Record<string, string> | null) => void }> = ({ options, onResult }) => {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(options.fields.map(f => [f.name, f.defaultValue ?? (f.type === 'select' ? f.options?.[0]?.value ?? '' : '')]))
  );
  const [error, setError] = useState<string | null>(null);
  const firstRef = useRef<HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement>(null);
  useEffect(() => firstRef.current?.focus(), []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = options.fields.find(f => f.required !== false && !values[f.name]?.trim());
    if (missing) return setError(`"${missing.label}" alanı boş bırakılamaz.`);
    onResult(Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()])));
  };

  return (
    <Shell title={options.title} onClose={() => onResult(null)}>
      <form onSubmit={submit} className="p-6 space-y-4">
        <div className="pr-6 space-y-1">
          <h3 className="font-heading uppercase text-sm font-bold text-white tracking-wider">{options.title}</h3>
          {options.description && <p className="text-xs text-neutral-400 leading-relaxed">{options.description}</p>}
        </div>

        {error && (
          <div className="p-2.5 rounded-lg text-xs flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {options.fields.map((f, i) => {
          const common = {
            id: `dlg-${f.name}`,
            value: values[f.name],
            placeholder: f.placeholder,
            className: inputCls,
            ref: i === 0 ? firstRef : undefined,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
              setError(null);
              setValues(prev => ({ ...prev, [f.name]: e.target.value }));
            }
          };
          return (
            <div key={f.name}>
              <label htmlFor={common.id} className="text-xs text-neutral-400 mb-1 block">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea {...common} className={`${inputCls} min-h-28`} />
              ) : f.type === 'select' ? (
                <select {...common}>
                  {f.options?.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : (
                <input {...common} type={f.type === 'number' ? 'number' : 'text'} inputMode={f.type === 'number' ? 'decimal' : undefined} />
              )}
              {f.hint && <p className="text-[10px] text-neutral-500 mt-1">{f.hint}</p>}
            </div>
          );
        })}

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={() => onResult(null)} className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg">
            Vazgeç
          </button>
          <button type="submit" className="px-5 py-2.5 bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold uppercase tracking-wider rounded-lg">
            {options.submitLabel ?? 'Kaydet'}
          </button>
        </div>
      </form>
    </Shell>
  );
};

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<ActiveDialog[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextToastId = useRef(1);

  const confirm = useCallback(
    (options: ConfirmOptions) => new Promise<boolean>(resolve => setQueue(q => [...q, { kind: 'confirm', options, resolve }])),
    []
  );
  const form = useCallback(
    (options: FormOptions) => new Promise<Record<string, string> | null>(resolve => setQueue(q => [...q, { kind: 'form', options, resolve }])),
    []
  );
  const notify = useCallback((message: string, tone: Tone = 'info') => {
    const id = nextToastId.current++;
    setToasts(t => [...t, { id, message, tone }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), tone === 'error' ? 6000 : 3500);
  }, []);

  const active = queue[0];
  const finish = (result: boolean | Record<string, string> | null) => {
    (active.resolve as (v: typeof result) => void)(result);
    setQueue(q => q.slice(1));
  };

  const ToneIcon = { success: CheckCircle2, error: AlertCircle, info: Info };
  const toneCls = {
    success: 'border-emerald-500/40 text-emerald-300',
    error: 'border-rose-500/40 text-rose-300',
    info: 'border-neutral-700 text-neutral-200'
  };

  return (
    <DialogContext.Provider value={{ confirm, form, notify }}>
      {children}

      {active?.kind === 'confirm' && <ConfirmDialog key={queue.length} options={active.options} onResult={finish} />}
      {active?.kind === 'form' && <FormDialog key={queue.length} options={active.options} onResult={finish} />}

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex flex-col items-center gap-2 px-4 pointer-events-none" aria-live="polite">
        {toasts.map(t => {
          const Icon = ToneIcon[t.tone];
          return (
            <div key={t.id} className={`flex items-center gap-2.5 max-w-sm px-4 py-3 rounded-xl bg-[#161616] border shadow-2xl text-xs animate-fade-in ${toneCls[t.tone]}`}>
              <Icon className="w-4 h-4 shrink-0" />
              <span>{t.message}</span>
            </div>
          );
        })}
      </div>
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used within a DialogProvider');
  return ctx;
};
