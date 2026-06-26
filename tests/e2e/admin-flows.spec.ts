import { test, expect } from "@playwright/test";

test("مدير: تسجيل دخول → عمليات المحفظة", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/admin/login");
  await page.waitForLoadState("domcontentloaded");
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

  await page.goto("/admin/wallet");
  await expect(page).toHaveURL(/\/admin\/wallet/);
  await expect(
    page.getByRole("heading", { name: "عمليات المحفظة" })
  ).toBeVisible();
});
