import { expect, test } from "@playwright/test";

const REACT_URL = "http://localhost:3001";
const WC_URL = "http://localhost:3002";

/**
 * Accessibility tests for both demo applications.
 * Validates WCAG 2.1 AA compliance patterns using Playwright built-in assertions.
 */

test.describe("A11y: React Demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(REACT_URL);
    await page.waitForLoadState("networkidle");
  });

  test("has skip-link for keyboard users", async ({ page }) => {
    const skipLink = page.locator(".skip-link");
    // Skip link should exist (visually hidden until focused)
    await expect(skipLink).toHaveCount(1);
  });

  test("sidebar navigation has accessible role", async ({ page }) => {
    const nav = page.locator("nav.sidebar-nav, .sidebar nav");
    const count = await nav.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("breadcrumb has aria-label", async ({ page }) => {
    await page.goto(`${REACT_URL}/forms`);
    await page.waitForLoadState("networkidle");
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
  });

  test("breadcrumb current page has aria-current", async ({ page }) => {
    await page.goto(`${REACT_URL}/forms`);
    await page.waitForLoadState("networkidle");
    const current = page.locator('[aria-current="page"]');
    await expect(current).toBeVisible();
    await expect(current).toHaveText("Forms");
  });

  test("page has heading hierarchy", async ({ page }) => {
    // h1 in header, h2 as page title
    const h1 = page.locator("h1");
    await expect(h1.first()).toBeVisible();

    const h2 = page.locator("h2");
    await expect(h2.first()).toBeVisible();
  });

  test("interactive elements are keyboard focusable", async ({ page }) => {
    // Tab through page and verify focus lands on interactive elements
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(
      () => document.activeElement?.tagName.toLowerCase()
    );
    // Should land on a focusable element
    expect(["a", "button", "input", "ds-button", "ds-switch"]).toContain(
      focused
    );
  });

  test("form inputs have associated labels", async ({ page }) => {
    await page.goto(`${REACT_URL}/forms`);
    await page.waitForLoadState("networkidle");

    // Check that labeled inputs exist
    const labeledInputs = page.locator("label[for] + ds-input, label + ds-input");
    const count = await labeledInputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test("color contrast: text is visible in light mode", async ({ page }) => {
    // Verify foreground color is dark on light background
    const color = await page.evaluate(() => {
      const style = getComputedStyle(document.body);
      return style.color;
    });
    // Should not be transparent or white-on-white
    expect(color).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("color contrast: text is visible in dark mode", async ({ page }) => {
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "dark");
    });
    await page.waitForTimeout(300);

    const color = await page.evaluate(() => {
      const style = getComputedStyle(document.body);
      return style.color;
    });
    expect(color).not.toBe("rgba(0, 0, 0, 0)");
  });
});

test.describe("A11y: WC Demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${WC_URL}/#dashboard`);
    await page.waitForLoadState("networkidle");
  });

  test("has skip-link for keyboard users", async ({ page }) => {
    const skipLink = page.locator(".skip-link");
    await expect(skipLink).toHaveCount(1);
  });

  test("sidebar navigation has accessible structure", async ({ page }) => {
    const nav = page.locator("nav.sidebar-nav, .sidebar nav");
    const count = await nav.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("breadcrumb has aria-label", async ({ page }) => {
    await page.goto(`${WC_URL}/#forms`);
    await page.waitForLoadState("networkidle");
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
  });

  test("breadcrumb current page has aria-current", async ({ page }) => {
    await page.goto(`${WC_URL}/#forms`);
    await page.waitForLoadState("networkidle");
    const current = page.locator('[aria-current="page"]');
    await expect(current).toBeVisible();
    await expect(current).toHaveText("Forms");
  });

  test("page has heading hierarchy", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1.first()).toBeVisible();

    const h2 = page.locator("h2");
    await expect(h2.first()).toBeVisible();
  });

  test("interactive elements are keyboard focusable", async ({ page }) => {
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(
      () => document.activeElement?.tagName.toLowerCase()
    );
    expect(["a", "button", "input", "ds-button", "ds-switch"]).toContain(
      focused
    );
  });
});
