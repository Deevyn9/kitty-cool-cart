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
        data-flip
        className="relative isolate aspect-square select-none overflow-hidden bg-[#f6f6f6] group cursor-pointer"
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
        <div className="relative bottom-[-85%] left-[4%] md:bottom-[-91%] md:left-[3%] ">
          <p className="text-[14px] text-black font-semibold">{product.name}</p>
          <p className="text-[12px] font-semibold md:hidden">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </div>
  );
}
