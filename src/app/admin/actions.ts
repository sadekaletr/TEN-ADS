"use server";

import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { notDeleted } from "@/lib/db";
import { createNotification } from "@/lib/notifications";
import { notificationCopy } from "@/lib/notifications/copy";
import { emailTopUpApproved } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { generatePartnerDiscountCode } from "@/lib/spark-pricing";
import {
  allocateSparkFromTreasury,
  adjustTreasuryBalance,
  getSparkTreasurySnapshot,
  returnSparkToTreasury,
} from "@/lib/spark-treasury";
import { getAdminSession } from "@/lib/session-auth";
import bcrypt from "bcryptjs";

export async function toggleVerified(creatorId: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const creator = await prisma.creator.findFirst({
    where: { id: creatorId, ...notDeleted },
  });
  if (!creator) return;

  await prisma.creator.update({
    where: { id: creatorId },
    data: { verified: !creator.verified },
  });

  await logAudit({
    actorId: session.user.id,
    actorType: "admin",
    action: "creator.verified_toggled",
    entityType: "Creator",
    entityId: creatorId,
    before: { verified: creator.verified },
    after: { verified: !creator.verified },
  });

  revalidatePath("/admin");
}

export async function toggleSponsorVerified(sponsorId: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const sponsor = await prisma.sponsor.findFirst({
    where: { id: sponsorId, ...notDeleted },
  });
  if (!sponsor) return;

  await prisma.sponsor.update({
    where: { id: sponsorId },
    data: { verified: !sponsor.verified },
  });

  await logAudit({
    actorId: session.user.id,
    actorType: "admin",
    action: "sponsor.verified_toggled",
    entityType: "Sponsor",
    entityId: sponsorId,
    before: { verified: sponsor.verified },
    after: { verified: !sponsor.verified },
  });

  revalidatePath("/admin");
}

