"use client";

import { PageEnter } from "@/components/motion/PageEnter";
import type { ReactNode } from "react";

export function CampaignDetailShell({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <PageEnter title={title} className="space-y-6">
      {children}
    </PageEnter>
  );
}
