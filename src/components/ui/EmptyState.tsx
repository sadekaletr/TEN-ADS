import { Icon, type IconName } from "@/components/ui/Icon";

import { cn } from "@/lib/utils";

import type { ReactNode } from "react";



interface EmptyStateProps {

  title: string;

  description?: string;

  action?: ReactNode;

  className?: string;

  icon?: IconName;

  illustration?: ReactNode;

}



export function EmptyState({

  title,

  description,

  action,

  className,

  icon = "spark",

  illustration,

}: EmptyStateProps) {

  return (

    <div

      className={cn(

        "flex flex-col items-center justify-center rounded-xl border border-dashed border-gold-4/20 px-6 py-12 text-center",

        className

      )}

    >

      {illustration ? (

        <div className="mb-4 h-20 w-20 opacity-90">{illustration}</div>

      ) : (

        <Icon name={icon} size={40} className="mb-4 text-gold-3" />

      )}

      <p className="text-base font-medium text-warm-white">{title}</p>

      {description && (

        <p className="mt-2 max-w-sm text-sm text-dim">{description}</p>

      )}

      {action && <div className="mt-4">{action}</div>}

    </div>

  );

}

