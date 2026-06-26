import { getCampaignBySlug } from "@/lib/campaign-public";
import { buildOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const alt = "TENEGTA Spark Campaign";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { slug: string };
}) {
  const campaign = await getCampaignBySlug(params.slug);
  if (!campaign) {
    return buildOgImage("حملة TENEGTA", "استلم جائزتك الآن");
  }
  return buildOgImage(
    campaign.title,
    `${campaign.prizeName} · ${campaign.sponsor.name}`,
    "حملة كوبون"
  );
}
