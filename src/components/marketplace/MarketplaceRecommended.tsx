"use client";

import { memo, useMemo } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatNumber, percent } from "@/lib/format";
import type { CreatorCardData } from "@/lib/creators/getFeaturedCreators";
import Link from "next/link";

function matchReason(creator: CreatorCardData): string {
  if (creator.trustScore >= 80) return "ثقة عالية في السوق";
  if (creator.activeCampaigns > 0) return "حملات نشطة الآن";
  if ((creator.conversionRate ?? 0) > 15) return "معدل تحويل قوي";
  if (creator.verified) return "صانع موثّق";
  return "مناسب لبدء شراكة";
}

interface MarketplaceRecommendedProps {
  creators: CreatorCardData[];
}

export const MarketplaceRecommended = memo(function MarketplaceRecommended({
  creators,
}: MarketplaceRecommendedProps) {
  const picks = useMemo(
    () =>
      [...creators]
        .sort((a, b) => b.trustScore - a.trustScore || b.activeCampaigns - a.activeCampaigns)
        .slice(0, 5),
    [creators]
  );

  if (picks.length === 0) return null;

  return (
    <GlassCard featured elevation={2} className="mb-8" innerClassName="p-6">
      <SectionHeader
        title="أفضل 5 صناع محتوى لحملتك"
        description="توصيات ذكية بناءً على الثقة والنشاط — AI Matching"
      />
      <ul className="mt-4 space-y-3">
        {picks.map((c, i) => (
          <li key={c.id}>
            <Link
              href={`/creator/${c.handle.replace(/^@/, "")}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-gold-4/15 bg-surface-2/50 px-4 py-3 transition-colors hover:border-gold-2/30"
            >
              <div className="min-w-0">
                <p className="font-medium text-text-primary">
                  {i + 1}. {c.name}
                </p>
                <p className="text-xs text-text-secondary">{matchReason(c)}</p>
              </div>
              <div className="shrink-0 text-left text-xs text-text-tertiary">
                <p>Trust {formatNumber(c.trustScore)}</p>
                {c.conversionRate != null && (
                  <p>{percent(Math.round(c.conversionRate))} تحويل</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
});
