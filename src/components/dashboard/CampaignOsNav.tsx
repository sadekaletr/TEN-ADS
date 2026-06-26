"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const tabs = [
  { suffix: "", label: "نظرة عامة", exact: true },
  { suffix: "/participants", label: "المشاركون" },
  { suffix: "/live", label: "مباشر" },
  { suffix: "/assets", label: "الأصول" },
  { suffix: "/analytics", label: "التحليلات" },
  { suffix: "/fraud", label: "الاحتيال" },
  { suffix: "/settings", label: "الإعدادات" },
];

interface CampaignOsNavProps {
  campaignId: string;
  title: string;
  slug?: string | null;
}

export function CampaignOsNav({ campaignId, title, slug }: CampaignOsNavProps) {
  const pathname = usePathname();
  const base = `/dashboard/campaigns/${campaignId}`;

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-warm-white">{title}</h1>
          <p className="text-xs text-dim">Campaign OS</p>
        </div>
        {slug && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              const url = `${window.location.origin}/campaign/${slug}`;
              void navigator.clipboard.writeText(url);
            }}
          >
            نسخ رابط الحملة
          </Button>
        )}
      </div>
      <nav className="flex gap-1 overflow-x-auto border-b border-gold-4/20 pb-1">
        {tabs.map((tab) => {
          const href = `${base}${tab.suffix}`;
          const active = tab.exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "shrink-0 rounded-t px-3 py-2 text-sm transition-colors",
                active
                  ? "border-b-2 border-gold-2 text-gold-1"
                  : "text-dim hover:text-warm-white"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
