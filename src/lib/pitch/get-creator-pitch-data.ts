import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";
import { getCampaignAnalytics } from "@/lib/analytics";
import { getLatestSparkScore } from "@/lib/intelligence/spark-score";
import { getTrustScoreDisplay } from "@/lib/intelligence/trust-score";

export const RESERVED_HANDLES = new Set([
  "login",
  "dashboard",
  "admin",
  "campaign",
  "c",
  "discover",
  "redeem",
  "sponsor",
  "agency",
  "marketplace",
  "intelligence",
  "wallet",
  "creator",
  "shop",
  "partner",
  "terms",
  "privacy",
  "api",
  "notifications",
  "leaderboard",
  "design-preview",
]);

export type CreatorPitchData = {
  creator: {
    id: string;
    name: string;
    handle: string;
    avatarUrl: string | null;
    verified: boolean;
  };
  sparkScore: number;
  trustScore: { score: number; campaignsCount: number };
  stats: {
    campaigns: number;
    totalRedemptions: number;
    conversionRate: number;
  };
  caseStudy: {
    title: string;
    prizeName: string;
    prizeClaimed: number;
    prizeQuantity: number;
    sponsorName: string;
    funnelViews: number;
    primaryCode: string | null;
  } | null;
  demoCode: string;
};

export async function getCreatorPitchData(handle: string): Promise<CreatorPitchData | null> {
  const normalized = handle.replace(/^@/, "");
  const creator = await prisma.creator.findFirst({
    where: {
      OR: [{ handle: `@${normalized}` }, { handle: normalized }],
      ...notDeleted,
    },
  });
  if (!creator) return null;

  const [spark, trust, campaigns, bestCampaign] = await Promise.all([
    getLatestSparkScore(creator.id),
    getTrustScoreDisplay("CREATOR", creator.id),
    prisma.campaign.findMany({
      where: { creatorId: creator.id, ...notDeleted },
      select: { prizeClaimed: true, status: true },
    }),
    prisma.campaign.findFirst({
      where: { creatorId: creator.id, ...notDeleted, status: { in: ["ACTIVE", "ENDED"] } },
      orderBy: { prizeClaimed: "desc" },
      include: {
        sponsor: { select: { name: true } },
        codes: { take: 1, orderBy: { id: "asc" } },
      },
    }),
  ]);

  const totalRedemptions = campaigns.reduce((s, c) => s + c.prizeClaimed, 0);
  let funnelViews = 0;
  let conversionRate = 0;

  if (bestCampaign) {
    const analytics = await getCampaignAnalytics(bestCampaign.id);
    funnelViews = analytics.funnel.views;
    conversionRate =
      analytics.funnel.views > 0
        ? Math.round((analytics.funnel.redemptions / analytics.funnel.views) * 100)
        : 0;
  }

  const demoCode =
    bestCampaign?.codes[0]?.code ??
    (await prisma.campaignCode.findFirst({
      where: { code: "SPARK-HERO-H1" },
      select: { code: true },
    }))?.code ??
    "SPARK-DEMO-CODE";

  return {
    creator: {
      id: creator.id,
      name: creator.name,
      handle: creator.handle.replace(/^@/, ""),
      avatarUrl: creator.avatarUrl,
      verified: creator.verified,
    },
    sparkScore: spark?.score ?? 0,
    trustScore: trust,
    stats: {
      campaigns: campaigns.length,
      totalRedemptions,
      conversionRate,
    },
    caseStudy: bestCampaign
      ? {
          title: bestCampaign.title,
          prizeName: bestCampaign.prizeName,
          prizeClaimed: bestCampaign.prizeClaimed,
          prizeQuantity: bestCampaign.prizeQuantity,
          sponsorName: bestCampaign.sponsor.name,
          funnelViews,
          primaryCode: bestCampaign.codes[0]?.code ?? null,
        }
      : null,
    demoCode,
  };
}
