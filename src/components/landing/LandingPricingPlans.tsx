"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SparkIcon } from "@/components/ui/SparkIcon";
import { useLocale } from "@/lib/i18n";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";
import { PRICING_PLANS, type PricingPlan } from "@/lib/landing/pricing-plans";
import { trackLandingEvent } from "@/lib/analytics/landing-events";
import { cn } from "@/lib/utils";
import { transition } from "@/lib/motion/tokens";

function PricingCard({ plan, yearly }: { plan: PricingPlan; yearly: boolean }) {
  const { t } = useLocale();
  const reducedMotion = useReducedMotion();
  const planKey = `landing.pricing.plans.${plan.id}`;

  return (
    <motion.div
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-bg-surface p-6 transition-[transform,box-shadow,border-color] duration-[220ms]",
        plan.featured
          ? "border-strong shadow-pricing-featured"
          : "border-subtle shadow-surface",
        plan.enterprise && "bg-gradient-to-b from-gold-rich/5 to-bg-surface",
        !reducedMotion && "hover:-translate-y-0.5 hover:border-strong hover:shadow-elevated"
      )}
      whileHover={reducedMotion ? undefined : { y: -2 }}
      transition={transition.fast}
    >
      {plan.featured && (
        <span className="absolute -top-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gold-rich px-3 py-1 text-xs font-semibold text-void shadow-card">
          <Icon name="star" size={12} weight="fill" />
          {t("landing.pricing.featuredBadge")}
        </span>
      )}

      <div className="text-center">
        <h3 className="font-brand text-xl text-text-primary">{t(`${planKey}.title`)}</h3>
        <p className="mt-1 text-sm text-text-secondary">{t(`${planKey}.subtitle`)}</p>
      </div>

      <div className="my-6 flex flex-col items-center">
        <SparkIcon size={32} />
        <p className="mt-3 font-brand text-5xl tabular-nums text-gold-accent">{plan.spark}</p>
        <p className="text-sm text-text-secondary">Spark</p>
        {yearly && (
          <span className="mt-2 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
            {t("landing.pricing.toggle.saveLabel")}
          </span>
        )}
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {plan.featureKeys.map((key) => (
          <li key={key} className="flex items-start gap-2 text-sm text-text-secondary">
            <Icon name="check" size={16} className="mt-0.5 shrink-0 text-gold-accent" weight="bold" />
            <span>{t(key)}</span>
          </li>
        ))}
      </ul>

      <Button
        href={`/login?plan=${plan.id}`}
        variant={plan.featured ? "primary" : "secondary"}
        glow={plan.featured}
        fullWidth
        className="min-h-12"
        onClick={() =>
          trackLandingEvent("landing_pricing_plan_click", {
            section: "pricing",
            ctaLabel: t(`${planKey}.cta`),
            metadata: { plan: plan.id, spark: plan.spark },
          })
        }
      >
        {t(`${planKey}.cta`)}
      </Button>
    </motion.div>
  );
}

export function LandingPricingPlans() {
  const { t } = useLocale();
  const [yearly, setYearly] = useState(false);

  return (
    <Section id="pricing">
      <LandingScrollReveal>
        <SectionHeader
          title={t("landing.pricing.title")}
          description={t("landing.pricing.subtitle")}
          centered
        />
      </LandingScrollReveal>

      <LandingScrollReveal delay={0.05}>
        <div className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full border border-subtle bg-bg-elevated p-1">
          <button
            type="button"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              !yearly ? "bg-bg-surface text-text-primary shadow-surface" : "text-text-secondary"
            )}
            onClick={() => setYearly(false)}
          >
            {t("landing.pricing.toggle.monthly")}
          </button>
          <button
            type="button"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              yearly ? "bg-bg-surface text-text-primary shadow-surface" : "text-text-secondary"
            )}
            onClick={() => setYearly(true)}
          >
            {t("landing.pricing.toggle.yearly")}
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-text-tertiary">
          {t("landing.pricing.toggle.note")}
        </p>
      </LandingScrollReveal>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {PRICING_PLANS.map((plan, i) => (
          <LandingScrollReveal key={plan.id} delay={0.08 + i * 0.06}>
            <PricingCard plan={plan} yearly={yearly} />
          </LandingScrollReveal>
        ))}
      </div>

      <LandingScrollReveal delay={0.2}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {(["secure", "transparent", "noFees"] as const).map((key) => (
            <span
              key={key}
              className="inline-flex items-center gap-2 rounded-full border border-subtle bg-bg-surface px-4 py-2 text-sm text-text-secondary shadow-surface"
            >
              <Icon
                name={key === "secure" ? "lock" : key === "transparent" ? "sealCheck" : "check"}
                size={16}
                className="text-gold-accent"
              />
              {t(`landing.pricing.trust.${key}`)}
            </span>
          ))}
        </div>
      </LandingScrollReveal>
    </Section>
  );
}
