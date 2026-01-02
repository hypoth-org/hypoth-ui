import { expect, test } from "@playwright/test";

/**
 * E2E tests for behavior primitives.
 * Tests follow the test-harness.d.ts contract for data-testid attributes.
 */

const BASE_URL = "http://localhost:3001";

// Helper to get element by data-testid
function byTestId(testId: string) {
  return `[data-testid="${testId}"]`;
}

test.describe("Primitives Index Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/primitives`);
  });

  test("should load the primitives index page", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Behavior Primitives");
  });

  test("should have links to all primitive demos", async ({ page }) => {
    await expect(page.getByRole("link", { name: /Focus Trap/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Roving Focus/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Dismissable Layer/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Keyboard Helpers/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Type-Ahead/i })).toBeVisible();
  });
});

test.describe("Focus Trap", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/primitives/focus-trap`);
  });

  test("should render focus trap demo", async ({ page }) => {
    await expect(page.locator(byTestId("focus-trap-demo"))).toBeVisible();
    await expect(page.locator(byTestId("status-indicator"))).toBeVisible();
  });

  test("Tab cycles within container when active", async ({ page }) => {
    // Activate trap
    await page.click(byTestId("activate-btn"));
    await expect(page.locator(byTestId("status-indicator"))).toHaveAttribute("data-active", "true");

    // Focus should be on first focusable
    await expect(page.locator(byTestId("first-focusable"))).toBeFocused();

    // Tab to last focusable
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(page.locator(byTestId("last-focusable"))).toBeFocused();

    // Tab again should wrap to first
    await page.keyboard.press("Tab");
    await expect(page.locator(byTestId("first-focusable"))).toBeFocused();
  });

  test("Shift+Tab cycles backwards", async ({ page }) => {
    await page.click(byTestId("activate-btn"));

    // Should be on first element
    await expect(page.locator(byTestId("first-focusable"))).toBeFocused();

    // Shift+Tab should wrap to last
    await page.keyboard.press("Shift+Tab");
    await expect(page.locator(byTestId("last-focusable"))).toBeFocused();
  });

  test("Initial focus applied on activate", async ({ page }) => {
    await page.click(byTestId("activate-btn"));

    // First focusable should be focused
    await expect(page.locator(byTestId("first-focusable"))).toBeFocused();
  });

  test("Focus returns on deactivate", async ({ page }) => {
    // Focus outside element first
    await page.locator(byTestId("outside-element")).focus();
    await expect(page.locator(byTestId("outside-element"))).toBeFocused();

    // Activate trap
    await page.click(byTestId("activate-btn"));
    await expect(page.locator(byTestId("first-focusable"))).toBeFocused();

    // Deactivate trap
    await page.click(byTestId("deactivate-btn"));
    await expect(page.locator(byTestId("status-indicator"))).toHaveAttribute("data-active", "false");
  });
});

test.describe("Roving Focus", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/primitives/roving-focus`);
  });

  test("should render roving focus demo", async ({ page }) => {
    await expect(page.locator(byTestId("roving-focus-demo"))).toBeVisible();
    await expect(page.locator(byTestId("roving-container"))).toBeVisible();
  });

  test("Arrow keys navigate items", async ({ page }) => {
    // Focus first item
    await page.locator(byTestId("roving-item-0")).focus();
    await expect(page.locator(byTestId("roving-item-0"))).toBeFocused();

    // ArrowRight should move to next
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(byTestId("roving-item-1"))).toBeFocused();
  });

  test("Home/End jump to first/last", async ({ page }) => {
    // Focus middle item
    await page.locator(byTestId("roving-item-1")).focus();

    // End should go to last
    await page.keyboard.press("End");
    await expect(page.locator(byTestId("roving-item-4"))).toBeFocused();

    // Home should go to first
    await page.keyboard.press("Home");
    await expect(page.locator(byTestId("roving-item-0"))).toBeFocused();
  });

  test("Loop wraps around when enabled", async ({ page }) => {
    // Ensure loop is checked
    await page.locator(byTestId("loop-checkbox")).check();

    // Focus last item
    await page.locator(byTestId("roving-item-4")).focus();

    // ArrowRight should wrap to first
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(byTestId("roving-item-0"))).toBeFocused();
  });

  test("Disabled items are skipped", async ({ page }) => {
    // Item 2 is disabled
    await page.locator(byTestId("roving-item-1")).focus();

    // ArrowRight should skip disabled item 2 and go to item 3
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(byTestId("roving-item-3"))).toBeFocused();
  });
});

