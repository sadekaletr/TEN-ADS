import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
}
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id ?? (typeof label === "string" ? `checkbox-${label}` : undefined);
    return (
      <label className={cn("flex cursor-pointer items-center gap-2 text-sm text-dim", className)}>
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className="h-4 w-4 rounded border-gold-4/40 bg-surface-2 text-gold-2 focus-visible:ring-2 focus-visible:ring-gold-2/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void"
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
