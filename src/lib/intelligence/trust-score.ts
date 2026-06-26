import type { TrustEntityType } from "@prisma/client";
import { notDeleted } from "@/lib/db";
import { getFraudRateForCreator } from "@/lib/intelligence/fraud";
import { prisma } from "@/lib/prisma";

const MIN_CAMPAIGNS_FOR_PUBLIC = 3;
const DELIVERY_CAP_HOURS = 72;
const MIN_RATINGS_FOR_WEIGHT = 3;

export interface TrustScoreResult {
  score: number;
  completionRate: number;
  deliverySpeed: number;
  deliverySpeedScore: number;
  ratingAverage: number | null;
  fraudRate: number;
  campaignsCount: number;
  isPublic: boolean;
}

function deliverySpeedToScore(avgHours: number): number {
  if (avgHours <= 0) return 100;
  const capped = Math.min(avgHours, DELIVERY_CAP_HOURS);
  return Math.round(100 * (1 - capped / DELIVERY_CAP_HOURS));
}

function computeWeightedScore(params: {
  completionRate: number;
  deliverySpeedScore: number;
  ratingAverage: number | null;
  fraudRate: number;
}): number {
  let wCompletion = 0.35;
  let wDelivery = 0.2;
  let wRating = 0.25;
  let wFraud = 0.2;

  const hasRatings =
    params.ratingAverage !== null &&
    !Number.isNaN(params.ratingAverage);

  if (!hasRatings) {
    const ratingShare = wRating;
    wCompletion += ratingShare * 0.5;
    wDelivery += ratingShare * 0.3;
    wFraud += ratingShare * 0.2;
    wRating = 0;
  }

  const ratingComponent = hasRatings
    ? (params.ratingAverage! / 5) * 100
    : 0;

  const raw =
    params.completionRate * 100 * wCompletion +
    params.deliverySpeedScore * wDelivery +
    ratingComponent * wRating +
    (100 - params.fraudRate * 100) * wFraud;

  return Math.round(Math.min(100, Math.max(0, raw)));
}

async function getCompletedCampaignsForCreator(creatorId: string) {
  return prisma.campaign.findMany({
    where: {
      creatorId,
      status: "ENDED",
      ...notDeleted,
    },
    select: {
      id: true,
      prizeClaimed: true,
      prizeQuantity: true,
      endsAt: true,
      createdAt: true,
    },
  });
}

async function getCompletedCampaignsForSponsor(sponsorId: string) {
  return prisma.campaign.findMany({
    where: {
      sponsorId,
      status: "ENDED",
      ...notDeleted,
    },
    select: {
      id: true,
      prizeClaimed: true,
      prizeQuantity: true,
      endsAt: true,
      createdAt: true,
    },
  });
}

function computeCompletionRate(
  campaigns: { prizeClaimed: number; prizeQuantity: number }[]
): number {
  if (campaigns.length === 0) return 0;
  const rates = campaigns.map((c) =>
    c.prizeQuantity > 0 ? c.prizeClaimed / c.prizeQuantity : 0
  );
  return rates.reduce((a, b) => a + b, 0) / rates.length;
}

async function computeAvgDeliveryHours(campaignIds: string[]): Promise<number> {
  if (campaignIds.length === 0) return DELIVERY_CAP_HOURS;

  const redemptions = await prisma.redemption.findMany({
    where: { campaignId: { in: campaignIds } },
    select: { createdAt: true, campaignId: true },
    orderBy: { createdAt: "asc" },
  });

  if (redemptions.length === 0) return DELIVERY_CAP_HOURS;

  const campaignStarts = await prisma.campaign.findMany({
    where: { id: { in: campaignIds } },
    select: { id: true, startsAt: true, createdAt: true },
  });
  const startMap = new Map(
    campaignStarts.map((c) => [
      c.id,
      c.startsAt ?? c.createdAt,
    ])
  );

  const hours: number[] = [];
  for (const r of redemptions) {
    const start = startMap.get(r.campaignId) ?? r.createdAt;
    const diffMs = r.createdAt.getTime() - start.getTime();
    hours.push(Math.max(0, diffMs / (1000 * 60 * 60)));
  }

  return hours.reduce((a, b) => a + b, 0) / hours.length;
}

async function getRatingAverageForCampaigns(
  campaignIds: string[]
): Promise<number | null> {
  if (campaignIds.length === 0) return null;

  const agg = await prisma.participantRating.aggregate({
    where: {
      redemption: { campaignId: { in: campaignIds } },
    },
    _avg: { rating: true },
    _count: { rating: true },
  });

  if (!agg._count.rating || agg._count.rating < MIN_RATINGS_FOR_WEIGHT) {
    return null;
  }
  return agg._avg.rating ?? null;
}

