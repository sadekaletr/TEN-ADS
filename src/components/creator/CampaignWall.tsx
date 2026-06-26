"use client";

import { StaggerGrid, StaggerGridItem } from "@/components/motion/StaggerGrid";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Icon } from "@/components/ui/Icon";

interface CampaignWallItem {
  id: string;
  title: string;
  sponsorName: string;
}

interface CampaignWallProps {
  campaigns: CampaignWallItem[];
}

export function CampaignWall({ campaigns }: CampaignWallProps) {
  return (
    <StaggerGrid className="grid grid-cols-3 gap-4 sm:grid-cols-4">
      {campaigns.map((c) => (
        <StaggerGridItem key={c.id}>
          <CircuitCard className="relative flex flex-col items-center p-4 text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-gold-4/30 bg-gold-2/10">
              <Icon name="spark" size={24} className="text-gold-1" />
            </div>
            <p className="line-clamp-2 text-xs text-warm-white">{c.title}</p>
            <p className="mt-1 line-clamp-1 text-[10px] text-dim">
              {c.sponsorName}
            </p>
          </CircuitCard>
        </StaggerGridItem>
      ))}
    </StaggerGrid>
  );
}
