import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export interface GlobalBenchmarks {
  avgConversion: number;
  bestHour: number | null;
  bestCity: string | null;
  avgCostPerRedemption: number;
  suggestedPrizeQuantity: number;
}

export async function getGlobalBenchmarks(): Promise<GlobalBenchmarks> {
  const campaigns = await prisma.campaign.findMany({
    where: { status: "ACTIVE", ...notDeleted },
    select: { id: true, costPerRedemption: true, prizeQuantity: true },
  });
  const campaignIds = campaigns.map((c) => c.id);

  if (campaignIds.length === 0) {
    return {
      avgConversion: 0.15,
      bestHour: 18,
      bestCity: "دمشق",
      avgCostPerRedemption: 2,
      suggestedPrizeQuantity: 20,
    };
  }

  const [views, redemptions, events, cities, costAgg] = await Promise.all([
    prisma.campaignEvent.count({
      where: { campaignId: { in: campaignIds }, type: "PAGE_VIEW" },
    }),
    prisma.campaignEvent.count({
      where: {
        campaignId: { in: campaignIds },
        type: "REDEMPTION_COMPLETED",
      },
    }),
    prisma.campaignEvent.findMany({
      where: {
        campaignId: { in: campaignIds },
        type: "REDEMPTION_COMPLETED",
      },
      select: { createdAt: true },
    }),
    prisma.redemption.groupBy({
      by: ["city"],
      where: { campaignId: { in: campaignIds }, city: { not: null } },
      _count: { city: true },
    }),
    prisma.campaign.aggregate({
      where: { id: { in: campaignIds } },
      _avg: { costPerRedemption: true, prizeQuantity: true },
    }),
  ]);

  const hourMap = new Map<number, number>();
  for (const e of events) {
    const h = e.createdAt.getHours();
    hourMap.set(h, (hourMap.get(h) ?? 0) + 1);
  }
  let bestHour: number | null = null;
  let maxH = 0;
  for (const [h, count] of Array.from(hourMap.entries())) {
    if (count > maxH) {
      bestHour = h;
      maxH = count;
    }
  }

  const citySorted = cities
    .filter((c) => c.city)
    .sort((a, b) => b._count.city - a._count.city);

  return {
    avgConversion: views > 0 ? redemptions / views : 0.15,
    bestHour: bestHour ?? 18,
    bestCity: citySorted[0]?.city ?? "دمشق",
    avgCostPerRedemption: costAgg._avg.costPerRedemption ?? 2,
    suggestedPrizeQuantity: Math.round(costAgg._avg.prizeQuantity ?? 20),
  };
}
