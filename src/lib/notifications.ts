import type { NotificationUserType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function createNotification(input: {
  userId: string;
  userType: NotificationUserType;
  type: string;
  title: string;
  body: string;
  href?: string;
}) {
  return prisma.notification.create({ data: input });
}

export async function getUnreadCount(userId: string, userType: NotificationUserType) {
  return prisma.notification.count({
    where: { userId, userType, readAt: null },
  });
}

export async function getNotifications(
  userId: string,
  userType: NotificationUserType,
  limit = 30
) {
  return prisma.notification.findMany({
    where: { userId, userType },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function markNotificationRead(id: string, userId: string) {
  await prisma.notification.updateMany({
    where: { id, userId },
    data: { readAt: new Date() },
  });
}

export async function markAllNotificationsRead(
  userId: string,
  userType: NotificationUserType
) {
  await prisma.notification.updateMany({
    where: { userId, userType, readAt: null },
    data: { readAt: new Date() },
  });
}
