import type { default as Redis } from "ioredis";

let redisClient: Redis | null = null;
let redisInitAttempted = false;
let redisAvailable = false;

export function isRedisConfigured(): boolean {
  return Boolean(process.env.REDIS_URL);
}

export function isRedisAvailable(): boolean {
  return redisAvailable;
}

export async function getRedis(): Promise<Redis | null> {
  if (redisInitAttempted) return redisClient;
  redisInitAttempted = true;

  const url = process.env.REDIS_URL;
  if (!url) {
    if (process.env.NODE_ENV === "production") {
      console.error("[redis] REDIS_URL is required in production");
    }
    return null;
  }

  try {
    const RedisCtor = (await import("ioredis")).default;
    redisClient = new RedisCtor(url, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    });
    await redisClient.connect();
    redisAvailable = true;
    return redisClient;
  } catch (err) {
    console.error("[redis] connection failed:", err);
    redisClient = null;
    redisAvailable = false;
    return null;
  }
}

export async function getRedisSubscriber(): Promise<Redis | null> {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  try {
    const RedisCtor = (await import("ioredis")).default;
    const sub = new RedisCtor(url, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    });
    await sub.connect();
    return sub;
  } catch {
    return null;
  }
}
