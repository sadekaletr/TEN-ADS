"use client";

import { memo, useMemo } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiveCounter } from "@/components/experience/LiveCounter";
import { SparkAmount } from "@/components/ui/SparkAmount";
import { formatNumber } from "@/lib/format";

interface CostSimulatorProps {
  prizeQuantity: number;
  costPerRedemption: number;
  totalCost: number;
}

export const CostSimulator = memo(function CostSimulator({
  prizeQuantity,
  costPerRedemption,
  totalCost,
}: CostSimulatorProps) {
  const estimates = useMemo(
    () => ({
      reach: Math.round(prizeQuantity * 48),
      redemptions: Math.round(prizeQuantity * 0.36),
      roi:
        totalCost > 0
          ? ((Math.round(prizeQuantity * 0.36) * costPerRedemption) / totalCost).toFixed(1)
          : "—",
    }),
    [prizeQuantity, costPerRedemption, totalCost]
  );

  return (
    <GlassCard elevation={2} innerClassName="p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-text-primary">محاكي التكلفة</p>
        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-text-tertiary">
          تقدير
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-text-tertiary">التكلفة</p>
          <SparkAmount amount={totalCost} size="sm" className="mt-1" showLabel />
        </div>
        <div>
          <p className="text-xs text-text-tertiary">متوقع زيارات</p>
          <LiveCounter value={estimates.reach} className="mt-1 font-mono text-lg text-text-primary" />
        </div>
        <div>
          <p className="text-xs text-text-tertiary">متوقع استرداد</p>
          <LiveCounter
            value={estimates.redemptions}
            className="mt-1 font-mono text-lg text-gold-1"
          />
        </div>
        <div>
          <p className="text-xs text-text-tertiary">ROI متوقع</p>
          <p className="mt-1 font-mono text-lg text-text-primary">{estimates.roi}x</p>
        </div>
      </div>
      <p className="mt-3 text-[10px] text-text-tertiary">
        {formatNumber(prizeQuantity)} جائزة × {formatNumber(costPerRedemption)} Spark
      </p>
    </GlassCard>
  );
});
