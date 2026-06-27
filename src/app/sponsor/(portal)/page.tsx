import { RecommendedCreatorsCard } from "@/components/network/RecommendedCreatorsCard";
import { SponsorCommandCenterClient } from "@/components/sponsor/SponsorCommandCenterClient";
import {
  getSponsorActivityFeed,
  getSponsorCommandCenter,
} from "@/lib/sponsor/queries";
import { getSponsorSession } from "@/lib/session-auth";
import { redirect } from "next/navigation";

export default async function SponsorOverviewPage() {
  const session = await getSponsorSession();
  if (!session) redirect("/sponsor/login");

  const [commandCenter, activity] = await Promise.all([
    getSponsorCommandCenter(session.user.id),
    getSponsorActivityFeed(session.user.id),
  ]);

  return (
    <div className="space-y-8">
      <SponsorCommandCenterClient data={commandCenter} activity={activity} />
      <RecommendedCreatorsCard sponsorId={session.user.id} />
    </div>
  );
}
