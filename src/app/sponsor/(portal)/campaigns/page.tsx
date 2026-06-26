import { PageHeader } from "@/components/ui/PageHeader";
import { SponsorCampaignsList } from "@/components/sponsor/SponsorCampaignsList";
import { getSponsorCampaigns } from "@/lib/sponsor/queries";
import { getSponsorSession } from "@/lib/session-auth";
import { redirect } from "next/navigation";

export default async function SponsorCampaignsPage() {
  const session = await getSponsorSession();
  if (!session) redirect("/sponsor/login");

  const campaigns = await getSponsorCampaigns(session.user.id);

  return (
    <div className="space-y-6">
      <PageHeader title="حملاتي" description="الحملات المرتبطة بحساب الراعي" />
      <SponsorCampaignsList campaigns={campaigns} />
    </div>
  );
}
