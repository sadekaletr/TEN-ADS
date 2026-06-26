"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { percent } from "@/lib/format";
import { TOKENS } from "@/styles/tokens";

export interface EnergyRingV2Props {
  value: number;
  max: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function ringColor(ratio: number): string {
  if (ratio >= 1) return TOKENS.semantic.danger;
  if (ratio >= 0.85) return TOKENS.semantic.warning;
  return TOKENS.viz.primary;
}

export function EnergyRingV2({
  value,
  max,
  label,
  size = 80,
  strokeWidth = 7,
  className,
}: EnergyRingV2Props) {
  const reducedMotion = useReducedMotion();
  const safeMax = Math.max(max, 1);
  const ratio = Math.min(value / safeMax, 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - ratio);
  const color = ringColor(ratio);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className="relative inline-flex items-center justify-center"
        style={{ width: size, height: size }}
        role="img"
        aria-label={label ?? `${percent(Math.round(ratio * 100))}`}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={TOKENS.viz.grid}
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={reducedMotion ? false : { strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <span className="absolute font-mono text-sm font-semibold text-gold-1">
          {percent(Math.round(ratio * 100))}
        </span>
      </div>
      {label && <span className="text-xs text-text-secondary">{label}</span>}
    </div>
  );
}
