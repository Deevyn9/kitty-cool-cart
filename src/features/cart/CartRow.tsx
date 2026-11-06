import { useRef } from "react";
import gsap from "gsap";
import { formatPrice } from "../catalog/products";
import { useCartStore, type CartItem } from "./cartStore";

export function CartRow({ item }: { item: CartItem }) {
  const rowRef = useRef<HTMLLIElement>(null);
  const remove = useCartStore((s) => s.remove);
  const { product, qty } = item;

  const handleRemove = () => {
    gsap.to(rowRef.current, {
      x: 40,
      opacity: 0,
      height: 0,
      paddingTop: 0,
      paddingBottom: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => remove(product.id),
    });
  };

  return (
    <li
      ref={rowRef}
      data-row={product.id}
      className="flex items-center gap-4 overflow-hidden px-5 py-3"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-[#ebebeb]">
        <img
          src={product.image}
          alt={product.name}
          draggable={false}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="mt-1 flex items-center text-xs text-neutral-500">
          {formatPrice(product.price)}
          <span data-qty className="ml-3 inline-block">
            x{qty}
          </span>
        </p>
      </div>
      <button
        onClick={handleRemove}
        aria-label={`Remove ${product.name}`}
        className="grid h-6 w-6 place-items-center text-neutral-400 transition-colors hover:text-black"
      >
        ✕
      </button>
    </li>
  );
}
