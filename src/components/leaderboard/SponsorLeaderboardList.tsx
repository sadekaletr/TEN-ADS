"use client";

import { CircuitCard } from "@/components/ui/CircuitCard";

interface SponsorRow {
  id: string;
  name: string;
  currentStreak: number;
}

interface SponsorLeaderboardListProps {
  sponsors: SponsorRow[];
}

function FlameIcon({ pulse }: { pulse: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={pulse ? "animate-junction-pulse text-gold-2" : "text-gold-3"}
      aria-hidden
    >
      <path d="M12 23c-3.9 0-7-3.1-7-7 0-2.5 1.4-4.7 3.5-5.8C9.2 8.5 10 6.5 10 4.5 10 3.1 10.9 2 12 2s2 1.1 2 2.5c0 2-0.8 4-1.5 5.7C14.6 11.3 16 13.5 16 16c0 3.9-3.1 7-7 7zm0-2c2.8 0 5-2.2 5-5 0-1.8-1-3.4-2.5-4.2-.6 1.5-1.5 2.8-2.5 4.2-.3.4-.5.9-.5 1.4 0 1.1.9 2 2 2z" />
    </svg>
  );
}

const PODIUM_BORDER = [
  "border-gold-1/70 shadow-[0_0_20px_rgba(240,201,122,0.15)]",
  "border-gold-2/60",
  "border-gold-3/50",
] as const;

export function SponsorLeaderboardList({
  sponsors,
}: SponsorLeaderboardListProps) {
  if (sponsors.length === 0) {
    return (
      <CircuitCard className="text-center text-dim">
        لا يوجد رعاة نشطون في هذه المدينة بعد
      </CircuitCard>
    );
  }

  return (
    <div className="space-y-2">
      {sponsors.map((s, i) => {
        const rank = i + 1;
        const isPodium = rank <= 3;
        const borderClass = isPodium
          ? PODIUM_BORDER[rank - 1]
          : "border-gold-4/20";

        return (
          <CircuitCard
            key={s.id}
            className={`relative overflow-hidden ${borderClass} ${
              isPodium ? "px-5 py-4" : "px-4 py-3"
            }`}
          >
            <span
              className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 font-mono text-4xl text-gold-4/10"
              aria-hidden
            >
              #{rank}
            </span>
            <div className="relative flex items-center justify-between gap-3 pr-8">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-gold-2">#{rank}</span>
                <span className="text-warm-white">{s.name}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-gold-1">
                <FlameIcon pulse={s.currentStreak >= 4} />
                <span>{s.currentStreak} أسبوع</span>
              </div>
            </div>
          </CircuitCard>
        );
      })}
    </div>
  );
}
