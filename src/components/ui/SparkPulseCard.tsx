"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionSafe } from "@/lib/motion/useMotionSafe";
import { pulseGlow } from "@/lib/motion/presets";
import { GlassCard } from "@/components/ui/GlassCard";

export interface SparkPulseCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  pulse?: boolean;
  className?: string;
}

export function SparkPulseCard({
  label,
  value,
  delta,
  deltaPositive,
  pulse = false,
  className,
}: SparkPulseCardProps) {
  const motionOk = useMotionSafe();

  return (
    <GlassCard innerClassName="py-4 px-5" className={className}>
      <p className="text-xs text-dim">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <motion.p
          className={cn("font-mono text-2xl text-gold-1", pulse && motionOk && "relative")}
          {...(pulse && motionOk ? pulseGlow : {})}
        >
          {value}
        </motion.p>
        {delta && (
          <span
            className={cn(
              "text-xs font-mono",
              deltaPositive === true && "text-success",
              deltaPositive === false && "text-danger",
              deltaPositive === undefined && "text-dim"
            )}
          >
            {delta}
          </span>
        )}
      </div>
    </GlassCard>
  );
}
