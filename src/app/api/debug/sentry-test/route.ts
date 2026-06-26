import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function GET() {
  if (process.env.NODE_ENV === "production" && !process.env.ENABLE_SENTRY_TEST) {
    return NextResponse.json({ error: "Disabled in production" }, { status: 404 });
  }
  const err = new Error("TENEGTA Sentry test — intentional");
  Sentry.captureException(err);
  throw err;
}
