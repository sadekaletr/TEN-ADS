"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteCampaignAdmin, updateCampaignAdmin } from "@/app/admin/actions";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminToast } from "@/components/admin/AdminToast";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { n } from "@/lib/format";

export type AdminCampaignRow = {
  id: string;
  title: string;
  status: string;
  city: string | null;
  prizeClaimed: number;
  prizeQuantity: number;
  creator: { name: string; handle: string };
  sponsor: { name: string } | null;
};

export function AdminCampaignsClient({ campaigns }: { campaigns: AdminCampaignRow[] }) {
  const router = useRouter();
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "error" } | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function changeStatus(id: string, status: "ACTIVE" | "PAUSED" | "ENDED") {
    setLoadingId(id);
    try {
      await updateCampaignAdmin(id, { status });
      setToast({ msg: "تم تحديث الحالة", variant: "success" });
      router.refresh();
    } catch {
      setToast({ msg: "فشل التحديث", variant: "error" });
    }
    setLoadingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("حذف الحملة (soft delete)؟")) return;
    setLoadingId(id);
    try {
      await deleteCampaignAdmin(id);
      setToast({ msg: "تم الحذف", variant: "success" });
      router.refresh();
    } catch {
      setToast({ msg: "فشل الحذف", variant: "error" });
    }
    setLoadingId(null);
  }

  return (
    <div>
      <AdminPageHeader
        title="إدارة الحملات"
        description="حالة الحملات والاستردادات"
        breadcrumbs={[
          { label: "الإدارة", href: "/admin" },
          { label: "الحملات" },
        ]}
      />
      <AdminDataTable
        data={campaigns}
        rowKey={(r) => r.id}
        searchPlaceholder="بحث بالعنوان أو الصانع..."
        searchFilter={(row, q) =>
          `${row.title} ${row.creator.name} ${row.creator.handle}`.toLowerCase().includes(q)
        }
        columns={[
          {
            key: "title",
            header: "العنوان",
            sortValue: (r) => r.title,
            render: (r) => <span className="text-warm-white">{r.title}</span>,
          },
          {
            key: "creator",
            header: "الصانع",
            render: (r) => (
              <span className="text-dim text-xs">
                {r.creator.name}
                <br />
                <span className="font-mono">{r.creator.handle}</span>
              </span>
            ),
          },
          {
            key: "sponsor",
            header: "الراعي",
            render: (r) => <span className="text-dim">{r.sponsor?.name ?? "—"}</span>,
          },
          {
            key: "city",
            header: "المدينة",
            render: (r) => <span className="text-dim">{r.city ?? "—"}</span>,
          },
          {
            key: "redemptions",
            header: "استردادات",
            sortValue: (r) => r.prizeClaimed,
            render: (r) => (
              <span className="font-mono text-gold-2">
                {n(r.prizeClaimed)}/{n(r.prizeQuantity)}
              </span>
            ),
          },
          {
            key: "status",
            header: "الحالة",
            render: (r) => (
              <Select
                value={r.status}
                onChange={(e) =>
                  void changeStatus(
                    r.id,
                    e.target.value as "ACTIVE" | "PAUSED" | "ENDED"
                  )
                }
                disabled={loadingId === r.id}
                className="min-h-9 text-xs"
              >
                <option value="ACTIVE">نشطة</option>
                <option value="PAUSED">متوقفة</option>
                <option value="ENDED">منتهية</option>
                <option value="DRAFT">مسودة</option>
              </Select>
            ),
          },
          {
            key: "actions",
            header: "",
            render: (r) => (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => void handleDelete(r.id)}
                disabled={loadingId === r.id}
              >
                حذف
              </Button>
            ),
          },
        ]}
      />
      {toast && (
        <AdminToast message={toast.msg} variant={toast.variant} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}
