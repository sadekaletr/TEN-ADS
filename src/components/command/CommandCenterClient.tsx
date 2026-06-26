"use client";

import { AnimatedCircuitCard } from "@/components/motion/AnimatedCircuitCard";
import { PageEnter } from "@/components/motion/PageEnter";
import { LiveSparkFlow } from "@/components/command/LiveSparkFlow";
import { CampaignPulse } from "@/components/command/CampaignPulse";
import { CityMapLive } from "@/components/command/CityMapLive";
import { GlobalCounters } from "@/components/command/GlobalCounters";

interface CommandCenterClientProps {
  todayRedemptions: number;
  activeCampaigns: number;
  conversionPct: number;
  pulseData: {
    id: string;
    title: string;
    redemptions: number;
    roi: number;
  }[];
  mapCities: string[];
}

export function CommandCenterClient({
  todayRedemptions,
  activeCampaigns,
  conversionPct,
  pulseData,
  mapCities,
}: CommandCenterClientProps) {
  return (
    <PageEnter className="space-y-6">
      <AnimatedCircuitCard className="border-gold-2/30">
        <GlobalCounters
          redemptions={todayRedemptions}
          activeCampaigns={activeCampaigns}
          conversionPct={conversionPct}
        />
      </AnimatedCircuitCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <AnimatedCircuitCard>
          <h2 className="mb-4 text-gold-1">Live Spark Flow</h2>
          <LiveSparkFlow />
        </AnimatedCircuitCard>
        <AnimatedCircuitCard delay={0.08}>
          <h2 className="mb-4 text-gold-1">Campaign Pulse</h2>
          <CampaignPulse campaigns={pulseData} />
        </AnimatedCircuitCard>
      </div>

      <AnimatedCircuitCard>
        <h2 className="mb-4 text-gold-1">خريطة الاسترداد الحية</h2>
        <CityMapLive initialCities={mapCities} />
      </AnimatedCircuitCard>
    </PageEnter>
  );
}
