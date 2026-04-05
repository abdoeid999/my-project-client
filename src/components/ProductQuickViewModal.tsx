import { useEffect, useMemo, useState } from 'react'
import type { Product } from '../types'
import { formatMoney } from '../lib/format'

type Props = {
  open: boolean
  product: Product | null
  onClose: () => void
  onAddToCart: (productId: number, quantity: number) => Promise<void> | void
}

export default function ProductQuickViewModal({ open, product, onClose, onAddToCart }: Props) {
  const [quantity, setQuantity] = useState(1)

  const maxStock = useMemo(() => product?.stock ?? 1, [product])

  useEffect(() => {
    if (!open) return
    setQuantity(1)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open || !product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}
        className="w-full max-w-3xl overflow-hidden rounded-2xl border bg-white dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="grid gap-0 md:grid-cols-2">
          <div className="relative">
            <img src={product.image_url} alt={product.name} className="h-64 w-full object-cover md:h-full" />
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{product.name}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{formatMoney(product.price)}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {product.description ?? 'No description.'}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white/70 text-slate-700 transition hover:bg-white dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-200 dark:hover:bg-slate-900/60"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-slate-800 dark:text-slate-100" htmlFor="qty">
                Quantity
              </label>
              <input
                id="qty"
                type="number"
                inputMode="numeric"
                min={1}
                max={maxStock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(maxStock, Number(e.target.value) || 1)))}
                className="mt-2 w-24 rounded-lg border bg-white/60 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/50 dark:border-slate-800 dark:bg-slate-900/40 dark:text-white"
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Max available: {maxStock}</p>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onAddToCart(product.id, quantity)}
                className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                disabled={product.stock <= 0}
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border bg-white/70 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-white dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-100 dark:hover:bg-slate-900/60"
              >
                Keep Browsing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

