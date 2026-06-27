"use client";

import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n";
import { homeHash } from "@/lib/nav-links";
import type { PricingPlanId } from "@/lib/landing/pricing-plans";

export function PitchUpgradeGate({ planHint }: { planHint?: PricingPlanId }) {
  const { t } = useLocale();
  const loginHref = planHint ? `/login?plan=${planHint}` : "/login?plan=growth";

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs font-medium uppercase tracking-wider text-gold-accent">
        {t("pitch.upgrade.eyebrow")}
      </p>
      <h1 className="mt-4 font-brand text-2xl text-text-primary">{t("pitch.upgrade.title")}</h1>
      <p className="mt-3 text-sm text-text-secondary">{t("pitch.upgrade.body")}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href={loginHref} glow>
          {t("pitch.upgrade.cta")}
        </Button>
        <Button href={homeHash("pricing")} variant="secondary">
          {t("pitch.upgrade.pricing")}
        </Button>
      </div>
    </main>
  );
}
