import { NextResponse } from "next/server";
import { getCreatorInsights } from "@/lib/intelligence/graph";
import { getLatestSparkScore } from "@/lib/intelligence/spark-score";
import { getCreatorSession } from "@/lib/session-auth";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getCreatorSession();
  if (!session || session.user.id !== params.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [insights, sparkScore] = await Promise.all([
    getCreatorInsights(params.id),
    getLatestSparkScore(params.id),
  ]);

  return NextResponse.json({ insights, sparkScore });
}
