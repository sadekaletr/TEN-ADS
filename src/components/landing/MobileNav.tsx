"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n";

type NavLink = {
  id: string;
  href: ComponentProps<typeof Link>["href"];
  label: string;
};

interface MobileNavProps {
  links: NavLink[];
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ links, open, onClose }: MobileNavProps) {
  const { t } = useLocale();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-void/80 backdrop-blur-sm"
        aria-label={t("nav.closeMenu")}
        onClick={onClose}
      />
      <nav
        className="absolute inset-x-4 top-20 rounded-2xl border border-gold-4/20 bg-surface p-6 shadow-elevated"
        aria-label={t("nav.mainNav")}
      >
        <ul className="space-y-4">
          {links.map((link) => (
            <li key={link.id}>
              <Link
                href={link.href}
                onClick={onClose}
                className="block text-lg text-warm-white hover:text-gold-1"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-2">
          <Button href="/login" fullWidth onClick={onClose}>
            {t("common.startNow")}
          </Button>
          <Button href="/sponsor/login" variant="secondary" fullWidth onClick={onClose}>
            {t("common.forMerchants")}
          </Button>
        </div>
      </nav>
    </div>
  );
}
