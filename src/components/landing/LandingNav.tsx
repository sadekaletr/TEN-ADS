"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useLocale } from "@/lib/i18n";
import { MobileNav } from "@/components/landing/MobileNav";
import { trackLandingEvent } from "@/lib/analytics/landing-events";
import { homeHash, type NavLinkItem } from "@/lib/nav-links";
import { cn } from "@/lib/utils";
import { navLogoScale, navShrinkTransition } from "@/lib/motion/variants-nav";

const SCROLL_THRESHOLD = 24;

export function LandingNav() {
  const { t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const primaryLinks: NavLinkItem[] = [
    { id: "discover", href: "/marketplace/discover", label: t("nav.discover"), highlight: true },
    { id: "creators", href: "/creators", label: t("nav.creators") },
    { id: "how-it-works", href: homeHash("how-it-works"), label: t("nav.howItWorks") },
    { id: "pricing", href: homeHash("pricing"), label: t("nav.pricing") },
    { id: "faq", href: homeHash("faq"), label: t("nav.faq") },
  ];

  const secondaryLinks: NavLinkItem[] = [
    { id: "marketplace", href: "/marketplace", label: t("nav.marketplace") },
    { id: "product-film", href: homeHash("product-film"), label: t("nav.productFilm") },
  ];

  const mobileLinks = [...primaryLinks, ...secondaryLinks];

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    function onPointerDown(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [moreOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b backdrop-blur-xl transition-[border-color,box-shadow,padding] duration-[220ms]",
          scrolled
            ? "border-strong bg-[var(--nav-bg)] py-2 shadow-elevated"
            : "border-subtle bg-[var(--nav-bg)] py-4"
        )}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:px-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
          >
            <motion.div
              animate={reducedMotion ? false : scrolled ? navLogoScale.shrunk : navLogoScale.expanded}
              transition={navShrinkTransition}
            >
              <Image
                src="/brand/tenegta-logo.svg"
                alt="TENEGTA"
                width={120}
                height={32}
                className="h-8 w-auto opacity-95"
                priority
              />
            </motion.div>
          </Link>

          <nav className="hidden items-center justify-center gap-0.5 lg:flex" aria-label={t("nav.mainNav")}>
            {primaryLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={
                  link.highlight
                    ? "nav-link-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    : "nav-link-pill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                }
              >
                {link.label}
              </Link>
            ))}
            <div ref={moreRef} className="relative">
              <button
                type="button"
                className="nav-link-pill focus-ring"
                aria-expanded={moreOpen}
                aria-haspopup="true"
                onClick={() => setMoreOpen((o) => !o)}
              >
                {t("nav.more")}
              </button>
              {moreOpen && (
                <div className="absolute start-0 top-full z-50 mt-2 min-w-[11rem] rounded-xl border border-strong bg-surface-2 p-2 shadow-elevated">
                  {secondaryLinks.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      className="block rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
                      onClick={() => setMoreOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center justify-end gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <LocaleSwitcher />
            <Button
              href="/login"
              size="sm"
              variant="primary"
              glow
              className="hidden min-h-11 sm:inline-flex"
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
              className="hidden min-h-11 md:inline-flex"
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
              className="focus-ring rounded-lg p-2 text-text-secondary hover:bg-bg-elevated hover:text-gold-accent lg:hidden"
              aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                {mobileOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>
      <MobileNav links={mobileLinks} open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
