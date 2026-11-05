import { useRef } from "react";
import { formatPrice, type Product } from "./products";

type Props = {
  product: Product;
  onAdd: (product: Product, imgEl: HTMLImageElement) => void;
};

export function ProductTile({ product, onAdd }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <div>
      <div className="relative aspect-4/5 select-none overflow-hidden bg-[#ebebeb]">
        {/* shadow stays on the tile when the item lifts off */}
        <div className="absolute bottom-[22%] left-1/2 h-6 w-3/5 -translate-x-1/2 rounded-full bg-black/25 blur-xl" />
        <img
          ref={imgRef}
          data-item
          src={product.image}
          alt={product.name}
          draggable={false}
          className="absolute inset-0 m-auto w-4/5 touch-none"
          onDoubleClick={() => imgRef.current && onAdd(product, imgRef.current)}
        />
      </div>
      <p className="mt-2 text-[10px] text-neutral-500">{product.name}</p>
      <p className="text-[10px] font-medium">{formatPrice(product.price)}</p>
    </div>
  );
}
