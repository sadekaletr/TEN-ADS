"use client";

import { SessionProvider } from "next-auth/react";
import { LocaleProvider, type Locale } from "@/lib/i18n";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SparkFlowLayer } from "@/components/motion/SparkFlowParticle";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export default function Providers({
  children,
  initialLocale = "ar",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <MotionProvider>
          <SparkFlowLayer />
          <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>
          <CookieConsent />
        </MotionProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
