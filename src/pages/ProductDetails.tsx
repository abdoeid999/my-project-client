import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { Product } from '../types'
import { useCart } from '../contexts/CartContext'
import { formatMoney } from '../lib/format'

export default function ProductDetails() {
  const params = useParams()
  const productId = Number(params.id ?? '')

  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  const [quantity, setQuantity] = useState(1)

  const maxStock = useMemo(() => product?.stock ?? 1, [product])

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError('')

      try {
        if (!Number.isFinite(productId) || productId <= 0) {
          setError('Invalid product id.')
          return
        }

        const res = await api.get<{ data: Product }>(`/api/products/${productId}`)
        setProduct(res.data.data)
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load product.')
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [productId])

  const safeQty = Math.max(1, Math.min(maxStock, quantity))

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center gap-3">
        <Link
          to="/products"
          className="text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-300"
        >
          ← Back to Products
        </Link>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border bg-rose-50 p-4 text-sm text-rose-800 dark:bg-rose-950/30 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="h-80 animate-pulse rounded-3xl border bg-white/70 dark:bg-slate-900/20" />
          <div className="h-80 animate-pulse rounded-3xl border bg-white/70 dark:bg-slate-900/20" />
        </div>
      ) : product ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border bg-white/70 dark:bg-slate-900/20">
            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
          </div>

          <div className="rounded-3xl border bg-white/70 p-6 shadow-sm dark:bg-slate-900/20">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{product.name}</h1>
              <p className="mt-2 text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                {formatMoney(product.price)}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Category: {product.category ?? '—'}</p>
              <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">{product.description ?? ''}</p>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                Stock available: <span className="font-semibold">{product.stock}</span>
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-white/60 p-4 dark:bg-slate-950/20">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-100" htmlFor="qty">
                Quantity
              </label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  id="qty"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={maxStock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="w-28 rounded-xl border bg-white/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-800 dark:bg-slate-900/40 dark:text-white"
                />
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Line total:{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatMoney(product.price * safeQty)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void addItem(product.id, safeQty)}
                disabled={product.stock <= 0}
                className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

