import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const PROOF_PNG = path.join(__dirname, "fixtures", "proof-1x1.png");

test("شحن: طلب صانع → موافقة مدير → حالة مُعتمدة", async ({ browser }) => {
  if (!fs.existsSync(PROOF_PNG)) {
    fs.mkdirSync(path.dirname(PROOF_PNG), { recursive: true });
    fs.writeFileSync(
      PROOF_PNG,
      Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        "base64"
      )
    );
  }

  const bankRef = `E2E-${Date.now()}`;

  const creatorCtx = await browser.newContext();
  const creatorPage = await creatorCtx.newPage();
  await creatorPage.goto("/login");
  await creatorPage.fill("#phone", "+963900000001");
  await creatorPage.fill("#password", "demo1234");
  await creatorPage.click('button[type="submit"]');
  await expect(creatorPage).toHaveURL(/\/dashboard/, { timeout: 30_000 });

  await creatorPage.goto("/dashboard/wallet/topup");
  await creatorPage.getByRole("button", { name: "متابعة" }).first().click();
  await creatorPage.getByRole("button", { name: /عرض حساب ShamCash/ }).click();
  await creatorPage
    .getByRole("button", { name: /تم التحويل — رفع الإثبات/ })
    .click();
  await creatorPage.locator("#proof").setInputFiles(PROOF_PNG);
  await creatorPage.fill("#bank-ref", bankRef);
  await creatorPage.getByRole("button", { name: "إرسال طلب الشحن" }).click();
  await expect(creatorPage.getByText("تم استلام طلبك")).toBeVisible({
    timeout: 30_000,
  });

  const adminCtx = await browser.newContext();
  const adminPage = await adminCtx.newPage();
  await adminPage.goto("/admin/login");
  await adminPage.fill("#admin-email", "admin@tenegta.com");
  await adminPage.fill("#admin-password", "admin1234");
  await adminPage.click('button[type="submit"]');
  await expect(adminPage).toHaveURL(
    (url) => {
      const p = new URL(url).pathname;
      return p.startsWith("/admin") && p !== "/admin/login";
    },
    { timeout: 30_000 }
  );

  await adminPage.goto("/admin/wallet");
  await expect(adminPage.getByText(bankRef)).toBeVisible({ timeout: 15_000 });
  await adminPage.getByRole("button", { name: "موافقة" }).first().click();
  await expect(adminPage.getByText(bankRef)).not.toBeVisible({
    timeout: 30_000,
  });

  await creatorPage.goto("/dashboard/wallet");
  await expect(creatorPage.getByText(/شحن|TOPUP|Spark/i).first()).toBeVisible({
    timeout: 15_000,
  });

  await creatorCtx.close();
  await adminCtx.close();
});
