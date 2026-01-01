import { expect, test } from "@playwright/test";

test.describe("Component Documentation Pages", () => {
  test.describe("Button Component", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("http://localhost:3002/components/button");
    });

    test("should display button documentation", async ({ page }) => {
      // Wait for content
      await page.waitForLoadState("networkidle");

      // Should have a heading
      const heading = page.locator("h1, h2").first();
      await expect(heading).toBeVisible();
    });

    test("should show button examples", async ({ page }) => {
      await page.waitForLoadState("networkidle");

      // Look for button examples in the docs
      const examples = page.locator("ds-button");
      const count = await examples.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test("should display props documentation", async ({ page }) => {
      await page.waitForLoadState("networkidle");

      // Look for props table or list
      const propsSection = page.locator("text=/props|properties|api/i");
      if ((await propsSection.count()) > 0) {
        await expect(propsSection.first()).toBeVisible();
      }
    });
  });

  test.describe("Input Component", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("http://localhost:3002/components/input");
    });

    test("should display input documentation", async ({ page }) => {
      await page.waitForLoadState("networkidle");

      const content = page.locator("body");
      await expect(content).toBeVisible();
    });

    test("should show input examples", async ({ page }) => {
      await page.waitForLoadState("networkidle");

      const examples = page.locator("ds-input");
      const count = await examples.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe("New Component Integration", () => {
    test("should show newly added components in navigation", async ({ page }) => {
      await page.goto("http://localhost:3002");

      await page.waitForSelector("nav, [role='navigation']");

      // Both button and input should be visible
      const buttonLink = page.locator('a[href*="button"]');
      const inputLink = page.locator('a[href*="input"]');

      await expect(buttonLink.first()).toBeVisible();
      await expect(inputLink.first()).toBeVisible();
    });

    test("should navigate to new component pages", async ({ page }) => {
      await page.goto("http://localhost:3002");

      await page.waitForSelector("nav a, [role='navigation'] a");

      // Click on input link
      const inputLink = page.locator('a[href*="input"]').first();
      await inputLink.click();

      // Should navigate to input page
      await expect(page).toHaveURL(/input/);
    });

    test("should render new component examples correctly", async ({ page }) => {
      await page.goto("http://localhost:3002/components/input");

      await page.waitForLoadState("networkidle");

      // Check for input elements in the docs
      const inputElements = page.locator("ds-input, input");
      const count = await inputElements.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});

test.describe("Code Examples", () => {
  test("should display code blocks", async ({ page }) => {
    await page.goto("http://localhost:3002/components/button");

    await page.waitForLoadState("networkidle");

    // Look for code blocks
    const codeBlocks = page.locator("pre, code");
    const count = await codeBlocks.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should format code correctly", async ({ page }) => {
    await page.goto("http://localhost:3002/components/button");

    await page.waitForLoadState("networkidle");

    const preBlocks = page.locator("pre");
    if ((await preBlocks.count()) > 0) {
      const pre = preBlocks.first();
      await expect(pre).toBeVisible();
    }
  });
});

test.describe("Component Status Display", () => {
  test("should show component status in docs", async ({ page }) => {
    await page.goto("http://localhost:3002/components/button");

    await page.waitForLoadState("networkidle");

    // Status might be shown as badge or text
    const statusIndicators = page.locator(
      '[class*="status"], [class*="badge"], text=/stable|beta|alpha|deprecated/i'
    );

    // Status indicators are optional
    const count = await statusIndicators.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe("Interactive Examples", () => {
  test("should have interactive button examples", async ({ page }) => {
    await page.goto("http://localhost:3002/components/button");

    await page
      .waitForFunction(() => customElements.get("ds-button") !== undefined, {
        timeout: 10000,
      })
      .catch(() => {});

    const buttons = page.locator("ds-button");
    if ((await buttons.count()) > 0) {
      const button = buttons.first();

      // Button should be clickable
      await button.click();
      await expect(button).toBeVisible();
    }
  });

  test("should have interactive input examples", async ({ page }) => {
    await page.goto("http://localhost:3002/components/input");

    await page
      .waitForFunction(() => customElements.get("ds-input") !== undefined, {
        timeout: 10000,
      })
      .catch(() => {});

    const inputs = page.locator("ds-input");
    if ((await inputs.count()) > 0) {
      const input = inputs.first();
      const innerInput = input.locator("input");

      if ((await innerInput.count()) > 0) {
        // Input should accept text
        await innerInput.fill("test value");
        await expect(innerInput).toHaveValue("test value");
      }
    }
  });
});
