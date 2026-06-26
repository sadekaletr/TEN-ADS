import { NextResponse } from "next/server";
import { getCampaignRecommendations } from "@/lib/intelligence/recommendations";
import { getCreatorSession } from "@/lib/session-auth";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getCreatorSession();
  if (!session || session.user.id !== params.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const recommendation = await getCampaignRecommendations(params.id);
  return NextResponse.json({ recommendation });
}
