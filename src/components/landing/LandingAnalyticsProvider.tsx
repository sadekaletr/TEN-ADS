"use client";

import { useEffect, type ReactNode } from "react";
import {
  trackLandingEvent,
  useLandingScrollMilestones,
} from "@/lib/analytics/landing-events";

export function LandingAnalyticsProvider({ children }: { children: ReactNode }) {
  useLandingScrollMilestones();

  useEffect(() => {
    trackLandingEvent("landing_view", { section: "hero" });
  }, []);

  return <>{children}</>;
}