async function getFraudRateForSponsor(sponsorId: string): Promise<number> {
  const campaigns = await prisma.campaign.findMany({
    where: { sponsorId, ...notDeleted },
    select: { id: true },
  });
  const campaignIds = campaigns.map((c) => c.id);
  if (campaignIds.length === 0) return 0;

  const [redemptions, signals] = await Promise.all([
    prisma.redemption.count({ where: { campaignId: { in: campaignIds } } }),
    prisma.fraudSignal.count({
      where: { campaignId: { in: campaignIds }, riskScore: { gte: 0.6 } },
    }),
  ]);

  if (redemptions === 0) return 0;
  return Math.min(1, signals / redemptions);
}

export async function calculateTrustScore(
  entityType: TrustEntityType,
  entityId: string
): Promise<TrustScoreResult> {
  const campaigns =
    entityType === "CREATOR"
      ? await getCompletedCampaignsForCreator(entityId)
      : await getCompletedCampaignsForSponsor(entityId);

  const campaignsCount = campaigns.length;
  const campaignIds = campaigns.map((c) => c.id);
  const completionRate = computeCompletionRate(campaigns);
  const avgDeliveryHours = await computeAvgDeliveryHours(campaignIds);
  const deliverySpeedScore = deliverySpeedToScore(avgDeliveryHours);
  const ratingAverage = await getRatingAverageForCampaigns(campaignIds);
  const fraudRate =
    entityType === "CREATOR"
      ? await getFraudRateForCreator(entityId)
      : await getFraudRateForSponsor(entityId);

  const score = computeWeightedScore({
    completionRate,
    deliverySpeedScore,
    ratingAverage,
    fraudRate,
  });

  const isPublic = campaignsCount >= MIN_CAMPAIGNS_FOR_PUBLIC;

  const snapshot = await prisma.trustScoreSnapshot.create({
    data: {
      entityType,
      entityId,
      score,
      completionRate,
      deliverySpeed: avgDeliveryHours,
      ratingAverage,
      fraudRate,
      campaignsCount,
    },
  });

  if (entityType === "CREATOR") {
    await prisma.creator.update({
      where: { id: entityId },
      data: { trustScore: score, trustScoreAt: snapshot.calculatedAt },
    });
  } else {
    await prisma.sponsor.update({
      where: { id: entityId },
      data: { trustScore: score, trustScoreAt: snapshot.calculatedAt },
    });
  }

  return {
    score,
    completionRate,
    deliverySpeed: avgDeliveryHours,
    deliverySpeedScore,
    ratingAverage,
    fraudRate,
    campaignsCount,
    isPublic,
  };
}

export async function getLatestTrustSnapshot(
  entityType: TrustEntityType,
  entityId: string
) {
  return prisma.trustScoreSnapshot.findFirst({
    where: { entityType, entityId },
    orderBy: { calculatedAt: "desc" },
  });
}

export async function getTrustScoreDisplay(
  entityType: TrustEntityType,
  entityId: string
): Promise<TrustScoreResult> {
  const snapshot = await getLatestTrustSnapshot(entityType, entityId);
  let result: TrustScoreResult;
  if (snapshot) {
    result = {
      score: snapshot.score,
      completionRate: snapshot.completionRate,
      deliverySpeed: snapshot.deliverySpeed,
      deliverySpeedScore: deliverySpeedToScore(snapshot.deliverySpeed),
      ratingAverage: snapshot.ratingAverage,
      fraudRate: snapshot.fraudRate,
      campaignsCount: snapshot.campaignsCount,
      isPublic: snapshot.campaignsCount >= MIN_CAMPAIGNS_FOR_PUBLIC,
    };
  } else {
    result = await calculateTrustScore(entityType, entityId);
  }

  if (entityType === "CREATOR") {
    const now = new Date();
    const empireActive = await prisma.campaign.findFirst({
      where: {
        creatorId: entityId,
        tier: "EMPIRE",
        status: "ACTIVE",
        deletedAt: null,
        OR: [{ tierBoostUntil: null }, { tierBoostUntil: { gt: now } }],
      },
    });
    if (empireActive) {
      result = { ...result, score: Math.min(100, result.score + 5) };
    }
  }

  return result;
}

export async function recalculateAllTrustScores() {
  const [creators, sponsors] = await Promise.all([
    prisma.creator.findMany({
      where: { deletedAt: null },
      select: { id: true },
    }),
    prisma.sponsor.findMany({
      where: { deletedAt: null },
      select: { id: true },
    }),
  ]);

  const results = [];
  for (const c of creators) {
    results.push(await calculateTrustScore("CREATOR", c.id));
  }
  for (const s of sponsors) {
    results.push(await calculateTrustScore("SPONSOR", s.id));
  }
  return results;
}

export async function triggerTrustRecalcForCampaign(campaignId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: { creatorId: true, sponsorId: true },
  });
  if (!campaign) return;
  await Promise.all([
    calculateTrustScore("CREATOR", campaign.creatorId),
    calculateTrustScore("SPONSOR", campaign.sponsorId),
  ]);
}
