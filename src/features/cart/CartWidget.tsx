import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CartButton } from "./CartButton";
import { CartRow } from "./CartRow";
import { CartTotal } from "./CartTotal";
import { selectTotal, useCartStore } from "./cartStore";

gsap.registerPlugin(useGSAP);

const AUTO_CLOSE_MS = 5000;

function EmptyState({ show }: { show: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useGSAP(
    () => {
      gsap.to(ref.current, {
        height: show ? "auto" : 0,
        opacity: show ? 1 : 0,
        duration: mounted.current ? 0.4 : 0, // no animation on first paint
        ease: "power2.out",
        overwrite: "auto",
      });
      mounted.current = true;
    },
    { dependencies: [show] },
  );

  return (
    <div
      ref={ref}
      className="overflow-hidden"
      style={{ height: 0, opacity: 0 }}
    >
      <p className="px-5 py-8 text-center text-xs text-neutral-500">
        Your cart is empty
      </p>
    </div>
  );
}

export function CartWidget() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const openedManually = useCartStore((s) => s.openedManually);
  const lastAdded = useCartStore((s) => s.lastAdded);
  const autoClose = useCartStore((s) => s.autoClose);
  const total = useCartStore(selectTotal);
  const nonce = lastAdded?.nonce;

  const bgRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const prevOpen = useRef(false);

  // debounced auto-close: every add/remove restarts the 5s window,
  // and hovering the panel holds it open (hover devices only)
  useEffect(() => {
    if (!isOpen || openedManually) return;
    const canHover = window.matchMedia("(hover: hover)").matches;
    let deadline = Date.now() + AUTO_CLOSE_MS;
    const id = window.setInterval(() => {
      if (canHover && bodyRef.current?.matches(":hover")) {
        deadline = Date.now() + AUTO_CLOSE_MS;
      } else if (Date.now() >= deadline) {
        autoClose();
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [isOpen, openedManually, nonce, items.length, autoClose]);

  // 1) row animation (declared first so prevOpen still holds the old value)
  useGSAP(
    () => {
      if (!lastAdded) return;
      const row = listRef.current?.querySelector<HTMLElement>(
        `[data-row="${lastAdded.id}"]`,
      );
      if (!row) return;

      const delay = prevOpen.current ? 0 : 0.35;

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
    { dependencies: [nonce] },
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
      <div
        ref={bgRef}
        className="absolute inset-0 rounded-lg border border-black/10 bg-white/85 opacity-0 backdrop-blur-md"
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
          <EmptyState show={items.length === 0} />
          <div className="flex items-center justify-between border-t border-black/5 px-5 py-5">
            <span className="text-lg font-semibold">Total:</span>
            <CartTotal value={total} />
          </div>
        </div>
      </div>
    </div>
  );
}
