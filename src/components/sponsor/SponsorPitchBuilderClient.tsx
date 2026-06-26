"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { n } from "@/lib/format";

type CampaignOption = {
  id: string;
  title: string;
  prizeClaimed: number;
  prizeQuantity: number;
  sponsor: { name: string };
};

export function SponsorPitchBuilderClient({
  campaigns,
}: {
  campaigns: CampaignOption[];
}) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }

  const exportHref =
    selected.length > 0
      ? `/api/export/pdf?type=pitch&ids=${selected.join(",")}`
      : "#";

  return (
    <div className="space-y-6">
      <PageHeader
        title="بناء عرض ROI"
        description="اختر 3–4 حملات لتصدير عرض PDF للرعاة"
      />
      <GlassCard className="space-y-4">
        {campaigns.map((c) => (
          <label
            key={c.id}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-gold-4/15 p-3 hover:border-gold-4/30"
          >
            <input
              type="checkbox"
              checked={selected.includes(c.id)}
              onChange={() => toggle(c.id)}
              className="h-4 w-4"
            />
            <div className="flex-1">
              <p className="font-medium text-warm-white">{c.title}</p>
              <p className="text-xs text-dim">
                {c.sponsor.name} — {n(c.prizeClaimed)}/{n(c.prizeQuantity)} استرداد
              </p>
            </div>
          </label>
        ))}
        <Button href={exportHref} disabled={selected.length === 0}>
          تصدير PDF
        </Button>
      </GlassCard>
    </div>
  );
}
