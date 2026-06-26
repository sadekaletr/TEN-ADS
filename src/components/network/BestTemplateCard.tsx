"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { CampaignTemplate } from "@/lib/network/recommendations";

export function BestTemplateCard({
  creatorId,
  onApply,
}: {
  creatorId: string;
  onApply?: (t: CampaignTemplate) => void;
}) {
  const [template, setTemplate] = useState<CampaignTemplate | null>(null);

  useEffect(() => {
    fetch(`/api/network/template?creatorId=${creatorId}`)
      .then((r) => r.json())
      .then((d) => setTemplate(d.template ?? null))
      .catch(() => {});
  }, [creatorId]);

  if (!template) return null;

  return (
    <GlassCard>
      <h3 className="mb-2 text-sm text-gold-1">أفضل قالب من حملاتك</h3>
      <p className="text-warm-white">{template.prizeName}</p>
      <p className="text-xs text-dim">
        {template.prizeQuantity} جائزة · {template.city ?? "كل المدن"}
      </p>
      {onApply && (
        <Button size="sm" variant="secondary" className="mt-3" onClick={() => onApply(template)}>
          استخدام القالب
        </Button>
      )}
    </GlassCard>
  );
}
