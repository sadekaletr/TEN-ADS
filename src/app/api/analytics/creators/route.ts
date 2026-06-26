import { NextResponse } from "next/server";
import { z } from "zod";
import { persistLandingEvent } from "@/lib/analytics/landing-track-server";
import { CREATORS_EVENT_NAMES } from "@/lib/analytics/creators-event-names";
import {
  RATE_LIMITS,
  checkRateLimit,
  rateLimitKey,
} from "@/lib/rate-limit";

const creatorsEventSchema = z.object({
  name: z.enum(CREATORS_EVENT_NAMES),
  locale: z.enum(["ar", "en"]),
  dir: z.enum(["rtl", "ltr"]),
  sessionId: z.string().min(1),
  section: z.string().optional(),
  cta_label: z.string().optional(),
  ts: z.number().optional(),
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

  const parsed = creatorsEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    await persistLandingEvent({
      name: parsed.data.name,
      sessionId: parsed.data.sessionId,
      locale: parsed.data.locale,
      dir: parsed.data.dir,
      section: parsed.data.section,
      ctaLabel: parsed.data.cta_label,
      metadata: parsed.data.metadata,
    });
  } catch {
    // silent success — don't block UX on analytics failures
  }

  return NextResponse.json({ ok: true });
}
