import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { registerCartTarget } from "./cartTarget";
import { selectCount, useCartStore } from "./cartStore";
import { captureGridState } from "../../shared/gridFlip";

export function CartButton() {
  const count = useCartStore(selectCount);
  const toggle = useCartStore((s) => s.toggle);
  const isOpen = useCartStore((s) => s.isOpen);
  const countRef = useRef<HTMLSpanElement>(null);
  const first = useRef(true);

  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      if (!countRef.current) return;
      gsap.fromTo(
        countRef.current,
        { yPercent: -70, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.3, ease: "back.out(2)" },
      );
    },
    { dependencies: [count] },
  );

  // add above the return
  const handleClick = () => {
    captureGridState();
    toggle();
  };

  return (
    <button
      ref={registerCartTarget}
      aria-label="Toggle cart"
      aria-expanded={isOpen}
      onClick={handleClick}
      className="fixed right-4 top-4 z-50 grid h-10 w-10 cursor-pointer place-items-center"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 8h14l-1 12H6L5 8Z" />
        <path d="M9 8V7a3 3 0 0 1 6 0v1" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-px -top-px grid h-5 min-w-5 place-items-center overflow-hidden rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
          <span ref={countRef} className="inline-block">
            {count}
          </span>
        </span>
      )}
    </button>
  );
}
