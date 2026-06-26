"use client";

import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { CommandKPICluster } from "@/components/ui/CommandKPICluster";
import { Icon } from "@/components/ui/Icon";
import { SparkBadge } from "@/components/ui/SparkBadge";
import { trackProductEvent } from "@/lib/analytics/product-events";
import { n } from "@/lib/format";
import { signOut } from "next-auth/react";

interface AdminDashboardProps {
  stats: {
    totalSpark: number;
    activeCampaigns: number;
    totalRedemptions: number;
    pendingTopUps: { length: number } | unknown[];
  };
}

export function AdminDashboard({ stats }: AdminDashboardProps) {
  const pendingCount = Array.isArray(stats.pendingTopUps)
    ? stats.pendingTopUps.length
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-text-primary">لوحة الإدارة</h1>
        <Button
          variant="ghost"
          size="sm"
          className="min-h-12"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          خروج
        </Button>
      </div>

      <CommandKPICluster
        primary={{
          label: "Spark متداول",
          value: <SparkBadge amount={stats.totalSpark} />,
          meta: pendingCount > 0 ? `${n(pendingCount)} طلب شحن بانتظار المراجعة` : "لا طلبات معلّقة",
        }}
        secondary={[
          {
            label: "حملات نشطة",
            value: n(stats.activeCampaigns),
            trend: "عبر المنصة",
          },
          {
            label: "إجمالي الاستردادات",
            value: n(stats.totalRedemptions),
            trend: "كل الوقت",
          },
        ]}
        primaryAction={{
          href: "/admin/wallet",
          label: "مراجعة المحفظة",
          icon: <Icon name="wallet" size={16} />,
          onClick: () =>
            trackProductEvent("admin_primary_action_click", {
              section: "admin_home",
              ctaLabel: "review_wallet",
              metadata: { pendingCount },
            }),
        }}
        secondaryAction={{ href: "/admin/campaigns", label: "الحملات" }}
      />

      {pendingCount > 0 && (
        <CircuitCard className="flex flex-wrap items-center justify-between gap-4 border-warning/30 bg-warning-muted/20">
          <div>
            <p className="font-semibold text-warning">طلبات شحن عاجلة</p>
            <p className="text-sm text-text-secondary">
              {n(pendingCount)} بانتظار المراجعة — SLA 4 ساعات
            </p>
          </div>
          <Button
            href="/admin/wallet"
            glow
            className="min-h-12"
            onClick={() =>
              trackProductEvent("admin_primary_action_click", {
                section: "admin_alert",
                ctaLabel: "urgent_wallet",
              })
            }
          >
            مراجعة الآن
          </Button>
        </CircuitCard>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Button href="/admin/settings" variant="secondary" className="min-h-12">
          إعدادات المنصة
        </Button>
        <Button href="/admin/homepage" variant="secondary" className="min-h-12">
          الصفحة الرئيسية
        </Button>
        <Button href="/admin/trust" variant="secondary" className="min-h-12">
          الثقة والتوثيق
        </Button>
        <Button href="/admin/beta" variant="secondary" className="min-h-12">
          Beta Metrics
        </Button>
      </div>
    </div>
  );
}
