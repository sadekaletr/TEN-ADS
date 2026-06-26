"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SyriaHeatmapMap } from "@/components/intelligence/SyriaHeatmapMap";
import { LiveScarcityBar } from "@/components/campaign/LiveScarcityBar";
import { Button } from "@/components/ui/Button";
import type { NearbyCampaign } from "@/lib/discover/get-nearby-campaigns";
import type { HeatmapCell } from "@/lib/intelligence/heatmap";

interface NearbyDiscoveryMapProps {
  campaigns: NearbyCampaign[];
  governorates: string[];
  initialGovernorate?: string;
}

export function NearbyDiscoveryMap({
  campaigns,
  governorates,
  initialGovernorate,
}: NearbyDiscoveryMapProps) {
  const [selected, setSelected] = useState(initialGovernorate ?? "");

  const heatmapData: HeatmapCell[] = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of campaigns) {
      counts.set(c.governorate, (counts.get(c.governorate) ?? 0) + 1);
    }
    const max = Math.max(1, ...Array.from(counts.values()));
    return governorates.map((gov) => {
      const count = counts.get(gov) ?? 0;
      return { governorate: gov, count, intensity: count / max };
    });
  }, [campaigns, governorates]);

  const filtered = selected
    ? campaigns.filter((c) => c.governorate === selected)
    : campaigns;

  function detectLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      () => setSelected("دمشق"),
      () => setSelected("دمشق")
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="min-h-11 rounded-lg border border-gold-4/20 bg-surface-2 px-3 text-sm text-warm-white"
        >
          <option value="">كل المحافظات</option>
          {governorates.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <Button variant="secondary" type="button" onClick={detectLocation}>
          موقعي
        </Button>
      </div>

      <SyriaHeatmapMap data={heatmapData} />

      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {filtered.map((c) => (
          <Link
            key={c.id}
            href={c.slug ? `/campaign/${c.slug}` : c.primaryCode ? `/c/${c.primaryCode}` : "#"}
            className="min-w-[260px] snap-start rounded-xl border border-gold-4/20 bg-surface-2/60 p-4 transition hover:border-gold-4/40"
          >
            <div className="flex items-center gap-3">
              {c.sponsor.logoUrl ? (
                <Image
                  src={c.sponsor.logoUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-full"
                  unoptimized
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gold-4/20" />
              )}
              <div>
                <p className="text-sm font-medium text-warm-white">{c.sponsor.name}</p>
                <p className="text-xs text-dim">{c.governorate}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-gold-1">{c.prizeName}</p>
            <LiveScarcityBar
              campaignId={c.id}
              initialClaimed={c.prizeClaimed}
              initialQuantity={c.prizeQuantity}
              className="mt-3"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
