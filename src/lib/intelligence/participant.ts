import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPhone } from "@/lib/session";

const MAX_SESSION_IDS = 10;

export async function upsertParticipant(
  phone: string,
  ipHash: string | null,
  sessionId: string,
  tx?: Prisma.TransactionClient
) {
  const db = tx ?? prisma;
  const phoneHash = hashPhone(phone);

  const existing = await db.participant.findUnique({ where: { phoneHash } });

  if (existing) {
    const sessionIds = Array.from(
      new Set([sessionId, ...existing.sessionIds])
    ).slice(0, MAX_SESSION_IDS);
    return db.participant.update({
      where: { id: existing.id },
      data: {
        ipHash: ipHash ?? existing.ipHash,
        sessionIds,
        lastSeenAt: new Date(),
      },
    });
  }

  return db.participant.create({
    data: {
      phoneHash,
      ipHash,
      sessionIds: [sessionId],
      tags: [],
    },
  });
}

export async function tagParticipantAfterRedemption(
  participantId: string,
  campaignId: string,
  sessionId: string
) {
  const [participant, redemptionCount, pageView, completed, campaign, avgCost] =
    await Promise.all([
      prisma.participant.findUnique({ where: { id: participantId } }),
      prisma.redemption.count({ where: { participantId } }),
      prisma.campaignEvent.findFirst({
        where: { campaignId, sessionId, type: "PAGE_VIEW" },
        orderBy: { createdAt: "asc" },
      }),
      prisma.campaignEvent.findFirst({
        where: { campaignId, sessionId, type: "REDEMPTION_COMPLETED" },
        orderBy: { createdAt: "desc" },
      }),
      prisma.campaign.findUnique({
        where: { id: campaignId },
        select: { costPerRedemption: true },
      }),
      prisma.campaign.aggregate({ _avg: { costPerRedemption: true } }),
    ]);

  if (!participant) return;

  const tags = new Set(participant.tags);

  if (
    pageView &&
    completed &&
    completed.createdAt.getTime() - pageView.createdAt.getTime() < 2 * 60 * 1000
  ) {
    tags.add("fast_redeemer");
  }

  if (redemptionCount >= 3) {
    tags.add("deal_hunter");
  }

  const platformAvg = avgCost._avg.costPerRedemption ?? 0;
  if (campaign && campaign.costPerRedemption > platformAvg) {
    tags.add("luxury_seeker");
  }

  await prisma.participant.update({
    where: { id: participantId },
    data: { tags: Array.from(tags) },
  });
}
