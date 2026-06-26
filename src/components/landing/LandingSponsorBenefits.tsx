"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";

const benefitIcons: IconName[] = ["handshake", "star", "wallet", "megaphone"];

export function LandingSponsorBenefits() {
  const { t } = useLocale();
  const keys = ["b1", "b2", "b3", "b4"] as const;

  return (
    <Section>
      <LandingScrollReveal>
        <SectionHeader
          title={t("landing.sponsorBenefits.title")}
          description={t("landing.sponsorBenefits.subtitle")}
        />
      </LandingScrollReveal>
      <ul className="mb-8 space-y-3">
        {keys.map((key, i) => (
          <LandingScrollReveal key={key} delay={i * 0.06}>
            <motion.li
              className="flex items-start gap-3 rounded-lg border border-gold-4/10 bg-surface-2/30 px-4 py-3 text-dim"
              whileHover={{ x: 4, borderColor: "rgba(212,168,85,0.25)" }}
            >
              <Icon name={benefitIcons[i]} size={20} className="mt-0.5 shrink-0 text-gold-2" />
              <span>{t(`landing.sponsorBenefits.${key}`)}</span>
            </motion.li>
          </LandingScrollReveal>
        ))}
      </ul>
      <Button href="/sponsor/login" className="min-h-11">
        {t("landing.sponsorBenefits.cta")}
      </Button>
    </Section>
  );
}
