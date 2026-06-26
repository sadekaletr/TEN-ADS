"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { CampaignTemplate } from "@/lib/network/recommendations";

export function BestTemplateCard({
  creatorId,
  onApply,
  initialTemplate,
}: {
  creatorId: string;
  onApply?: (t: CampaignTemplate) => void;
  initialTemplate?: CampaignTemplate | null;
}) {
  const [template, setTemplate] = useState<CampaignTemplate | null>(
    initialTemplate ?? null
  );
  const [loaded, setLoaded] = useState(initialTemplate !== undefined);

  useEffect(() => {
    if (initialTemplate !== undefined) return;
    fetch(`/api/network/template?creatorId=${creatorId}`)
      .then((r) => r.json())
      .then((d) => setTemplate(d.template ?? null))
      .catch(() => setTemplate(null))
      .finally(() => setLoaded(true));
  }, [creatorId, initialTemplate]);

  if (!loaded) return null;

  if (!template) {
    return (
      <GlassCard>
        <EmptyState
          title="لا يوجد قالب جاهز"
          description="أنشئ حملتك الأولى لاقتراح قالب لاحقاً."
        />
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <h3 className="mb-2 text-sm text-gold-1">أفضل قالب من حملاتك</h3>
      <p className="text-text-primary">{template.prizeName}</p>
      <p className="text-xs text-text-secondary">
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
