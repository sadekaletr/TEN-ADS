import { SparkAmount } from "@/components/ui/SparkAmount";
import { formatNumber } from "@/lib/format";

interface RoiNarrativeBlockProps {
  totalRedemptions: number;
  totalSparkCost: number;
  costPerRedemption: number;
}

export function RoiNarrativeBlock({
  totalRedemptions,
  totalSparkCost,
  costPerRedemption,
}: RoiNarrativeBlockProps) {
  if (totalRedemptions === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-strong bg-bg-elevated/50 px-5 py-4">
        <p className="text-sm font-medium text-text-primary">ماذا حدث؟</p>
        <p className="mt-1 text-sm text-text-secondary">
          لا توجد استردادات بعد — أنشئ حملة لبدء قياس العائد.
        </p>
      </div>
    );
  }

  const efficient = costPerRedemption > 0 && costPerRedemption <= 50;

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div className="rounded-xl border border-strong bg-bg-elevated/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-accent">
          ماذا حدث؟
        </p>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          <span className="font-mono font-semibold tabular-nums text-text-primary">
            {formatNumber(totalRedemptions)}
          </span>{" "}
          استرداد بإجمالي{" "}
          <SparkAmount amount={totalSparkCost} size="xs" className="inline" showLabel />
        </p>
      </div>
      <div className="rounded-xl border border-strong bg-bg-elevated/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-accent">
          لماذا يهم؟
        </p>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          متوسط{" "}
          <span className="font-mono font-semibold tabular-nums text-gold-accent">
            {formatNumber(costPerRedemption)} Spark
          </span>{" "}
          لكل استرداد —{" "}
          {efficient ? "أداء فعّال مقارنة بالمعيار" : "فرصة لتحسين استهداف الحملة"}
        </p>
      </div>
      <div className="rounded-xl border border-strong bg-gold-rich/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-accent">
          ماذا تفعل؟
        </p>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {efficient
            ? "كرّر نمط الحملات الأعلى أداءً وزِد الميزانية تدريجياً."
            : "راجع الجوائز والاستهداف — جرّب حملة جديدة بعروض أوضح."}
        </p>
      </div>
    </div>
  );
}
