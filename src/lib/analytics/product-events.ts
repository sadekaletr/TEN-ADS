"use client";

import {
  PRODUCT_EVENT_NAMES,
  type ProductEventName,
} from "@/lib/analytics/product-event-names";
import { getClientSessionId } from "@/lib/track-client";

export { PRODUCT_EVENT_NAMES, type ProductEventName };

export interface TrackProductEventOptions {
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

export function trackProductEvent(
  name: ProductEventName,
  options: TrackProductEventOptions = {}
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
    if (navigator.sendBeacon("/api/analytics/product", blob)) return;
  }

  fetch("/api/analytics/product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // silent fail for analytics
  });
}
