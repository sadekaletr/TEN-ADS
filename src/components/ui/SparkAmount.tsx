import { SparkIcon } from "@/components/ui/SparkIcon";
import { formatSparkAmount } from "@/lib/format";
import { cn } from "@/lib/utils";

const ICON_SIZES = { xs: 14, sm: 16, md: 24, lg: 40, xl: 56 } as const;

interface SparkAmountProps {
  amount: number;
  size?: keyof typeof ICON_SIZES;
  showLabel?: boolean;
  className?: string;
  valueClassName?: string;
}

export function SparkAmount({
  amount,
  size = "md",
  showLabel = true,
  className,
  valueClassName,
}: SparkAmountProps) {
  const textSize =
    size === "xl"
      ? "text-3xl"
      : size === "lg"
        ? "text-2xl"
        : size === "md"
          ? "text-lg"
          : size === "sm"
            ? "text-sm"
            : "text-xs";

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <SparkIcon size={ICON_SIZES[size]} />
      <span className={cn("font-mono text-gold-1", textSize, valueClassName)}>
        {formatSparkAmount(amount)}
        {showLabel && <span className="ms-1 text-text-secondary"> Spark</span>}
      </span>
    </span>
  );
}
