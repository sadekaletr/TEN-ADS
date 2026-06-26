import { cn } from "@/lib/utils";
import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full resize-none rounded-lg border bg-surface-2 px-4 py-3 text-warm-white outline-none transition-colors",
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

Textarea.displayName = "Textarea";
