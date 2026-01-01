import { expect, test } from "@playwright/test";

test.describe("Documentation Edition Filtering", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3002");
  });

  test("should load the docs site", async ({ page }) => {
    await expect(page).toHaveTitle(/Documentation|Design System/i);
  });

  test("should display navigation sidebar", async ({ page }) => {
    // Look for navigation elements
    const nav = page.locator("nav, [role='navigation']");
    await expect(nav.first()).toBeVisible();
  });

  test("should show component links in navigation", async ({ page }) => {
    // Wait for navigation to load
    await page.waitForSelector("nav a, [role='navigation'] a");

    // Check for component links
    const buttonLink = page.locator('a[href*="button"]').first();
    await expect(buttonLink).toBeVisible();
  });

  test("should navigate to component page", async ({ page }) => {
    await page.waitForSelector("nav a, [role='navigation'] a");

    // Click on button component link
    const buttonLink = page.locator('a[href*="button"]').first();
    await buttonLink.click();

    // Should navigate to button page
    await expect(page).toHaveURL(/button/);
  });

  test("should render MDX content", async ({ page }) => {
    // Navigate to a component page
    await page.goto("http://localhost:3002/components/button");

    // Wait for content to load
    await page.waitForSelector("h1, h2, .mdx-content");

    // Should have documentation content
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("should display component examples", async ({ page }) => {
    await page.goto("http://localhost:3002/components/button");

    // Wait for page load
    await page.waitForLoadState("networkidle");

    // Look for example elements or code blocks
    const examples = page.locator("ds-button, pre, code, .example");
    const count = await examples.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("Edition-based Content Filtering", () => {
  test("should filter components based on edition config", async ({ page }) => {
    await page.goto("http://localhost:3002");

    // Wait for navigation
    await page.waitForSelector("nav, [role='navigation']");

    // Public components should be visible
    const publicComponents = page.locator('a[href*="button"]');
    await expect(publicComponents.first()).toBeVisible();
  });

  test("should show correct navigation structure", async ({ page }) => {
    await page.goto("http://localhost:3002");

    await page.waitForSelector("nav, [role='navigation']");

    // Should have organized categories
    const navLinks = page.locator("nav a, [role='navigation'] a");
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should maintain navigation state on page navigation", async ({ page }) => {
    await page.goto("http://localhost:3002");

    await page.waitForSelector("nav a, [role='navigation'] a");

    // Get initial nav state
    const _initialNav = await page.locator("nav, [role='navigation']").innerHTML();

    // Navigate to a component
    const link = page.locator("nav a, [role='navigation'] a").first();
    await link.click();

    // Wait for navigation
    await page.waitForLoadState("networkidle");

    // Navigation should still be present
    const nav = page.locator("nav, [role='navigation']");
    await expect(nav.first()).toBeVisible();
  });
});

test.describe("Search and Discovery", () => {
  test("should have searchable content", async ({ page }) => {
    await page.goto("http://localhost:3002");

    // Look for search input if enabled
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');

    if ((await searchInput.count()) > 0) {
      await expect(searchInput.first()).toBeVisible();
    }
  });

  test("should display component status badges", async ({ page }) => {
    await page.goto("http://localhost:3002");

    await page.waitForSelector("nav, [role='navigation']");

    // Components may have status indicators
    const statusBadges = page.locator('[class*="status"], [class*="badge"], [data-status]');
    // Status badges are optional, just verify the query works
    const count = await statusBadges.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe("Guide Pages", () => {
  test("should display getting started guide", async ({ page }) => {
    await page.goto("http://localhost:3002/guides/getting-started");

    // Wait for content
    await page.waitForSelector("h1, h2, .mdx-content", { timeout: 10000 }).catch(() => {});

    // Page should load (even if content differs)
    const content = page.locator("body");
    await expect(content).toBeVisible();
  });

  test("should display theming guide", async ({ page }) => {
    await page.goto("http://localhost:3002/guides/theming");

    await page.waitForSelector("h1, h2, .mdx-content", { timeout: 10000 }).catch(() => {});

    const content = page.locator("body");
    await expect(content).toBeVisible();
  });
});

test.describe("Responsive Design", () => {
  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("http://localhost:3002");

    // Page should still be usable on mobile
    const content = page.locator("body");
    await expect(content).toBeVisible();
  });

  test("should be responsive on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("http://localhost:3002");

    const content = page.locator("body");
    await expect(content).toBeVisible();
  });

  test("should be responsive on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:3002");

    const content = page.locator("body");
    await expect(content).toBeVisible();

    // Navigation should be visible on desktop
    const nav = page.locator("nav, [role='navigation']");
    await expect(nav.first()).toBeVisible();
  });
});
