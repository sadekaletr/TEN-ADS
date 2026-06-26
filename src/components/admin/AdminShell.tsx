"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string; exact?: boolean };

const SHOW_BETA = process.env.NODE_ENV !== "production";

const SECTIONS: { title: string; links: NavLink[] }[] = [
  {
    title: "عمليات",
    links: [
      { href: "/admin", label: "نظرة عامة", exact: true },
      { href: "/admin/wallet", label: "المحفظة" },
    ],
  },
  {
    title: "المحتوى",
    links: [
      { href: "/admin/creators", label: "الصناع" },
      { href: "/admin/campaigns", label: "الحملات" },
      { href: "/admin/sponsors", label: "الرعاة" },
      { href: "/admin/agencies", label: "الوكالات" },
      { href: "/admin/homepage", label: "الصفحة الرئيسية" },
    ],
  },
  {
    title: "المنصة",
    links: [
      { href: "/admin/settings", label: "الإعدادات" },
      { href: "/admin/trust", label: "الثقة" },
      { href: "/admin/audit", label: "التدقيق" },
      ...(SHOW_BETA ? [{ href: "/admin/beta", label: "Beta" }] : []),
    ],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-8 pb-safe lg:flex-row lg:gap-10">
      <aside className="lg:w-56 lg:shrink-0">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-gold-3">
          Control Center
        </p>
        <nav className="space-y-5">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-wider text-dim">
                {section.title}
              </p>
              <div className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
                {section.links.map((link) => {
                  const active = link.exact
                    ? pathname === link.href
                    : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "min-h-10 shrink-0 rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-gold-2/15 text-gold-1 lg:border-s-2 lg:border-gold-2"
                          : "text-dim hover:bg-surface-2/60 hover:text-warm-white"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
