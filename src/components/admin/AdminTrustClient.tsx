"use client";

import { toggleSponsorVerified, toggleVerified } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { SparkBadge } from "@/components/ui/SparkBadge";

type Creator = {
  id: string;
  name: string;
  handle: string;
  walletBalance: number;
  verified: boolean;
};

type Sponsor = { id: string; name: string; verified: boolean };

export function AdminTrustClient({
  creators,
  sponsors,
}: {
  creators: Creator[];
  sponsors: Sponsor[];
}) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-warm-white">الثقة والتوثيق</h1>
      <CircuitCard>
        <h2 className="mb-4 text-gold-1">صناع المحتوى</h2>
        <div className="space-y-2">
          {creators.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-4/10 py-2">
              <div>
                <span className="text-warm-white">{c.name}</span>
                {c.verified && <span className="mr-2 text-xs text-gold-1">موثّق</span>}
                <p className="text-sm text-dim">{c.handle}</p>
              </div>
              <div className="flex items-center gap-2">
                <SparkBadge amount={c.walletBalance} size="sm" />
                <Button
                  size="sm"
                  variant="ghost"
                  className="min-h-11"
                  onClick={async () => {
                    await toggleVerified(c.id);
                    window.location.reload();
                  }}
                >
                  {c.verified ? "إلغاء توثيق" : "توثيق"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CircuitCard>
      <CircuitCard>
        <h2 className="mb-4 text-gold-1">الرعاة</h2>
        <div className="space-y-2">
          {sponsors.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-4/10 py-2">
              <span className="text-warm-white">
                {s.name}
                {s.verified && <span className="mr-2 text-xs text-gold-1">موثّق</span>}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="min-h-11"
                onClick={async () => {
                  await toggleSponsorVerified(s.id);
                  window.location.reload();
                }}
              >
                {s.verified ? "إلغاء توثيق" : "توثيق"}
              </Button>
            </div>
          ))}
        </div>
      </CircuitCard>
    </div>
  );
}
