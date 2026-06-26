import { chromium, type Page } from "@playwright/test";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getAuditRoutes, type AuditRoute } from "./visual-audit-urls";

const BASE = process.env.AUDIT_BASE_URL ?? "http://localhost:3000";
const OUT_DIR = path.join(process.cwd(), "docs", "visual-audit", "screenshots");

type PageMetrics = {
  maxFontPx: number;
  background: string;
  hasDecorativeParticles: boolean;
  hasArabicIndicDigits: boolean;
  status: number;
  title: string;
};

async function collectMetrics(page: Page): Promise<PageMetrics> {
  return page.evaluate(() => {
    const headings = Array.from(
      document.querySelectorAll("h1, h2, [class*='text-5xl'], [class*='text-7xl']")
    );
    let maxFontPx = 0;
    for (const el of headings) {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs > maxFontPx) maxFontPx = fs;
    }
    const bodyBg = getComputedStyle(document.body).background;
    const bodyBgImage = getComputedStyle(document.body).backgroundImage;
    const hasGradient =
      bodyBgImage.includes("gradient") ||
      !!document.querySelector("[class*='aurora'], [class*='gradient']");
    const particleEls = document.querySelectorAll(
      "[aria-hidden] .opacity-20, [class*='particle'], [class*='aurora']"
    );
    const text = document.body.innerText;
    const hasArabicIndicDigits = /[٠-٩]/.test(text);
    return {
      maxFontPx: Math.round(maxFontPx),
      background: hasGradient ? "gradient" : bodyBg.includes("rgb") ? "solid" : "other",
      hasDecorativeParticles: particleEls.length > 2,
      hasArabicIndicDigits,
      status: 200,
      title: document.title,
    };
  });
}

async function loginCreator(page: Page) {
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForSelector("#phone", { timeout: 60_000 });
  await page.fill("#phone", "+963900000001");
  await page.fill("#password", "demo1234");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard**", { timeout: 60_000 });
}

