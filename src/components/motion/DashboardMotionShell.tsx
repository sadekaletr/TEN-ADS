"use client";

import { usePathname } from "next/navigation";
import { CircuitWake } from "@/components/motion/CircuitWake";
import type { ReactNode } from "react";

export function DashboardMotionShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isCommand = pathname?.includes("/command");
  const showCircuit = isCommand;

  return (
    <>
      {showCircuit && <CircuitWake intensity="strong" />}
      {children}
    </>
  );
}
