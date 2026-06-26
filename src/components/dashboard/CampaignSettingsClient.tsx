"use client";

import { useState } from "react";
import { updateCampaignStatus } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import type { CampaignStatus } from "@prisma/client";

interface CampaignSettingsClientProps {
  campaignId: string;
  status: CampaignStatus;
  prizeQuantity: number;
  prizeClaimed: number;
}

export function CampaignSettingsClient({
  campaignId,
  status,
  prizeQuantity,
  prizeClaimed,
}: CampaignSettingsClientProps) {
  const [qty, setQty] = useState(prizeQuantity);
  const [loading, setLoading] = useState(false);

  async function togglePause() {
    setLoading(true);
    await updateCampaignStatus(
      campaignId,
      status === "ACTIVE" ? "PAUSED" : "ACTIVE"
    );
    setLoading(false);
  }

  async function saveQty(e: React.FormEvent) {
    e.preventDefault();
    if (status !== "ACTIVE" && status !== "PAUSED" && status !== "ENDED") return;
    setLoading(true);
    await updateCampaignStatus(campaignId, status, qty);
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-dim">
        الحالة الحالية: <span className="text-gold-1">{status}</span> — {prizeClaimed}/
        {prizeQuantity} مستلم
      </p>
      <Button
        variant="secondary"
        loading={loading}
        onClick={togglePause}
        disabled={status === "ENDED" || status === "DRAFT"}
      >
        {status === "ACTIVE" ? "إيقاف مؤقت" : "استئناف الحملة"}
      </Button>
      <form onSubmit={saveQty} className="space-y-3 border-t border-gold-4/20 pt-4">
        <Label htmlFor="qty">كمية الجوائز</Label>
        <Input
          id="qty"
          type="number"
          min={prizeClaimed}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
        />
        <Button type="submit" size="sm" loading={loading}>
          حفظ الكمية
        </Button>
      </form>
    </div>
  );
}
