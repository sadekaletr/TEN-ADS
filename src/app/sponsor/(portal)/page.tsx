import { RecommendedCreatorsCard } from "@/components/network/RecommendedCreatorsCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { SponsorOverview } from "@/components/sponsor/SponsorOverview";
import { getSponsorOverview } from "@/lib/sponsor/queries";
import { getSponsorSession } from "@/lib/session-auth";
import { redirect } from "next/navigation";

export default async function SponsorOverviewPage() {
  const session = await getSponsorSession();
  if (!session) redirect("/sponsor/login");

  const overview = await getSponsorOverview(session.user.id);

  return (
    <div className="space-y-8">
      <PageHeader
        title="بوابة الراعي"
        description="ملخص حملاتك وأدائها"
      />
      <SponsorOverview {...overview} />
      <RecommendedCreatorsCard sponsorId={session.user.id} />
    </div>
  );
}
