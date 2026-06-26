import { test, expect } from "@playwright/test";

test("صانع: معالج حملة جديدة — الخطوة الأولى مرئية", async ({ page }) => {
  await page.goto("/login");
  await page.fill("#phone", "+963900000001");
  await page.fill("#password", "demo1234");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });

  await page.goto("/dashboard/campaigns/new");
  await expect(page).toHaveURL(/\/dashboard\/campaigns\/new/);
  await expect(page.getByRole("heading", { name: "اكتب جملة وخلص" })).toBeVisible();
  await expect(page.getByPlaceholder(/حملة قهوة مجانية/)).toBeVisible();
});
