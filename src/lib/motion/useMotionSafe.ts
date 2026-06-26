"use client";

import { useReducedMotion } from "framer-motion";

/** Returns false when user prefers reduced motion — use to skip Framer animations. */
export function useMotionSafe(): boolean {
  return !useReducedMotion();
}
