import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api } from '../lib/api'
import type { CartLine, CartResponse, CheckoutResponse } from '../types'
import type { Product } from '../types'
import { useToast } from './ToastContext'

type CartContextValue = {
  cartToken: string
  items: CartLine[]
  subtotal: number
  currency: string
  isLoading: boolean
  cartCount: number
  refreshCart: () => Promise<void>
  addItem: (productId: number, quantity?: number) => Promise<void>
  updateItem: (productId: number, quantity: number) => Promise<void>
  removeItem: (productId: number) => Promise<void>
  checkout: (payload: { name: string; email: string; address: string }) => Promise<CheckoutResponse>
  getProduct: (id: number) => Promise<Product>
}

const CartContext = createContext<CartContextValue | null>(null)

function getOrCreateCartToken(): string {
  const key = 'cart_token'
  const existing = window.localStorage.getItem(key)
  if (existing) return existing

  const token =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)
  window.localStorage.setItem(key, token)
  return token
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { addToast } = useToast()

  const [cartToken] = useState<string>(() => getOrCreateCartToken())
  const [items, setItems] = useState<CartLine[]>([])
  const [subtotal, setSubtotal] = useState<number>(0)
  const [currency, setCurrency] = useState<string>('USD')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const cartCount = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items])

  const headers = useMemo(() => ({ 'X-Cart-Token': cartToken }), [cartToken])

  const refreshCart = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await api.get<CartResponse>('/api/cart', { headers })
      setItems(res.data.items)
      setSubtotal(res.data.subtotal)
      setCurrency(res.data.currency)
    } catch (err) {
      // Cart token exists locally; if the backend fails, fall back to an empty cart.
      setItems([])
      setSubtotal(0)
      setCurrency('USD')
      addToast('Failed to load cart.', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [addToast, headers])

  useEffect(() => {
    // Load server cart state once on boot.
    void refreshCart()
  }, [refreshCart])

  const addItem = useCallback(
    async (productId: number, quantity: number = 1) => {
      setIsLoading(true)
      try {
        const res = await api.post<CartResponse>(
          '/api/cart/items',
          { product_id: productId, quantity },
          { headers },
        )
        setItems(res.data.items)
        setSubtotal(res.data.subtotal)
        setCurrency(res.data.currency)
        addToast('Added to cart.', 'success')
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? 'Unable to add to cart.'
        addToast(msg, 'error')
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [addToast, headers],
  )

  const updateItem = useCallback(
    async (productId: number, quantity: number) => {
      setIsLoading(true)
      try {
        const res = await api.put<CartResponse>(
          `/api/cart/items/${productId}`,
          { quantity },
          { headers },
        )
        setItems(res.data.items)
        setSubtotal(res.data.subtotal)
        setCurrency(res.data.currency)
        addToast('Cart updated.', 'success', 2200)
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? 'Unable to update cart.'
        addToast(msg, 'error')
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [addToast, headers],
  )

  const removeItem = useCallback(
    async (productId: number) => {
      setIsLoading(true)
      try {
        const res = await api.delete<CartResponse>(`/api/cart/items/${productId}`, { headers })
        setItems(res.data.items)
        setSubtotal(res.data.subtotal)
        setCurrency(res.data.currency)
        addToast('Removed from cart.', 'info', 2200)
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? 'Unable to remove item.'
        addToast(msg, 'error')
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [addToast, headers],
  )

  const checkout = useCallback(
    async (payload: { name: string; email: string; address: string }) => {
      setIsLoading(true)
      try {
        const res = await api.post<CheckoutResponse>('/api/checkout', payload, { headers })
        addToast('Checkout successful!', 'success')
        setItems([])
        setSubtotal(0)
        return res.data
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? 'Checkout failed.'
        addToast(msg, 'error')
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [addToast, headers],
  )

  const getProduct = useCallback(async (id: number) => {
    const res = await api.get<{ data: Product }>(`/api/products/${id}`)
    return res.data.data
  }, [])

  const value = useMemo<CartContextValue>(
    () => ({
      cartToken,
      items,
      subtotal,
      currency,
      isLoading,
      cartCount,
      refreshCart,
      addItem,
      updateItem,
      removeItem,
      checkout,
      getProduct,
    }),
    [addItem, cartCount, checkout, currency, getProduct, headers, isLoading, items, refreshCart, subtotal, cartToken, removeItem, updateItem],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

