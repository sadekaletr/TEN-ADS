import { test, expect } from "@playwright/test";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getAuditRoutes } from "../../scripts/visual-audit-urls";

const OUT_DIR = path.join(process.cwd(), "docs", "visual-audit", "screenshots");

test.describe.configure({ mode: "serial" });

test("visual audit — 48 pages", async ({ browser }) => {
  test.setTimeout(600_000);
  await mkdir(OUT_DIR, { recursive: true });
  const routes = await getAuditRoutes();
  const results: {
    id: number;
    path: string;
    screenshot: string;
    maxFontPx: number;
    background: string;
    decorations: string;
    digits: string;
    status: number;
    pass: boolean;
    note: string;
  }[] = [];

  async function auditPage(
    page: import("@playwright/test").Page,
    route: (typeof routes)[0]
  ) {
    const res = await page.goto(route.path, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForTimeout(800);
    const metrics = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll("h1, h2"));
      let maxFontPx = 0;
      for (const el of headings) {
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs > maxFontPx) maxFontPx = fs;
      }
      const hasGradient =
        getComputedStyle(document.body).backgroundImage.includes("gradient") ||
        !!document.querySelector("[class*='gradient']");
      const particles = document.querySelectorAll("[class*='particle'], [class*='aurora']").length;
      const hasArabicIndicDigits = /[٠-٩]/.test(document.body.innerText);
      return {
        maxFontPx: Math.round(maxFontPx),
        background: hasGradient ? "gradient" : "solid",
        hasParticles: particles > 0,
        hasArabicIndicDigits,
      };
    });
    await page.screenshot({ path: path.join(OUT_DIR, route.screenshot) });
    const notes: string[] = [];
    if (metrics.hasArabicIndicDigits) notes.push("أرقام هندية");
    if (metrics.hasParticles && route.path === "/") notes.push("زخارف Landing");
    if (route.path === "/" && metrics.maxFontPx < 48) notes.push(`Hero ${metrics.maxFontPx}px`);
    results.push({
      id: route.id,
      path: route.path,
      screenshot: route.screenshot,
      maxFontPx: metrics.maxFontPx,
      background: metrics.background,
      decorations: metrics.hasParticles ? "نعم" : "لا",
      digits: metrics.hasArabicIndicDigits ? "هندية" : "لاتينية",
      status: res?.status() ?? 0,
      pass: notes.length === 0 && (res?.status() ?? 0) < 400,
      note: notes.length ? notes.join("; ") : "يطابق التقرير",
    });
  }

  const publicRoutes = routes.filter((r) => !r.auth);
  const creatorRoutes = routes.filter((r) => r.auth === "creator");
  const sponsorRoutes = routes.filter((r) => r.auth === "sponsor");
  const adminRoutes = routes.filter((r) => r.auth === "admin");
  const agencyRoutes = routes.filter((r) => r.auth === "agency");

  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    for (const r of publicRoutes) await auditPage(page, r);
    await ctx.close();
  }

  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto("/login");
    await page.fill("#phone", "+963900000001");
    await page.fill("#password", "demo1234");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });
    for (const r of creatorRoutes) await auditPage(page, r);
    await ctx.close();
  }

  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto("/sponsor/login");
    await page.fill("#email", "diwan@tenegta.com");
    await page.fill("#password", "sponsor1234");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/sponsor/, { timeout: 30_000 });
    for (const r of sponsorRoutes) await auditPage(page, r);
    await ctx.close();
  }

  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto("/admin/login");
    await page.fill("#admin-email", "admin@tenegta.com");
    await page.fill("#admin-password", "admin1234");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin/, { timeout: 30_000 });
    await expect(page).not.toHaveURL(/\/admin\/login/);
    await page.goto("/admin");
    await expect(page).not.toHaveURL(/\/admin\/login/);
    for (const r of adminRoutes) {
      if (r.path === "/admin/beta") {
        await page.goto("/admin/beta");
        await expect(page).toHaveURL(/\/admin\/beta/, { timeout: 15_000 });
        await expect(page.getByRole("heading", { name: "Beta Metrics" })).toBeVisible();
      }
      await auditPage(page, r);
    }
    await ctx.close();
  }

  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto("/agency/login");
    await page.fill("#agency-email", "agency@tenegta.com");
    await page.fill("#agency-password", "agency1234");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/agency/, { timeout: 30_000 });
    for (const r of agencyRoutes) await auditPage(page, r);
    await ctx.close();
  }

  results.sort((a, b) => a.id - b.id);
  const passCount = results.filter((r) => r.pass).length;
  const lines = [
    "# Visual Audit Matrix — TENEGTA Spark",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "| # | Path | Screenshot | Max font | BG | Decor | Digits | Status | Match | Notes |",
    "|---|------|------------|----------|-----|-------|--------|--------|-------|-------|",
    ...results.map(
      (r) =>
        `| ${r.id} | \`${r.path}\` | [${r.screenshot}](./screenshots/${r.screenshot}) | ${r.maxFontPx}px | ${r.background} | ${r.decorations} | ${r.digits} | ${r.status} | ${r.pass ? "✅" : "❌"} | ${r.note} |`
    ),
    "",
    `**Summary:** ${passCount}/${results.length} passed`,
  ];
  await writeFile(path.join(process.cwd(), "docs", "visual-audit", "MATRIX.md"), lines.join("\n"));
});
