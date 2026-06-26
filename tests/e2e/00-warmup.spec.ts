import { test, expect } from "@playwright/test";

/** Prime Next.js auth routes before login-heavy specs (avoids cold-compile flake). */
test("warmup — health + auth pages", async ({ page, request }) => {
  const health = await request.get("/api/health");
  expect(health.ok()).toBeTruthy();
  await page.goto("/login");
  await page.goto("/admin/login");
  await request.get("/api/auth/csrf");
});
