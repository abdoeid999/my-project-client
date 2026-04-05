import type { Product } from '../types'
import { formatMoney } from '../lib/format'
import { Link } from 'react-router-dom'

type Props = {
  product: Product
  onAdd: (productId: number) => void | Promise<void>
  onQuickView?: (product: Product) => void
}

export default function ProductCard({ product, onAdd, onQuickView }: Props) {
  return (
    <article className="group overflow-hidden rounded-2xl border bg-white/70 shadow-sm transition hover:shadow-md dark:bg-slate-900/20">
      <div className="relative">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        {product.featured ? (
          <span className="absolute left-3 top-3 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="min-h-[3.25rem]">
          <Link
            to={`/products/${product.id}`}
            className="text-base font-semibold text-slate-900 transition hover:underline dark:text-white"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {formatMoney(product.price)}{' '}
            <span className="text-xs text-slate-400">(Stock: {product.stock})</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void onAdd(product.id)}
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Add to Cart
          </button>
          {onQuickView ? (
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white/50 text-slate-700 transition hover:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-950/40 dark:text-slate-200"
              aria-label={`Quick view for ${product.name}`}
            >
              i
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}

