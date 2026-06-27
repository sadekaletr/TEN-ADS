"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import { successSpring } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";

export type AchievementState = "locked" | "unlocked" | "in_progress";

export interface AchievementData {
  id: string;
  title: string;
  description: string;
  icon?: string;
  state: AchievementState;
  progress?: number;
  target?: number;
}

interface AchievementCardProps {
  achievement: AchievementData;
  className?: string;
}

export const AchievementCard = memo(function AchievementCard({
  achievement,
  className,
}: AchievementCardProps) {
  const reducedMotion = useReducedMotion();
  const { title, description, state, progress = 0, target = 1 } = achievement;
  const pct = target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0;

  return (
    <GlassCard
      className={cn(
        state === "locked" && "opacity-60",
        state === "unlocked" && "border-gold-2/30",
        className
      )}
      featured={state === "unlocked"}
      innerClassName="p-4"
    >
      <div className="flex items-start gap-3">
        <motion.div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            state === "unlocked" ? "bg-gold-2/20 text-gold-1" : "bg-surface-2 text-text-tertiary"
          )}
          animate={state === "unlocked" && !reducedMotion ? { scale: [1, 1.05, 1] } : undefined}
          transition={successSpring}
        >
          <Icon name={state === "locked" ? "lock" : "star"} size={18} />
        </motion.div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-text-primary">{title}</p>
          <p className="mt-0.5 text-xs text-text-secondary">{description}</p>
          {state === "in_progress" && (
            <div className="mt-2">
              <div className="h-1 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-gold-2 transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] text-text-tertiary">
                {progress}/{target}
              </p>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
});
