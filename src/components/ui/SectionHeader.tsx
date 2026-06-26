import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { H2, Lead } from "@/components/ui/Typography";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  centered?: boolean;
}

export function SectionHeader({
  title,
  description,
  action,
  className,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-wrap items-end justify-between gap-3",
        centered && "flex-col items-center text-center",
        className
      )}
    >
      <div>
        <H2 className={cn(centered && "text-center")}>{title}</H2>
        {description && (
          <Lead className={cn("mt-2", centered && "text-center")}>{description}</Lead>
        )}
      </div>
      {action}
    </div>
  );
}
