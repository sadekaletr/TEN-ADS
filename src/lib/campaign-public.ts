import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function getCampaignBySlug(slug: string) {
  return prisma.campaign.findFirst({
    where: { slug, ...notDeleted },
    include: {
      sponsor: true,
      creator: {
        select: { handle: true, name: true, avatarUrl: true, verified: true },
      },
      codes: { take: 1, orderBy: { id: "asc" } },
    },
  });
}
