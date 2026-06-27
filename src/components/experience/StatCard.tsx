"use client";

import { memo, type ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  children: ReactNode;
  className?: string;
  featured?: boolean;
}

export const StatCard = memo(function StatCard({
  label,
  children,
  className,
  featured,
}: StatCardProps) {
  return (
    <GlassCard featured={featured} className={cn(className)} innerClassName="p-5">
      <div className="text-2xl font-semibold text-text-primary">{children}</div>
      <p className="mt-1 text-sm text-text-secondary">{label}</p>
    </GlassCard>
  );
});
