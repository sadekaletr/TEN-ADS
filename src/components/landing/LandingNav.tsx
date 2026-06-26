"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useLocale } from "@/lib/i18n";
import { MobileNav } from "@/components/landing/MobileNav";
import { trackLandingEvent } from "@/lib/analytics/landing-events";
import { homeHash, type NavLinkItem } from "@/lib/nav-links";

export function LandingNav() {
  const { t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks: NavLinkItem[] = [
    { id: "discover", href: "/marketplace/discover", label: t("nav.discover"), highlight: true },
    { id: "creators", href: "/creators", label: t("nav.creators") },
    { id: "how-it-works", href: homeHash("how-it-works"), label: t("nav.howItWorks") },
    { id: "product-film", href: homeHash("product-film"), label: t("nav.productFilm") },
    { id: "pricing", href: homeHash("pricing"), label: t("nav.pricing") },
    { id: "faq", href: homeHash("faq"), label: t("nav.faq") },
    { id: "marketplace", href: "/marketplace", label: t("nav.marketplace") },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b border-subtle backdrop-blur-md"
        style={{ backgroundColor: "var(--nav-bg)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            <Image
              src="/brand/tenegta-logo.svg"
              alt="TENEGTA"
              width={120}
              height={32}
              className="h-8 w-auto opacity-95"
              priority
            />
          </Link>
          <nav className="hidden items-center gap-5 lg:flex" aria-label={t("nav.mainNav")}>
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={
                  link.highlight
                    ? "rounded-full border border-strong bg-gold-rich/10 px-3 py-1.5 text-sm text-gold-accent transition-colors hover:border-spotlight hover:bg-gold-rich/20"
                    : "rounded text-sm text-text-secondary transition-colors hover:text-gold-accent"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <LocaleSwitcher />
            <Button
              href="/login"
              size="sm"
              variant="primary"
              className="hidden sm:inline-flex"
              onClick={() =>
                trackLandingEvent("landing_nav_login_click", {
                  section: "nav",
                  ctaLabel: t("common.startNow"),
                })
              }
            >
              {t("common.startNow")}
            </Button>
            <Button
              href="/sponsor/login"
              size="sm"
              variant="secondary"
              className="hidden md:inline-flex"
              onClick={() =>
                trackLandingEvent("landing_cta_sponsor_click", {
                  section: "nav",
                  ctaLabel: t("common.forMerchants"),
                })
              }
            >
              {t("common.forMerchants")}
            </Button>
            <button
              type="button"
              className="rounded p-2 text-text-secondary hover:text-gold-accent lg:hidden"
              aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <MobileNav links={navLinks} open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
