import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function SponsorVerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-gold-2/20 px-2 py-0.5 text-xs text-gold-1",
        className
      )}
    >
      <Icon name="sealCheck" size={14} />
      راعٍ موثّق
    </span>
  );
}
