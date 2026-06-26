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

export async function approveTopUp(requestId: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const request = await prisma.topUpRequest.findUnique({
    where: { id: requestId },
  });
  if (!request || request.status !== "PENDING") return;

  try {
    await prisma.$transaction(async (tx) => {
      await allocateSparkFromTreasury(tx, request.amount, "topup.approved", {
        actorId: session.user.id,
        actorType: "admin",
        metadata: { requestId, creatorId: request.creatorId },
      });

      await tx.topUpRequest.update({
        where: { id: requestId },
        data: { status: "APPROVED", reviewedAt: new Date() },
      });
      await tx.creator.update({
        where: { id: request.creatorId },
        data: { walletBalance: { increment: request.amount } },
      });
      const walletTx = await tx.walletTransaction.create({
        data: {
          creatorId: request.creatorId,
          type: "TOPUP",
          amount: request.amount,
          note: `شحن ${request.amount} Spark · ${request.transferMethod ?? "ShamCash"} · ${request.bankReference}`,
        },
      });

      await tx.topUpRequest.update({
        where: { id: requestId },
        data: { walletTransactionId: walletTx.id },
      });

      await logAudit({
        actorId: session.user.id,
        actorType: "admin",
        action: "wallet.topup_approved",
        entityType: "TopUpRequest",
        entityId: requestId,
        after: { status: "APPROVED", amount: request.amount },
        metadata: { amount: request.amount, creatorId: request.creatorId },
        tx,
      });
    });
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("INSUFFICIENT_TREASURY")) {
      throw e;
    }
    throw e;
  }

  const topupCopy = notificationCopy("topupApproved", {
    amount: request.amount,
    method: request.transferMethod ?? "ShamCash",
  });

  await createNotification({
    userId: request.creatorId,
    userType: "CREATOR",
    type: "topup_approved",
    title: topupCopy.title,
    body: topupCopy.body,
    href: "/dashboard/wallet",
  });

  const notifyEmail = process.env.TOPUP_NOTIFY_EMAIL;
  if (notifyEmail) {
    const emailResult = await emailTopUpApproved(notifyEmail, request.amount);
    if (!emailResult.ok && !emailResult.skipped) {
      console.error("[approveTopUp] email failed", emailResult);
    } else if (emailResult.skipped) {
      console.info("[approveTopUp] email skipped — set RESEND_API_KEY and EMAIL_FROM");
    }
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard/wallet");
}

export async function rejectTopUp(requestId: string, rejectionReason?: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const request = await prisma.topUpRequest.findUnique({
    where: { id: requestId },
  });
  if (!request || request.status !== "PENDING") return;

  await prisma.topUpRequest.update({
    where: { id: requestId },
    data: {
      status: "REJECTED",
      reviewedAt: new Date(),
      rejectionReason: rejectionReason ?? "لم يتم التحقق من التحويل",
    },
  });

  await logAudit({
    actorId: session.user.id,
    actorType: "admin",
    action: "wallet.topup_rejected",
    entityType: "TopUpRequest",
    entityId: requestId,
    metadata: { amount: request?.amount, creatorId: request?.creatorId },
  });

  const rejectCopy = notificationCopy("topupRejected", {
    reason: rejectionReason ?? "لم يتم التحقق من التحويل",
  });

  await createNotification({
    userId: request.creatorId,
    userType: "CREATOR",
    type: "topup_rejected",
    title: rejectCopy.title,
    body: rejectCopy.body,
    href: "/dashboard/wallet",
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard/wallet");
}

export async function adjustWallet(
  creatorId: string,
  amount: number,
  note: string
) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.$transaction(async (tx) => {
      if (amount > 0) {
        await allocateSparkFromTreasury(tx, amount, "wallet.adjust_credit", {
          actorId: session.user.id,
          actorType: "admin",
          metadata: { creatorId, note },
        });
      } else if (amount < 0) {
        await returnSparkToTreasury(tx, -amount, "wallet.adjust_debit", {
          actorId: session.user.id,
          actorType: "admin",
          metadata: { creatorId, note },
        });
      }

      await tx.creator.update({
        where: { id: creatorId },
        data: { walletBalance: { increment: amount } },
      });
      await tx.walletTransaction.create({
        data: {
          creatorId,
          type: amount >= 0 ? "TOPUP" : "REFUND",
          amount,
          note,
        },
      });

      await logAudit({
        actorId: session.user.id,
        actorType: "admin",
        action: "wallet.adjusted",
        entityType: "Creator",
        entityId: creatorId,
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

  revalidatePath("/admin");
  revalidatePath("/admin/wallet");
  revalidatePath(`/admin/creators/${creatorId}`);
}

export async function setSparkTreasuryBalance(balance: number) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  if (!Number.isFinite(balance) || balance < 0) {
    throw new Error("Invalid treasury balance");
  }

  const before = await getSparkTreasurySnapshot();

  await prisma.$transaction(async (tx) => {
    await adjustTreasuryBalance(tx, balance, "admin.balance_set", {
      actorId: session.user.id,
      actorType: "admin",
      metadata: { previousBalance: before.treasuryBalance },
    });
  });

  await logAudit({
    actorId: session.user.id,
    actorType: "admin",
    action: "treasury.balance_set",
    entityType: "PlatformSettings",
    entityId: "default",
    before: { treasuryBalance: before.treasuryBalance },
    after: { treasuryBalance: balance },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/wallet");
  revalidatePath("/admin/settings");
}

export async function resetAllCreatorWalletBalances() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.$transaction(async (tx) => {
    const creators = await tx.creator.findMany({
      where: { ...notDeleted, walletBalance: { gt: 0 } },
      select: { id: true, walletBalance: true },
    });

    const totalReturned = creators.reduce((sum, c) => sum + c.walletBalance, 0);

    for (const creator of creators) {
      await tx.creator.update({
        where: { id: creator.id },
        data: { walletBalance: 0 },
      });
      await tx.walletTransaction.create({
        data: {
          creatorId: creator.id,
          type: "REFUND",
          amount: -creator.walletBalance,
          note: "إعادة ضبط — تصفير رصيد الصناع",
        },
      });
    }

    if (totalReturned > 0) {
      await tx.platformSettings.upsert({
        where: { id: "default" },
        create: { id: "default", sparkTreasuryBalance: totalReturned },
        update: { sparkTreasuryBalance: { increment: totalReturned } },
      });
    }

    await logAudit({
      actorId: session.user.id,
      actorType: "admin",
      action: "wallet.all_reset",
      entityType: "PlatformSettings",
      entityId: "default",
      metadata: {
        creatorsReset: creators.length,
        sparkReturned: totalReturned,
      },
      tx,
    });
  });

  revalidatePath("/admin");
  revalidatePath("/admin/wallet");
  revalidatePath("/dashboard");
}


