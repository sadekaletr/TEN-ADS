import ar from "@/messages/ar.json";
import en from "@/messages/en.json";

export type Locale = "ar" | "en";
export type Messages = typeof ar;

const messages: Record<Locale, Messages> = { ar, en };

export const LOCALE_COOKIE = "spark_locale";

export function isLocale(value: string | undefined): value is Locale {
  return value === "ar" || value === "en";
}

export function getDir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

function getNestedValue(obj: unknown, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

export function translate(locale: Locale, key: string): string {
  return getNestedValue(messages[locale], key) ?? key;
}

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
