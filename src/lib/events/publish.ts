import { getRedis, getRedisSubscriber } from "@/lib/redis";
import type { RedemptionLivePayload } from "@/lib/events/publish-types";

export type { RedemptionLivePayload };
export { getRedisSubscriber };

const CHANNEL = "spark:redemption:new";

export function getRedemptionChannel() {
  return CHANNEL;
}

export async function publishRedemption(payload: RedemptionLivePayload) {
  const redis = await getRedis();
  if (!redis) return;

  try {
    await redis.publish(CHANNEL, JSON.stringify(payload));
  } catch {
    // non-blocking
  }
}
