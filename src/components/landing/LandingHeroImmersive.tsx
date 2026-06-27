"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Typography";
import { LandingAurora } from "@/components/landing/LandingAurora";
import { LandingSparkParticles } from "@/components/landing/LandingSparkParticles";
import { LandingStatValue } from "@/components/landing/LandingStatValue";
import { useLocale } from "@/lib/i18n";
import { trackLandingEvent } from "@/lib/analytics/landing-events";
import { getLandingExperiment } from "@/lib/landing/experiment";
import { isPublicStatEmpty } from "@/lib/landing/public-stat-display";
import { homeHash } from "@/lib/nav-links";
import { TOKENS } from "@/styles/tokens";
import { fadeUp, scaleIn } from "@/lib/motion/variants";
import { transition } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

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
    <div className="landing-demo-frame relative z-0 w-full max-w-lg overflow-hidden rounded-2xl border border-strong bg-bg-surface shadow-elevated">
      <div className="flex items-center gap-2 border-b border-subtle px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
        <span className="ms-auto font-mono text-xs text-text-tertiary">TENEGTA Spark</span>
      </div>
      <div className="grid gap-4 p-6 md:grid-cols-2">
        <div className="rounded-xl border border-subtle bg-bg-elevated p-4">
          <p className="text-xs text-text-secondary">{t("landing.hero.mock.redeem")}</p>
          <p className="mt-2 font-mono text-lg text-gold-accent">SPARK-42</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-base">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-gold-rich to-gold-accent" />
          </div>
        </div>
        <div className="rounded-xl border border-subtle bg-bg-elevated p-4">
          <p className="text-xs text-text-secondary">{t("landing.hero.mock.dashboard")}</p>
          <p className="mt-2 font-mono text-2xl text-gold-accent">847</p>
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

type ChipSpec = {
  id: string;
  label: string;
  value: number;
  position: string;
  showFrom?: "md" | "xl";
};

function FloatingChip({
  label,
  value,
  position,
  animate,
}: {
  label: string;
  value: number;
  position: string;
  animate: boolean;
}) {
  const chip = (
    <div className="max-w-[11rem] rounded-xl border border-strong bg-bg-surface/95 px-3 py-2 shadow-card backdrop-blur-md">
      <p className="truncate text-xs text-text-tertiary">{label}</p>
      <p className="font-mono text-sm font-bold text-gold-accent">
        <LandingStatValue value={value} />
      </p>
    </div>
  );

  if (!animate) {
    return <div className={cn("pointer-events-none absolute z-20", position)}>{chip}</div>;
  }

  return (
    <motion.div
      className={cn("pointer-events-none absolute z-20", position)}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {chip}
    </motion.div>
  );
}

export function LandingHeroImmersive({ stats }: { stats: HeroStats }) {
  const { t } = useLocale();
  const reducedMotion = useReducedMotion();
  const experiment = getLandingExperiment();
  const motionOn = !reducedMotion;

  const chips: ChipSpec[] = (
    [
      {
        id: "campaigns",
        label: t("landing.stats.activeCampaigns"),
        value: stats.activeCampaigns,
        position: "start-0 top-4 md:-start-4 md:top-6",
        showFrom: "md" as const,
      },
      {
        id: "redemptions",
        label: t("landing.stats.weeklyRedemptions"),
        value: stats.weeklyRedemptions,
        position: "end-0 bottom-8 md:-end-4 md:bottom-12",
        showFrom: "md" as const,
      },
      {
        id: "spark",
        label: t("landing.stats.sparkVolume"),
        value: stats.sparkVolume,
        position: "end-2 top-2 xl:end-0 xl:-top-2",
        showFrom: "xl" as const,
      },
    ] as ChipSpec[]
  ).filter((c) => !isPublicStatEmpty(c.value) || c.id !== "spark");

  const reveal = (delay = 0) =>
    motionOn
      ? {
          initial: fadeUp.initial,
          animate: fadeUp.animate,
          transition: { ...transition.normal, delay },
        }
      : {};

  return (
    <section className="relative min-h-[100dvh] overflow-hidden px-4 pb-16 pt-6 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <LandingAurora />
        <LandingSparkParticles />
      </div>
      <div className="hero-spotlight pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg-base"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{ background: TOKENS.gradient.heroGlow }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-start">
          <motion.div {...reveal(0)}>
            <Eyebrow className="mb-6 inline-flex items-center gap-2 rounded-full border border-strong bg-bg-surface/90 px-4 py-2 shadow-surface backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-rich" />
              {t(heroKey(experiment, "eyebrow"))}
            </Eyebrow>
          </motion.div>
          <motion.div {...reveal(0.06)}>
            <h1
              className={`${TOKENS.type.heroTitle} max-w-[14ch] font-brand text-text-primary lg:max-w-[16ch]`}
            >
              {t(heroKey(experiment, "title"))}{" "}
              <span className="text-gradient-gold">{t(heroKey(experiment, "titleHighlight"))}</span>{" "}
              {t(heroKey(experiment, "titleSuffix"))}
            </h1>
          </motion.div>
          <motion.p
            className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-text-secondary lg:mx-0"
            {...reveal(0.12)}
          >
            {t(heroKey(experiment, "subtitle"))}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start"
            {...reveal(0.18)}
          >
            <Button
              href="/login"
              size="lg"
              variant="primary"
              glow
              className="min-h-12 w-full sm:w-auto"
              icon={<Icon name="rocket" size={20} />}
              onClick={() =>
                trackLandingEvent("landing_cta_creator_click", {
                  section: "hero",
                  ctaLabel: t(heroKey(experiment, "ctaCreator")),
                  experiment,
                })
              }
            >
              {t(heroKey(experiment, "ctaCreator"))}
            </Button>
            <Button
              href="/sponsor/login"
              size="lg"
              variant="secondary"
              className="min-h-12 w-full sm:w-auto"
              icon={<Icon name="storefront" size={20} />}
            >
              {t(heroKey(experiment, "ctaSponsor"))}
            </Button>
            <Button
              href={homeHash("product-film")}
              size="lg"
              variant="ghost"
              className="min-h-12 w-full sm:w-auto"
              icon={<Icon name="spark" size={20} />}
            >
              {t("landing.hero.ctaHowItWorks")}
            </Button>
          </motion.div>
          <motion.p className="mt-6 text-xs text-text-tertiary" {...reveal(0.24)}>
            {t(heroKey(experiment, "trustLine"))}
          </motion.p>
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-lg lg:mx-0 lg:justify-self-end"
          initial={motionOn ? scaleIn.initial : false}
          animate={scaleIn.animate}
          transition={{ ...transition.slow, delay: 0.1 }}
        >
          <div className="landing-hero-glow absolute inset-0 -z-10 scale-110 rounded-full blur-3xl" />
          <div className="relative min-h-[320px] md:min-h-[360px]">
            {chips.map((chip) => (
              <FloatingChip
                key={chip.id}
                label={chip.label}
                value={chip.value}
                position={cn(
                  chip.position,
                  chip.showFrom === "xl" ? "hidden xl:block" : "hidden md:block"
                )}
                animate={motionOn}
              />
            ))}
            <div className="relative z-10 flex justify-center pt-6 md:pt-10">
              <ProductMock />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
