"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Typography";
import { HeroSpotlightPanel } from "@/components/ui/HeroSpotlightPanel";
import { MagneticPrimaryCTA } from "@/components/ui/MagneticPrimaryCTA";
import { useLocale } from "@/lib/i18n";
import { JourneyAutoplay } from "@/components/landing/JourneyAutoplay";
import { trackLandingEvent } from "@/lib/analytics/landing-events";
import { getLandingExperiment } from "@/lib/landing/experiment";

function heroKey(experiment: ReturnType<typeof getLandingExperiment>, field: string) {
  if (experiment === "variant_a") return `landing.hero.variantA.${field}`;
  if (experiment === "variant_b") return `landing.hero.variantB.${field}`;
  return `landing.hero.control.${field}`;
}

export function LandingHero() {
  const { t } = useLocale();
  const reducedMotion = useReducedMotion();
  const experiment = getLandingExperiment();

  return (
    <HeroSpotlightPanel
      eyebrow={
        <Eyebrow className="mb-5 inline-flex items-center gap-2 rounded-full border border-strong bg-surface-2/80 px-4 py-1.5 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-2" />
          {t(heroKey(experiment, "eyebrow"))}
        </Eyebrow>
      }
      title={
        <>
          {t(heroKey(experiment, "title"))}{" "}
          <span className="text-gradient-gold">{t(heroKey(experiment, "titleHighlight"))}</span>{" "}
          {t(heroKey(experiment, "titleSuffix"))}
        </>
      }
      subtitle={t(heroKey(experiment, "subtitle"))}
      visual={<JourneyAutoplay />}
    >
      <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
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
          className="min-h-12 border-strong"
          icon={<Icon name="storefront" size={20} />}
          onClick={() =>
            trackLandingEvent("landing_cta_sponsor_click", {
              section: "hero",
              ctaLabel: t(heroKey(experiment, "ctaSponsor")),
              experiment,
            })
          }
        >
          {t(heroKey(experiment, "ctaSponsor"))}
        </Button>
        <Button
          href="/marketplace/discover"
          size="lg"
          variant="secondary"
          className="min-h-12 border-gold-2/40 bg-gold-4/10 text-gold-1"
          icon={<Icon name="gift" size={20} />}
          onClick={() =>
            trackLandingEvent("landing_discover_click", {
              section: "hero",
              ctaLabel: t("nav.discover"),
              experiment,
            })
          }
        >
          {t("nav.discover")}
        </Button>
        <Button
          href="/#product-film"
          size="lg"
          variant="ghost"
          className="min-h-12 text-gold-1"
          icon={<Icon name="play" size={20} />}
          onClick={() =>
            trackLandingEvent("landing_product_film_cta", {
              section: "hero",
              ctaLabel: t("landing.productFilm.watchCta"),
              experiment,
            })
          }
        >
          {t("landing.productFilm.watchCta")}
        </Button>
      </div>
      <motion.p
        className="mt-6 text-xs text-text-tertiary"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        {t(heroKey(experiment, "trustLine"))}
      </motion.p>
    </HeroSpotlightPanel>
  );
}
