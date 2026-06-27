"use client";

import { memo } from "react";
import { EnergyRingV2 } from "@/components/ui/EnergyRingV2";
import { cn } from "@/lib/utils";
import { percent } from "@/lib/format";

interface ProgressRingProps {
  value: number;
  max?: number;
  label?: string;
  size?: number;
  className?: string;
  /** 0–100 health score for color mapping */
  healthPercent?: number;
}

function healthLabel(pct: number): string {
  if (pct >= 85) return "ممتاز";
  if (pct >= 60) return "جيد";
  if (pct >= 35) return "متوسط";
  return "يحتاج اهتمام";
}

export const ProgressRing = memo(function ProgressRing({
  value,
  max = 100,
  label,
  size = 120,
  className,
  healthPercent,
}: ProgressRingProps) {
  const pct = healthPercent ?? Math.min(100, Math.round((value / Math.max(max, 1)) * 100));

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <EnergyRingV2 value={value} max={max} size={size} strokeWidth={8} />
      <div className="text-center">
        <p className="font-mono text-2xl font-semibold text-gold-1">{percent(pct)}</p>
        <p className="text-xs text-text-secondary">{label ?? healthLabel(pct)}</p>
      </div>
    </div>
  );
});
