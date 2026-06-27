import { redirect } from "next/navigation";
import { CampaignWizard } from "@/components/campaign/new/CampaignWizard";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { getCreatorSession } from "@/lib/session-auth";

export default async function NewCampaignPage() {
  const session = await getCreatorSession();
  if (!session) redirect("/login");

  const creator = await prisma.creator.findFirst({
    where: { id: session.user.id, ...notDeleted },
    select: { planTier: true },
  });

  return <CampaignWizard planTier={creator?.planTier ?? "STARTER"} />;
}
