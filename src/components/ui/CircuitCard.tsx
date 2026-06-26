import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";

interface CircuitCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function CircuitCard({ children, className, id = "circuit-card" }: CircuitCardProps) {
  void id;
  return <GlassCard className={cn("rounded-lg", className)}>{children}</GlassCard>;
}
