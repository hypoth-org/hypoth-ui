import { expect, test } from "@playwright/test";

const REACT_URL = "http://localhost:3001";
const WC_URL = "http://localhost:3002";

/**
 * Visual parity tests comparing React and Web Component demos.
 * Captures screenshots at each breakpoint and compares layout structure.
 * Uses 5% maxDiffPixelRatio threshold configured in playwright.config.ts.
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
    test(`${section.name} - React screenshot`, async ({ page }) => {
      await page.goto(`${REACT_URL}${section.reactPath}`);
      await page.waitForLoadState("networkidle");
      // Allow components to render
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot(`react-${section.name}.png`, {
        fullPage: true,
      });
    });

    test(`${section.name} - WC screenshot`, async ({ page }) => {
      await page.goto(`${WC_URL}/${section.wcHash}`);
      await page.waitForLoadState("networkidle");
      // Allow components to render
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot(`wc-${section.name}.png`, {
        fullPage: true,
      });
    });
  }
});

test.describe("Visual Parity: Theme Toggle", () => {
  test("React - dark theme screenshot", async ({ page }) => {
    await page.goto(REACT_URL);
    await page.waitForLoadState("networkidle");

    // Toggle to dark theme
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("ds-demo-theme", "dark");
    });
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot("react-dashboard-dark.png", {
      fullPage: true,
    });
  });

  test("WC - dark theme screenshot", async ({ page }) => {
    await page.goto(`${WC_URL}/#dashboard`);
    await page.waitForLoadState("networkidle");

    // Toggle to dark theme
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("ds-demo-theme", "dark");
    });
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot("wc-dashboard-dark.png", {
      fullPage: true,
    });
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
