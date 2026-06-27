"use client";

import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useLocale } from "@/lib/i18n";
import { isPublicStatEmpty } from "@/lib/landing/public-stat-display";
import { cn } from "@/lib/utils";

type LandingStatValueProps = {
  value: number;
  className?: string;
  inviteClassName?: string;
};

export function LandingStatValue({ value, className, inviteClassName }: LandingStatValueProps) {
  const { t } = useLocale();

  if (isPublicStatEmpty(value)) {
    return (
      <span className={cn("text-sm font-medium text-gold-accent", inviteClassName)}>
        {t("landing.hero.beFirst")}
      </span>
    );
  }

  return <AnimatedNumber value={value} className={className} />;
}
