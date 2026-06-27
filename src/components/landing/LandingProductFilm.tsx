"use client";

import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionCinematicDivider } from "@/components/ui/SectionCinematicDivider";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";
import { trackLandingEvent } from "@/lib/analytics/landing-events";
import { BRAND_LOGO_PATH } from "@/lib/brand";

const STEPS = ["step1", "step2", "step3"] as const;

type LandingProductFilmProps = {
  videoUrl?: string | null;
};

export function LandingProductFilm({ videoUrl }: LandingProductFilmProps) {
  const { t } = useLocale();
  const hasVideo = Boolean(videoUrl?.trim());

  return (
    <Section id="product-film">
      <LandingScrollReveal>
        <SectionHeader
          title={t("landing.productFilm.title")}
          description={t("landing.productFilm.subtitle")}
          centered
        />
      </LandingScrollReveal>

      <LandingScrollReveal delay={0.08}>
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gold-4/25 bg-surface-2/50 shadow-elevated">
          {hasVideo ? (
            <div className="aspect-video w-full">
              {videoUrl!.includes("youtube.com") || videoUrl!.includes("youtu.be") ? (
                <iframe
                  title={t("landing.productFilm.title")}
                  src={videoUrl!.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoUrl!}
                  controls
                  playsInline
                  className="h-full w-full object-cover"
                  poster={BRAND_LOGO_PATH}
                />
              )}
            </div>
          ) : (
            <div className="relative flex aspect-video flex-col items-center justify-center gap-4 bg-gradient-to-br from-void via-surface-2 to-gold-1/5 p-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold-2/40 bg-gold-2/10">
                <Icon name="play" size={32} className="text-gold-1" />
              </div>
              <p className="max-w-md text-sm text-dim">{t("landing.productFilm.placeholder")}</p>
            </div>
          )}
        </div>
      </LandingScrollReveal>

      <SectionCinematicDivider className="my-12" />

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        {STEPS.map((key, i) => (
          <LandingScrollReveal key={key} delay={0.1 + i * 0.06}>
            <div className="rounded-xl border border-gold-4/20 bg-surface-2/40 p-5 text-center">
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold-2/15 font-mono text-sm text-gold-1">
                {i + 1}
              </span>
              <h3 className="font-semibold text-warm-white">
                {t(`landing.productFilm.${key}Title`)}
              </h3>
              <p className="mt-2 text-sm text-dim">{t(`landing.productFilm.${key}Body`)}</p>
            </div>
          </LandingScrollReveal>
        ))}
      </div>

      <LandingScrollReveal delay={0.3}>
        <div className="mt-10 flex justify-center">
          <Button
            href="/redeem"
            size="lg"
            icon={<Icon name="gift" size={20} />}
            onClick={() =>
              trackLandingEvent("landing_product_film_cta", {
                section: "product-film",
                ctaLabel: t("landing.productFilm.cta"),
              })
            }
          >
            {t("landing.productFilm.cta")}
          </Button>
        </div>
      </LandingScrollReveal>
    </Section>
  );
}
