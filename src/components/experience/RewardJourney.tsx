"use client";

import { memo } from "react";
import { ConversionRail, type ConversionStep } from "@/components/ui/ConversionRail";
import { cn } from "@/lib/utils";

export const REWARD_JOURNEY_STEPS: ConversionStep[] = [
  { id: "welcome", label: "ترحيب" },
  { id: "verify", label: "تحقق" },
  { id: "claim", label: "استلام" },
  { id: "reveal", label: "جائزة" },
];

/** Maps internal redeem phases to macro journey step ids */
export function redeemPhaseToJourneyStep(
  phase: string
): "welcome" | "verify" | "claim" | "reveal" {
  switch (phase) {
    case "welcome":
    case "preview":
    case "creator":
      return "welcome";
    case "code":
    case "validating":
      return "verify";
    case "claim":
      return "claim";
    case "reveal":
    case "error":
      return "reveal";
    default:
      return "welcome";
  }
}

interface RewardJourneyProps {
  currentPhase: string;
  className?: string;
}

export const RewardJourney = memo(function RewardJourney({
  currentPhase,
  className,
}: RewardJourneyProps) {
  const current = redeemPhaseToJourneyStep(currentPhase);

  return (
    <ConversionRail
      steps={REWARD_JOURNEY_STEPS}
      current={current}
      className={cn("w-full", className)}
    />
  );
});
