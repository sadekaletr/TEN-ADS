import { NextResponse } from "next/server";
import { getCampaignInsights } from "@/lib/intelligence/graph";
import { getCreatorSession } from "@/lib/session-auth";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getCreatorSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const campaign = await prisma.campaign.findFirst({
    where: { id: params.id, creatorId: session.user.id, ...notDeleted },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const insights = await getCampaignInsights(params.id);
  return NextResponse.json({ insights });
}
