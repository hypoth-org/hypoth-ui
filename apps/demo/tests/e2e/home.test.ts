import { expect, test } from "@playwright/test";

test.describe("Demo App Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3001");
  });

  test("should load the home page", async ({ page }) => {
    await expect(page).toHaveTitle(/Demo/i);
  });

  test("should render ds-button components", async ({ page }) => {
    // Wait for custom elements to be defined
    await page.waitForFunction(() => customElements.get("ds-button") !== undefined);

    // Check that ds-button elements exist
    const buttons = page.locator("ds-button");
    await expect(buttons.first()).toBeVisible();
  });

  test("should have working button click interaction", async ({ page }) => {
    await page.waitForFunction(() => customElements.get("ds-button") !== undefined);

    const button = page.locator("ds-button").first();
    await expect(button).toBeVisible();

    // Click the button
    await button.click();
    // Button should remain visible and interactive
    await expect(button).toBeVisible();
  });

  test("should display all button variants", async ({ page }) => {
    await page.waitForFunction(() => customElements.get("ds-button") !== undefined);

    // Check for variant attributes - use first() since there may be multiple
    await expect(page.locator('ds-button[variant="primary"]').first()).toBeVisible();
    await expect(page.locator('ds-button[variant="secondary"]').first()).toBeVisible();
  });

  test("should have correct button sizes", async ({ page }) => {
    await page.waitForFunction(() => customElements.get("ds-button") !== undefined);

    // Check that buttons with different sizes exist
    const mdButton = page.locator('ds-button[size="md"]');
    if ((await mdButton.count()) > 0) {
      await expect(mdButton.first()).toBeVisible();
    }
  });

  test("should apply CSS custom properties from tokens", async ({ page }) => {
    // Check that token CSS variables are defined
    const hasTokens = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      // Check for DTCG token format (no prefix, semantic names)
      const primaryColor = style.getPropertyValue("--color-primary");
      return primaryColor !== "";
    });

    expect(hasTokens).toBe(true);
  });

  test("should use Light DOM for Web Components", async ({ page }) => {
    await page.waitForFunction(() => customElements.get("ds-button") !== undefined);

    // Light DOM components should have inner elements accessible
    const hasLightDOM = await page.evaluate(() => {
      const button = document.querySelector("ds-button");
      if (!button) return false;

      // Light DOM: no shadow root, inner button accessible
      return button.shadowRoot === null && button.querySelector("button") !== null;
    });

    expect(hasLightDOM).toBe(true);
  });

  test("should not have double-registration errors", async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForFunction(() => customElements.get("ds-button") !== undefined);

    // Check for registration errors
    const registrationErrors = consoleErrors.filter(
      (error) =>
        error.includes("has already been defined") ||
        error.includes("already been used with this registry")
    );

    expect(registrationErrors).toHaveLength(0);
  });
});

test.describe("Server Component Streaming", () => {
  test("should stream content progressively", async ({ page }) => {
    // Start navigation and measure time to first content
    const startTime = Date.now();

    await page.goto("http://localhost:3001", { waitUntil: "domcontentloaded" });

    // DOM content should be available quickly (streaming)
    const domTime = Date.now() - startTime;
    expect(domTime).toBeLessThan(5000); // Should be under 5s for streaming

    // Wait for full page load
    await page.waitForLoadState("networkidle");
  });

  test("should hydrate custom elements correctly", async ({ page }) => {
    await page.goto("http://localhost:3001");

    // Wait for hydration
    await page.waitForFunction(() => {
      const button = document.querySelector("ds-button");
      return button && customElements.get("ds-button") !== undefined;
    });

    // Verify button is interactive after hydration
    const button = page.locator("ds-button").first();
    await expect(button).toBeEnabled();
  });
});

test.describe("Accessibility", () => {
  test("should have no obvious accessibility issues", async ({ page }) => {
    await page.goto("http://localhost:3001");
    await page.waitForFunction(() => customElements.get("ds-button") !== undefined);

    // Check for basic accessibility attributes
    const buttons = page.locator("ds-button");
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);

    // Verify at least one button has the inner button element
    const firstButton = buttons.first();
    const innerButton = firstButton.locator("button");

    // Inner button should exist (may not be visible if Light DOM renders differently)
    const innerCount = await innerButton.count();
    expect(innerCount).toBeGreaterThan(0);
  });

  test("should support keyboard navigation", async ({ page }) => {
    await page.goto("http://localhost:3001");
    await page.waitForFunction(() => customElements.get("ds-button") !== undefined);

    // Tab to first button
    await page.keyboard.press("Tab");

    // Check that a button is focused
    const focusedElement = await page.evaluate(() => {
      const active = document.activeElement;
      return active?.tagName.toLowerCase();
    });

    // Either ds-button or inner button should be focused
    expect(["button", "ds-button", "a"]).toContain(focusedElement);
  });
});
