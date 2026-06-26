"use client";

import { useEffect } from "react";
import { SparkIcon } from "@/components/ui/SparkIcon";
import { Button } from "@/components/ui/Button";

export default function PublicError({
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-void px-4 text-center">
      <SparkIcon size={64} />
      <h1 className="mt-6 text-3xl font-bold text-warm-white">تعذّر تحميل الصفحة</h1>
      <p className="mt-2 max-w-md text-dim">
        حدث خطأ أثناء عرض المحتوى. أعد المحاولة أو عد للصفحة الرئيسية.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>إعادة المحاولة</Button>
        <Button href="/" variant="secondary">
          العودة للرئيسية
        </Button>
      </div>
    </div>
  );
}
