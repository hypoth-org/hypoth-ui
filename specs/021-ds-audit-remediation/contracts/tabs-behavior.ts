/**
 * Tabs Behavior Primitive Contract
 *
 * This file defines the API contract for createTabsBehavior.
 * Implementation should be placed in @ds/primitives-dom/src/behavior/tabs.ts
 */

// =============================================================================
// OPTIONS
// =============================================================================

/**
 * Configuration options for creating a tabs behavior instance.
 */
export interface TabsBehaviorOptions {
  /**
   * Initial selected tab value.
   * If not provided, the first registered tab will be selected.
   */
  defaultValue?: string;

  /**
   * Keyboard navigation orientation.
   * - 'horizontal': Left/Right arrows navigate tabs
   * - 'vertical': Up/Down arrows navigate tabs
   * @default 'horizontal'
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Tab activation behavior on focus.
   * - 'automatic': Selection follows focus (tab selected immediately on arrow key)
   * - 'manual': Focus moves but selection requires Enter/Space key
   * @default 'automatic'
   */
  activationMode?: "automatic" | "manual";

  /**
   * Whether arrow key navigation wraps around at boundaries.
   * @default true
   */
  loop?: boolean;

  /**
   * Callback invoked when selected tab changes.
   */
  onValueChange?: (value: string) => void;

  /**
   * Custom ID generator for accessibility IDs.
   * @default () => crypto.randomUUID().slice(0, 8)
   */
  generateId?: () => string;
}

// =============================================================================
// STATE
// =============================================================================

/**
 * Read-only state exposed by TabsBehavior.
 */
export interface TabsBehaviorState {
  /**
   * Currently selected tab value.
   * May be undefined if no tabs are registered or selected.
   */
  value: string | undefined;

  /**
   * Current orientation.
   */
  orientation: "horizontal" | "vertical";

  /**
   * Current activation mode.
   */
  activationMode: "automatic" | "manual";

  /**
   * Currently focused tab value.
   * In manual mode, may differ from selected value.
   */
  focusedValue: string | undefined;
}

// =============================================================================
// PROPS INTERFACES
// =============================================================================

/**
 * ARIA attributes for the tablist container.
 */
export interface TabListProps {
  role: "tablist";
  "aria-orientation": "horizontal" | "vertical";
}

/**
 * ARIA attributes for an individual tab trigger.
 */
export interface TabTriggerProps {
  /** Unique ID for accessibility linking */
  id: string;

  /** ARIA role */
  role: "tab";

  /**
   * Tab index for keyboard navigation.
   * - 0: Currently selected/focused tab (receives focus)
   * - -1: Other tabs (focusable but not in tab order)
   */
  tabIndex: 0 | -1;

  /** Whether this tab is selected */
  "aria-selected": "true" | "false";

  /** ID of the associated panel */
  "aria-controls": string;

  /** Whether this tab is disabled */
  "aria-disabled"?: "true";
}

/**
 * ARIA attributes for a tab panel.
 */
export interface TabPanelProps {
  /** Unique ID for accessibility linking */
  id: string;

  /** ARIA role */
  role: "tabpanel";

  /**
   * Tab index for keyboard navigation.
   * - 0: Panel is focusable when its tab is selected
   */
  tabIndex: 0;

  /** ID of the associated tab trigger */
  "aria-labelledby": string;

  /** Whether this panel should be hidden */
  hidden: boolean;
}

// =============================================================================
// BEHAVIOR INTERFACE
// =============================================================================

/**
 * Public API returned by createTabsBehavior.
 */
export interface TabsBehavior {
  /**
   * Read-only current state.
   */
  readonly state: TabsBehaviorState;

  /**
   * Select a tab by value.
   * In automatic mode, also moves focus to the tab.
   * In manual mode, only selects without moving focus.
   */
  selectTab(value: string): void;

  /**
   * Move focus to a tab without selecting it.
   * Only meaningful in manual activation mode.
   * In automatic mode, this also selects the tab.
   */
  focusTab(value: string): void;

  /**
   * Move focus to the next tab in the navigation order.
   * Respects orientation and loop settings.
   */
  focusNextTab(): void;

  /**
   * Move focus to the previous tab in the navigation order.
   * Respects orientation and loop settings.
   */
  focusPreviousTab(): void;

  /**
   * Move focus to the first tab.
   */
  focusFirstTab(): void;

  /**
   * Move focus to the last tab.
   */
  focusLastTab(): void;

  /**
   * Register a tab value.
   * Call when a tab trigger mounts.
   */
  registerTab(value: string): void;

  /**
   * Unregister a tab value.
   * Call when a tab trigger unmounts.
   */
  unregisterTab(value: string): void;

  /**
   * Set a tab as disabled.
   */
  setTabDisabled(value: string, disabled: boolean): void;

  /**
   * Get ARIA props for the tablist container.
   */
  getTabListProps(): TabListProps;

  /**
   * Get ARIA props for a specific tab trigger.
   */
  getTriggerProps(value: string): TabTriggerProps;

  /**
   * Get ARIA props for a specific tab panel.
   */
  getPanelProps(value: string): TabPanelProps;

  /**
   * Handle keyboard events on the tablist.
   * Call this from the tablist's keydown handler.
   *
   * Handles:
   * - Arrow keys (based on orientation)
   * - Home/End keys
   * - Enter/Space (in manual mode)
   */
  handleKeyDown(event: KeyboardEvent): void;

  /**
   * Update options after creation.
   */
  setOptions(options: Partial<TabsBehaviorOptions>): void;

  /**
   * Clean up resources.
   * Call when the tabs component unmounts.
   */
  destroy(): void;
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create a tabs behavior instance.
 *
 * @example
 * ```typescript
 * const tabs = createTabsBehavior({
 *   defaultValue: 'tab1',
 *   orientation: 'horizontal',
 *   activationMode: 'automatic',
 *   onValueChange: (value) => console.log('Selected:', value),
 * });
 *
 * // Register tabs
 * tabs.registerTab('tab1');
 * tabs.registerTab('tab2');
 * tabs.registerTab('tab3');
 *
 * // Get props for rendering
 * const listProps = tabs.getTabListProps();
 * const tab1Props = tabs.getTriggerProps('tab1');
 * const panel1Props = tabs.getPanelProps('tab1');
 *
 * // Handle keyboard navigation
 * tablistElement.addEventListener('keydown', tabs.handleKeyDown);
 *
 * // Cleanup
 * tabs.destroy();
 * ```
 */
export declare function createTabsBehavior(
  options?: TabsBehaviorOptions
): TabsBehavior;
