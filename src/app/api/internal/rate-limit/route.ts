import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const bodySchema = z.object({
  key: z.string().min(1),
  limit: z.number().int().positive(),
  windowMs: z.number().int().positive(),
});

export async function POST(request: Request) {
  const secret = request.headers.get("x-rate-limit-secret");
  const expected = process.env.RATE_LIMIT_INTERNAL_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const limited = await checkRateLimit(body.key, {
    limit: body.limit,
    windowMs: body.windowMs,
  });

  return NextResponse.json({ limited });
}
