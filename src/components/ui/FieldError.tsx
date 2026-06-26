import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function FieldError({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-1 text-sm text-gold-3", className)} {...props} />;
}
