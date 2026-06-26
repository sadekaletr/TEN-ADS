"use client";

import { useEffect, useState } from "react";
import { n } from "@/lib/format";

type Inventory = {
  prizeClaimed: number;
  prizeQuantity: number;
  status: string;
};

interface LiveScarcityBarProps {
  campaignId?: string;
  slug?: string;
  initialClaimed: number;
  initialQuantity: number;
  className?: string;
}

const POLL_MS = 5000;

export function LiveScarcityBar({
  campaignId,
  slug,
  initialClaimed,
  initialQuantity,
  className = "",
}: LiveScarcityBarProps) {
  const [inv, setInv] = useState<Inventory>({
    prizeClaimed: initialClaimed,
    prizeQuantity: initialQuantity,
    status: "ACTIVE",
  });

  useEffect(() => {
    setInv({
      prizeClaimed: initialClaimed,
      prizeQuantity: initialQuantity,
      status: "ACTIVE",
    });
  }, [initialClaimed, initialQuantity]);

  useEffect(() => {
    const endpoint = slug
      ? `/api/public/campaigns/${encodeURIComponent(slug)}/inventory`
      : campaignId
        ? `/api/public/campaigns/by-id/${campaignId}/inventory`
        : null;
    if (!endpoint) return;

    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(endpoint!, { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as Inventory;
        if (!cancelled) setInv(data);
      } catch {
        // silent
      }
    }

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [slug, campaignId]);

  const left = Math.max(0, inv.prizeQuantity - inv.prizeClaimed);
  const pct =
    inv.prizeQuantity > 0
      ? Math.min(100, (inv.prizeClaimed / inv.prizeQuantity) * 100)
      : 0;
  const lowStock = inv.prizeQuantity > 0 && left / inv.prizeQuantity < 0.2;

  if (inv.status !== "ACTIVE" && left <= 0) {
    return (
      <p className={`text-sm text-text-secondary ${className}`}>نفدت الجوائز</p>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="text-text-secondary">
          تبقّى <span className="font-medium text-gold-1">{n(left)}</span> من{" "}
          {n(inv.prizeQuantity)}
        </span>
        {lowStock && left > 0 && (
          <span className="animate-pulse rounded-full bg-gold-4/20 px-2 py-0.5 text-xs font-medium text-gold-1">
            ينتهي قريباً
          </span>
        )}
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-white/5"
        role="progressbar"
        aria-valuenow={inv.prizeClaimed}
        aria-valuemin={0}
        aria-valuemax={inv.prizeQuantity}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold-4 to-gold-1 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
