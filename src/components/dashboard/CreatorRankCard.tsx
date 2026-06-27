"use client";

import { memo } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import { formatNumber, percent } from "@/lib/format";
import type { CreatorRankInfo } from "@/lib/gamification/derive";

interface CreatorRankCardProps {
  rank: CreatorRankInfo;
  sparkScore: number;
}

export const CreatorRankCard = memo(function CreatorRankCard({
  rank,
  sparkScore,
}: CreatorRankCardProps) {
  const scope = rank.city ? rank.city : "المنصة";

  return (
    <GlassCard featured interactive innerClassName="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-2">Creator Rank</p>
          {rank.rank != null ? (
            <>
              <p className="mt-2 font-mono text-3xl font-bold text-gold-1">
                #{formatNumber(rank.rank)}
              </p>
              <p className="mt-1 text-sm text-text-secondary">في {scope}</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-text-secondary">ابدأ حملتك الأولى للظهور في الترتيب</p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-2/15 text-gold-1">
          <Icon name="star" size={20} />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        {rank.topPercent != null && (
          <span className="rounded-full border border-gold-4/30 px-3 py-1 text-gold-1">
            Top {percent(rank.topPercent)}
          </span>
        )}
        <span className="rounded-full bg-surface-2 px-3 py-1 text-text-secondary">
          Spark {formatNumber(sparkScore)}
        </span>
      </div>
    </GlassCard>
  );
});
