"use client";

import { memo } from "react";
import { PageHero } from "@/components/experience/PageHero";
import { MetricCard } from "@/components/experience/MetricCard";
import { ProgressRing } from "@/components/experience/ProgressRing";
import { ActivityFeed, type ActivityFeedItem } from "@/components/experience/ActivityFeed";
import { RoiStoryBlock } from "@/components/sponsor/RoiStoryBlock";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatNumber } from "@/lib/format";
import type { SponsorCommandCenterData } from "@/lib/sponsor/queries";

interface SponsorCommandCenterProps {
  data: SponsorCommandCenterData;
  activity: ActivityFeedItem[];
}

export const SponsorCommandCenter = memo(function SponsorCommandCenter({
  data,
  activity,
}: SponsorCommandCenterProps) {
  const { flagship } = data;
  const isLive = flagship?.status === "ACTIVE";

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow={isLive ? "● LIVE NOW" : "بوابة الراعي"}
        title={flagship?.title ?? "حملاتك"}
        subtitle="حملتك تتحرك داخل السوق — راقب الزخم لحظة بلحظة"
        meta={
          flagship ? (
            <StatusBadge status={isLive ? "live" : "pending"} label={isLive ? "نشطة" : flagship.status} />
          ) : null
        }
      >
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="المشاركون"
            value={data.participants}
            trend={
              data.lastHourDelta > 0 ? (
                <>+{formatNumber(data.lastHourDelta)} آخر ساعة</>
              ) : undefined
            }
            featured
          />
          <MetricCard label="استردادات اليوم" value={data.redemptionsToday} />
          <MetricCard
            label="تكلفة Spark"
            value={data.totalSparkCost}
            suffix=" Spark"
          />
          <MetricCard label="الوصول" value={data.totalReach} trend="شخص وصل للحملة" />
        </div>
      </PageHero>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RoiStoryBlock
            totalSparkCost={data.totalSparkCost}
            totalReach={data.totalReach}
            totalRedemptions={data.totalRedemptions}
            costPerRedemption={data.costPerRedemption}
          />
        </div>
        <div className="flex flex-col gap-6">
          <ProgressRing
            value={data.healthPercent}
            max={100}
            label="Campaign Health"
            healthPercent={data.healthPercent}
            size={140}
          />
          <ActivityFeed items={activity} title="تدفق حي" compact />
        </div>
      </div>
    </div>
  );
});
