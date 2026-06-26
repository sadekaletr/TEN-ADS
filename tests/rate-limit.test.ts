import { describe, expect, it } from "vitest";
import {
  checkRateLimitSync,
  rateLimitKey,
  RATE_LIMITS,
} from "@/lib/rate-limit-memory";

describe("rate-limit", () => {
  it("builds namespaced keys", () => {
    expect(rateLimitKey("login", "1.2.3.4")).toBe("login:1.2.3.4");
  });

  it("allows requests under login limit", () => {
    const key = `login-test-${Date.now()}`;
    const { limit } = RATE_LIMITS.login;
    for (let i = 0; i < limit; i++) {
      expect(checkRateLimitSync(key, RATE_LIMITS.login)).toBe(false);
    }
    expect(checkRateLimitSync(key, RATE_LIMITS.login)).toBe(true);
  });

  it("blocks redeem after limit", () => {
    const key = `redeem-test-${Date.now()}`;
    const cfg = { limit: 3, windowMs: 60_000 };
    expect(checkRateLimitSync(key, cfg)).toBe(false);
    expect(checkRateLimitSync(key, cfg)).toBe(false);
    expect(checkRateLimitSync(key, cfg)).toBe(false);
    expect(checkRateLimitSync(key, cfg)).toBe(true);
  });
});
