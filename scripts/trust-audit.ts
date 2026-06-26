/**
 * Phase 0 trust audit — 12 sample pages, Desktop (1280) + Mobile (375).
 * Run: AUDIT_BASE_URL=http://localhost:3000 npx tsx scripts/trust-audit.ts
 */
import { chromium, type Page } from "@playwright/test";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getAuditRoutes, type AuditRoute } from "./visual-audit-urls";

const BASE = process.env.AUDIT_BASE_URL ?? "http://localhost:3000";
const OUT_DIR = path.join(process.cwd(), "docs", "visual-audit", "phase0");
const PHASE0_IDS = [25, 17, 22, 35, 37, 48, 41, 47, 9, 39, 28, 5];

const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 375, height: 812 },
} as const;

type TrustMetrics = {
  maxFontPx: number;
  bodyBg: string;
  hasArabicIndicDigits: boolean;
  hasLayoutGap: boolean;
  status: number;
  title: string;
};

async function collectTrustMetrics(page: Page): Promise<TrustMetrics> {
  return page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll("h1, h2"));
    let maxFontPx = 0;
    for (const el of headings) {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs > maxFontPx) maxFontPx = fs;
    }
    const bodyBgImage = getComputedStyle(document.body).backgroundImage;
    const hasArabicIndicDigits = /[٠-٩]/.test(document.body.innerText);
    const main = document.querySelector("main") ?? document.body;
    const rect = main.getBoundingClientRect();
    const hasLayoutGap =
      rect.height < 200 && document.body.scrollHeight > window.innerHeight * 1.5;
    return {
      maxFontPx: Math.round(maxFontPx),
      bodyBg: bodyBgImage.includes("gradient") ? "gradient" : "solid",
      hasArabicIndicDigits,
      hasLayoutGap,
      status: 200,
      title: document.title,
    };
  });
}

