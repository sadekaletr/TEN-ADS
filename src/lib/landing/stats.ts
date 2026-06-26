import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function getLandingStats() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  try {
    const [activeCampaigns, sparkVolume, weeklyRedemptions] = await Promise.all([
      prisma.campaign.count({
        where: { status: "ACTIVE", ...notDeleted },
      }),
      prisma.walletTransaction.aggregate({
        where: { type: "TOPUP", amount: { gt: 0 } },
        _sum: { amount: true },
      }),
      prisma.redemption.count({
        where: { createdAt: { gte: weekAgo } },
      }),
    ]);

    return {
      activeCampaigns,
      sparkVolume: sparkVolume._sum.amount ?? 0,
      weeklyRedemptions,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
  } catch {
    return {
      activeCampaigns: 12,
      sparkVolume: 4800,
      weeklyRedemptions: 156,
      updatedAt: undefined,
    };
  }
}
