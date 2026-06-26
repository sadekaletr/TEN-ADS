"use client";

import { n } from "@/lib/format";
import { useLocale } from "@/lib/i18n";

interface CreatorStatChipsProps {
  sparkScore: number | null;
  activeCampaigns: number;
  totalRedemptions: number;
  compact?: boolean;
  isNew?: boolean;
}

export function CreatorStatChips({
  sparkScore,
  activeCampaigns,
  totalRedemptions,
  compact = false,
  isNew = false,
}: CreatorStatChipsProps) {
  const { t } = useLocale();

  const sparkValue =
    sparkScore != null ? n(sparkScore) : isNew ? t("creators.chips.new") : "—";

  const chips = [
    { label: t("creators.chips.spark"), value: sparkValue },
    { label: t("creators.chips.campaigns"), value: n(activeCampaigns) },
    { label: t("creators.chips.redemptions"), value: n(totalRedemptions) },
  ];

  return (
    <div className={compact ? "flex flex-wrap gap-1.5" : "flex flex-wrap gap-2"}>
      {chips.map((chip) => (
        <span
          key={chip.label}
          className={
            compact
              ? "rounded-md border border-gold-4/20 bg-void/50 px-2 py-0.5 text-[10px]"
              : "rounded-lg border border-gold-4/25 bg-void/40 px-2.5 py-1 text-xs"
          }
        >
          <span className="font-mono font-medium text-gold-1">{chip.value}</span>{" "}
          <span className="text-text-secondary">{chip.label}</span>
        </span>
      ))}
    </div>
  );
}
