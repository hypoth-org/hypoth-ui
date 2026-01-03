import { expect, test } from "@playwright/test";

test.describe("Web Components Loader (DsLoader)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3001/wc-demo");
  });

  test("should register all design system components", async ({ page }) => {
    // Wait for components to be registered
    await page.waitForFunction(() => {
      return (
        customElements.get("ds-button") !== undefined &&
        customElements.get("ds-input") !== undefined
      );
    });

    // Verify both component types are defined
    const componentsRegistered = await page.evaluate(() => {
      return {
        button: customElements.get("ds-button") !== undefined,
        input: customElements.get("ds-input") !== undefined,
      };
    });

    expect(componentsRegistered.button).toBe(true);
    expect(componentsRegistered.input).toBe(true);
  });

  test("should render ds-button in Light DOM", async ({ page }) => {
    await page.waitForFunction(() => customElements.get("ds-button") !== undefined);

    const lightDomCheck = await page.evaluate(() => {
      const button = document.querySelector("ds-button");
      if (!button) return { exists: false };

      return {
        exists: true,
        noShadowRoot: button.shadowRoot === null,
        hasInnerButton: button.querySelector("button") !== null,
        innerButtonClass: button.querySelector("button")?.className || "",
      };
    });

    expect(lightDomCheck.exists).toBe(true);
    expect(lightDomCheck.noShadowRoot).toBe(true);
    expect(lightDomCheck.hasInnerButton).toBe(true);
    expect(lightDomCheck.innerButtonClass).toContain("ds-button");
  });

  test("should render ds-input in Light DOM", async ({ page }) => {
    await page.waitForFunction(() => customElements.get("ds-input") !== undefined);

    const lightDomCheck = await page.evaluate(() => {
      const input = document.querySelector("ds-input");
      if (!input) return { exists: false };

      return {
        exists: true,
        noShadowRoot: input.shadowRoot === null,
        hasInnerInput: input.querySelector("input") !== null,
        innerInputClass: input.querySelector("input")?.className || "",
      };
    });

    expect(lightDomCheck.exists).toBe(true);
    expect(lightDomCheck.noShadowRoot).toBe(true);
    expect(lightDomCheck.hasInnerInput).toBe(true);
    expect(lightDomCheck.innerInputClass).toContain("ds-input__field");
  });

  test("should emit ds:click events from button", async ({ page }) => {
    await page.waitForFunction(() => customElements.get("ds-button") !== undefined);

    // Find the "Click me" button
    const button = page.locator('ds-button:has-text("Click me")');
    await expect(button).toBeVisible();

    // Click count should start at 0
    await expect(page.locator('text="Click count: 0"')).toBeVisible();

    // Click the button
    await button.click();

    // Click count should increment
    await expect(page.locator('text="Click count: 1"')).toBeVisible();
  });

  test("should emit ds:change events from input", async ({ page }) => {
    await page.waitForFunction(() => customElements.get("ds-input") !== undefined);

    // Find the input with placeholder "Type something..."
    const input = page.locator('ds-input input[placeholder="Type something..."]');
    await expect(input).toBeVisible();

    // Type in the input
    await input.fill("Hello World");
    await input.blur(); // Trigger change event

    // Value should be displayed
    await expect(page.locator('text="Value: Hello World"')).toBeVisible();
  });

  test("should not have hydration errors", async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("http://localhost:3001/wc-demo");
    await page.waitForFunction(() => customElements.get("ds-button") !== undefined);

    // Check for hydration-related errors
    const hydrationErrors = consoleErrors.filter(
      (error) =>
        error.includes("Hydration") ||
        error.includes("hydration") ||
        error.includes("mismatch") ||
        error.includes("did not match")
    );

    expect(hydrationErrors).toHaveLength(0);
  });

  test("should query internal elements from outside component", async ({ page }) => {
    await page.waitForFunction(() => customElements.get("ds-button") !== undefined);
    await page.waitForFunction(() => customElements.get("ds-input") !== undefined);

    // This is the key benefit of Light DOM - elements are queryable from parent
    const queryCheck = await page.evaluate(() => {
      // Query for internal elements using standard DOM APIs
      const buttonsFromDocument = document.querySelectorAll("button.ds-button");
      const inputsFromDocument = document.querySelectorAll("input.ds-input__field");

      return {
        buttonCount: buttonsFromDocument.length,
        inputCount: inputsFromDocument.length,
      };
    });

    expect(queryCheck.buttonCount).toBeGreaterThan(0);
    expect(queryCheck.inputCount).toBeGreaterThan(0);
  });

  test("should support button variants", async ({ page }) => {
    await page.waitForFunction(() => customElements.get("ds-button") !== undefined);

    // Check that variant buttons exist and have proper classes
    const variants = await page.evaluate(() => {
      const primary = document.querySelector('ds-button[variant="primary"] button');
      const secondary = document.querySelector('ds-button[variant="secondary"] button');
      const ghost = document.querySelector('ds-button[variant="ghost"] button');
      const destructive = document.querySelector('ds-button[variant="destructive"] button');

      return {
        primary: primary?.classList.contains("ds-button--primary"),
        secondary: secondary?.classList.contains("ds-button--secondary"),
        ghost: ghost?.classList.contains("ds-button--ghost"),
        destructive: destructive?.classList.contains("ds-button--destructive"),
      };
    });

    expect(variants.primary).toBe(true);
    expect(variants.secondary).toBe(true);
    expect(variants.ghost).toBe(true);
    expect(variants.destructive).toBe(true);
  });

  test("should support button sizes", async ({ page }) => {
    await page.waitForFunction(() => customElements.get("ds-button") !== undefined);

    const sizes = await page.evaluate(() => {
      const sm = document.querySelector('ds-button[size="sm"] button');
      const md = document.querySelector('ds-button[size="md"] button');
      const lg = document.querySelector('ds-button[size="lg"] button');

      return {
        sm: sm?.classList.contains("ds-button--sm"),
        md: md?.classList.contains("ds-button--md"),
        lg: lg?.classList.contains("ds-button--lg"),
      };
    });

    expect(sizes.sm).toBe(true);
    expect(sizes.md).toBe(true);
    expect(sizes.lg).toBe(true);
  });
});
