import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";
import { SYRIA_GOVERNORATES } from "@/lib/intelligence/heatmap";

export type NearbyCampaign = {
  id: string;
  title: string;
  slug: string | null;
  prizeName: string;
  prizeClaimed: number;
  prizeQuantity: number;
  city: string | null;
  governorate: string;
  sponsor: { name: string; logoUrl: string | null };
  primaryCode: string | null;
};

function matchGovernorate(city: string | null): string {
  if (!city) return "دمشق";
  const normalized = city.trim();
  for (const gov of SYRIA_GOVERNORATES) {
    if (normalized.includes(gov) || gov.includes(normalized)) return gov;
  }
  return normalized;
}

export async function getNearbyCampaigns(
  governorate?: string
): Promise<NearbyCampaign[]> {
  const campaigns = await prisma.campaign.findMany({
    where: {
      ...notDeleted,
      status: "ACTIVE",
    },
    include: {
      sponsor: { select: { name: true, logoUrl: true } },
      codes: { take: 1, orderBy: { id: "asc" } },
    },
    orderBy: { prizeClaimed: "desc" },
    take: 50,
  });

  const mapped = campaigns.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    prizeName: c.prizeName,
    prizeClaimed: c.prizeClaimed,
    prizeQuantity: c.prizeQuantity,
    city: c.city,
    governorate: matchGovernorate(c.city),
    sponsor: c.sponsor,
    primaryCode: c.codes[0]?.code ?? null,
  }));

  if (!governorate) return mapped;
  return mapped.filter((c) => c.governorate === governorate);
}

export { SYRIA_GOVERNORATES };
