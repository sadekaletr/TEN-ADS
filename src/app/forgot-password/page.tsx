"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("creator");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, role }),
    });
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-brand text-2xl text-gold-1">تحقق من بريدك</h1>
        <p className="mt-3 text-dim">
          إن وُجد حساب بهذا البريد، أرسلنا رابط إعادة التعيين.
        </p>
        <Link href="/login" className="mt-6 inline-block text-gold-2 underline">
          العودة لتسجيل الدخول
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-brand text-2xl text-warm-white">نسيت كلمة المرور؟</h1>
      <CircuitCard className="mt-6 space-y-4">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>البريد الإلكتروني</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>نوع الحساب</Label>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="creator">صانع محتوى</option>
              <option value="sponsor">راعٍ</option>
              <option value="agency_admin">وكالة</option>
              <option value="admin">إدارة</option>
            </Select>
          </div>
          <Button type="submit" loading={loading} className="w-full">
            إرسال الرابط
          </Button>
        </form>
      </CircuitCard>
    </main>
  );
}
