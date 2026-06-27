"use client";

import { memo } from "react";
import { AchievementCard, type AchievementData } from "@/components/experience/AchievementCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface AchievementGridProps {
  achievements: AchievementData[];
  title?: string;
  description?: string;
}

export const AchievementGrid = memo(function AchievementGrid({
  achievements,
  title = "الإنجازات",
  description = "افتح شاراتك بتحقيق أهداف حقيقية",
}: AchievementGridProps) {
  return (
    <div className="space-y-4">
      <SectionHeader title={title} description={description} />
      <div className="grid gap-3 sm:grid-cols-2">
        {achievements.map((a) => (
          <AchievementCard key={a.id} achievement={a} />
        ))}
      </div>
    </div>
  );
});
