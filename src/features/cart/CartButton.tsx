import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { registerCartTarget } from "./cartTarget";
import { useCartStore } from "./cartStore";

export function CartButton() {
  const count = useCartStore((s) => s.lines.length);
  const countRef = useRef<HTMLSpanElement>(null);
  const first = useRef(true);

  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      gsap.fromTo(
        countRef.current,
        { yPercent: -70, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.3, ease: "back.out(2)" },
      );
    },
    { dependencies: [count] },
  );

  return (
    <button
      ref={registerCartTarget}
      className="flex items-center gap-1 text-[11px] uppercase tracking-wide"
    >
      Cart (
      <span ref={countRef} className="inline-block">
        {count}
      </span>
      )
    </button>
  );
}
