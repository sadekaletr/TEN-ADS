"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/ui/FieldError";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useLocale } from "@/lib/i18n";

export default function AdminLoginPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("admin", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError(t("auth.adminLoginSubtitle"));
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-16">
      <div className="absolute end-6 top-6">
        <LocaleSwitcher />
      </div>
      <BrandLogo variant="logo" size="auth" priority className="mb-6 opacity-95" />
      <h1 className="font-brand text-2xl font-bold text-gold-1">{t("auth.adminLoginTitle")}</h1>
      <p className="mt-1 text-sm text-dim">{t("common.brand")}</p>

      <CircuitCard className="mt-8 w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="admin-email">{t("auth.email")}</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="admin-password">{t("auth.password")}</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <FieldError>{error}</FieldError>}
          <Button type="submit" loading={loading} fullWidth>
            {t("auth.signIn")}
          </Button>
        </form>
      </CircuitCard>
    </main>
  );
}
