import { NextResponse } from "next/server";
import { z } from "zod";
import { requestPasswordReset } from "@/lib/password-reset";

const bodySchema = z.object({
  email: z.string().email(),
  role: z.enum(["creator", "sponsor", "admin", "agency_admin"]),
});

export async function POST(req: Request) {
  try {
    const parsed = bodySchema.parse(await req.json());
    await requestPasswordReset(parsed.email, parsed.role);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
