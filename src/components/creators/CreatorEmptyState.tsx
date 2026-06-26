"use client";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useLocale } from "@/lib/i18n";

export function CreatorEmptyState() {
  const { t } = useLocale();

  return (
    <EmptyState
      title={t("creators.empty.title")}
      description={t("creators.empty.description")}
      icon="spark"
      action={
        <Button href="/creators" variant="secondary">
          {t("creators.empty.reset")}
        </Button>
      }
    />
  );
}
