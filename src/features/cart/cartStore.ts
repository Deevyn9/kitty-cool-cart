import { create } from 'zustand'
import type { Product } from '../catalog/products'

export type CartLine = { lineId: string; product: Product }

type CartState = {
  lines: CartLine[]
  isOpen: boolean
  add: (product: Product) => string
  open: () => void
  close: () => void
}

export const useCartStore = create<CartState>((set) => ({
  lines: [],
  isOpen: false,
  // every add is a fresh line, so each one can animate in on its own
  add: (product) => {
    const lineId = crypto.randomUUID()
    set((s) => ({ lines: [...s.lines, { lineId, product }] }))
    return lineId
  },
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))