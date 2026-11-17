import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";

type Options = {
  onClose: () => void;
  threshold?: number; // fraction of the drawer height to drag past before it closes
};

export function useSheetDrag(
  panelRef: RefObject<HTMLElement | null>,
  handleRef: RefObject<HTMLElement | null>,
  { onClose, threshold = 0.3 }: Options,
) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const panel = panelRef.current;
    const handle = handleRef.current;
    if (!panel || !handle) return;

    let active = false;
    let startY = 0;
    let startT = 0;
    let dy = 0;

    const snapBack = () =>
      gsap.to(panel, { y: 0, duration: 0.3, ease: "power3.out" });

    const down = (e: PointerEvent) => {
      active = true;
      startY = e.clientY;
      startT = performance.now();
      dy = 0;
      handle.setPointerCapture(e.pointerId);
      gsap.killTweensOf(panel, "y");
    };

    const move = (e: PointerEvent) => {
      if (!active) return;
      dy = Math.max(0, e.clientY - startY); // downward only
      gsap.set(panel, { y: dy });
    };

    const up = () => {
      if (!active) return;
      active = false;
      const dt = Math.max(performance.now() - startT, 1);
      const h = panel.offsetHeight;
      const velocity = dy / dt; // px per ms

      if (dy < 6 && dt < 300) {
        onCloseRef.current(); // a tap on the handle
        return;
      }
      if (dy > h * threshold || (dy > 24 && velocity > 0.5)) {
        gsap.to(panel, {
          y: h,
          duration: 0.25,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(panel, { y: 0, yPercent: 100 }); // park it offscreen, ready to reopen
            onCloseRef.current();
          },
        });
      } else {
        snapBack();
      }
    };

    const cancel = () => {
      if (!active) return;
      active = false;
      snapBack();
    };

    handle.addEventListener("pointerdown", down);
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", cancel);
    return () => {
      handle.removeEventListener("pointerdown", down);
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", cancel);
    };
  }, [panelRef, handleRef, threshold]);
}