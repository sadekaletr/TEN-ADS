"use client";

import { Button } from "@/components/ui/Button";
import { HeroSpotlightPanel } from "@/components/ui/HeroSpotlightPanel";
import { SparkPulseCard } from "@/components/ui/SparkPulseCard";
import { CreatorSpotlightCard } from "@/components/creators/CreatorSpotlightCard";
import type { CreatorCardData } from "@/lib/creators/getFeaturedCreators";
import { n } from "@/lib/format";
import { useLocale } from "@/lib/i18n";

interface CreatorHeroProps {
  activeCampaigns: number;
  weeklyRedemptions: number;
  featuredCreator?: CreatorCardData | null;
}

export function CreatorHero({
  activeCampaigns,
  weeklyRedemptions,
  featuredCreator,
}: CreatorHeroProps) {
  const { t } = useLocale();

  return (
    <HeroSpotlightPanel
      className="min-h-[70vh] px-4 md:px-6"
      eyebrow={
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-gold-2">
          {t("creators.hero.eyebrow")}
        </p>
      }
      title={
        <h1 className="text-gradient-gold font-brand text-3xl font-bold md:text-5xl">
          {t("creators.hero.title")}
        </h1>
      }
      subtitle={t("creators.hero.subtitle")}
      visual={
        featuredCreator ? (
          <CreatorSpotlightCard creator={featuredCreator} size="hero" preview />
        ) : undefined
      }
    >
      <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
        <SparkPulseCard
          label={t("creators.hero.statCampaigns")}
          value={n(activeCampaigns)}
          pulse
          className="min-w-[140px]"
        />
        <SparkPulseCard
          label={t("creators.hero.statRedemptions")}
          value={n(weeklyRedemptions)}
          className="min-w-[140px]"
        />
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
        <Button href="/login" variant="primary">
          {t("creators.hero.ctaCreator")}
        </Button>
        <Button href="/sponsor/login" variant="secondary">
          {t("creators.hero.ctaSponsor")}
        </Button>
      </div>
    </HeroSpotlightPanel>
  );
}
