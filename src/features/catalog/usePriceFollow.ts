import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'

type Options = {
  lag?: number // seconds the label takes to catch up with the cursor
}

export function usePriceFollow(
  tileRef: RefObject<HTMLElement | null>,
  label: string,
  { lag = 0.35 }: Options = {},
) {
  useEffect(() => {
    const tile = tileRef.current
    // no hover on touch, so nothing to follow there
    if (!tile) return

    const el = document.createElement('span')
    el.textContent = label
    el.className =
  'pointer-events-none absolute left-0 top-0 z-10 select-none whitespace-nowrap text-[40px] font-medium tracking-tight text-white mix-blend-difference'
    tile.appendChild(el)

    // centred on the cursor, hidden until the pointer enters
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.4 })

    const moveX = gsap.quickTo(el, 'x', { duration: lag, ease: 'power3.out' })
    const moveY = gsap.quickTo(el, 'y', { duration: lag, ease: 'power3.out' })

    const local = (e: PointerEvent) => {
      const r = tile.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    const onEnter = (e: PointerEvent) => {
       if (e.pointerType !== 'mouse') return
  const { x, y } = local(e)
      gsap.set(el, { x, y }) // appear at the cursor, don't fly in from the corner
      gsap.to(el, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2)', overwrite: 'auto' })
    }
    const onMove = (e: PointerEvent) => {
       if (e.pointerType !== 'mouse') return
  const { x, y } = local(e)
      moveX(x)
      moveY(y)
    }
    const onLeave = () => {
      gsap.to(el, { opacity: 0, scale: 0.4, duration: 0.2, ease: 'power2.in', overwrite: 'auto' })
    }

    tile.addEventListener('pointerenter', onEnter)
    tile.addEventListener('pointermove', onMove)
    tile.addEventListener('pointerleave', onLeave)
    return () => {
      tile.removeEventListener('pointerenter', onEnter)
      tile.removeEventListener('pointermove', onMove)
      tile.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(el)
      el.remove()
    }
  }, [tileRef, label, lag])
}