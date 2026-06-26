import { SurfaceCard } from "@/components/ui/SurfaceCard";

interface AgencyMemberCardProps {
  name: string;
  handle: string;
  spendingLimit: number | null;
  spentThisMonth: number;
  redemptions: number;
}

export function AgencyMemberCard({
  name,
  handle,
  spendingLimit,
  spentThisMonth,
  redemptions,
}: AgencyMemberCardProps) {
  const hasLimit = spendingLimit != null && spendingLimit > 0;
  const ratio = hasLimit ? Math.min(spentThisMonth / spendingLimit, 1) : 0;
  const nearLimit = hasLimit && ratio >= 0.8;

  return (
    <SurfaceCard>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-warm-white">{name}</p>
          <p className="text-xs text-dim">@{handle.replace(/^@/, "")}</p>
        </div>
        <p className="text-xs text-dim">{redemptions} استرداد</p>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-dim">الإنفاق الشهري</span>
          <span
            className="font-mono"
            style={{ color: nearLimit ? "var(--color-text-warning)" : undefined }}
          >
            {spentThisMonth}
            {hasLimit ? ` / ${spendingLimit}` : " — بلا حد"}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          {hasLimit ? (
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${ratio * 100}%`,
                backgroundColor: nearLimit
                  ? "color-mix(in srgb, var(--gold-3) 60%, transparent)"
                  : "var(--gold-3)",
              }}
            />
          ) : (
            <div
              className="h-full rounded-full bg-gold-4/30"
              style={{ width: `${Math.min(spentThisMonth > 0 ? 40 : 8, 100)}%` }}
            />
          )}
        </div>
      </div>
    </SurfaceCard>
  );
}
