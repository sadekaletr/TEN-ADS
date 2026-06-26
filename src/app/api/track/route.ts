import { NextResponse } from "next/server";
import { z } from "zod";
import { trackCampaignEvent } from "@/lib/analytics";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import {
  RATE_LIMITS,
  checkRateLimit,
  rateLimitKey,
} from "@/lib/rate-limit";

const trackSchema = z.object({
  campaignId: z.string(),
  sessionId: z.string(),
  type: z.enum([
    "PAGE_VIEW",
    "CODE_SUBMIT",
    "REDEMPTION_STARTED",
    "REDEMPTION_COMPLETED",
    "REDEMPTION_FAILED",
  ]),
  metadata: z.record(z.unknown()).optional(),
});

function getIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  const ip = getIp(request);
  const limited = await checkRateLimit(
    rateLimitKey("track", ip),
    RATE_LIMITS.track
  );
  if (limited) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = trackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const campaign = await prisma.campaign.findFirst({
    where: { id: parsed.data.campaignId, ...notDeleted },
    select: { id: true },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  await trackCampaignEvent(parsed.data, request.headers);
  return NextResponse.json({ ok: true });
}
