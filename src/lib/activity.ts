import type { AuditLog } from "@prisma/client";

const ACTION_LABELS: Record<string, string> = {
  "campaign.created": "أنشأ حملة جديدة",
  "campaign.archived": "أرشف حملة",
  "wallet.topup_requested": "طلب شحن المحفظة",
  "wallet.topup_approved": "تمت الموافقة على شحن المحفظة",
  "wallet.topup_rejected": "تم رفض طلب الشحن",
  "wallet.adjusted": "تم تعديل الرصيد",
  "creator.verified_toggled": "تم تحديث حالة التوثيق",
  "redemption.completed": "تم استرداد جائزة",
  "auth.login_failed": "محاولة دخول فاشلة",
};

export function formatActivityMessage(log: AuditLog): string {
  const label = ACTION_LABELS[log.action] ?? log.action;
  const meta = log.metadata as Record<string, unknown> | null;

  switch (log.action) {
    case "campaign.created":
      return `${label}: ${(meta?.title as string) ?? ""}`;
    case "wallet.topup_requested":
    case "wallet.topup_approved":
      return `${label} — ${meta?.amount ?? ""} Spark`;
    case "wallet.topup_rejected":
      return label;
    case "redemption.completed":
      return `${label} — ${meta?.fullName ?? ""}`;
    case "campaign.archived":
      return `${label}: ${(meta?.title as string) ?? ""}`;
    default:
      return label;
  }
}

export function formatActivityTime(date: Date): string {
  return new Intl.DateTimeFormat("ar-SY", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