export async function getAdminStats() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const [
    totalSpark,
    activeCampaigns,
    totalRedemptions,
    pendingTopUps,
    creators,
    sponsors,
  ] = await Promise.all([
    prisma.creator.aggregate({
      where: notDeleted,
      _sum: { walletBalance: true },
    }),
    prisma.campaign.count({
      where: { status: "ACTIVE", ...notDeleted },
    }),
    prisma.redemption.count(),
    prisma.topUpRequest.findMany({
      where: { status: "PENDING" },
      include: { creator: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.creator.findMany({
      where: notDeleted,
      orderBy: { walletBalance: "desc" },
      take: 10,
    }),
    prisma.sponsor.findMany({
      where: notDeleted,
      orderBy: { trustScore: "desc" },
      take: 10,
      select: { id: true, name: true, verified: true },
    }),
  ]);

  return {
    totalSpark: totalSpark._sum.walletBalance ?? 0,
    treasury: await getSparkTreasurySnapshot(),
    activeCampaigns,
    totalRedemptions,
    pendingTopUps,
    creators,
    sponsors,
  };
}

export async function updatePlatformSettings(data: {
  sparkUnit?: number | null;
  featuredCampaignId?: string | null;
  featuredCreatorId?: string | null;
  heroCampaignId?: string | null;
  maxPrizeQuantity?: number | null;
  testimonialQuote?: string | null;
  testimonialAuthor?: string | null;
  landingVideoUrl?: string | null;
}) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.platformSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...data },
    update: data,
  });

  if (data.sparkUnit != null) {
    await prisma.exchangeRate.upsert({
      where: { currency: "SYP" },
      create: { currency: "SYP", sparkUnit: data.sparkUnit },
      update: { sparkUnit: data.sparkUnit },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/dashboard/wallet");
}

export async function upsertMarketingTestimonial(data: {
  id?: string;
  quote: string;
  author: string;
  handle?: string | null;
  avatarUrl?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const payload = {
    quote: data.quote.trim(),
    author: data.author.trim(),
    handle: data.handle?.trim() || null,
    avatarUrl: data.avatarUrl?.trim() || null,
    sortOrder: data.sortOrder ?? 0,
    isActive: data.isActive ?? true,
  };

  if (data.id) {
    await prisma.marketingTestimonial.update({ where: { id: data.id }, data: payload });
  } else {
    await prisma.marketingTestimonial.create({ data: payload });
  }

  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

export async function deleteMarketingTestimonial(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.marketingTestimonial.delete({ where: { id } });
  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

export async function getAdminCampaignOptions() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  return prisma.campaign.findMany({
    where: { ...notDeleted, status: { in: ["ACTIVE", "ENDED"] } },
    orderBy: { prizeClaimed: "desc" },
    take: 30,
    select: { id: true, title: true, prizeClaimed: true },
  });
}

export async function upsertCreatorListingAdmin(data: {
  creatorId: string;
  bio?: string;
  categories: string[];
  isPublic: boolean;
  coverImageUrl?: string | null;
  showcaseTagline?: string | null;
  spotlightRank?: number | null;
}) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const campaigns = await prisma.campaign.findMany({
    where: { creatorId: data.creatorId, ...notDeleted },
    select: { id: true },
  });
  const campaignIds = campaigns.map((c) => c.id);
  let estimatedReach = 0;
  if (campaignIds.length > 0) {
    estimatedReach = await prisma.campaignEvent.count({
      where: { campaignId: { in: campaignIds }, type: "PAGE_VIEW" },
    });
  }

  await prisma.creatorListing.upsert({
    where: { creatorId: data.creatorId },
    create: {
      creatorId: data.creatorId,
      bio: data.bio,
      categories: data.categories,
      isPublic: data.isPublic,
      estimatedReach,
      coverImageUrl: data.coverImageUrl,
      showcaseTagline: data.showcaseTagline,
      spotlightRank: data.spotlightRank,
    },
    update: {
      bio: data.bio,
      categories: data.categories,
      isPublic: data.isPublic,
      estimatedReach,
      coverImageUrl: data.coverImageUrl,
      showcaseTagline: data.showcaseTagline,
      spotlightRank: data.spotlightRank,
    },
  });

  revalidatePath("/creators");
  revalidatePath("/admin/creators");
  revalidatePath("/marketplace");
}

export async function createCreatorAdmin(data: {
  name: string;
  handle: string;
  email: string;
  phone: string;
  password: string;
  verified?: boolean;
  isPartner?: boolean;
}) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const handle = data.handle.startsWith("@") ? data.handle : `@${data.handle}`;
  const email = data.email.trim().toLowerCase();
  if (!email || !data.password || data.password.length < 6) {
    throw new Error("Invalid email or password");
  }

  const isPartner = data.isPartner ?? false;
  const partnerDiscountCode = isPartner ? generatePartnerDiscountCode(handle) : null;
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const creator = await prisma.creator.create({
    data: {
      name: data.name.trim(),
      handle,
      email,
      phone: data.phone.trim(),
      password: hashedPassword,
      verified: data.verified ?? false,
      isPartner,
      partnerDiscountCode,
    },
  });

  await logAudit({
    actorId: session.user.id,
    actorType: "admin",
    action: "creator.created",
    entityType: "Creator",
    entityId: creator.id,
    after: { name: creator.name, handle, email, isPartner },
  });

  revalidatePath("/admin/creators");
  revalidatePath("/creators");
  return creator.id;
}

export async function updateCreatorAdmin(data: {
  id: string;
  name: string;
  handle: string;
  email?: string | null;
  phone: string;
  password?: string | null;
  avatarUrl?: string | null;
  verified: boolean;
  marketplaceBoostUntil?: string | null;
  isPartner?: boolean;
  partnerDiscountCode?: string | null;
}) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const before = await prisma.creator.findFirst({
    where: { id: data.id, ...notDeleted },
  });
  if (!before) throw new Error("Creator not found");

  const handle = data.handle.startsWith("@") ? data.handle : `@${data.handle}`;
  const isPartner = data.isPartner ?? before.isPartner;
  const partnerDiscountCode = isPartner
    ? (data.partnerDiscountCode?.trim().toUpperCase() ||
        before.partnerDiscountCode ||
        generatePartnerDiscountCode(handle))
    : null;

  const updateData: Parameters<typeof prisma.creator.update>[0]["data"] = {
    name: data.name,
    handle,
    phone: data.phone,
    avatarUrl: data.avatarUrl,
    verified: data.verified,
    marketplaceBoostUntil: data.marketplaceBoostUntil
      ? new Date(data.marketplaceBoostUntil)
      : null,
    isPartner,
    partnerDiscountCode,
  };

  if (data.email !== undefined) {
    updateData.email = data.email?.trim().toLowerCase() || null;
  }

  if (data.password?.trim()) {
    updateData.password = await bcrypt.hash(data.password.trim(), 10);
  }

  await prisma.creator.update({
    where: { id: data.id },
    data: updateData,
  });

  await logAudit({
    actorId: session.user.id,
    actorType: "admin",
    action: "creator.updated",
    entityType: "Creator",
    entityId: data.id,
    before: {
      name: before.name,
      handle: before.handle,
      verified: before.verified,
      isPartner: before.isPartner,
    },
    after: { name: data.name, handle, verified: data.verified, isPartner },
  });

  revalidatePath("/admin/creators");
  revalidatePath(`/admin/creators/${data.id}`);
  revalidatePath("/creators");
  revalidatePath("/marketplace");
  revalidatePath("/dashboard");
}

export async function recomputeSparkAdmin(creatorId: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const { computeSparkScore } = await import("@/lib/intelligence/spark-score");
  await computeSparkScore(creatorId);
  revalidatePath(`/admin/creators/${creatorId}`);
  revalidatePath("/creators");
}

export async function updateCampaignAdmin(
  campaignId: string,
  data: { status: "ACTIVE" | "PAUSED" | "ENDED" }
) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: data.status },
  });

  await logAudit({
    actorId: session.user.id,
    actorType: "admin",
    action: "campaign.status_updated",
    entityType: "Campaign",
    entityId: campaignId,
    after: { status: data.status },
  });

  revalidatePath("/admin/campaigns");
  revalidatePath("/");
}

