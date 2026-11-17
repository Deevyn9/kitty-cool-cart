import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CartRow } from "./CartRow";
import { CartTotal } from "./CartTotal";
import { selectTotal, useCartStore } from "./cartStore";
import { captureGridState } from "../../shared/gridFlip";
import { useSheetDrag } from "./useSheetDrag";

gsap.registerPlugin(useGSAP);

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
      <p className="px-5 py-8 text-center text-sm text-black">
        Your cart is empty
      </p>
    </div>
  );
}

export function CartWidget() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const lastAdded = useCartStore((s) => s.lastAdded);
  const total = useCartStore(selectTotal);
  const nonce = lastAdded?.nonce;

  const panelRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const first = useRef(true);
  const toggle = useCartStore((s) => s.toggle);
  const handleRef = useRef<HTMLDivElement>(null);

  useSheetDrag(panelRef, handleRef, {
    onClose: () => {
      captureGridState(); // same as the cart button, so the grid glides back
      toggle();
    },
  });

  // 1) an add while the panel is open
  useGSAP(
    () => {
      if (!lastAdded || !useCartStore.getState().isOpen) return;
      const list = listRef.current;
      const row = list?.querySelector<HTMLElement>(
        `[data-row="${lastAdded.id}"]`,
      );
      if (!list || !row) return;

      if (lastAdded.isNew) {
        list.scrollTo({ top: 0, behavior: "smooth" });
        gsap.from(row, {
          x: 48,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
        });
      } else {
        gsap.fromTo(
          row.querySelector("[data-qty]"),
          { yPercent: -80, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.35, ease: "back.out(2)" },
        );
        gsap.fromTo(
          row,
          { backgroundColor: "rgba(0,0,0,0.06)" },
          { backgroundColor: "rgba(0,0,0,0)", duration: 0.7 },
        );
        row.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    },
    { dependencies: [nonce] },
  );

  // 2) open / close: from the right on lg+, up from the bottom below
  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      const hidden = {
        xPercent: desktop ? 100 : 0,
        yPercent: desktop ? 0 : 100,
      };
      const shown = { xPercent: 0, yPercent: 0 };

      if (first.current) {
        gsap.set(panel, hidden); // park it offscreen before first paint
        first.current = false;
        return;
      }

      gsap.to(panel, {
        ...(isOpen ? shown : hidden),
        duration: isOpen ? 0.55 : 0.4,
        ease: isOpen ? "power3.out" : "power3.inOut",
        overwrite: "auto",
      });

      // rows added while closed ripple in as the panel arrives
      if (isOpen) {
        gsap.from(panel.querySelectorAll("[data-row]"), {
          x: desktop ? 32 : 0,
          y: desktop ? 0 : 16,
          opacity: 0,
          duration: 0.45,
          stagger: 0.05,
          delay: 0.15,
          ease: "power3.out",
        });
      }
    },
    { dependencies: [isOpen] },
  );

  return (
    <aside
      ref={panelRef}
      inert={!isOpen}
      aria-label="Cart"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[45dvh] flex-col rounded-t-lg border-t border-black/10 bg-white lg:inset-x-auto lg:bottom-auto lg:right-0 lg:top-0 lg:h-dvh lg:w-95 lg:rounded-none lg:border-l lg:border-t-0"
    >
      {/* drawer handle below lg, header space for the fixed cart button on lg */}
      <div
        ref={handleRef}
        role="button"
        aria-label="Close cart"
        className="flex h-10 shrink-0 cursor-grab touch-none items-center justify-center lg:hidden"
      >
        <div className="h-1 w-10 rounded-full bg-black/15" />
      </div>
      <div className="hidden h-18 shrink-0 border-b border-black/5 lg:block" />

      <ul ref={listRef} className="min-h-0 flex-1 overflow-y-auto">
        {items.map((item) => (
          <CartRow key={item.product.id} item={item} />
        ))}
      </ul>
      <EmptyState show={items.length === 0} />

      <div className="flex shrink-0 items-center justify-between border-t border-black/5 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
        <span className="text-lg font-semibold">Total:</span>
        <CartTotal value={total} />
      </div>
    </aside>
  );
}
