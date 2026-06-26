"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function AgencyError({
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
    <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl border border-gold-4/20 bg-surface-elevated/30 px-6 py-16 text-center">
      <h2 className="text-xl font-bold text-warm-white">تعذّر تحميل بوابة الوكالة</h2>
      <p className="mt-2 text-dim">
        حدث خطأ أثناء جلب البيانات. أعد المحاولة أو عد للوحة التحكم.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>إعادة المحاولة</Button>
        <Button href="/agency/dashboard" variant="secondary">
          لوحة التحكم
        </Button>
      </div>
    </div>
  );
}
