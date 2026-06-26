"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import { useLocale } from "@/lib/i18n";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";
import { trackLandingEvent } from "@/lib/analytics/landing-events";

const faqKeys = ["q1", "q2", "q3", "q4", "q5"] as const;

export function LandingFaq() {
  const { t } = useLocale();
  const [open, setOpen] = useState<string | null>("q1");

  function toggle(key: string) {
    const isOpen = open === key;
    if (!isOpen) {
      trackLandingEvent("landing_faq_expand", {
        section: "faq",
        ctaLabel: t(`landing.faq.${key}`),
        metadata: { questionKey: key },
      });
    }
    setOpen(isOpen ? null : key);
  }

  return (
    <Section id="faq" variant="surface">
      <LandingScrollReveal>
        <SectionHeader title={t("landing.faq.title")} description={t("landing.faq.leadIn")} centered />
      </LandingScrollReveal>
      <div className="mx-auto max-w-2xl space-y-3">
        {faqKeys.map((key, i) => {
          const isOpen = open === key;
          return (
            <LandingScrollReveal key={key} delay={i * 0.05}>
              <GlassCard innerClassName="p-0">
                <button
                  type="button"
                  className="focus-ring flex w-full items-center justify-between gap-4 p-5 text-start"
                  onClick={() => toggle(key)}
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-warm-white">{t(`landing.faq.${key}`)}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Icon name="chevronDown" size={18} className="shrink-0 text-gold-2" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-dim">
                        {t(`landing.faq.a${key.slice(1)}`)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </LandingScrollReveal>
          );
        })}
      </div>
    </Section>
  );
}
