/**
 * A11y Test Utilities
 *
 * Shared helpers for accessibility testing across all components.
 * Follows patterns established in existing dialog.test.ts.
 */
import type { TemplateResult } from "lit";
import { render } from "lit";

/**
 * Default wait time for Lit component render cycles.
 * 50ms is sufficient for most components; overlay components may need longer.
 */
export const DEFAULT_RENDER_WAIT = 50;

/**
 * Wait time for components with animations or async operations.
 */
export const ANIMATION_RENDER_WAIT = 100;

/**
 * Creates a test container attached to document.body.
 * Use in beforeEach to set up test fixtures.
 */
export function createTestContainer(): HTMLElement {
  const container = document.createElement("div");
  container.setAttribute("data-testid", "a11y-test-container");
  document.body.appendChild(container);
  return container;
}

/**
 * Removes a test container and cleans up any portaled/orphaned elements.
 * Use in afterEach to clean up test fixtures.
 *
 * @param container - The container created by createTestContainer
 * @param componentSelector - Optional selector for cleaning up portaled elements (e.g., "ds-dialog")
 */
export function cleanupTestContainer(
  container: HTMLElement,
  componentSelector?: string
): void {
  container.remove();
  if (componentSelector) {
    document
      .querySelectorAll(componentSelector)
      .forEach((el) => el.remove());
  }
}

/**
 * Renders a Lit template into a container and waits for component initialization.
 *
 * @param template - Lit html template to render
 * @param container - Container element to render into
 * @param waitMs - Time to wait for render (default: DEFAULT_RENDER_WAIT)
 */
export async function renderAndWait(
  template: TemplateResult,
  container: HTMLElement,
  waitMs: number = DEFAULT_RENDER_WAIT
): Promise<void> {
  render(template, container);
  await wait(waitMs);
}

/**
 * Waits for a specified duration.
 * Useful for waiting for animations or async operations.
 *
 * @param ms - Milliseconds to wait
 */
export function wait(ms: number = DEFAULT_RENDER_WAIT): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Dispatches a keyboard event on a target element or document.
 *
 * @param key - The key to press (e.g., "Escape", "Enter", "Tab")
 * @param target - Element or document to dispatch event on (default: document)
 * @param options - Additional keyboard event options
 */
export function pressKey(
  key: string,
  target: EventTarget = document,
  options: Partial<KeyboardEventInit> = {}
): void {
  const event = new KeyboardEvent("keydown", {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  target.dispatchEvent(event);
}

/**
 * Simulates pressing Tab key to move focus.
 *
 * @param shift - If true, simulates Shift+Tab (reverse tab)
 * @param target - Element to dispatch event on
 */
export function pressTab(
  shift = false,
  target: EventTarget = document
): void {
  pressKey("Tab", target, { shiftKey: shift });
}

/**
 * Simulates pressing Escape key.
 *
 * @param target - Element to dispatch event on
 */
export function pressEscape(target: EventTarget = document): void {
  pressKey("Escape", target);
}

/**
 * Simulates pressing Enter key.
 *
 * @param target - Element to dispatch event on
 */
export function pressEnter(target: EventTarget = document): void {
  pressKey("Enter", target);
}

/**
 * Simulates pressing Space key.
 *
 * @param target - Element to dispatch event on
 */
export function pressSpace(target: EventTarget = document): void {
  pressKey(" ", target);
}

/**
 * Simulates pressing Arrow keys.
 *
 * @param direction - Arrow direction: "Up", "Down", "Left", "Right"
 * @param target - Element to dispatch event on
 */
export function pressArrow(
  direction: "Up" | "Down" | "Left" | "Right",
  target: EventTarget = document
): void {
  pressKey(`Arrow${direction}`, target);
}

/**
 * Gets the currently focused element, accounting for shadow DOM.
 */
export function getActiveElement(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active;
}

/**
 * Checks if focus is within a specific element (including shadow DOM).
 *
 * @param container - Element to check focus containment
 */
export function isFocusWithin(container: Element): boolean {
  const active = getActiveElement();
  return active !== null && container.contains(active);
}

/**
 * axe-core configuration for common exclusions.
 * Use with axe() to exclude known or expected issues.
 */
export const axeConfig = {
  /**
   * Default rules that may need exclusion for certain component patterns.
   */
  rules: {
    // Disable region rule for isolated component testing
    region: { enabled: false },
    // Disable landmark rules for component-level tests
    "landmark-one-main": { enabled: false },
    "landmark-unique": { enabled: false },
  },
};

/**
 * axe-core configuration for testing custom elements.
 * Disables rules that flag false positives on custom element tag names.
 *
 * Note: aria-allowed-attr requires a valid role attribute on elements using
 * aria-label/aria-labelledby. Custom elements like <ds-button> don't have
 * inherent roles, so we test the rendered content instead.
 */
export const axeCustomElementConfig = {
  rules: {
    // Custom elements without role may use aria-label for labeling
    "aria-allowed-attr": { enabled: false },
    // Disable region rule for isolated component testing
    region: { enabled: false },
    // Disable landmark rules for component-level tests
    "landmark-one-main": { enabled: false },
    "landmark-unique": { enabled: false },
  },
};

/**
 * List of all DS component selectors for cleanup.
 * Useful for afterEach cleanup when testing portaled components.
 */
export const DS_COMPONENT_SELECTORS = [
  "ds-dialog",
  "ds-drawer",
  "ds-sheet",
  "ds-popover",
  "ds-tooltip",
  "ds-dropdown-menu",
  "ds-context-menu",
  "ds-alert-dialog",
  "ds-command",
  "ds-toast",
  "ds-hover-card",
] as const;

/**
 * Cleans up all portaled DS components from document body.
 * Call in afterEach when testing overlay components.
 */
export function cleanupPortaledComponents(): void {
  DS_COMPONENT_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (!el.closest("[data-testid='a11y-test-container']")) {
        el.remove();
      }
    });
  });
}
