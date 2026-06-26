import { notDeleted } from "@/lib/db";
import { enrichListingsBatch } from "@/lib/creators/enrich";
import { prisma } from "@/lib/prisma";
import { getSponsorSession } from "@/lib/session-auth";
import { redirect } from "next/navigation";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { MarketplacePageClient } from "@/components/marketplace/MarketplacePageClient";
import { CircuitPageBackground } from "@/components/ui/CircuitPageBackground";

const MARKETPLACE_LISTING_LIMIT = 24;

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: { city?: string; category?: string; minTrust?: string };
}) {
  const session = await getSponsorSession();
  if (!session) redirect("/sponsor/login");

  const listings = await prisma.creatorListing.findMany({
    where: {
      isPublic: true,
      creator: { deletedAt: null },
    },
    take: MARKETPLACE_LISTING_LIMIT,
    orderBy: { createdAt: "desc" },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          handle: true,
          avatarUrl: true,
          verified: true,
          trustScore: true,
          createdAt: true,
          marketplaceBoostUntil: true,
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
  });

  const minTrust = searchParams.minTrust
    ? Number(searchParams.minTrust)
    : 0;

  const filtered = listings.filter((l) => {
    if (searchParams.city && l.creator.campaigns[0]?.city !== searchParams.city)
      return false;
    if (
      searchParams.category &&
      !l.categories.includes(searchParams.category)
    )
      return false;
    if ((l.creator.trustScore ?? 0) < minTrust) return false;
    return true;
  });

  const now = new Date();
  const sorted = [...filtered].sort((a, b) => {
    const aBoost =
      a.creator.marketplaceBoostUntil && a.creator.marketplaceBoostUntil > now
        ? 1
        : 0;
    const bBoost =
      b.creator.marketplaceBoostUntil && b.creator.marketplaceBoostUntil > now
        ? 1
        : 0;
    if (bBoost !== aBoost) return bBoost - aBoost;
    return (b.creator.trustScore ?? 0) - (a.creator.trustScore ?? 0);
  });

  const enriched = await enrichListingsBatch(sorted);

  const discoverCampaigns = await prisma.campaign.findMany({
    where: { status: "ACTIVE", ...notDeleted, slug: { not: null } },
    orderBy: { createdAt: "desc" },
    take: 24,
    select: {
      id: true,
      title: true,
      prizeName: true,
      prizeClaimed: true,
      prizeQuantity: true,
      city: true,
      slug: true,
      creator: { select: { name: true, handle: true } },
      sponsor: { select: { name: true, verified: true } },
    },
  });

  return (
    <CircuitPageBackground>
      <main className="mx-auto min-h-screen max-w-6xl px-4 py-10" id="main-content">
        <MarketplaceHeader userName={session.user.name ?? ""} />
        <MarketplacePageClient
          creators={enriched}
          discoverCampaigns={discoverCampaigns}
          searchParams={searchParams}
        />
      </main>
    </CircuitPageBackground>
  );
}
