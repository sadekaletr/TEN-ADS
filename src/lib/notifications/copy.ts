type NotificationCopyKey =
  | "topupApproved"
  | "topupRejected"
  | "campaignEnding"
  | "milestone"
  | "collabRequest"
  | "collabAccepted"
  | "prizesExhausted"
  | "referralMilestone";

const COPY: Record<
  NotificationCopyKey,
  { title: string; body: (p: Record<string, string | number>) => string }
> = {
  topupApproved: {
    title: "تمت الموافقة على شحنك",
    body: (p) => `+${p.amount} Spark أُضيفت إلى محفظتك عبر ${p.method ?? "ShamCash"}.`,
  },
  topupRejected: {
    title: "تم رفض طلب الشحن",
    body: (p) => (p.reason ? String(p.reason) : "راجع المحفظة للتفاصيل."),
  },
  campaignEnding: {
    title: "الحملة قاربت على الانتهاء",
    body: (p) =>
      `حملة «${p.campaignTitle}» وصلت إلى ${p.claimed} من ${p.total} جائزة (${p.percent}%).`,
  },
  milestone: {
    title: "إنجاز جديد",
    body: (p) => `تم استرداد الجائزة رقم ${p.count} في حملة «${p.campaignTitle}».`,
  },
  collabRequest: {
    title: "طلب تعاون جديد",
    body: (p) => `${p.sponsorName} يريد التعاون معك.`,
  },
  collabAccepted: {
    title: "تم قبول طلب التعاون",
    body: (p) => `${p.creatorName} قبل طلب التعاون.`,
  },
  prizesExhausted: {
    title: "نفدت جوائز الحملة",
    body: (p) =>
      `حملة «${p.campaignTitle}» اكتملت (${p.total} جائزة). يمكنك تجديد الكمية أو إطلاق حملة جديدة.`,
  },
  referralMilestone: {
    title: "مكافأة دعوة",
    body: (p) =>
      `وصلت دعواتك إلى ${p.count} أصدقاء في حملة «${p.campaignTitle}» — شكراً لمشاركتك!`,
  },
};

export function notificationCopy(
  key: NotificationCopyKey,
  params: Record<string, string | number> = {}
) {
  const entry = COPY[key];
  return { title: entry.title, body: entry.body(params) };
}
