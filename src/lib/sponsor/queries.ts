import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";

export async function getSponsorOverview(sponsorId: string) {
  const campaigns = await prisma.campaign.findMany({
    where: { sponsorId, ...notDeleted },
    select: {
      id: true,
      status: true,
      prizeClaimed: true,
      prizeQuantity: true,
      costPerRedemption: true,
    },
  });

  const campaignIds = campaigns.map((c) => c.id);
  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length;
  const prizesDistributed = campaigns.reduce((s, c) => s + c.prizeClaimed, 0);
  const totalParticipants = campaignIds.length
    ? await prisma.redemption.count({ where: { campaignId: { in: campaignIds } } })
    : 0;

  return {
    activeCampaigns,
    prizesDistributed,
    totalParticipants,
    campaignCount: campaigns.length,
  };
}

export async function getSponsorCampaigns(sponsorId: string) {
  return prisma.campaign.findMany({
    where: { sponsorId, ...notDeleted },
    orderBy: { createdAt: "desc" },
    include: {
      creator: { select: { name: true, handle: true } },
      _count: { select: { redemptions: true } },
    },
  });
}

export async function getSponsorRoi(sponsorId: string) {
  const campaigns = await prisma.campaign.findMany({
    where: { sponsorId, ...notDeleted },
    select: {
      id: true,
      title: true,
      costPerRedemption: true,
      prizeClaimed: true,
    },
  });

  const totalRedemptions = campaigns.reduce((s, c) => s + c.prizeClaimed, 0);
  const totalSparkCost = campaigns.reduce(
    (s, c) => s + c.prizeClaimed * c.costPerRedemption,
    0
  );
  const costPerRedemption =
    totalRedemptions > 0 ? Math.round(totalSparkCost / totalRedemptions) : 0;

  return {
    totalRedemptions,
    totalSparkCost,
    costPerRedemption,
    campaigns: campaigns.map((c) => ({
      title: c.title,
      redemptions: c.prizeClaimed,
      sparkCost: c.prizeClaimed * c.costPerRedemption,
    })),
  };
}

export async function getSponsorCollabSla(sponsorId: string) {
  const requests = await prisma.collabRequest.findMany({
    where: {
      sponsorId,
      status: { in: ["ACCEPTED", "DECLINED"] },
      updatedAt: { not: undefined },
    },
    select: { createdAt: true, updatedAt: true },
    take: 50,
    orderBy: { updatedAt: "desc" },
  });

  if (requests.length === 0) {
    return { avgResponseHours: null, respondedCount: 0 };
  }

  const hours = requests.map((r) => {
    const ms = r.updatedAt.getTime() - r.createdAt.getTime();
    return ms / (1000 * 60 * 60);
  });
  const avg = hours.reduce((a, b) => a + b, 0) / hours.length;

  return { avgResponseHours: avg, respondedCount: requests.length };
}

export async function getSponsorLeads(sponsorId: string) {
  return prisma.redemption.findMany({
    where: {
      campaign: { sponsorId, ...notDeleted },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      fullName: true,
      phone: true,
      city: true,
      createdAt: true,
      campaign: { select: { title: true, prizeName: true } },
    },
  });
}

export type SponsorCommandCenterData = {
  flagship: {
    id: string;
    title: string;
    status: string;
    prizeClaimed: number;
    prizeQuantity: number;
    costPerRedemption: number;
  } | null;
  participants: number;
  redemptionsToday: number;
  lastHourDelta: number;
  healthPercent: number;
  totalSparkCost: number;
  totalReach: number;
  totalRedemptions: number;
  costPerRedemption: number;
};

