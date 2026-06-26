"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Muted } from "@/components/ui/Typography";
import { useLocale } from "@/lib/i18n";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";
import type { MarketingTestimonialData } from "@/lib/marketing/testimonials";

type LandingTestimonialsProps = {
  testimonials: MarketingTestimonialData[];
};

export function LandingTestimonials({ testimonials }: LandingTestimonialsProps) {
  const { t } = useLocale();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const items =
    testimonials.length > 0
      ? testimonials.map((item) => ({
          quote: item.quote,
          label: item.handle ? item.handle : item.author,
          role: item.author,
          avatarUrl: item.avatarUrl,
          metric: null as string | null,
        }))
      : [
          {
            quote: t("landing.testimonials.t1Quote"),
            label: t("landing.testimonials.t1Handle"),
            role: t("landing.testimonials.t1Role"),
            avatarUrl: null,
            metric: "+340% ROI",
          },
          {
            quote: t("landing.testimonials.t2Quote"),
            label: t("landing.testimonials.t2Handle"),
            role: t("landing.testimonials.t2Role"),
            avatarUrl: null,
            metric: "2.1K redemptions",
          },
          {
            quote: t("landing.testimonials.t3Quote"),
            label: t("landing.testimonials.t3Handle"),
            role: t("landing.testimonials.t3Role"),
            avatarUrl: null,
            metric: "48 campaigns",
          },
        ];

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(timer);
  }, [paused, items.length]);

  const item = items[index];

  return (
    <Section variant="surface">
      <LandingScrollReveal>
        <SectionHeader title={t("landing.testimonials.title")} centered />
      </LandingScrollReveal>
      <LandingScrollReveal delay={0.1}>
        <div
          className="mx-auto max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <motion.div key={index} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <GlassCard featured innerClassName="p-8 md:p-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {item.avatarUrl ? (
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border border-strong">
                      <Image src={item.avatarUrl} alt="" fill className="object-cover" sizes="56px" />
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-strong bg-gold-rich/10 font-brand text-lg text-gold-accent">
                      {item.label.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-text-primary">{item.label}</p>
                    {"role" in item && item.role && (
                      <Muted>{item.role}</Muted>
                    )}
                  </div>
                </div>
                {item.metric && (
                  <span className="rounded-full border border-strong bg-gold-rich/10 px-3 py-1 font-mono text-sm text-gold-accent">
                    {item.metric}
                  </span>
                )}
              </div>
              <p className="mt-6 text-lg leading-relaxed text-text-primary">&ldquo;{item.quote}&rdquo;</p>
            </GlassCard>
          </motion.div>
          <div className="mt-4 flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-8 bg-gold-rich" : "w-2 bg-text-muted/40"
                }`}
              />
            ))}
          </div>
        </div>
      </LandingScrollReveal>
    </Section>
  );
}
