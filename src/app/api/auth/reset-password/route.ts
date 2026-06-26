import { NextResponse } from "next/server";
import { z } from "zod";
import { resetPasswordWithToken } from "@/lib/password-reset";

const bodySchema = z.object({
  token: z.string().min(20),
  role: z.enum(["creator", "sponsor", "admin", "agency_admin"]),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const parsed = bodySchema.parse(await req.json());
    await resetPasswordWithToken(parsed.token, parsed.role, parsed.password);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
