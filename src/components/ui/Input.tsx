import { cn } from "@/lib/utils";
import { fieldShellClass, fieldShellErrorClass } from "@/components/ui/fieldStyles";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(fieldShellClass, error && fieldShellErrorClass, className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
