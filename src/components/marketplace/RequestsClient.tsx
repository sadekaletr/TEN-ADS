"use client";

import { respondCollabRequest } from "@/app/marketplace/actions";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { Button } from "@/components/ui/Button";

type RequestRow = {
  id: string;
  message: string;
  createdAt: Date;
  sponsor: { name: string; city: string | null };
};

export function RequestsClient({ requests }: { requests: RequestRow[] }) {
  if (requests.length === 0) {
    return (
      <SurfaceCard className="text-center text-dim">
        لا توجد طلبات تعاون واردة
      </SurfaceCard>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((r) => (
        <SurfaceCard key={r.id}>
          <p className="font-medium text-warm-white">{r.sponsor.name}</p>
          {r.sponsor.city && (
            <p className="text-xs text-dim">{r.sponsor.city}</p>
          )}
          <p className="mt-2 text-sm text-dim">{r.message}</p>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() => respondCollabRequest(r.id, "ACCEPTED")}
            >
              قبول
            </Button>
            <Button
              variant="secondary"
              onClick={() => respondCollabRequest(r.id, "DECLINED")}
            >
              رفض
            </Button>
          </div>
        </SurfaceCard>
      ))}
    </div>
  );
}
