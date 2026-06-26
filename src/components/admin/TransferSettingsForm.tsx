"use client";

import { useState } from "react";
import { updateTransferSettings } from "@/app/admin/settings/transfer/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { GlassCard } from "@/components/ui/GlassCard";
import type { TransferSettings } from "@/lib/platform-settings";

export function TransferSettingsForm({ initial }: { initial: TransferSettings }) {
  const [method, setMethod] = useState(initial.transferMethod);
  const [account, setAccount] = useState(initial.transferAccount);
  const [instructions, setInstructions] = useState(initial.transferInstructions ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await updateTransferSettings({
      transferMethod: method,
      transferAccount: account,
      transferInstructions: instructions,
    });
    setSaved(true);
    setLoading(false);
  }

  return (
    <GlassCard>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="method">طريقة التحويل</Label>
          <Input id="method" value={method} onChange={(e) => setMethod(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="account">رقم الحساب</Label>
          <Input
            id="account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="font-mono"
            required
          />
        </div>
        <div>
          <Label htmlFor="instructions">تعليمات التحويل</Label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={4}
          />
        </div>
        <Button type="submit" loading={loading}>
          حفظ الإعدادات
        </Button>
        {saved && <p className="text-sm text-gold-2">تم الحفظ.</p>}
      </form>
    </GlassCard>
  );
}
