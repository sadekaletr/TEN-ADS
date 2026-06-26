import { cn } from "@/lib/utils";
import { forwardRef, type SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full rounded-lg border bg-surface-2 px-3 py-2 text-warm-white outline-none transition-colors",
          "border-gold-4/30 focus-visible:border-gold-2 focus-visible:ring-2 focus-visible:ring-gold-2/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive/50",
          className
        )}
        {...props}
      />
    );
  }
);

Select.displayName = "Select";
