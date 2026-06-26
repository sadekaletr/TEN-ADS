import { NextResponse } from "next/server";
import { aggregateCampaignMetrics } from "@/lib/intelligence/aggregate";
import { computeAllSparkScores } from "@/lib/intelligence/spark-score";

export async function POST(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [scoreResults, aggregated] = await Promise.all([
    computeAllSparkScores(),
    aggregateCampaignMetrics(),
  ]);
  return NextResponse.json({
    computed: scoreResults.length,
    hourlyBuckets: aggregated,
  });
}
