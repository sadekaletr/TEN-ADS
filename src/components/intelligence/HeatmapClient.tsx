"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { HeatmapCell } from "@/lib/intelligence/heatmap";
import { CountUpStat } from "@/components/intelligence/CountUpStat";
import { SyriaHeatmapMap } from "@/components/intelligence/SyriaHeatmapMap";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

const DAY_OPTIONS = [
  { value: "7", label: "7 أيام" },
  { value: "30", label: "30 يوماً" },
];

const SECTOR_OPTIONS = [
  { value: "", label: "الكل" },
  { value: "food", label: "مطاعم" },
  { value: "fashion", label: "أزياء" },
  { value: "tech", label: "تقنية" },
];

export function HeatmapClient({
  data,
  days,
  sector,
}: {
  data: HeatmapCell[];
  days: number;
  sector?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalCount = data.reduce((s, c) => s + c.count, 0);

  function pushFilters(nextDays: string, nextSector: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("days", nextDays);
    if (nextSector) params.set("sector", nextSector);
    else params.delete("sector");
    router.push(`/intelligence/heatmap?${params.toString()}`);
  }

  return (
    <div className="mt-8">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <SegmentedControl
          options={DAY_OPTIONS}
          value={String(days)}
          onChange={(v) => pushFilters(v, sector ?? "")}
        />
        <SegmentedControl
          options={SECTOR_OPTIONS}
          value={sector ?? ""}
          onChange={(v) => pushFilters(String(days), v)}
          size="sm"
        />
      </div>

      <div className="relative rounded-xl border border-gold-4/20 bg-surface-elevated p-4">
        <div className="absolute left-4 top-4 z-10 rounded-lg border border-gold-4/25 bg-void/80 px-4 py-2 backdrop-blur-sm">
          <CountUpStat
            value={totalCount}
            label="إجمالي الاستردادات المرصودة"
          />
        </div>
        <SyriaHeatmapMap data={data} />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {data.map((cell) => (
          <div
            key={cell.governorate}
            className="flex items-center justify-between rounded-lg border border-gold-4/15 px-3 py-2"
            style={{
              opacity: cell.count > 0 ? 1 : 0.55,
              backgroundColor:
                cell.count > 0
                  ? `rgba(212, 168, 85, ${0.05 + cell.intensity * 0.12})`
                  : "rgba(74, 68, 56, 0.15)",
            }}
          >
            <span className="text-sm text-warm-white">{cell.governorate}</span>
            <span className="font-mono text-sm text-gold-1">{cell.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
