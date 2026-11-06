import { CatalogGrid } from "./features/catalog/CatalogGrid";
import { CartWidget } from "./features/cart/CartWidget";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-30 bg-white px-6 py-5">
        <span className="text-xl font-semibold tracking-tight">propro</span>
      </header>
      <main className="px-6 pb-24">
        <CatalogGrid />
      </main>
      <CartWidget />
    </div>
  );
}
