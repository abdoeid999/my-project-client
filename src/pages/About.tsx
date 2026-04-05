export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">About Us</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        NovaMart is a fictional e-commerce store created to demonstrate a full-stack React + Laravel architecture.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white/70 p-5 shadow-sm dark:bg-slate-900/20">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Products & Browsing</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Customers can browse product cards, view details, and search/filter the catalog.
          </p>
        </div>
        <div className="rounded-2xl border bg-white/70 p-5 shadow-sm dark:bg-slate-900/20">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Cart & Checkout</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Cart items are managed through REST APIs, and checkout creates an order record without real payments.
          </p>
        </div>
        <div className="rounded-2xl border bg-white/70 p-5 shadow-sm dark:bg-slate-900/20">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Responsive UI</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            The interface is fully responsive and includes mobile navigation, modals, and dynamic totals.
          </p>
        </div>
      </div>
    </div>
  )
}

