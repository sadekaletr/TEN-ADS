"use client";

import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminToast } from "@/components/admin/AdminToast";
import { TOKENS } from "@/styles/tokens";

const DEMO_ROWS = [
  { id: "1", name: "روان الشمعة", handle: "@rawan_shamaa", verified: true },
  { id: "2", name: "ليلى بريميوم", handle: "@layla_premium", verified: true },
];

export function AdminPreviewPanel() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className={`${TOKENS.type.cardTitle} text-gold-1`}>Admin Command Center</h2>
        <p className="mt-2 text-sm text-dim">PageHeader + DataTable + Toast</p>
      </div>
      <AdminPageHeader
        title="إدارة الصناع"
        description="معاينة مكوّنات الإدارة"
        breadcrumbs={[
          { label: "الإدارة", href: "#" },
          { label: "الصناع" },
        ]}
      />
      <AdminDataTable
        data={DEMO_ROWS}
        rowKey={(r) => r.id}
        searchFilter={(row, q) =>
          `${row.name} ${row.handle}`.toLowerCase().includes(q)
        }
        columns={[
          {
            key: "name",
            header: "الاسم",
            sortValue: (r) => r.name,
            render: (r) => <span className="text-warm-white">{r.name}</span>,
          },
          {
            key: "handle",
            header: "الحساب",
            render: (r) => <span className="font-mono text-xs text-dim">{r.handle}</span>,
          },
        ]}
      />
      <AdminToast message="تم الحفظ بنجاح (معاينة)" variant="success" durationMs={0} />
    </section>
  );
}
