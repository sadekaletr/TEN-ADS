"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Muted } from "@/components/ui/Typography";
import { useLocale } from "@/lib/i18n";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";

export function HowItWorksSteps() {
  const { t } = useLocale();

  const steps: { titleKey: string; descKey: string; icon: IconName }[] = [
    { titleKey: "landing.howItWorks.step1Title", descKey: "landing.howItWorks.step1Desc", icon: "rocket" },
    { titleKey: "landing.howItWorks.step2Title", descKey: "landing.howItWorks.step2Desc", icon: "megaphone" },
    { titleKey: "landing.howItWorks.step3Title", descKey: "landing.howItWorks.step3Desc", icon: "gift" },
  ];

  return (
    <Section id="how-it-works">
      <LandingScrollReveal>
        <SectionHeader title={t("landing.howItWorks.title")} centered />
      </LandingScrollReveal>
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <LandingScrollReveal key={step.titleKey} delay={i * 0.1}>
            <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 280 }}>
              <GlassCard interactive className="h-full text-center" innerClassName="p-6">
                <Icon name={step.icon} size={40} className="mx-auto text-gold-2" />
                <p className="mt-4 font-brand text-lg text-gold-1">{t(step.titleKey)}</p>
                <Muted className="mt-2">{t(step.descKey)}</Muted>
              </GlassCard>
            </motion.div>
          </LandingScrollReveal>
        ))}
      </div>
    </Section>
  );
}
