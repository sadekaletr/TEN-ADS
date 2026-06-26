/**
 * Lighthouse performance capture for / and /c/[code].
 * Run: AUDIT_BASE_URL=http://localhost:3000 npx tsx scripts/lighthouse-spark.ts
 */
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { spawn } from "child_process";

const BASE = process.env.AUDIT_BASE_URL ?? "http://localhost:3000";
const OUT_DIR = path.join(process.cwd(), "docs", "perf");
const PATHS = ["/", "/c/SPARK-HERO-H1"];

function runLighthouse(url: string, outFile: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = [
      url,
      "--output=json",
      `--output-path=${outFile}`,
      "--chrome-flags=--headless",
      "--only-categories=performance",
      "--throttling-method=simulate",
      "--preset=desktop",
    ];
    const child = spawn("npx", ["lighthouse", ...args], {
      shell: true,
      stdio: "inherit",
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`lighthouse exited ${code}`));
    });
  });
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const summary: Record<string, { lcp?: number; cls?: number; score?: number }> = {};

  for (const p of PATHS) {
    const slug = p.replace(/[/?=&]/g, "-").replace(/^-+/, "") || "home";
    const outFile = path.join(OUT_DIR, `lighthouse-${slug}.json`);
    const url = `${BASE}${p}`;
    console.log(`Lighthouse: ${url}`);
    try {
      await runLighthouse(url, outFile);
      const raw = await import(outFile, { assert: { type: "json" } }).catch(async () => {
        const fs = await import("fs/promises");
        return { default: JSON.parse(await fs.readFile(outFile, "utf-8")) };
      });
      const audits = raw.default?.audits ?? {};
      summary[p] = {
        lcp: audits["largest-contentful-paint"]?.numericValue,
        cls: audits["cumulative-layout-shift"]?.numericValue,
        score: raw.default?.categories?.performance?.score,
      };
    } catch (e) {
      console.warn(`Lighthouse skipped for ${p}:`, e);
      summary[p] = { score: undefined };
    }
  }

  await writeFile(
    path.join(OUT_DIR, "lighthouse-spark.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), base: BASE, summary }, null, 2),
    "utf-8"
  );
  console.log("Wrote docs/perf/lighthouse-spark.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
