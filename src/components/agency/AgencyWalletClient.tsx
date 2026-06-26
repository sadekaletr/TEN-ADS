"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { requestAgencyTopUp } from "@/app/agency/actions";
import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { Tabs } from "@/components/ui/Tabs";
import { formatNumber } from "@/lib/format";
import { TOP_UP_PACKAGES } from "@/lib/wallet/top-up-packages";

type Tab = "transactions" | "topups";

type AgencyWalletTx = {
  id: string;
  type: string;
  amount: number;
  note: string | null;
  createdAt: Date;
};

type AgencyTopUpRow = {
  id: string;
  amount: number;
  bankReference: string;
  status: string;
  createdAt: Date;
};

interface AgencyWalletClientProps {
  balance: number;
  transactions: AgencyWalletTx[];
  topUpRequests: AgencyTopUpRow[];
  transferMethod: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "معلّق",
  APPROVED: "مقبول",
  REJECTED: "مرفوض",
};

export function AgencyWalletClient({
  balance,
  transactions,
  topUpRequests,
  transferMethod,
}: AgencyWalletClientProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("transactions");
  const [amount, setAmount] = useState<number>(TOP_UP_PACKAGES[1]);
  const [bankReference, setBankReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleTopUp(e: React.FormEvent) {
    e.preventDefault();
    if (!bankReference.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await requestAgencyTopUp(amount, bankReference.trim(), { transferMethod });
      setBankReference("");
      setSuccess(true);
      router.refresh();
    } catch {
      setError("فشل إرسال طلب الشحن — تحقق من المبلغ والمرجع");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="محفظة الوكالة" description="رصيد السبارك وطلبات الشحن" />

      <CircuitCard className="text-center">
        <p className="text-sm text-dim">الرصيد الحالي</p>
        <p className="mt-1 font-mono text-3xl text-gold-1">{formatNumber(balance)}</p>
        <p className="text-xs text-dim">سبارك</p>
      </CircuitCard>

      <CircuitCard className="space-y-4">
        <h2 className="font-semibold text-gold-1">طلب شحن</h2>
        <p className="text-sm text-dim">
          طريقة التحويل: <span className="text-warm-white">{transferMethod}</span>
        </p>
        <form onSubmit={handleTopUp} className="space-y-4">
          <div>
            <Label>المبلغ (سبارك)</Label>
            <Select
              value={String(amount)}
              onChange={(e) => setAmount(Number(e.target.value))}
            >
              {TOP_UP_PACKAGES.map((p) => (
                <option key={p} value={p}>
                  {p} سبارك
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>مرجع التحويل البنكي</Label>
            <Input
              value={bankReference}
              onChange={(e) => setBankReference(e.target.value)}
              placeholder="رقم العملية أو المرجع"
              required
            />
          </div>
          <Button type="submit" loading={loading}>
            إرسال الطلب
          </Button>
          {success && (
            <p className="text-sm text-success">تم إرسال الطلب — بانتظار موافقة الإدارة</p>
          )}
          {error && <p className="text-sm text-danger">{error}</p>}
        </form>
      </CircuitCard>

      <Tabs
        tabs={[
          { id: "transactions" as const, label: "المعاملات" },
          { id: "topups" as const, label: "طلبات الشحن" },
        ]}
        active={tab}
        onChange={setTab}
      />

      <CircuitCard>
        {tab === "transactions" ? (
          transactions.length === 0 ? (
            <p className="text-sm text-dim">لا توجد معاملات بعد</p>
          ) : (
            <ul className="divide-y divide-gold-4/15">
              {transactions.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm text-warm-white">{tx.type}</p>
                    {tx.note && <p className="text-xs text-dim">{tx.note}</p>}
                    <p className="text-xs text-dim">
                      {new Date(tx.createdAt).toLocaleDateString("ar-SY")}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-sm ${tx.amount >= 0 ? "text-success" : "text-danger"}`}
                  >
                    {tx.amount >= 0 ? "+" : ""}
                    {formatNumber(tx.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )
        ) : topUpRequests.length === 0 ? (
          <p className="text-sm text-dim">لا توجد طلبات شحن</p>
        ) : (
          <ul className="divide-y divide-gold-4/15">
            {topUpRequests.map((req) => (
              <li key={req.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-mono text-sm text-warm-white">
                    {formatNumber(req.amount)} سبارك
                  </p>
                  <p className="text-xs text-dim">{req.bankReference}</p>
                  <p className="text-xs text-dim">
                    {new Date(req.createdAt).toLocaleDateString("ar-SY")}
                  </p>
                </div>
                <span className="text-xs text-gold-2">
                  {STATUS_LABELS[req.status] ?? req.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CircuitCard>
    </div>
  );
}
