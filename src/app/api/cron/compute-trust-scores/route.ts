import { NextResponse } from "next/server";
import { recalculateAllTrustScores } from "@/lib/intelligence/trust-score";

export async function POST(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await recalculateAllTrustScores();
  return NextResponse.json({ computed: results.length });
}
