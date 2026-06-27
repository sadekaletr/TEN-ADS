"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { FoundingPartnerBadge } from "@/components/ui/FoundingPartnerBadge";
import { displayVerified } from "@/lib/plans/entitlements";
import { EmptyState } from "@/components/ui/EmptyState";
import { TrustScoreRing } from "@/components/trust/TrustScoreRing";
import { CreatorStatChips } from "@/components/creators/CreatorStatChips";
import { CampaignWall } from "@/components/creator/CampaignWall";
import { CollabRequestForm } from "@/components/marketplace/CollabRequestForm";
import { trackProductEvent } from "@/lib/analytics/product-events";
import { TOKENS } from "@/styles/tokens";
import { cn } from "@/lib/utils";

type CreatorProfile = {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string | null;
  verified: boolean;
  planTier: "STARTER" | "GROWTH" | "SCALE";
  foundingPartnerNo: number | null;
  phone: string | null;
  sparkScore: number | null;
};

type CampaignCard = {
  id: string;
  title: string;
  prizeName: string;
  slug: string | null;
  status: string;
  prizeClaimed: number;
  sponsor: { name: string; logoUrl: string | null };
};

type WallCampaign = {
  id: string;
  title: string;
  sponsorName: string;
};

interface CreatorPublicClientProps {
  creator: CreatorProfile;
  trust: { score: number; campaignsCount: number };
  activeCampaigns: CampaignCard[];
  endedCampaigns: WallCampaign[];
  sponsors: { id: string; name: string; logoUrl: string | null }[];
  totalPrizes: number;
  totalRedemptions: number;
  coverImageUrl: string | null;
  bio: string | null;
  showcaseTagline: string | null;
  categories: string[];
}

type Tab = "active" | "past" | "partners";

export function CreatorPublicClient({
  creator,
  trust,
  activeCampaigns,
  endedCampaigns,
  sponsors,
  totalPrizes,
  totalRedemptions,
  coverImageUrl,
  bio,
  showcaseTagline,
  categories,
}: CreatorPublicClientProps) {
  const [tab, setTab] = useState<Tab>("active");
  const displayName = showcaseTagline || creator.name;
  const whatsappUrl = creator.phone
    ? `https://wa.me/${creator.phone.replace(/\D/g, "")}`
    : undefined;

  const tabs = [
    { id: "active" as const, label: "نشطة", count: activeCampaigns.length },
    { id: "past" as const, label: "سابقة", count: endedCampaigns.length },
    { id: "partners" as const, label: "شركاء", count: sponsors.length },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-2xl space-y-6 px-4 py-12 pb-safe">
      <GlassCard featured innerClassName="p-0 overflow-hidden">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt=""
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: TOKENS.gradient.cardFeatured }}
              aria-hidden
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-transparent" />
        </div>
        <div className="relative -mt-10 px-5 pb-5 text-center">
          <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full border-2 border-gold-2/60 ring-2 ring-gold-2/20">
            {creator.avatarUrl ? (
              <Image
                src={creator.avatarUrl}
                alt={displayName}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface-2 text-2xl text-gold-1">
                {creator.name.charAt(0)}
              </div>
            )}
          </div>
          <h1 className="text-xl font-semibold text-text-primary">{displayName}</h1>
          <p className="font-mono text-sm text-gold-3">@{creator.handle}</p>
          {displayVerified(creator) && <VerifiedBadge className="mt-2" />}
          {creator.foundingPartnerNo != null && (
            <FoundingPartnerBadge number={creator.foundingPartnerNo} className="mt-2" />
          )}
          <div className="my-4 flex justify-center">
            <TrustScoreRing score={trust.score} campaignsCount={trust.campaignsCount} />
          </div>
          <CreatorStatChips
            sparkScore={creator.sparkScore}
            activeCampaigns={activeCampaigns.length}
            totalRedemptions={totalRedemptions}
          />
          {categories.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-1">
              {categories.slice(0, 4).map((cat) => (
                <span
                  key={cat}
                  className="rounded-md border border-gold-4/20 bg-void/40 px-2 py-0.5 text-[10px] text-text-secondary"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
          {bio && (
            <p className="mt-3 text-sm text-text-secondary">{bio}</p>
          )}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <p className="font-mono text-gold-1">{totalPrizes}</p>
              <p className="text-xs text-text-secondary">جوائز</p>
            </div>
            <div>
              <p className="font-mono text-gold-1">{trust.campaignsCount}</p>
              <p className="text-xs text-text-secondary">حملات</p>
            </div>
            <div>
              <p className="font-mono text-gold-1">{sponsors.length}</p>
              <p className="text-xs text-text-secondary">شركاء</p>
            </div>
          </div>
        </div>
      </GlassCard>

      <div
        className="flex gap-2 overflow-x-auto rounded-xl border border-strong bg-bg-elevated/50 p-1"
        role="tablist"
        aria-label="أقسام الملف"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "focus-ring flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id
                ? "bg-gold-rich/20 text-gold-accent"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            {t.label}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[10px]",
                tab === t.id ? "bg-gold-2/20 text-gold-1" : "bg-surface-2 text-text-tertiary"
              )}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {tab === "active" && (
        <div className="space-y-3">
          {activeCampaigns.length === 0 ? (
            <EmptyState
              variant="premium"
              title="لا توجد حملات نشطة"
              description="تابع هذا الصانع لمعرفة الحملات القادمة"
            />
          ) : (
            activeCampaigns.map((c) => (
              <GlassCard
                key={c.id}
                interactive
                className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated"
              >
                <p className="font-medium text-text-primary">{c.title}</p>
                <p className="text-sm text-text-secondary">
                  {c.prizeName} — {c.sponsor.name}
                </p>
                {c.slug && (
                  <Link href={`/campaign/${c.slug}`} className="mt-2 inline-block text-sm text-gold-2">
                    عرض الحملة
                  </Link>
                )}
              </GlassCard>
            ))
          )}
        </div>
      )}

      {tab === "past" && (
        endedCampaigns.length === 0 ? (
          <EmptyState variant="premium" title="لا توجد حملات سابقة" />
        ) : (
          <CampaignWall campaigns={endedCampaigns} />
        )
      )}

      {tab === "partners" && (
        sponsors.length === 0 ? (
          <EmptyState variant="premium" title="لا يوجد شركاء بعد" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {sponsors.map((s) => (
              <GlassCard key={s.id} className="flex items-center gap-3">
                {s.logoUrl ? (
                  <Image src={s.logoUrl} alt={s.name} width={40} height={40} className="rounded-full" />
                ) : null}
                <span className="text-text-primary">{s.name}</span>
              </GlassCard>
            ))}
          </div>
        )
      )}

      <CollabRequestForm creatorId={creator.id} creatorName={creator.name} />
      {whatsappUrl && (
        <Button
          href={whatsappUrl}
          variant="primary"
          glow
          fullWidth
          className="min-h-12"
          onClick={() =>
            trackProductEvent("creator_public_cta_click", {
              section: "creator_public",
              ctaLabel: "whatsapp",
              metadata: { creatorId: creator.id },
            })
          }
        >
          تواصل واتساب
        </Button>
      )}
    </div>
  );
}
