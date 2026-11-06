import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CartButton } from "./CartButton";
import { CartRow } from "./CartRow";
import { CartTotal } from "./CartTotal";
import { selectTotal, useCartStore } from "./cartStore";

gsap.registerPlugin(useGSAP);

export function CartWidget() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const lastAdded = useCartStore((s) => s.lastAdded);
  const total = useCartStore(selectTotal);

  const bgRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const prevOpen = useRef(false);

  // 1) row animation. Declared first so prevOpen still holds the old value
  //    when an add also opened the panel in the same commit.
  useGSAP(
    () => {
      if (!lastAdded) return;
      const row = listRef.current?.querySelector<HTMLElement>(
        `[data-row="${lastAdded.id}"]`,
      );
      if (!row) return;

      const delay = prevOpen.current ? 0 : 0.35; // wait for the panel to open

      if (lastAdded.isNew) {
        gsap.from(row, {
          x: 48,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
          delay,
        });
      } else {
        const qty = row.querySelector("[data-qty]");
        gsap.fromTo(
          qty,
          { yPercent: -80, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.35,
            ease: "back.out(2)",
            delay,
          },
        );
        gsap.fromTo(
          row,
          { backgroundColor: "rgba(0,0,0,0.06)" },
          { backgroundColor: "rgba(0,0,0,0)", duration: 0.7, delay },
        );
        if (prevOpen.current)
          row.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    },
    { dependencies: [lastAdded?.nonce] },
  );

  // 2) panel open / close
  useGSAP(
    () => {
      const body = bodyRef.current;
      const bg = bgRef.current;
      if (!body || !bg) return;

      gsap.to(bg, {
        opacity: isOpen ? 1 : 0,
        duration: 0.3,
        overwrite: "auto",
      });
      gsap.to(body, {
        height: isOpen ? "auto" : 0,
        duration: isOpen ? 0.5 : 0.35,
        ease: isOpen ? "power3.out" : "power3.inOut",
        overwrite: "auto",
      });
      prevOpen.current = isOpen;
    },
    { dependencies: [isOpen] },
  );

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-40 w-[min(360px,calc(100vw-2rem))]">
      {/* card background fades in behind the header + body */}
      <div
        ref={bgRef}
        className="absolute inset-0 rounded-2xl border border-black/5 bg-white/85 opacity-0 shadow-xl backdrop-blur-md"
      />

      <div className="relative flex h-14 items-center justify-end px-4">
        <CartButton />
      </div>

      <div
        ref={bodyRef}
        className="pointer-events-auto relative overflow-hidden"
        style={{ height: 0 }}
      >
        <div className="border-t border-black/5">
          <ul ref={listRef} className="max-h-[55vh] overflow-y-auto">
            {items.map((item) => (
              <CartRow key={item.product.id} item={item} />
            ))}
          </ul>
          {items.length === 0 && (
            <p className="px-5 py-8 text-center text-xs text-neutral-500">
              Your cart is empty
            </p>
          )}
          <div className="flex items-center justify-between border-t border-black/5 px-5 py-5">
            <span className="text-lg font-semibold">Total:</span>
            <CartTotal value={total} />
          </div>
        </div>
      </div>
    </div>
  );
}
