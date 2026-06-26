import { NextResponse } from "next/server";
import { getRecommendedCreatorsForSponsor } from "@/lib/network/recommendations";
import { getSponsorSession } from "@/lib/session-auth";

export async function GET(request: Request) {
  const session = await getSponsorSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const requestedId = searchParams.get("sponsorId");
  if (requestedId && requestedId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const creators = await getRecommendedCreatorsForSponsor(session.user.id);
  return NextResponse.json({ creators });
}
