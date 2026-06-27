"use client";

import { memo, type ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiveCounter } from "@/components/experience/LiveCounter";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: number;
  suffix?: string;
  trend?: ReactNode;
  featured?: boolean;
  className?: string;
}

export const MetricCard = memo(function MetricCard({
  label,
  value,
  suffix,
  trend,
  featured,
  className,
}: MetricCardProps) {
  return (
    <GlassCard featured={featured} interactive className={cn("text-center", className)} innerClassName="p-5">
      <LiveCounter
        value={value}
        suffix={suffix}
        className="text-3xl font-mono font-semibold text-gold-1"
      />
      <p className="mt-1 text-sm text-text-secondary">{label}</p>
      {trend && <div className="mt-2 text-xs text-gold-2">{trend}</div>}
    </GlassCard>
  );
});
