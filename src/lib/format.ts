export function n(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/** @deprecated use n() */
export const formatNumber = n;

export function currency(value: number): string {
  return `${n(value)} ل.س`;
}

export function spark(value: number): string {
  return n(value);
}

export function percent(value: number): string {
  return `${n(value)}%`;
}

export function formatCurrency(
  value: number,
  currencyCode: "SYP" | "USD" = "SYP"
): string {
  return `${n(value)} ${currencyCode === "SYP" ? "ل.س" : "$"}`;
}

/** @deprecated use spark() */
export const formatSparkAmount = spark;

export function formatDateTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("ar-SY", {
    dateStyle: "medium",
    timeStyle: "short",
    numberingSystem: "latn",
  }).format(date);
}

export function formatRelative(d: Date | string, locale = "ar"): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const diffMs = date.getTime() - Date.now();
  const absSec = Math.round(Math.abs(diffMs) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale === "ar" ? "ar" : "en", {
    numeric: "auto",
  });

  if (absSec < 60) return rtf.format(Math.round(diffMs / 1000), "second");
  const absMin = Math.round(absSec / 60);
  if (absMin < 60) return rtf.format(Math.round(diffMs / 60000), "minute");
  const absHr = Math.round(absMin / 60);
  if (absHr < 48) return rtf.format(Math.round(diffMs / 3600000), "hour");
  return rtf.format(Math.round(diffMs / 86400000), "day");
}
