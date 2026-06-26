export const duration = {
  instant: 0.12,
  fast: 0.22,
  normal: 0.4,
  slow: 0.7,
  cinematic: 1.2,
} as const;

export const durationMs = {
  instant: 120,
  fast: 220,
  normal: 400,
  slow: 700,
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
