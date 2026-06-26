"use server";

import { revalidatePath } from "next/cache";
import type { NotificationUserType } from "@prisma/client";
import {
  markAllNotificationsRead as markAll,
  markNotificationRead as markOne,
} from "@/lib/notifications";
import { getCreatorSession, getSponsorSession } from "@/lib/session-auth";

async function resolveUserId(userType: NotificationUserType) {
  if (userType === "CREATOR") {
    const session = await getCreatorSession();
    return session?.user.id ?? null;
  }
  if (userType === "SPONSOR") {
    const session = await getSponsorSession();
    return session?.user.id ?? null;
  }
  return null;
}

export async function markNotificationRead(id: string) {
  const session = await getCreatorSession();
  const sponsor = await getSponsorSession();
  const userId = session?.user.id ?? sponsor?.user.id;
  if (!userId) throw new Error("Unauthorized");

  await markOne(id, userId);
  revalidatePath("/dashboard/notifications");
  revalidatePath("/sponsor/notifications");
  revalidatePath("/dashboard");
  revalidatePath("/sponsor");
}

export async function markAllNotificationsRead(userType: NotificationUserType) {
  const userId = await resolveUserId(userType);
  if (!userId) throw new Error("Unauthorized");

  await markAll(userId, userType);
  revalidatePath("/dashboard/notifications");
  revalidatePath("/sponsor/notifications");
  revalidatePath("/dashboard");
  revalidatePath("/sponsor");
}
