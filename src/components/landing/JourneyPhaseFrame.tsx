"use client";

type PhaseKey = "create" | "code" | "reveal";

export function JourneyPhaseFrame({ phase }: { phase: PhaseKey }) {
  if (phase === "create") {
    return (
      <div className="mx-auto mb-4 w-full max-w-[200px] rounded-lg border border-gold-4/30 bg-surface-2/90 p-3 text-start">
        <div className="mb-2 h-2 w-16 rounded bg-gold-4/40" />
        <div className="space-y-1.5">
          <div className="h-2 w-full rounded bg-surface-elevated" />
          <div className="h-2 w-4/5 rounded bg-surface-elevated" />
        </div>
        <div className="mt-3 h-6 rounded bg-gold-2/30" />
      </div>
    );
  }

  if (phase === "code") {
    return (
      <div className="mx-auto mb-4 w-full max-w-[200px] rounded-lg border border-gold-4/30 bg-surface-2/90 p-3">
        <div className="mx-auto mb-2 h-8 w-8 rounded-full border border-gold-2/50" />
        <div className="mx-auto h-8 w-32 rounded border border-gold-4/40 bg-void font-mono text-center text-xs leading-8 text-gold-1">
          SPARK-42
        </div>
        <div className="mt-3 h-6 rounded bg-gold-2/30" />
      </div>
    );
  }

  return (
    <div className="mx-auto mb-4 flex h-24 w-40 items-center justify-center rounded-lg border border-gold-2/50 bg-gradient-to-br from-gold-3/20 to-void">
      <div className="h-10 w-10 rounded-full border-2 border-gold-1 bg-gold-2/20" />
    </div>
  );
}
