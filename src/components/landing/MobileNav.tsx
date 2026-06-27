"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useLocale } from "@/lib/i18n";
import {
  mobileBackdrop,
  mobileSheet,
  mobileSheetTransition,
} from "@/lib/motion/variants-nav";

type NavLink = {
  id: string;
  href: ComponentProps<typeof Link>["href"];
  label: string;
  highlight?: boolean;
};

interface MobileNavProps {
  links: NavLink[];
  open: boolean;
  onClose: () => void;
}

const PRIMARY_IDS = new Set(["discover", "creators", "how-it-works", "pricing", "faq"]);

export function MobileNav({ links, open, onClose }: MobileNavProps) {
  const { t } = useLocale();
  const reducedMotion = useReducedMotion();

  const primary = links.filter((l) => PRIMARY_IDS.has(l.id));
  const secondary = links.filter((l) => !PRIMARY_IDS.has(l.id));

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <motion.button
            type="button"
            className="absolute inset-0 bg-void/70 backdrop-blur-md"
            aria-label={t("nav.closeMenu")}
            onClick={onClose}
            initial={reducedMotion ? false : mobileBackdrop.initial}
            animate={mobileBackdrop.animate}
            exit={reducedMotion ? undefined : mobileBackdrop.exit}
            transition={mobileSheetTransition}
          />
          <motion.nav
            className="absolute inset-x-0 top-0 flex max-h-[100dvh] flex-col border-b border-strong bg-surface-2 shadow-elevated"
            aria-label={t("nav.mainNav")}
            initial={reducedMotion ? false : mobileSheet.initial}
            animate={mobileSheet.animate}
            exit={reducedMotion ? undefined : mobileSheet.exit}
            transition={mobileSheetTransition}
          >
            <div className="flex items-center justify-between border-b border-subtle px-4 py-4">
              <BrandLogo variant="logo" size="xs" />
              <button
                type="button"
                className="focus-ring rounded-lg p-2 text-text-secondary hover:text-gold-accent"
                aria-label={t("nav.closeMenu")}
                onClick={onClose}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-tertiary">
                {t("nav.explore")}
              </p>
              <ul className="space-y-1">
                {primary.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={
                        link.highlight
                          ? "block rounded-xl border border-strong bg-gold-rich/10 px-4 py-3 text-base font-medium text-gold-accent"
                          : "block rounded-xl px-4 py-3 text-base text-text-primary transition-colors hover:bg-bg-elevated hover:text-gold-accent"
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {secondary.length > 0 && (
                <>
                  <p className="mb-3 mt-8 text-xs font-medium uppercase tracking-wider text-text-tertiary">
                    {t("nav.more")}
                  </p>
                  <ul className="space-y-1">
                    {secondary.map((link) => (
                      <li key={link.id}>
                        <Link
                          href={link.href}
                          onClick={onClose}
                          className="block rounded-xl px-4 py-3 text-base text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="mt-8 flex items-center justify-between rounded-xl border border-subtle bg-bg-surface px-4 py-3">
                <span className="text-sm text-text-secondary">{t("theme.label")}</span>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <LocaleSwitcher />
                </div>
              </div>
            </div>

            <div className="border-t border-subtle p-4 pb-safe">
              <div className="flex flex-col gap-2">
                <Button href="/login" fullWidth className="min-h-12" onClick={onClose}>
                  {t("common.startNow")}
                </Button>
                <Button href="/sponsor/login" variant="secondary" fullWidth className="min-h-12" onClick={onClose}>
                  {t("common.forMerchants")}
                </Button>
              </div>
            </div>
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  );
}
