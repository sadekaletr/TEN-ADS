"use client";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";

export default function CodeRedeemError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="redeem-safe mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-4 py-8 pb-safe">
      <EmptyState
        variant="premium"
        icon="gift"
        title="تعذّر تحميل صفحة الاسترداد"
        description={error.message || "تحقق من الاتصال وحاول مرة أخرى."}
        action={
          <div className="flex w-full flex-col gap-2">
            <Button glow className="min-h-12" onClick={reset}>
              إعادة المحاولة
            </Button>
            <Button variant="secondary" className="min-h-12" href="/">
              العودة للرئيسية
            </Button>
            <Button
              variant="ghost"
              className="min-h-12"
              href="/redeem"
              icon={<Icon name="gift" size={16} />}
            >
              إدخال كود يدوياً
            </Button>
          </div>
        }
      />
    </main>
  );
}
