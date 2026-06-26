"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  resetAllCreatorWalletBalances,
  setSparkTreasuryBalance,
} from "@/app/admin/actions";
import { AdminToast } from "@/components/admin/AdminToast";
import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { formatNumber } from "@/lib/format";
import type { SparkTreasurySnapshot, TreasuryLedgerEntry } from "@/lib/spark-treasury";

type AdminSparkTreasuryPanelProps = {
  treasury: SparkTreasurySnapshot;
  ledger?: TreasuryLedgerEntry[];
};

export function AdminSparkTreasuryPanel({ treasury, ledger = [] }: AdminSparkTreasuryPanelProps) {
  const router = useRouter();
  const [balanceInput, setBalanceInput] = useState(treasury.treasuryBalance.toString());
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "error" } | null>(null);

  async function handleSetBalance(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(balanceInput);
    if (!Number.isFinite(value) || value < 0) {
      setToast({ msg: "أدخل رقماً صحيحاً", variant: "error" });
      return;
    }
    setLoading(true);
    try {
      await setSparkTreasuryBalance(value);
      setToast({ msg: "تم تحديث خزينة المشروع", variant: "success" });
      router.refresh();
    } catch {
      setToast({ msg: "فشل التحديث", variant: "error" });
    }
    setLoading(false);
  }

  async function handleResetAll() {
    if (
      !window.confirm(
        "تصفير جميع أرصدة الصناع؟ سيُعاد الرصيد الموزّع إلى الخزينة المركزية."
      )
    ) {
      return;
    }
    setResetting(true);
    try {
      await resetAllCreatorWalletBalances();
      setToast({ msg: "تم تصفير أرصدة الصناع", variant: "success" });
      router.refresh();
    } catch {
      setToast({ msg: "فشل التصفير", variant: "error" });
    }
    setResetting(false);
  }

  return (
    <CircuitCard className="space-y-4">
      <div>
        <h2 className="font-semibold text-gold-1">خزينة Spark للمشروع</h2>
        <p className="mt-1 text-sm text-dim">
          حدّد الرصيد الكلي المتاح للتوزيع. كل منح أو موافقة شحن يُخصم من الخزينة.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gold-4/20 bg-void/40 p-4">
          <p className="text-xs text-dim">متاح للتوزيع</p>
          <p className="mt-1 font-mono text-2xl text-gold-1">
            {formatNumber(treasury.treasuryBalance)}
          </p>
        </div>
        <div className="rounded-xl border border-gold-4/20 bg-void/40 p-4">
          <p className="text-xs text-dim">موزّع على الصناع</p>
          <p className="mt-1 font-mono text-2xl text-warm-white">
            {formatNumber(treasury.distributedBalance)}
          </p>
        </div>
        <div className="rounded-xl border border-gold-4/20 bg-void/40 p-4">
          <p className="text-xs text-dim">محافظ الوكالات</p>
          <p className="mt-1 font-mono text-2xl text-warm-white">
            {formatNumber(treasury.agencyBalance)}
          </p>
        </div>
        <div className="rounded-xl border border-gold-4/20 bg-void/40 p-4">
          <p className="text-xs text-dim">إجمالي الميزانية</p>
          <p className="mt-1 font-mono text-2xl text-gold-2">
            {formatNumber(treasury.totalBudget)}
          </p>
        </div>
      </div>

      {ledger.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gold-4/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-4/20 text-dim">
                <th className="px-3 py-2 text-start">التاريخ</th>
                <th className="px-3 py-2 text-start">المبلغ</th>
                <th className="px-3 py-2 text-start">السبب</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((row) => (
                <tr key={row.id} className="border-b border-gold-4/10">
                  <td className="px-3 py-2 text-dim">
                    {new Date(row.createdAt).toLocaleString("ar-SY")}
                  </td>
                  <td
                    className={`px-3 py-2 font-mono ${row.amount >= 0 ? "text-gold-2" : "text-red-400"}`}
                  >
                    {row.amount >= 0 ? "+" : ""}
                    {formatNumber(row.amount)}
                  </td>
                  <td className="px-3 py-2">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={handleSetBalance} className="flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1">
          <Label>تعيين رصيد الخزينة</Label>
          <Input
            type="number"
            min={0}
            value={balanceInput}
            onChange={(e) => setBalanceInput(e.target.value)}
            className="font-mono"
          />
        </div>
        <Button type="submit" loading={loading}>
          حفظ الرصيد
        </Button>
      </form>

      <Button
        type="button"
        variant="secondary"
        loading={resetting}
        onClick={handleResetAll}
      >
        تصفير أرصدة جميع الصناع
      </Button>

      {toast && (
        <AdminToast message={toast.msg} variant={toast.variant} onDismiss={() => setToast(null)} />
      )}
    </CircuitCard>
  );
}
