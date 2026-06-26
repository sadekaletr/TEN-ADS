import { DataDepthCard } from "@/components/ui/DataDepthCard";
import { formatNumber } from "@/lib/format";

interface FunnelKpiStripProps {
  views: number;
  clicks: number;
  redemptions: number;
  className?: string;
}

export function FunnelKpiStrip({
  views,
  clicks,
  redemptions,
  className,
}: FunnelKpiStripProps) {
  const steps = [
    { label: "مشاهدات", value: views, elevation: 4 as const },
    { label: "إدخال كود", value: clicks, elevation: 3 as const },
    { label: "استردادات", value: redemptions, elevation: 2 as const },
  ];

  return (
    <div className={className}>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
        {steps.map((step, i) => (
          <div key={step.label} className="contents">
            {i > 0 && (
              <span
                className="hidden text-center text-lg text-gold-3 sm:block"
                aria-hidden
              >
                ←
              </span>
            )}
            <DataDepthCard
              elevation={step.elevation}
              featured={i === 0}
              title={step.label}
              value={
                <span className="font-mono">{formatNumber(step.value)}</span>
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