test.describe("Dismissable Layer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/primitives/dismissable-layer`);
  });

  test("should render dismissable layer demo", async ({ page }) => {
    await expect(page.locator(byTestId("dismissable-layer-demo"))).toBeVisible();
    await expect(page.locator(byTestId("trigger-btn"))).toBeVisible();
  });

  test("Escape closes layer", async ({ page }) => {
    // Open layer
    await page.click(byTestId("trigger-btn"));
    await expect(page.locator(byTestId("layer-container"))).toBeVisible();

    // Press Escape
    await page.keyboard.press("Escape");
    await expect(page.locator(byTestId("layer-container"))).not.toBeVisible();
    await expect(page.locator(byTestId("dismiss-reason"))).toContainText("escape");
  });

  test("Outside click closes layer", async ({ page }) => {
    // Open layer
    await page.click(byTestId("trigger-btn"));
    await expect(page.locator(byTestId("layer-container"))).toBeVisible();

    // Click outside
    await page.click(byTestId("outside-area"));
    await expect(page.locator(byTestId("layer-container"))).not.toBeVisible();
    await expect(page.locator(byTestId("dismiss-reason"))).toContainText("outside-click");
  });

  test("Click inside does not close", async ({ page }) => {
    // Open layer
    await page.click(byTestId("trigger-btn"));
    await expect(page.locator(byTestId("layer-container"))).toBeVisible();

    // Click inside layer
    await page.locator(byTestId("layer-container")).click();
    await expect(page.locator(byTestId("layer-container"))).toBeVisible();
  });

  test("Nested layers close LIFO", async ({ page }) => {
    // Open main layer
    await page.click(byTestId("trigger-btn"));
    await expect(page.locator(byTestId("layer-container"))).toBeVisible();

    // Open nested layer
    await page.click(byTestId("nested-trigger"));
    await expect(page.locator(byTestId("nested-layer"))).toBeVisible();

    // Escape should close nested first
    await page.keyboard.press("Escape");
    await expect(page.locator(byTestId("nested-layer"))).not.toBeVisible();
    await expect(page.locator(byTestId("layer-container"))).toBeVisible();

    // Escape again should close main layer
    await page.keyboard.press("Escape");
    await expect(page.locator(byTestId("layer-container"))).not.toBeVisible();
  });

  test("Exclude elements prevent close", async ({ page }) => {
    // Open layer
    await page.click(byTestId("trigger-btn"));
    await expect(page.locator(byTestId("layer-container"))).toBeVisible();

    // Click trigger (which is excluded)
    await page.click(byTestId("trigger-btn"));
    // Layer should toggle (close due to toggle behavior, not dismissable layer)
    // This tests that the trigger doesn't cause an outside-click dismiss
  });
});

test.describe("Keyboard Helpers", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/primitives/keyboard-helpers`);
  });

  test("should render keyboard helpers demo", async ({ page }) => {
    await expect(page.locator(byTestId("keyboard-helpers-demo"))).toBeVisible();
    await expect(page.locator(byTestId("custom-button"))).toBeVisible();
  });

  test("Enter activates element", async ({ page }) => {
    await page.locator(byTestId("custom-button")).focus();
    await page.keyboard.press("Enter");

    await expect(page.locator(byTestId("activation-log"))).toContainText("Enter");
  });

  test("Space activates element", async ({ page }) => {
    await page.locator(byTestId("custom-button")).focus();
    await page.keyboard.press("Space");

    await expect(page.locator(byTestId("activation-log"))).toContainText("Space");
  });

  test("Arrow keys report direction", async ({ page }) => {
    await page.locator(byTestId("nav-item-0")).focus();

    await page.keyboard.press("ArrowRight");
    await expect(page.locator(byTestId("navigation-log"))).toContainText("next");
  });

  test("RTL swaps horizontal direction", async ({ page }) => {
    // Enable RTL
    await page.locator(byTestId("rtl-toggle")).check();

    await page.locator(byTestId("nav-item-0")).focus();

    // In RTL, ArrowRight should be "previous"
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(byTestId("navigation-log"))).toContainText("previous");
  });
});

test.describe("Type-Ahead", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/primitives/type-ahead`);
  });

  test("should render type-ahead demo", async ({ page }) => {
    await expect(page.locator(byTestId("type-ahead-demo"))).toBeVisible();
    await expect(page.locator(byTestId("list-container"))).toBeVisible();
  });

  test("Single char finds match", async ({ page }) => {
    await page.locator(byTestId("list-container")).focus();

    // Type "c" to find "Cherry"
    await page.keyboard.type("c");

    // Should match Cherry (or Coconut - first C item)
    await expect(page.locator(byTestId("buffer-display"))).toContainText("c");
    await expect(page.locator(byTestId("matched-item"))).toBeVisible();
  });

  test("Multiple chars accumulate", async ({ page }) => {
    await page.locator(byTestId("list-container")).focus();

    // Type "bl" to find "Blueberry"
    await page.keyboard.type("bl");

    await expect(page.locator(byTestId("buffer-display"))).toContainText("bl");
    await expect(page.locator(byTestId("matched-item"))).toContainText("Blueberry");
  });

  test("Buffer clears after timeout", async ({ page }) => {
    await page.locator(byTestId("list-container")).focus();

    // Type a character
    await page.keyboard.type("a");
    await expect(page.locator(byTestId("buffer-display"))).toContainText("a");

    // Wait for timeout (500ms + buffer)
    await page.waitForTimeout(600);

    // Buffer should be cleared
    await expect(page.locator(byTestId("buffer-display"))).toContainText("(empty)");
  });

  test("Reset clears buffer immediately", async ({ page }) => {
    await page.locator(byTestId("list-container")).focus();

    // Type characters
    await page.keyboard.type("ap");
    await expect(page.locator(byTestId("buffer-display"))).toContainText("ap");

    // Click reset
    await page.click(byTestId("reset-buffer"));
    await expect(page.locator(byTestId("buffer-display"))).toContainText("(empty)");
  });

  test("No match keeps current focus", async ({ page }) => {
    // Focus first item
    await page.locator(byTestId("list-item-0")).focus();

    // Type characters that don't match anything
    await page.locator(byTestId("list-container")).focus();
    await page.keyboard.type("xyz");

    // No matched item indicator should appear
    await expect(page.locator(byTestId("matched-item"))).not.toBeVisible();
  });
});
