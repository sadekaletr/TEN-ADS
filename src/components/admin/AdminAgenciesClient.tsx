"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  adjustAgencyWallet,
  approveAgencyTopUp,
  createAgencyAdmin,
  rejectAgencyTopUp,
} from "@/app/admin/actions";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminToast } from "@/components/admin/AdminToast";
import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { formatNumber } from "@/lib/format";

export type AdminAgencyRow = {
  id: string;
  name: string;
  email: string;
  walletBalance: number;
  memberCount: number;
  createdAt: Date;
};

type PendingAgencyTopUp = {
  id: string;
  amount: number;
  bankReference: string;
  transferMethod: string | null;
  createdAt: Date;
  agency: { name: string; email: string };
};

const QUICK_GRANTS = [50, 100, 250, 500];

export function AdminAgenciesClient({
  agencies,
  pendingTopUps,
  treasuryBalance,
}: {
  agencies: AdminAgencyRow[];
  pendingTopUps: PendingAgencyTopUp[];
  treasuryBalance: number;
}) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adjustAgencyId, setAdjustAgencyId] = useState(agencies[0]?.id ?? "");
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustNote, setAdjustNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "error" } | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createAgencyAdmin({ name, email, password });
      setToast({ msg: "تم إنشاء الوكالة", variant: "success" });
      setCreateOpen(false);
      setName("");
      setEmail("");
      setPassword("");
      router.refresh();
    } catch {
      setToast({ msg: "فشل إنشاء الوكالة", variant: "error" });
    }
    setLoading(false);
  }

  async function handleAdjust(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(adjustAmount);
    if (!adjustAgencyId || !adjustNote.trim() || Number.isNaN(num) || num === 0) {
      setToast({ msg: "أدخل وكالة ومبلغاً وملاحظة", variant: "error" });
      return;
    }
    setLoading(true);
    try {
      await adjustAgencyWallet(adjustAgencyId, num, adjustNote.trim());
      setToast({ msg: "تم تعديل محفظة الوكالة", variant: "success" });
      setAdjustAmount("");
      setAdjustNote("");
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof Error && err.message.startsWith("INSUFFICIENT_TREASURY")
          ? `رصيد الخزينة غير كافٍ — متاح ${formatNumber(treasuryBalance)} Spark`
          : "فشل التعديل";
      setToast({ msg, variant: "error" });
    }
    setLoading(false);
  }

  async function handleApproveTopUp(id: string) {
    setLoading(true);
    try {
      await approveAgencyTopUp(id);
      setToast({ msg: "تم قبول طلب الشحن", variant: "success" });
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof Error && err.message.startsWith("INSUFFICIENT_TREASURY")
          ? "رصيد الخزينة غير كافٍ"
          : "فشل القبول";
      setToast({ msg, variant: "error" });
    }
    setLoading(false);
  }

  async function handleRejectTopUp(id: string) {
    setLoading(true);
    try {
      await rejectAgencyTopUp(id);
      setToast({ msg: "تم رفض الطلب", variant: "success" });
      router.refresh();
    } catch {
      setToast({ msg: "فشل الرفض", variant: "error" });
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="إدارة الوكالات"
        description="إنشاء الوكالات وتعديل المحافظ ومراجعة طلبات الشحن"
        breadcrumbs={[
          { label: "الإدارة", href: "/admin" },
          { label: "الوكالات" },
        ]}
        actions={
          <Button type="button" size="sm" onClick={() => setCreateOpen((v) => !v)}>
            {createOpen ? "إلغاء" : "+ وكالة جديدة"}
          </Button>
        }
      />

      {createOpen && (
        <CircuitCard className="space-y-4">
          <h2 className="font-semibold text-gold-1">إنشاء وكالة</h2>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>اسم الوكالة</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label>البريد</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="sm:col-span-2">
              <Label>كلمة المرور</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <Button type="submit" loading={loading}>
              إنشاء
            </Button>
          </form>
        </CircuitCard>
      )}

      <CircuitCard className="space-y-4">
        <h2 className="font-semibold text-gold-1">تعديل محفظة وكالة</h2>
        <p className="text-sm text-dim">
          متاح في الخزينة:{" "}
          <span className="font-mono text-gold-1">{formatNumber(treasuryBalance)}</span> Spark
        </p>
        <form onSubmit={handleAdjust} className="space-y-4">
          <div>
            <Label>الوكالة</Label>
            <Select value={adjustAgencyId} onChange={(e) => setAdjustAgencyId(e.target.value)}>
              {agencies.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({formatNumber(a.walletBalance)} Spark)
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>المبلغ (+/-)</Label>
            <Input
              type="number"
              value={adjustAmount}
              onChange={(e) => setAdjustAmount(e.target.value)}
              placeholder="مثال: 100 أو -50"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {QUICK_GRANTS.map((grant) => (
                <button
                  key={grant}
                  type="button"
                  onClick={() => setAdjustAmount(String(grant))}
                  className="rounded-full border border-gold-4/25 px-3 py-1 text-xs text-dim hover:border-gold-2/40 hover:text-gold-1"
                >
                  +{grant}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>ملاحظة</Label>
            <Input value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} />
          </div>
          <Button type="submit" loading={loading}>
            تطبيق
          </Button>
        </form>
      </CircuitCard>

      {pendingTopUps.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg text-warm-white">طلبات شحن معلّقة ({pendingTopUps.length})</h2>
          {pendingTopUps.map((t) => (
            <CircuitCard key={t.id} className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-warm-white">{t.agency.name}</p>
                <p className="text-xs text-dim">{t.agency.email}</p>
                <p className="mt-1 font-mono text-sm text-gold-1">
                  {formatNumber(t.amount)} Spark · {t.bankReference}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" loading={loading} onClick={() => handleApproveTopUp(t.id)}>
                  قبول
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  loading={loading}
                  onClick={() => handleRejectTopUp(t.id)}
                >
                  رفض
                </Button>
              </div>
            </CircuitCard>
          ))}
        </div>
      )}

      <AdminDataTable
        data={agencies}
        rowKey={(r) => r.id}
        searchPlaceholder="بحث بالاسم أو البريد..."
        searchFilter={(row, q) =>
          `${row.name} ${row.email}`.toLowerCase().includes(q)
        }
        columns={[
          {
            key: "name",
            header: "الاسم",
            sortValue: (r) => r.name,
            render: (r) => <span className="font-medium text-warm-white">{r.name}</span>,
          },
          {
            key: "email",
            header: "البريد",
            sortValue: (r) => r.email,
            render: (r) => <span className="font-mono text-xs text-dim">{r.email}</span>,
          },
          {
            key: "wallet",
            header: "المحفظة",
            sortValue: (r) => r.walletBalance,
            render: (r) => (
              <span className="font-mono text-gold-1">{formatNumber(r.walletBalance)}</span>
            ),
          },
          {
            key: "members",
            header: "الأعضاء",
            sortValue: (r) => r.memberCount,
            render: (r) => <span className="text-dim">{r.memberCount}</span>,
          },
        ]}
      />

      {toast && (
        <AdminToast message={toast.msg} variant={toast.variant} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}