async function loginWithCredentials(
  page: Page,
  loginPath: string,
  provider: string,
  fields: Record<string, string>,
  successPath: string
) {
  await page.goto(`${BASE}${loginPath}`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });

  if (page.url().includes(successPath)) return;

  const csrfToken = await page.evaluate(async () => {
    const res = await fetch("/api/auth/csrf");
    const data = (await res.json()) as { csrfToken: string };
    return data.csrfToken;
  });

  const result = await page.evaluate(
    async ({ providerId, csrf, creds }) => {
      const body = new URLSearchParams({
        csrfToken: csrf,
        ...creds,
        callbackUrl: "/",
        json: "true",
      });
      const res = await fetch(`/api/auth/callback/${providerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        credentials: "include",
      });
      const text = await res.text();
      return { status: res.status, text: text.slice(0, 200) };
    },
    { providerId: provider, csrf: csrfToken, creds: fields }
  );

  await page.goto(`${BASE}${successPath}`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });

  if (!page.url().includes(successPath)) {
    throw new Error(
      `Login ${provider} failed (HTTP ${result.status}) — at ${page.url()} — ${result.text}`
    );
  }
}

async function loginCreator(page: Page) {
  if (page.url().includes("/dashboard")) return;
  await loginWithCredentials(
    page,
    "/login",
    "creator",
    { phone: "+963900000001", password: "demo1234", redirect: "false" },
    "/dashboard"
  );
}

async function loginSponsor(page: Page) {
  if (page.url().includes("/sponsor") && !page.url().includes("/login")) return;
  await loginWithCredentials(
    page,
    "/sponsor/login",
    "sponsor",
    { email: "diwan@tenegta.com", password: "sponsor1234" },
    "/sponsor"
  );
}

async function loginAdmin(page: Page) {
  if (page.url().includes("/admin") && !page.url().includes("/login")) return;
  await loginWithCredentials(
    page,
    "/admin/login",
    "admin",
    { email: "admin@tenegta.com", password: "admin1234" },
    "/admin"
  );
}

async function loginAgency(page: Page) {
  if (page.url().includes("/agency/dashboard")) return;
  await loginWithCredentials(
    page,
    "/agency/login",
    "agency_admin",
    { email: "agency@tenegta.com", password: "agency1234" },
    "/agency/dashboard"
  );
}

function slugFromPath(p: string) {
  return p.replace(/[/?=&]/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

function evaluatePass(m: TrustMetrics): { pass: boolean; notes: string[] } {
  const notes: string[] = [];
  if (m.hasArabicIndicDigits) notes.push("أرقام هندية عربية");
  if (m.hasLayoutGap) notes.push("فجوة تخطيط محتملة");
  if (m.bodyBg !== "gradient") notes.push("خلفية بدون تدرج void");
  return { pass: notes.length === 0, notes };
}

async function ensureAuth(page: Page, auth: AuditRoute["auth"], authDone: Set<string>) {
  if (!auth || authDone.has(auth)) return;
  if (auth === "creator") await loginCreator(page);
  if (auth === "sponsor") await loginSponsor(page);
  if (auth === "admin") await loginAdmin(page);
  if (auth === "agency") await loginAgency(page);
  authDone.add(auth);
}

async function auditRouteAtViewport(
  page: Page,
  route: AuditRoute,
  viewport: keyof typeof VIEWPORTS,
  authDone: Set<string>
) {
  await ensureAuth(page, route.auth, authDone);

  const res = await page.goto(`${BASE}${route.path}`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await page.waitForTimeout(1200);
  const metrics = await collectTrustMetrics(page);
  metrics.status = res?.status() ?? 0;

  const slug = slugFromPath(route.path);
  const shot = `${String(route.id).padStart(2, "0")}-${slug}-${viewport}.png`;
  await page.screenshot({
    path: path.join(OUT_DIR, shot),
    fullPage: viewport === "mobile",
  });

  const { pass, notes } = evaluatePass(metrics);
  return { route, viewport, metrics, pass, notes, shot };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const allRoutes = await getAuditRoutes();
  const routes = PHASE0_IDS.map((id) => allRoutes.find((r) => r.id === id)!).filter(Boolean);

  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const results: Awaited<ReturnType<typeof auditRouteAtViewport>>[] = [];

  const authOrder: Array<AuditRoute["auth"] | "public"> = [
    "creator",
    "sponsor",
    "admin",
    "agency",
    "public",
  ];

  for (const group of authOrder) {
    const batch = routes.filter((r) =>
      group === "public" ? !r.auth : r.auth === group
    );
    if (batch.length === 0) continue;

    const context = await browser.newContext({ viewport: VIEWPORTS.desktop });
    const page = await context.newPage();
    const authDone = new Set<string>();

    for (const route of batch) {
      for (const viewport of Object.keys(VIEWPORTS) as Array<keyof typeof VIEWPORTS>) {
        await page.setViewportSize(VIEWPORTS[viewport]);
        try {
          console.log(`Phase0 ${route.id}: ${route.path} (${viewport})`);
          results.push(await auditRouteAtViewport(page, route, viewport, authDone));
        } catch (e) {
          console.error(`Failed ${route.path}:`, e);
          results.push({
            route,
            viewport,
            metrics: {
              maxFontPx: 0,
              bodyBg: "error",
              hasArabicIndicDigits: false,
              hasLayoutGap: false,
              status: 0,
              title: "error",
            },
            pass: false,
            notes: [e instanceof Error ? e.message : String(e)],
            shot: "error.png",
          });
        }
      }
    }
    await context.close();
  }

  await browser.close();

  let passCount = 0;
  const lines = [
    "# Phase 0 — تقرير تدقيق الثقة",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Base URL: ${BASE}`,
    "",
    "| # | Path | Desktop | Mobile | Digits | Match | Notes |",
    "|---|------|---------|--------|--------|-------|-------|",
  ];

  for (const id of PHASE0_IDS) {
    const entries = results.filter((r) => r.route.id === id);
    const route = entries[0]?.route;
    if (!route) continue;
    const desktop = entries.find((e) => e.viewport === "desktop");
    const mobile = entries.find((e) => e.viewport === "mobile");
    const pass = !!(desktop?.pass && mobile?.pass);
    if (pass) passCount++;
    const digits =
      desktop?.metrics.hasArabicIndicDigits || mobile?.metrics.hasArabicIndicDigits
        ? "هندية ❌"
        : "لاتينية ✅";
    const notes = [...(desktop?.notes ?? []), ...(mobile?.notes ?? [])].filter(
      (n, i, a) => a.indexOf(n) === i
    );
    lines.push(
      `| ${id} | \`${route.path}\` | [desktop](./phase0/${desktop?.shot ?? "—"}) | [mobile](./phase0/${mobile?.shot ?? "—"}) | ${digits} | ${pass ? "✅" : "❌"} | ${notes.length ? notes.join("; ") : "يطابق التقرير"} |`
    );
  }

  lines.push(
    "",
    `**Summary:** ${passCount}/12 pages passed (desktop + mobile).`,
    "",
    passCount >= 12
      ? "**Gate:** ✅ PASS — proceed to Phase 1."
      : passCount >= 9
        ? "**Gate:** ⚠️ PARTIAL — review failures before Phase 1."
        : "**Gate:** ❌ STOP — ≥3 failures; reapply critical prompt."
  );

  const reportPath = path.join(process.cwd(), "docs", "visual-audit", "PHASE0-REPORT.md");
  await writeFile(reportPath, lines.join("\n"), "utf-8");
  console.log(`Wrote ${reportPath} — ${passCount}/12 passed`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
