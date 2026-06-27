import { transition } from "./tokens";

export const navShrink = {
  expanded: { paddingTop: 16, paddingBottom: 16 },
  shrunk: { paddingTop: 8, paddingBottom: 8 },
};

export const navShrinkTransition = transition.fast;

export const navLogoScale = {
  expanded: { scale: 1 },
  shrunk: { scale: 0.95 },
};

export const mobileSheet = {
  initial: { opacity: 0, y: -12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const mobileBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const mobileSheetTransition = transition.fast;
