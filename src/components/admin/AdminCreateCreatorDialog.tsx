"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCreatorAdmin } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

type AdminCreateCreatorDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function AdminCreateCreatorDialog({ open, onClose }: AdminCreateCreatorDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [isPartner, setIsPartner] = useState(false);

  if (!open) return null;

  function resetForm() {
    setName("");
    setHandle("");
    setEmail("");
    setPhone("");
    setPassword("");
    setVerified(false);
    setIsPartner(false);
    setError(null);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const id = await createCreatorAdmin({
        name,
        handle,
        email,
        phone,
        password,
        verified,
        isPartner,
      });
      resetForm();
      onClose();
      router.push(`/admin/creators/${id}`);
      router.refresh();
    } catch {
      setError("تعذّر إنشاء الصانع — تحقق من البريد والحساب والهاتف (يجب أن تكون فريدة)");
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-void/80 backdrop-blur-sm"
        aria-label="إغلاق"
        onClick={handleClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-gold-4/25 bg-surface-1 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gold-1">إضافة صانع محتوى</h2>
        <p className="mt-1 text-sm text-dim">
          أنشئ حساباً بالبريد وكلمة المرور — يدخل الصانع من /login
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <Label>الاسم</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label>الحساب (@handle)</Label>
            <Input
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              dir="ltr"
              placeholder="rawan_shamaa"
              required
            />
          </div>
          <div>
            <Label>البريد الإلكتروني</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              required
            />
          </div>
          <div>
            <Label>الهاتف</Label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
              placeholder="+9639..."
              required
            />
          </div>
          <div>
            <Label>كلمة المرور</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-dim">
            <input
              type="checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
            />
            موثّق
          </label>
          <label className="flex items-center gap-2 text-sm text-dim">
            <input
              type="checkbox"
              checked={isPartner}
              onChange={(e) => setIsPartner(e.target.checked)}
            />
            صانع متعاقد (سعر Spark $3)
          </label>
          {error && (
            <p className="rounded border border-danger/30 bg-danger-muted px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
              إلغاء
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              إنشاء الحساب
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
