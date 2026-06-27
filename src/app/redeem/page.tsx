"use client";

import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { Suspense } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useLocale } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { useState } from "react";

function RedeemPageInner() {
  const { t } = useLocale();
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim()) {
      router.push(`/c/${encodeURIComponent(code.trim().toUpperCase())}`);
    }
  }

  return (
    <main className="redeem-safe mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-4 py-10 pb-safe">
      <div className="absolute end-4 top-4">
        <LocaleSwitcher />
      </div>
      <BrandLogo variant="logo" size="footer" className="mb-6 opacity-95" />
      <SurfaceCard className="w-full">
        <h1 className="mb-1 text-center text-lg text-warm-white">
          {t("redeem.enterCode")}
        </h1>
        <p className="mb-4 text-center text-sm text-dim">{t("redeem.subtitle")}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label htmlFor="redeem-code" className="sr-only">
            {t("redeem.enterCode")}
          </Label>
          <Input
            id="redeem-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="SPARK-XXXX-XXXX"
            className="py-4 text-center font-mono text-base tracking-widest"
          />
          <Button type="submit" fullWidth disabled={!code.trim()}>
            {t("common.next")}
          </Button>
        </form>
      </SurfaceCard>
    </main>
  );
}

export default function RedeemPage() {
  return (
    <Suspense
      fallback={
        <main className="redeem-safe mx-auto flex min-h-dvh max-w-md items-center justify-center px-4 py-10">
          <SkeletonCard className="w-full" />
        </main>
      }
    >
      <RedeemPageInner />
    </Suspense>
  );
}
