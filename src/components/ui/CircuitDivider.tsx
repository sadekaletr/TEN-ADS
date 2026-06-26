import { cn } from "@/lib/utils";

interface CircuitDividerProps {
  className?: string;
}

export function CircuitDivider({ className }: CircuitDividerProps) {
  return (
    <div className={cn("relative my-8 flex items-center", className)}>
      <div className="h-px flex-1 bg-gold-4/30" />
      <div className="relative mx-3 h-3 w-3">
        <span className="absolute inset-0 rounded-full bg-gold-2" />
        <span className="absolute -left-3 top-1/2 h-px w-3 -translate-y-1/2 bg-gold-4/50" />
        <span className="absolute -right-3 top-1/2 h-px w-3 -translate-y-1/2 bg-gold-4/50" />
      </div>
      <div className="h-px flex-1 bg-gold-4/30" />
    </div>
  );
}
