import { notFound, redirect } from "next/navigation";
import { getCreatorSession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";
import { LiveSparkFlow } from "@/components/command/LiveSparkFlow";
import { AnimatedCircuitCard } from "@/components/motion/AnimatedCircuitCard";

export default async function CampaignLivePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getCreatorSession();
  if (!session) redirect("/login");

  const campaign = await prisma.campaign.findFirst({
    where: { id: params.id, creatorId: session.user.id, ...notDeleted },
    select: { id: true, title: true },
  });
  if (!campaign) notFound();

  return (
    <AnimatedCircuitCard>
      <h2 className="mb-4 text-gold-1">التدفق المباشر — {campaign.title}</h2>
      <LiveSparkFlow campaignId={campaign.id} />
    </AnimatedCircuitCard>
  );
}
