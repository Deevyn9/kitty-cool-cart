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
      <h1 className="text-center mb-6 text-[100px] font-semibold">
        CATALOG
        <span className="relative -top-14 text-[30px] font-semibold">
          ({products.length})
        </span>
      </h1>
      <div className="grid grid-cols-3 gap-x-3 gap-y-3">
        {products.map((p) => (
          <ProductTile key={p.id} product={p} onAdd={handleAdd} />
        ))}
      </div>
    </section>
  );
}
