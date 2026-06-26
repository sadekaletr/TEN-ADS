"use client";

import { useEffect, useState } from "react";
import type { CampaignRecommendation } from "@/lib/intelligence/recommendations";

export function SparkRecommendation({
  creatorId,
}: {
  creatorId: string;
}) {
  const [rec, setRec] = useState<CampaignRecommendation | null>(null);

  useEffect(() => {
    fetch(`/api/recommendations/${creatorId}`)
      .then((r) => r.json())
      .then((d) => setRec(d.recommendation))
      .catch(() => {});
  }, [creatorId]);

  if (!rec) return null;

  return (
    <div className="rounded border border-gold-2/30 bg-gold-2/5 p-4 text-sm">
      <p className="font-medium text-gold-1">اقتراح Spark</p>
      <p className="mt-1 text-dim">{rec.rationale}</p>
      <ul className="mt-3 space-y-1 font-mono text-xs text-warm-white">
        <li>الجوائز: {rec.prizeQuantity}</li>
        <li>التكلفة/استرداد: {rec.costPerRedemption} سبارك</li>
        {rec.city && <li>المدينة: {rec.city}</li>}
        {rec.suggestedHour !== null && (
          <li>أفضل ساعة إطلاق: {rec.suggestedHour}:00</li>
        )}
      </ul>
    </div>
  );
}
