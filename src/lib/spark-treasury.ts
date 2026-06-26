import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class InsufficientSparkTreasuryError extends Error {
  constructor(available: number, requested: number) {
    super(`INSUFFICIENT_TREASURY:${available}:${requested}`);
    this.name = "InsufficientSparkTreasuryError";
  }
}

export type SparkTreasurySnapshot = {
  treasuryBalance: number;
  distributedBalance: number;
  agencyBalance: number;
  totalBudget: number;
};

export type TreasuryLedgerEntry = {
  id: string;
  amount: number;
  reason: string;
  actorId: string | null;
  actorType: string | null;
  createdAt: Date;
};

export async function getSparkTreasurySnapshot(): Promise<SparkTreasurySnapshot> {
  const [settings, distributed, agency] = await Promise.all([
    prisma.platformSettings.findUnique({ where: { id: "default" } }),
    prisma.creator.aggregate({
      where: { deletedAt: null },
      _sum: { walletBalance: true },
    }),
    prisma.agency.aggregate({
      _sum: { walletBalance: true },
    }),
  ]);

  const treasuryBalance = settings?.sparkTreasuryBalance ?? 0;
  const distributedBalance = distributed._sum.walletBalance ?? 0;
  const agencyBalance = agency._sum.walletBalance ?? 0;

  return {
    treasuryBalance,
    distributedBalance,
    agencyBalance,
    totalBudget: treasuryBalance + distributedBalance + agencyBalance,
  };
}

export async function getTreasuryLedger(limit = 50): Promise<TreasuryLedgerEntry[]> {
  return prisma.treasuryLedger.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      amount: true,
      reason: true,
      actorId: true,
      actorType: true,
      createdAt: true,
    },
  });
}

type TreasuryTx = Prisma.TransactionClient;

type LedgerMeta = {
  actorId?: string;
  actorType?: string;
  metadata?: Prisma.InputJsonValue;
};

async function recordLedger(
  tx: TreasuryTx,
  amount: number,
  reason: string,
  meta?: LedgerMeta
) {
  await tx.treasuryLedger.create({
    data: {
      amount,
      reason,
      actorId: meta?.actorId ?? null,
      actorType: meta?.actorType ?? null,
      metadata: meta?.metadata,
    },
  });
}

async function ensureSettingsRow(tx: TreasuryTx) {
  return tx.platformSettings.upsert({
    where: { id: "default" },
    create: { id: "default", sparkTreasuryBalance: 0 },
    update: {},
  });
}

export async function allocateSparkFromTreasury(
  tx: TreasuryTx,
  amount: number,
  reason = "allocate",
  meta?: LedgerMeta
) {
  if (amount <= 0) return;

  const settings = await ensureSettingsRow(tx);
  if (settings.sparkTreasuryBalance < amount) {
    throw new InsufficientSparkTreasuryError(settings.sparkTreasuryBalance, amount);
  }

  await tx.platformSettings.update({
    where: { id: "default" },
    data: { sparkTreasuryBalance: { decrement: amount } },
  });

  await recordLedger(tx, -amount, reason, meta);
}

export async function returnSparkToTreasury(
  tx: TreasuryTx,
  amount: number,
  reason = "return",
  meta?: LedgerMeta
) {
  if (amount <= 0) return;

  await ensureSettingsRow(tx);
  await tx.platformSettings.update({
    where: { id: "default" },
    data: { sparkTreasuryBalance: { increment: amount } },
  });

  await recordLedger(tx, amount, reason, meta);
}

export async function adjustTreasuryBalance(
  tx: TreasuryTx,
  newBalance: number,
  reason: string,
  meta?: LedgerMeta
) {
  const settings = await ensureSettingsRow(tx);
  const delta = newBalance - settings.sparkTreasuryBalance;
  if (delta === 0) return;

  await tx.platformSettings.update({
    where: { id: "default" },
    data: { sparkTreasuryBalance: newBalance },
  });

  await recordLedger(tx, delta, reason, meta);
}
