"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { saveVerificationPhoto } from "@/lib/verification-storage";
import { trackCampaignEvent } from "@/lib/analytics";
import { logAudit } from "@/lib/audit";
import { publishRedemption } from "@/lib/events/publish";
import { analyzeFraudForRedemption } from "@/lib/intelligence/fraud";
import {
  tagParticipantAfterRedemption,
  upsertParticipant,
} from "@/lib/intelligence/participant";
import { notDeleted } from "@/lib/db";
import { unfeatureCampaignIfFeatured } from "@/lib/platform-settings";
import { createNotification } from "@/lib/notifications";
import { notificationCopy } from "@/lib/notifications/copy";
import { prisma } from "@/lib/prisma";
import { recordConsumerReferral } from "@/lib/referral/track";
import { getClientIp, hashIp, hashPhone } from "@/lib/session";
import { emailRedemptionReceipt } from "@/lib/email";
import { dispatchWebhook } from "@/lib/webhooks";

const redeemDataSchema = z.object({
  fullName: z.string().min(2).max(120),
  phone: z.string().min(6).max(20),
  address: z.string().max(300).optional(),
  city: z.string().max(80).optional(),
});

export type RedeemResult =
  | { ok: true; reference: string; redemptionId: string }
  | { ok: false; error: string };

