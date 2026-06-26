import { NextResponse } from "next/server";
import { getNotifications, getUnreadCount } from "@/lib/notifications";
import type { NotificationUserType } from "@prisma/client";
import { getCreatorSession, getSponsorSession } from "@/lib/session-auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userType = searchParams.get("userType") as NotificationUserType | null;

  const creator = await getCreatorSession();
  const sponsor = await getSponsorSession();

  let userId: string | null = null;
  let type: NotificationUserType | null = null;

  if (userType === "CREATOR" && creator) {
    userId = creator.user.id;
    type = "CREATOR";
  } else if (userType === "SPONSOR" && sponsor) {
    userId = sponsor.user.id;
    type = "SPONSOR";
  } else if (creator) {
    userId = creator.user.id;
    type = "CREATOR";
  } else if (sponsor) {
    userId = sponsor.user.id;
    type = "SPONSOR";
  }

  if (!userId || !type) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [notifications, unread] = await Promise.all([
    getNotifications(userId, type, 5),
    getUnreadCount(userId, type),
  ]);

  return NextResponse.json({ notifications, unread });
}
