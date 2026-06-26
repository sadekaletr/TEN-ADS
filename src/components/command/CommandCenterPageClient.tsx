"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/lib/i18n";
import { CommandCenterClient } from "@/components/command/CommandCenterClient";

interface CommandCenterPageClientProps {
  todayRedemptions: number;
  activeCampaigns: number;
  conversionPct: number;
  pulseData: {
    id: string;
    title: string;
    redemptions: number;
    roi: number;
  }[];
  mapCities: string[];
}

export function CommandCenterPageClient(props: CommandCenterPageClientProps) {
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.command.title")}
        description={t("dashboard.command.description")}
      />
      <CommandCenterClient {...props} />
    </div>
  );
}
