"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SparkIcon } from "@/components/ui/SparkIcon";
import { formatNumber } from "@/lib/format";
import type { CampaignRecommendation } from "@/lib/intelligence/recommendations";

export function SparkRecommendation({
  creatorId,
  initialRecommendation,
}: {
  creatorId: string;
  initialRecommendation?: CampaignRecommendation | null;
}) {
  const [rec, setRec] = useState<CampaignRecommendation | null>(
    initialRecommendation ?? null
  );
  const [loading, setLoading] = useState(initialRecommendation === undefined);

  useEffect(() => {
    if (initialRecommendation !== undefined) return;
    setLoading(true);
    fetch(`/api/recommendations/${creatorId}`)
      .then((r) => r.json())
      .then((d) => setRec(d.recommendation))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [creatorId, initialRecommendation]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3 rounded-xl border border-strong bg-bg-elevated/50 p-4">
        <div className="h-4 w-32 rounded bg-bg-elevated" />
        <div className="h-3 w-full rounded bg-bg-elevated/80" />
        <div className="h-3 w-2/3 rounded bg-bg-elevated/80" />
      </div>
    );
  }

  if (!rec) {
    return (
      <div className="rounded-xl border border-dashed border-strong bg-bg-elevated/40 px-4 py-6 text-center">
        <Icon name="spark" size={28} className="mx-auto text-gold-3" />
        <p className="mt-2 text-sm font-medium text-text-primary">لا اقتراح بعد</p>
        <p className="mt-1 text-xs text-text-secondary">
          أطلق حملة لتحصل على توصيات Spark مخصّصة
        </p>
        <Button href="/dashboard/campaigns/new" size="sm" variant="secondary" className="mt-4 min-h-10">
          حملة جديدة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-gold-2/30 bg-gradient-to-b from-gold-rich/10 to-bg-elevated/40 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-2/40 bg-gold-rich/15">
          <SparkIcon size={20} />
        </span>
        <div>
          <p className="font-semibold text-gold-accent">اقتراح Spark</p>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">{rec.rationale}</p>
        </div>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        <li className="rounded-lg border border-strong/60 bg-bg-base/50 px-3 py-2 text-xs">
          <span className="text-text-tertiary">الجوائز</span>
          <p className="font-mono font-semibold tabular-nums text-text-primary">
            {formatNumber(rec.prizeQuantity)}
          </p>
        </li>
        <li className="rounded-lg border border-strong/60 bg-bg-base/50 px-3 py-2 text-xs">
          <span className="text-text-tertiary">التكلفة/استرداد</span>
          <p className="font-mono font-semibold tabular-nums text-gold-accent">
            {formatNumber(rec.costPerRedemption)} Spark
          </p>
        </li>
        {rec.city && (
          <li className="rounded-lg border border-strong/60 bg-bg-base/50 px-3 py-2 text-xs">
            <span className="text-text-tertiary">المدينة</span>
            <p className="font-medium text-text-primary">{rec.city}</p>
          </li>
        )}
        {rec.suggestedHour !== null && (
          <li className="rounded-lg border border-strong/60 bg-bg-base/50 px-3 py-2 text-xs">
            <span className="text-text-tertiary">أفضل ساعة إطلاق</span>
            <p className="font-mono tabular-nums text-text-primary">{rec.suggestedHour}:00</p>
          </li>
        )}
      </ul>
      <Button
        href="/dashboard/campaigns/new"
        size="sm"
        variant="primary"
        glow
        className="min-h-10 w-full sm:w-auto"
        icon={<Icon name="rocket" size={16} />}
      >
        تطبيق الاقتراح
      </Button>
    </div>
  );
}
