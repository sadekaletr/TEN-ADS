/**
 * Capture /admin/beta screenshot after volume seed (local evidence).
 * Usage: npx tsx scripts/capture-beta-metrics.ts
 */
import { chromium } from "@playwright/test";
import path from "path";
import { mkdir } from "fs/promises";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const OUT = path.join(process.cwd(), "docs", "launch-evidence", "B5-beta-metrics.png");

async function main() {
  await mkdir(path.dirname(OUT), { recursive: true });
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(`${BASE}/admin/login`);
  await page.fill("#admin-email", "admin@tenegta.com");
  await page.fill("#admin-password", "admin1234");
  await Promise.all([
    page.waitForURL(
      (url) => {
        const p = new URL(url).pathname;
        return p.startsWith("/admin") && p !== "/admin/login";
      },
      { timeout: 45_000 }
    ),
    page.getByRole("button", { name: /دخول/i }).click(),
  ]);
  await page.goto(`${BASE}/admin/beta`);
  await page.getByRole("heading", { name: "Beta Metrics" }).waitFor({ timeout: 15_000 });
  await page.screenshot({ path: OUT, fullPage: true });
  await browser.close();
  console.log(`Wrote ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
