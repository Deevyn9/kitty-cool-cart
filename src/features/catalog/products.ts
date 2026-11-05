export type Product = {
    id: string
    name: string
    price: number
    image: string
}

export const products: Product[] = [
  { id: 'node-armchair', name: 'Node Armchair', price: 22428, image: '/products/1.png' },
  { id: 'node-sofa', name: 'Node sofa', price: 32634, image: '/products/2.png' },
  { id: 'qb-sofa', name: 'QB sofa', price: 40824, image: '/products/3.png' },
  { id: 'sofa-arc', name: 'Sofa ARC', price: 23982, image: '/products/4.png' },
  { id: 'sofa-b11', name: 'Sofa B11', price: 51702, image: '/products/5.png' },
  { id: 'armchair-arc', name: 'Armchair ARC', price: 18606, image: '/products/6.png' },
]

export const formatPrice = (n: number) => `₦${n.toLocaleString('en-NG')}`