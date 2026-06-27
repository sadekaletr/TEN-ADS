import { cn } from "@/lib/utils";

export function FoundingPartnerBadge({
  number,
  className,
}: {
  number: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-gold-rich/40 bg-gold-rich/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-accent",
        className
      )}
    >
      شريك مؤسس #{number}
    </span>
  );
}
