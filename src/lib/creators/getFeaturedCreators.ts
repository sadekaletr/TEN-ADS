import { notDeleted } from "@/lib/db";
import { getCreatorAnalytics } from "@/lib/analytics";
import { computeSparkScore, getLatestSparkScore } from "@/lib/intelligence/spark-score";
import { getTrustScoreDisplay } from "@/lib/intelligence/trust-score";
import { getLandingStats } from "@/lib/landing/stats";
import { getPlatformSettings } from "@/lib/platform-settings";
import { prisma } from "@/lib/prisma";

export type CreatorCardData = {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  city: string | null;
  categories: string[];
  verified: boolean;
  sparkScore: number | null;
  trustScore: number;
  campaignsCount: number;
  activeCampaigns: number;
  totalRedemptions: number;
  conversionRate?: number;
  showcaseTagline?: string | null;
  spotlightRank?: number | null;
  bio?: string | null;
  createdAt: string;
  listingCreatedAt: string;
};

export type FeaturedCreatorsResult = {
  spotlight: CreatorCardData[];
  grid: CreatorCardData[];
};

const LISTING_LIMIT = 24;
const BATCH_SIZE = 4;

function defaultSort(a: CreatorCardData, b: CreatorCardData): number {
  if (a.verified !== b.verified) return a.verified ? -1 : 1;
  if (a.activeCampaigns !== b.activeCampaigns) return b.activeCampaigns - a.activeCampaigns;
  if (a.totalRedemptions !== b.totalRedemptions) return b.totalRedemptions - a.totalRedemptions;
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function buildSpotlight(
  cards: CreatorCardData[],
  featuredCreatorId: string | null
): { spotlight: CreatorCardData[]; grid: CreatorCardData[] } {
  const byId = new Map(cards.map((c) => [c.id, c]));
  const spotlight: CreatorCardData[] = [];
  const used = new Set<string>();

  if (featuredCreatorId) {
    const featured = byId.get(featuredCreatorId);
    if (featured) {
      spotlight.push(featured);
      used.add(featured.id);
    }
  }

  for (const rank of [1, 2, 3]) {
    const ranked = cards
      .filter((c) => c.spotlightRank === rank && !used.has(c.id))
      .sort(defaultSort);
    if (ranked[0]) {
      spotlight.push(ranked[0]);
      used.add(ranked[0].id);
    }
  }

  const sorted = [...cards].sort(defaultSort);
  for (const card of sorted) {
    if (spotlight.length >= 3) break;
    if (!used.has(card.id)) {
      spotlight.push(card);
      used.add(card.id);
    }
  }

  const grid = sorted.filter((c) => !used.has(c.id));
  return { spotlight, grid };
}

export async function enrichListing(listing: {
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
    createdAt: Date;
    campaigns: { city: string | null }[];
    _count: { campaigns: number };
  };
}): Promise<CreatorCardData> {
  const creatorId = listing.creator.id;
  let sparkSnap = await getLatestSparkScore(creatorId);
  if (!sparkSnap) {
    sparkSnap = await computeSparkScore(creatorId);
  }

  const [trust, analytics] = await Promise.all([
    getTrustScoreDisplay("CREATOR", creatorId),
    getCreatorAnalytics(creatorId),
  ]);

  const views = analytics.funnel.views;
  const redemptions = analytics.funnel.redemptions;
  const conversionRate = views > 0 ? redemptions / views : undefined;

  return {
    id: creatorId,
    name: listing.creator.name,
    handle: listing.creator.handle,
    avatarUrl: listing.creator.avatarUrl,
    coverImageUrl: listing.coverImageUrl,
    city: listing.creator.campaigns[0]?.city ?? null,
    categories: listing.categories,
    verified: listing.creator.verified,
    sparkScore: sparkSnap?.score ?? null,
    trustScore: trust.score,
    campaignsCount: trust.campaignsCount,
    activeCampaigns: analytics.activeCampaigns,
    totalRedemptions: analytics.totalPrizesClaimed,
    conversionRate,
    showcaseTagline: listing.showcaseTagline,
    spotlightRank: listing.spotlightRank,
    bio: listing.bio,
    createdAt: listing.creator.createdAt.toISOString(),
    listingCreatedAt: listing.createdAt.toISOString(),
  };
}

export async function getFeaturedCreators(): Promise<FeaturedCreatorsResult> {
  const [listings, settings] = await Promise.all([
    prisma.creatorListing.findMany({
      where: {
        isPublic: true,
        creator: { deletedAt: null },
      },
      take: LISTING_LIMIT,
      orderBy: [{ spotlightRank: "asc" }, { createdAt: "desc" }],
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            handle: true,
            avatarUrl: true,
            verified: true,
            createdAt: true,
            campaigns: {
              where: { ...notDeleted },
              select: { city: true },
              take: 1,
              orderBy: { createdAt: "desc" },
            },
            _count: {
              select: {
                campaigns: { where: { ...notDeleted } },
              },
            },
          },
        },
      },
    }),
    getPlatformSettings(),
  ]);

  const enriched: CreatorCardData[] = [];
  for (let i = 0; i < listings.length; i += BATCH_SIZE) {
    const batch = listings.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(enrichListing));
    enriched.push(...results);
  }

  return buildSpotlight(enriched, settings.featuredCreatorId);
}

export async function getCreatorsPageStats() {
  return getLandingStats();
}
