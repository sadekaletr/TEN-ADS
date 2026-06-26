"use client";

import Link from "next/link";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { useLocale } from "@/lib/i18n";
import { CAMPAIGN_STATUS_KEYS } from "@/lib/campaign-labels";
import { formatNumber } from "@/lib/format";

type Campaign = {
  id: string;
  title: string;
  status: string;
  prizeName: string;
  prizeClaimed: number;
  prizeQuantity: number;
  sponsor: { name: string };
};

export function CampaignsListClient({ campaigns }: { campaigns: Campaign[] }) {
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.campaigns.title")}
        action={
          <Button href="/dashboard/campaigns/new" icon={<Icon name="rocket" size={16} />}>
            {t("dashboard.campaigns.newCampaign")}
          </Button>
        }
      />

      {campaigns.length === 0 ? (
        <CircuitCard className="text-center text-dim">
          {t("dashboard.home.noCampaignsDesc")}
        </CircuitCard>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((c) => (
            <Link key={c.id} href={`/dashboard/campaigns/${c.id}`}>
              <CircuitCard className="transition hover:border-gold-2/50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-medium text-warm-white">{c.title}</h2>
                    <p className="mt-1 text-sm text-dim">{c.sponsor.name}</p>
                    <p className="mt-1 text-sm text-gold-3">{c.prizeName}</p>
                  </div>
                  <span className="rounded border border-gold-4/30 px-2 py-0.5 text-xs text-gold-1">
                    {t(CAMPAIGN_STATUS_KEYS[c.status] ?? c.status)}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-dim">
                    <span>{t("dashboard.analytics.prizesDistributed")}</span>
                    <span className="font-mono">
                      {formatNumber(c.prizeClaimed)}/{formatNumber(c.prizeQuantity)}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full bg-gold-2"
                      style={{
                        width: `${(c.prizeClaimed / c.prizeQuantity) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CircuitCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
