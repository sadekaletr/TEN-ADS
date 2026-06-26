"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState } from "@/components/ui/EmptyState";

type Sponsor = { id: string; name: string; logoUrl: string | null; city: string | null };

export function RecommendedSponsorsCard({
  creatorId,
  initialSponsors,
}: {
  creatorId: string;
  initialSponsors?: Sponsor[];
}) {
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors ?? []);
  const [loaded, setLoaded] = useState(initialSponsors !== undefined);

  useEffect(() => {
    if (initialSponsors !== undefined) return;
    fetch(`/api/network/sponsors?creatorId=${creatorId}`)
      .then((r) => r.json())
      .then((d) => setSponsors(d.sponsors ?? []))
      .catch(() => setSponsors([]))
      .finally(() => setLoaded(true));
  }, [creatorId, initialSponsors]);

  if (!loaded) return null;

  if (sponsors.length === 0) {
    return (
      <GlassCard>
        <EmptyState
          title="لا يوجد رعاة مقترحون"
          description="ستظهر اقتراحات الرعاة عند توفر بيانات كافية."
        />
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <h3 className="mb-3 text-sm text-gold-1">رعاة مقترحون</h3>
      <ul className="space-y-2 text-sm">
        {sponsors.map((s) => (
          <li key={s.id} className="flex justify-between gap-2 text-text-secondary">
            <span className="text-text-primary">{s.name}</span>
            <span>{s.city ?? "—"}</span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
