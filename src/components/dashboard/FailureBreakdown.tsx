interface FailureItem {
  reason: string;
  count: number;
}

const REASON_LABELS: Record<string, string> = {
  duplicate: "محاولة مكررة",
  sold_out: "نفدت الكمية",
  expired: "انتهت الصلاحية",
  ended: "حملة منتهية",
  invalid_code: "كود غير صحيح",
  used_code: "كود مستخدم",
  unknown: "غير معروف",
};

export function FailureBreakdown({
  failures,
  total,
}: {
  failures: FailureItem[];
  total: number;
}) {
  if (total === 0) {
    return <p className="text-sm text-dim">لا توجد محاولات فاشلة</p>;
  }

  const max = Math.max(...failures.map((f) => f.count), 1);

  return (
    <div className="space-y-2">
      <p className="text-xs text-dim">إجمالي الفشل: {total}</p>
      {failures.map((f) => (
        <div key={f.reason}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-dim">
              {REASON_LABELS[f.reason] ?? f.reason}
            </span>
            <span className="font-mono text-gold-3">{f.count}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded bg-surface-2">
            <div
              className="h-full rounded bg-destructive/60 transition-all"
              style={{ width: `${(f.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
