import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";
import { buildGamificationContext, type CreatorRankInfo } from "@/lib/gamification/derive";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth() {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getCreatorGamification(creatorId: string, sparkScore: number) {
  const today = startOfToday();
  const monthStart = startOfMonth();

  const latestCampaign = await prisma.campaign.findFirst({
    where: { creatorId, ...notDeleted, city: { not: null } },
    orderBy: { createdAt: "desc" },
    select: { city: true },
  });
  const city = latestCampaign?.city ?? null;

  const [
    completedCampaigns,
    totalRedemptions,
    campaignsCreatedToday,
    redemptionsToday,
    sponsorsAddedToday,
    monthlyRedemptions,
    peerCount,
    higherCount,
  ] = await Promise.all([
    prisma.campaign.count({
      where: { creatorId, status: { in: ["ACTIVE", "ENDED"] }, ...notDeleted },
    }),
    prisma.redemption.count({
      where: { campaign: { creatorId, ...notDeleted } },
    }),
    prisma.campaign.count({
      where: { creatorId, createdAt: { gte: today }, ...notDeleted },
    }),
    prisma.redemption.count({
      where: { campaign: { creatorId, ...notDeleted }, createdAt: { gte: today } },
    }),
    prisma.sponsor.count({
      where: {
        campaigns: {
          some: { creatorId, createdAt: { gte: today }, ...notDeleted },
        },
      },
    }),
    prisma.redemption.findMany({
      where: {
        campaign: { creatorId, ...notDeleted },
        createdAt: { gte: monthStart },
      },
      select: {
        campaign: { select: { costPerRedemption: true } },
      },
    }),
    city
      ? prisma.creator.count({
          where: {
            deletedAt: null,
            campaigns: { some: { city, ...notDeleted } },
          },
        })
      : prisma.creator.count({ where: { deletedAt: null } }),
    prisma.sparkScoreSnapshot.count({
      where: {
        score: { gt: sparkScore },
        creator: city
          ? {
              deletedAt: null,
              campaigns: { some: { city, ...notDeleted } },
            }
          : { deletedAt: null },
      },
    }),
  ]);

  const monthlySparkValue = monthlyRedemptions.reduce(
    (s, r) => s + r.campaign.costPerRedemption,
    0
  );

  const rank: CreatorRankInfo =
    peerCount > 0
      ? {
          rank: higherCount + 1,
          totalInScope: peerCount,
          topPercent: Math.min(
            99,
            Math.max(1, Math.round(((peerCount - higherCount) / peerCount) * 100))
          ),
          city,
        }
      : { rank: null, totalInScope: 0, topPercent: null, city };

  return buildGamificationContext({
    completedCampaigns,
    totalRedemptions,
    sparkScore,
    monthlySparkValue,
    campaignsCreatedToday,
    redemptionsToday,
    sponsorsAddedToday,
    rank,
  });
}
