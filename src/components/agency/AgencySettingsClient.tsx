"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateAgencySettings } from "@/app/agency/actions";
import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { PageHeader } from "@/components/ui/PageHeader";

export function AgencySettingsClient({
  initialName,
  email,
}: {
  initialName: string;
  email: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await updateAgencySettings({
        name: name.trim(),
        password: password.trim() || undefined,
      });
      setPassword("");
      setSuccess(true);
      router.refresh();
    } catch {
      setError("فشل حفظ الإعدادات");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader title="إعدادات الوكالة" description="اسم الوكالة وكلمة المرور" />

      <CircuitCard className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>البريد الإلكتروني</Label>
            <Input value={email} disabled />
          </div>
          <div>
            <Label htmlFor="agency-name">اسم الوكالة</Label>
            <Input
              id="agency-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="agency-password">كلمة مرور جديدة (اختياري)</Label>
            <Input
              id="agency-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="اتركه فارغاً للإبقاء على الحالية"
              minLength={6}
            />
          </div>
          {success && <p className="text-sm text-success">تم حفظ الإعدادات</p>}
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" loading={loading}>
            حفظ
          </Button>
        </form>
      </CircuitCard>
    </div>
  );
}
