import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { TYPICAL_CAMPAIGN_COST_DEFAULT } from "./topup-packages";

export type TopUpSocialProofData = {
  creatorsThisWeek: number;
  lastTopUpAt: Date | null;
  isFirstTopUp: boolean;
};

import { formatNumber } from "@/lib/format";

export function formatRelativeTimeAr(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "لحظات";
  if (minutes === 1) return "دقيقة واحدة";
  if (minutes < 60) return `${formatNumber(minutes)} دقائق`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "ساعة واحدة";
  if (hours < 24) return `${formatNumber(hours)} ساعات`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "يوم واحد";
  return `${formatNumber(days)} أيام`;
}

export async function getTopUpSocialProof(creatorId: string): Promise<TopUpSocialProofData> {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [grouped, lastTopUp, priorTopUps] = await Promise.all([
    prisma.walletTransaction.groupBy({
      by: ["creatorId"],
      where: { type: "TOPUP", createdAt: { gte: weekAgo } },
    }),
    prisma.walletTransaction.findFirst({
      where: { type: "TOPUP" },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
    prisma.walletTransaction.count({
      where: { creatorId, type: "TOPUP" },
    }),
  ]);

  return {
    creatorsThisWeek: grouped.length,
    lastTopUpAt: lastTopUp?.createdAt ?? null,
    isFirstTopUp: priorTopUps === 0,
  };
}

export async function getCreatorTypicalCampaignCost(creatorId: string): Promise<number> {
  const campaigns = await prisma.campaign.findMany({
    where: { creatorId, ...notDeleted },
    select: { costPerRedemption: true, prizeQuantity: true },
  });

  if (campaigns.length === 0) return TYPICAL_CAMPAIGN_COST_DEFAULT;

  const avg =
    campaigns.reduce((sum, c) => sum + c.costPerRedemption * c.prizeQuantity, 0) /
    campaigns.length;

  return Math.max(1, Math.round(avg));
}
