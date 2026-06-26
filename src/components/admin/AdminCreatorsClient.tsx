"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminCreateCreatorDialog } from "@/components/admin/AdminCreateCreatorDialog";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";

export type AdminCreatorRow = {
  id: string;
  name: string;
  handle: string;
  email: string | null;
  verified: boolean;
  walletBalance: number;
  listing: {
    id: string;
    isPublic: boolean;
    spotlightRank: number | null;
    coverImageUrl: string | null;
  } | null;
};

export function AdminCreatorsClient({ creators }: { creators: AdminCreatorRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "verified" | "listed" | "spotlight">("all");
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = creators.filter((c) => {
    if (filter === "verified") return c.verified;
    if (filter === "listed") return c.listing?.isPublic;
    if (filter === "spotlight") return c.listing?.spotlightRank != null;
    return true;
  });

  return (
    <div>
      <AdminPageHeader
        title="إدارة الصناع"
        description="دليل كامل — عدّل الهوية، بطاقة العرض، والمحفظة"
        breadcrumbs={[
          { label: "الإدارة", href: "/admin" },
          { label: "الصناع" },
        ]}
        actions={
          <>
            <Button type="button" size="sm" onClick={() => setCreateOpen(true)}>
              + إضافة صانع
            </Button>
            <Button href="/creators" variant="secondary" size="sm">
              معاينة /creators
            </Button>
          </>
        }
      />

      <AdminCreateCreatorDialog open={createOpen} onClose={() => setCreateOpen(false)} />

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["all", "الكل"],
            ["verified", "موثّقون"],
            ["listed", "قوائم عامة"],
            ["spotlight", "Spotlight"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={
              filter === key
                ? "rounded-full border border-gold-2/50 bg-gold-2/15 px-3 py-1.5 text-xs text-gold-1"
                : "rounded-full border border-gold-4/20 px-3 py-1.5 text-xs text-dim hover:text-warm-white"
            }
          >
            {label}
          </button>
        ))}
      </div>

      <AdminDataTable
        data={filtered}
        rowKey={(r) => r.id}
        searchPlaceholder="بحث بالاسم أو الحساب..."
        searchFilter={(row, q) =>
          `${row.name} ${row.handle} ${row.email ?? ""}`.toLowerCase().includes(q)
        }
        onRowClick={(row) => router.push(`/admin/creators/${row.id}`)}
        columns={[
          {
            key: "name",
            header: "الاسم",
            sortValue: (r) => r.name,
            render: (r) => (
              <span className="font-medium text-warm-white">{r.name}</span>
            ),
          },
          {
            key: "email",
            header: "البريد",
            sortValue: (r) => r.email ?? "",
            render: (r) => (
              <span className="font-mono text-xs text-dim">{r.email ?? "—"}</span>
            ),
          },
          {
            key: "handle",
            header: "الحساب",
            sortValue: (r) => r.handle,
            render: (r) => (
              <span className="font-mono text-xs text-dim">{r.handle}</span>
            ),
          },
          {
            key: "listing",
            header: "القائمة",
            render: (r) => (
              <span className="text-dim">
                {r.listing ? (r.listing.isPublic ? "عامة" : "خاصة") : "—"}
              </span>
            ),
          },
          {
            key: "spotlight",
            header: "Spotlight",
            sortValue: (r) => r.listing?.spotlightRank ?? 99,
            render: (r) => (
              <span className="text-dim">{r.listing?.spotlightRank ?? "—"}</span>
            ),
          },
          {
            key: "verified",
            header: "موثّق",
            render: (r) => (
              <span className={r.verified ? "text-gold-1" : "text-dim"}>
                {r.verified ? "نعم" : "لا"}
              </span>
            ),
          },
          {
            key: "actions",
            header: "",
            render: (r) => (
              <Link
                href={`/admin/creators/${r.id}`}
                className="text-xs text-gold-2 hover:text-gold-1"
                onClick={(e) => e.stopPropagation()}
              >
                تعديل
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}
