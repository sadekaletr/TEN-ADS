"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { SparkAmount } from "@/components/ui/SparkAmount";
import { LiveCounter } from "@/components/experience/LiveCounter";
import { fadeUp } from "@/lib/motion/variants";
import { transition } from "@/lib/motion/tokens";
import { formatNumber } from "@/lib/format";

interface RoiStoryBlockProps {
  totalSparkCost: number;
  totalReach: number;
  totalRedemptions: number;
  costPerRedemption: number;
}

const STORY_STEPS = [
  { key: "spent", label: "أنفقت" },
  { key: "reach", label: "وصلت إلى" },
  { key: "redeemed", label: "استرد" },
  { key: "cpa", label: "تكلفة التحويل" },
] as const;

export const RoiStoryBlock = memo(function RoiStoryBlock({
  totalSparkCost,
  totalReach,
  totalRedemptions,
  costPerRedemption,
}: RoiStoryBlockProps) {
  const reducedMotion = useReducedMotion();

  if (totalRedemptions === 0 && totalReach === 0) {
    return (
      <GlassCard innerClassName="p-6">
        <p className="text-sm font-medium text-text-primary">قصة العائد</p>
        <p className="mt-2 text-sm text-text-secondary">
          لا توجد بيانات بعد — عند بدء الحملة ستظهر القصة هنا.
        </p>
      </GlassCard>
    );
  }

  const values = {
    spent: totalSparkCost,
    reach: totalReach,
    redeemed: totalRedemptions,
    cpa: costPerRedemption,
  };

  return (
    <GlassCard featured innerClassName="p-6">
      <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-gold-2">
        ROI Story
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STORY_STEPS.map((step, i) => (
          <motion.div
            key={step.key}
            className="rounded-xl border border-gold-4/15 bg-bg-elevated/50 p-4"
            initial={reducedMotion ? false : fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ ...transition.normal, delay: i * 0.06 }}
          >
            <p className="text-xs text-text-tertiary">{step.label}</p>
            {step.key === "spent" ? (
              <SparkAmount amount={values.spent} size="md" className="mt-2" showLabel />
            ) : step.key === "cpa" ? (
              <p className="mt-2 font-mono text-2xl font-semibold text-gold-1">
                <LiveCounter value={values.cpa} /> Spark
              </p>
            ) : (
              <p className="mt-2 font-mono text-2xl font-semibold text-text-primary">
                <LiveCounter value={values[step.key === "reach" ? "reach" : "redeemed"]} />
                <span className="mr-1 text-sm font-normal text-text-secondary">شخص</span>
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
});
