import { notFound, redirect } from "next/navigation";
import { getCreatorSession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";
import { ArchiveCampaignButton } from "@/components/dashboard/ArchiveCampaignButton";
import { CampaignSettingsClient } from "@/components/dashboard/CampaignSettingsClient";
import { AnimatedCircuitCard } from "@/components/motion/AnimatedCircuitCard";

export default async function CampaignSettingsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getCreatorSession();
  if (!session) redirect("/login");

  const campaign = await prisma.campaign.findFirst({
    where: { id: params.id, creatorId: session.user.id, ...notDeleted },
    select: {
      id: true,
      title: true,
      status: true,
      prizeQuantity: true,
      prizeClaimed: true,
    },
  });
  if (!campaign) notFound();

  return (
    <div className="space-y-4">
      <AnimatedCircuitCard>
        <h2 className="mb-4 text-gold-1">حالة الحملة</h2>
        <CampaignSettingsClient
          campaignId={campaign.id}
          status={campaign.status}
          prizeQuantity={campaign.prizeQuantity}
          prizeClaimed={campaign.prizeClaimed}
        />
      </AnimatedCircuitCard>
      <AnimatedCircuitCard>
        <ArchiveCampaignButton campaignId={campaign.id} title={campaign.title} />
      </AnimatedCircuitCard>
    </div>
  );
}
