import { NextResponse } from "next/server";
import { notDeleted } from "@/lib/db";
import { sendTransactionalEmail } from "@/lib/email";
import { getCreatorAnalytics } from "@/lib/analytics";
import { canReceiveMonthlyReport } from "@/lib/plans/entitlements";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const creators = await prisma.creator.findMany({
    where: { ...notDeleted, email: { not: null } },
    select: { id: true, name: true, email: true, planTier: true },
  });

  let sent = 0;
  let skipped = 0;

  for (const creator of creators) {
    if (!creator.email || !canReceiveMonthlyReport(creator)) {
      skipped++;
      continue;
    }

    const analytics = await getCreatorAnalytics(creator.id);
    const html = `
      <h2>تقرير TENEGTA Spark الشهري</h2>
      <p>مرحباً ${creator.name}،</p>
      <ul>
        <li>حملات نشطة: ${analytics.activeCampaigns}</li>
        <li>استردادات: ${analytics.funnel.redemptions}</li>
        <li>مشاهدات: ${analytics.funnel.views}</li>
        <li>جوائز مُستردة: ${analytics.totalPrizesClaimed}</li>
      </ul>
      <p>رصيدك الحالي يُدار من لوحة التحكم.</p>
    `;

    const result = await sendTransactionalEmail({
      to: creator.email,
      subject: `تقريرك الشهري — TENEGTA Spark`,
      html,
    });

    if (result.ok) sent++;
    else skipped++;
  }

  return NextResponse.json({ sent, skipped, eligible: creators.length });
}
