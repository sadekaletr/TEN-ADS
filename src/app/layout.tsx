import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "@/components/Providers";
import { ConditionalLegalFooter } from "@/components/legal/ConditionalLegalFooter";
import { getDir, getLocale } from "@/lib/i18n-server";
import "./globals.css";

const notoNaskhArabic = localFont({
  src: [
    {
      path: "../../public/fonts/noto-naskh-arabic-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/noto-naskh-arabic-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-arabic",
  display: "swap",
});

const spaceMono = localFont({
  src: [
    {
      path: "../../public/fonts/space-mono-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/space-mono-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-mono",
  display: "swap",
});

const syne = localFont({
  src: [
    {
      path: "../../public/fonts/syne-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/syne-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-brand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TENEGTA Spark",
  description: "منصة إعلانات بالكوبون لصناع المحتوى",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dir = getDir(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${notoNaskhArabic.variable} ${spaceMono.variable} ${syne.variable}`}
    >
      <body suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-surface-2 focus:px-4 focus:py-2 focus:text-text-primary focus:ring-2 focus:ring-[var(--ring)]"
        >
          تخطي إلى المحتوى
        </a>
        <Providers initialLocale={locale}>{children}</Providers>
        <ConditionalLegalFooter />
      </body>
    </html>
  );
}
