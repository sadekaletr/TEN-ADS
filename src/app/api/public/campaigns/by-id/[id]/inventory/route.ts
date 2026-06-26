import { NextResponse } from "next/server";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const campaign = await prisma.campaign.findFirst({
    where: { id, ...notDeleted },
    select: {
      prizeClaimed: true,
      prizeQuantity: true,
      status: true,
    },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(
    {
      prizeClaimed: campaign.prizeClaimed,
      prizeQuantity: campaign.prizeQuantity,
      status: campaign.status,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
