import { NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-keys";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";

export async function GET(req: Request) {
  const key = req.headers.get("x-api-key");
  if (!key) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const apiKey = await verifyApiKey(key);
  if (!apiKey || !apiKey.scopes.includes("campaigns:read")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const campaigns = await prisma.campaign.findMany({
    where: {
      ...(apiKey.creatorId ? { creatorId: apiKey.creatorId } : {}),
      status: "ACTIVE",
      ...notDeleted,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      prizeName: true,
      prizeQuantity: true,
      prizeClaimed: true,
      status: true,
    },
    take: 50,
  });

  return NextResponse.json({ data: campaigns });
}
