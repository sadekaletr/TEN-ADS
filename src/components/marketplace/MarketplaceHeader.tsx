"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useLocale } from "@/lib/i18n";

export function MarketplaceHeader({ userName }: { userName: string }) {
  const { t } = useLocale();

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <PageHeader title={t("marketplace.title")} description={t("marketplace.subtitle")} />
      <div className="flex items-center gap-3">
        <LocaleSwitcher />
        <Link href="/sponsor/login" className="text-sm text-dim">
          {userName}
        </Link>
      </div>
    </div>
  );
}
