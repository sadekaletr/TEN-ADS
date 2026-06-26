/**
 * Measure authenticated p95 latency for /dashboard (20 requests).
 * Usage: npx tsx scripts/perf-dashboard-p95.ts [--base http://localhost:3000]
 */
import { percentile } from "../src/lib/stats-utils";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const BASE = process.argv.find((a) => a.startsWith("--base="))?.split("=")[1] ?? "http://localhost:3000";
const PHONE = process.env.PERF_CREATOR_PHONE ?? "+963910000001";
const PASSWORD = process.env.PERF_CREATOR_PASSWORD ?? "beta1234";
const SAMPLES = 20;

async function login(): Promise<string> {
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
    throw new Error(`Login failed — status ${res.status}`);
  }
  return setCookie.map((c) => c.split(";")[0]).join("; ");
}

async function main() {
  const cookie = await login();
  const durations: number[] = [];

  for (let i = 0; i < SAMPLES; i++) {
    const start = performance.now();
    const res = await fetch(`${BASE}/dashboard`, {
      headers: { Cookie: cookie },
      redirect: "manual",
    });
    const ms = performance.now() - start;
    if (res.status >= 400) {
      throw new Error(`/dashboard returned ${res.status} on sample ${i + 1}`);
    }
    durations.push(ms);
  }

  durations.sort((a, b) => a - b);
  const p95 = percentile(durations, 95) ?? 0;
  const result = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE,
    samples: SAMPLES,
    durationsMs: durations.map((d) => Math.round(d)),
    p50Ms: Math.round(percentile(durations, 50) ?? 0),
    p95Ms: Math.round(p95),
    targetP95Ms: 500,
    pass: p95 < 500,
  };

  const outDir = path.join(process.cwd(), "docs", "launch-evidence");
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, "B5-perf.json");
  const benchmarkPath = path.join(outDir, "BENCHMARK-perf.json");
  const gateP95Ms = 104;
  const baselineP95Ms = 87;
  const benchmarkResult = {
    ...result,
    baselineP95Ms,
    gateP95Ms,
    gatePass: result.p95Ms <= gateP95Ms,
    note: "Benchmark UI sprint post-deploy — gate is +20% vs B5 baseline (87ms)",
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
