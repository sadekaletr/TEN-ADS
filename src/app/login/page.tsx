"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatedCircuitCard } from "@/components/motion/AnimatedCircuitCard";
import { CircuitWake } from "@/components/motion/CircuitWake";
import { MagneticCore } from "@/components/motion/MagneticCore";
import { PageEnter } from "@/components/motion/PageEnter";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/ui/FieldError";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useLocale } from "@/lib/i18n";

export default function LoginPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const identifier = email.trim() || phone.trim();
    if (!identifier) {
      setError(t("auth.loginIdentifierHint"));
      return;
    }
    setLoading(true);
    setError("");

    const result = await signIn("creator", {
      identifier,
      password,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError(t("auth.loginSubtitle"));
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <>
      <CircuitWake intensity="light" />
      <main className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-bg-base px-6 py-16">
        <div className="absolute end-6 top-6 flex items-center gap-2">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
        <PageEnter
          title={
            <>
              <Image
                src="/brand/tenegta-logo.svg"
                alt="TENEGTA"
                width={180}
                height={45}
                className="mb-6 opacity-90"
                style={{ height: "auto" }}
                priority
              />
              <h1 className="font-brand text-2xl font-bold text-gold-1">
                {t("common.brand")}
              </h1>
              <p className="mt-1 text-sm text-dim">{t("auth.loginTitle")}</p>
            </>
          }
        >
          <AnimatedCircuitCard className="mt-8 w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-mono"
                  placeholder="creator@tenegta.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <Label htmlFor="phone">{t("auth.phone")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="font-mono"
                  placeholder="+963900000001"
                  autoComplete="tel"
                />
                <p className="mt-1 text-xs text-dimmer">{t("auth.loginIdentifierHint")}</p>
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
              <p className="text-center text-sm">
                <Link href="/forgot-password" className="text-gold-2 underline">
                  {t("auth.forgotPassword")}
                </Link>
              </p>
              {process.env.NEXT_PUBLIC_GOOGLE_OAUTH === "1" && (
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                >
                  {t("auth.signInGoogle")}
                </Button>
              )}
              {process.env.NODE_ENV !== "production" && (
                <p className="text-xs text-dimmer">{t("auth.demoHint")}</p>
              )}
              <MagneticCore className="w-full">
                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                  disabled={!email.trim() && !phone.trim()}
                >
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
