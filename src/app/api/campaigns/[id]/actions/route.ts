import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const actions = await prisma.campaignAction.findMany({
    where: { campaignId: params.id },
    orderBy: { sortOrder: "asc" },
  });

  const campaign = await prisma.campaign.findFirst({
    where: { id: params.id, status: "ACTIVE", ...notDeleted },
    select: { id: true, title: true },
  });
  if (!campaign) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ campaignId: campaign.id, actions });
}
