"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const tabs = [
  { suffix: "", label: "نظرة عامة", exact: true },
  { suffix: "/live", label: "مباشر" },
  { suffix: "/participants", label: "العملاء المحتملون" },
  { suffix: "/assets", label: "الأصول" },
  { suffix: "/analytics", label: "التحليلات" },
  { suffix: "/settings", label: "الإعدادات" },
];

interface CampaignOsShellProps {
  campaignId: string;
  title: string;
  slug?: string | null;
  children: React.ReactNode;
}

export function CampaignOsShell({ campaignId, title, slug, children }: CampaignOsShellProps) {
  const pathname = usePathname();
  const base = `/dashboard/campaigns/${campaignId}`;

  return (
    <div className="flex flex-col gap-6 pb-safe lg:flex-row lg:gap-8">
      <aside className="lg:w-52 lg:shrink-0">
        <div className="mb-4 lg:sticky lg:top-24">
          <h1 className="text-xl font-bold text-warm-white lg:text-lg">{title}</h1>
          <p className="text-xs text-text-secondary">نظام الحملة</p>
          {slug && (
            <Button
              size="sm"
              variant="secondary"
              className="mt-3 w-full min-h-11 lg:text-xs"
              onClick={() => {
                void navigator.clipboard.writeText(`${window.location.origin}/campaign/${slug}`);
              }}
            >
              نسخ الرابط
            </Button>
          )}
          <nav className="mt-4 flex gap-1 overflow-x-auto border-b border-gold-4/20 pb-1 lg:flex-col lg:overflow-visible lg:border-0 lg:pb-0">
            {tabs.map((tab) => {
              const href = `${base}${tab.suffix}`;
              const active = tab.exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "shrink-0 rounded px-3 py-2.5 text-sm min-h-11 flex items-center lg:min-h-9",
                    active
                      ? "bg-gold-2/15 text-gold-1 lg:border-s-2 lg:border-gold-2"
                      : "text-dim hover:text-warm-white"
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
