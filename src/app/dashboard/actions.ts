"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { logAudit } from "@/lib/audit";
import { generateSparkCode, generateTrackingCode } from "@/lib/codes";
import { generateCampaignSlug } from "@/lib/campaign-slug";
import { notDeleted } from "@/lib/db";
import { applyStreakDiscount } from "@/lib/intelligence/streaks";
import { triggerTrustRecalcForCampaign } from "@/lib/intelligence/trust-score";
import { prisma } from "@/lib/prisma";
import { saveCampaignQrFiles } from "@/lib/qr";
import { getCreatorSession } from "@/lib/session-auth";
import {
  allowsCollaborators,
  allowsUniqueCodes,
  EMPIRE_BOOST_DAYS,
  tierCostPerRedemption,
} from "@/lib/campaign-tiers";
import { isValidTopUpAmount } from "@/lib/wallet/top-up-packages";
import {
  allocateSparkFromTreasury,
  returnSparkToTreasury,
} from "@/lib/spark-treasury";
import { getPlatformSettings } from "@/lib/platform-settings";
import type { CampaignStatus, CampaignTier } from "@prisma/client";

const topUpSchema = z.object({
  amount: z.number().int().refine(isValidTopUpAmount, {
    message: "INVALID_TOPUP_AMOUNT",
  }),
  bankReference: z.string().min(3),
  proofImageUrl: z.string().optional(),
  transferMethod: z.string().optional(),
});

export async function uploadTopUpProof(
  formData: FormData
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const session = await getCreatorSession();
  if (!session) return { ok: false, error: "غير مصرح" };

  const file = formData.get("photo");
  if (!file || !(file instanceof Blob)) {
    return { ok: false, error: "لم يتم اختيار صورة" };
  }

  const requestId = String(formData.get("requestId") ?? "");
  if (!requestId) return { ok: false, error: "معرّف الطلب مطلوب" };

  const existing = await prisma.topUpRequest.findFirst({
    where: { id: requestId, creatorId: session.user.id, status: "PENDING" },
  });
  if (!existing) return { ok: false, error: "الطلب غير موجود" };

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file instanceof File ? file.name : "photo.jpg";
  const ext = name.split(".").pop() ?? "jpg";

  let url: string;
  try {
    const { saveTopUpProof } = await import("@/lib/topup-proof-storage");
    url = await saveTopUpProof(requestId, buffer, ext);
  } catch (err) {
    await logAudit({
      actorId: session.user.id,
      actorType: "creator",
      action: "wallet.topup_proof_failed",
      entityType: "TopUpRequest",
      entityId: requestId,
      metadata: { error: err instanceof Error ? err.message : "unknown" },
    });
    return { ok: false, error: "لم نتمكن من رفع الصورة — تحقق من الملف وحاول مرة أخرى" };
  }

  await prisma.topUpRequest.update({
    where: { id: requestId },
    data: { proofImageUrl: url },
  });

  revalidatePath("/dashboard/wallet");
  return { ok: true, url };
}

