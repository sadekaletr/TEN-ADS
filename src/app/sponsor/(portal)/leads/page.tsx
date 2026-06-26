import { PageHeader } from "@/components/ui/PageHeader";
import { SponsorLeadsTable } from "@/components/sponsor/SponsorLeadsTable";
import { getSponsorLeads } from "@/lib/sponsor/queries";
import { getSponsorSession } from "@/lib/session-auth";
import { redirect } from "next/navigation";

export default async function SponsorLeadsPage() {
  const session = await getSponsorSession();
  if (!session) redirect("/sponsor/login");

  const leads = await getSponsorLeads(session.user.id);

  return (
    <div className="space-y-6">
      <PageHeader title="المستفيدون" description="استردادات حملاتك" />
      <SponsorLeadsTable leads={leads} />
    </div>
  );
}
