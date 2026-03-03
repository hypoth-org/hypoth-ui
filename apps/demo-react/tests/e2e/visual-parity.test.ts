import { expect, test } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const REACT_URL = "http://localhost:3001";
const WC_URL = "http://localhost:3002";

/**
 * Visual parity tests comparing React and Web Component demos.
 *
 * These tests capture a screenshot of the React page, then compare the
 * WC page against it directly — no committed baselines needed.
 *
 * Uses viewport screenshots (not fullPage) to ensure consistent image
 * dimensions between React and WC, since full-page heights may differ
 * slightly due to framework rendering differences.
 */

const sections = [
  { name: "dashboard", reactPath: "/", wcHash: "#dashboard" },
  { name: "forms", reactPath: "/forms", wcHash: "#forms" },
  { name: "data-display", reactPath: "/data-display", wcHash: "#data-display" },
  { name: "overlays", reactPath: "/overlays", wcHash: "#overlays" },
  { name: "feedback", reactPath: "/feedback", wcHash: "#feedback" },
];

test.describe("Visual Parity: React vs Web Components", () => {
  for (const section of sections) {
    test(`${section.name}`, async ({ page }, testInfo) => {
      // Capture React page as the expected baseline (viewport only)
      await page.goto(`${REACT_URL}${section.reactPath}`);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      const reactScreenshot = await page.screenshot();

      // Attach React screenshot for debugging on failure
      await testInfo.attach(`react-${section.name}`, {
        body: reactScreenshot,
        contentType: "image/png",
      });

      // Write React screenshot as the expected snapshot baseline
      const snapshotPath = testInfo.snapshotPath(`${section.name}.png`);
      mkdirSync(dirname(snapshotPath), { recursive: true });
      writeFileSync(snapshotPath, reactScreenshot);

      // Navigate to WC version and compare against React baseline
      await page.goto(`${WC_URL}/${section.wcHash}`);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot(`${section.name}.png`);
    });
  }
});

test.describe("Visual Parity: Theme Toggle", () => {
  test("dark theme", async ({ page }, testInfo) => {
    // Capture React dark theme as baseline
    await page.goto(REACT_URL);
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("ds-demo-theme", "dark");
    });
    await page.waitForTimeout(300);
    const reactScreenshot = await page.screenshot();

    await testInfo.attach("react-dashboard-dark", {
      body: reactScreenshot,
      contentType: "image/png",
    });

    const snapshotPath = testInfo.snapshotPath("dashboard-dark.png");
    mkdirSync(dirname(snapshotPath), { recursive: true });
    writeFileSync(snapshotPath, reactScreenshot);

    // Compare WC dark theme against React
    await page.goto(`${WC_URL}/#dashboard`);
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("ds-demo-theme", "dark");
    });
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot("dashboard-dark.png");
  });
});

test.describe("Visual Parity: Layout Structure", () => {
  test("React - sidebar navigation is visible", async ({ page }) => {
    await page.goto(REACT_URL);
    await page.waitForLoadState("networkidle");
    await expect(page.locator(".sidebar")).toBeVisible();
  });

  test("WC - sidebar navigation is visible", async ({ page }) => {
    await page.goto(`${WC_URL}/#dashboard`);
    await page.waitForLoadState("networkidle");
    await expect(page.locator(".sidebar")).toBeVisible();
  });

  test("React - header is visible", async ({ page }) => {
    await page.goto(REACT_URL);
    await page.waitForLoadState("networkidle");
    await expect(page.locator(".header")).toBeVisible();
  });

  test("WC - header is visible", async ({ page }) => {
    await page.goto(`${WC_URL}/#dashboard`);
    await page.waitForLoadState("networkidle");
    await expect(page.locator(".header")).toBeVisible();
  });

  test("Both demos have matching section count", async ({ page }) => {
    // Check React
    await page.goto(REACT_URL);
    await page.waitForLoadState("networkidle");
    const reactNavItems = await page.locator(".sidebar-item").count();

    // Check WC
    await page.goto(`${WC_URL}/#dashboard`);
    await page.waitForLoadState("networkidle");
    const wcNavItems = await page.locator(".sidebar-item").count();

    expect(reactNavItems).toBe(wcNavItems);
  });
});
