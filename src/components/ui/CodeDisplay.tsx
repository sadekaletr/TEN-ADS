import { cn } from "@/lib/utils";

interface CodeDisplayProps {
  code: string;
  className?: string;
}

export function CodeDisplay({ code, className }: CodeDisplayProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-lg tracking-[0.2em] text-gold-1 uppercase",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gold-2" />
      {code}
      <span className="h-1.5 w-1.5 rounded-full bg-gold-2" />
    </span>
  );
}
