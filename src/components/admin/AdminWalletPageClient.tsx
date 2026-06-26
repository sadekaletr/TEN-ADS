"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { approveTopUp, rejectTopUp } from "@/app/admin/wallet.actions";
import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { SparkBadge } from "@/components/ui/SparkBadge";
import { StatusPillPro } from "@/components/ui/StatusPillPro";
import { cn } from "@/lib/utils";

const SLA_HOURS = 4;

type TopUp = {
  id: string;
  amount: number;
  bankReference: string;
  proofImageUrl: string | null;
  transferMethod: string | null;
  createdAt: Date;
  creator: { name: string; handle: string };
};

function hoursPending(createdAt: Date): number {
  return (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
}

export function AdminWalletPageClient({ pendingTopUps }: { pendingTopUps: TopUp[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasUrgent = useMemo(
    () => pendingTopUps.some((t) => hoursPending(t.createdAt) > SLA_HOURS),
    [pendingTopUps]
  );

  if (pendingTopUps.length === 0) {
    return <EmptyState title="لا توجد طلبات شحن معلّقة" />;
  }

  return (
    <>
      {hasUrgent && (
        <div
          className="rounded-xl border border-danger/40 bg-danger-muted px-4 py-3 text-sm text-danger"
          role="status"
        >
          يوجد طلبات شحن معلّقة منذ أكثر من {SLA_HOURS} ساعات — يُرجى المراجعة
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-danger/40 bg-danger-muted px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}
      <div className="space-y-4">
        {pendingTopUps.map((t) => {
          const urgent = hoursPending(t.createdAt) > SLA_HOURS;
          return (
            <CircuitCard
              key={t.id}
              className={cn(
                "space-y-3",
                urgent && "border-danger/50 ring-1 ring-danger/20"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-text-primary">{t.creator.name}</p>
                    <StatusPillPro
                      status="pending"
                      label="معلّق"
                      urgency={urgent}
                    />
                  </div>
                  <p className="text-sm text-text-secondary">{t.creator.handle}</p>
                  <p className="mt-1 text-sm text-text-tertiary">
                    {t.transferMethod ?? "ShamCash"} · {t.bankReference}
                  </p>
                </div>
                <SparkBadge amount={t.amount} />
              </div>
              {t.proofImageUrl && (
                <button
                  type="button"
                  className="focus-ring w-full overflow-hidden rounded-lg border border-strong"
                  onClick={() => setLightboxUrl(t.proofImageUrl)}
                >
                  <Image
                    src={t.proofImageUrl}
                    alt="إثبات التحويل — انقر للتكبير"
                    width={400}
                    height={240}
                    className="max-h-60 w-full object-contain bg-surface-2"
                    unoptimized
                  />
                </button>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="min-h-11"
                  loading={loading === t.id}
                  onClick={async () => {
                    setLoading(t.id);
                    setError(null);
                    try {
                      await approveTopUp(t.id);
                      router.refresh();
                    } catch (err) {
                      setError(
                        err instanceof Error && err.message.startsWith("INSUFFICIENT_TREASURY")
                          ? "رصيد الخزينة غير كافٍ — زِد رصيد المشروع أولاً"
                          : "فشلت الموافقة"
                      );
                    }
                    setLoading(null);
                  }}
                >
                  موافقة
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="min-h-11"
                  onClick={() => setRejectId(t.id)}
                >
                  رفض
                </Button>
              </div>
            </CircuitCard>
          );
        })}
      </div>

      {lightboxUrl && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/90 p-4"
          onClick={() => setLightboxUrl(null)}
          aria-label="إغلاق المعاينة"
        >
          <Image
            src={lightboxUrl}
            alt="إثبات التحويل"
            width={800}
            height={600}
            className="max-h-[90vh] max-w-full rounded-xl border border-strong object-contain"
            unoptimized
            onClick={(e) => e.stopPropagation()}
          />
        </button>
      )}

      <ConfirmDialog
        open={rejectId != null}
        title="رفض طلب الشحن"
        description="هل أنت متأكد من رفض هذا الطلب؟"
        variant="destructive"
        confirmLabel="رفض"
        loading={loading != null}
        onCancel={() => setRejectId(null)}
        onConfirm={async () => {
          if (!rejectId) return;
          setLoading(rejectId);
          await rejectTopUp(rejectId);
          setLoading(null);
          setRejectId(null);
          router.refresh();
        }}
      />
    </>
  );
}
