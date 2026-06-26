import { transition } from "./tokens";

export const pulseGlow = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.6, 1, 0.6],
    transition: { repeat: Infinity, duration: 2, ease: transition.normal.ease },
  },
};

export const portalReveal = {
  initial: { opacity: 0, scale: 0.3 },
  animate: { opacity: 1, scale: 1 },
  transition: transition.cinematic,
};

export const junctionDot = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
  transition: transition.fast,
};

export const magneticHover = {
  rest: { x: 0, y: 0 },
  hover: (offset: { x: number; y: number }) => ({
    x: offset.x,
    y: offset.y,
    transition: transition.magnetic,
  }),
};
