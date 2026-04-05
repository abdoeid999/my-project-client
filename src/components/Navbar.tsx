import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FiMenu, FiMoon, FiShoppingCart, FiSun, FiX } from 'react-icons/fi'
import { useCart } from '../contexts/CartContext'
import { useTheme } from '../contexts/ThemeContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { cartCount } = useCart()
  const { theme, toggleTheme } = useTheme()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'rounded-md px-3 py-2 text-sm font-medium transition',
      isActive
        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
    ].join(' ')

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white"
          onClick={() => setMenuOpen(false)}
        >
          NovaMart
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white/70 text-slate-800 shadow-sm transition hover:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100 dark:hover:bg-slate-900"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>

          <NavLink
            to="/cart"
            className="relative inline-flex h-10 items-center gap-2 rounded-lg border bg-white/70 px-3 text-sm font-medium shadow-sm transition hover:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            <FiShoppingCart aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </NavLink>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white/70 text-slate-800 shadow-sm transition hover:bg-white md:hidden dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100 dark:hover:bg-slate-900"
            aria-label="Open mobile menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t bg-white/90 p-4 backdrop-blur md:hidden dark:bg-slate-950/90">
          <div className="flex flex-col gap-1">
            <NavLink to="/" onClick={() => setMenuOpen(false)} className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/products" onClick={() => setMenuOpen(false)} className={linkClass}>
              Products
            </NavLink>
            <NavLink to="/about" onClick={() => setMenuOpen(false)} className={linkClass}>
              About
            </NavLink>
            <NavLink to="/contact" onClick={() => setMenuOpen(false)} className={linkClass}>
              Contact
            </NavLink>
          </div>
        </div>
      ) : null}
    </header>
  )
}

