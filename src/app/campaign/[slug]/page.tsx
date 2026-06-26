import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCampaignBySlug } from "@/lib/campaign-public";
import { PublicCampaignLanding } from "@/components/campaign/PublicCampaignLanding";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const campaign = await getCampaignBySlug(params.slug);
  if (!campaign) return { title: "Campaign not found" };

  const title = `${campaign.title} — ${campaign.sponsor.name}`;
  const description = `${campaign.prizeName} · ${campaign.creator.name} × ${campaign.sponsor.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function CampaignSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const campaign = await getCampaignBySlug(params.slug);
  if (!campaign || campaign.status !== "ACTIVE") notFound();

  return <PublicCampaignLanding campaign={campaign} />;
}
