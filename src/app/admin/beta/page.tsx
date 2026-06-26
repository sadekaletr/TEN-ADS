import { redirect } from "next/navigation";
import { getBetaMetrics } from "@/lib/beta-metrics";
import { getAdminSession } from "@/lib/session-auth";
import { AdminBetaClient } from "@/components/admin/AdminBetaClient";

export default async function AdminBetaPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const metrics = await getBetaMetrics();

  return <AdminBetaClient metrics={metrics} />;
}
