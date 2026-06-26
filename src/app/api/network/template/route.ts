import { NextResponse } from "next/server";
import { getBestCampaignTemplate } from "@/lib/network/recommendations";
import { getCreatorSession } from "@/lib/session-auth";

export async function GET(request: Request) {
  const session = await getCreatorSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const requestedId = searchParams.get("creatorId");
  if (requestedId && requestedId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const template = await getBestCampaignTemplate(session.user.id);
  return NextResponse.json({ template });
}
