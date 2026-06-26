"use client";

import type { EventType } from "@prisma/client";

export async function trackEvent(
  campaignId: string,
  sessionId: string,
  type: EventType,
  metadata?: Record<string, unknown>
) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId, sessionId, type, metadata }),
    });
  } catch {
    // silent fail for analytics
  }
}

export function getClientSessionId(): string {
  if (typeof document === "undefined") return "server";
  const match = document.cookie.match(/spark_sid=([^;]+)/);
  if (match) return match[1];
  const id = crypto.randomUUID().replace(/-/g, "");
  document.cookie = `spark_sid=${id}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
  return id;
}
