"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SparkIcon } from "@/components/ui/SparkIcon";
import { formatNumber } from "@/lib/format";
import { TIER_DEFINITIONS, type TierId } from "@/lib/campaign-tiers";
import { cn } from "@/lib/utils";

interface TierPickerProps {
  selected: TierId;
  onSelect: (tier: TierId) => void;
  readOnly?: boolean;
  showCta?: boolean;
  ctaLabel?: string;
}

export function TierPicker({ selected, onSelect, readOnly, showCta, ctaLabel }: TierPickerProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 md:items-stretch">
      {TIER_DEFINITIONS.map((tier) => {
        const isSelected = selected === tier.id;
        const featured = tier.popular;

        const content = (
          <>
            {featured && (
              <span className="absolute left-4 top-4 z-20 rounded-full bg-gold-2 px-2.5 py-0.5 text-xs font-medium text-void">
                الأكثر شعبية
              </span>
            )}
            <p className="text-sm text-dim">{tier.name}</p>
            <p className="mt-1 font-brand text-xl text-gold-1">{tier.nameAr}</p>
            <div className="mt-3 flex items-center gap-2">
              <SparkIcon size={20} />
              <span className="font-mono text-2xl text-gold-1">
                {formatNumber(tier.costPerRedemption)}
              </span>
              <span className="text-xs text-dim">لكل استرداد</span>
            </div>
            <p className="mt-2 text-xs text-gold-3">{tier.tagline}</p>
            <ul className="mt-4 space-y-2">
              {tier.features.map((f) => (
                <li
                  key={f.label}
                  className={cn(
                    "flex items-start gap-2 text-sm",
                    f.included ? "text-warm-white" : "text-dimmer"
                  )}
                >
                  <Icon
                    name={f.included ? "check" : "lock"}
                    size={16}
                    className={f.included ? "text-gold-2" : "text-dimmer"}
                    aria-hidden
                  />
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>
            {readOnly && showCta && (
              <Button href="/login" size="sm" fullWidth className="mt-6">
                {ctaLabel ?? "Start"}
              </Button>
            )}
          </>
        );

        if (readOnly) {
          return (
            <GlassCard key={tier.id} featured={featured} className="relative h-full">
              {content}
            </GlassCard>
          );
        }

        return (
          <button
            key={tier.id}
            type="button"
            onClick={() => onSelect(tier.id)}
            className={cn(
              "h-full w-full rounded-2xl text-right",
              isSelected && "ring-2 ring-gold-2"
            )}
          >
            <GlassCard featured={featured} className="relative h-full">
              {content}
            </GlassCard>
          </button>
        );
      })}
    </div>
  );
}
