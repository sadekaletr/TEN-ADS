import { TopUpPageClient } from "@/components/wallet/TopUpPageClient";
import { getCreatorSession } from "@/lib/session-auth";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { getSparkUnit } from "@/lib/spark";
import { getSparkPricing } from "@/lib/spark-pricing";
import { buildTopUpPackages } from "@/lib/wallet/topup-packages";
import {
  getTopUpSocialProof,
} from "@/lib/wallet/social-proof";
import { getTransferSettings } from "@/lib/platform-settings";
import { redirect } from "next/navigation";

interface TopUpPageProps {
  searchParams: { amount?: string; need?: string };
}

export default async function TopUpPage({ searchParams }: TopUpPageProps) {
  const session = await getCreatorSession();
  if (!session) redirect("/login");

  const [creator, socialProof, sparkUnit, pricing, draft, transferSettings] = await Promise.all([
    prisma.creator.findFirst({
      where: { id: session.user.id, ...notDeleted },
      select: {
        walletBalance: true,
        name: true,
        isPartner: true,
        partnerDiscountCode: true,
      },
    }),
    getTopUpSocialProof(session.user.id),
    getSparkUnit(),
    getSparkPricing(),
    prisma.campaign.findFirst({
      where: {
        creatorId: session.user.id,
        status: "DRAFT",
        ...notDeleted,
      },
      orderBy: { createdAt: "desc" },
      select: {
        title: true,
        costPerRedemption: true,
        prizeQuantity: true,
      },
    }),
    getTransferSettings(),
  ]);

  if (!creator) redirect("/login");

  const isPartner = creator.isPartner && Boolean(creator.partnerDiscountCode);
  const usdPerSpark = isPartner ? pricing.partnerUsd : pricing.listUsd;
  const packages = buildTopUpPackages(
    sparkUnit,
    usdPerSpark,
    isPartner ? pricing.listUsd : undefined
  );
  const initialAmount = searchParams.amount ? Number(searchParams.amount) : undefined;
  const needAmount = searchParams.need ? Number(searchParams.need) : undefined;

  const draftInfo = draft
    ? {
        title: draft.title,
        sparkNeeded: draft.costPerRedemption * draft.prizeQuantity,
      }
    : null;

  return (
    <TopUpPageClient
      packages={packages}
      socialProof={socialProof}
      walletBalance={creator.walletBalance}
      transferSettings={transferSettings}
      initialAmount={Number.isFinite(initialAmount) ? initialAmount : undefined}
      needAmount={Number.isFinite(needAmount) ? needAmount : undefined}
      draft={draftInfo}
      sparkPricing={pricing}
      partner={
        isPartner && creator.partnerDiscountCode
          ? {
              discountCode: creator.partnerDiscountCode,
              creatorName: creator.name,
            }
          : null
      }
    />
  );
}
