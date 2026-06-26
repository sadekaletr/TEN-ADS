import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import type { CreatorCardData } from "@/lib/creators/getFeaturedCreators";

export type ListingForEnrich = {
  bio: string | null;
  categories: string[];
  coverImageUrl: string | null;
  showcaseTagline: string | null;
  spotlightRank: number | null;
  createdAt: Date;
  creator: {
    id: string;
    name: string;
    handle: string;
    avatarUrl: string | null;
    verified: boolean;
    trustScore?: number | null;
    createdAt: Date;
    campaigns: { city: string | null }[];
    _count: { campaigns: number };
  };
};

type CreatorMetrics = {
  activeCampaigns: number;
  totalPrizesClaimed: number;
  views: number;
  redemptions: number;
};

type TrustPrefetch = {
  score: number;
  campaignsCount: number;
};

async function prefetchSparkScores(
  creatorIds: string[]
): Promise<Map<string, number | null>> {
  const map = new Map<string, number | null>();
  for (const id of creatorIds) map.set(id, null);
  if (creatorIds.length === 0) return map;

  const snaps = await prisma.sparkScoreSnapshot.findMany({
    where: { creatorId: { in: creatorIds } },
    orderBy: { computedAt: "desc" },
    select: { creatorId: true, score: true },
  });
  for (const s of snaps) {
    if (map.get(s.creatorId) === null) map.set(s.creatorId, s.score);
  }
  return map;
}

async function prefetchTrustData(
  creatorIds: string[],
  listings: ListingForEnrich[]
): Promise<Map<string, TrustPrefetch>> {
  const map = new Map<string, TrustPrefetch>();
  for (const listing of listings) {
    const id = listing.creator.id;
    map.set(id, {
      score: listing.creator.trustScore ?? 0,
      campaignsCount: listing.creator._count.campaigns,
    });
  }
  if (creatorIds.length === 0) return map;

  const snaps = await prisma.trustScoreSnapshot.findMany({
    where: { entityType: "CREATOR", entityId: { in: creatorIds } },
    orderBy: { calculatedAt: "desc" },
    select: { entityId: true, score: true, campaignsCount: true },
  });
  for (const s of snaps) {
    if (!map.has(s.entityId)) continue;
    const existing = map.get(s.entityId)!;
    if (existing.score === 0 && s.score > 0) {
      map.set(s.entityId, {
        score: s.score,
        campaignsCount: s.campaignsCount,
      });
    }
  }
  return map;
}

async function prefetchCreatorMetrics(
  creatorIds: string[]
): Promise<Map<string, CreatorMetrics>> {
  const metrics = new Map<string, CreatorMetrics>();
  for (const id of creatorIds) {
    metrics.set(id, {
      activeCampaigns: 0,
      totalPrizesClaimed: 0,
      views: 0,
      redemptions: 0,
    });
  }
  if (creatorIds.length === 0) return metrics;

  const campaigns = await prisma.campaign.findMany({
    where: { creatorId: { in: creatorIds }, ...notDeleted },
    select: {
      id: true,
      creatorId: true,
      status: true,
      prizeClaimed: true,
    },
  });

  const campaignToCreator = new Map(
    campaigns.map((c) => [c.id, c.creatorId] as const)
  );
  const campaignIds = campaigns.map((c) => c.id);

  for (const c of campaigns) {
    const m = metrics.get(c.creatorId)!;
    if (c.status === "ACTIVE") m.activeCampaigns += 1;
    m.totalPrizesClaimed += c.prizeClaimed;
  }

  if (campaignIds.length === 0) return metrics;

  const [viewGroups, redemptionGroups] = await Promise.all([
    prisma.campaignEvent.groupBy({
      by: ["campaignId"],
      where: { campaignId: { in: campaignIds }, type: "PAGE_VIEW" },
      _count: { _all: true },
    }),
    prisma.campaignEvent.groupBy({
      by: ["campaignId"],
      where: {
        campaignId: { in: campaignIds },
        type: "REDEMPTION_COMPLETED",
      },
      _count: { _all: true },
    }),
  ]);

  for (const row of viewGroups) {
    const creatorId = campaignToCreator.get(row.campaignId);
    if (creatorId) metrics.get(creatorId)!.views += row._count._all;
  }
  for (const row of redemptionGroups) {
    const creatorId = campaignToCreator.get(row.campaignId);
    if (creatorId) metrics.get(creatorId)!.redemptions += row._count._all;
  }

  return metrics;
}

function mapListingToCard(
  listing: ListingForEnrich,
  sparkScore: number | null,
  trust: TrustPrefetch,
  metric: CreatorMetrics
): CreatorCardData {
  const views = metric.views;
  const redemptions = metric.redemptions;
  const conversionRate = views > 0 ? redemptions / views : undefined;

  return {
    id: listing.creator.id,
    name: listing.creator.name,
    handle: listing.creator.handle,
    avatarUrl: listing.creator.avatarUrl,
    coverImageUrl: listing.coverImageUrl,
    city: listing.creator.campaigns[0]?.city ?? null,
    categories: listing.categories,
    verified: listing.creator.verified,
    sparkScore,
    trustScore: trust.score,
    campaignsCount: trust.campaignsCount,
    activeCampaigns: metric.activeCampaigns,
    totalRedemptions: metric.totalPrizesClaimed,
    conversionRate,
    showcaseTagline: listing.showcaseTagline,
    spotlightRank: listing.spotlightRank,
    bio: listing.bio,
    createdAt: listing.creator.createdAt.toISOString(),
    listingCreatedAt: listing.createdAt.toISOString(),
  };
}

/** Read-only batch enrichment — no DB writes on render path. */
export async function enrichListingsBatch(
  listings: ListingForEnrich[]
): Promise<CreatorCardData[]> {
  if (listings.length === 0) return [];

  const creatorIds = Array.from(new Set(listings.map((l) => l.creator.id)));

  const [sparkMap, trustMap, metricsMap] = await Promise.all([
    prefetchSparkScores(creatorIds),
    prefetchTrustData(creatorIds, listings),
    prefetchCreatorMetrics(creatorIds),
  ]);

  return listings.map((listing) => {
    const id = listing.creator.id;
    return mapListingToCard(
      listing,
      sparkMap.get(id) ?? null,
      trustMap.get(id)!,
      metricsMap.get(id)!
    );
  });
}
