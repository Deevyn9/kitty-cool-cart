import { useRef } from "react";
import { formatPrice, type Product } from "./products";
import { usePriceFollow } from "./usePriceFollow";
type Props = {
  product: Product;
  onAdd: (product: Product, imgEl: HTMLImageElement) => void;
};

export function ProductTile({ product, onAdd }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  usePriceFollow(tileRef, formatPrice(product.price));

  return (
    <div>
      <div
        ref={tileRef}
        className="relative aspect-square select-none overflow-hidden bg-[#f6f6f6] group cursor-pointer"
      >
        <img
          ref={imgRef}
          data-item
          src={product.image}
          alt={product.name}
          draggable={false}
          className="absolute group-hover:scale-110 transition-transform inset-0 m-auto w-2/5 touch-none"
          onClick={() => imgRef.current && onAdd(product, imgRef.current)}
        />
        <p className="relative bottom-[-93%] left-[3%] text-[14px] text-black font-semibold">
          {product.name}
        </p>
      </div>
      {/* <p className="text-[12px] font-medium">{formatPrice(product.price)}</p> */}
    </div>
  );
}
