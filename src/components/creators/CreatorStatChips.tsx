"use client";

import { n } from "@/lib/format";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

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
    { label: t("creators.chips.spark"), value: sparkValue, highlight: true },
    { label: t("creators.chips.campaigns"), value: n(activeCampaigns), highlight: false },
    { label: t("creators.chips.redemptions"), value: n(totalRedemptions), highlight: false },
  ];

  return (
    <div
      className={cn(
        "flex flex-wrap",
        compact ? "gap-1.5" : "gap-2"
      )}
      role="list"
      aria-label={t("creators.chips.spark")}
    >
      {chips.map((chip) => (
        <span
          key={chip.label}
          role="listitem"
          className={cn(
            "inline-flex items-baseline gap-1 rounded-lg border",
            compact
              ? "border-strong/60 bg-bg-elevated/80 px-2 py-0.5 text-[10px]"
              : "border-strong bg-bg-elevated/90 px-2.5 py-1 text-xs shadow-surface",
            chip.highlight && "border-gold-2/30 bg-gold-rich/5"
          )}
        >
          <span
            className={cn(
              "font-mono font-semibold tabular-nums",
              chip.highlight ? "text-gold-accent" : "text-text-primary"
            )}
          >
            {chip.value}
          </span>
          <span className="text-text-secondary">{chip.label}</span>
        </span>
      ))}
    </div>
  );
}
