"use client";

import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";
import { useLocale } from "@/lib/i18n";

type Props = {
  creators: number;
  sponsors: number;
  weeklyRedemptions: number;
};

export function LandingNetworkBar({ creators, sponsors, weeklyRedemptions }: Props) {
  const { t } = useLocale();

  const items = [
    { value: creators, label: t("landing.network.creators") },
    { value: sponsors, label: t("landing.network.sponsors") },
    { value: weeklyRedemptions, label: t("landing.network.redemptions") },
  ];

  return (
    <LandingScrollReveal y={24}>
      <div className="border-y border-gold-4/15 bg-surface/50 py-6 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 px-4 text-center text-sm">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1">
              <AnimatedNumber
                value={item.value}
                className="font-mono text-2xl text-gold-1"
              />
              <span className="text-dim">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </LandingScrollReveal>
  );
}
