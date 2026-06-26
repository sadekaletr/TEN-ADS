"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const role = params.get("role") ?? "creator";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, role, password }),
    });
    if (!res.ok) {
      setError("الرابط غير صالح أو منتهٍ");
      setLoading(false);
      return;
    }
    router.push("/login?reset=1");
  }

  if (!token) {
    return (
      <p className="text-dim">
        رابط غير صالح.{" "}
        <Link href="/forgot-password" className="text-gold-2 underline">
          اطلب رابطاً جديداً
        </Link>
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label>كلمة المرور الجديدة</Label>
        <Input
          type="password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" loading={loading} className="w-full">
        حفظ كلمة المرور
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-brand text-2xl text-warm-white">كلمة مرور جديدة</h1>
      <CircuitCard className="mt-6">
        <Suspense fallback={<p className="text-dim">جاري التحميل…</p>}>
          <ResetPasswordForm />
        </Suspense>
      </CircuitCard>
    </main>
  );
}
