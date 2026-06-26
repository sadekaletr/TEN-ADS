import { notFound, redirect } from "next/navigation";
import { getCreatorSession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";
import { RedemptionsTable } from "@/components/dashboard/RedemptionsTable";
import { AnimatedCircuitCard } from "@/components/motion/AnimatedCircuitCard";

export default async function CampaignParticipantsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getCreatorSession();
  if (!session) redirect("/login");

  const campaign = await prisma.campaign.findFirst({
    where: { id: params.id, creatorId: session.user.id, ...notDeleted },
    include: {
      redemptions: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!campaign) notFound();

  return (
    <AnimatedCircuitCard>
      <h2 className="mb-4 text-gold-1">المشاركون والاستردادات</h2>
      <RedemptionsTable redemptions={campaign.redemptions} />
    </AnimatedCircuitCard>
  );
}
