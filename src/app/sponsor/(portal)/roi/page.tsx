import { PageHeader } from "@/components/ui/PageHeader";
import { SponsorRoiCard } from "@/components/sponsor/SponsorRoiCard";
import { SponsorSlaCard } from "@/components/sponsor/SponsorSlaCard";
import { getSponsorCollabSla, getSponsorRoi } from "@/lib/sponsor/queries";
import { trackSponsorRoiView } from "@/lib/sponsor/roi-tracking";
import { getSponsorSession } from "@/lib/session-auth";
import { redirect } from "next/navigation";

export default async function SponsorRoiPage() {
  const session = await getSponsorSession();
  if (!session) redirect("/sponsor/login");

  await trackSponsorRoiView(session.user.id);

  const [roi, sla] = await Promise.all([
    getSponsorRoi(session.user.id),
    getSponsorCollabSla(session.user.id),
  ]);

  return (
    <div className="space-y-6 pb-safe">
      <PageHeader title="العائد على الاستثمار" description="تكلفة Spark وتحويل الاستردادات" />
      <SponsorSlaCard {...sla} />
      <SponsorRoiCard {...roi} />
    </div>
  );
}
