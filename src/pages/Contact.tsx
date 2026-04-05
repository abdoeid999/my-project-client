import { useState, type FormEvent } from 'react'
import { useToast } from '../contexts/ToastContext'

export default function Contact() {
  const { addToast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()

    if (!trimmedName) return addToast('Name is required.', 'error')
    if (!trimmedEmail) return addToast('Email is required.', 'error')
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) return addToast('Email looks invalid.', 'error')
    if (!trimmedMessage) return addToast('Message is required.', 'error')

    setIsSubmitting(true)
    try {
      // Simulated submission (no backend endpoint required by the spec).
      await new Promise((r) => window.setTimeout(r, 600))
      addToast('Message sent! We will get back to you shortly.', 'success')
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      addToast('Failed to submit form.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Contact Us</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Questions, feedback, or partnership inquiries—send us a message.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_360px]">
        <form onSubmit={onSubmit} className="rounded-2xl border bg-white/70 p-6 shadow-sm dark:bg-slate-900/20">
          <div className="grid gap-4">
            <label className="grid gap-1 text-sm font-medium text-slate-800 dark:text-slate-100">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="rounded-xl border bg-white/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-800 dark:bg-slate-900/40"
              />
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-800 dark:text-slate-100">
              Email
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                inputMode="email"
                className="rounded-xl border bg-white/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-800 dark:bg-slate-900/40"
              />
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-800 dark:text-slate-100">
              Message
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Tell us how we can help..."
                className="resize-y rounded-xl border bg-white/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-800 dark:bg-slate-900/40"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Sending...' : 'Send message'}
          </button>
        </form>

        <aside className="rounded-2xl border bg-white/70 p-6 shadow-sm dark:bg-slate-900/20">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Company info</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">NovaMart, 123 Market Street</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">support@novamart.example</p>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            This page simulates contact form submission. For a production system, connect this to Laravel endpoints.
          </p>
        </aside>
      </div>
    </div>
  )
}

