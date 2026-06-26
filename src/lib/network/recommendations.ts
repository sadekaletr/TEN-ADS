import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";

export async function getRecommendedSponsorsForCreator(creatorId: string, limit = 3) {
  const creatorCampaigns = await prisma.campaign.findMany({
    where: { creatorId, ...notDeleted },
    select: { city: true, sponsorId: true },
    take: 5,
  });

  const cities = Array.from(
    new Set(creatorCampaigns.map((c) => c.city).filter((c): c is string => Boolean(c)))
  );
  const sponsorIds = Array.from(new Set(creatorCampaigns.map((c) => c.sponsorId)));

  const sectors: string[] =
    sponsorIds.length > 0
      ? (
          await prisma.sponsor.findMany({
            where: { id: { in: sponsorIds } },
            select: { sector: true },
          })
        )
          .map((s) => s.sector)
          .filter((s): s is string => Boolean(s))
      : [];

  const sponsors = await prisma.sponsor.findMany({
    where: {
      ...notDeleted,
      verified: true,
      campaigns: {
        some: {
          ...notDeleted,
          prizeClaimed: { gte: 10 },
          ...(cities.length > 0 ? { city: { in: cities } } : {}),
        },
      },
      ...(sectors.length > 0 ? { sector: { in: sectors } } : {}),
    },
    select: { id: true, name: true, logoUrl: true, city: true, verified: true },
    take: limit,
    orderBy: { trustScore: "desc" },
  });

  return sponsors;
}

export async function getRecommendedCreatorsForSponsor(sponsorId: string, limit = 3) {
  const sponsor = await prisma.sponsor.findUnique({
    where: { id: sponsorId },
    select: { city: true, sector: true },
  });

  const listings = await prisma.creatorListing.findMany({
    where: {
      isPublic: true,
      creator: {
        ...notDeleted,
        trustScore: { gte: 50 },
        ...(sponsor?.city
          ? { campaigns: { some: { city: sponsor.city, ...notDeleted } } }
          : {}),
      },
    },
    include: {
      creator: {
        select: { id: true, name: true, handle: true, avatarUrl: true, trustScore: true, verified: true },
      },
    },
    take: limit,
    orderBy: { estimatedReach: "desc" },
  });

  return listings.map((l) => l.creator);
}

export type CampaignTemplate = {
  title: string;
  prizeName: string;
  prizeQuantity: number;
  tier: string;
  city: string | null;
  costPerRedemption: number;
};

export async function getBestCampaignTemplate(
  creatorId: string
): Promise<CampaignTemplate | null> {
  const best = await prisma.campaign.findFirst({
    where: { creatorId, ...notDeleted, prizeClaimed: { gte: 5 } },
    orderBy: { prizeClaimed: "desc" },
    select: {
      title: true,
      prizeName: true,
      prizeQuantity: true,
      tier: true,
      city: true,
      costPerRedemption: true,
    },
  });
  return best;
}
