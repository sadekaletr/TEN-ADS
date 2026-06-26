"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { DataDepthCard } from "@/components/ui/DataDepthCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { EnergyRingV2 } from "@/components/ui/EnergyRingV2";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SparkAmount } from "@/components/ui/SparkAmount";
import { RoiNarrativeBlock } from "@/components/sponsor/RoiNarrativeBlock";
import { trackProductEvent } from "@/lib/analytics/product-events";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TOKENS } from "@/styles/tokens";

type RangeKey = "7d" | "30d" | "all";

interface SponsorRoiCardProps {
  totalRedemptions: number;
  totalSparkCost: number;
  costPerRedemption: number;
  campaigns: { title: string; redemptions: number; sparkCost: number }[];
}

const RANGE_LABELS: Record<RangeKey, string> = {
  "7d": "7 أيام",
  "30d": "30 يوماً",
  all: "الكل",
};

export function SponsorRoiCard({
  totalRedemptions,
  totalSparkCost,
  costPerRedemption,
  campaigns,
}: SponsorRoiCardProps) {
  const [range, setRange] = useState<RangeKey>("all");

  const maxRedemptions = Math.max(
    ...campaigns.map((c) => c.redemptions),
    totalRedemptions,
    1
  );

  const roiScore = totalRedemptions > 0 ? Math.min(10, Math.round(totalRedemptions / 10)) : 0;
  const efficiencyPct =
    totalSparkCost > 0
      ? Math.round((totalRedemptions / totalSparkCost) * 100)
      : 0;

  const scaled = useMemo(() => {
    const factor = range === "7d" ? 0.35 : range === "30d" ? 0.7 : 1;
    return {
      redemptions: Math.round(totalRedemptions * factor),
      sparkCost: Math.round(totalSparkCost * factor),
      costPer: costPerRedemption,
      campaigns: campaigns.map((c) => ({
        ...c,
        redemptions: Math.round(c.redemptions * factor),
        sparkCost: Math.round(c.sparkCost * factor),
      })),
    };
  }, [range, totalRedemptions, totalSparkCost, costPerRedemption, campaigns]);

  function handleRangeChange(next: RangeKey) {
    setRange(next);
    trackProductEvent("sponsor_roi_range_change", {
      section: "roi_atf",
      metadata: { range: next },
    });
  }

  if (campaigns.length === 0 && totalRedemptions === 0) {
    return (
      <EmptyState
        variant="premium"
        title="لا توجد بيانات ROI بعد"
        description="أطلق حملتك الأولى لقياس الاستردادات وتكلفة Spark"
        action={
          <Button
            href="/sponsor/pitch-builder"
            glow
            className="min-h-12"
            icon={<Icon name="rocket" size={16} />}
            onClick={() =>
              trackProductEvent("sponsor_roi_primary_cta_click", {
                section: "roi_empty",
                ctaLabel: "أنشئ حملة",
              })
            }
          >
            أنشئ حملة
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="inline-flex rounded-xl border border-strong bg-bg-elevated p-1"
          role="tablist"
          aria-label="نطاق العرض"
        >
          {(Object.keys(RANGE_LABELS) as RangeKey[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={range === key}
              className={cn(
                "focus-ring min-h-10 rounded-lg px-4 text-sm font-medium transition-colors",
                range === key
                  ? "bg-gold-rich/20 text-gold-accent"
                  : "text-text-secondary hover:text-text-primary"
              )}
              onClick={() => handleRangeChange(key)}
            >
              {RANGE_LABELS[key]}
            </button>
          ))}
        </div>
        <Button
          href="/sponsor/pitch-builder"
          variant="primary"
          glow
          className="min-h-12 w-full sm:w-auto"
          icon={<Icon name="rocket" size={16} />}
          onClick={() =>
            trackProductEvent("sponsor_roi_primary_cta_click", {
              section: "roi_atf",
              ctaLabel: "حملة جديدة",
            })
          }
        >
          حملة جديدة
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DataDepthCard
          elevation={4}
          featured
          title="إجمالي الاستردادات"
          value={formatNumber(scaled.redemptions)}
          meta={range !== "all" ? `عرض: ${RANGE_LABELS[range]}` : "كل الفترات"}
          icon="gift"
        />
        <DataDepthCard
          elevation={3}
          title="تكلفة Spark"
          value={<SparkAmount amount={scaled.sparkCost} size="sm" />}
          meta="إجمالي الإنفاق"
          icon="wallet"
        />
        <DataDepthCard
          elevation={2}
          title="متوسط / استرداد"
          value={
            <span className="font-mono tabular-nums">{formatNumber(scaled.costPer)} Spark</span>
          }
          meta="تكلفة الوحدة"
          icon="spark"
        />
        <DataDepthCard
          elevation={2}
          title="كفاءة الاسترداد"
          value={<span className="font-mono tabular-nums">{efficiencyPct}%</span>}
          meta="استردادات / تكلفة"
          icon="megaphone"
        />
      </div>

      <RoiNarrativeBlock
        totalRedemptions={scaled.redemptions}
        totalSparkCost={scaled.sparkCost}
        costPerRedemption={scaled.costPer}
      />

      <div className="flex justify-center lg:justify-end">
        <EnergyRingV2
          value={roiScore}
          max={10}
          label="مؤشر الأداء"
          className="mx-auto lg:mx-0"
        />
      </div>

      {scaled.campaigns.length > 0 && (
        <GlassCard elevation={2} className="border-strong">
          <SectionHeader title="حسب الحملة" description="مقارنة الاستردادات والتكلفة" />
          <ul className="space-y-4 text-sm">
            {scaled.campaigns.map((c) => {
              const widthPct = Math.round((c.redemptions / maxRedemptions) * 100);
              return (
                <li
                  key={c.title}
                  className="group space-y-2 rounded-xl border border-transparent px-2 py-2 transition-colors hover:border-strong hover:bg-bg-elevated/50"
                >
                  <div className="flex justify-between gap-2">
                    <span className="font-medium text-text-primary group-hover:text-gold-accent">
                      {c.title}
                    </span>
                    <span className="font-mono tabular-nums text-gold-2">
                      {formatNumber(c.redemptions)} ×{" "}
                      <SparkAmount amount={c.sparkCost} size="xs" showLabel={false} />
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-bg-elevated">
                    <div
                      className="h-full rounded-full transition-[width,opacity] duration-200 group-hover:opacity-90"
                      style={{
                        width: `${widthPct}%`,
                        background: TOKENS.viz.primary,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
