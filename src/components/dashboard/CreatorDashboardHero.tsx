"use client";

import { memo } from "react";
import { PageHero } from "@/components/experience/PageHero";
import { LiveCounter } from "@/components/experience/LiveCounter";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Icon } from "@/components/ui/Icon";
import { formatNumber, spark } from "@/lib/format";
import { TYPICAL_CAMPAIGN_COST_DEFAULT } from "@/lib/wallet/topup-packages";

interface CreatorDashboardHeroProps {
  creatorName: string;
  walletBalance: number;
  monthlySparkValue: number;
  activeCampaigns: number;
  conversionRate: string;
}

export const CreatorDashboardHero = memo(function CreatorDashboardHero({
  creatorName,
  walletBalance,
  monthlySparkValue,
  activeCampaigns,
  conversionRate,
}: CreatorDashboardHeroProps) {
  const needsTopUp = walletBalance < TYPICAL_CAMPAIGN_COST_DEFAULT;
  const firstName = creatorName.split(/\s+/)[0] ?? creatorName;

  return (
    <PageHero
      eyebrow="غرفة القيادة"
      title={`مرحباً ${firstName}`}
      subtitle="آلة توليد دخل ونمو — كل استرداد يحرّك محركك"
      meta={
        <span>
          {formatNumber(activeCampaigns)} حملة نشطة · تحويل {conversionRate}
        </span>
      }
      actions={
        <>
          <PrimaryButton
            href={needsTopUp ? "/dashboard/wallet/topup" : "/dashboard/campaigns/new"}
            glow
            icon={<Icon name={needsTopUp ? "wallet" : "rocket"} size={16} />}
          >
            {needsTopUp ? "شحن المحفظة" : "حملة جديدة"}
          </PrimaryButton>
          <SecondaryButton href="/dashboard/campaigns">حملاتي</SecondaryButton>
        </>
      }
    >
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <GlassCard featured innerClassName="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-2">رصيد Spark</p>
          <LiveCounter
            value={walletBalance}
            className="mt-2 text-3xl font-mono font-bold text-gold-1"
          />
          <p className="mt-1 text-sm text-text-secondary">{spark(walletBalance)}</p>
        </GlassCard>
        <GlassCard elevation={2} innerClassName="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-2">قيمة هذا الشهر</p>
          <LiveCounter
            value={monthlySparkValue}
            className="mt-2 text-3xl font-mono font-bold text-text-primary"
          />
          <p className="mt-1 text-sm text-text-secondary">Spark من الاستردادات</p>
        </GlassCard>
      </div>
    </PageHero>
  );
});
