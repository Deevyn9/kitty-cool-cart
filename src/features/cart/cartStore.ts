import { create } from 'zustand'
import type { Product } from '../catalog/products'

export type CartItem = { product: Product; qty: number }
type LastAdded = { id: string; nonce: number; isNew: boolean }

type CartState = {
  items: CartItem[]
  isOpen: boolean
  openedManually: boolean
  lastAdded: LastAdded | null
  add: (product: Product) => void
  remove: (id: string) => void
  toggle: () => void
  autoClose: () => void
}

let nonce = 0

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isOpen: false,
  openedManually: false,
  lastAdded: null,
  add: (product) =>
    set((s) => {
      const existing = s.items.find((i) => i.product.id === product.id)
      const items = existing
        ? s.items.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i))
        : [{ product, qty: 1 }, ...s.items]
      return {
        items,
        isOpen: true,
        // already open? keep whatever mode it was in. closed? it's an auto open
        openedManually: s.isOpen ? s.openedManually : false,
        lastAdded: { id: product.id, nonce: ++nonce, isNew: !existing },
      }
    }),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.product.id !== id) })),
  toggle: () =>
    set((s) =>
      s.isOpen ? { isOpen: false, openedManually: false } : { isOpen: true, openedManually: true },
    ),
  // only closes if the cart was opened by an add, never a manual open
  autoClose: () => set((s) => (s.isOpen && !s.openedManually ? { isOpen: false } : s)),
}))

export const selectCount = (s: CartState) => s.items.reduce((n, i) => n + i.qty, 0)
export const selectTotal = (s: CartState) =>
  s.items.reduce((n, i) => n + i.qty * i.product.price, 0)