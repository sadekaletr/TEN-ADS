"use client";

import { useEffect, useRef } from "react";
import { LANDING_EVENT_NAMES, type LandingEventName } from "@/lib/analytics/landing-event-names";
import { getClientSessionId } from "@/lib/track-client";
import { getLandingExperiment, type LandingExperiment } from "@/lib/landing/experiment";

export { LANDING_EVENT_NAMES, type LandingEventName };

export interface TrackLandingEventOptions {
  section?: string;
  ctaLabel?: string;
  experiment?: LandingExperiment;
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

export function trackLandingEvent(
  name: LandingEventName,
  options: TrackLandingEventOptions = {}
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
    experiment: options.experiment ?? getLandingExperiment(),
    ts: Date.now(),
    metadata: options.metadata,
  };

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/analytics/landing", blob)) return;
  }

  fetch("/api/analytics/landing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // silent fail for analytics
  });
}

const SCROLL_MILESTONES: { pct: number; event: LandingEventName }[] = [
  { pct: 25, event: "landing_scroll_25" },
  { pct: 50, event: "landing_scroll_50" },
  { pct: 75, event: "landing_scroll_75" },
  { pct: 100, event: "landing_scroll_100" },
];

export function useLandingScrollMilestones() {
  const fired = useRef(new Set<number>());

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollHeight = doc.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const pct = Math.min(100, Math.round((scrollTop / scrollHeight) * 100));

      for (const milestone of SCROLL_MILESTONES) {
        if (pct >= milestone.pct && !fired.current.has(milestone.pct)) {
          fired.current.add(milestone.pct);
          trackLandingEvent(milestone.event, { section: "page" });
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}
