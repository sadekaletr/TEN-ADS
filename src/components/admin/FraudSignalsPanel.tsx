import { CircuitCard } from "@/components/ui/CircuitCard";

interface FraudSignalItem {
  id: string;
  entityType: string;
  entityHash: string;
  riskScore: number;
  reason: string;
  createdAt: Date;
}

export function FraudSignalsPanel({ signals }: { signals: FraudSignalItem[] }) {
  if (signals.length === 0) {
    return (
      <CircuitCard>
        <h2 className="mb-4 text-gold-1">Fraud Graph</h2>
        <p className="text-sm text-dim">لا توجد إشارات احتيال حالياً</p>
      </CircuitCard>
    );
  }

  return (
    <CircuitCard>
      <h2 className="mb-4 text-gold-1">Fraud Graph — إشارات حديثة</h2>
      <div className="space-y-2">
        {signals.map((s) => (
          <div
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded border border-gold-4/20 p-3 text-sm"
          >
            <div>
              <span className="text-gold-3">{s.reason}</span>
              <p className="font-mono text-xs text-dim">
                {s.entityType}: {s.entityHash.slice(0, 12)}…
              </p>
            </div>
            <span
              className={`font-mono text-sm ${
                s.riskScore >= 0.7 ? "text-destructive" : "text-gold-2"
              }`}
            >
              {(s.riskScore * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </CircuitCard>
  );
}
