import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export type Toast = {
  id: string
  type: ToastType
  message: string
}

type ToastContextValue = {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType, ttlMs?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

function uid(): string {
  // crypto.randomUUID is supported in modern browsers; fallback for older environments.
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return String(Date.now()) + Math.random().toString(16).slice(2)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', ttlMs: number = 3200) => {
      const id = uid()
      setToasts((prev) => [...prev, { id, type, message }])

      if (ttlMs > 0) {
        window.setTimeout(() => removeToast(id), ttlMs)
      }
    },
    [removeToast],
  )

  const value = useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastViewport() {
  const { toasts, removeToast } = useToast()

  return (
    <div
      aria-live="polite"
      aria-relevant="additions removals"
      className="pointer-events-none fixed right-3 top-3 z-50 flex w-[92vw] max-w-sm flex-col gap-2"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            'pointer-events-auto rounded-xl border px-4 py-3 shadow-lg transition',
            t.type === 'success' ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/50' : '',
            t.type === 'error' ? 'border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/50' : '',
            t.type === 'info' ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950' : '',
          ].join(' ')}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm leading-5">{t.message}</p>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

