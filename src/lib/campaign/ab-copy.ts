"use client";

import { useMemo } from "react";

export type AbVariant = "A" | "B";

export function pickDescriptionVariant(sessionKey: string): AbVariant {
  if (typeof window === "undefined") return "A";
  const stored = sessionStorage.getItem(`ab:${sessionKey}`);
  if (stored === "A" || stored === "B") return stored;
  const next: AbVariant = Math.random() < 0.5 ? "A" : "B";
  sessionStorage.setItem(`ab:${sessionKey}`, next);
  return next;
}

export function useCampaignDescription(
  campaignId: string,
  fallback: string | null | undefined,
  variantA?: string | null,
  variantB?: string | null
): { text: string | null; variant: AbVariant | null } {
  return useMemo(() => {
    if (!variantA && !variantB) {
      return { text: fallback ?? null, variant: null };
    }
    const variant = pickDescriptionVariant(campaignId);
    const text =
      variant === "A"
        ? variantA ?? fallback ?? variantB ?? null
        : variantB ?? fallback ?? variantA ?? null;
    return { text, variant };
  }, [campaignId, fallback, variantA, variantB]);
}
