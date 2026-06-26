"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Display, Lead } from "@/components/ui/Typography";
import { useLocale } from "@/lib/i18n";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";
import { trackLandingEvent } from "@/lib/analytics/landing-events";
import { useMotionSafe } from "@/lib/motion/useMotionSafe";

export function LandingFinalCta() {
  const { t } = useLocale();
  const motionOk = useMotionSafe();

  return (
    <section className="final-cta-section px-6 py-24">
      <LandingScrollReveal>
        <motion.div
          className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-strong px-8 py-16 text-center shadow-cta-glow"
          style={{ background: "var(--final-cta-bg)" }}
          whileHover={motionOk ? { scale: 1.01 } : undefined}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Display className="relative text-3xl md:text-4xl">
            <span className="text-gradient-gold">{t("landing.finalCta.title")}</span>
          </Display>
          <Lead className="relative mx-auto mt-4 max-w-xl">{t("landing.finalCta.subtitle")}</Lead>
          <div className="relative mt-10 flex flex-wrap justify-center gap-4">
            <Button
              href="/login"
              size="lg"
              variant="primary"
              glow
              className="min-h-12"
              icon={<Icon name="rocket" size={20} />}
              onClick={() =>
                trackLandingEvent("landing_final_cta_click", {
                  section: "final_cta",
                  ctaLabel: t("landing.finalCta.ctaCreator"),
                  metadata: { target: "creator" },
                })
              }
            >
              {t("landing.finalCta.ctaCreator")}
            </Button>
            <Button
              href="/sponsor/login"
              size="lg"
              variant="secondary"
              className="min-h-12"
              icon={<Icon name="storefront" size={20} />}
              onClick={() =>
                trackLandingEvent("landing_final_cta_click", {
                  section: "final_cta",
                  ctaLabel: t("landing.finalCta.ctaSponsor"),
                  metadata: { target: "sponsor" },
                })
              }
            >
              {t("landing.finalCta.ctaSponsor")}
            </Button>
          </div>
          <p className="relative mt-6 text-xs text-text-muted">{t("landing.finalCta.trustBadges")}</p>
        </motion.div>
      </LandingScrollReveal>
    </section>
  );
}
