"use client";

import { PageEnter } from "@/components/motion/PageEnter";
import type { ReactNode } from "react";

export function DashboardPageShell({ children }: { children: ReactNode }) {
  return <PageEnter>{children}</PageEnter>;
}
