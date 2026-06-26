"use client";

import { useState } from "react";
import Link from "next/link";
import { requestSponsorJoin } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function SponsorRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await requestSponsorJoin({ name, email, phone, city, message });
      setDone(true);
    } catch {
      setError("تعذّر إرسال الطلب. تحقق من البيانات.");
    }
    setLoading(false);
  }

  if (done) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-brand text-2xl text-gold-1">تم استلام طلبك</h1>
        <p className="mt-3 text-dim">سيراجع الفريق طلب الانضمام ويتواصل معك قريباً.</p>
        <Link href="/" className="mt-6 inline-block text-gold-2 underline">
          العودة للرئيسية
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-brand text-2xl text-warm-white">انضم كراعٍ</h1>
      <p className="mt-2 text-sm text-dim">قدّم طلب انضمام — الموافقة من فريق الإدارة.</p>
      <CircuitCard className="mt-6 space-y-4">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>اسم الشركة / العلامة</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label>البريد الإلكتروني</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label>الهاتف</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <Label>المدينة</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <Label>رسالة (اختياري)</Label>
            <Input value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">
            إرسال الطلب
          </Button>
        </form>
      </CircuitCard>
    </main>
  );
}
