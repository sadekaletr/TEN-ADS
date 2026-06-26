/**
 * Automated B6 screenshots for Benchmark UI Sprint pages.
 * Usage: npx tsx scripts/benchmark-screenshots.ts [--base http://localhost:3000]
 */
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const BASE =
  process.argv.find((a) => a.startsWith("--base="))?.split("=")[1] ??
  "http://localhost:3000";

const OUT_DIR = path.join(process.cwd(), "docs", "visual-audit", "screenshots", "benchmark-sprint");

type Shot = {
  id: string;
  path: string;
  name: string;
  auth?: "creator" | "sponsor";
};

const PAGES: Shot[] = [
  { id: "landing", path: "/", name: "Landing" },
  { id: "creators", path: "/creators", name: "Creators directory" },
  { id: "dashboard", path: "/dashboard", name: "Dashboard ATF", auth: "creator" },
  { id: "sponsor-roi", path: "/sponsor/roi", name: "Sponsor ROI", auth: "sponsor" },
  { id: "marketplace", path: "/marketplace", name: "Marketplace", auth: "sponsor" },
  { id: "redeem", path: "/c/SPARK-HERO-H1", name: "Redeem flow" },
  { id: "design-preview", path: "/design-preview", name: "Design preview" },
];

async function loginCreator(page: import("@playwright/test").Page) {
  await page.goto(`${BASE}/login`);
  await page.fill("#phone", "+963900000001");
  await page.fill("#password", "demo1234");
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/, { timeout: 30_000 });
}

async function loginSponsor(page: import("@playwright/test").Page) {
  await page.goto(`${BASE}/sponsor/login`);
  await page.fill("#email", "diwan@tenegta.com");
  await page.fill("#password", "sponsor1234");
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/sponsor/, { timeout: 30_000 });
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome" });
  const results: {
    path: string;
    name: string;
    screenshot: string;
    status: number;
    pass: boolean;
    note: string;
  }[] = [];

  const publicPages = PAGES.filter((p) => !p.auth);
  const creatorPages = PAGES.filter((p) => p.auth === "creator");
  const sponsorPages = PAGES.filter((p) => p.auth === "sponsor");

  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    for (const shot of publicPages) {
      const res = await page.goto(`${BASE}${shot.path}`, {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      await page.waitForTimeout(800);
      const file = `${shot.id}.png`;
      await page.screenshot({ path: path.join(OUT_DIR, file), fullPage: true });
      const hasArabicIndic = /[٠-٩]/.test(await page.innerText("body"));
      results.push({
        path: shot.path,
        name: shot.name,
        screenshot: `benchmark-sprint/${file}`,
        status: res?.status() ?? 0,
        pass: (res?.status() ?? 0) < 400 && !hasArabicIndic,
        note: hasArabicIndic ? "أرقام هندية" : "automated pass",
      });
    }
    await ctx.close();
  }

  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await loginCreator(page);
    for (const shot of creatorPages) {
      const res = await page.goto(`${BASE}${shot.path}`, {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      await page.waitForTimeout(800);
      const file = `${shot.id}.png`;
      await page.screenshot({ path: path.join(OUT_DIR, file), fullPage: true });
      results.push({
        path: shot.path,
        name: shot.name,
        screenshot: `benchmark-sprint/${file}`,
        status: res?.status() ?? 0,
        pass: (res?.status() ?? 0) < 400,
        note: "automated pass",
      });
    }
    await ctx.close();
  }

  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await loginSponsor(page);
    for (const shot of sponsorPages) {
      const res = await page.goto(`${BASE}${shot.path}`, {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      await page.waitForTimeout(800);
      const file = `${shot.id}.png`;
      await page.screenshot({ path: path.join(OUT_DIR, file), fullPage: true });
      results.push({
        path: shot.path,
        name: shot.name,
        screenshot: `benchmark-sprint/${file}`,
        status: res?.status() ?? 0,
        pass: (res?.status() ?? 0) < 400,
        note: "automated pass",
      });
    }
    await ctx.close();
  }

  await browser.close();

  const manifest = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE,
    viewport: "1280x720",
    results,
    allPass: results.every((r) => r.pass),
  };

  const manifestPath = path.join(
    process.cwd(),
    "docs",
    "launch-evidence",
    "BENCHMARK-screenshots.json"
  );
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Wrote ${manifestPath}`);
  console.log(JSON.stringify(manifest, null, 2));

  if (!manifest.allPass) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
