import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";

const SECTOR_LABELS: Record<string, string> = {
  food: "مطاعم ومقاهي",
  fashion: "أزياء",
  tech: "تقنية",
  beauty: "جمال",
  lifestyle: "أسلوب حياة",
};

export type SectorBenchmark = {
  sector: string;
  sectorLabel: string;
  avgConversion: number;
  sampleSize: number;
};

export async function getSectorBenchmarks(creatorId: string): Promise<SectorBenchmark[]> {
  const creatorCampaigns = await prisma.campaign.findMany({
    where: { creatorId, ...notDeleted, status: "ACTIVE" },
    include: { sponsor: { select: { sector: true } } },
    take: 5,
  });

  const sectors = Array.from(
    new Set(
      creatorCampaigns.map((c) => c.sponsor.sector).filter((s): s is string => Boolean(s))
    )
  );

  if (sectors.length === 0) sectors.push("food");

  const results: SectorBenchmark[] = [];

  for (const sector of sectors.slice(0, 4)) {
    const campaigns = await prisma.campaign.findMany({
      where: {
        ...notDeleted,
        status: "ACTIVE",
        sponsor: { sector },
        creatorId: { not: creatorId },
      },
      select: { id: true, prizeClaimed: true, prizeQuantity: true },
      take: 50,
    });

    if (campaigns.length < 3) continue;

    const rates = await Promise.all(
      campaigns.map(async (c) => {
        const views = await prisma.campaignVisit.count({ where: { campaignId: c.id } });
        const redemptions = c.prizeClaimed;
        return views > 0 ? redemptions / views : redemptions / Math.max(c.prizeQuantity, 1);
      })
    );

    const avgConversion = rates.reduce((a, b) => a + b, 0) / rates.length;

    results.push({
      sector,
      sectorLabel: SECTOR_LABELS[sector] ?? sector,
      avgConversion,
      sampleSize: campaigns.length,
    });
  }

  return results.sort((a, b) => b.avgConversion - a.avgConversion);
}
