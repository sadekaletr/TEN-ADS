import { unstable_cache } from "next/cache";
import { notDeleted } from "@/lib/db";
import { getLandingStats } from "@/lib/landing/stats";
import { getPlatformSettings } from "@/lib/platform-settings";
import { prisma } from "@/lib/prisma";
import {
  enrichListingsBatch,
  type ListingForEnrich,
} from "@/lib/creators/enrich";
import { hasMarketplacePriority } from "@/lib/plans/entitlements";

export type CreatorCardData = {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  city: string | null;
  categories: string[];
  verified: boolean;
  planTier: "STARTER" | "GROWTH" | "SCALE";
  foundingPartnerNo: number | null;
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

function defaultSort(a: CreatorCardData, b: CreatorCardData): number {
  const aPriority = hasMarketplacePriority({ planTier: a.planTier });
  const bPriority = hasMarketplacePriority({ planTier: b.planTier });
  if (aPriority !== bPriority) return aPriority ? -1 : 1;
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

export async function enrichListing(
  listing: ListingForEnrich
): Promise<CreatorCardData> {
  const [card] = await enrichListingsBatch([listing]);
  return card;
}

export async function getFeaturedCreators(): Promise<FeaturedCreatorsResult> {
  return getFeaturedCreatorsCached();
}

const getFeaturedCreatorsCached = unstable_cache(
  async (): Promise<FeaturedCreatorsResult> => {
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
              planTier: true,
              foundingPartnerNo: true,
              trustScore: true,
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

    const enriched = await enrichListingsBatch(listings);

    return buildSpotlight(enriched, settings.featuredCreatorId);
  },
  ["featured-creators"],
  { revalidate: 60, tags: ["creators"] }
);

export async function getCreatorsPageStats() {
  return getLandingStats();
}
