"use client";

import { ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TOKENS, type GlassElevation } from "@/styles/tokens";

interface GlassCardProps {
  children: ReactNode;
  featured?: boolean;
  elevation?: GlassElevation;
  interactive?: boolean;
  className?: string;
  innerClassName?: string;
}

const elevationStyles: Record<
  GlassElevation,
  { background: string; border: string; boxShadow: string }
> = {
  1: {
    background: TOKENS.gradient.cardDefault,
    border: `1px solid ${TOKENS.elevation.glass.border}`,
    boxShadow: TOKENS.shadow.card,
  },
  2: {
    background: TOKENS.gradient.cardFeatured,
    border: `1px solid ${TOKENS.elevation.glassFeatured.border}`,
    boxShadow: TOKENS.shadow.cardFeatured,
  },
  3: {
    background: TOKENS.color.surfaceElevated,
    border: `1px solid ${TOKENS.elevation.glass.border}`,
    boxShadow: TOKENS.shadow.elevated,
  },
};

export function GlassCard({
  children,
  featured = false,
  elevation,
  interactive = false,
  className = "",
  innerClassName = "p-6",
}: GlassCardProps) {
  const reducedMotion = useReducedMotion();
  const level: GlassElevation = elevation ?? (featured ? 2 : 1);
  const style = elevationStyles[level];
  const canHover = interactive && !reducedMotion;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl backdrop-blur-md",
        canHover &&
          "transition-transform duration-200 hover:-translate-y-0.5",
        className
      )}
      style={{
        background: style.background,
        border: style.border,
        boxShadow: style.boxShadow,
      }}
    >
      <div className={cn("relative z-10", innerClassName)}>{children}</div>
    </div>
  );
}
