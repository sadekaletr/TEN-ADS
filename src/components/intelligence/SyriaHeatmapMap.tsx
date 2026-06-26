"use client";

import type { HeatmapCell } from "@/lib/intelligence/heatmap";
import {
  SYRIA_MAP_REGIONS,
  SYRIA_MAP_VIEWBOX,
} from "@/components/intelligence/syria-map-data";

interface SyriaHeatmapMapProps {
  data: HeatmapCell[];
}

function cellFor(
  governorate: string,
  data: HeatmapCell[]
): HeatmapCell | undefined {
  return data.find((c) => c.governorate === governorate);
}

export function SyriaHeatmapMap({ data }: SyriaHeatmapMapProps) {
  return (
    <div className="relative">
      <svg
        viewBox={SYRIA_MAP_VIEWBOX}
        className="w-full max-h-[360px]"
        role="img"
        aria-label="خريطة حرارية لاستردادات سوريا"
      >
        {SYRIA_MAP_REGIONS.map((region) => {
          const cell = cellFor(region.governorate, data);
          const intensity = cell?.intensity ?? 0;
          const count = cell?.count ?? 0;
          const isHot = count > 0;
          const fill = isHot
            ? `rgba(212, 168, 85, ${0.15 + intensity * 0.55})`
            : "rgba(74, 68, 56, 0.55)";
          const stroke = isHot
            ? `rgba(240, 201, 122, ${0.35 + intensity * 0.45})`
            : "rgba(74, 68, 56, 0.8)";

          return (
            <g key={region.governorate}>
              <path
                d={region.path}
                fill={fill}
                stroke={stroke}
                strokeWidth={1}
                className="transition-colors duration-300"
              />
              {isHot && (
                <circle
                  cx={region.centroid[0]}
                  cy={region.centroid[1]}
                  r={4 + intensity * 8}
                  fill="var(--gold-1)"
                  className="animate-junction-pulse origin-center"
                  style={{
                    transformOrigin: `${region.centroid[0]}px ${region.centroid[1]}px`,
                    opacity: 0.5 + intensity * 0.5,
                  }}
                />
              )}
              <title>
                {region.governorate}: {count} استرداد
              </title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
