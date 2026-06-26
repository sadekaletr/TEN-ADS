import { test, expect } from "@playwright/test";

test.describe("Creators & Marketplace smoke", () => {
  test("/creators: hero and creator grid load", async ({ page }) => {
    await page.goto("/creators");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator("article, a[href*='/creator/']").first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("/marketplace: sponsor gate then listings", async ({ page }) => {
    await page.goto("/marketplace");
    await expect(page).toHaveURL(/\/sponsor\/login/, { timeout: 10_000 });

    await page.fill("#email", "diwan@tenegta.com");
    await page.fill("#password", "sponsor1234");
    await page.click('button[type="submit"]');
    await page.goto("/marketplace");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.locator("article, a[href*='/creator/']").first()
    ).toBeVisible({ timeout: 15_000 });
  });
});
