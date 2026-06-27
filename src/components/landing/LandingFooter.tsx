"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useLocale } from "@/lib/i18n";

export function LandingFooter() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-subtle bg-bg-surface/80 px-6 py-16">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <BrandLogo variant="logo" size="footer" className="opacity-95" />
          <p className="mt-3 text-sm text-text-secondary">{t("landing.footer.tagline")}</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-medium text-gold-accent">{t("common.product")}</p>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li><Link href="/login" className="hover:text-text-primary">{t("common.creators")}</Link></li>
            <li><Link href="/sponsor/login" className="hover:text-text-primary">{t("common.sponsors")}</Link></li>
            <li><Link href="/marketplace/discover" className="hover:text-text-primary">{t("nav.discover")}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-medium text-gold-accent">{t("common.company")}</p>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li><Link href="/redeem" className="hover:text-text-primary">{t("landing.footer.redeemPrize")}</Link></li>
            <li><a href="mailto:hello@tenegta.com" className="hover:text-text-primary">{t("common.contactUs")}</a></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-medium text-gold-accent">{t("common.legal")}</p>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li><Link href="/terms" className="hover:text-text-primary">{t("common.terms")}</Link></li>
            <li><Link href="/privacy" className="hover:text-text-primary">{t("common.privacy")}</Link></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-5xl text-center text-xs text-text-muted">
        © {new Date().getFullYear()} TENEGTA. {t("common.copyright")}
      </p>
    </footer>
  );
}
