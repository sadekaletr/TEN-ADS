"use client";

import { cn } from "@/lib/utils";
import { percent } from "@/lib/format";
import { TOKENS } from "@/styles/tokens";

export interface EnergyRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}

function ringColor(ratio: number): string {
  if (ratio >= 1) return TOKENS.semantic.danger;
  if (ratio >= 0.85) return TOKENS.semantic.warning;
  return TOKENS.viz.primary;
}

export function EnergyRing({
  value,
  max,
  size = 64,
  strokeWidth = 6,
  showLabel = true,
  className,
}: EnergyRingProps) {
  const safeMax = Math.max(max, 1);
  const ratio = Math.min(value / safeMax, 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - ratio);
  const color = ringColor(ratio);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${percent(Math.round(ratio * 100))} مكتمل`}
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
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: `stroke-dashoffset ${TOKENS.motion.durationNormal} ${TOKENS.motion.easeGold}`,
          }}
        />
      </svg>
      {showLabel && (
        <span className="absolute font-mono text-xs text-warm-white">
          {percent(Math.round(ratio * 100))}
        </span>
      )}
    </div>
  );
}
