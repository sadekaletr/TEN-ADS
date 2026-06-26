"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { duration, easeGold } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

interface TrustScoreRingProps {
  score: number;
  campaignsCount: number;
  size?: "small" | "default" | "large";
  className?: string;
}

const SIZE_CONFIG = {
  small: { dim: 72, stroke: 5, scoreText: "text-2xl", labelText: "text-[9px]" },
  default: { dim: 100, stroke: 6, scoreText: "text-3xl", labelText: "text-[10px]" },
  large: { dim: 140, stroke: 8, scoreText: "text-5xl", labelText: "text-[10px]" },
} as const;

export function TrustScoreRing({
  score,
  campaignsCount,
  size = "default",
  className,
}: TrustScoreRingProps) {
  const isNew = campaignsCount < 3;
  const { dim, stroke, scoreText, labelText } = SIZE_CONFIG[size];
  const radius = (dim - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = isNew ? 0 : score / 100;
  const targetOffset = circumference * (1 - progress);
  const [glow, setGlow] = useState(false);

  const gradientId = `trustGradient-${size}-${score}-${campaignsCount}`;

  return (
    <div
      className={cn("relative inline-flex flex-col items-center", className)}
      style={{
        width: dim,
        height: dim,
        boxShadow: glow && !isNew ? "0 0 24px rgba(212, 168, 85, 0.35)" : undefined,
        transition: "box-shadow 0.4s ease",
      }}
    >
      <svg width={dim} height={dim} className="-rotate-90">
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-gold-4/20"
        />
        {isNew ? (
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeDasharray="6 8"
            className="text-dimmer"
          />
        ) : (
          <motion.circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: targetOffset }}
            transition={{ duration: duration.cinematic, ease: easeGold }}
            onAnimationComplete={() => setGlow(true)}
          />
        )}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9a6e20" />
            <stop offset="100%" stopColor="#f0c97a" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {isNew ? (
          <>
            <span className="text-xs text-dim">جديد</span>
            <span className="mt-0.5 max-w-[80px] text-[10px] leading-tight text-dimmer">
              لا تقييم كافٍ بعد
            </span>
          </>
        ) : (
          <>
            <span className={cn("font-brand text-gold-1", scoreText)}>
              {score}
            </span>
            <span
              className={cn(
                "uppercase tracking-wide text-dim",
                labelText
              )}
            >
              Trust Score
            </span>
          </>
        )}
      </div>
    </div>
  );
}
