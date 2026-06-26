import { H1, Muted } from "@/components/ui/Typography";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <H1 className="text-2xl md:text-3xl">{title}</H1>
        {description && <Muted className="mt-1">{description}</Muted>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
