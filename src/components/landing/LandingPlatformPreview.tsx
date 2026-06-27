"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LandingStatValue } from "@/components/landing/LandingStatValue";
import { useLocale } from "@/lib/i18n";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";
import { cn } from "@/lib/utils";

type PreviewStats = {
  activeCampaigns: number;
  weeklyRedemptions: number;
  sparkVolume: number;
};

const TABS = ["creator", "sponsor", "follower"] as const;

export function LandingPlatformPreview({ stats }: { stats: PreviewStats }) {
  const { t } = useLocale();
  const [tab, setTab] = useState<(typeof TABS)[number]>("creator");

  return (
    <Section id="platform-preview">
      <LandingScrollReveal>
        <SectionHeader
          title={t("landing.preview.title")}
          description={t("landing.preview.subtitle")}
          centered
        />
      </LandingScrollReveal>
      <LandingScrollReveal delay={0.1}>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {TABS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                tab === key
                  ? "border-spotlight bg-gold-rich/15 text-gold-accent"
                  : "border-subtle text-text-secondary hover:border-default"
              )}
            >
              {t(`landing.preview.tab.${key}`)}
            </button>
          ))}
        </div>
        <div className="mt-8 overflow-hidden rounded-2xl border border-default bg-bg-surface shadow-elevated">
          <div className="border-b border-subtle px-6 py-4">
            <p className="font-brand text-lg text-gold-accent">{t(`landing.preview.${tab}Headline`)}</p>
            <p className="text-sm text-text-secondary">{t(`landing.preview.${tab}Desc`)}</p>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-3">
            <div className="rounded-xl border border-subtle bg-bg-elevated p-4 text-center">
              <p className="text-xs text-text-muted">{t("landing.stats.activeCampaigns")}</p>
              <p className="mt-1 font-mono text-2xl text-gold-accent">
                <LandingStatValue value={stats.activeCampaigns} />
              </p>
            </div>
            <div className="rounded-xl border border-subtle bg-bg-elevated p-4 text-center">
              <p className="text-xs text-text-muted">{t("landing.stats.weeklyRedemptions")}</p>
              <p className="mt-1 font-mono text-2xl text-gold-accent">
                <LandingStatValue value={stats.weeklyRedemptions} />
              </p>
            </div>
            <div className="rounded-xl border border-subtle bg-bg-elevated p-4 text-center">
              <p className="text-xs text-text-muted">{t("landing.stats.sparkVolume")}</p>
              <p className="mt-1 font-mono text-2xl text-gold-accent">
                <LandingStatValue value={stats.sparkVolume} />
              </p>
            </div>
          </div>
          <div className="border-t border-subtle bg-bg-elevated/50 px-6 py-4">
            <div className="flex h-24 items-end gap-2">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-gold-deep to-gold-accent opacity-80"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </LandingScrollReveal>
    </Section>
  );
}
