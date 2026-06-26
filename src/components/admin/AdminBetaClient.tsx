"use client";

import type { BetaMetricsSnapshot } from "@/lib/beta-metrics";
import { formatDateTime, n } from "@/lib/format";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Button } from "@/components/ui/Button";

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
  function downloadCsv() {
    const blob = new Blob([toCsv(metrics)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `beta-metrics-${metrics.generatedAt.toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-warm-white">Beta Metrics</h1>
          <p className="mt-1 text-sm text-dim">
            لوحة قراءة فقط — آخر تحديث{" "}
            {formatDateTime(metrics.generatedAt)}
          </p>
        </div>
        <Button size="sm" variant="secondary" className="min-h-11" onClick={downloadCsv}>
          تصدير CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {metrics.summary.map((row) => (
          <CircuitCard key={row.label} className="space-y-2">
            <p className="text-xs text-text-secondary">{row.label}</p>
            <p className="font-mono text-2xl font-semibold text-gold-1">{row.value}</p>
            {row.detail && <p className="text-xs text-text-tertiary">{row.detail}</p>}
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-gold-2/80"
                style={{
                  width: `${Math.min(100, Math.max(8, parseFloat(String(row.value).replace(/[^\d.]/g, "")) || 10))}%`,
                }}
              />
            </div>
          </CircuitCard>
        ))}
      </div>

      <CircuitCard className="space-y-4">
        <h2 className="text-sm font-medium text-gold-1">مؤشرات زمنية (p90)</h2>
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
              <div key={item.label} className="space-y-2">
                <p className="text-xs text-text-secondary">{item.label}</p>
                <p className="font-mono text-sm text-text-primary">{formatHours(item.hours)}</p>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-gold-2"
                    style={{ width: `${widthPct || 4}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CircuitCard>

      <p className="text-xs text-dim">
        للتقرير الأسبوعي انسخ القيم أو صدّر CSV إلى{" "}
        <code className="text-gold-2">docs/beta-findings-template.md</code>
      </p>
    </div>
  );
}
