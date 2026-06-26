import { Prisma, type EventType } from "@prisma/client";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { detectDevice, getClientIp, hashIp } from "@/lib/session";

export interface TrackPayload {
  campaignId: string;
  sessionId: string;
  type: EventType;
  metadata?: Record<string, unknown>;
}

export interface AnalyticsExtras {
  uniqueSessions: number;
  deviceBreakdown: { device: string; count: number }[];
  referrerTop: { referrer: string; count: number }[];
  failures: { reason: string; count: number }[];
  failedTotal: number;
}

async function getVisitExtras(campaignIds: string[]): Promise<AnalyticsExtras> {
  if (campaignIds.length === 0) {
    return {
      uniqueSessions: 0,
      deviceBreakdown: [],
      referrerTop: [],
      failures: [],
      failedTotal: 0,
    };
  }

  const [visits, failedEvents] = await Promise.all([
    prisma.campaignVisit.findMany({
      where: { campaignId: { in: campaignIds } },
      select: { sessionId: true, device: true, referrer: true },
    }),
    prisma.campaignEvent.findMany({
      where: { campaignId: { in: campaignIds }, type: "REDEMPTION_FAILED" },
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
    let host = "direct";
    if (v.referrer) {
      try {
        host = v.referrer.startsWith("http")
          ? new URL(v.referrer).hostname
          : v.referrer.slice(0, 40);
      } catch {
        host = v.referrer.slice(0, 40);
      }
    }
    referrerMap.set(host, (referrerMap.get(host) ?? 0) + 1);
  }

  const reasonMap = new Map<string, number>();
  for (const e of failedEvents) {
    const meta = e.metadata as { reason?: string } | null;
    const reason = meta?.reason ?? "unknown";
    reasonMap.set(reason, (reasonMap.get(reason) ?? 0) + 1);
  }

  return {
    uniqueSessions,
    deviceBreakdown: Array.from(deviceMap.entries())
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count),
    referrerTop: Array.from(referrerMap.entries())
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    failures: Array.from(reasonMap.entries())
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count),
    failedTotal: failedEvents.length,
  };
}

export async function trackCampaignEvent(
  payload: TrackPayload,
  headers: Headers
) {
  const ip = getClientIp(headers);
  const ipHash = hashIp(ip);
  const userAgent = headers.get("user-agent");
  const device = detectDevice(userAgent);
  const referrer = headers.get("referer");

  if (payload.type === "PAGE_VIEW") {
    await prisma.campaignVisit.create({
      data: {
        campaignId: payload.campaignId,
        sessionId: payload.sessionId,
        ipHash,
        userAgent,
        device,
        referrer,
      },
    });
  }

  await prisma.campaignEvent.create({
    data: {
      campaignId: payload.campaignId,
      sessionId: payload.sessionId,
      type: payload.type,
      metadata: (payload.metadata ?? {}) as Prisma.InputJsonValue,
    },
  });
}

export async function getCreatorAnalytics(creatorId: string) {
  const campaigns = await prisma.campaign.findMany({
    where: { creatorId, ...notDeleted },
    select: { id: true },
  });
  const campaignIds = campaigns.map((c) => c.id);

  if (campaignIds.length === 0) {
    return {
      funnel: { views: 0, codeSubmits: 0, redemptions: 0 },
      activeCampaigns: 0,
      totalPrizesClaimed: 0,
      cities: [] as { city: string; count: number }[],
      peakHours: [] as { hour: number; count: number }[],
      uniqueSessions: 0,
      deviceBreakdown: [] as { device: string; count: number }[],
      referrerTop: [] as { referrer: string; count: number }[],
      failures: [] as { reason: string; count: number }[],
      failedTotal: 0,
    };
  }

  const [views, codeSubmits, redemptions, activeCampaigns, prizeAgg, redemptionsByCity, peakHourRows, extras] =
    await Promise.all([
      prisma.campaignEvent.count({
        where: { campaignId: { in: campaignIds }, type: "PAGE_VIEW" },
      }),
      prisma.campaignEvent.count({
        where: { campaignId: { in: campaignIds }, type: "CODE_SUBMIT" },
      }),
      prisma.campaignEvent.count({
        where: { campaignId: { in: campaignIds }, type: "REDEMPTION_COMPLETED" },
      }),
      prisma.campaign.count({
        where: { creatorId, status: "ACTIVE", ...notDeleted },
      }),
      prisma.campaign.aggregate({
        where: { creatorId, ...notDeleted },
        _sum: { prizeClaimed: true },
      }),
      prisma.redemption.groupBy({
        by: ["city"],
        where: { campaignId: { in: campaignIds }, city: { not: null } },
        _count: { city: true },
      }),
      prisma.$queryRaw<{ hour: number; count: bigint }[]>`
        SELECT EXTRACT(HOUR FROM "createdAt")::int AS hour, COUNT(*)::bigint AS count
        FROM "CampaignEvent"
        WHERE "campaignId" IN (${Prisma.join(campaignIds)})
        GROUP BY hour
        ORDER BY hour
      `,
      getVisitExtras(campaignIds),
    ]);

  const peakHours = peakHourRows.map((row) => ({
    hour: row.hour,
    count: Number(row.count),
  }));

  const cities = redemptionsByCity
    .filter((r) => r.city)
    .map((r) => ({ city: r.city!, count: r._count.city }))
    .sort((a, b) => b.count - a.count);

  return {
    funnel: { views, codeSubmits, redemptions },
    activeCampaigns,
    totalPrizesClaimed: prizeAgg._sum.prizeClaimed ?? 0,
    cities,
    peakHours,
    ...extras,
  };
}

export async function getCampaignAnalytics(campaignId: string) {
  const [views, codeSubmits, redemptions, events, redemptionsByCity, extras] =
    await Promise.all([
      prisma.campaignEvent.count({
        where: { campaignId, type: "PAGE_VIEW" },
      }),
      prisma.campaignEvent.count({
        where: { campaignId, type: "CODE_SUBMIT" },
      }),
      prisma.campaignEvent.count({
        where: { campaignId, type: "REDEMPTION_COMPLETED" },
      }),
      prisma.campaignEvent.findMany({
        where: { campaignId },
        select: { createdAt: true },
      }),
      prisma.redemption.groupBy({
        by: ["city"],
        where: { campaignId, city: { not: null } },
        _count: { city: true },
      }),
      getVisitExtras([campaignId]),
    ]);

  const hourMap = new Map<number, number>();
  for (const e of events) {
    const hour = e.createdAt.getHours();
    hourMap.set(hour, (hourMap.get(hour) ?? 0) + 1);
  }

  return {
    funnel: { views, codeSubmits, redemptions },
    cities: redemptionsByCity
      .filter((r) => r.city)
      .map((r) => ({ city: r.city!, count: r._count.city })),
    peakHours: Array.from(hourMap.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour - b.hour),
    ...extras,
  };
}
