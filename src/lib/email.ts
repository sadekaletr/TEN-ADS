import { spark } from "@/lib/format";

/**
 * Optional transactional email via Resend.
 * Set RESEND_API_KEY and EMAIL_FROM in production.
 */
export async function sendTransactionalEmail(input: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[email] RESEND_API_KEY or EMAIL_FROM missing — skipped");
    }
    return { ok: false as const, skipped: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[email] send failed", body);
    return { ok: false as const, skipped: false, error: body };
  }

  return { ok: true as const };
}

export async function emailTopUpApproved(to: string, amount: number) {
  return sendTransactionalEmail({
    to,
    subject: "تمت الموافقة على شحن Spark",
    html: `<p>تمت إضافة <strong>${spark(amount)} Spark</strong> إلى محفظتك.</p>`,
  });
}

export async function emailAdminTopUpPending(input: {
  to: string;
  creatorHandle: string;
  amount: number;
  requestId: string;
}) {
  return sendTransactionalEmail({
    to: input.to,
    subject: "طلب شحن جديد — يتطلب مراجعة",
    html: `<p>طلب شحن من <strong>${input.creatorHandle}</strong> بمقدار <strong>${spark(input.amount)} Spark</strong>.</p><p>معرّف الطلب: ${input.requestId}</p>`,
  });
}

export async function emailRedemptionReceipt(input: {
  to: string;
  campaignTitle: string;
  prizeName: string;
}) {
  return sendTransactionalEmail({
    to: input.to,
    subject: "تأكيد استرداد جائزة",
    html: `<p>تم تسجيل استردادك من حملة <strong>${input.campaignTitle}</strong>.</p><p>الجائزة: ${input.prizeName}</p>`,
  });
}
