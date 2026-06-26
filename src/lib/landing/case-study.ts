import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";
import { getCampaignAnalytics } from "@/lib/analytics";

export type FeaturedCaseStudy = {
  campaignId: string;
  title: string;
  prizeName: string;
  prizeClaimed: number;
  prizeQuantity: number;
  durationDays: number;
  roiEstimate: number;
  primaryCode: string | null;
  slug: string | null;
  sponsor: { name: string; logoUrl: string | null; verified: boolean };
  creator: { name: string; handle: string };
  funnel: { views: number; redemptions: number };
};

export async function getFeaturedCaseStudy(): Promise<FeaturedCaseStudy | null> {
  const settings = await prisma.platformSettings.findUnique({ where: { id: "default" } });
  const overrideId = settings?.featuredCampaignId;

  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  let campaign = overrideId
    ? await prisma.campaign.findFirst({
        where: { id: overrideId, ...notDeleted, status: { not: "ENDED" } },
        include: {
          sponsor: { select: { name: true, logoUrl: true, verified: true } },
          creator: { select: { name: true, handle: true } },
          codes: { take: 1, orderBy: { id: "asc" } },
        },
      })
    : null;

  if (!campaign) {
    campaign = await prisma.campaign.findFirst({
        where: {
          ...notDeleted,
          prizeClaimed: { gte: 5 },
          OR: [{ status: "ENDED" }, { status: "ACTIVE" }],
          createdAt: { gte: since },
        },
        orderBy: { prizeClaimed: "desc" },
        include: {
          sponsor: { select: { name: true, logoUrl: true, verified: true } },
          creator: { select: { name: true, handle: true } },
          codes: { take: 1, orderBy: { id: "asc" } },
        },
      });
  }

  if (!campaign) return null;

  const analytics = await getCampaignAnalytics(campaign.id);
  const durationMs =
    (campaign.endsAt ?? new Date()).getTime() - campaign.createdAt.getTime();
  const durationDays = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));
  const totalCost = campaign.prizeClaimed * campaign.costPerRedemption;
  const roiEstimate =
    campaign.prizeClaimed > 0
      ? Math.round((analytics.funnel.redemptions / Math.max(totalCost, 1)) * 10) / 10
      : 0;

  return {
    campaignId: campaign.id,
    title: campaign.title,
    prizeName: campaign.prizeName,
    prizeClaimed: campaign.prizeClaimed,
    prizeQuantity: campaign.prizeQuantity,
    durationDays,
    roiEstimate: Math.min(roiEstimate, 9.9),
    primaryCode: campaign.codes[0]?.code ?? null,
    slug: campaign.slug,
    sponsor: campaign.sponsor,
    creator: campaign.creator,
    funnel: {
      views: analytics.funnel.views,
      redemptions: analytics.funnel.redemptions,
    },
  };
}
