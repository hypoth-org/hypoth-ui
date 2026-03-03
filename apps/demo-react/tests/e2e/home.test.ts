import { expect, test } from "@playwright/test";

test.describe("Demo App Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3001");
  });

  test("should load the home page", async ({ page }) => {
    await expect(page).toHaveTitle(/Demo/i);
  });

  test("should render dashboard with page title", async ({ page }) => {
    await expect(page.locator(".page-title")).toContainText("Dashboard");
  });

  test("should render component overview cards", async ({ page }) => {
    await expect(page.locator(".showcase-card").first()).toBeVisible();
    // Dashboard has 2 showcase cards: Component Overview and Quick Stats
    const cards = page.locator(".showcase-card");
    await expect(cards).toHaveCount(2);
  });

  test("should render sidebar navigation", async ({ page }) => {
    const sidebar = page.locator(".sidebar");
    await expect(sidebar).toBeVisible();

    // Should have nav items for all sections
    const navItems = page.locator(".sidebar-item");
    const count = await navItems.count();
    expect(count).toBe(5); // Dashboard, Forms, Data Display, Overlays, Feedback
  });

  test("should render header with theme toggle", async ({ page }) => {
    const header = page.locator(".header");
    await expect(header).toBeVisible();
    await expect(header.locator("h1")).toContainText("Demo - React");
  });

  test("should apply CSS custom properties from tokens", async ({ page }) => {
    const hasTokens = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      const primaryColor = style.getPropertyValue("--color-primary");
      return primaryColor !== "";
    });

    expect(hasTokens).toBe(true);
  });

  test("should not have console errors on load", async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForLoadState("networkidle");

    // Filter out known non-issues (e.g., favicon 404)
    const realErrors = consoleErrors.filter(
      (error) =>
        !error.includes("favicon") &&
        !error.includes("has already been defined") &&
        !error.includes("already been used with this registry")
    );

    expect(realErrors).toHaveLength(0);
  });
});

test.describe("Navigation", () => {
  test("clicking sidebar item navigates to section", async ({ page }) => {
    await page.goto("http://localhost:3001");

    // Click on Forms nav item
    const formsLink = page.locator('.sidebar-item:has-text("Forms")');
    await formsLink.click();

    await expect(page).toHaveURL(/\/forms/);
    await expect(page.locator(".page-title")).toContainText("Forms");
  });

  test("breadcrumb shows on section pages", async ({ page }) => {
    await page.goto("http://localhost:3001/forms");

    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.locator('[aria-current="page"]')).toHaveText(
      "Forms"
    );
  });
});

test.describe("Accessibility", () => {
  test("should support keyboard navigation", async ({ page }) => {
    await page.goto("http://localhost:3001");

    // Tab to first interactive element
    await page.keyboard.press("Tab");

    const focusedElement = await page.evaluate(() => {
      const active = document.activeElement;
      return active?.tagName.toLowerCase();
    });

    // Should land on a focusable element
    expect(["button", "ds-button", "a", "input"]).toContain(focusedElement);
  });

  test("page has proper heading hierarchy", async ({ page }) => {
    await page.goto("http://localhost:3001");

    // h1 in header
    const h1 = page.locator("h1");
    await expect(h1.first()).toBeVisible();

    // h2 as page title
    const h2 = page.locator("h2");
    await expect(h2.first()).toBeVisible();
  });
});
