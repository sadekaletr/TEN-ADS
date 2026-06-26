import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
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

Input.displayName = "Input";
