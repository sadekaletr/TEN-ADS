"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/lib/i18n";
import { RequestsClient } from "@/components/marketplace/RequestsClient";

type Request = {
  id: string;
  sponsor: { name: string; city: string | null };
  createdAt: Date;
  message: string;
};

export function RequestsPageClient({ requests }: { requests: Request[] }) {
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.requests.title")}
        description={t("dashboard.requests.description")}
      />
      <RequestsClient requests={requests} />
    </div>
  );
}
