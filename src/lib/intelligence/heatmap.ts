import { prisma } from "@/lib/prisma";

export const SYRIA_GOVERNORATES = [
  "دمشق",
  "حلب",
  "حمص",
  "حماة",
  "اللاذقية",
  "طرطوس",
  "دير الزور",
  "الرقة",
  "السويداء",
  "درعا",
  "إدلب",
  "القنيطرة",
  "ريف دمشق",
];

export interface HeatmapCell {
  governorate: string;
  count: number;
  intensity: number;
}

export async function getHeatmapData(
  days: 7 | 30 = 7,
  sector?: string
): Promise<HeatmapCell[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const redemptions = await prisma.redemption.findMany({
    where: {
      createdAt: { gte: since },
      city: { not: null },
      ...(sector
        ? {
            campaign: {
              sponsor: { sector },
            },
          }
        : {}),
    },
    select: { city: true },
  });

  const counts = new Map<string, number>();
  for (const r of redemptions) {
    if (!r.city) continue;
    const gov = matchGovernorate(r.city);
    counts.set(gov, (counts.get(gov) ?? 0) + 1);
  }

  const max = Math.max(1, ...Array.from(counts.values()));

  return SYRIA_GOVERNORATES.map((gov) => {
    const count = counts.get(gov) ?? 0;
    return {
      governorate: gov,
      count,
      intensity: count / max,
    };
  });
}

function matchGovernorate(city: string): string {
  const normalized = city.trim();
  for (const gov of SYRIA_GOVERNORATES) {
    if (normalized.includes(gov) || gov.includes(normalized)) return gov;
  }
  return normalized;
}

export async function hasActiveIntelligenceSubscription(
  userId: string,
  role: string
): Promise<boolean> {
  const now = new Date();
  if (role === "creator") {
    const sub = await prisma.intelligenceSubscription.findUnique({
      where: { creatorId: userId },
    });
    if (sub && sub.activeUntil > now) return true;

    const empireCampaign = await prisma.campaign.findFirst({
      where: {
        creatorId: userId,
        tier: "EMPIRE",
        status: "ACTIVE",
        deletedAt: null,
      },
    });
    return !!empireCampaign;
  }
  if (role === "sponsor") {
    const sub = await prisma.intelligenceSubscription.findUnique({
      where: { sponsorId: userId },
    });
    return !!sub && sub.activeUntil > now;
  }
  if (role === "admin") return true;
  return false;
}
