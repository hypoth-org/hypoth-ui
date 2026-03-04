import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for E2E and visual regression tests
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./apps",
  testMatch: "**/tests/e2e/**/*.test.ts",

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: process.env.CI ? "github" : "html",

  // Visual snapshot settings
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.10, // 10% threshold for cross-framework visual parity
    },
  },

  // Shared settings for all projects
  use: {
    // Collect trace when retrying the failed test
    trace: "on-first-retry",

    // Screenshot on failure
    screenshot: "only-on-failure",
  },

  // Configure projects for major browsers
  projects: [
    // E2E tests for React demo
    {
      name: "demo-react",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3001",
      },
      testMatch: "**/demo-react/tests/e2e/**/*.test.ts",
    },
    // Visual regression: Desktop (1280x720)
    {
      name: "visual-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
      testMatch: "**/tests/e2e/visual-parity.test.ts",
    },
    // Visual regression: Tablet (768x1024) - uses Chromium for CI compatibility
    {
      name: "visual-tablet",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 768, height: 1024 },
      },
      testMatch: "**/tests/e2e/visual-parity.test.ts",
    },
    // Visual regression: Mobile (375x667) - uses Chromium for CI compatibility
    {
      name: "visual-mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 375, height: 667 },
      },
      testMatch: "**/tests/e2e/visual-parity.test.ts",
    },
  ],

  // Run local dev servers before starting tests
  webServer: [
    {
      command: "pnpm --filter @ds/demo-react run dev",
      url: "http://localhost:3001",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: "pnpm --filter @ds/demo-wc run dev",
      url: "http://localhost:3002",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});
