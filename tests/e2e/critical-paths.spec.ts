import { test, expect } from "@playwright/test";

test.describe("Critical paths", () => {
  test("صانع محتوى: تسجيل دخول → لوحة التحكم → قائمة الحملات", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.fill("#phone", "+963900000001");
    await page.fill("#password", "demo1234");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });
    await page.goto("/dashboard/campaigns");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("مستهلك: كود صحيح → شاشة ترحيب", async ({ page }) => {
    await page.goto("/c/SPARK-HERO-H1");
    await expect(page.getByText(/أهلاً بك في حملة|Welcome/i)).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("button", { name: /متابعة|Continue/i })).toBeVisible();
  });

  test("راعٍ: تسجيل دخول → ROI يعرض بيانات", async ({ page }) => {
    await page.goto("/sponsor/login");
    await page.fill("#email", "diwan@tenegta.com");
    await page.fill("#password", "sponsor1234");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/sponsor/);
    await page.goto("/sponsor/roi");
    await expect(page.locator("body")).not.toContainText("٠");
    await expect(page.getByRole("heading").first()).toBeVisible();
  });
});
