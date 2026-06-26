export type RateLimitConfig = {
  limit: number;
  windowMs: number;
};

const memoryStore = new Map<string, number[]>();

export const RATE_LIMITS = {
  track: { limit: 60, windowMs: 60_000 },
  login: { limit: 10, windowMs: 15 * 60_000 },
  redeem: { limit: 30, windowMs: 60_000 },
} as const;

export function rateLimitKey(prefix: string, ip: string): string {
  return `${prefix}:${ip}`;
}

export function checkRateLimitSync(
  key: string,
  config: RateLimitConfig
): boolean {
  const now = Date.now();
  const hits = (memoryStore.get(key) ?? []).filter(
    (t) => now - t < config.windowMs
  );
  if (hits.length >= config.limit) return true;
  hits.push(now);
  memoryStore.set(key, hits);
  return false;
}
