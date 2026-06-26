"use client";

import { CREATOR_LEVELS, getCreatorLevel } from "@/lib/creator-levels";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatNumber } from "@/lib/format";

interface CreatorProgressBarProps {
  completedCampaigns: number;
}

export function CreatorProgressBar({ completedCampaigns }: CreatorProgressBarProps) {
  const { current, next, progress } = getCreatorLevel(completedCampaigns);

  return (
    <GlassCard innerClassName="py-4 px-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-gold-1">{current.label}</span>
        {next && (
          <span className="text-dim">
            {formatNumber(next.minCampaigns - completedCampaigns)} حملات للمستوى التالي: {next.label}
          </span>
        )}
      </div>
      <div className="mt-3 flex gap-2">
        {CREATOR_LEVELS.map((level) => {
          const active = level.id === current.id;
          const done = completedCampaigns >= level.minCampaigns;
          return (
            <div
              key={level.id}
              className={`flex-1 rounded-full border px-2 py-1 text-center text-xs ${
                active
                  ? "border-gold-2 bg-gold-2/15 text-gold-1"
                  : done
                    ? "border-gold-4/30 text-dim"
                    : "border-gold-4/15 text-dimmer"
              }`}
            >
              {level.label}
            </div>
          );
        })}
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-gradient-to-l from-gold-3 to-gold-1 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
    </GlassCard>
  );
}