export async function deleteCampaignAdmin(campaignId: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.campaign.update({
    where: { id: campaignId },
    data: { deletedAt: new Date() },
  });

  await logAudit({
    actorId: session.user.id,
    actorType: "admin",
    action: "campaign.soft_deleted",
    entityType: "Campaign",
    entityId: campaignId,
  });

  revalidatePath("/admin/campaigns");
}

export async function updateSponsorAdmin(data: {
  id: string;
  name: string;
  city?: string | null;
  sector?: string | null;
  email?: string | null;
  phone?: string | null;
  logoUrl?: string | null;
  verified: boolean;
}) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.sponsor.update({
    where: { id: data.id },
    data: {
      name: data.name,
      city: data.city,
      sector: data.sector,
      email: data.email,
      phone: data.phone,
      logoUrl: data.logoUrl,
      verified: data.verified,
    },
  });

  await logAudit({
    actorId: session.user.id,
    actorType: "admin",
    action: "sponsor.updated",
    entityType: "Sponsor",
    entityId: data.id,
    after: { name: data.name, verified: data.verified },
  });

  revalidatePath("/admin/sponsors");
}

export async function createAgencyAdmin(data: {
  name: string;
  email: string;
  password: string;
}) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const email = data.email.trim().toLowerCase();
  if (!email || !data.password || data.password.length < 6) {
    throw new Error("Invalid email or password");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const agency = await prisma.agency.create({
    data: {
      name: data.name.trim(),
      email,
      password: hashedPassword,
    },
  });

  await logAudit({
    actorId: session.user.id,
    actorType: "admin",
    action: "agency.created",
    entityType: "Agency",
    entityId: agency.id,
    after: { name: agency.name, email },
  });

  revalidatePath("/admin/agencies");
  return agency.id;
}

export async function adjustAgencyWallet(
  agencyId: string,
  amount: number,
  note: string
) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.$transaction(async (tx) => {
      if (amount > 0) {
        await allocateSparkFromTreasury(tx, amount, "agency.wallet_credit", {
          actorId: session.user.id,
          actorType: "admin",
          metadata: { agencyId, note },
        });
      } else if (amount < 0) {
        await returnSparkToTreasury(tx, -amount, "agency.wallet_debit", {
          actorId: session.user.id,
          actorType: "admin",
          metadata: { agencyId, note },
        });
      }

      await tx.agency.update({
        where: { id: agencyId },
        data: { walletBalance: { increment: amount } },
      });
      await tx.agencyWalletTransaction.create({
        data: {
          agencyId,
          type: amount >= 0 ? "TOPUP" : "ADJUSTMENT",
          amount,
          note,
        },
      });

      await logAudit({
        actorId: session.user.id,
        actorType: "admin",
        action: "agency.wallet_adjusted",
        entityType: "Agency",
        entityId: agencyId,
        metadata: { amount, note },
        tx,
      });
    });
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("INSUFFICIENT_TREASURY")) {
      throw e;
    }
    throw e;
  }

  revalidatePath("/admin/agencies");
  revalidatePath("/admin/wallet");
}

