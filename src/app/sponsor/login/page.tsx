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

export default function SponsorLoginPage() {
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

    const result = await signIn("sponsor", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError(t("auth.sponsorLoginSubtitle"));
      return;
    }
    router.push("/sponsor");
    router.refresh();
  }

  return (
    <main className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-16">
      <div className="absolute end-6 top-6">
        <LocaleSwitcher />
      </div>
      <BrandLogo variant="logo" size="auth" priority className="mb-6 opacity-95" />
      <CircuitCard className="w-full">
        <h1 className="mb-4 text-center text-lg text-gold-1">{t("auth.sponsorLoginTitle")}</h1>
        <p className="mb-4 text-center text-sm text-dim">{t("auth.sponsorLoginSubtitle")}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Input
              id="password"
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
