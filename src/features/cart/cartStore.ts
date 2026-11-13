import { create } from 'zustand'
import type { Product } from '../catalog/products'

export type CartItem = { product: Product; qty: number }
type LastAdded = { id: string; nonce: number; isNew: boolean }

type CartState = {
  items: CartItem[]
  isOpen: boolean
  lastAdded: LastAdded | null
  add: (product: Product) => void
  remove: (id: string) => void
  toggle: () => void
}

let nonce = 0

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isOpen: false,
  lastAdded: null,
  // adding never opens the cart, only the button does
  add: (product) =>
    set((s) => {
      const existing = s.items.find((i) => i.product.id === product.id)
      const items = existing
        ? s.items.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i))
        : [{ product, qty: 1 }, ...s.items]
      return { items, lastAdded: { id: product.id, nonce: ++nonce, isNew: !existing } }
    }),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.product.id !== id) })),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}))

export const selectCount = (s: CartState) => s.items.reduce((n, i) => n + i.qty, 0)
export const selectTotal = (s: CartState) =>
  s.items.reduce((n, i) => n + i.qty * i.product.price, 0)