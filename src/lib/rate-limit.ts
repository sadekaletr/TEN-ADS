import {
  RATE_LIMITS,
  checkRateLimitSync,
  rateLimitKey,
  type RateLimitConfig,
} from "@/lib/rate-limit-memory";
import { getRedis, isRedisConfigured } from "@/lib/redis";

export { RATE_LIMITS, rateLimitKey };
export type { RateLimitConfig };

const isProduction = process.env.NODE_ENV === "production";

function shouldFailClosed(): boolean {
  return isProduction;
}

export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<boolean> {
  if (!isRedisConfigured()) {
    if (shouldFailClosed()) {
      console.error("[rate-limit] REDIS_URL missing in production");
      return true;
    }
    return checkRateLimitSync(key, config);
  }

  const redis = await getRedis();
  if (!redis) {
    if (shouldFailClosed()) {
      console.error("[rate-limit] Redis unavailable in production");
      return true;
    }
    return checkRateLimitSync(key, config);
  }

  try {
    const windowSec = Math.ceil(config.windowMs / 1000);
    const redisKey = `rl:${key}`;
    const count = await redis.incr(redisKey);
    if (count === 1) {
      await redis.expire(redisKey, windowSec);
    }
    return count > config.limit;
  } catch (err) {
    console.error("[rate-limit] Redis error:", err);
    if (shouldFailClosed()) return true;
    return checkRateLimitSync(key, config);
  }
}
