"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { SponsorVerifiedBadge } from "@/components/sponsor/SponsorVerifiedBadge";
import { n } from "@/lib/format";
import { useLocale } from "@/lib/i18n";
import type { FeaturedCaseStudy } from "@/lib/landing/case-study";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";

export function LandingLiveCaseStudy({
  study,
  testimonialQuote,
  testimonialAuthor,
}: {
  study: FeaturedCaseStudy;
  testimonialQuote?: string | null;
  testimonialAuthor?: string | null;
}) {
  const { t } = useLocale();
  const qrSrc = study.primaryCode
    ? `/api/qr/${encodeURIComponent(study.primaryCode)}?format=png`
    : null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <LandingScrollReveal>
        <p className="mb-2 text-center text-sm text-gold-2">{t("landing.caseStudy.eyebrow")}</p>
        <h2 className="mb-2 text-center text-2xl font-semibold text-warm-white md:text-3xl">
          {study.sponsor.name} × {study.creator.name}
        </h2>
        <p className="mb-8 text-center font-mono text-sm text-dim">{study.creator.handle}</p>
        {testimonialQuote && (
          <blockquote className="mx-auto mb-8 max-w-2xl text-center text-lg italic text-dim">
            «{testimonialQuote}»
            {testimonialAuthor && (
              <footer className="mt-2 text-sm not-italic text-gold-2">— {testimonialAuthor}</footer>
            )}
          </blockquote>
        )}
      </LandingScrollReveal>

      <LandingScrollReveal delay={0.1}>
        <GlassCard className="grid gap-8 lg:grid-cols-2" featured>
          <div className="space-y-4">
            <p className="text-lg text-warm-white">{study.title}</p>
            <p className="text-dim">{study.prizeName}</p>
            {study.sponsor.verified && <SponsorVerifiedBadge />}
            <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
              {[
                { label: t("landing.caseStudy.views"), value: n(study.funnel.views) },
                { label: t("landing.caseStudy.redemptions"), value: n(study.prizeClaimed) },
                { label: t("landing.caseStudy.days"), value: n(study.durationDays) },
                { label: t("landing.caseStudy.roi"), value: `${study.roiEstimate}x` },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  className="rounded-lg border border-gold-4/15 bg-surface-2/40 p-3 text-center"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <p className="font-mono text-xl text-gold-1 md:text-2xl">{stat.value}</p>
                  <p className="text-xs text-dim">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {study.slug && (
                <Button href={`/campaign/${study.slug}`} variant="secondary">
                  {t("landing.caseStudy.viewCampaign")}
                </Button>
              )}
              {study.primaryCode && (
                <Button href={`/c/${study.primaryCode}`} variant="ghost">
                  {t("landing.caseStudy.tryCode")}
                </Button>
              )}
            </div>
          </div>
          {qrSrc && (
            <div className="flex flex-col items-center justify-center">
              <motion.div
                animate={{ boxShadow: ["0 0 20px rgba(212,168,85,0.15)", "0 0 40px rgba(212,168,85,0.3)", "0 0 20px rgba(212,168,85,0.15)"] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="rounded-xl"
              >
                <Image
                  src={qrSrc}
                  alt="QR"
                  width={180}
                  height={180}
                  unoptimized
                  className="rounded-xl bg-white p-3"
                />
              </motion.div>
              <p className="mt-3 font-mono text-xs text-dim">{study.primaryCode}</p>
              {study.sponsor.logoUrl && (
                <Image
                  src={study.sponsor.logoUrl}
                  alt={study.sponsor.name}
                  width={48}
                  height={48}
                  className="mt-4 opacity-80"
                  unoptimized
                />
              )}
            </div>
          )}
        </GlassCard>
      </LandingScrollReveal>
    </section>
  );
}
