"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import {
  StickyActionBar,
  StickyActionBarButton,
} from "@/components/ui/StickyActionBar";
import { LiveScarcityBar } from "@/components/campaign/LiveScarcityBar";
import { fadeUp } from "@/lib/motion/variants";
import { transition } from "@/lib/motion/tokens";
import type { Campaign, Creator, Sponsor } from "@prisma/client";

type CampaignWithRelations = Campaign & {
  sponsor: Sponsor;
  creator: Pick<Creator, "handle" | "name" | "avatarUrl" | "verified">;
};

export function RedeemWelcomeScreen({
  campaign,
  onContinue,
}: {
  campaign: CampaignWithRelations;
  onContinue: () => void;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <>
      <motion.div
        className="flex w-full flex-col items-center gap-8 pb-24 text-center md:pb-0"
        initial={reducedMotion ? false : fadeUp.initial}
        animate={fadeUp.animate}
        transition={transition.normal}
      >
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-2">مفاجأة بانتظارك</p>
          <h1 className="font-brand text-3xl font-bold text-text-primary">هديتك بانتظارك</h1>
          <p className="text-sm text-text-secondary">{campaign.prizeName}</p>
        </div>

        <div
          className="relative w-full overflow-hidden rounded-3xl border border-gold-4/25 p-6"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 50% 0%, rgba(240,201,122,0.14), transparent 60%), linear-gradient(180deg, #0d0b08, #050406)",
          }}
        >
          <p className="text-sm text-text-secondary">{campaign.title}</p>
          <p className="mt-2 text-lg font-semibold text-gold-1">{campaign.prizeName}</p>
          <p className="mt-3 text-xs text-text-tertiary">
            برعاية {campaign.sponsor.name} · عبر {campaign.creator.name}
          </p>
          <LiveScarcityBar
            campaignId={campaign.id}
            initialClaimed={campaign.prizeClaimed}
            initialQuantity={campaign.prizeQuantity}
            className="mt-4 px-1"
          />
          {campaign.sponsor.logoUrl && (
            <Image
              src={campaign.sponsor.logoUrl}
              alt=""
              width={48}
              height={48}
              className="mx-auto mt-4 opacity-90"
              unoptimized
            />
          )}
        </div>

        <PrimaryButton fullWidth className="mt-2 hidden min-h-12 md:flex" onClick={onContinue}>
          اكتشف هديتك
        </PrimaryButton>
      </motion.div>
      <StickyActionBar
        primary={
          <StickyActionBarButton type="button" onClick={onContinue}>
            اكتشف هديتك
          </StickyActionBarButton>
        }
      />
    </>
  );
}