export async function getSponsorCommandCenter(
  sponsorId: string
): Promise<SponsorCommandCenterData> {
  const campaigns = await prisma.campaign.findMany({
    where: { sponsorId, ...notDeleted },
    select: {
      id: true,
      title: true,
      status: true,
      prizeClaimed: true,
      prizeQuantity: true,
      costPerRedemption: true,
      createdAt: true,
    },
  });

  const campaignIds = campaigns.map((c) => c.id);
  const active = campaigns.filter((c) => c.status === "ACTIVE");
  const flagship =
    [...active].sort((a, b) => b.prizeClaimed - a.prizeClaimed)[0] ??
    [...campaigns].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )[0] ??
    null;

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);

  const [participants, redemptionsToday, lastHourDelta, totalReach] =
    campaignIds.length === 0
      ? [0, 0, 0, 0]
      : await Promise.all([
          prisma.redemption.count({
            where: { campaignId: { in: campaignIds } },
          }),
          prisma.redemption.count({
            where: {
              campaignId: { in: campaignIds },
              createdAt: { gte: dayStart },
            },
          }),
          prisma.redemption.count({
            where: {
              campaignId: { in: campaignIds },
              createdAt: { gte: hourAgo },
            },
          }),
          prisma.campaignVisit.count({
            where: { campaignId: { in: campaignIds } },
          }),
        ]);

  const totalRedemptions = campaigns.reduce((s, c) => s + c.prizeClaimed, 0);
  const totalSparkCost = campaigns.reduce(
    (s, c) => s + c.prizeClaimed * c.costPerRedemption,
    0
  );
  const costPerRedemption =
    totalRedemptions > 0 ? Math.round(totalSparkCost / totalRedemptions) : 0;

  const healthPercent = flagship
    ? Math.min(
        100,
        Math.round(
          (flagship.prizeClaimed / Math.max(flagship.prizeQuantity, 1)) * 100
        )
      )
    : 0;

  return {
    flagship: flagship
      ? {
          id: flagship.id,
          title: flagship.title,
          status: flagship.status,
          prizeClaimed: flagship.prizeClaimed,
          prizeQuantity: flagship.prizeQuantity,
          costPerRedemption: flagship.costPerRedemption,
        }
      : null,
    participants,
    redemptionsToday,
    lastHourDelta,
    healthPercent,
    totalSparkCost,
    totalReach,
    totalRedemptions,
    costPerRedemption,
  };
}

export type SponsorActivityItem = {
  id: string;
  message: string;
  createdAt: Date;
  kind: "redemption" | "visit" | "share" | "default";
};

export async function getSponsorActivityFeed(
  sponsorId: string,
  limit = 20
): Promise<SponsorActivityItem[]> {
  const campaigns = await prisma.campaign.findMany({
    where: { sponsorId, ...notDeleted },
    select: { id: true },
  });
  const campaignIds = campaigns.map((c) => c.id);
  if (campaignIds.length === 0) return [];

  const [redemptions, visits] = await Promise.all([
    prisma.redemption.findMany({
      where: { campaignId: { in: campaignIds } },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        fullName: true,
        city: true,
        createdAt: true,
      },
    }),
    prisma.campaignVisit.findMany({
      where: { campaignId: { in: campaignIds } },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        referrer: true,
        createdAt: true,
      },
    }),
  ]);

  const items: SponsorActivityItem[] = [
    ...redemptions.map((r) => ({
      id: `r-${r.id}`,
      message: `${r.fullName}${r.city ? ` — ${r.city}` : ""} استرد جائزة`,
      createdAt: r.createdAt,
      kind: "redemption" as const,
    })),
    ...visits.map((v) => {
      let source = "رابط مباشر";
      if (v.referrer) {
        try {
          source =
            v.referrer.includes("instagram") || v.referrer.includes("insta")
              ? "إنستغرام"
              : v.referrer.includes("facebook")
                ? "فيسبوك"
                : "رابط خارجي";
        } catch {
          source = "رابط خارجي";
        }
      }
      return {
        id: `v-${v.id}`,
        message: `زائر فتح الرابط من ${source}`,
        createdAt: v.createdAt,
        kind: "visit" as const,
      };
    }),
  ];

  return items
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}
