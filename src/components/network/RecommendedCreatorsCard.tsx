"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

type Creator = {
  id: string;
  name: string;
  handle: string;
  trustScore: number | null;
};

export function RecommendedCreatorsCard({ sponsorId }: { sponsorId: string }) {
  const [creators, setCreators] = useState<Creator[]>([]);

  useEffect(() => {
    fetch(`/api/network/creators?sponsorId=${sponsorId}`)
      .then((r) => r.json())
      .then((d) => setCreators(d.creators ?? []))
      .catch(() => {});
  }, [sponsorId]);

  if (creators.length === 0) return null;

  return (
    <GlassCard>
      <h3 className="mb-3 text-sm text-gold-1">صناع مقترحون</h3>
      <ul className="space-y-2 text-sm">
        {creators.map((c) => (
          <li key={c.id}>
            <Link href={`/creator/${c.handle.replace(/^@/, "")}`} className="text-gold-2 hover:underline">
              {c.name} (@{c.handle.replace(/^@/, "")})
            </Link>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
