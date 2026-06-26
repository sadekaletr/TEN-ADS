"use client";

import { TierPicker } from "@/components/campaign/TierPicker";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLocale } from "@/lib/i18n";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";

export function LandingTierShowcase() {
  const { t } = useLocale();

  return (
    <Section id="pricing">
      <LandingScrollReveal>
        <SectionHeader
          title={t("landing.pricing.title")}
          description={t("landing.pricing.subtitle")}
          centered
        />
      </LandingScrollReveal>
      <LandingScrollReveal delay={0.1}>
        <TierPicker selected="PRO" onSelect={() => {}} readOnly showCta ctaLabel={t("landing.pricing.cta")} />
      </LandingScrollReveal>
    </Section>
  );
}