async function loginSponsor(page: Page) {
  await page.goto(`${BASE}/sponsor/login`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForSelector("#email", { timeout: 60_000 });
  await page.fill("#email", "diwan@tenegta.com");
  await page.fill("#password", "sponsor1234");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/sponsor**", { timeout: 60_000 });
}

async function loginAdmin(page: Page) {
  await page.goto(`${BASE}/admin/login`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForSelector("#admin-email", { timeout: 60_000 });
  await page.fill("#admin-email", "admin@tenegta.com");
  await page.fill("#admin-password", "admin1234");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/admin**", { timeout: 60_000 });
}

async function loginAgency(page: Page) {
  await page.goto(`${BASE}/agency/login`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForSelector("#agency-email", { timeout: 60_000 });
  await page.fill("#agency-email", "agency@tenegta.com");
  await page.fill("#agency-password", "agency1234");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/agency/**", { timeout: 60_000 });
}

function evaluatePass(route: AuditRoute, m: PageMetrics): { pass: boolean; note: string } {
  const notes: string[] = [];
  if (m.hasArabicIndicDigits) notes.push("أرقام هندية عربية");
  if (m.hasDecorativeParticles && route.path === "/") {
    notes.push("جزيئات/زخارف زخرفية على Landing");
  }
  if (route.path === "/design-preview" && m.hasArabicIndicDigits) {
    notes.push("أرقام هندية عربية في design-preview");
  }
  if (route.path === "/" && m.maxFontPx < 48) {
    notes.push(`Hero أصغر من 48px (${m.maxFontPx}px)`);
  }
  const pass = notes.length === 0;
  return { pass, note: pass ? "يطابق التقرير" : notes.join("; ") };
}

async function auditRoute(
  page: Page,
  route: AuditRoute,
  authDone: Set<string>
): Promise<{ route: AuditRoute; metrics: PageMetrics; pass: boolean; note: string }> {
  if (route.auth && !authDone.has(route.auth)) {
    if (route.auth === "creator") await loginCreator(page);
    if (route.auth === "sponsor") await loginSponsor(page);
    if (route.auth === "admin") await loginAdmin(page);
    if (route.auth === "agency") await loginAgency(page);
    authDone.add(route.auth);
  }

  const res = await page.goto(`${BASE}${route.path}`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await page.waitForTimeout(1200);
  const metrics = await collectMetrics(page);
  metrics.status = res?.status() ?? 0;

  await page.screenshot({
    path: path.join(OUT_DIR, route.screenshot),
    fullPage: false,
  });

  const { pass, note } = evaluatePass(route, metrics);
  return { route, metrics, pass, note };
}

async function launchBrowser() {
  return chromium.launch({ headless: true, channel: "chrome" });
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const routes = await getAuditRoutes();
  const browser = await launchBrowser();

  const publicRoutes = routes.filter((r) => !r.auth);
  const creatorRoutes = routes.filter((r) => r.auth === "creator");
  const sponsorRoutes = routes.filter((r) => r.auth === "sponsor");
  const adminRoutes = routes.filter((r) => r.auth === "admin");
  const agencyRoutes = routes.filter((r) => r.auth === "agency");

  const results: Awaited<ReturnType<typeof auditRoute>>[] = [];

  async function runBatch(batch: AuditRoute[], preLogin?: (page: Page) => Promise<void>) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    const batchAuth = new Set<string>();
    if (preLogin) {
      await preLogin(page);
      if (batch[0]?.auth) batchAuth.add(batch[0].auth);
    }
    for (const route of batch) {
      try {
        console.log(`Auditing ${route.id}/48: ${route.path}`);
        results.push(await auditRoute(page, route, batchAuth));
      } catch (e) {
        console.error(`Failed ${route.path}:`, e);
        results.push({
          route,
          metrics: {
            maxFontPx: 0,
            background: "error",
            hasDecorativeParticles: false,
            hasArabicIndicDigits: false,
            status: 0,
            title: "error",
          },
          pass: false,
          note: `خطأ: ${e instanceof Error ? e.message : String(e)}`,
        });
      }
    }
    await context.close();
  }

  await runBatch(creatorRoutes, loginCreator);
  await runBatch(sponsorRoutes, loginSponsor);
  await runBatch(adminRoutes, loginAdmin);
  await runBatch(agencyRoutes, loginAgency);
  await runBatch(publicRoutes);

  await browser.close();

  results.sort((a, b) => a.route.id - b.route.id);

  const lines = [
    "# Visual Audit Matrix — TENEGTA Spark",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Base URL: ${BASE}`,
    "",
    "| # | Path | Screenshot | Max font (px) | Background | Decorations | Digits | Status | Match | Notes |",
    "|---|------|------------|---------------|------------|-------------|--------|--------|-------|-------|",
  ];

  for (const r of results) {
    const digits = r.metrics.hasArabicIndicDigits ? "هندية" : "لاتينية";
    const deco = r.metrics.hasDecorativeParticles ? "نعم" : "لا";
    const match = r.pass ? "✅" : "❌";
    lines.push(
      `| ${r.route.id} | \`${r.route.path}\` | [${r.route.screenshot}](./screenshots/${r.route.screenshot}) | ${r.metrics.maxFontPx} | ${r.metrics.background} | ${deco} | ${digits} | ${r.metrics.status} | ${match} | ${r.note} |`
    );
  }

  const failCount = results.filter((r) => !r.pass).length;
  lines.push("", `**Summary:** ${results.length - failCount}/${results.length} passed, ${failCount} need fixes (Phase 2).`);

  const matrixPath = path.join(process.cwd(), "docs", "visual-audit", "MATRIX.md");
  await writeFile(matrixPath, lines.join("\n"), "utf-8");
  console.log(`Wrote ${matrixPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
