"use client";

import type { BetaMetricsSnapshot } from "@/lib/beta-metrics";
import { formatDateTime, n } from "@/lib/format";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Button } from "@/components/ui/Button";
import { CommandKPICluster } from "@/components/ui/CommandKPICluster";
import { Icon } from "@/components/ui/Icon";
import { trackProductEvent } from "@/lib/analytics/product-events";

function formatHours(h: number | null): string {
  if (h == null) return "—";
  if (h < 24) return `${n(Math.round(h))} ساعة`;
  return `${n(Number((h / 24).toFixed(1)))} يوم`;
}

function toCsv(metrics: BetaMetricsSnapshot): string {
  const rows = [
    ["generatedAt", metrics.generatedAt.toISOString()],
    ...metrics.summary.map((r) => [r.label, r.value, r.detail ?? ""]),
    ["ttf_campaign_p90", String(metrics.timeToFirstCampaignHours.p90 ?? "")],
    ["ttf_redemption_p90", String(metrics.timeToFirstRedemptionHours.p90 ?? "")],
    ["tt_topup_p90", String(metrics.timeToTopUpApprovedHours.p90 ?? "")],
    ["sponsor_roi_p90", String(metrics.sponsorRoiVisibilityHours.p90 ?? "")],
    ["retention_rate", String(metrics.creatorRetention30d.rate)],
    ["redemptions_30d", String(metrics.totalRedemptions30d)],
  ];
  return rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
}

export function AdminBetaClient({ metrics }: { metrics: BetaMetricsSnapshot }) {
  const retention = metrics.creatorRetention30d.rate;
  const redemptions30d = metrics.totalRedemptions30d;

  function downloadCsv() {
    trackProductEvent("admin_primary_action_click", {
      section: "admin_beta",
      ctaLabel: "export_csv",
    });
    const blob = new Blob([toCsv(metrics)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `beta-metrics-${metrics.generatedAt.toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <CommandKPICluster
        primary={{
          label: "استردادات 30 يوم",
          value: <span className="font-mono">{n(redemptions30d)}</span>,
          meta: `آخر تحديث ${formatDateTime(metrics.generatedAt)}`,
        }}
        secondary={[
          {
            label: "Retention 30d",
            value: `${n(Math.round(retention * 100))}%`,
            trend: "معدل عودة الصناع",
          },
          {
            label: "TTF Redemption p90",
            value: formatHours(metrics.timeToFirstRedemptionHours.p90),
            trend: "زمن أول استرداد",
          },
        ]}
        primaryAction={{
          href: "/admin/wallet",
          label: "مراجعة الشحن",
          icon: <Icon name="wallet" size={16} />,
          onClick: () =>
            trackProductEvent("admin_primary_action_click", {
              section: "admin_beta",
              ctaLabel: "review_wallet",
            }),
        }}
        secondaryAction={{ href: "/admin/campaigns", label: "الحملات" }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Beta Metrics</h1>
          <p className="mt-1 text-sm text-text-secondary">لوحة قراءة فقط — مؤشرات التجربة المغلقة</p>
        </div>
        <Button size="sm" variant="secondary" className="min-h-12" onClick={downloadCsv}>
          تصدير CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.summary.map((row) => (
          <CircuitCard key={row.label} className="space-y-2 border-strong">
            <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
              {row.label}
            </p>
            <p className="font-mono text-2xl font-semibold tabular-nums text-gold-accent">
              {row.value}
            </p>
            {row.detail && <p className="text-xs text-text-secondary">{row.detail}</p>}
          </CircuitCard>
        ))}
      </div>

      <CircuitCard className="space-y-4 border-strong">
        <h2 className="text-sm font-semibold text-gold-accent">مؤشرات زمنية (p90)</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "أول حملة ACTIVE", hours: metrics.timeToFirstCampaignHours.p90 },
            { label: "أول استرداد", hours: metrics.timeToFirstRedemptionHours.p90 },
            { label: "موافقة شحن", hours: metrics.timeToTopUpApprovedHours.p90 },
            { label: "زيارة ROI (راعٍ)", hours: metrics.sponsorRoiVisibilityHours.p90 },
          ].map((item) => {
            const maxH = 168;
            const h = item.hours ?? 0;
            const widthPct = item.hours != null ? Math.min(100, (h / maxH) * 100) : 0;
            return (
              <div key={item.label} className="space-y-2 rounded-xl border border-subtle bg-bg-elevated/50 p-3">
                <p className="text-xs text-text-secondary">{item.label}</p>
                <p className="font-mono text-sm font-semibold tabular-nums text-text-primary">
                  {formatHours(item.hours)}
                </p>
                <div className="h-2 overflow-hidden rounded-full bg-bg-base">
                  <div
                    className="h-full rounded-full bg-gold-rich/80"
                    style={{ width: `${widthPct || 4}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CircuitCard>

      <p className="text-xs text-text-tertiary">
        للتقرير الأسبوعي صدّر CSV إلى{" "}
        <code className="text-gold-accent">docs/beta-findings-template.md</code>
      </p>
    </div>
  );
}
