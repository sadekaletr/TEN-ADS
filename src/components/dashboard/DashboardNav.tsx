"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useLocale } from "@/lib/i18n";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

interface DashboardNavProps {
  creatorName: string;
  walletBalance?: number;
  unreadNotifications?: number;
}

const tabs = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: "house" as const },
  { href: "/dashboard/campaigns", labelKey: "nav.campaigns", icon: "megaphone" as const },
  { href: "/dashboard/command", labelKey: "nav.commandCenter", icon: "spark" as const },
  { href: "/dashboard/requests", labelKey: "nav.collabRequests", icon: "handshake" as const },
  { href: "/dashboard/listing", labelKey: "nav.marketplaceListing", icon: "storefront" as const },
];

export function DashboardNav({ creatorName, walletBalance, unreadNotifications = 0 }: DashboardNavProps) {
  const { t } = useLocale();
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <header className="border-b border-gold-4/20 bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5">
          <BrandLogo variant="icon" size="xs" />
          <div className="min-w-0">
            <p className="font-brand text-lg text-gold-1">{t("common.brand")}</p>
            <p className="truncate text-xs text-dim">{creatorName}</p>
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <LocaleSwitcher />
          <NotificationBell
            href="/dashboard/notifications"
            unread={unreadNotifications}
            userType="CREATOR"
          />
          {walletBalance !== undefined && (
            <span className="hidden text-xs text-dim sm:inline">
              {t("nav.walletBalance")}:{" "}
              <span className="font-mono text-gold-1">{formatNumber(walletBalance)}</span>
            </span>
          )}
          <Button
            href="/dashboard/wallet"
            size="sm"
            variant="secondary"
            icon={<Icon name="wallet" size={16} />}
          >
            {t("nav.wallet")}
          </Button>
          <Button
            href="/dashboard/wallet/topup"
            size="sm"
            variant="secondary"
          >
            {t("nav.topUp")}
          </Button>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="hidden text-sm text-dim hover:text-warm-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-2/50 sm:inline rounded"
          >
            {t("common.logout")}
          </button>
        </div>
      </div>
      <nav
        className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3"
        aria-label={t("nav.dashboardNav")}
      >
        {tabs.map((tab) => {
          const active = isActive(tab.href);
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
              {t(tab.labelKey)}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
