import { cn } from "@/lib/utils";

export function CampaignPerformanceBadge({
  claimed,
  quantity,
  className,
}: {
  claimed: number;
  quantity: number;
  className?: string;
}) {
  if (quantity <= 0) return null;
  const rate = Math.round((claimed / quantity) * 100);

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-mono",
        rate >= 70 ? "bg-green-500/15 text-green-300" : "bg-gold-2/15 text-gold-1",
        className
      )}
    >
      {rate}% completion
    </span>
  );
}
