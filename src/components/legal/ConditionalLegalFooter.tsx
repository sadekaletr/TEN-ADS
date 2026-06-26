"use client";

import { usePathname } from "next/navigation";
import { SiteLegalFooter } from "@/components/legal/SiteLegalFooter";

export function ConditionalLegalFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <SiteLegalFooter />;
}
