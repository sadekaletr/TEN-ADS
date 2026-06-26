"use client";

import { ADMIN_EVENT_NAMES, type AdminEventName } from "@/lib/analytics/admin-event-names";
import { getClientSessionId } from "@/lib/track-client";

export { ADMIN_EVENT_NAMES, type AdminEventName };

export function trackAdminEvent(
  name: AdminEventName,
  metadata?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;

  const locale = document.documentElement.lang === "en" ? "en" : "ar";
  const dir = document.documentElement.dir === "ltr" ? "ltr" : "rtl";
  const payload = {
    name,
    locale,
    dir,
    sessionId: getClientSessionId(),
    ts: Date.now(),
    metadata,
  };

  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/analytics/admin", blob)) return;
  }
  fetch("/api/analytics/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
