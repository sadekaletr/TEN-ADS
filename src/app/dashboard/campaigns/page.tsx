import { getCreatorSession } from "@/lib/session-auth";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { CampaignsListClient } from "@/components/dashboard/CampaignsListClient";
import { redirect } from "next/navigation";

export default async function CampaignsPage() {
  const session = await getCreatorSession();
  if (!session) redirect("/login");

  const campaigns = await prisma.campaign.findMany({
    where: { creatorId: session.user.id, ...notDeleted },
    include: { sponsor: true },
    orderBy: { createdAt: "desc" },
  });

  return <CampaignsListClient campaigns={campaigns} />;
}
