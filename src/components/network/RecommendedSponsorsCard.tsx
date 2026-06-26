"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { CampaignTemplate } from "@/lib/network/recommendations";

type Sponsor = { id: string; name: string; logoUrl: string | null; city: string | null };

export function RecommendedSponsorsCard({ creatorId }: { creatorId: string }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    fetch(`/api/network/sponsors?creatorId=${creatorId}`)
      .then((r) => r.json())
      .then((d) => setSponsors(d.sponsors ?? []))
      .catch(() => {});
  }, [creatorId]);

  if (sponsors.length === 0) return null;

  return (
    <GlassCard>
      <h3 className="mb-3 text-sm text-gold-1">رعاة مقترحون</h3>
      <ul className="space-y-2 text-sm">
        {sponsors.map((s) => (
          <li key={s.id} className="flex justify-between gap-2 text-dim">
            <span className="text-warm-white">{s.name}</span>
            <span>{s.city ?? "—"}</span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
