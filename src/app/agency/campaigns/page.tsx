import { redirect } from "next/navigation";
import { getAgencySession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";
import { AgencyCampaignsClient } from "@/components/agency/AgencyCampaignsClient";

export default async function AgencyCampaignsPage() {
  const session = await getAgencySession();
  if (!session) redirect("/agency/login");

  const agency = await prisma.agency.findUnique({
    where: { id: session.user.id },
    include: {
      members: {
        where: { isActive: true },
        include: { creator: { select: { id: true, name: true, handle: true } } },
      },
    },
  });
  if (!agency) redirect("/agency/login");

  const creatorIds = agency.members.map((m) => m.creatorId);
  const campaigns =
    creatorIds.length === 0
      ? []
      : await prisma.campaign.findMany({
          where: { creatorId: { in: creatorIds }, ...notDeleted },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            status: true,
            prizeClaimed: true,
            prizeQuantity: true,
            creator: { select: { name: true, handle: true } },
            sponsor: { select: { name: true } },
          },
        });

  const members = agency.members.map((m) => ({
    id: m.id,
    label: `${m.creator.name} (${m.creator.handle})`,
  }));

  return <AgencyCampaignsClient campaigns={campaigns} members={members} />;
}
