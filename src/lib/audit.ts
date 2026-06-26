import type { Prisma } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export type ActorType = "creator" | "admin" | "sponsor" | "agency" | "system";

export interface AuditParams {
  actorId?: string;
  actorType: ActorType;
  action: string;
  entityType: string;
  entityId?: string;
  before?: unknown;
  after?: unknown;
  metadata?: unknown;
  tx?: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >;
}

function toJson(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined) return undefined;
  return value as Prisma.InputJsonValue;
}

export async function logAudit(params: AuditParams) {
  const client = params.tx ?? prisma;
  await client.auditLog.create({
    data: {
      actorId: params.actorId,
      actorType: params.actorType,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      before: toJson(params.before),
      after: toJson(params.after),
      metadata: toJson(params.metadata),
    },
  });
}

export async function getCreatorActivity(creatorId: string, limit = 20) {
  const campaigns = await prisma.campaign.findMany({
    where: { creatorId, ...notDeleted },
    select: { id: true },
  });
  const campaignIds = campaigns.map((c) => c.id);

  return prisma.auditLog.findMany({
    where: {
      OR: [
        { actorId: creatorId },
        ...(campaignIds.length > 0
          ? [{ entityType: "Campaign", entityId: { in: campaignIds } }]
          : []),
        { metadata: { path: ["creatorId"], equals: creatorId } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getPlatformActivity(limit = 20) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
