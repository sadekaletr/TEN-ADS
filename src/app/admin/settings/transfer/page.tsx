import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/session-auth";
import { getTransferSettings } from "@/lib/platform-settings";
import { TransferSettingsForm } from "@/components/admin/TransferSettingsForm";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function AdminTransferSettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const settings = await getTransferSettings();

  return (
    <main className="mx-auto max-w-lg space-y-6 px-4 py-10">
      <Link href="/admin" className="text-sm text-dim hover:text-gold-1">
        ← لوحة الأدمن
      </Link>
      <PageHeader
        title="إعدادات شحن ShamCash"
        description="رقم الحساب وتعليمات التحويل التي يراها صناع المحتوى"
      />
      <TransferSettingsForm initial={settings} />
    </main>
  );
}
