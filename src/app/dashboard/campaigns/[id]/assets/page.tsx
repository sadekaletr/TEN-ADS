import { notFound, redirect } from "next/navigation";
import { getCreatorSession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";
import { CampaignAssetsStudio } from "@/components/campaign/CampaignAssetsStudio";
import { CampaignMediaForm } from "@/components/campaign/CampaignMediaForm";

export default async function CampaignAssetsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getCreatorSession();
  if (!session) redirect("/login");

  const campaign = await prisma.campaign.findFirst({
    where: { id: params.id, creatorId: session.user.id, ...notDeleted },
    include: { codes: { take: 1, orderBy: { id: "asc" } } },
  });
  if (!campaign) notFound();

  const primaryCode = campaign.codes[0]?.code ?? "";

  return (
    <div className="space-y-6">
      <CampaignMediaForm
        campaignId={campaign.id}
        prizeImageUrl={campaign.prizeImageUrl}
        promoVideoUrl={campaign.promoVideoUrl}
        heroTemplate={campaign.heroTemplate}
      />
      <CampaignAssetsStudio
        campaignId={campaign.id}
        primaryCode={primaryCode}
        title={campaign.title}
      />
    </div>
  );
}
