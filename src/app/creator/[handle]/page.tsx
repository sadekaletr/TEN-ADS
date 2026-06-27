import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { notDeleted } from "@/lib/db";
import { getTrustScoreDisplay } from "@/lib/intelligence/trust-score";
import { getLatestSparkScore } from "@/lib/intelligence/spark-score";
import { prisma } from "@/lib/prisma";
import { CreatorPublicClient } from "@/components/creator/CreatorPublicClient";
import { PublicShell } from "@/components/layout/PublicShell";

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const handle = decodeURIComponent(params.handle).replace(/^@/, "");
  const creator = await prisma.creator.findFirst({
    where: { OR: [{ handle: `@${handle}` }, { handle }], ...notDeleted },
    select: { name: true, handle: true },
  });
  if (!creator) return { title: "Creator not found" };
  return {
    title: `${creator.name} (@${creator.handle}) — TENEGTA`,
    description: `حملات وجوائز ${creator.name} على TENEGTA Spark`,
  };
}

export default async function CreatorPublicPage({
  params,
}: {
  params: { handle: string };
}) {
  const handle = decodeURIComponent(params.handle).replace(/^@/, "");

  const creator = await prisma.creator.findFirst({
    where: {
      OR: [{ handle: `@${handle}` }, { handle }],
      ...notDeleted,
    },
    include: {
      campaigns: {
        where: { ...notDeleted },
        include: { sponsor: { select: { id: true, name: true, logoUrl: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!creator) notFound();

  const [trust, sparkSnapshot, listing] = await Promise.all([
    getTrustScoreDisplay("CREATOR", creator.id),
    getLatestSparkScore(creator.id),
    prisma.creatorListing.findUnique({
      where: { creatorId: creator.id },
      select: {
        coverImageUrl: true,
        bio: true,
        showcaseTagline: true,
        categories: true,
      },
    }),
  ]);

  const activeCampaigns = creator.campaigns
    .filter((c) => c.status === "ACTIVE")
    .map((c) => ({
      id: c.id,
      title: c.title,
      prizeName: c.prizeName,
      slug: c.slug,
      status: c.status,
      prizeClaimed: c.prizeClaimed,
      sponsor: c.sponsor,
    }));

  const endedCampaigns = creator.campaigns
    .filter((c) => c.status === "ENDED")
    .map((c) => ({
      id: c.id,
      title: c.title,
      sponsorName: c.sponsor.name,
    }));

  const sponsorMap = new Map<string, { id: string; name: string; logoUrl: string | null }>();
  for (const c of creator.campaigns) {
    sponsorMap.set(c.sponsor.id, c.sponsor);
  }

  const totalPrizes = creator.campaigns.reduce((s, c) => s + c.prizeClaimed, 0);

  return (
    <PublicShell analytics={false}>
      <CreatorPublicClient
        creator={{
          id: creator.id,
          name: creator.name,
          handle: creator.handle.replace(/^@/, ""),
          avatarUrl: creator.avatarUrl,
          verified: creator.verified,
          planTier: creator.planTier,
          foundingPartnerNo: creator.foundingPartnerNo,
          phone: creator.phone,
          sparkScore: sparkSnapshot?.score ?? null,
        }}
        trust={trust}
        activeCampaigns={activeCampaigns}
        endedCampaigns={endedCampaigns}
        sponsors={Array.from(sponsorMap.values())}
        totalPrizes={totalPrizes}
        coverImageUrl={listing?.coverImageUrl ?? null}
        bio={listing?.bio ?? null}
        showcaseTagline={listing?.showcaseTagline ?? null}
        categories={listing?.categories ?? []}
        totalRedemptions={totalPrizes}
      />
    </PublicShell>
  );
}
