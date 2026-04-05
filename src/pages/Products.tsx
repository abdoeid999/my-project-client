import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'
import ProductQuickViewModal from '../components/ProductQuickViewModal'
import { useCart } from '../contexts/CartContext'

const CATEGORIES = ['All', 'Electronics', 'Home', 'Lifestyle', 'Computers', 'Kitchen', 'Fashion', 'Travel']

export default function Products() {
  const { addItem } = useCart()

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const [quickProduct, setQuickProduct] = useState<Product | null>(null)
  const [quickOpen, setQuickOpen] = useState(false)

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    if (category !== 'All') params.set('category', category)
    if (minPrice.trim()) params.set('minPrice', minPrice.trim())
    if (maxPrice.trim()) params.set('maxPrice', maxPrice.trim())
    return params.toString()
  }, [category, maxPrice, minPrice, search])

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError('')
      try {
        const res = await api.get<{ data: Product[] }>(`/api/products${queryString ? `?${queryString}` : ''}`)
        setProducts(res.data.data)
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load products.')
      } finally {
        setIsLoading(false)
      }
    }

    const t = window.setTimeout(() => {
      void load()
    }, 250)

    return () => window.clearTimeout(t)
  }, [queryString])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Products</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Search, filter, and add items to your cart.</p>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-2 md:w-auto md:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-800 dark:text-slate-100">
            Search
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. charger"
              className="rounded-xl border bg-white/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-800 dark:bg-slate-900/40"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-800 dark:text-slate-100">
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border bg-white/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-800 dark:bg-slate-900/40"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-800 dark:text-slate-100">
            Min
            <input
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              inputMode="decimal"
              placeholder="0"
              className="rounded-xl border bg-white/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-800 dark:bg-slate-900/40"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-800 dark:text-slate-100">
            Max
            <input
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              inputMode="decimal"
              placeholder="1000"
              className="rounded-xl border bg-white/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-800 dark:bg-slate-900/40"
            />
          </label>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border bg-rose-50 p-4 text-sm text-rose-800 dark:bg-rose-950/30 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl border bg-white/70 dark:bg-slate-900/20" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="mt-6 rounded-2xl border bg-white/70 p-8 text-center text-sm text-slate-600 dark:bg-slate-900/20 dark:text-slate-300">
          No products match your filters.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
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

