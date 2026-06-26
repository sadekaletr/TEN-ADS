import { getCachedCreator, getCachedCreatorSession } from "@/lib/creators/cached-session";
import { getCreatorAnalytics } from "@/lib/analytics";
import { getCreatorInsights } from "@/lib/intelligence/graph";
import { getCampaignRecommendations } from "@/lib/intelligence/recommendations";
import {
  getBestCampaignTemplate,
  getRecommendedSponsorsForCreator,
} from "@/lib/network/recommendations";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import {
  computeSparkScore,
  getLatestSparkScore,
} from "@/lib/intelligence/spark-score";
import { getSparkUnit } from "@/lib/spark";
import { BusinessDashboard } from "@/components/dashboard/BusinessDashboard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getCachedCreatorSession();
  if (!session) redirect("/login");

  const creator = await getCachedCreator();
  if (!creator) redirect("/login");

  let sparkScore = await getLatestSparkScore(creator.id);
  if (!sparkScore) {
    sparkScore = await computeSparkScore(creator.id);
  }

  const [analytics, insights, campaigns, sparkUnit, completedCampaigns, sparkRecommendation, recommendedSponsors, bestTemplate] = await Promise.all([
    getCreatorAnalytics(session.user.id),
    getCreatorInsights(session.user.id),
    prisma.campaign.findMany({
      where: { creatorId: session.user.id, ...notDeleted },
      include: { sponsor: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    getSparkUnit(),
    prisma.campaign.count({
      where: {
        creatorId: session.user.id,
        status: { in: ["ACTIVE", "ENDED"] },
        ...notDeleted,
      },
    }),
    getCampaignRecommendations(session.user.id),
    getRecommendedSponsorsForCreator(session.user.id),
    getBestCampaignTemplate(session.user.id),
  ]);

  return (
    <BusinessDashboard
      creatorId={session.user.id}
      creatorHandle={creator.handle}
      walletBalance={creator.walletBalance}
      sparkUnit={sparkUnit}
      sparkScore={sparkScore?.score ?? 0}
      completedCampaigns={completedCampaigns}
      analytics={{
        funnel: analytics.funnel,
        activeCampaigns: analytics.activeCampaigns,
      }}
      insights={insights}
      campaigns={campaigns}
      sparkRecommendation={sparkRecommendation}
      recommendedSponsors={recommendedSponsors}
      bestTemplate={bestTemplate}
    />
  );
}
