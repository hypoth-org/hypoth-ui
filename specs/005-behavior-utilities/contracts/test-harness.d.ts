/**
 * Test Harness Page Contract
 *
 * Defines the required structure and data-testid attributes for
 * behavior utility test harness pages used in E2E testing.
 *
 * @feature 005-behavior-utilities
 */

// =============================================================================
// COMMON PATTERNS
// =============================================================================

/**
 * All test harness pages must include these data-testid patterns.
 */
interface TestHarnessContract {
  /**
   * Root container for the demo.
   * Format: "{utility-name}-demo"
   * Example: "focus-trap-demo", "dismissable-layer-demo"
   */
  rootTestId: string;

  /**
   * Activation button (if utility has activate/deactivate lifecycle).
   * Format: "activate-btn"
   */
  activateButtonTestId?: "activate-btn";

  /**
   * Deactivation button (if utility has activate/deactivate lifecycle).
   * Format: "deactivate-btn"
   */
  deactivateButtonTestId?: "deactivate-btn";

  /**
   * Status indicator showing current utility state.
   * Format: "status-indicator"
   * Should include data-active="true" or data-active="false" attribute.
   */
  statusIndicatorTestId: "status-indicator";
}

// =============================================================================
// FOCUS TRAP HARNESS
// =============================================================================

/**
 * Focus Trap Demo Page Contract
 * Route: /primitives/focus-trap
 */
interface FocusTrapHarness extends TestHarnessContract {
  rootTestId: "focus-trap-demo";

  /**
   * Container that will be focus-trapped.
   */
  containerTestId: "trap-container";

  /**
   * First focusable element inside container.
   */
  firstFocusableTestId: "first-focusable";

  /**
   * Last focusable element inside container.
   */
  lastFocusableTestId: "last-focusable";

  /**
   * Element outside container to verify focus doesn't escape.
   */
  outsideElementTestId: "outside-element";
}

// =============================================================================
// ROVING FOCUS HARNESS
// =============================================================================

/**
 * Roving Focus Demo Page Contract
 * Route: /primitives/roving-focus
 */
interface RovingFocusHarness extends TestHarnessContract {
  rootTestId: "roving-focus-demo";

  /**
   * Container for roving focus items.
   */
  containerTestId: "roving-container";

  /**
   * Roving focus items (toolbar buttons, tab list items, etc.).
   * Format: "roving-item-{index}" where index is 0-based.
   */
  itemTestIdPattern: "roving-item-{index}";

  /**
   * Orientation toggle (horizontal/vertical/both).
   */
  orientationSelectTestId: "orientation-select";

  /**
   * Loop toggle checkbox.
   */
  loopCheckboxTestId: "loop-checkbox";
}

// =============================================================================
// DISMISSABLE LAYER HARNESS
// =============================================================================

/**
 * Dismissable Layer Demo Page Contract
 * Route: /primitives/dismissable-layer
 */
interface DismissableLayerHarness extends TestHarnessContract {
  rootTestId: "dismissable-layer-demo";

  /**
   * Trigger button that opens the layer.
   */
  triggerButtonTestId: "trigger-btn";

  /**
   * The dismissable layer container (popover/dropdown).
   */
  layerContainerTestId: "layer-container";

  /**
   * Area outside the layer for click-outside testing.
   */
  outsideAreaTestId: "outside-area";

  /**
   * Nested layer trigger (for testing layer stack).
   */
  nestedTriggerTestId: "nested-trigger";

  /**
   * Nested layer container.
   */
  nestedLayerTestId: "nested-layer";

  /**
   * Dismiss reason indicator.
   * Shows "escape" or "outside-click" after dismissal.
   */
  dismissReasonTestId: "dismiss-reason";
}

// =============================================================================
// KEYBOARD HELPERS HARNESS
// =============================================================================

/**
 * Keyboard Helpers Demo Page Contract
 * Route: /primitives/keyboard-helpers
 */
interface KeyboardHelpersHarness extends TestHarnessContract {
  rootTestId: "keyboard-helpers-demo";

  /**
   * Custom button element for activation testing.
   */
  customButtonTestId: "custom-button";

  /**
   * Log display showing activation events.
   */
  activationLogTestId: "activation-log";

  /**
   * Navigation container for arrow key testing.
   */
  navigationContainerTestId: "nav-container";

  /**
   * Navigation items.
   * Format: "nav-item-{index}"
   */
  navItemTestIdPattern: "nav-item-{index}";

  /**
   * Log display showing navigation events.
   */
  navigationLogTestId: "navigation-log";

  /**
   * RTL toggle for testing right-to-left navigation.
   */
  rtlToggleTestId: "rtl-toggle";
}

// =============================================================================
// TYPE-AHEAD HARNESS
// =============================================================================

/**
 * Type-Ahead Demo Page Contract
 * Route: /primitives/type-ahead
 */
interface TypeAheadHarness extends TestHarnessContract {
  rootTestId: "type-ahead-demo";

  /**
   * List container for type-ahead search.
   */
  listContainerTestId: "list-container";

  /**
   * List items.
   * Format: "list-item-{index}"
   */
  listItemTestIdPattern: "list-item-{index}";

  /**
   * Current buffer display.
   */
  bufferDisplayTestId: "buffer-display";

  /**
   * Matched item indicator.
   */
  matchedItemTestId: "matched-item";

  /**
   * Reset buffer button.
   */
  resetBufferTestId: "reset-buffer";
}

// =============================================================================
// E2E TEST SELECTORS
// =============================================================================

/**
 * Helper function pattern for E2E tests.
 * Implementation in Playwright:
 *
 * ```typescript
 * function byTestId(testId: string) {
 *   return page.locator(`[data-testid="${testId}"]`);
 * }
 * ```
 */
type TestIdSelector = `[data-testid="${string}"]`;

/**
 * E2E test file should cover these scenarios for each utility.
 */
interface E2ETestCoverage {
  focusTrap: [
    "Tab cycles within container",
    "Shift+Tab cycles backwards",
    "Initial focus applied on activate",
    "Focus returns on deactivate",
  ];

  rovingFocus: [
    "Arrow keys navigate items",
    "Home/End jump to first/last",
    "Loop wraps around (when enabled)",
    "Disabled items are skipped",
    "Tab exits the widget",
  ];

  dismissableLayer: [
    "Escape closes layer",
    "Outside click closes layer",
    "Click inside does not close",
    "Nested layers close LIFO",
    "Exclude elements prevent close",
  ];

  keyboardHelpers: [
    "Enter activates element",
    "Space activates element",
    "Arrow keys report direction",
    "RTL swaps horizontal direction",
  ];

  typeAhead: [
    "Single char finds match",
    "Multiple chars accumulate",
    "Buffer clears after timeout",
    "No match keeps current focus",
    "Reset clears buffer immediately",
  ];
}