function makeReference(): string {
  return `SPK-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function redeemCode(
  campaignId: string,
  code: string,
  sessionId: string,
  data: {
    fullName: string;
    phone: string;
    address?: string;
    city?: string;
  },
  trackingCode?: string,
  consumerRefToken?: string
): Promise<RedeemResult> {
  const parsed = redeemDataSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: "بيانات غير صالحة" };
  }
  const form = parsed.data;

  const hdrs = await headers();
  const ipHash = hashIp(getClientIp(hdrs));

  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, ...notDeleted },
    include: { codes: true },
  });

  if (!campaign || campaign.status !== "ACTIVE") {
    await trackCampaignEvent(
      { campaignId, sessionId, type: "REDEMPTION_FAILED", metadata: { reason: "ended" } },
      hdrs
    );
    return { ok: false, error: "انتهت الحملة" };
  }

  if (campaign.endsAt && campaign.endsAt < new Date()) {
    await trackCampaignEvent(
      { campaignId, sessionId, type: "REDEMPTION_FAILED", metadata: { reason: "expired" } },
      hdrs
    );
    return { ok: false, error: "انتهت الحملة" };
  }

  if (campaign.prizeClaimed >= campaign.prizeQuantity) {
    await trackCampaignEvent(
      { campaignId, sessionId, type: "REDEMPTION_FAILED", metadata: { reason: "sold_out" } },
      hdrs
    );
    return { ok: false, error: "نفدت الكمية" };
  }

  const normalizedCode = code.toUpperCase().trim();
  const campaignCode = campaign.codes.find(
    (c) => c.code.toUpperCase() === normalizedCode
  );

  if (!campaignCode) {
    await trackCampaignEvent(
      { campaignId, sessionId, type: "REDEMPTION_FAILED", metadata: { reason: "invalid_code" } },
      hdrs
    );
    return { ok: false, error: "كود غير صحيح" };
  }

  if (campaign.codeMode === "UNIQUE" && campaignCode.used) {
    await trackCampaignEvent(
      { campaignId, sessionId, type: "REDEMPTION_FAILED", metadata: { reason: "used_code" } },
      hdrs
    );
    return { ok: false, error: "لقد استُخدم هذا الكود من قبل" };
  }

  if (campaign.requirePhone && !form.phone.trim()) {
    return { ok: false, error: "رقم الهاتف مطلوب" };
  }
  if (campaign.requireAddress && !form.address?.trim()) {
    return { ok: false, error: "العنوان مطلوب" };
  }

  if (campaign.antiAbuse) {
    const existing = await prisma.redemption.findFirst({
      where: {
        campaignId,
        OR: [{ phone: form.phone }, { ipHash }],
      },
    });
    if (existing) {
      await trackCampaignEvent(
        { campaignId, sessionId, type: "REDEMPTION_FAILED", metadata: { reason: "duplicate" } },
        hdrs
      );
      return { ok: false, error: "لقد استخدمت هذا الكود من قبل" };
    }
  }

  if (campaign.city && form.city && campaign.city !== form.city) {
    return { ok: false, error: `هذه الحملة مقتصرة على ${campaign.city}` };
  }

  const reference = makeReference();
  let redemptionId = "";
  let redemptionCity: string | null = form.city ?? null;
  let collaboratorId: string | null = null;
  let soldOut = false;

  if (trackingCode) {
    const collab = await prisma.campaignCollaborator.findFirst({
      where: { trackingCode: trackingCode.toUpperCase(), campaignId },
    });
    if (collab) collaboratorId = collab.id;
  }

  await prisma.$transaction(async (tx) => {
    const claimed = await tx.campaign.updateMany({
      where: {
        id: campaignId,
        prizeClaimed: { lt: campaign.prizeQuantity },
        status: "ACTIVE",
      },
      data: { prizeClaimed: { increment: 1 } },
    });
    if (claimed.count !== 1) {
      soldOut = true;
      return;
    }

    const participant = await upsertParticipant(
      form.phone,
      ipHash,
      sessionId,
      tx
    );

    const redemption = await tx.redemption.create({
      data: {
        campaignId,
        participantId: participant.id,
        sessionId,
        codeUsed: campaignCode.code,
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        ipHash,
        collaboratorId,
      },
    });
    redemptionId = redemption.id;
    redemptionCity = redemption.city;

    if (campaign.codeMode === "UNIQUE") {
      await tx.campaignCode.update({
        where: { id: campaignCode.id },
        data: { used: true },
      });
    }

    if (collaboratorId) {
      await tx.campaignCollaborator.update({
        where: { id: collaboratorId },
        data: { redemptionsCount: { increment: 1 } },
      });
    }

    await logAudit({
      actorType: "system",
      action: "redemption.completed",
      entityType: "Redemption",
      entityId: redemption.id,
      metadata: {
        campaignId,
        creatorId: campaign.creatorId,
        fullName: form.fullName,
        reference,
      },
      tx,
    });
  });

  if (soldOut) {
    await trackCampaignEvent(
      { campaignId, sessionId, type: "REDEMPTION_FAILED", metadata: { reason: "sold_out" } },
      hdrs
    );
    return { ok: false, error: "نفدت الكمية" };
  }

  await trackCampaignEvent(
    { campaignId, sessionId, type: "REDEMPTION_COMPLETED", metadata: { reference } },
    hdrs
  );

  const participant = await prisma.participant.findFirst({
    where: { phoneHash: hashPhone(form.phone) },
  });
  if (participant) {
    await tagParticipantAfterRedemption(participant.id, campaignId, sessionId);
    await analyzeFraudForRedemption({
      campaignId,
      phone: form.phone,
      ipHash,
      sessionId,
      participantId: participant.id,
    });
  }

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.phone)) {
    await emailRedemptionReceipt({
      to: form.phone,
      campaignTitle: campaign.title,
      prizeName: campaign.prizeName,
    });
  }

  await publishRedemption({
    id: redemptionId,
    campaignId,
    creatorId: campaign.creatorId,
    city: redemptionCity,
    prizeName: campaign.prizeName,
    createdAt: new Date().toISOString(),
  });

  void dispatchWebhook(
    "redemption.completed",
    { redemptionId, campaignId, reference },
    campaign.creatorId
  );

  const updatedClaimed = campaign.prizeClaimed + 1;
  if (updatedClaimed > 0 && updatedClaimed % 10 === 0) {
    const milestone = notificationCopy("milestone", {
      count: updatedClaimed,
      campaignTitle: campaign.title,
    });
    await createNotification({
      userId: campaign.creatorId,
      userType: "CREATOR",
      type: "redemption_milestone",
      title: milestone.title,
      body: milestone.body,
      href: `/dashboard/campaigns/${campaignId}`,
    });
  }

  const fillRate = updatedClaimed / campaign.prizeQuantity;
  if (fillRate >= 0.85 && fillRate < 1) {
    const fresh = await prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { endingNotifiedAt: true },
    });
    if (!fresh?.endingNotifiedAt) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { endingNotifiedAt: new Date() },
      });
      const ending = notificationCopy("campaignEnding", {
      campaignTitle: campaign.title,
      claimed: updatedClaimed,
      total: campaign.prizeQuantity,
      percent: Math.round(fillRate * 100),
    });
    await createNotification({
      userId: campaign.creatorId,
      userType: "CREATOR",
      type: "campaign_ending",
      title: ending.title,
      body: ending.body,
      href: `/dashboard/campaigns/${campaignId}`,
    });
    }
  }

  if (updatedClaimed >= campaign.prizeQuantity) {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: "ENDED" },
    });
    await unfeatureCampaignIfFeatured(campaignId);

    const exhausted = notificationCopy("prizesExhausted", {
      campaignTitle: campaign.title,
      total: campaign.prizeQuantity,
    });
    await createNotification({
      userId: campaign.creatorId,
      userType: "CREATOR",
      type: "prizes_exhausted",
      title: exhausted.title,
      body: exhausted.body,
      href: `/dashboard/campaigns/${campaignId}`,
    });
    await createNotification({
      userId: campaign.sponsorId,
      userType: "SPONSOR",
      type: "prizes_exhausted",
      title: exhausted.title,
      body: exhausted.body,
      href: `/sponsor/campaigns`,
    });

    await logAudit({
      actorType: "system",
      action: "campaign.prizes_exhausted",
      entityType: "Campaign",
      entityId: campaignId,
      metadata: {
        prizeClaimed: updatedClaimed,
        prizeQuantity: campaign.prizeQuantity,
        sponsorId: campaign.sponsorId,
      },
    });
  }

  if (consumerRefToken) {
    await recordConsumerReferral(consumerRefToken, campaignId, form.phone);
  }

  return { ok: true, reference, redemptionId };
}

export async function uploadVerificationPhoto(
  redemptionId: string,
  sessionId: string,
  formData: FormData
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const file = formData.get("photo");
  if (!file || !(file instanceof Blob)) {
    return { ok: false, error: "لم يتم اختيار صورة" };
  }

  const redemption = await prisma.redemption.findUnique({
    where: { id: redemptionId },
  });
  if (!redemption) return { ok: false, error: "الاسترداد غير موجود" };
  if (redemption.sessionId !== sessionId) {
    return { ok: false, error: "غير مصرح" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file instanceof File ? file.name : "photo.jpg";
  const ext = name.split(".").pop() ?? "jpg";
  const url = await saveVerificationPhoto(redemptionId, buffer, ext);

  await prisma.redemption.update({
    where: { id: redemptionId },
    data: { verificationPhotoUrl: url },
  });

  return { ok: true, url };
}

export async function lookupCode(code: string) {
  const normalizedCode = code.toUpperCase().trim();
  const campaignCode = await prisma.campaignCode.findFirst({
    where: { code: { equals: normalizedCode, mode: "insensitive" } },
    include: {
      campaign: {
        include: {
          sponsor: true,
          creator: {
            select: { handle: true, name: true, avatarUrl: true, verified: true },
          },
        },
      },
    },
  });

  if (!campaignCode || campaignCode.campaign.deletedAt) return null;
  const c = campaignCode.campaign;
  if (c.status === "ENDED" || c.status === "PAUSED" || c.status === "DRAFT") {
    return null;
  }
  return c;
}

export async function validateCodeSubmit(
  campaignId: string,
  sessionId: string
) {
  const hdrs = await headers();
  await trackCampaignEvent(
    { campaignId, sessionId, type: "CODE_SUBMIT" },
    hdrs
  );
}

export async function trackRedemptionStarted(
  campaignId: string,
  sessionId: string
) {
  const hdrs = await headers();
  await trackCampaignEvent(
    { campaignId, sessionId, type: "REDEMPTION_STARTED" },
    hdrs
  );
}
