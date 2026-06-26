"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { DataDepthCard } from "@/components/ui/DataDepthCard";
import { ConversionRail } from "@/components/ui/ConversionRail";
import {
  StickyActionBar,
  StickyActionBarButton,
} from "@/components/ui/StickyActionBar";
import { LiveScarcityBar } from "@/components/campaign/LiveScarcityBar";
import type { Campaign, Creator, Sponsor } from "@prisma/client";

type CampaignWithRelations = Campaign & {
  sponsor: Sponsor;
  creator: Pick<Creator, "handle" | "name" | "avatarUrl" | "verified">;
};

const MACRO_STEPS = [
  { id: "welcome", label: "ترحيب" },
  { id: "verify", label: "تحقق" },
  { id: "claim", label: "استلام" },
  { id: "reveal", label: "جائزة" },
];

export function RedeemWelcomeScreen({
  campaign,
  onContinue,
}: {
  campaign: CampaignWithRelations;
  onContinue: () => void;
}) {
  return (
    <>
      <div className="flex w-full flex-col items-center gap-6 pb-24 text-center md:pb-0">
        <ConversionRail steps={MACRO_STEPS} current="welcome" className="max-w-sm" />

        <p className="text-sm text-text-secondary">أهلاً بك في حملة</p>
        <h1 className="text-2xl font-semibold text-text-primary">{campaign.title}</h1>
        <p className="text-sm text-text-secondary">
          وصلت من خلال{" "}
          <span className="font-medium text-gold-1">{campaign.creator.name}</span>
        </p>

        <DataDepthCard
          elevation={4}
          featured
          icon="gift"
          title="هديتك"
          value={campaign.prizeName}
          className="w-full text-center"
        >
          <LiveScarcityBar
            campaignId={campaign.id}
            initialClaimed={campaign.prizeClaimed}
            initialQuantity={campaign.prizeQuantity}
            className="mt-3 px-2"
          />
          {campaign.sponsor.logoUrl && (
            <Image
              src={campaign.sponsor.logoUrl}
              alt=""
              width={40}
              height={40}
              className="mx-auto mt-3 opacity-90"
              unoptimized
            />
          )}
        </DataDepthCard>

        <Button fullWidth className="mt-2 hidden min-h-12 md:flex" onClick={onContinue}>
          متابعة
        </Button>
      </div>
      <StickyActionBar
        primary={
          <StickyActionBarButton type="button" onClick={onContinue}>
            متابعة
          </StickyActionBarButton>
        }
      />
    </>
  );
}
