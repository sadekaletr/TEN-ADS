import { cache } from "react";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { getCreatorSession } from "@/lib/session-auth";

export const getCachedCreatorSession = cache(async () => getCreatorSession());

export const getCachedCreator = cache(async () => {
  const session = await getCachedCreatorSession();
  if (!session) return null;
  return prisma.creator.findFirst({
    where: { id: session.user.id, ...notDeleted },
  });
});
