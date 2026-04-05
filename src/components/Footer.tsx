import { FaFacebookF, FaGithub, FaInstagram } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t bg-white/60 backdrop-blur dark:bg-slate-950/40">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">NovaMart</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              A fictional full-stack e-commerce demo built with React + Laravel.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Links</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link className="text-slate-700 hover:underline dark:text-slate-200" to="/">
                Home
              </Link>
              <Link className="text-slate-700 hover:underline dark:text-slate-200" to="/products">
                Products
              </Link>
              <Link className="text-slate-700 hover:underline dark:text-slate-200" to="/about">
                About Us
              </Link>
              <Link className="text-slate-700 hover:underline dark:text-slate-200" to="/contact">
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Social</p>
            <div className="mt-3 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white/70 text-slate-700 shadow-sm transition hover:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100 dark:hover:bg-slate-900"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white/70 text-slate-700 shadow-sm transition hover:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100 dark:hover:bg-slate-900"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white/70 text-slate-700 shadow-sm transition hover:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100 dark:hover:bg-slate-900"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} NovaMart. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

