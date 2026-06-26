"use client";

import { CREATORS_EVENT_NAMES, type CreatorsEventName } from "@/lib/analytics/creators-event-names";
import { getClientSessionId } from "@/lib/track-client";

export { CREATORS_EVENT_NAMES, type CreatorsEventName };

export interface TrackCreatorsEventOptions {
  section?: string;
  ctaLabel?: string;
  metadata?: Record<string, unknown>;
}

function getLocaleDir(): { locale: "ar" | "en"; dir: "rtl" | "ltr" } {
  if (typeof document === "undefined") {
    return { locale: "ar", dir: "rtl" };
  }
  const locale = document.documentElement.lang === "en" ? "en" : "ar";
  const dir = document.documentElement.dir === "ltr" ? "ltr" : "rtl";
  return { locale, dir };
}

export function trackCreatorsEvent(
  name: CreatorsEventName,
  options: TrackCreatorsEventOptions = {}
) {
  if (typeof window === "undefined") return;

  const { locale, dir } = getLocaleDir();
  const payload = {
    name,
    locale,
    dir,
    sessionId: getClientSessionId(),
    section: options.section,
    cta_label: options.ctaLabel,
    ts: Date.now(),
    metadata: options.metadata,
  };

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/analytics/creators", blob)) return;
  }

  fetch("/api/analytics/creators", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // silent fail for analytics
  });
}
