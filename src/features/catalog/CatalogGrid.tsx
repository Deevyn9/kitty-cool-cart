import { useCartStore } from "../cart/cartStore";
import { ProductTile } from "./ProductTile";
import { products, type Product } from "./products";
import { flyToCart } from "../cart/flyToCart";
import { useLayoutEffect } from "react";
import { Flip } from "gsap/Flip";
import { consumeGridState } from "../../shared/gridFlip";

export function CatalogGrid() {
  const add = useCartStore((s) => s.add);

  const handleAdd = (product: Product, imgEl: HTMLImageElement) => {
    flyToCart(imgEl, { onLand: () => add(product) });
  };

  const isOpen = useCartStore((s) => s.isOpen);

  useLayoutEffect(() => {
    const state = consumeGridState();
    if (state) Flip.from(state, { duration: 0.6, ease: "power3.inOut" });
  }, [isOpen]);

  return (
    <section>
      <h1 data-flip className="text-center mb-6 md:text-[100px] font-semibold">
        CATALOG
        <span className="relative md:-top-14 md:text-[30px] font-semibold">
          ({products.length})
        </span>
      </h1>
      <div
        className={`grid grid-cols-1 gap-3 md:grid-cols-2 ${
          isOpen ? "lg:grid-cols-2" : "lg:grid-cols-3"
        }`}
      >
        {products.map((p) => (
          <ProductTile key={p.id} product={p} onAdd={handleAdd} />
        ))}
      </div>
    </section>
  );
}
