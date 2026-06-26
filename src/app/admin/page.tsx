import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session-auth";
import { getAdminStats } from "@/app/admin/actions";
import { getPlatformActivity } from "@/lib/audit";
import {
  getParticipantInsights,
  getRecentFraudSignals,
} from "@/lib/intelligence/fraud";
import { AdminPageClient } from "@/components/admin/AdminPageClient";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [stats, activity, fraudSignals, audience] = await Promise.all([
    getAdminStats(),
    getPlatformActivity(),
    getRecentFraudSignals(),
    getParticipantInsights(),
  ]);

  return (
    <AdminPageClient
      stats={stats}
      activity={activity}
      fraudSignals={fraudSignals}
      audience={audience}
    />
  );
}
