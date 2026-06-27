/** Canonical motion durations — TENEGTA Experience v1 */
export const MOTION = {
  fast: 0.18,
  normal: 0.35,
  slow: 0.6,
} as const;

export type MotionDuration = keyof typeof MOTION;
