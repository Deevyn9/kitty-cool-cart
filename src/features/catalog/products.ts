export type Product = {
  id: string
  name: string
  price: number
  image: string
}

export const products: Product[] = [
  { id: 'emeka-dining-chair', name: 'Emeka Dining Chair', price: 56800, image: '/products/4.png' },
  { id: 'ngozi-side-table', name: 'Ngozi Side Table', price: 38500, image: '/products/5.png' },
  { id: 'hadiza-armchair', name: 'Hadiza Armchair', price: 47200, image: '/products/6.png' },
  { id: 'ola-nightstand', name: 'Ola Nightstand', price: 64500, image: '/products/1.png' },
  { id: 'adaeze-arc-lamp', name: 'Adaeze Arc Lamp', price: 148000, image: '/products/2.png' },
  { id: 'amara-floor-lamp', name: 'Amara Floor Lamp', price: 72000, image: '/products/3.png' },
]

export const formatPrice = (n: number) => `₦${n.toLocaleString('en-NG')}`