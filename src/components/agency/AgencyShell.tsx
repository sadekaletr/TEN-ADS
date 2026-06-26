"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

interface AgencyShellProps {
  agencyName: string;
  walletBalance: number;
  children: React.ReactNode;
}

const tabs = [
  { href: "/agency/dashboard", label: "لوحة التحكم", icon: "house" as const, exact: true },
  { href: "/agency/members", label: "الأعضاء", icon: "handshake" as const },
  { href: "/agency/wallet", label: "المحفظة", icon: "wallet" as const },
  { href: "/agency/campaigns", label: "الحملات", icon: "megaphone" as const },
  { href: "/agency/settings", label: "الإعدادات", icon: "lock" as const },
];

export function AgencyShell({ agencyName, walletBalance, children }: AgencyShellProps) {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-gold-4/20 bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
          <div className="min-w-0">
            <p className="font-brand text-lg text-gold-1">TENEGTA</p>
            <p className="truncate text-xs text-dim">{agencyName}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden text-xs text-dim sm:inline">
              الرصيد:{" "}
              <span className="font-mono text-gold-1">{formatNumber(walletBalance)}</span>{" "}
              سبارك
            </span>
            <Button href="/agency/wallet" size="sm" variant="secondary" icon={<Icon name="wallet" size={16} />}>
              المحفظة
            </Button>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/agency/login" })}
              className="hidden rounded text-sm text-dim hover:text-warm-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-2/50 sm:inline"
            >
              خروج
            </button>
          </div>
        </div>
        <nav
          className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-3"
          aria-label="تنقل الوكالة"
        >
          {tabs.map((tab) => {
            const active = isActive(tab.href, tab.exact);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-2/50",
                  active
                    ? "border-b-2 border-gold-2 text-gold-1"
                    : "text-dim hover:bg-surface-2 hover:text-gold-1"
                )}
              >
                <Icon name={tab.icon} size={16} />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8 pb-safe">{children}</div>
    </div>
  );
}
