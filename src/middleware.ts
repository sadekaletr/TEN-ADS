import { getToken } from "next-auth/jwt";

import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import {

  RATE_LIMITS,

  checkRateLimitSync,

  rateLimitKey,

  type RateLimitConfig,

} from "@/lib/rate-limit-memory";



function getIp(req: NextRequest): string {

  return (

    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||

    req.headers.get("x-real-ip") ||

    "unknown"

  );

}



async function checkRateLimitEdge(

  req: NextRequest,

  key: string,

  config: RateLimitConfig

): Promise<boolean> {

  const secret = process.env.RATE_LIMIT_INTERNAL_SECRET;

  const isDev = process.env.NODE_ENV !== "production";



  if (!secret) {

    if (isDev) return checkRateLimitSync(key, config);

    console.error("[middleware] RATE_LIMIT_INTERNAL_SECRET missing");

    return true;

  }



  try {

    const controller = new AbortController();

    const timeout = setTimeout(() => controller.abort(), 300);



    const res = await fetch(`${req.nextUrl.origin}/api/internal/rate-limit`, {

      method: "POST",

      headers: {

        "content-type": "application/json",

        "x-rate-limit-secret": secret,

      },

      body: JSON.stringify({

        key,

        limit: config.limit,

        windowMs: config.windowMs,

      }),

      signal: controller.signal,

    });



    clearTimeout(timeout);



    if (!res.ok) {

      if (isDev) return checkRateLimitSync(key, config);

      return true;

    }



    const data = (await res.json()) as { limited?: boolean };

    return Boolean(data.limited);

  } catch {

    if (isDev) return checkRateLimitSync(key, config);

    return true;

  }

}



export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const ip = getIp(req);

  if (
    path === "/design-preview" &&
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DESIGN_PREVIEW !== "1"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }



  if (path.startsWith("/c/") || path === "/redeem") {

    const limited = await checkRateLimitEdge(

      req,

      rateLimitKey("redeem", ip),

      RATE_LIMITS.redeem

    );

    if (limited) {

      return new NextResponse("Too many requests", { status: 429 });

    }

  }



  if (

    path === "/login" ||

    path === "/admin/login" ||

    path === "/sponsor/login" ||

    path === "/agency/login"

  ) {

    const skipLoginLimit =
      process.env.NODE_ENV !== "production" &&
      process.env.DISABLE_LOGIN_RATE_LIMIT === "1";

    if (!skipLoginLimit) {
    const limited = await checkRateLimitEdge(

      req,

      rateLimitKey("login", ip),

      RATE_LIMITS.login

    );

    if (limited) {

      return new NextResponse("Too many requests", { status: 429 });

    }
    }

  }



  const token = await getToken({

    req,

    secret: process.env.NEXTAUTH_SECRET,

  });



  if (path.startsWith("/admin")) {

    if (path === "/admin/login") {

      return NextResponse.next();

    }

    if (token?.role !== "admin") {

      return NextResponse.redirect(new URL("/admin/login", req.url));

    }

  }



  if (path.startsWith("/dashboard")) {

    if (token?.role !== "creator") {

      return NextResponse.redirect(new URL("/login", req.url));

    }

  }



  if (path.startsWith("/sponsor")) {
    if (path === "/sponsor/login") {
      return NextResponse.next();
  }
    if (token?.role !== "sponsor") {
      return NextResponse.redirect(new URL("/sponsor/login", req.url));
    }
  }



  if (path.startsWith("/marketplace")) {

    if (token?.role !== "sponsor") {

      return NextResponse.redirect(new URL("/sponsor/login", req.url));

    }

  }



  if (path.startsWith("/agency")) {

    if (path === "/agency/login") {

      return NextResponse.next();

    }

    if (token?.role !== "agency_admin") {

      return NextResponse.redirect(new URL("/agency/login", req.url));

    }

  }



  if (path.startsWith("/intelligence")) {

    if (

      token?.role !== "creator" &&

      token?.role !== "sponsor" &&

      token?.role !== "admin"

    ) {

      return NextResponse.redirect(new URL("/login", req.url));

    }

  }



  return NextResponse.next();

}



export const config = {

  matcher: [

    "/dashboard/:path*",

    "/admin/:path*",

    "/agency/:path*",

    "/sponsor/:path*",

    "/partner",

    "/marketplace/:path*",

    "/intelligence/:path*",

    "/c/:path*",

    "/redeem",

    "/design-preview",

    "/login",

    "/admin/login",

    "/sponsor/login",

    "/agency/login",

  ],

};

