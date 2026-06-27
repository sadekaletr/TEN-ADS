import { MOTION } from "@/styles/motion";

export { MOTION };

export const duration = {
  instant: 0.12,
  fast: MOTION.fast,
  normal: MOTION.normal,
  slow: MOTION.slow,
  cinematic: 1.2,
} as const;

export const durationMs = {
  instant: 120,
  fast: Math.round(MOTION.fast * 1000),
  normal: Math.round(MOTION.normal * 1000),
  slow: Math.round(MOTION.slow * 1000),
  cinematic: 1200,
} as const;

export const easeGold = [0.16, 1, 0.3, 1] as const;
export const easeSnap = [0.34, 1.2, 0.64, 1] as const;

export const stagger = {
  tight: 0.06,
  normal: 0.08,
  relaxed: 0.1,
} as const;

export const transition = {
  instant: { duration: duration.instant, ease: easeGold },
  fast: { duration: duration.fast, ease: easeGold },
  normal: { duration: duration.normal, ease: easeGold },
  slow: { duration: duration.slow, ease: easeGold },
  cinematic: { duration: duration.cinematic, ease: easeGold },
  magnetic: { duration: duration.fast, ease: easeSnap },
} as const;

export const cssTransition = {
  bar: `width ${durationMs.normal}ms cubic-bezier(0.16, 1, 0.3, 1)`,
  hover: `all ${durationMs.fast}ms cubic-bezier(0.16, 1, 0.3, 1)`,
} as const;

export const maxConcurrentParticles = 3;
