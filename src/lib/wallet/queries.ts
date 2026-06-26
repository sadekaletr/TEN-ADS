import { prisma } from "@/lib/prisma";
import { getSparkUnit } from "@/lib/spark";

export async function getWalletSummary(creatorId: string) {
  const [creator, transactions, topUpRequests, sparkUnit] = await Promise.all([
    prisma.creator.findUnique({
      where: { id: creatorId },
      select: { walletBalance: true },
    }),
    prisma.walletTransaction.findMany({
      where: { creatorId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.topUpRequest.findMany({
      where: { creatorId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    getSparkUnit(),
  ]);

  return {
    balance: creator?.walletBalance ?? 0,
    sparkUnit,
    transactions,
    topUpRequests,
  };
}
