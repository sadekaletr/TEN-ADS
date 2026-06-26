"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import type { Campaign, Creator, Sponsor } from "@prisma/client";

type CampaignWithRelations = Campaign & {
  sponsor: Sponsor;
  creator: Pick<Creator, "handle" | "name" | "avatarUrl" | "verified">;
  promoVideoUrl?: string | null;
};

export function RedeemCreatorIntro({
  campaign,
  onContinue,
}: {
  campaign: CampaignWithRelations;
  onContinue: () => void;
}) {
  return (
    <div className="flex w-full flex-col items-center text-center">
      <div className="mb-4 h-20 w-20 overflow-hidden rounded-full border border-gold-4/30">
        {campaign.creator.avatarUrl ? (
          <Image
            src={campaign.creator.avatarUrl}
            alt={campaign.creator.name}
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-2 text-2xl text-gold-1">
            {campaign.creator.name.charAt(0)}
          </div>
        )}
      </div>
      <p className="text-sm text-dim">رسالة من</p>
      <p className="text-lg text-warm-white">{campaign.creator.name}</p>
      {campaign.promoVideoUrl && (
        <video
          src={campaign.promoVideoUrl}
          controls
          className="mt-4 w-full rounded-xl"
        />
      )}
      <p className="mt-4 text-sm text-dim">
        شكراً لمتابعتك — جائزتك بانتظارك في الخطوة التالية
      </p>
      <Button fullWidth className="mt-6 min-h-11" onClick={onContinue}>
        متابعة الاستلام
      </Button>
    </div>
  );
}
