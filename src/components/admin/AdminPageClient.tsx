"use client";

import { CircuitWake } from "@/components/motion/CircuitWake";
import { PageEnter } from "@/components/motion/PageEnter";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { FraudSignalsPanel } from "@/components/admin/FraudSignalsPanel";
import { AudienceInsightsPanel } from "@/components/admin/AudienceInsightsPanel";

type AdminPageClientProps = {
  stats: React.ComponentProps<typeof AdminDashboard>["stats"];
  activity: React.ComponentProps<typeof ActivityFeed>["items"];
  fraudSignals: React.ComponentProps<typeof FraudSignalsPanel>["signals"];
  audience: React.ComponentProps<typeof AudienceInsightsPanel>["participants"];
};

export function AdminPageClient({
  stats,
  activity,
  fraudSignals,
  audience,
}: AdminPageClientProps) {
  return (
    <>
      <CircuitWake intensity="light" />
      <div className="mx-auto min-h-screen max-w-4xl px-4 py-8">
        <PageEnter className="space-y-6">
          <AdminDashboard stats={stats} />
          <FraudSignalsPanel signals={fraudSignals} />
          <AudienceInsightsPanel participants={audience} />
          <ActivityFeed items={activity} title="نشاط المنصة" />
        </PageEnter>
      </div>
    </>
  );
}
