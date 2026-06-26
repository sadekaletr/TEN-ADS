import type { TxType, WalletTransaction } from "@prisma/client";
import { formatNumber, formatRelative } from "@/lib/format";

export type FormattedTransaction = {
  title: string;
  subtitle: string;
  relativeTime: string;
  positive: boolean;
};

export function formatWalletTransaction(tx: WalletTransaction): FormattedTransaction {
  const positive = tx.type === "TOPUP" || tx.type === "REFUND";
  const relativeTime = formatRelative(tx.createdAt);

  if (tx.type === "TOPUP") {
    const via = tx.note?.includes("ShamCash") ? "ShamCash" : "تحويل بنكي";
    return {
      title: `شحن ${formatNumber(tx.amount)} Spark`,
      subtitle: tx.note ?? `عبر ${via}`,
      relativeTime,
      positive,
    };
  }

  if (tx.type === "CAMPAIGN_SPEND") {
    const campaignTitle = tx.note?.replace(/^إطلاق حملة:\s*/i, "") ?? "حملة";
    return {
      title: `إطلاق حملة: ${campaignTitle}`,
      subtitle: `−${formatNumber(tx.amount)} Spark`,
      relativeTime,
      positive,
    };
  }

  return {
    title: tx.note ?? "استرداد",
    subtitle: `+${formatNumber(tx.amount)} Spark`,
    relativeTime,
    positive,
  };
}

export const TX_TYPE_LABELS: Record<TxType, string> = {
  TOPUP: "شحن",
  CAMPAIGN_SPEND: "إنفاق حملة",
  REFUND: "استرداد",
};
