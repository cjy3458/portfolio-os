import { defineConfig, devices } from "@playwright/test";

/**
 * Storybook E2E 테스트 설정
 * - Storybook 서버: http://localhost:6006
 * - 실행: npm run test:storybook
 */
export default defineConfig({
  testDir: "./e2e/storybook",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [["html", { outputFolder: "playwright-report-storybook", open: "never" }], ["list"]],

  use: {
    baseURL: "http://localhost:6006",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run storybook",
    url: "http://localhost:6006",
    reuseExistingServer: true,
    timeout: 60000,
  },
});
