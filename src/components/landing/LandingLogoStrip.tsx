"use client";

import Image from "next/image";
import { Muted } from "@/components/ui/Typography";
import { useLocale } from "@/lib/i18n";
import type { LandingSponsorLogo } from "@/lib/landing/sponsors";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";
import { SponsorVerifiedBadge } from "@/components/sponsor/SponsorVerifiedBadge";

export function LandingLogoStrip({ sponsors }: { sponsors: LandingSponsorLogo[] }) {
  const { t } = useLocale();

  if (sponsors.length === 0) return null;

  const doubled = [...sponsors, ...sponsors];

  return (
    <LandingScrollReveal>
      <div className="border-y border-gold-4/10 bg-surface/30 py-10">
        <p className="mb-8 text-center text-sm text-dim">{t("landing.logos.title")}</p>
        <div className="relative overflow-hidden mask-fade-x">
          <div className="landing-marquee-track gap-12 px-6">
            {doubled.map((s, i) => (
              <div
                key={`${s.id}-${i}`}
                className="flex shrink-0 items-center gap-3 rounded-xl border border-gold-4/15 bg-surface-2/50 px-5 py-3"
              >
                {s.logoUrl ? (
                  <Image
                    src={s.logoUrl}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain opacity-90"
                    unoptimized
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-2/15 text-xs font-bold text-gold-1">
                    {s.name.charAt(0)}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <Muted className="whitespace-nowrap font-brand text-sm text-dim">
                    {s.name}
                  </Muted>
                  {s.verified && <SponsorVerifiedBadge className="scale-90" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LandingScrollReveal>
  );
}
