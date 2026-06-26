"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { logAudit } from "@/lib/audit";
import { generateSparkCode, generateTrackingCode } from "@/lib/codes";
import { generateCampaignSlug } from "@/lib/campaign-slug";
import { notDeleted } from "@/lib/db";
import { applyStreakDiscount } from "@/lib/intelligence/streaks";
import { prisma } from "@/lib/prisma";
import { saveCampaignQrFiles } from "@/lib/qr";
import { getAgencySession } from "@/lib/session-auth";
import {
  allowsCollaborators,
  allowsUniqueCodes,
  EMPIRE_BOOST_DAYS,
  tierCostPerRedemption,
} from "@/lib/campaign-tiers";
import { isValidTopUpAmount } from "@/lib/wallet/top-up-packages";
import { allocateSparkFromTreasury } from "@/lib/spark-treasury";
import { getPlatformSettings } from "@/lib/platform-settings";
import type { CampaignTier } from "@prisma/client";

async function requireAgency() {
  const session = await getAgencySession();
  if (!session) throw new Error("Unauthorized");
  const agency = await prisma.agency.findUnique({
    where: { id: session.user.id },
  });
  if (!agency) throw new Error("Unauthorized");
  return { session, agency };
}

async function requireActiveMember(agencyId: string, memberId: string) {
  const member = await prisma.agencyMember.findFirst({
    where: { id: memberId, agencyId, isActive: true },
    include: { creator: true },
  });
  if (!member) throw new Error("MEMBER_NOT_FOUND");
  return member;
}

