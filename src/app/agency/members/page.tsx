import { redirect } from "next/navigation";
import { getAgencySession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { getCreatorAnalytics } from "@/lib/analytics";
import { AgencyMembersClient } from "@/components/agency/AgencyMembersClient";

export default async function AgencyMembersPage() {
  const session = await getAgencySession();
  if (!session) redirect("/agency/login");

  const agency = await prisma.agency.findUnique({
    where: { id: session.user.id },
    include: {
      members: {
        include: {
          creator: { select: { id: true, name: true, handle: true } },
        },
        orderBy: { creator: { name: "asc" } },
      },
    },
  });
  if (!agency) redirect("/agency/login");

  const members = await Promise.all(
    agency.members.map(async (m) => {
      const analytics = await getCreatorAnalytics(m.creator.id);
      return {
        id: m.id,
        spendingLimit: m.spendingLimit,
        spentThisMonth: m.spentThisMonth,
        isActive: m.isActive,
        creator: m.creator,
        redemptions: analytics.funnel.redemptions,
      };
    })
  );

  return <AgencyMembersClient members={members} />;
}
