let el: HTMLElement | null = null

export const registerCartTarget = (node: HTMLElement | null) => {
  el = node
}
export const getCartRect = () => el?.getBoundingClientRect() ?? null