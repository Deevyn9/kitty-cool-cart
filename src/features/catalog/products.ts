export type Product = {
    id: string
    name: string
    price: number
    image: string
}

export const products: Product[] = [
  { id: 'node-armchair', name: 'Node Armchair', price: 22428, image: '/products/node-armchair.png' },
  { id: 'node-sofa', name: 'Node sofa', price: 32634, image: '/products/node-sofa.png' },
  { id: 'qb-sofa', name: 'QB sofa', price: 40824, image: '/products/qb-sofa.png' },
  { id: 'sofa-arc', name: 'Sofa ARC', price: 23982, image: '/products/sofa-arc.png' },
  { id: 'sofa-b11', name: 'Sofa B11', price: 51702, image: '/products/sofa-b11.png' },
  { id: 'armchair-arc', name: 'Armchair ARC', price: 18606, image: '/products/armchair-arc.png' },
]

export const formatPrice = (n: number) => `₦${n.toLocaleString('en-NG')}`