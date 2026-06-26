"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adjustWallet } from "@/app/admin/actions";
import { AdminToast } from "@/components/admin/AdminToast";
import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { formatNumber } from "@/lib/format";

type CreatorOption = { id: string; name: string; handle: string };

const QUICK_GRANTS = [10, 25, 50, 100];

export function AdminWalletAdjust({
  creators,
  treasuryBalance,
}: {
  creators: CreatorOption[];
  treasuryBalance: number;
}) {
  const router = useRouter();
  const [creatorId, setCreatorId] = useState(creators[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "error" } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(amount);
    if (!creatorId || !note.trim() || Number.isNaN(num) || num === 0) {
      setToast({ msg: "أدخل صانعاً ومبلغاً وملاحظة", variant: "error" });
      return;
    }
    setLoading(true);
    try {
      await adjustWallet(creatorId, num, note.trim());
      setToast({ msg: "تم تعديل المحفظة", variant: "success" });
      setAmount("");
      setNote("");
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

  return (
    <CircuitCard className="space-y-4">
      <h2 className="font-semibold text-gold-1">منح Spark لصانع</h2>
      <p className="text-sm text-dim">
        متاح في الخزينة:{" "}
        <span className="font-mono text-gold-1">{formatNumber(treasuryBalance)}</span> Spark
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>الصانع</Label>
          <Select value={creatorId} onChange={(e) => setCreatorId(e.target.value)}>
            {creators.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.handle})
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>المبلغ (+/-)</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="مثال: 50 أو -20"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {QUICK_GRANTS.map((grant) => (
              <button
                key={grant}
                type="button"
                onClick={() => setAmount(String(grant))}
                className="rounded-full border border-gold-4/25 px-3 py-1 text-xs text-dim hover:border-gold-2/40 hover:text-gold-1"
              >
                +{grant}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>ملاحظة</Label>
          <Input value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <Button type="submit" loading={loading}>
          تطبيق
        </Button>
      </form>
      {toast && (
        <AdminToast message={toast.msg} variant={toast.variant} onDismiss={() => setToast(null)} />
      )}
    </CircuitCard>
  );
}
