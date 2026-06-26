"use client";

import { usePathname } from "next/navigation";
import { AgencyShell } from "@/components/agency/AgencyShell";

export function AgencyLayoutClient({
  agencyName,
  walletBalance,
  children,
}: {
  agencyName: string;
  walletBalance: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname === "/agency/login") return <>{children}</>;
  return (
    <AgencyShell agencyName={agencyName} walletBalance={walletBalance}>
      {children}
    </AgencyShell>
  );
}
