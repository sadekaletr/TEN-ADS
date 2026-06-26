"use client";

import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLocale } from "@/lib/i18n";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";

const CELLS: { key: string; icon: IconName; span: string }[] = [
  { key: "campaign", icon: "rocket", span: "md:col-span-2 md:row-span-2" },
  { key: "qr", icon: "spark", span: "" },
  { key: "redeem", icon: "gift", span: "" },
  { key: "roi", icon: "storefront", span: "md:col-span-2" },
  { key: "treasury", icon: "wallet", span: "" },
  { key: "agency", icon: "handshake", span: "" },
];

export function LandingBentoGrid() {
  const { t } = useLocale();

  return (
    <Section variant="surface">
      <LandingScrollReveal>
        <SectionHeader
          title={t("landing.bento.title")}
          description={t("landing.bento.subtitle")}
          centered
        />
      </LandingScrollReveal>
      <div className="mt-10 grid auto-rows-[minmax(140px,auto)] gap-4 md:grid-cols-4">
        {CELLS.map((cell, i) => (
          <LandingScrollReveal key={cell.key} delay={i * 0.06} className={cell.span}>
            <div className={`bento-cell h-full ${cell.span}`}>
              <Icon name={cell.icon} size={28} className="text-gold-rich" />
              <h3 className="mt-4 font-brand text-lg text-text-primary">
                {t(`landing.bento.${cell.key}Title`)}
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                {t(`landing.bento.${cell.key}Desc`)}
              </p>
            </div>
          </LandingScrollReveal>
        ))}
      </div>
    </Section>
  );
}
