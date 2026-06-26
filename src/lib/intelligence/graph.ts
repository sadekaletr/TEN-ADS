import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export interface CreatorInsights {
  bestHour: number | null;
  bestCity: string | null;
  bestDevice: string | null;
  bestDeviceConversion: number;
  totalCampaigns: number;
  avgCostPerRedemption: number;
}

export async function getCreatorInsights(
  creatorId: string
): Promise<CreatorInsights> {
  const campaigns = await prisma.campaign.findMany({
    where: { creatorId, ...notDeleted },
    select: { id: true, costPerRedemption: true },
  });
  const campaignIds = campaigns.map((c) => c.id);

  if (campaignIds.length === 0) {
    return {
      bestHour: null,
      bestCity: null,
      bestDevice: null,
      bestDeviceConversion: 0,
      totalCampaigns: 0,
      avgCostPerRedemption: 0,
    };
  }

  const [events, visits, redemptionsByCity, redemptions] = await Promise.all([
    prisma.campaignEvent.findMany({
      where: {
        campaignId: { in: campaignIds },
        type: "REDEMPTION_COMPLETED",
      },
      select: { createdAt: true },
    }),
    prisma.campaignVisit.findMany({
      where: { campaignId: { in: campaignIds } },
      select: { device: true, sessionId: true, campaignId: true },
    }),
    prisma.redemption.groupBy({
      by: ["city"],
      where: { campaignId: { in: campaignIds }, city: { not: null } },
      _count: { city: true },
    }),
    prisma.redemption.findMany({
      where: { campaignId: { in: campaignIds }, sessionId: { not: null } },
      select: { sessionId: true },
    }),
  ]);

  const hourMap = new Map<number, number>();
  for (const e of events) {
    const h = e.createdAt.getHours();
    hourMap.set(h, (hourMap.get(h) ?? 0) + 1);
  }
  let bestHour: number | null = null;
  let bestHourCount = 0;
  for (const [hour, count] of Array.from(hourMap.entries())) {
    if (count > bestHourCount) {
      bestHour = hour;
      bestHourCount = count;
    }
  }

  const citySorted = redemptionsByCity
    .filter((c) => c.city)
    .sort((a, b) => b._count.city - a._count.city);
  const bestCity = citySorted[0]?.city ?? null;

  const redeemedSessions = new Set(
    redemptions.map((r) => r.sessionId).filter(Boolean)
  );
  const deviceStats = new Map<string, { visits: number; conversions: number }>();
  for (const v of visits) {
    const device = v.device ?? "unknown";
    const stat = deviceStats.get(device) ?? { visits: 0, conversions: 0 };
    stat.visits += 1;
    if (redeemedSessions.has(v.sessionId)) stat.conversions += 1;
    deviceStats.set(device, stat);
  }

  let bestDevice: string | null = null;
  let bestDeviceConversion = 0;
  for (const [device, stat] of Array.from(deviceStats.entries())) {
    const rate = stat.visits > 0 ? stat.conversions / stat.visits : 0;
    if (rate > bestDeviceConversion) {
      bestDevice = device;
      bestDeviceConversion = rate;
    }
  }

  const avgCost =
    campaigns.reduce((s, c) => s + c.costPerRedemption, 0) / campaigns.length;

  return {
    bestHour,
    bestCity,
    bestDevice,
    bestDeviceConversion,
    totalCampaigns: campaigns.length,
    avgCostPerRedemption: avgCost,
  };
}

export interface CampaignInsights {
  costPerRedemption: number;
  actualCostPerRedemption: number;
  dropOffViewToSubmit: number;
  dropOffSubmitToRedeem: number;
  uniqueSessions: number;
  deviceBreakdown: { device: string; count: number }[];
  referrerTop: { referrer: string; count: number }[];
  failedCount: number;
}

export async function getCampaignInsights(
  campaignId: string
): Promise<CampaignInsights> {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: { costPerRedemption: true, prizeClaimed: true },
  });

  const [views, submits, redemptions, visits, failed] = await Promise.all([
    prisma.campaignEvent.count({
      where: { campaignId, type: "PAGE_VIEW" },
    }),
    prisma.campaignEvent.count({
      where: { campaignId, type: "CODE_SUBMIT" },
    }),
    prisma.campaignEvent.count({
      where: { campaignId, type: "REDEMPTION_COMPLETED" },
    }),
    prisma.campaignVisit.findMany({
      where: { campaignId },
      select: { device: true, referrer: true, sessionId: true },
    }),
    prisma.campaignEvent.findMany({
      where: { campaignId, type: "REDEMPTION_FAILED" },
      select: { metadata: true },
    }),
  ]);

  const uniqueSessions = new Set(visits.map((v) => v.sessionId)).size;

  const deviceMap = new Map<string, number>();
  for (const v of visits) {
    const d = v.device ?? "unknown";
    deviceMap.set(d, (deviceMap.get(d) ?? 0) + 1);
  }

  const referrerMap = new Map<string, number>();
  for (const v of visits) {
    const ref = v.referrer || "direct";
    const short =
      ref.length > 40 ? new URL(ref).hostname || ref.slice(0, 40) : ref;
    try {
      const host = ref.startsWith("http") ? new URL(ref).hostname : ref;
      referrerMap.set(host, (referrerMap.get(host) ?? 0) + 1);
    } catch {
      referrerMap.set(short, (referrerMap.get(short) ?? 0) + 1);
    }
  }

  const claimed = campaign?.prizeClaimed ?? 0;
  const cost = campaign?.costPerRedemption ?? 0;

  return {
    costPerRedemption: cost,
    actualCostPerRedemption: claimed > 0 ? cost : 0,
    dropOffViewToSubmit: views > 0 ? 1 - submits / views : 0,
    dropOffSubmitToRedeem: submits > 0 ? 1 - redemptions / submits : 0,
    uniqueSessions,
    deviceBreakdown: Array.from(deviceMap.entries())
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count),
    referrerTop: Array.from(referrerMap.entries())
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    failedCount: failed.length,
  };
}
