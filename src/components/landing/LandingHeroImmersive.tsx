"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Typography";
import { MagneticPrimaryCTA } from "@/components/ui/MagneticPrimaryCTA";
import { LandingAurora } from "@/components/landing/LandingAurora";
import { LandingSparkParticles } from "@/components/landing/LandingSparkParticles";
import { useLocale } from "@/lib/i18n";
import { trackLandingEvent } from "@/lib/analytics/landing-events";
import { getLandingExperiment } from "@/lib/landing/experiment";
import { homeHash } from "@/lib/nav-links";
import { TOKENS } from "@/styles/tokens";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

type HeroStats = {
  activeCampaigns: number;
  weeklyRedemptions: number;
  sparkVolume: number;
};

function heroKey(experiment: ReturnType<typeof getLandingExperiment>, field: string) {
  if (experiment === "variant_a") return `landing.hero.variantA.${field}`;
  if (experiment === "variant_b") return `landing.hero.variantB.${field}`;
  return `landing.hero.control.${field}`;
}

function ProductMock() {
  const { t } = useLocale();
  return (
    <div className="landing-demo-frame relative w-full max-w-lg overflow-hidden rounded-2xl border border-default bg-bg-surface">
      <div className="flex items-center gap-2 border-b border-subtle px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
        <span className="ms-auto font-mono text-[10px] text-text-muted">TENEGTA Spark</span>
      </div>
      <div className="grid gap-4 p-6 md:grid-cols-2">
        <div className="rounded-xl border border-subtle bg-bg-elevated p-4">
          <p className="text-xs text-text-muted">{t("landing.hero.mock.redeem")}</p>
          <p className="mt-2 font-mono text-lg text-gold-accent">SPARK-42</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-base">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-gold-rich to-gold-accent" />
          </div>
        </div>
        <div className="rounded-xl border border-subtle bg-bg-elevated p-4">
          <p className="text-xs text-text-muted">{t("landing.hero.mock.dashboard")}</p>
          <p className="mt-2 font-brand text-2xl text-gold-accent">847</p>
          <p className="text-xs text-text-secondary">{t("landing.hero.mock.redemptions")}</p>
        </div>
        <div className="col-span-full rounded-xl border border-strong bg-gold-rich/5 p-4 text-center">
          <Icon name="gift" size={32} className="mx-auto text-gold-rich" />
          <p className="mt-2 text-sm font-medium text-text-primary">{t("landing.hero.mock.prize")}</p>
        </div>
      </div>
    </div>
  );
}

function FloatingChip({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`absolute z-10 rounded-xl border border-strong bg-bg-surface/95 px-3 py-2 shadow-card backdrop-blur-sm ${className ?? ""}`}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <p className="text-[10px] text-text-muted">{label}</p>
      <p className="font-mono text-sm font-bold text-gold-accent">
        <AnimatedNumber value={value} />
      </p>
    </motion.div>
  );
}

export function LandingHeroImmersive({ stats }: { stats: HeroStats }) {
  const { t } = useLocale();
  const reducedMotion = useReducedMotion();
  const experiment = getLandingExperiment();

  const fadeUp = (delay: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: "easeOut" as const },
        };

  return (
    <section className="relative min-h-[100dvh] overflow-hidden px-6 pb-16 pt-8">
      <div className="pointer-events-none absolute inset-0">
        <LandingAurora />
        <LandingSparkParticles />
      </div>
      <div className="hero-spotlight pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: TOKENS.gradient.heroGlow }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <div className="text-center lg:text-start">
          <motion.div {...fadeUp(0)}>
            <Eyebrow className="mb-5 inline-flex items-center gap-2 rounded-full border border-strong bg-bg-surface/80 px-4 py-1.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-rich" />
              {t(heroKey(experiment, "eyebrow"))}
            </Eyebrow>
          </motion.div>
          <motion.div {...fadeUp(0.08)}>
            <h1 className={`${TOKENS.type.heroTitle} font-brand text-text-primary`}>
              {t(heroKey(experiment, "title"))}{" "}
              <span className="text-gradient-gold">{t(heroKey(experiment, "titleHighlight"))}</span>{" "}
              {t(heroKey(experiment, "titleSuffix"))}
            </h1>
          </motion.div>
          <motion.p
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text-secondary lg:mx-0"
            {...fadeUp(0.16)}
          >
            {t(heroKey(experiment, "subtitle"))}
          </motion.p>
          <motion.div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start" {...fadeUp(0.24)}>
            <MagneticPrimaryCTA
              href="/login"
              label={t(heroKey(experiment, "ctaCreator"))}
              icon={<Icon name="rocket" size={20} />}
              onClick={() =>
                trackLandingEvent("landing_cta_creator_click", {
                  section: "hero",
                  ctaLabel: t(heroKey(experiment, "ctaCreator")),
                  experiment,
                })
              }
            />
            <Button
              href="/sponsor/login"
              size="lg"
              variant="secondary"
              className="min-h-12"
              icon={<Icon name="storefront" size={20} />}
            >
              {t(heroKey(experiment, "ctaSponsor"))}
            </Button>
            <Button
              href={experiment === "variant_b" ? "/c/SPARK-HERO-H1" : homeHash("product-film")}
              size="lg"
              variant="ghost"
              className="min-h-12"
              icon={<Icon name="play" size={20} />}
              onClick={() =>
                trackLandingEvent("landing_demo_click", {
                  section: "hero",
                  experiment,
                })
              }
            >
              {t(heroKey(experiment, "ctaDemo"))}
            </Button>
          </motion.div>
          <motion.p className="mt-6 text-xs text-text-muted" {...fadeUp(0.32)}>
            {t(heroKey(experiment, "trustLine"))}
          </motion.p>
        </div>

        <motion.div
          className="relative flex justify-center lg:justify-end"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className="landing-hero-glow absolute inset-0 -z-10 scale-110 rounded-full blur-3xl" />
          <FloatingChip
            label={t("landing.stats.activeCampaigns")}
            value={stats.activeCampaigns}
            className="-start-2 top-8 hidden md:block"
          />
          <FloatingChip
            label={t("landing.stats.weeklyRedemptions")}
            value={stats.weeklyRedemptions}
            className="-end-2 bottom-16 hidden md:block"
          />
          <FloatingChip
            label={t("landing.stats.sparkVolume")}
            value={stats.sparkVolume}
            className="end-4 top-0 hidden lg:block"
          />
          <ProductMock />
        </motion.div>
      </div>
    </section>
  );
}
