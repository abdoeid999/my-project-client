export type Product = {
  id: number
  name: string
  slug: string
  description?: string | null
  price: number
  image_url: string
  featured: boolean
  category?: string | null
  stock: number
}

export type CartLine = {
  product_id: number
  quantity: number
  product: Pick<Product, 'id' | 'name' | 'slug' | 'price' | 'image_url' | 'category' | 'stock'>
  line_total: number
}

export type CartResponse = {
  items: CartLine[]
  subtotal: number
  currency: string
}

export type CheckoutResponse = {
  order_id: number
  order_number: string
  message: string
  total: number
}

