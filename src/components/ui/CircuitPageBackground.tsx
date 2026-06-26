import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CircuitPageBackgroundProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "public";
}

export function CircuitPageBackground({
  children,
  className,
  variant = "default",
}: CircuitPageBackgroundProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen bg-circuit-grid bg-bg-base",
        variant === "public" && "bg-gradient-void",
        className
      )}
    >
      {children}
    </div>
  );
}
