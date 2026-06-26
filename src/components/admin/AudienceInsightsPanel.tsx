import { CircuitCard } from "@/components/ui/CircuitCard";

interface ParticipantInsight {
  phoneHash: string;
  tags: string[];
  lastSeenAt: Date;
}

const TAG_LABELS: Record<string, string> = {
  fast_redeemer: "مسترد سريع",
  deal_hunter: "صياد عروض",
  luxury_seeker: "باحث عن فخامة",
};

export function AudienceInsightsPanel({
  participants,
}: {
  participants: ParticipantInsight[];
}) {
  return (
    <CircuitCard>
      <h2 className="mb-4 text-gold-1">Audience Profiles (مخفي)</h2>
      {participants.length === 0 ? (
        <p className="text-sm text-dim">لا توجد ملفات جمهور بعد</p>
      ) : (
        <div className="space-y-2">
          {participants.map((p, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-4/10 py-2 text-sm"
            >
              <span className="font-mono text-dim">{p.phoneHash}</span>
              <div className="flex flex-wrap gap-1">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-gold-2/10 px-2 py-0.5 text-xs text-gold-1"
                  >
                    {TAG_LABELS[t] ?? t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </CircuitCard>
  );
}
