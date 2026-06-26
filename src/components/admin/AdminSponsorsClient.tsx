"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateSponsorAdmin } from "@/app/admin/actions";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminToast } from "@/components/admin/AdminToast";
import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export type AdminSponsorRow = {
  id: string;
  name: string;
  city: string | null;
  sector: string | null;
  email: string | null;
  phone: string | null;
  logoUrl: string | null;
  verified: boolean;
  campaignsCount: number;
};

export function AdminSponsorsClient({ sponsors }: { sponsors: AdminSponsorRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<AdminSponsorRow | null>(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [sector, setSector] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "error" } | null>(null);

  function loadSponsor(s: AdminSponsorRow) {
    setSelected(s);
    setName(s.name);
    setCity(s.city ?? "");
    setSector(s.sector ?? "");
    setEmail(s.email ?? "");
    setPhone(s.phone ?? "");
    setLogoUrl(s.logoUrl ?? "");
    setVerified(s.verified);
  }

  async function handleSave() {
    if (!selected) return;
    setLoading(true);
    try {
      await updateSponsorAdmin({
        id: selected.id,
        name,
        city: city || null,
        sector: sector || null,
        email: email || null,
        phone: phone || null,
        logoUrl: logoUrl || null,
        verified,
      });
      setToast({ msg: "تم الحفظ", variant: "success" });
      router.refresh();
    } catch {
      setToast({ msg: "فشل الحفظ", variant: "error" });
    }
    setLoading(false);
  }

  return (
    <div>
      <AdminPageHeader
        title="إدارة الرعاة"
        description="بيانات الرعاة والتحقق"
        breadcrumbs={[
          { label: "الإدارة", href: "/admin" },
          { label: "الرعاة" },
        ]}
      />
      <AdminDataTable
        data={sponsors}
        rowKey={(r) => r.id}
        searchPlaceholder="بحث بالاسم أو المدينة..."
        searchFilter={(row, q) =>
          `${row.name} ${row.city ?? ""}`.toLowerCase().includes(q)
        }
        onRowClick={loadSponsor}
        columns={[
          {
            key: "name",
            header: "الاسم",
            sortValue: (r) => r.name,
            render: (r) => <span className="text-warm-white">{r.name}</span>,
          },
          { key: "city", header: "المدينة", render: (r) => <span className="text-dim">{r.city ?? "—"}</span> },
          { key: "sector", header: "القطاع", render: (r) => <span className="text-dim">{r.sector ?? "—"}</span> },
          {
            key: "campaigns",
            header: "حملات",
            sortValue: (r) => r.campaignsCount,
            render: (r) => <span className="font-mono text-dim">{r.campaignsCount}</span>,
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
        ]}
      />

      {selected && (
        <CircuitCard className="mt-6 space-y-4">
          <h2 className="font-semibold text-gold-1">تعديل: {selected.name}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>الاسم</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>المدينة</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <Label>القطاع</Label>
              <Input value={sector} onChange={(e) => setSector(e.target.value)} />
            </div>
            <div>
              <Label>البريد</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" />
            </div>
            <div>
              <Label>الهاتف</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" />
            </div>
            <div>
              <Label>رابط الشعار</Label>
              <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} dir="ltr" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-dim">
            <input
              type="checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
            />
            موثّق
          </label>
          <Button onClick={handleSave} loading={loading}>
            حفظ
          </Button>
        </CircuitCard>
      )}

      {toast && (
        <AdminToast message={toast.msg} variant={toast.variant} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}
