import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { DataDepthCard } from "@/components/ui/DataDepthCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { EnergyRingV2 } from "@/components/ui/EnergyRingV2";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SparkAmount } from "@/components/ui/SparkAmount";
import { RoiNarrativeBlock } from "@/components/sponsor/RoiNarrativeBlock";
import { formatNumber } from "@/lib/format";
import { TOKENS } from "@/styles/tokens";

interface SponsorRoiCardProps {
  totalRedemptions: number;
  totalSparkCost: number;
  costPerRedemption: number;
  campaigns: { title: string; redemptions: number; sparkCost: number }[];
}

export function SponsorRoiCard({
  totalRedemptions,
  totalSparkCost,
  costPerRedemption,
  campaigns,
}: SponsorRoiCardProps) {
  const maxRedemptions = Math.max(
    ...campaigns.map((c) => c.redemptions),
    totalRedemptions,
    1
  );

  const roiScore = totalRedemptions > 0 ? Math.min(10, Math.round(totalRedemptions / 10)) : 0;

  if (campaigns.length === 0 && totalRedemptions === 0) {
    return (
      <EmptyState
        title="لا توجد بيانات ROI بعد"
        description="أطلق حملتك الأولى لقياس الاستردادات وتكلفة Spark"
        action={
          <Button href="/sponsor/campaigns/new" icon={<Icon name="rocket" size={16} />}>
            أنشئ حملة
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <DataDepthCard
          elevation={4}
          featured
          title="إجمالي الاستردادات"
          value={formatNumber(totalRedemptions)}
        />
        <DataDepthCard
          elevation={3}
          title="تكلفة Spark"
          value={<SparkAmount amount={totalSparkCost} size="sm" />}
        />
        <DataDepthCard
          elevation={2}
          title="متوسط / استرداد"
          value={
            <span className="font-mono">{formatNumber(costPerRedemption)} Spark</span>
          }
        />
      </div>

      <RoiNarrativeBlock
        totalRedemptions={totalRedemptions}
        totalSparkCost={totalSparkCost}
        costPerRedemption={costPerRedemption}
      />

      <div className="flex justify-center lg:justify-end">
        <EnergyRingV2
          value={roiScore}
          max={10}
          label="مؤشر الأداء"
          className="mx-auto lg:mx-0"
        />
      </div>

      {campaigns.length > 0 && (
        <GlassCard elevation={2}>
          <SectionHeader title="حسب الحملة" />
          <ul className="space-y-4 text-sm">
            {campaigns.map((c) => {
              const widthPct = Math.round((c.redemptions / maxRedemptions) * 100);
              return (
                <li key={c.title} className="group space-y-2 rounded-lg px-2 py-1 transition-colors hover:bg-surface-2">
                  <div className="flex justify-between gap-2">
                    <span className="text-text-primary group-hover:text-gold-1">{c.title}</span>
                    <span className="font-mono text-gold-2">
                      {formatNumber(c.redemptions)} ×{" "}
                      <SparkAmount amount={c.sparkCost} size="xs" showLabel={false} />
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full transition-all duration-200 group-hover:opacity-90"
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