export async function approveAgencyTopUp(requestId: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const request = await prisma.agencyTopUpRequest.findUnique({
    where: { id: requestId },
  });
  if (!request || request.status !== "PENDING") return;

  try {
    await prisma.$transaction(async (tx) => {
      await allocateSparkFromTreasury(tx, request.amount, "agency.topup.approved", {
        actorId: session.user.id,
        actorType: "admin",
        metadata: { requestId, agencyId: request.agencyId },
      });

      await tx.agencyTopUpRequest.update({
        where: { id: requestId },
        data: { status: "APPROVED", reviewedAt: new Date() },
      });
      await tx.agency.update({
        where: { id: request.agencyId },
        data: { walletBalance: { increment: request.amount } },
      });
      await tx.agencyWalletTransaction.create({
        data: {
          agencyId: request.agencyId,
          type: "TOPUP",
          amount: request.amount,
          note: `شحن ${request.amount} Spark · ${request.transferMethod ?? "تحويل"} · ${request.bankReference}`,
        },
      });

      await logAudit({
        actorId: session.user.id,
        actorType: "admin",
        action: "agency.topup_approved",
        entityType: "AgencyTopUpRequest",
        entityId: requestId,
        after: { status: "APPROVED", amount: request.amount },
        metadata: { agencyId: request.agencyId },
        tx,
      });
    });
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("INSUFFICIENT_TREASURY")) {
      throw e;
    }
    throw e;
  }

  revalidatePath("/admin/agencies");
  revalidatePath("/agency/wallet");
}

export async function rejectAgencyTopUp(requestId: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const request = await prisma.agencyTopUpRequest.findUnique({
    where: { id: requestId },
  });
  if (!request || request.status !== "PENDING") return;

  await prisma.agencyTopUpRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED", reviewedAt: new Date() },
  });

  await logAudit({
    actorId: session.user.id,
    actorType: "admin",
    action: "agency.topup_rejected",
    entityType: "AgencyTopUpRequest",
    entityId: requestId,
    metadata: { agencyId: request.agencyId },
  });

  revalidatePath("/admin/agencies");
}

export async function grantIntelligenceSubscription(
  creatorId: string,
  days: number,
  tier = "PRO"
) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  if (days < 1 || days > 365) throw new Error("INVALID_DAYS");

  const activeUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await prisma.intelligenceSubscription.upsert({
    where: { creatorId },
    create: { creatorId, tier, activeUntil },
    update: { tier, activeUntil },
  });

  await logAudit({
    actorId: session.user.id,
    actorType: "admin",
    action: "intelligence.granted",
    entityType: "Creator",
    entityId: creatorId,
    after: { tier, activeUntil: activeUntil.toISOString() },
  });

  revalidatePath(`/admin/creators/${creatorId}`);
}

export async function revokeIntelligenceSubscription(creatorId: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.intelligenceSubscription.deleteMany({ where: { creatorId } });

  await logAudit({
    actorId: session.user.id,
    actorType: "admin",
    action: "intelligence.revoked",
    entityType: "Creator",
    entityId: creatorId,
  });

  revalidatePath(`/admin/creators/${creatorId}`);
}

export async function requestSponsorJoin(data: {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  message?: string;
}) {
  const name = data.name?.trim();
  const email = data.email?.trim();
  if (!name || name.length < 2 || !email || !email.includes("@")) {
    throw new Error("INVALID_INPUT");
  }

  const sponsor = await prisma.sponsor.create({
    data: {
      name,
      email,
      phone: data.phone?.trim() || null,
      city: data.city?.trim() || null,
      verified: false,
    },
  });

  await logAudit({
    actorType: "system",
    action: "sponsor.join_requested",
    entityType: "Sponsor",
    entityId: sponsor.id,
    metadata: { message: data.message?.trim() },
  });

  const { requestPasswordReset } = await import("@/lib/password-reset");
  await requestPasswordReset(email, "sponsor");

  return { ok: true, id: sponsor.id };
}

