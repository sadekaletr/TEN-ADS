import { NextResponse } from "next/server";
import { computeSponsorStreaks } from "@/lib/intelligence/streaks";

export async function POST(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updated = await computeSponsorStreaks();
  return NextResponse.json({ updated });
}
