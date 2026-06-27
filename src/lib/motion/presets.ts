import { transition } from "./tokens";
import { fadeUp } from "./variants";

/** Allowed motion presets — TENEGTA Experience v1 */
export const hoverScale = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  transition: transition.fast,
} as const;

export const successSpring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 22,
};

export const fadeUpPreset = {
  ...fadeUp,
  transition: transition.normal,
};

export const pulseGlow = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [0.7, 1, 0.7],
    transition: { repeat: Infinity, duration: 2, ease: transition.normal.ease },
  },
};

export { fadeUp, transition };
