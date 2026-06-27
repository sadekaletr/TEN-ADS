"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { AnimatedCircuitCard } from "@/components/motion/AnimatedCircuitCard";
import { CircuitWake } from "@/components/motion/CircuitWake";
import { MagneticCore } from "@/components/motion/MagneticCore";
import { PageEnter } from "@/components/motion/PageEnter";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/ui/FieldError";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useLocale } from "@/lib/i18n";

export default function AgencyLoginPage() {
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

    const result = await signIn("agency_admin", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError(t("auth.agencyLoginError"));
      return;
    }
    router.push("/agency/dashboard");
    router.refresh();
  }

  return (
    <>
      <CircuitWake intensity="light" />
      <main className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-16">
        <div className="absolute end-6 top-6">
          <LocaleSwitcher />
        </div>
        <PageEnter
          title={
            <>
              <BrandLogo variant="logo" size="auth" priority className="mb-6 opacity-95" />
              <h1 className="font-brand text-2xl font-bold text-gold-1">
                {t("common.brand")}
              </h1>
              <p className="mt-1 text-sm text-dim">{t("auth.agencyLoginTitle")}</p>
            </>
          }
        >
          <AnimatedCircuitCard className="mt-8 w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="agency-email">{t("auth.email")}</Label>
                <Input
                  id="agency-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="agency-password">{t("auth.password")}</Label>
                <Input
                  id="agency-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <FieldError>{error}</FieldError>}
              <MagneticCore className="w-full">
                <Button type="submit" loading={loading} fullWidth>
                  {t("auth.signIn")}
                </Button>
              </MagneticCore>
            </form>
          </AnimatedCircuitCard>
        </PageEnter>
      </main>
    </>
  );
}
