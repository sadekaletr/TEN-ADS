"use client";

import { useState } from "react";
import { updatePlatformSettings } from "@/app/admin/actions";
import { updateTransferSettings } from "@/app/admin/settings/transfer/actions";
import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import type { TransferSettings } from "@/lib/platform-settings";

export function AdminSettingsClient({
  transfer,
  sparkUnit,
  maxPrizeQuantity,
}: {
  transfer: TransferSettings;
  sparkUnit: number | null;
  maxPrizeQuantity: number | null;
}) {
  const [method, setMethod] = useState(transfer.transferMethod);
  const [account, setAccount] = useState(transfer.transferAccount);
  const [instructions, setInstructions] = useState(transfer.transferInstructions ?? "");
  const [unit, setUnit] = useState(sparkUnit?.toString() ?? "");
  const [maxPrize, setMaxPrize] = useState(maxPrizeQuantity?.toString() ?? "");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await updateTransferSettings({ transferMethod: method, transferAccount: account, transferInstructions: instructions });
    await updatePlatformSettings({
      sparkUnit: unit ? Number(unit) : null,
      maxPrizeQuantity: maxPrize ? Number(maxPrize) : null,
    });
    setSaved(true);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-warm-white">إعدادات المنصة</h1>
      <form onSubmit={handleSave} className="space-y-6">
        <CircuitCard className="space-y-4">
          <h2 className="text-gold-1">ShamCash / التحويل</h2>
          <div>
            <Label>طريقة التحويل</Label>
            <Input value={method} onChange={(e) => setMethod(e.target.value)} className="min-h-11" />
          </div>
          <div>
            <Label>رقم الحساب</Label>
            <Input value={account} onChange={(e) => setAccount(e.target.value)} className="min-h-11" />
          </div>
          <div>
            <Label>تعليمات التحويل</Label>
            <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={4} />
          </div>
        </CircuitCard>
        <CircuitCard className="space-y-4">
          <h2 className="text-gold-1">سعر الصرف والحدود</h2>
          <div>
            <Label>Spark = كم ل.س؟</Label>
            <Input
              type="number"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="50000"
              className="min-h-11 font-mono"
            />
          </div>
          <div>
            <Label>الحد الأقصى لكمية الجوائز (اختياري)</Label>
            <Input
              type="number"
              value={maxPrize}
              onChange={(e) => setMaxPrize(e.target.value)}
              className="min-h-11 font-mono"
            />
          </div>
        </CircuitCard>
        <Button type="submit" loading={loading} className="min-h-11">
          حفظ الإعدادات
        </Button>
        {saved && <p className="text-sm text-gold-2">تم الحفظ.</p>}
      </form>
    </div>
  );
}
