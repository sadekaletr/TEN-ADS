"use server";

import { revalidatePath } from "next/cache";
import { notDeleted } from "@/lib/db";
import { createNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { getCreatorSession, getSponsorSession } from "@/lib/session-auth";

export async function submitCollabRequest(creatorId: string, message: string) {
  const session = await getSponsorSession();
  if (!session) throw new Error("Unauthorized");

  const sponsor = await prisma.sponsor.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  });

  await prisma.collabRequest.create({
    data: {
      sponsorId: session.user.id,
      creatorId,
      message,
    },
  });

  await createNotification({
    userId: creatorId,
    userType: "CREATOR",
    type: "collab_request",
    title: "طلب تعاون جديد",
    body: `${sponsor?.name ?? "راعٍ"} أرسل طلب تعاون.`,
    href: "/dashboard/requests",
  });

  revalidatePath("/dashboard/requests");
  revalidatePath("/dashboard/notifications");
}

export async function respondCollabRequest(
  requestId: string,
  status: "ACCEPTED" | "DECLINED"
) {
  const session = await getCreatorSession();
  if (!session) throw new Error("Unauthorized");

  const req = await prisma.collabRequest.findFirst({
    where: { id: requestId, creatorId: session.user.id },
    include: { sponsor: { select: { id: true, name: true } } },
  });
  if (!req) throw new Error("NOT_FOUND");

  await prisma.collabRequest.update({
    where: { id: requestId },
    data: { status },
  });

  await createNotification({
    userId: req.sponsorId,
    userType: "SPONSOR",
    type: "collab_response",
    title: status === "ACCEPTED" ? "قُبل طلب التعاون" : "رُفض طلب التعاون",
    body: `${session.user.name ?? "صانع محتوى"} ${status === "ACCEPTED" ? "قبل" : "رفض"} طلبك.`,
    href: "/marketplace",
  });

  revalidatePath("/dashboard/requests");
  revalidatePath("/sponsor/notifications");
}

export async function upsertCreatorListing(data: {
  bio?: string;
  categories: string[];
  isPublic: boolean;
  coverImageUrl?: string | null;
  showcaseTagline?: string | null;
  spotlightRank?: number | null;
}) {
  const session = await getCreatorSession();
  if (!session) throw new Error("Unauthorized");

  const campaigns = await prisma.campaign.findMany({
    where: { creatorId: session.user.id, ...notDeleted },
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
    where: { creatorId: session.user.id },
    create: {
      creatorId: session.user.id,
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

  revalidatePath("/marketplace");
  revalidatePath("/creators");
}
