import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { notificationCopy } from "@/lib/notifications/copy";
import { parseReferralToken } from "@/lib/referral/token";
import { hashPhone } from "@/lib/session";

const REFERRAL_GOAL = 3;

export async function recordConsumerReferral(
  refToken: string,
  campaignId: string,
  referredPhone: string
) {
  const parsed = parseReferralToken(refToken);
  if (!parsed || parsed.campaignId !== campaignId) return;

  const referredHash = hashPhone(referredPhone);
  if (parsed.phoneHash === referredHash) return;

  const referral = await prisma.consumerReferral.upsert({
    where: {
      referrerPhone_campaignId: {
        referrerPhone: parsed.phoneHash,
        campaignId,
      },
    },
    create: {
      referrerPhone: parsed.phoneHash,
      campaignId,
      referredCount: 1,
    },
    update: {
      referredCount: { increment: 1 },
    },
  });

  if (referral.referredCount >= REFERRAL_GOAL && !referral.rewarded) {
    await prisma.consumerReferral.update({
      where: { id: referral.id },
      data: { rewarded: true },
    });

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { title: true, creatorId: true },
    });
    if (campaign) {
      const copy = notificationCopy("referralMilestone", {
        count: REFERRAL_GOAL,
        campaignTitle: campaign.title,
      });
      await createNotification({
        userId: campaign.creatorId,
        userType: "CREATOR",
        type: "referral_milestone",
        title: copy.title,
        body: copy.body,
        href: `/dashboard/campaigns/${campaignId}`,
      });

      const rewardSpark = 5;
      await prisma.creator.update({
        where: { id: campaign.creatorId },
        data: { walletBalance: { increment: rewardSpark } },
      });
      await prisma.walletTransaction.create({
        data: {
          creatorId: campaign.creatorId,
          type: "REFUND",
          amount: rewardSpark,
          note: `مكافأة إحالة: ${REFERRAL_GOAL} أصدقاء — ${campaign.title}`,
        },
      });
    }
  }
}

export async function getReferralProgress(phoneHash: string, campaignId: string) {
  const row = await prisma.consumerReferral.findUnique({
    where: {
      referrerPhone_campaignId: { referrerPhone: phoneHash, campaignId },
    },
  });
  return row?.referredCount ?? 0;
}
