"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { GlassCard } from "@/components/ui/GlassCard";
import { TrustScoreRing } from "@/components/trust/TrustScoreRing";
import { cn } from "@/lib/utils";
import { TOKENS } from "@/styles/tokens";
import { useLocale } from "@/lib/i18n";
import { trackCreatorsEvent } from "@/lib/analytics/creators-events";
import { isCreatorNew } from "@/lib/creators/creator-utils";
import type { CreatorCardData } from "@/lib/creators/getFeaturedCreators";
import { CreatorStatChips } from "@/components/creators/CreatorStatChips";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { StatusPillPro } from "@/components/ui/StatusPillPro";
import { percent } from "@/lib/format";

interface CreatorSpotlightCardProps {
  creator: CreatorCardData;
  size?: "spotlight" | "default" | "hero";
  preview?: boolean;
  animate?: boolean;
}

export function CreatorSpotlightCard({
  creator,
  size = "spotlight",
  preview = false,
  animate = true,
}: CreatorSpotlightCardProps) {
  const { t } = useLocale();
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const cleanHandle = creator.handle.replace(/^@/, "");
  const isCompact = size === "default";
  const isHero = size === "hero";
  const isSpotlight = size === "spotlight";
  const displayName = creator.showcaseTagline || creator.name;
  const isNew = isCreatorNew(creator.listingCreatedAt);

  function handleCardClick() {
    if (preview) return;
    trackCreatorsEvent("creator_card_click", {
      metadata: { creatorId: creator.id, handle: creator.handle, size },
    });
  }

  function handleCollabClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (preview) return;
    trackCreatorsEvent("creator_collab_click", {
      metadata: { creatorId: creator.id },
    });
    router.push(`/sponsor/login?creator=${cleanHandle}`);
  }

  const coverBlock = (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        isHero ? "aspect-[4/3] md:aspect-[16/10]" : "aspect-[4/5] sm:aspect-[16/11]"
      )}
    >
      {creator.coverImageUrl ? (
        <Image
          src={creator.coverImageUrl}
          alt={displayName}
          fill
          className={cn(
            "object-cover object-top",
            !reducedMotion && "transition-transform duration-500 group-hover:scale-[1.03]"
          )}
          sizes={
            isHero
              ? "(max-width: 768px) 100vw, 40vw"
              : isCompact
                ? "(max-width: 768px) 100vw, 33vw"
                : "(max-width: 768px) 100vw, 33vw"
          }
          priority={isSpotlight && !preview}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: TOKENS.gradient.cardFeatured }}
          aria-hidden
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-transparent"
        aria-hidden
      />
      {isSpotlight && creator.spotlightRank != null && (
        <span className="absolute start-3 top-3 rounded-full border border-gold-2/50 bg-void/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-1">
          #{creator.spotlightRank}
        </span>
      )}
      <div className="absolute end-3 top-3 flex flex-wrap justify-end gap-1.5">
        {isNew && (
          <StatusPillPro status="live" label={t("creators.chips.new")} />
        )}
      </div>
    </div>
  );

  const bodyBlock = (
    <div className={cn("p-4 md:p-5", isHero && "absolute inset-x-0 bottom-0")}>
      <div className="flex items-end gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-gold-2/60 ring-2 ring-gold-2/20 md:h-16 md:w-16">
          {creator.avatarUrl ? (
            <Image src={creator.avatarUrl} alt="" fill className="object-cover" sizes="64px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-2 text-gold-2">
              <Icon name="star" size={24} />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3
              className={cn(
                "truncate font-semibold text-text-primary",
                isCompact ? "text-base" : "text-lg md:text-xl"
              )}
            >
              {displayName}
            </h3>
            {creator.verified && <VerifiedBadge />}
          </div>
          <p className="font-mono text-xs text-gold-3">@{cleanHandle}</p>
          {creator.city && <p className="mt-0.5 text-xs text-text-secondary">{creator.city}</p>}
        </div>
        {!isCompact && (
          <TrustScoreRing
            score={creator.trustScore}
            campaignsCount={creator.campaignsCount}
            size="small"
          />
        )}
      </div>

      {creator.categories.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {creator.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="rounded-md border border-gold-4/20 bg-void/40 px-2 py-0.5 text-[10px] text-text-secondary"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3">
        <CreatorStatChips
          sparkScore={creator.sparkScore}
          activeCampaigns={creator.activeCampaigns}
          totalRedemptions={creator.totalRedemptions}
          compact={isCompact}
          isNew={isNew && creator.sparkScore == null}
        />
      </div>

      {creator.conversionRate != null && creator.conversionRate > 0 && !isCompact && (
        <p className="mt-2 text-xs text-text-secondary">
          {t("creators.chips.conversion")}:{" "}
          <span className="font-mono text-gold-1">
            {percent(Math.round(creator.conversionRate * 100))}
          </span>
        </p>
      )}

      {!isCompact && creator.bio && (
        <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{creator.bio}</p>
      )}

      {!isHero && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex min-h-9 items-center rounded-lg bg-gold-2/20 px-3 text-xs font-medium text-gold-1">
            {t("creators.card.viewProfile")}
          </span>
          <button
            type="button"
            onClick={handleCollabClick}
            className="inline-flex min-h-9 items-center rounded-lg border border-gold-4/30 px-3 text-xs text-dim transition-colors hover:border-gold-2/40 hover:text-warm-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-2/50"
          >
            {t("creators.card.collab")}
          </button>
        </div>
      )}
    </div>
  );

  const cardInner = isSpotlight ? (
    <GlassCard
      featured
      innerClassName="p-0"
      className={cn(
        "group h-full overflow-hidden",
        !reducedMotion &&
          !preview &&
          "transition-all duration-200 hover:-translate-y-1 hover:shadow-elevated"
      )}
    >
      {coverBlock}
      {bodyBlock}
    </GlassCard>
  ) : (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-gold-4/20 bg-surface-2 shadow-card",
        isHero && "relative min-h-[280px]",
        !reducedMotion &&
          !preview &&
          "transition-all duration-200 hover:-translate-y-1 hover:border-gold-2/40 hover:shadow-elevated",
        isCompact && "h-full"
      )}
    >
      {coverBlock}
      {bodyBlock}
    </article>
  );

  if (preview) return cardInner;

  const link = (
    <Link
      href={`/creator/${cleanHandle}`}
      onClick={handleCardClick}
      aria-label={`${displayName} — @${cleanHandle}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-2 focus-visible:ring-offset-2 focus-visible:ring-offset-void"
    >
      {cardInner}
    </Link>
  );

  if (!animate) return link;
  return link;
}
