import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPhone } from "@/lib/session";

interface FraudCheckInput {
  campaignId: string;
  phone: string;
  ipHash: string | null;
  sessionId: string;
  participantId: string;
}

async function writeSignal(
  data: {
    entityType: string;
    entityHash: string;
    campaignId: string;
    riskScore: number;
    reason: string;
    metadata?: Record<string, unknown>;
  },
  tx?: Prisma.TransactionClient
) {
  const db = tx ?? prisma;
  await db.fraudSignal.create({
    data: {
      entityType: data.entityType,
      entityHash: data.entityHash,
      campaignId: data.campaignId,
      riskScore: data.riskScore,
      reason: data.reason,
      metadata: (data.metadata ?? {}) as Prisma.InputJsonValue,
    },
  });
}

export async function analyzeFraudForRedemption(input: FraudCheckInput) {
  const phoneHash = hashPhone(input.phone);
  const signals: Array<{
    entityType: string;
    entityHash: string;
    riskScore: number;
    reason: string;
    metadata?: Record<string, unknown>;
  }> = [];

  if (input.ipHash) {
    const phonesOnIp = await prisma.redemption.findMany({
      where: { ipHash: input.ipHash, campaignId: input.campaignId },
      select: { phone: true },
      distinct: ["phone"],
    });
    if (phonesOnIp.length >= 3) {
      signals.push({
        entityType: "ip",
        entityHash: input.ipHash,
        riskScore: Math.min(0.95, 0.4 + phonesOnIp.length * 0.15),
        reason: "multiple_phones_same_ip",
        metadata: { phoneCount: phonesOnIp.length },
      });
    }
  }

  const ipsForPhone = await prisma.redemption.findMany({
    where: { phone: input.phone },
    select: { ipHash: true, campaignId: true },
    distinct: ["ipHash"],
  });
  if (ipsForPhone.filter((r) => r.ipHash).length >= 4) {
    signals.push({
      entityType: "phone",
      entityHash: phoneHash,
      riskScore: 0.7,
      reason: "multiple_ips_same_phone",
      metadata: { ipCount: ipsForPhone.length },
    });
  }

  const crossCampaign = await prisma.redemption.count({
    where: {
      participantId: input.participantId,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });
  if (crossCampaign >= 5) {
    signals.push({
      entityType: "session",
      entityHash: input.sessionId,
      riskScore: 0.85,
      reason: "rapid_cross_redemptions",
      metadata: { count24h: crossCampaign },
    });
  }

  for (const signal of signals) {
    await writeSignal({ ...signal, campaignId: input.campaignId });
  }

  return signals;
}

export async function getRecentFraudSignals(limit = 20) {
  return prisma.fraudSignal.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getCampaignFraudSignals(campaignId: string, limit = 50) {
  return prisma.fraudSignal.findMany({
    where: { campaignId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getFraudRateForCreator(creatorId: string) {
  const campaigns = await prisma.campaign.findMany({
    where: { creatorId },
    select: { id: true },
  });
  const campaignIds = campaigns.map((c) => c.id);
  if (campaignIds.length === 0) return 0;

  const [redemptions, signals] = await Promise.all([
    prisma.redemption.count({ where: { campaignId: { in: campaignIds } } }),
    prisma.fraudSignal.count({
      where: { campaignId: { in: campaignIds }, riskScore: { gte: 0.6 } },
    }),
  ]);

  if (redemptions === 0) return 0;
  return Math.min(1, signals / redemptions);
}

export async function getParticipantInsights() {
  const participants = await prisma.participant.findMany({
    where: { tags: { isEmpty: false } },
    select: { tags: true, phoneHash: true, lastSeenAt: true },
    take: 50,
    orderBy: { lastSeenAt: "desc" },
  });
  return participants.map((p) => ({
    phoneHash: p.phoneHash?.slice(0, 8) + "…",
    tags: p.tags,
    lastSeenAt: p.lastSeenAt,
  }));
}
