import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

interface SurfaceCardProps {
  children: ReactNode;
  className?: string;
  accent?: boolean;
  id?: string;
}

export function SurfaceCard({ children, className, accent, id = "surface-card" }: SurfaceCardProps) {
  void id;
  return (
    <GlassCard className={cn(accent && "ring-1 ring-gold-2/25", className)}>
      {children}
    </GlassCard>
  );
}
