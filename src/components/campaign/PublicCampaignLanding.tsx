"use client";

import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SponsorVerifiedBadge } from "@/components/sponsor/SponsorVerifiedBadge";
import { CampaignPerformanceBadge } from "@/components/sponsor/CampaignPerformanceBadge";
import { isProCampaign } from "@/lib/campaign-tiers";
import { useCampaignDescription } from "@/lib/campaign/ab-copy";
import { LiveScarcityBar } from "@/components/campaign/LiveScarcityBar";
import { n } from "@/lib/format";
import type { Campaign, Creator, Sponsor, CampaignCode } from "@prisma/client";

type CampaignPublic = Campaign & {
  sponsor: Sponsor;
  creator: Pick<Creator, "handle" | "name" | "avatarUrl" | "verified">;
  codes: CampaignCode[];
};

interface PublicCampaignLandingProps {
  campaign: CampaignPublic;
}

function remainingLabel(campaign: CampaignPublic) {
  const left = campaign.prizeQuantity - campaign.prizeClaimed;
  if (left <= 0) return "نفدت الجوائز";
  if (campaign.endsAt) {
    const days = Math.ceil(
      (new Date(campaign.endsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (days > 0) return `${n(days)} يوم متبقٍ`;
  }
  return `${n(left)} جائزة متبقية`;
}

export function PublicCampaignLanding({ campaign }: PublicCampaignLandingProps) {
  const primaryCode = campaign.codes[0]?.code;
  const redeemHref = primaryCode ? `/c/${primaryCode}` : "/redeem";
  const { text: descriptionText } = useCampaignDescription(
    campaign.id,
    campaign.description,
    campaign.descriptionVariantA,
    campaign.descriptionVariantB
  );

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-4 py-10">
      <div className="mb-8 text-center">
        <BrandLogo variant="logo" size="md" className="mx-auto opacity-95" />
      </div>

      {campaign.promoVideoUrl ? (
        <div className="mb-6 overflow-hidden rounded-xl border border-gold-4/20">
          <video
            src={campaign.promoVideoUrl}
            controls
            className="aspect-video w-full bg-black"
          />
        </div>
      ) : campaign.prizeImageUrl ? (
        <div className="relative mb-6 aspect-video overflow-hidden rounded-xl border border-gold-4/20">
          <Image
            src={campaign.prizeImageUrl}
            alt={campaign.prizeName}
            fill
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-gold-4/30">
          {campaign.sponsor.logoUrl ? (
            <Image
              src={campaign.sponsor.logoUrl}
              alt={campaign.sponsor.name}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          ) : (
            <Icon name="storefront" size={40} className="text-gold-2" />
          )}
        </div>
        <p className="text-sm text-dim">{campaign.sponsor.name}</p>
        {campaign.sponsor.verified && <SponsorVerifiedBadge className="mt-2" />}
        {isProCampaign(campaign.tier ?? "BASIC") && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-gold-2/20 px-3 py-0.5 text-xs text-gold-1">
            <Icon name="sealCheck" size={14} />
            حملة محترفة
          </span>
        )}
        <h1 className="mt-3 text-2xl font-semibold text-warm-white">{campaign.title}</h1>
        {descriptionText && (
          <p className="mt-2 text-sm text-dim">{descriptionText}</p>
        )}
        <p className="mt-4 text-xs text-dim">
          هدية من {campaign.creator.name} بالتعاون مع {campaign.sponsor.name}
        </p>
        <p className="mt-2 text-lg text-gold-1">{campaign.prizeName}</p>
        <CampaignPerformanceBadge
          claimed={campaign.prizeClaimed}
          quantity={campaign.prizeQuantity}
          className="mt-2"
        />
        <LiveScarcityBar
          slug={campaign.slug ?? undefined}
          campaignId={campaign.slug ? undefined : campaign.id}
          initialClaimed={campaign.prizeClaimed}
          initialQuantity={campaign.prizeQuantity}
          className="mt-3 max-w-xs mx-auto"
        />
        <p className="mt-1 text-sm text-dim">{remainingLabel(campaign)}</p>
      </div>

      <div className="mt-8 space-y-3">
        <Button href={redeemHref} fullWidth className="py-3 text-base">
          استلم جائزتك الآن
        </Button>
        <Button href="/redeem" variant="secondary" fullWidth>
          لديّ كود آخر
        </Button>
      </div>
    </main>
  );
}
