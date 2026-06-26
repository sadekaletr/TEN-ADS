import type { TopUpRequest } from "@prisma/client";
import Link from "next/link";
import { SparkAmount } from "@/components/ui/SparkAmount";
import { formatDateTime } from "@/lib/format";
import { TopUpTimeline } from "@/components/wallet/TopUpTimeline";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "قيد المراجعة",
  APPROVED: "موافق",
  REJECTED: "مرفوض",
};

export function PendingTopUpsList({ requests }: { requests: TopUpRequest[] }) {
  if (requests.length === 0) {
    return <p className="text-sm text-dim">لا توجد طلبات شحن.</p>;
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <details
          key={req.id}
          className="rounded-lg border border-gold-4/20 bg-surface-2/40 p-4"
          open={req.status === "PENDING"}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
            <div>
              <SparkAmount amount={req.amount} size="sm" />
              <p className="text-xs text-dim">{formatDateTime(req.createdAt)}</p>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                req.status === "PENDING" && "bg-gold-2/15 text-gold-1",
                req.status === "APPROVED" && "bg-green-500/15 text-green-300",
                req.status === "REJECTED" && "bg-red-500/15 text-red-300"
              )}
            >
              {STATUS_LABEL[req.status]}
            </span>
          </summary>
          <div className="mt-4 border-t border-gold-4/15 pt-4">
            <p className="mb-3 font-mono text-xs text-dim">مرجع: {req.bankReference}</p>
            {req.proofImageUrl && (
              <Link
                href={req.proofImageUrl}
                target="_blank"
                className="mb-3 inline-block text-xs text-gold-2 hover:underline"
              >
                عرض إثبات التحويل
              </Link>
            )}
            <TopUpTimeline request={req} />
          </div>
        </details>
      ))}
    </div>
  );
}
