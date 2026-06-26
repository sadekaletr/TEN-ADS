/**
 * Measure p95 latency for critical routes.
 * Usage: npx tsx scripts/perf-dashboard-p95.ts [--base http://localhost:3000]
 */
import { percentile } from "../src/lib/stats-utils";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const BASE = process.argv.find((a) => a.startsWith("--base="))?.split("=")[1] ?? "http://localhost:3000";
const PHONE = process.env.PERF_CREATOR_PHONE ?? "+963900000001";
const PASSWORD = process.env.PERF_CREATOR_PASSWORD ?? "demo1234";
const SAMPLES = 20;
const GATE_P95_MS = 104;

const PUBLIC_ROUTES = ["/", "/creators", "/c/SPARK-HERO-H1"] as const;

async function loginCreator(): Promise<string> {
  const csrfRes = await fetch(`${BASE}/api/auth/csrf`);
  const { csrfToken } = (await csrfRes.json()) as { csrfToken: string };
  const cookieHeader = csrfRes.headers.getSetCookie?.().join("; ") ?? "";

  const body = new URLSearchParams({
    csrfToken,
    identifier: PHONE,
    password: PASSWORD,
    callbackUrl: `${BASE}/dashboard`,
    json: "true",
  });

  const res = await fetch(`${BASE}/api/auth/callback/creator`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookieHeader,
    },
    body,
    redirect: "manual",
  });

  const setCookie = res.headers.getSetCookie?.() ?? [];
  const session = setCookie.find(
    (c) =>
      c.startsWith("next-auth.session-token") ||
      c.startsWith("__Secure-next-auth.session-token")
  );
  if (!session) {
    throw new Error(`Creator login failed — status ${res.status}`);
  }
  return setCookie.map((c) => c.split(";")[0]).join("; ");
}

async function measureRoute(
  route: string,
  cookie?: string
): Promise<{ route: string; p95Ms: number; durationsMs: number[] }> {
  const durations: number[] = [];
  for (let i = 0; i < SAMPLES; i++) {
    const start = performance.now();
    const res = await fetch(`${BASE}${route}`, {
      headers: cookie ? { Cookie: cookie } : undefined,
      redirect: "manual",
    });
    const ms = performance.now() - start;
    if (res.status >= 400) {
      throw new Error(`${route} returned ${res.status} on sample ${i + 1}`);
    }
    durations.push(ms);
  }
  durations.sort((a, b) => a - b);
  return {
    route,
    p95Ms: Math.round(percentile(durations, 95) ?? 0),
    durationsMs: durations.map((d) => Math.round(d)),
  };
}

async function main() {
  const creatorCookie = await loginCreator();

  const routeResults = await Promise.all([
    ...PUBLIC_ROUTES.map((route) => measureRoute(route)),
    measureRoute("/dashboard", creatorCookie),
  ]);

  const dashboard = routeResults.find((r) => r.route === "/dashboard")!;
  const result = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE,
    samples: SAMPLES,
    routes: routeResults,
    p95Ms: dashboard.p95Ms,
    durationsMs: dashboard.durationsMs,
    targetP95Ms: 500,
    pass: dashboard.p95Ms < 500,
  };

  const outDir = path.join(process.cwd(), "docs", "launch-evidence");
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, "B5-perf.json");
  const benchmarkPath = path.join(outDir, "BENCHMARK-perf.json");
  const baselineP95Ms = 87;
  const allGatePass = routeResults.every((r) => r.p95Ms <= GATE_P95_MS);
  const benchmarkResult = {
    ...result,
    baselineP95Ms,
    gateP95Ms: GATE_P95_MS,
    gatePass: dashboard.p95Ms <= GATE_P95_MS,
    allRoutesGatePass: allGatePass,
    note: "Professionalization audit — multi-route p95; gate +20% vs B5 baseline (87ms)",
  };
  await writeFile(outPath, JSON.stringify(result, null, 2));
  await writeFile(benchmarkPath, JSON.stringify(benchmarkResult, null, 2));
  console.log(JSON.stringify(benchmarkResult, null, 2));
  console.log(`Wrote ${outPath} and ${benchmarkPath}`);
  if (!benchmarkResult.gatePass) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
