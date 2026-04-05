import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import QuantityStepper from '../components/QuantityStepper'
import { formatMoney } from '../lib/format'

export default function Cart() {
  const { items, subtotal, isLoading, updateItem, removeItem } = useCart()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Shopping Cart</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Update quantities, remove items, and proceed to checkout.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border bg-white/70 p-8 text-center text-sm text-slate-600 dark:bg-slate-900/20 dark:text-slate-300">
          Your cart is empty.
          <div className="mt-4">
            <Link to="/products" className="font-semibold text-indigo-700 hover:underline dark:text-indigo-300">
              Browse products
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((line) => (
              <div
                key={line.product_id}
                className="flex gap-4 rounded-2xl border bg-white/70 p-4 shadow-sm dark:bg-slate-900/20"
              >
                <img
                  src={line.product.image_url}
                  alt={line.product.name}
                  className="h-20 w-20 flex-none rounded-xl object-cover"
                  loading="lazy"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{line.product.name}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {formatMoney(line.product.price)} each
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => void removeItem(line.product_id)}
                      disabled={isLoading}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white/60 text-slate-700 transition hover:bg-white disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900/60"
                      aria-label={`Remove ${line.product.name}`}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Qty</span>
                      <QuantityStepper
                        value={line.quantity}
                        min={1}
                        max={line.product.stock}
                        disabled={isLoading}
                        onChange={(next) => void updateItem(line.product_id, next)}
                      />
                    </div>

                    <div className="text-sm text-slate-700 dark:text-slate-200">
                      Line total:{' '}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatMoney(line.line_total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border bg-white/70 p-5 shadow-sm dark:bg-slate-900/20">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Order Summary</p>
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
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">Total</span>
                <span className="text-base font-bold text-indigo-700 dark:text-indigo-300">{formatMoney(subtotal)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-5 block rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              Proceed to Checkout
            </Link>

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Checkout is simulated—no payment is processed.
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}