function normalizeHandle(handle: string) {
  const trimmed = handle.trim();
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

export async function addMember(handle: string) {
  const { session, agency } = await requireAgency();
  const normalized = normalizeHandle(handle);

  const creator = await prisma.creator.findFirst({
    where: { handle: normalized, ...notDeleted },
  });
  if (!creator) throw new Error("CREATOR_NOT_FOUND");

  const existing = await prisma.agencyMember.findUnique({
    where: { creatorId: creator.id },
  });
  if (existing) {
    if (existing.agencyId === agency.id) {
      if (!existing.isActive) {
        await prisma.agencyMember.update({
          where: { id: existing.id },
          data: { isActive: true },
        });
        revalidatePath("/agency/members");
        revalidatePath("/agency/dashboard");
        return;
      }
      throw new Error("ALREADY_MEMBER");
    }
    throw new Error("CREATOR_IN_OTHER_AGENCY");
  }

  await prisma.agencyMember.create({
    data: {
      agencyId: agency.id,
      creatorId: creator.id,
    },
  });

  await logAudit({
    actorId: session.user.id,
    actorType: "agency",
    action: "agency.member_added",
    entityType: "AgencyMember",
    entityId: creator.id,
    metadata: { handle: normalized, agencyId: agency.id },
  });

  revalidatePath("/agency/members");
  revalidatePath("/agency/dashboard");
}

export async function removeMember(memberId: string) {
  const { session, agency } = await requireAgency();
  const member = await prisma.agencyMember.findFirst({
    where: { id: memberId, agencyId: agency.id },
  });
  if (!member) throw new Error("MEMBER_NOT_FOUND");

  await prisma.agencyMember.update({
    where: { id: memberId },
    data: { isActive: false },
  });

  await logAudit({
    actorId: session.user.id,
    actorType: "agency",
    action: "agency.member_removed",
    entityType: "AgencyMember",
    entityId: memberId,
    metadata: { creatorId: member.creatorId },
  });

  revalidatePath("/agency/members");
  revalidatePath("/agency/dashboard");
}

export async function updateMemberLimit(memberId: string, spendingLimit: number | null) {
  const { agency } = await requireAgency();
  const member = await prisma.agencyMember.findFirst({
    where: { id: memberId, agencyId: agency.id, isActive: true },
  });
  if (!member) throw new Error("MEMBER_NOT_FOUND");

  const limit =
    spendingLimit == null || spendingLimit <= 0 ? null : Math.floor(spendingLimit);

  await prisma.agencyMember.update({
    where: { id: memberId },
    data: { spendingLimit: limit },
  });

  revalidatePath("/agency/members");
  revalidatePath("/agency/dashboard");
}

const topUpSchema = z.object({
  amount: z.number().int().refine(isValidTopUpAmount, {
    message: "INVALID_TOPUP_AMOUNT",
  }),
  bankReference: z.string().min(3),
  proofImageUrl: z.string().optional(),
  transferMethod: z.string().optional(),
});

export async function requestAgencyTopUp(
  amount: number,
  bankReference: string,
  options?: { proofImageUrl?: string; transferMethod?: string }
) {
  const { session, agency } = await requireAgency();

  const parsed = topUpSchema.parse({
    amount,
    bankReference,
    proofImageUrl: options?.proofImageUrl,
    transferMethod: options?.transferMethod,
  });

  const { getTransferSettings } = await import("@/lib/platform-settings");
  const settings = await getTransferSettings();

  const request = await prisma.agencyTopUpRequest.create({
    data: {
      agencyId: agency.id,
      amount: parsed.amount,
      bankReference: parsed.bankReference,
      proofImageUrl: parsed.proofImageUrl,
      transferMethod: parsed.transferMethod ?? settings.transferMethod,
    },
  });

  await logAudit({
    actorId: session.user.id,
    actorType: "agency",
    action: "agency.topup_requested",
    entityType: "AgencyTopUpRequest",
    entityId: request.id,
    after: { amount: parsed.amount, bankReference: parsed.bankReference },
  });

  revalidatePath("/agency/wallet");
  return request;
}

const campaignSchema = z.object({
  sponsorId: z.string().optional(),
  newSponsor: z
    .object({
      name: z.string().min(2),
      city: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
  title: z.string().min(3),
  description: z.string().optional(),
  prizeName: z.string().min(2),
  prizeQuantity: z.number().int().positive(),
  codeMode: z.enum(["SHARED", "UNIQUE"]),
  tier: z.enum(["BASIC", "PRO", "EMPIRE"]).default("PRO"),
  costPerRedemption: z.number().int().positive().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  city: z.string().optional(),
  requirePhone: z.boolean(),
  requireAddress: z.boolean(),
  antiAbuse: z.boolean(),
  revealStyle: z
    .enum(["CLASSIC_GOLD", "SCRATCH_CARD", "SPIN_WHEEL"])
    .default("CLASSIC_GOLD"),
  collaborators: z
    .array(
      z.object({
        creatorId: z.string(),
        sharePercentage: z.number().min(0).max(100),
      })
    )
    .optional(),
});

async function resolveSponsorId(parsed: z.infer<typeof campaignSchema>) {
  let sponsorId = parsed.sponsorId;
  if (!sponsorId && parsed.newSponsor) {
    const sponsor = await prisma.sponsor.create({ data: parsed.newSponsor });
    sponsorId = sponsor.id;
  }
  if (!sponsorId) throw new Error("SPONSOR_REQUIRED");
  return sponsorId;
}

function validateTierRules(
  tier: CampaignTier,
  codeMode: "SHARED" | "UNIQUE",
  collaborators: { creatorId: string; sharePercentage: number }[]
) {
  if (!allowsUniqueCodes(tier) && codeMode === "UNIQUE") {
    throw new Error("TIER_CODE_MODE");
  }
  if (!allowsCollaborators(tier) && collaborators.length > 0) {
    throw new Error("TIER_COLLABORATORS");
  }
}

export async function createCampaignForMember(
  memberId: string,
  data: z.infer<typeof campaignSchema>
) {
  const { session, agency } = await requireAgency();
  const member = await requireActiveMember(agency.id, memberId);
  const creatorId = member.creatorId;

  const parsed = campaignSchema.parse(data);
  const sponsorId = await resolveSponsorId(parsed);
  const tier = parsed.tier;
  const codeMode = tier === "BASIC" ? "SHARED" : parsed.codeMode;
  const collabs = parsed.collaborators ?? [];
  validateTierRules(tier, codeMode, collabs);

  const baseCost = tierCostPerRedemption(tier);
  const collabTotal = collabs.reduce((s, c) => s + c.sharePercentage, 0);
  if (collabTotal > 100) throw new Error("INVALID_COLLAB_SHARES");

  const sponsor = await prisma.sponsor.findUnique({
    where: { id: sponsorId },
    select: { currentStreak: true },
  });
  const effectiveCost = sponsor
    ? applyStreakDiscount(baseCost, sponsor.currentStreak)
    : baseCost;
  const totalCost = effectiveCost * parsed.prizeQuantity;

  const platform = await getPlatformSettings();
  if (
    platform.maxPrizeQuantity != null &&
    parsed.prizeQuantity > platform.maxPrizeQuantity
  ) {
    throw new Error("MAX_PRIZE_QUANTITY");
  }

  if (
    member.spendingLimit != null &&
    member.spentThisMonth + totalCost > member.spendingLimit
  ) {
    throw new Error("INSUFFICIENT_BALANCE");
  }
  if (agency.walletBalance < totalCost) {
    throw new Error("INSUFFICIENT_BALANCE");
  }

  const codes =
    codeMode === "SHARED"
      ? [generateSparkCode()]
      : Array.from({ length: parsed.prizeQuantity }, () => generateSparkCode());

  const empireBoostUntil =
    tier === "EMPIRE"
      ? new Date(Date.now() + EMPIRE_BOOST_DAYS * 24 * 60 * 60 * 1000)
      : null;

  const slug = await generateCampaignSlug(parsed.title);

  const campaign = await prisma.$transaction(async (tx) => {
    await allocateSparkFromTreasury(tx, totalCost, "campaign.created", {
      actorId: agency.id,
      actorType: "agency",
      metadata: {
        title: parsed.title,
        prizeQuantity: parsed.prizeQuantity,
        creatorId,
        delegatedBy: session.user.id,
      },
    });

    await tx.agency.update({
      where: { id: agency.id },
      data: { walletBalance: { decrement: totalCost } },
    });
    await tx.agencyMember.update({
      where: { id: member.id },
      data: { spentThisMonth: { increment: totalCost } },
    });
    await tx.agencyWalletTransaction.create({
      data: {
        agencyId: agency.id,
        type: "CAMPAIGN_SPEND",
        amount: -totalCost,
        note: `إطلاق حملة لـ ${member.creator.handle}: ${parsed.title}`,
      },
    });

    const created = await tx.campaign.create({
      data: {
        creatorId,
        sponsorId,
        title: parsed.title,
        description: parsed.description,
        prizeName: parsed.prizeName,
        prizeQuantity: parsed.prizeQuantity,
        codeMode,
        tier,
        tierBoostUntil: empireBoostUntil,
        costPerRedemption: effectiveCost,
        status: "ACTIVE",
        startsAt: parsed.startsAt ? new Date(parsed.startsAt) : undefined,
        endsAt: parsed.endsAt ? new Date(parsed.endsAt) : undefined,
        city: parsed.city,
        requirePhone: parsed.requirePhone,
        requireAddress: parsed.requireAddress,
        antiAbuse: parsed.antiAbuse,
        revealStyle: parsed.revealStyle,
        slug,
        codes: {
          create: codes.map((code) => ({ code })),
        },
        collaborators: {
          create: collabs.map((c) => ({
            creatorId: c.creatorId,
            sharePercentage: c.sharePercentage,
            trackingCode: generateTrackingCode(),
          })),
        },
      },
      include: { codes: true, sponsor: true },
    });

    if (tier === "EMPIRE" && empireBoostUntil) {
      await tx.creator.update({
        where: { id: creatorId },
        data: { marketplaceBoostUntil: empireBoostUntil },
      });
    }

    await logAudit({
      actorId: session.user.id,
      actorType: "agency",
      action: "campaign.created_delegate",
      entityType: "Campaign",
      entityId: created.id,
      after: { title: created.title, prizeQuantity: created.prizeQuantity },
      metadata: { creatorId, totalCost, memberId },
      tx,
    });

    return created;
  });

  for (const codeRecord of campaign.codes) {
    const qrUrl = await saveCampaignQrFiles(campaign.id, codeRecord.code);
    await prisma.campaignCode.update({
      where: { id: codeRecord.id },
      data: { qrUrl },
    });
  }

  revalidatePath("/agency/campaigns");
  revalidatePath("/agency/wallet");
  revalidatePath("/agency/dashboard");
  return campaign;
}

const settingsSchema = z.object({
  name: z.string().min(2),
  password: z.string().min(6).optional(),
});

export async function updateAgencySettings(data: z.infer<typeof settingsSchema>) {
  const { session, agency } = await requireAgency();
  const parsed = settingsSchema.parse(data);

  const update: { name: string; password?: string } = { name: parsed.name.trim() };
  if (parsed.password) {
    update.password = await bcrypt.hash(parsed.password, 10);
  }

  await prisma.agency.update({
    where: { id: agency.id },
    data: update,
  });

  await logAudit({
    actorId: session.user.id,
    actorType: "agency",
    action: "agency.settings_updated",
    entityType: "Agency",
    entityId: agency.id,
    after: { name: update.name },
  });

  revalidatePath("/agency/settings");
  revalidatePath("/agency/dashboard");
}

export async function inviteCreatorByEmail(email: string, name: string, handle: string) {
  const { session, agency } = await requireAgency();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedHandle = normalizeHandle(handle);
  if (!normalizedEmail.includes("@") || name.trim().length < 2) {
    throw new Error("INVALID_INPUT");
  }

  const existing = await prisma.creator.findFirst({
    where: {
      OR: [{ email: normalizedEmail }, { handle: normalizedHandle }],
      ...notDeleted,
    },
  });
  if (existing) {
    await prisma.agencyMember.upsert({
      where: { creatorId: existing.id },
      create: {
        agencyId: agency.id,
        creatorId: existing.id,
        isActive: true,
      },
      update: { agencyId: agency.id, isActive: true },
    });
    revalidatePath("/agency/members");
    return { ok: true, creatorId: existing.id, existing: true };
  }

  const tempPassword = crypto.randomBytes(12).toString("hex");
  const hash = await bcrypt.hash(tempPassword, 10);
  const creator = await prisma.creator.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      handle: normalizedHandle,
      phone: `+pending-${Date.now()}`,
      password: hash,
    },
  });

  await prisma.agencyMember.create({
    data: { agencyId: agency.id, creatorId: creator.id },
  });

  const { requestPasswordReset } = await import("@/lib/password-reset");
  await requestPasswordReset(normalizedEmail, "creator");

  await logAudit({
    actorId: session.user.id,
    actorType: "agency",
    action: "agency.creator_invited",
    entityType: "Creator",
    entityId: creator.id,
    metadata: { email: normalizedEmail },
  });

  revalidatePath("/agency/members");
  return { ok: true, creatorId: creator.id, existing: false };
}
