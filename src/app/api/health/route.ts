import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: true, db: "up" });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
