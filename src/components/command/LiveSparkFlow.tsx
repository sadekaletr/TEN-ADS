"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RedemptionLivePayload } from "@/lib/events/publish";
import { emitSparkFlow } from "@/lib/spark-flow-events";
import { LiveSparkEmptyPulse } from "@/components/command/LiveSparkEmptyPulse";
import { SparkIcon } from "@/components/ui/SparkIcon";

export function LiveSparkFlow({
  maxItems = 12,
  compact = false,
  campaignId,
}: {
  maxItems?: number;
  compact?: boolean;
  campaignId?: string;
}) {
  const [items, setItems] = useState<RedemptionLivePayload[]>([]);
  const [connected, setConnected] = useState(false);
  const [freshId, setFreshId] = useState<string | null>(null);

  useEffect(() => {
    let es: EventSource | null = null;
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    const seen = new Set<string>();

    const push = (payload: RedemptionLivePayload) => {
      if (campaignId && payload.campaignId !== campaignId) return;
      if (seen.has(payload.id)) return;
      seen.add(payload.id);
      emitSparkFlow({ id: payload.id, path: "full" });
      setFreshId(payload.id);
      setTimeout(() => setFreshId(null), 2000);
      setItems((prev) => [payload, ...prev].slice(0, maxItems));
    };

    const startPoll = () => {
      pollTimer = setInterval(async () => {
        try {
          const res = await fetch("/api/live/redemptions?poll=1");
          if (!res.ok) return;
          const data = (await res.json()) as { items: RedemptionLivePayload[] };
          for (const item of data.items) push(item);
        } catch {
          // ignore
        }
      }, 5000);
    };

    try {
      es = new EventSource("/api/live/redemptions");
      es.onopen = () => setConnected(true);
      es.onmessage = (ev) => {
        if (!ev.data || ev.data.startsWith(":")) return;
        try {
          push(JSON.parse(ev.data) as RedemptionLivePayload);
        } catch {
          // ignore
        }
      };
      es.onerror = () => {
        setConnected(false);
        es?.close();
        startPoll();
      };
    } catch {
      startPoll();
    }

    return () => {
      es?.close();
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [maxItems, campaignId]);

  return (
    <div className="space-y-2">
      <div className={`flex items-center gap-2 ${compact ? "mb-2" : ""}`}>
        <motion.span
          className={`rounded-full bg-gold-1 ${compact ? "h-1.5 w-1.5" : "h-2 w-2"}`}
          animate={
            connected
              ? { scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }
              : { opacity: 0.4 }
          }
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <span className="text-xs text-dim">{connected ? "مباشر" : "polling"}</span>
      </div>
      <div
        className={
          compact
            ? "max-h-48 space-y-1.5 overflow-y-auto"
            : "max-h-56 space-y-2 overflow-y-auto"
        }
      >
        {items.length === 0 ? (
          <LiveSparkEmptyPulse />
        ) : (
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm shadow-surface ${
                  freshId === item.id
                    ? "border border-gold-2/60 bg-gold-2/15"
                    : "border border-gold-4/20 bg-surface-2/50"
                }`}
              >
                <span className="flex items-center gap-2 text-gold-1">
                  <SparkIcon size={14} />
                  {item.prizeName}
                </span>
                <span className="font-mono text-xs text-dim">{item.city ?? "—"}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
