"use client";

import { memo } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatNumber } from "@/lib/format";
import type { DailyMission } from "@/lib/gamification/derive";

interface DailyMissionCardsProps {
  missions: DailyMission[];
}

export const DailyMissionCards = memo(function DailyMissionCards({
  missions,
}: DailyMissionCardsProps) {
  return (
    <div className="space-y-4">
      <SectionHeader title="مهام اليوم" description="أكمل المهام لتحفيز نموك" />
      <div className="grid gap-3 md:grid-cols-3">
        {missions.map((m) => {
          const pct = m.target > 0 ? Math.min(100, Math.round((m.progress / m.target) * 100)) : 0;
          return (
            <GlassCard
              key={m.id}
              featured={m.completed}
              className={m.completed ? "border-gold-2/30" : undefined}
              innerClassName="p-4"
            >
              <p className="font-medium text-text-primary">{m.title}</p>
              <p className="mt-1 text-xs text-gold-2">+{formatNumber(m.reward)} Spark</p>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-gold-2 transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] text-text-tertiary">
                {m.progress}/{m.target}
              </p>
              {!m.completed && (
                <PrimaryButton href={m.href} size="sm" className="mt-3 w-full">
                  ابدأ
                </PrimaryButton>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
});
