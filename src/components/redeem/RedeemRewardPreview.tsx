"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Campaign, Creator, Sponsor } from "@prisma/client";

type CampaignWithRelations = Campaign & {
  sponsor: Sponsor;
  creator: Pick<Creator, "handle" | "name" | "avatarUrl" | "verified">;
};

export function RedeemRewardPreview({
  campaign,
  onContinue,
}: {
  campaign: CampaignWithRelations;
  onContinue: () => void;
}) {
  return (
    <div className="flex w-full flex-col items-center text-center">
      {campaign.prizeImageUrl ? (
        <div className="relative mb-4 h-40 w-full overflow-hidden rounded-xl">
          <Image src={campaign.prizeImageUrl} alt={campaign.prizeName} fill className="object-cover" />
        </div>
      ) : (
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-gold-4/30 bg-surface-2">
          <Icon name="gift" size={40} className="text-gold-2" />
        </div>
      )}
      <p className="text-sm text-dim">{campaign.sponsor.name}</p>
      <h2 className="mt-2 text-xl text-gold-1">{campaign.prizeName}</h2>
      <p className="mt-2 text-xs text-dim">
        هدية من {campaign.creator.name} بالتعاون مع {campaign.sponsor.name}
      </p>
      <Button fullWidth className="mt-8 min-h-11" onClick={onContinue}>
        Claim Reward
      </Button>
    </div>
  );
}
