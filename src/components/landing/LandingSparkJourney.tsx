"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLocale } from "@/lib/i18n";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";

const stepIcons: IconName[] = ["megaphone", "spark", "gift", "wallet"];
const stepKeys = ["step1", "step2", "step3", "step4"] as const;

export function LandingSparkJourney() {
  const { t } = useLocale();
  const reduced = useReducedMotion();

  return (
    <Section id="how-it-works" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(212,168,85,0.12), transparent)",
        }}
      />
      <LandingScrollReveal>
        <SectionHeader
          title={t("landing.sparkJourney.title")}
          description={t("landing.sparkJourney.subtitle")}
          centered
        />
      </LandingScrollReveal>

      <div className="relative mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stepKeys.map((key, i) => (
          <LandingScrollReveal key={key} delay={i * 0.08}>
            <GlassCard interactive className="relative h-full" innerClassName="p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs text-gold-2/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <motion.div
                  animate={reduced ? undefined : { rotate: [0, 6, 0] }}
                  transition={{ duration: 4, delay: i * 0.5, repeat: Infinity }}
                >
                  <Icon name={stepIcons[i]} size={28} className="text-gold-2" />
                </motion.div>
              </div>
              <h3 className="font-brand text-lg text-warm-white">
                {t(`landing.sparkJourney.${key}Title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-dim">
                {t(`landing.sparkJourney.${key}Desc`)}
              </p>
              {i < stepKeys.length - 1 && (
                <div
                  className="absolute -end-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-gold-4/40 to-transparent lg:block"
                  aria-hidden
                />
              )}
            </GlassCard>
          </LandingScrollReveal>
        ))}
      </div>
    </Section>
  );
}
