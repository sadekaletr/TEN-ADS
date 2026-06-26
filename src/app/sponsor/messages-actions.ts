"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSponsorSession } from "@/lib/session-auth";
import { getCreatorSession } from "@/lib/session-auth";

export async function sendDealMessage(threadId: string, body: string) {
  const sponsorSession = await getSponsorSession();
  const creatorSession = await getCreatorSession();
  if (!sponsorSession && !creatorSession) throw new Error("Unauthorized");
  if (!body.trim()) throw new Error("EMPTY");

  const thread = await prisma.dealThread.findUnique({ where: { id: threadId } });
  if (!thread) throw new Error("NOT_FOUND");

  if (sponsorSession && thread.sponsorId !== sponsorSession.user.id) {
    throw new Error("Forbidden");
  }
  if (creatorSession && thread.creatorId !== creatorSession.user.id) {
    throw new Error("Forbidden");
  }

  await prisma.dealMessage.create({
    data: {
      threadId,
      body: body.trim(),
      senderId: sponsorSession?.user.id ?? creatorSession!.user.id,
      senderRole: sponsorSession ? "sponsor" : "creator",
    },
  });

  revalidatePath("/sponsor/messages");
  revalidatePath("/dashboard/requests");
}

export async function createDealThread(creatorId: string, subject: string) {
  const session = await getSponsorSession();
  if (!session) throw new Error("Unauthorized");

  const thread = await prisma.dealThread.create({
    data: {
      sponsorId: session.user.id,
      creatorId,
      subject: subject.trim(),
    },
  });

  revalidatePath("/sponsor/messages");
  return thread;
}
