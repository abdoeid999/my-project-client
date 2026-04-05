import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'
import ProductQuickViewModal from '../components/ProductQuickViewModal'
import { useCart } from '../contexts/CartContext'
import { formatMoney } from '../lib/format'

export default function Home() {
  const { addItem } = useCart()

  const [featured, setFeatured] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  const [quickProduct, setQuickProduct] = useState<Product | null>(null)
  const [quickOpen, setQuickOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError('')
      try {
        const res = await api.get<{ data: Product[] }>('/api/products?featured=true')
        setFeatured(res.data.data)
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load products.')
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [])

  const featuredTop = useMemo(() => featured.slice(0, 8), [featured])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-500 p-6 text-white md:p-10">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-white/90">Modern shopping, made simple</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">
              Discover our latest picks in <span className="underline decoration-white/40">NovaMart</span>
            </h1>
            <p className="mt-3 text-white/90">
              Browse products, update your cart in real time, and checkout with simulated order processing.
            </p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Link
                to="/products"
                className="rounded-xl bg-white/90 px-5 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-white"
              >
                Shop now
              </Link>
              <Link
                to="/about"
                className="rounded-xl border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold text-white/95 transition hover:bg-white/15"
              >
                Learn more
              </Link>
            </div>
          </div>

          <div className="relative max-w-sm">
            <div className="rounded-2xl bg-white/10 p-4 shadow-sm">
              <p className="text-sm font-semibold text-white/90">Today’s highlight</p>
              {featuredTop[0] ? (
                <>
                  <p className="mt-2 text-lg font-semibold">{featuredTop[0].name}</p>
                  <p className="mt-1 text-sm text-white/90">{formatMoney(featuredTop[0].price)}</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-white/90">Loading featured products...</p>
              )}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    const p = featuredTop[0]
                    if (!p) return
                    setQuickProduct(p)
                    setQuickOpen(true)
                  }}
                  disabled={!featuredTop[0]}
                  className="w-full rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-50"
                >
                  Quick view
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Featured products</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Add items to your cart and see totals update instantly.</p>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border bg-rose-50 p-4 text-sm text-rose-800 dark:bg-rose-950/30 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl border bg-white/70 dark:bg-slate-900/20" />
            ))}
          </div>
        ) : featuredTop.length === 0 ? (
          <div className="mt-6 rounded-2xl border bg-white/70 p-8 text-center text-sm text-slate-600 dark:bg-slate-900/20 dark:text-slate-300">
            No featured products found.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTop.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={(id) => addItem(id)}
                onQuickView={(prod) => {
                  setQuickProduct(prod)
                  setQuickOpen(true)
                }}
              />
            ))}
          </div>
        )}
      </section>

      <ProductQuickViewModal
        open={quickOpen}
        product={quickProduct}
        onClose={() => setQuickOpen(false)}
        onAddToCart={async (productId, quantity) => {
          await addItem(productId, quantity)
          setQuickOpen(false)
        }}
      />
    </div>
  )
}

