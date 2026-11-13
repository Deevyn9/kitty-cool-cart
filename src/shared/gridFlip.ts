import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

let state: Flip.FlipState | null = null;

// tiles and the heading both glide when the layout changes
export const captureGridState = () => {
  state = Flip.getState("[data-tile], [data-flip]");
};

export const consumeGridState = () => {
  const s = state;
  state = null;
  return s;
};