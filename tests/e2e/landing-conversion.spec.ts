import { test, expect } from "@playwright/test";

test.describe("Landing conversion", () => {
  test("hero CTAs visible at desktop width", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    await expect(
      page.getByRole("link", { name: /ابدأ كصانع محتوى|Start as a creator/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /أنا تاجر|I'm a merchant/i }).first()
    ).toBeVisible();
  });

  test("product film CTA links to redeem section", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const filmLink = page
      .getByRole("link", { name: /شاهد كيف يعمل|See how it works|Watch how it works/i })
      .first();
    await expect(filmLink).toBeVisible();
    await expect(filmLink).toHaveAttribute("href", /#product-film/);
  });

  test("FAQ expands answer on click", async ({ page }) => {
    await page.goto("/#faq");
    const firstQuestion = page.getByRole("button", { name: /كم تكلفة|How much does/i });
    await firstQuestion.click();
    await expect(page.getByText(/تدفع بالسبارك|You pay in Spark/i)).toBeVisible();
  });

  test("mobile layout: no horizontal scroll, primary CTA reachable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    const creatorCta = page.getByRole("link", { name: /ابدأ كصانع محتوى|Start as a creator/i }).first();
    await expect(creatorCta).toBeVisible();
    const box = await creatorCta.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.y).toBeLessThan(844);
    }
  });
});
