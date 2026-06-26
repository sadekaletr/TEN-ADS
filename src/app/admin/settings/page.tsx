import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session-auth";
import { getPlatformSettings } from "@/lib/platform-settings";
import { getTransferSettings } from "@/lib/platform-settings";
import { AdminSettingsClient } from "@/components/admin/AdminSettingsClient";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [platform, transfer] = await Promise.all([
    getPlatformSettings(),
    getTransferSettings(),
  ]);

  return (
    <AdminSettingsClient
      transfer={transfer}
      sparkUnit={platform.sparkUnit}
      maxPrizeQuantity={platform.maxPrizeQuantity}
    />
  );
}
