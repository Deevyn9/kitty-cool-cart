import gsap from 'gsap'
import { getCartRect } from './cartTarget'

type Options = { onLand?: () => void }

export function flyToCart(imgEl: HTMLImageElement, { onLand }: Options = {}) {
  const target = getCartRect()
  if (!target) {
    onLand?.()
    return
  }

  const from = imgEl.getBoundingClientRect()

  // clone sits exactly over the original, in viewport coordinates
  const clone = imgEl.cloneNode(true) as HTMLImageElement
  clone.removeAttribute('data-item')
  clone.className = ''
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    margin: '0',
    zIndex: '9999',
    pointerEvents: 'none',
    transformOrigin: 'center center',
  })
  document.body.appendChild(clone)

  // distance from item centre to cart centre
  const dx = target.left + target.width / 2 - (from.left + from.width / 2)
  const dy = target.top + target.height / 2 - (from.top + from.height / 2)

  // the original ghosts out and recovers, so the tile never looks empty for long
  gsap.fromTo(imgEl, { opacity: 0.2 }, { opacity: 1, duration: 0.5, overwrite: true })

  gsap
    .timeline({
      onComplete: () => {
        clone.remove()
        onLand?.()
      },
    })
    // leg 1: dip down and a little toward the cart
    .to(clone, { x: dx * 0.3, y: 70, scale: 0.55, duration: 0.3, ease: 'power2.out' })
    // leg 2: swoop up into the cart
    .to(clone, { x: dx, y: dy, scale: 0.08, duration: 0.55, ease: 'power2.in' })
}