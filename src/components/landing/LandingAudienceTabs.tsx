"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";
import { cn } from "@/lib/utils";

const TABS = ["creator", "sponsor"] as const;

const BENEFIT_ICONS: Record<(typeof TABS)[number], IconName[]> = {
  creator: ["rocket", "spark", "gift", "star"],
  sponsor: ["handshake", "star", "wallet", "megaphone"],
};

export function LandingAudienceTabs() {
  const { t } = useLocale();
  const [tab, setTab] = useState<(typeof TABS)[number]>("creator");
  const keys = ["b1", "b2", "b3", "b4"] as const;
  const prefix = tab === "creator" ? "landing.creatorBenefits" : "landing.sponsorBenefits";
  const ctaHref = tab === "creator" ? "/login" : "/sponsor/login";

  return (
    <Section>
      <LandingScrollReveal>
        <SectionHeader title={t("landing.audience.title")} description={t("landing.audience.subtitle")} centered />
      </LandingScrollReveal>
      <LandingScrollReveal delay={0.08}>
        <div className="mx-auto flex max-w-md justify-center gap-2 rounded-full border border-subtle bg-bg-elevated p-1">
          {TABS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                tab === key
                  ? "bg-gold-rich/20 text-gold-accent shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {t(`landing.audience.tab.${key}`)}
            </button>
          ))}
        </div>
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mx-auto mt-8 max-w-2xl"
        >
          <GlassCard innerClassName="p-8">
            <h3 className="font-brand text-2xl text-gold-accent">{t(`${prefix}.title`)}</h3>
            <p className="mt-2 text-text-secondary">{t(`${prefix}.subtitle`)}</p>
            <ul className="mt-6 space-y-3">
              {keys.map((key, i) => (
                <li
                  key={key}
                  className="flex items-start gap-3 rounded-lg border border-subtle bg-bg-elevated/50 px-4 py-3 text-text-secondary"
                >
                  <Icon name={BENEFIT_ICONS[tab][i]} size={20} className="mt-0.5 shrink-0 text-gold-rich" />
                  <span>{t(`${prefix}.${key}`)}</span>
                </li>
              ))}
            </ul>
            <Button href={ctaHref} className="mt-8 min-h-11">
              {t(`${prefix}.cta`)}
            </Button>
          </GlassCard>
        </motion.div>
      </LandingScrollReveal>
    </Section>
  );
}