export async function requestTopUp(
  amount: number,
  bankReference: string,
  options?: { proofImageUrl?: string; transferMethod?: string }
) {
  const session = await getCreatorSession();
  if (!session) throw new Error("Unauthorized");

  const parsed = topUpSchema.parse({
    amount,
    bankReference,
    proofImageUrl: options?.proofImageUrl,
    transferMethod: options?.transferMethod,
  });

  const { getTransferSettings } = await import("@/lib/platform-settings");
  const settings = await getTransferSettings();

  const request = await prisma.topUpRequest.create({
    data: {
      creatorId: session.user.id,
      amount: parsed.amount,
      bankReference: parsed.bankReference,
      proofImageUrl: parsed.proofImageUrl,
      transferMethod: parsed.transferMethod ?? settings.transferMethod,
    },
  });

  await logAudit({
    actorId: session.user.id,
    actorType: "creator",
    action: "wallet.topup_requested",
    entityType: "TopUpRequest",
    entityId: request.id,
    after: {
      amount: parsed.amount,
      bankReference: parsed.bankReference,
      proofImageUrl: parsed.proofImageUrl,
    },
    metadata: { amount: parsed.amount },
  });

  const opsEmail = process.env.OPS_ALERT_EMAIL ?? process.env.TOPUP_NOTIFY_EMAIL;
  if (opsEmail) {
    const creator = await prisma.creator.findUnique({
      where: { id: session.user.id },
      select: { handle: true },
    });
    const { emailAdminTopUpPending } = await import("@/lib/email");
    await emailAdminTopUpPending({
      to: opsEmail,
      creatorHandle: creator?.handle ?? session.user.id,
      amount: parsed.amount,
      requestId: request.id,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/wallet");
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

const draftCampaignSchema = campaignSchema;

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

export async function saveCampaignDraft(data: z.infer<typeof draftCampaignSchema>) {
  const session = await getCreatorSession();
  if (!session) throw new Error("Unauthorized");

  const parsed = draftCampaignSchema.parse(data);
  const sponsorId = await resolveSponsorId(parsed);
  const tier = parsed.tier;
  const codeMode = tier === "BASIC" ? "SHARED" : parsed.codeMode;
  const collabs = parsed.collaborators ?? [];
  validateTierRules(tier, codeMode, collabs);

  const costPerRedemption = tierCostPerRedemption(tier);

  await prisma.campaign.deleteMany({
    where: { creatorId: session.user.id, status: "DRAFT", ...notDeleted },
  });

  const draft = await prisma.campaign.create({
    data: {
      creatorId: session.user.id,
      sponsorId,
      title: parsed.title,
      description: parsed.description,
      prizeName: parsed.prizeName,
      prizeQuantity: parsed.prizeQuantity,
      codeMode,
      tier,
      costPerRedemption,
      status: "DRAFT",
      city: parsed.city,
      requirePhone: parsed.requirePhone,
      requireAddress: parsed.requireAddress,
      antiAbuse: parsed.antiAbuse,
      revealStyle: parsed.revealStyle,
      collaborators: {
        create: collabs.map((c) => ({
          creatorId: c.creatorId,
          sharePercentage: c.sharePercentage,
          trackingCode: generateTrackingCode(),
        })),
      },
    },
  });

  revalidatePath("/dashboard/wallet/topup");
  return draft;
}

export async function createCampaign(data: z.infer<typeof campaignSchema>) {
  const session = await getCreatorSession();
  if (!session) throw new Error("Unauthorized");

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

  const agencyMember = await prisma.agencyMember.findUnique({
    where: { creatorId: session.user.id },
    include: { agency: true },
  });

  if (agencyMember) {
    if (
      agencyMember.spendingLimit != null &&
      agencyMember.spentThisMonth + totalCost > agencyMember.spendingLimit
    ) {
      throw new Error("INSUFFICIENT_BALANCE");
    }
    if (agencyMember.agency.walletBalance < totalCost) {
      throw new Error("INSUFFICIENT_BALANCE");
    }
  } else {
    const creator = await prisma.creator.findFirst({
      where: { id: session.user.id, ...notDeleted },
    });
    if (!creator || creator.walletBalance < totalCost) {
      throw new Error("INSUFFICIENT_BALANCE");
    }
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
      actorId: agencyMember?.agencyId ?? session.user.id,
      actorType: agencyMember ? "agency" : "creator",
      metadata: { title: parsed.title, prizeQuantity: parsed.prizeQuantity },
    });

    if (agencyMember) {
      await tx.agency.update({
        where: { id: agencyMember.agencyId },
        data: { walletBalance: { decrement: totalCost } },
      });
      await tx.agencyMember.update({
        where: { id: agencyMember.id },
        data: { spentThisMonth: { increment: totalCost } },
      });
      await tx.agencyWalletTransaction.create({
        data: {
          agencyId: agencyMember.agencyId,
          type: "CAMPAIGN_SPEND",
          amount: -totalCost,
          note: `إطلاق حملة: ${parsed.title}`,
        },
      });
    } else {
      await tx.creator.update({
        where: { id: session.user.id },
        data: { walletBalance: { decrement: totalCost } },
      });

      await tx.walletTransaction.create({
        data: {
          creatorId: session.user.id,
          type: "CAMPAIGN_SPEND",
          amount: -totalCost,
          note: `إطلاق حملة: ${parsed.title}`,
        },
      });
    }

    const created = await tx.campaign.create({
      data: {
        creatorId: session.user.id,
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
        where: { id: session.user.id },
        data: { marketplaceBoostUntil: empireBoostUntil },
      });
    }

    await tx.campaign.deleteMany({
      where: { creatorId: session.user.id, status: "DRAFT" },
    });

    await logAudit({
      actorId: session.user.id,
      actorType: "creator",
      action: "campaign.created",
      entityType: "Campaign",
      entityId: created.id,
      after: { title: created.title, prizeQuantity: created.prizeQuantity },
      metadata: { title: created.title, totalCost },
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

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/campaigns");
  return { ...campaign, codes: campaign.codes };
}

export async function archiveCampaign(campaignId: string) {
  const session = await getCreatorSession();
  if (!session) throw new Error("Unauthorized");

  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, creatorId: session.user.id, ...notDeleted },
  });
  if (!campaign) throw new Error("NOT_FOUND");

  await prisma.$transaction(async (tx) => {
    const unclaimed = campaign.prizeQuantity - campaign.prizeClaimed;
    const refund = unclaimed * campaign.costPerRedemption;

    if (refund > 0) {
      const agencyMember = await tx.agencyMember.findUnique({
        where: { creatorId: session.user.id },
      });

      if (agencyMember) {
        await tx.agency.update({
          where: { id: agencyMember.agencyId },
          data: { walletBalance: { increment: refund } },
        });
        await tx.agencyWalletTransaction.create({
          data: {
            agencyId: agencyMember.agencyId,
            type: "CAMPAIGN_REFUND",
            amount: refund,
            note: `أرشفة حملة: ${campaign.title}`,
          },
        });
      } else {
        await tx.creator.update({
          where: { id: session.user.id },
          data: { walletBalance: { increment: refund } },
        });
        await tx.walletTransaction.create({
          data: {
            creatorId: session.user.id,
            type: "REFUND",
            amount: refund,
            note: `أرشفة حملة: ${campaign.title}`,
          },
        });
      }

      await returnSparkToTreasury(tx, refund, "campaign.archived_refund", {
        actorId: session.user.id,
        actorType: "creator",
        metadata: { campaignId, unclaimed },
      });
    }

    await tx.campaign.update({
      where: { id: campaignId },
      data: { deletedAt: new Date(), status: "ENDED" },
    });

    await logAudit({
      actorId: session.user.id,
      actorType: "creator",
      action: "campaign.archived",
      entityType: "Campaign",
      entityId: campaignId,
      before: { status: campaign.status },
      after: { status: "ENDED", deletedAt: new Date().toISOString() },
      metadata: { title: campaign.title },
      tx,
    });
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/campaigns");
  await triggerTrustRecalcForCampaign(campaignId);
}

export async function updateCampaignStatus(
  campaignId: string,
  status: "ACTIVE" | "PAUSED" | "ENDED",
  prizeQuantity?: number
) {
  const session = await getCreatorSession();
  if (!session) throw new Error("Unauthorized");

  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, creatorId: session.user.id, ...notDeleted },
  });
  if (!campaign) throw new Error("NOT_FOUND");

  const data: { status: typeof status; prizeQuantity?: number } = { status };

  let extraCost = 0;
  if (prizeQuantity != null && prizeQuantity >= campaign.prizeClaimed) {
    if (prizeQuantity > campaign.prizeQuantity) {
      const platform = await getPlatformSettings();
      if (
        platform.maxPrizeQuantity != null &&
        prizeQuantity > platform.maxPrizeQuantity
      ) {
        throw new Error("MAX_PRIZE_QUANTITY");
      }
      extraCost = (prizeQuantity - campaign.prizeQuantity) * campaign.costPerRedemption;
    }
    data.prizeQuantity = prizeQuantity;
  }

  if (extraCost > 0) {
    const agencyMember = await prisma.agencyMember.findUnique({
      where: { creatorId: session.user.id },
      include: { agency: true },
    });

    if (agencyMember) {
      if (agencyMember.agency.walletBalance < extraCost) {
        throw new Error("INSUFFICIENT_BALANCE");
      }
    } else {
      const creator = await prisma.creator.findFirst({
        where: { id: session.user.id, ...notDeleted },
      });
      if (!creator || creator.walletBalance < extraCost) {
        throw new Error("INSUFFICIENT_BALANCE");
      }
    }

    await prisma.$transaction(async (tx) => {
      await allocateSparkFromTreasury(tx, extraCost, "campaign.prize_increase", {
        actorId: session.user.id,
        actorType: "creator",
        metadata: { campaignId, extraPrizes: prizeQuantity! - campaign.prizeQuantity },
      });

      if (agencyMember) {
        await tx.agency.update({
          where: { id: agencyMember.agencyId },
          data: { walletBalance: { decrement: extraCost } },
        });
        await tx.agencyWalletTransaction.create({
          data: {
            agencyId: agencyMember.agencyId,
            type: "PRIZE_INCREASE",
            amount: -extraCost,
            note: `زيادة جوائز: ${campaign.title}`,
          },
        });
      } else {
        await tx.creator.update({
          where: { id: session.user.id },
          data: { walletBalance: { decrement: extraCost } },
        });
        await tx.walletTransaction.create({
          data: {
            creatorId: session.user.id,
            type: "CAMPAIGN_SPEND",
            amount: -extraCost,
            note: `زيادة جوائز: ${campaign.title}`,
          },
        });
      }

      await tx.campaign.update({
        where: { id: campaignId },
        data,
      });
    });
  } else {
    await prisma.campaign.update({
      where: { id: campaignId },
      data,
    });
  }

  revalidatePath(`/dashboard/campaigns/${campaignId}`);
  revalidatePath(`/dashboard/campaigns/${campaignId}/settings`);
}

export async function getSponsors() {
  const session = await getCreatorSession();
  if (!session) throw new Error("Unauthorized");

  return prisma.sponsor.findMany({
    where: notDeleted,
    orderBy: { name: "asc" },
  });
}

export async function searchCreatorsByHandle(query: string) {
  const session = await getCreatorSession();
  if (!session) throw new Error("Unauthorized");
  if (!query.trim()) return [];

  return prisma.creator.findMany({
    where: {
      handle: { contains: query.replace(/^@/, ""), mode: "insensitive" },
      id: { not: session.user.id },
      ...notDeleted,
    },
    select: { id: true, name: true, handle: true },
    take: 8,
  });
}

export async function updateCampaignMedia(
  campaignId: string,
  data: {
    prizeImageUrl?: string | null;
    promoVideoUrl?: string | null;
    heroTemplate?: string | null;
  }
) {
  const session = await getCreatorSession();
  if (!session) throw new Error("Unauthorized");

  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, creatorId: session.user.id, ...notDeleted },
  });
  if (!campaign) throw new Error("NOT_FOUND");

  await prisma.campaign.update({
    where: { id: campaignId },
    data: {
      prizeImageUrl: data.prizeImageUrl ?? undefined,
      promoVideoUrl: data.promoVideoUrl ?? undefined,
      heroTemplate: data.heroTemplate ?? undefined,
    },
  });

  revalidatePath(`/dashboard/campaigns/${campaignId}/assets`);
  revalidatePath(`/campaign/${campaign.slug ?? campaignId}`);
}
