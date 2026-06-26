import { formatNumber } from "@/lib/format";
import { SparkAmount } from "@/components/ui/SparkAmount";

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
      <p className="rounded-xl border border-subtle bg-surface-2 px-4 py-3 text-sm text-text-secondary">
        لا توجد استردادات بعد — أنشئ حملة لبدء قياس العائد.
      </p>
    );
  }

  return (
    <p className="rounded-xl border border-gold-4/20 bg-surface-2 px-4 py-3 text-sm text-text-secondary">
      <span className="font-mono font-medium text-gold-1">{formatNumber(totalRedemptions)}</span>{" "}
      استرداد ←{" "}
      <SparkAmount amount={totalSparkCost} size="xs" className="inline" /> ←{" "}
      <span className="font-mono font-medium text-gold-1">
        {formatNumber(costPerRedemption)} Spark
      </span>{" "}
      لكل استرداد
    </p>
  );
}
