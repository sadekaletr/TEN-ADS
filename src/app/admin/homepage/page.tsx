import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session-auth";
import { getAdminCampaignOptions, getAdminStats } from "@/app/admin/actions";
import { getPlatformSettings } from "@/lib/platform-settings";
import { getAllMarketingTestimonials } from "@/lib/marketing/testimonials";
import { AdminHomepageClient } from "@/components/admin/AdminHomepageClient";

export default async function AdminHomepagePage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [settings, campaigns, stats, testimonials] = await Promise.all([
    getPlatformSettings(),
    getAdminCampaignOptions(),
    getAdminStats(),
    getAllMarketingTestimonials(),
  ]);

  return (
    <AdminHomepageClient
      featuredCampaignId={settings.featuredCampaignId}
      heroCampaignId={settings.heroCampaignId}
      featuredCreatorId={settings.featuredCreatorId}
      landingVideoUrl={settings.landingVideoUrl}
      testimonials={testimonials}
      campaigns={campaigns}
      creators={stats.creators.map((c) => ({ id: c.id, name: c.name, handle: c.handle }))}
    />
  );
}
