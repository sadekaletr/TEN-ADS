import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PORT ?? "3000";
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;
const HEALTH_URL = `${BASE_URL}/api/health`;

process.env.DISABLE_LOGIN_RATE_LIMIT ??= "1";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: [
    ["html", { open: "never" }],
    ["json", { outputFile: "docs/launch-evidence/B2-results.json" }],
    ["list"],
  ],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    launchOptions: {
      channel: process.env.CI ? undefined : "chrome",
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.CI
    ? {
        command: "npm run start",
        url: HEALTH_URL,
        reuseExistingServer: false,
        timeout: 120_000,
        env: {
          DISABLE_LOGIN_RATE_LIMIT: "1",
        },
      }
    : {
        command: "npm run dev",
        url: HEALTH_URL,
        reuseExistingServer: true,
        timeout: 120_000,
        env: {
          DISABLE_LOGIN_RATE_LIMIT: "1",
        },
      },
});
