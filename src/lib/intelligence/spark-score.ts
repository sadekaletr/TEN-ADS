import { notDeleted } from "@/lib/db";
import { getFraudRateForCreator } from "@/lib/intelligence/fraud";
import { prisma } from "@/lib/prisma";

function computeConsistency(campaigns: { prizeClaimed: number; prizeQuantity: number; createdAt: Date }[]) {
  if (campaigns.length < 2) return 0.5;

  const rates = campaigns.map((c) =>
    c.prizeQuantity > 0 ? c.prizeClaimed / c.prizeQuantity : 0
  );
  const mean = rates.reduce((a, b) => a + b, 0) / rates.length;
  const variance =
    rates.reduce((s, r) => s + (r - mean) ** 2, 0) / rates.length;
  return Math.max(0, 1 - Math.sqrt(variance));
}

export async function computeSparkScore(creatorId: string) {
  const creator = await prisma.creator.findUnique({
    where: { id: creatorId },
    select: { verified: true },
  });
  if (!creator) return null;

  const campaigns = await prisma.campaign.findMany({
    where: { creatorId, ...notDeleted },
    select: {
      id: true,
      prizeClaimed: true,
      prizeQuantity: true,
      createdAt: true,
    },
  });
  const campaignIds = campaigns.map((c) => c.id);

  const [views, redemptions, fraudRate] = await Promise.all([
    campaignIds.length > 0
      ? prisma.campaignEvent.count({
          where: { campaignId: { in: campaignIds }, type: "PAGE_VIEW" },
        })
      : 0,
    campaignIds.length > 0
      ? prisma.campaignEvent.count({
          where: {
            campaignId: { in: campaignIds },
            type: "REDEMPTION_COMPLETED",
          },
        })
      : 0,
    getFraudRateForCreator(creatorId),
  ]);

  const conversionRate = views > 0 ? redemptions / views : 0;
  const consistency = computeConsistency(campaigns);
  const verifiedBonus = creator.verified ? 1 : 0;

  const raw =
    conversionRate * 400 +
    (1 - fraudRate) * 300 +
    consistency * 200 +
    verifiedBonus * 100;

  const score = Math.round(Math.min(1000, Math.max(0, raw)));

  const snapshot = await prisma.sparkScoreSnapshot.create({
    data: {
      creatorId,
      score,
      conversionRate,
      fraudRate,
      consistency,
    },
  });

  return snapshot;
}

export async function getLatestSparkScore(creatorId: string) {
  return prisma.sparkScoreSnapshot.findFirst({
    where: { creatorId },
    orderBy: { computedAt: "desc" },
  });
}

export async function computeAllSparkScores() {
  const creators = await prisma.creator.findMany({
    where: { deletedAt: null },
    select: { id: true },
  });
  const results = [];
  for (const c of creators) {
    results.push(await computeSparkScore(c.id));
  }
  return results;
}
