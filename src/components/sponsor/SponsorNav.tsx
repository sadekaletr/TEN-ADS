"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface SponsorNavProps {
  sponsorName: string;
  unreadNotifications?: number;
}

const tabs = [
  { href: "/sponsor", label: "نظرة عامة", exact: true },
  { href: "/sponsor/campaigns", label: "الحملات" },
  { href: "/sponsor/leads", label: "المستفيدون" },
  { href: "/sponsor/roi", label: "العائد" },
  { href: "/sponsor/messages", label: "الرسائل" },
];

export function SponsorNav({ sponsorName, unreadNotifications = 0 }: SponsorNavProps) {
  const { t } = useLocale();
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <header className="border-b border-gold-4/20 bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <Link href="/sponsor" className="flex min-w-0 items-center gap-2.5">
          <BrandLogo variant="icon" size="xs" />
          <div className="min-w-0">
            <p className="font-brand text-lg text-gold-1">{t("common.brand")}</p>
            <p className="truncate text-xs text-dim">راعٍ — {sponsorName}</p>
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <LocaleSwitcher />
          <NotificationBell
            href="/sponsor/notifications"
            unread={unreadNotifications}
            userType="SPONSOR"
          />
          <Button href="/marketplace" size="sm" variant="secondary">
            Marketplace
          </Button>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/sponsor/login" })}
            className="hidden text-sm text-dim hover:text-warm-white sm:inline"
          >
            {t("common.logout")}
          </button>
        </div>
      </div>
      <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3">
        {tabs.map((tab) => {
          const active = isActive(tab.href, tab.exact);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "shrink-0 rounded px-3 py-1.5 text-sm transition-colors",
                active ? "bg-gold-2/15 text-gold-1" : "text-dim hover:text-warm-white"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
