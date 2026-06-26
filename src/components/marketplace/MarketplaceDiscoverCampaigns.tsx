"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { SponsorVerifiedBadge } from "@/components/sponsor/SponsorVerifiedBadge";

type DiscoverCampaign = {
  id: string;
  title: string;
  prizeName: string;
  prizeClaimed: number;
  prizeQuantity: number;
  city: string | null;
  slug: string | null;
  creator: { name: string; handle: string };
  sponsor: { name: string; verified: boolean };
};

export function MarketplaceDiscoverCampaigns({
  campaigns,
}: {
  campaigns: DiscoverCampaign[];
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((c) => (
        <GlassCard
          key={c.id}
          interactive
          className="transition-all duration-200 hover:-translate-y-1 hover:shadow-elevated"
        >
          <p className="font-medium text-warm-white">{c.title}</p>
          <p className="text-sm text-dim">
            {c.creator.name} (@{c.creator.handle}) × {c.sponsor.name}
            {c.sponsor.verified && <SponsorVerifiedBadge className="ms-1 inline" />}
          </p>
          <p className="mt-2 text-sm text-gold-1">{c.prizeName}</p>
          <p className="text-xs text-dim">
            {c.prizeClaimed}/{c.prizeQuantity} — {c.city ?? "كل المدن"}
          </p>
          {c.slug && (
            <Link
              href={`/campaign/${c.slug}`}
              className="mt-3 inline-block text-xs text-gold-2 hover:underline"
            >
              عرض الحملة
            </Link>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
