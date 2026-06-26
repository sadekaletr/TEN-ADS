import { notDeleted } from "@/lib/db";
import { getGlobalBenchmarks } from "@/lib/intelligence/global-learning";
import { prisma } from "@/lib/prisma";

export interface CampaignRecommendation {
  prizeQuantity: number;
  costPerRedemption: number;
  city: string | null;
  suggestedHour: number | null;
  rationale: string;
}

export async function getCampaignRecommendations(
  creatorId: string
): Promise<CampaignRecommendation> {
  const [campaigns, benchmarks] = await Promise.all([
    prisma.campaign.findMany({
      where: { creatorId, ...notDeleted, status: { not: "DRAFT" } },
      select: {
        prizeQuantity: true,
        costPerRedemption: true,
        city: true,
        prizeClaimed: true,
        startsAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    getGlobalBenchmarks(),
  ]);

  if (campaigns.length === 0) {
    return {
      prizeQuantity: benchmarks.suggestedPrizeQuantity,
      costPerRedemption: benchmarks.avgCostPerRedemption,
      city: benchmarks.bestCity,
      suggestedHour: benchmarks.bestHour,
      rationale: "بناءً على معايير المنصة العامة",
    };
  }

  const avgQty =
    campaigns.reduce((s, c) => s + c.prizeQuantity, 0) / campaigns.length;
  const avgCost =
    campaigns.reduce((s, c) => s + c.costPerRedemption, 0) / campaigns.length;

  const successful = campaigns.filter(
    (c) => c.prizeClaimed / c.prizeQuantity > 0.5
  );
  const bestCity =
    successful.find((c) => c.city)?.city ??
    benchmarks.bestCity ??
    campaigns.find((c) => c.city)?.city ??
    null;

  const prizeQuantity = Math.round(
    (avgQty + benchmarks.suggestedPrizeQuantity) / 2
  );
  const costPerRedemption = Math.max(
    1,
    Math.round((avgCost + benchmarks.avgCostPerRedemption) / 2)
  );

  return {
    prizeQuantity,
    costPerRedemption,
    city: bestCity,
    suggestedHour: benchmarks.bestHour,
    rationale:
      successful.length > 0
        ? `مبني على ${successful.length} حملة ناجحة سابقة + معايير المنصة`
        : "مبني على حملاتك السابقة + معايير المنصة",
  };
}
