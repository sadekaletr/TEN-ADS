import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await prisma.agencyMember.updateMany({
    data: { spentThisMonth: 0 },
  });

  return NextResponse.json({
    reset: result.count,
    at: new Date().toISOString(),
  });
}
