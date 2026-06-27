"use client";

import { LandingStatValue } from "@/components/landing/LandingStatValue";
import { pickFeaturedStatIndex } from "@/lib/landing/public-stat-display";
import { DataDepthCard } from "@/components/ui/DataDepthCard";
import { Section } from "@/components/ui/Section";
import { H2 } from "@/components/ui/Typography";
import { useLocale } from "@/lib/i18n";
import type { IconName } from "@/components/ui/Icon";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";

interface LandingTrustStatsProps {
  activeCampaigns: number;
  sparkVolume: number;
  weeklyRedemptions: number;
  updatedAt?: string;
}

export function LandingTrustStats({
  activeCampaigns,
  sparkVolume,
  weeklyRedemptions,
  updatedAt,
}: LandingTrustStatsProps) {
  const { t } = useLocale();

  const values = [activeCampaigns, sparkVolume, weeklyRedemptions];
  const items: { icon: IconName; value: number; labelKey: string }[] = [
    { icon: "megaphone", value: activeCampaigns, labelKey: "landing.stats.activeCampaigns" },
    { icon: "spark", value: sparkVolume, labelKey: "landing.stats.sparkVolume" },
    { icon: "gift", value: weeklyRedemptions, labelKey: "landing.stats.weeklyRedemptions" },
  ];

  const featuredIndex = pickFeaturedStatIndex(values);

  const freshnessLabel = updatedAt
    ? `${t("landing.trust.updatedPrefix")} ${updatedAt}`
    : t("landing.trust.updatedLive");

  return (
    <Section variant="surface">
      <LandingScrollReveal>
        <H2 className="mb-2 text-center text-gold-1">{t("landing.stats.headline")}</H2>
        <p className="mb-10 text-center text-xs text-text-tertiary">{freshnessLabel}</p>
      </LandingScrollReveal>
      <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
        {items.map((item, i) => (
          <LandingScrollReveal key={item.labelKey} delay={i * 0.1}>
            {i === featuredIndex ? (
              <DataDepthCard
                elevation={4}
                featured
                icon={item.icon}
                title={t(item.labelKey)}
                value={<LandingStatValue value={item.value} />}
              />
            ) : (
              <DataDepthCard
                elevation={2}
                icon={item.icon}
                title={t(item.labelKey)}
                value={<LandingStatValue value={item.value} className="inline" />}
              />
            )}
          </LandingScrollReveal>
        ))}
      </div>
    </Section>
  );
}
