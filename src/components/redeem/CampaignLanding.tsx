"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { isProCampaign } from "@/lib/campaign-tiers";
import type { Campaign, Creator, Sponsor } from "@prisma/client";

type CampaignWithRelations = Campaign & {
  sponsor: Sponsor;
  creator: Pick<Creator, "handle" | "name" | "avatarUrl" | "verified">;
};

interface CampaignLandingProps {
  campaign: CampaignWithRelations;
  onContinue: () => void;
}

export function CampaignLanding({ campaign, onContinue }: CampaignLandingProps) {
  return (
    <div className="flex w-full flex-col items-center text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-gold-4/30 bg-surface-2">
        {campaign.sponsor.logoUrl ? (
          <Image
            src={campaign.sponsor.logoUrl}
            alt={campaign.sponsor.name}
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        ) : (
          <Icon name="storefront" size={40} className="text-gold-2" />
        )}
      </div>

      <p className="text-sm text-dim">{campaign.sponsor.name}</p>
      {isProCampaign(campaign.tier ?? "BASIC") && (
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-gold-2/20 px-3 py-0.5 text-xs font-medium text-gold-1">
          <Icon name="sealCheck" size={14} />
          حملة محترفة
        </span>
      )}
      <h1 className="mt-2 text-xl font-semibold text-warm-white">
        {campaign.title}
      </h1>
      {campaign.description && (
        <p className="mt-2 max-w-sm text-sm text-dim">{campaign.description}</p>
      )}

      <p className="mt-4 text-xs text-dim">
        هدية من {campaign.creator.name} بالتعاون مع {campaign.sponsor.name}
      </p>
      <p className="mt-6 text-sm text-dim">أنت على وشك فتح جائزتك</p>
      <p className="mt-1 text-lg text-gold-1">{campaign.prizeName}</p>

      <div className="mt-8 w-full">
        <Button fullWidth onClick={onContinue}>
          متابعة
        </Button>
      </div>
    </div>
  );
}
