import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session-auth";
import { getAdminStats } from "@/app/admin/actions";
import { AdminTrustClient } from "@/components/admin/AdminTrustClient";

export default async function AdminTrustPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const stats = await getAdminStats();

  return (
    <AdminTrustClient creators={stats.creators} sponsors={stats.sponsors} />
  );
}
