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
