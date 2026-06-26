import { cssTransition } from "@/lib/motion";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatNumber } from "@/lib/format";

interface FunnelChartProps {
  views: number;
  codeSubmits: number;
  redemptions: number;
}

export function FunnelChart({ views, codeSubmits, redemptions }: FunnelChartProps) {
  const steps = [
    { label: "زيارات", value: views },
    { label: "إدخال كود", value: codeSubmits },
    { label: "استرداد", value: redemptions },
  ];
  const max = Math.max(...steps.map((s) => s.value), 1);
  const isEmpty = views === 0 && codeSubmits === 0 && redemptions === 0;

  if (isEmpty) {
    return (
      <EmptyState
        title="لا توجد بيانات قمع بعد"
        description="شارك رابط الحملة لبدء تتبع الزيارات والاستردادات"
      />
    );
  }

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={step.label}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-text-secondary">{step.label}</span>
            <span className="font-mono text-gold-1">{formatNumber(step.value)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-gold-2"
              style={{
                width: `${(step.value / max) * 100}%`,
                opacity: 1 - i * 0.15,
                transition: cssTransition.bar,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
