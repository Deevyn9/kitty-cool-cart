import { useCartStore } from "../cart/cartStore";
import { ProductTile } from "./ProductTitle";
import { products, type Product } from "./products";
import { flyToCart } from "../cart/flyToCart";

export function CatalogGrid() {
  const add = useCartStore((s) => s.add);

  const handleAdd = (product: Product, imgEl: HTMLImageElement) => {
    flyToCart(imgEl, { onLand: () => add(product) });
  };

  return (
    <section>
      <h1 className="mb-6 text-lg font-semibold">
        CATALOG{" "}
        <span className="ml-1 text-[10px] font-normal text-neutral-500">
          ({products.length} items)
        </span>
      </h1>
      <div className="grid grid-cols-2 gap-x-2 gap-y-6">
        {products.map((p) => (
          <ProductTile key={p.id} product={p} onAdd={handleAdd} />
        ))}
      </div>
    </section>
  );
}
