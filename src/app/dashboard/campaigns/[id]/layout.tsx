import { notFound, redirect } from "next/navigation";
import { getCreatorSession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";
import { generateCampaignSlug } from "@/lib/campaign-slug";
import { CampaignOsShell } from "@/components/dashboard/CampaignOsShell";

export default async function CampaignOsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const session = await getCreatorSession();
  if (!session) redirect("/login");

  let campaign = await prisma.campaign.findFirst({
    where: { id: params.id, creatorId: session.user.id, ...notDeleted },
    select: { id: true, title: true, slug: true },
  });

  if (!campaign) notFound();

  if (!campaign.slug) {
    const slug = await generateCampaignSlug(campaign.title);
    campaign = await prisma.campaign.update({
      where: { id: campaign.id },
      data: { slug },
      select: { id: true, title: true, slug: true },
    });
  }

  return (
    <CampaignOsShell
      campaignId={campaign.id}
      title={campaign.title}
      slug={campaign.slug}
    >
      {children}
    </CampaignOsShell>
  );
}
