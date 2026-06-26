"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n";
import type { LandingFeaturedCampaign } from "@/lib/landing/featured-campaigns";

type Props = {
  campaigns: LandingFeaturedCampaign[];
  fromDb: boolean;
};

function progressPct(claimed: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((claimed / total) * 100));
}

export function LandingFeaturedOffersStrip({ campaigns, fromDb }: Props) {
  const { t } = useLocale();

  return (
    <section className="relative border-y border-subtle bg-bg-surface/80 py-10 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gold-rich/5 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gold-rich">
              {t("landing.offers.eyebrow")}
            </p>
            <h2 className="font-brand text-xl text-text-primary md:text-2xl">
              {t("landing.offers.headline")}
            </h2>
          </div>
          <Button href="/marketplace/discover" size="sm" variant="secondary" icon={<Icon name="gift" size={16} />}>
            {t("nav.discover")}
          </Button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {campaigns.map((c) => {
            const pct = progressPct(c.prizeClaimed, c.prizeQuantity);
            const href = c.slug ? `/campaign/${c.slug}` : "/marketplace/discover";
            return (
              <Link
                key={c.id}
                href={href}
                className="landing-offer-card group min-w-[300px] max-w-[320px] shrink-0 snap-start rounded-xl border border-default bg-bg-elevated p-5 shadow-card transition-all hover:-translate-y-1 hover:border-spotlight"
              >
                <div
                  className="mb-3 h-16 rounded-lg bg-gradient-to-br from-gold-rich/20 to-bg-base"
                  aria-hidden
                />
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full border border-strong bg-gold-rich/10 px-2 py-0.5 text-[10px] text-gold-accent">
                    {c.city ?? t("landing.offers.allCities")}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-text-muted">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                    {t("landing.offers.live")}
                  </span>
                </div>
                <p className="mt-3 line-clamp-1 font-semibold text-text-primary group-hover:text-gold-accent">
                  {c.title}
                </p>
                <p className="mt-1 line-clamp-1 text-sm text-gold-rich">{c.prizeName}</p>
                <p className="mt-2 text-xs text-text-secondary">
                  @{c.creator.handle.replace(/^@/, "")} × {c.sponsor.name}
                </p>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-[10px] text-text-muted">
                    <span>{t("landing.offers.claimed")}</span>
                    <span className="font-mono text-gold-accent">
                      {c.prizeClaimed}/{c.prizeQuantity}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-bg-base">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold-accent transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {!fromDb && (
          <p className="mt-3 text-center text-[11px] text-text-muted">{t("landing.offers.sampleNote")}</p>
        )}
      </div>
    </section>
  );
}
