import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session-auth";
import { getAdminStats } from "@/app/admin/actions";
import { AdminWalletPageClient } from "@/components/admin/AdminWalletPageClient";
import { AdminWalletAdjust } from "@/components/admin/AdminWalletAdjust";
import { AdminSparkTreasuryPanel } from "@/components/admin/AdminSparkTreasuryPanel";
import { AdminShamCashPanel } from "@/components/admin/AdminShamCashPanel";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { getTransferSettings } from "@/lib/platform-settings";
import { getTreasuryLedger } from "@/lib/spark-treasury";

export default async function AdminWalletPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [stats, creators, transferSettings, ledger] = await Promise.all([
    getAdminStats(),
    prisma.creator.findMany({
      where: notDeleted,
      orderBy: { name: "asc" },
      select: { id: true, name: true, handle: true },
    }),
    getTransferSettings(),
    getTreasuryLedger(30),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="عمليات المحفظة"
        description={`${stats.pendingTopUps.length} طلب معلّق · خزينة ${stats.treasury.treasuryBalance} Spark`}
        breadcrumbs={[
          { label: "الإدارة", href: "/admin" },
          { label: "المحفظة" },
        ]}
      />
      <AdminSparkTreasuryPanel treasury={stats.treasury} ledger={ledger} />
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminWalletAdjust
          creators={creators}
          treasuryBalance={stats.treasury.treasuryBalance}
        />
        <AdminShamCashPanel initial={transferSettings} />
      </div>
      <AdminWalletPageClient pendingTopUps={stats.pendingTopUps} />
    </div>
  );
}
