"use client";

import { useState } from "react";
import { updateTransferSettings } from "@/app/admin/settings/transfer/actions";
import { AdminToast } from "@/components/admin/AdminToast";
import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import type { TransferSettings } from "@/lib/platform-settings";

export function AdminShamCashPanel({ initial }: { initial: TransferSettings }) {
  const [method, setMethod] = useState(initial.transferMethod);
  const [account, setAccount] = useState(initial.transferAccount);
  const [instructions, setInstructions] = useState(initial.transferInstructions ?? "");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; variant: "success" | "error" } | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateTransferSettings({
        transferMethod: method.trim() || "ShamCash",
        transferAccount: account.trim(),
        transferInstructions: instructions.trim(),
      });
      setToast({ msg: "تم حفظ إعدادات ShamCash", variant: "success" });
    } catch {
      setToast({ msg: "فشل الحفظ", variant: "error" });
    }
    setLoading(false);
  }

  return (
    <CircuitCard className="space-y-4">
      <div>
        <h2 className="font-semibold text-gold-1">دفع ShamCash</h2>
        <p className="mt-1 text-sm text-dim">
          يظهر للصناع عند الشحن — حساب التحويل والتعليمات التي يراها الجميع.
        </p>
      </div>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <Label>طريقة الدفع</Label>
          <Input value={method} onChange={(e) => setMethod(e.target.value)} />
        </div>
        <div>
          <Label>رقم حساب ShamCash</Label>
          <Input value={account} onChange={(e) => setAccount(e.target.value)} dir="ltr" />
        </div>
        <div>
          <Label>تعليمات التحويل</Label>
          <Textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
            placeholder="حوّل المبلغ ثم ارفع صورة الإثبات..."
          />
        </div>
        <Button type="submit" loading={loading}>
          حفظ ShamCash
        </Button>
      </form>
      {toast && (
        <AdminToast message={toast.msg} variant={toast.variant} onDismiss={() => setToast(null)} />
      )}
    </CircuitCard>
  );
}
