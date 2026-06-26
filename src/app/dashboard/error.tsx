"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-gold-4/20 bg-surface-elevated/30 px-6 py-16 text-center">
      <h2 className="text-xl font-bold text-warm-white">تعذّر تحميل لوحة التحكم</h2>
      <p className="mt-2 max-w-md text-dim">
        حدث خطأ أثناء جلب البيانات. أعد المحاولة أو عد لاحقاً.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>إعادة المحاولة</Button>
        <Button href="/dashboard" variant="secondary">
          نظرة عامة
        </Button>
      </div>
    </div>
  );
}
