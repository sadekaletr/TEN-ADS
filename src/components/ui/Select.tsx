import { cn } from "@/lib/utils";
import { fieldShellClass, fieldShellErrorClass } from "@/components/ui/fieldStyles";
import { forwardRef, type SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(fieldShellClass, error && fieldShellErrorClass, className)}
        {...props}
      />
    );
  }
);

Select.displayName = "Select";
