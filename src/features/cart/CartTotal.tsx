import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { formatPrice } from "../catalog/products";

export function CartTotal({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(0);

  useGSAP(
    () => {
      const proxy = { v: shown.current };
      gsap.to(proxy, {
        v: value,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
        onUpdate: () => {
          shown.current = proxy.v;
          if (ref.current)
            ref.current.textContent = formatPrice(Math.round(proxy.v));
        },
      });
    },
    { dependencies: [value] },
  );

  return (
    <span ref={ref} className="text-lg font-semibold">
      {formatPrice(0)}
    </span>
  );
}
