import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import { formatMoney } from '../lib/format'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, checkout, isLoading } = useCart()
  const { addToast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')

  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [orderTotal, setOrderTotal] = useState<number>(0)

  const canSubmit = useMemo(() => items.length > 0 && !isLoading, [items.length, isLoading])

  useEffect(() => {
    if (items.length === 0 && !orderNumber && !isLoading) {
      addToast('Your cart is empty.', 'info', 2500)
      navigate('/products', { replace: true })
    }
  }, [addToast, isLoading, items.length, navigate, orderNumber])

  const validate = () => {
    const nextErrors: string[] = []
    if (!name.trim()) nextErrors.push('Name is required.')
    if (!email.trim()) nextErrors.push('Email is required.')
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) nextErrors.push('Email looks invalid.')
    if (!address.trim()) nextErrors.push('Address is required.')

    return nextErrors
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errors = validate()
    if (errors.length > 0) {
      addToast(errors[0], 'error', 3200)
      return
    }

    try {
      const res = await checkout({
        name: name.trim(),
        email: email.trim(),
        address: address.trim(),
      })
      setOrderNumber(res.order_number)
      setOrderTotal(res.total)
    } catch {
      // CartContext already adds error toast.
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Checkout</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Fill in your details. Payment is simulated—no real charges are made.
      </p>

      {orderNumber ? (
        <div className="mt-6 rounded-2xl border bg-emerald-50 p-5 text-sm text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
          <p className="font-semibold">Order confirmed!</p>
          <p className="mt-2">
            Order number: <span className="font-mono">{orderNumber}</span>
          </p>
          <p className="mt-2">
            Total paid: <span className="font-semibold">{formatMoney(orderTotal)}</span>
          </p>
          <button
            type="button"
            className="mt-4 inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
            onClick={() => navigate('/products')}
          >
            Continue shopping
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_360px]">
          <form onSubmit={onSubmit} className="rounded-2xl border bg-white/70 p-6 shadow-sm dark:bg-slate-900/20">
            <div className="grid gap-4">
              <label className="grid gap-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                Name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
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
                Address
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, city, and country"
                  rows={4}
                  className="resize-y rounded-xl border bg-white/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-800 dark:bg-slate-900/40"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {isLoading ? 'Processing...' : `Pay ${formatMoney(subtotal)}`}
            </button>
          </form>

          <aside className="h-fit rounded-2xl border bg-white/70 p-5 shadow-sm dark:bg-slate-900/20">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Summary</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">Shipping</span>
                <span className="font-semibold text-slate-900 dark:text-white">$0.00</span>
              </div>
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">Total</span>
                <span className="text-base font-bold text-indigo-700 dark:text-indigo-300">
                  {formatMoney(subtotal)}
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Your order is created via API and stored in the backend database.
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}

