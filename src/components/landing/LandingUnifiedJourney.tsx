"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Muted } from "@/components/ui/Typography";
import { useLocale } from "@/lib/i18n";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";

const STEPS: { key: string; icon: IconName }[] = [
  { key: "step1", icon: "rocket" },
  { key: "step2", icon: "megaphone" },
  { key: "step3", icon: "gift" },
  { key: "step4", icon: "star" },
];

export function LandingUnifiedJourney() {
  const { t } = useLocale();

  return (
    <Section id="how-it-works" variant="contrast">
      <LandingScrollReveal>
        <SectionHeader
          title={t("landing.sparkJourney.title")}
          description={t("landing.sparkJourney.subtitle")}
          centered
        />
      </LandingScrollReveal>
      <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <LandingScrollReveal key={step.key} delay={i * 0.08}>
            <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }}>
              <GlassCard interactive className="relative h-full" innerClassName="p-6">
                <span className="absolute start-4 top-4 font-mono text-xs text-gold-rich/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon name={step.icon} size={32} className="mx-auto mt-4 text-gold-rich" />
                <p className="mt-4 text-center font-brand text-lg text-gold-accent">
                  {t(`landing.sparkJourney.${step.key}Title`)}
                </p>
                <Muted className="mt-2 text-center">{t(`landing.sparkJourney.${step.key}Desc`)}</Muted>
              </GlassCard>
            </motion.div>
          </LandingScrollReveal>
        ))}
      </div>
    </Section>
  );
}
