import { CatalogGrid } from "./features/catalog/CatalogGrid";
import { CartButton } from "./features/cart/CartButton";
import { CartWidget } from "./features/cart/CartWidget";
import { useCartStore } from "./features/cart/cartStore";

export default function App() {
  const isOpen = useCartStore((s) => s.isOpen);

  return (
    <div
      className={`min-h-screen bg-white text-black ${
        isOpen ? "pb-[45dvh] lg:pb-0 lg:pr-95" : ""
      }`}
    >
      <header className="top-0 z-30 bg-white px-6 py-5">
        <span className="text-xl font-bold tracking-tight">IKE</span>
      </header>
      <main className="px-6 pb-24">
        <CatalogGrid />
      </main>
      <CartButton />
      <CartWidget />
    </div>
  );
}
