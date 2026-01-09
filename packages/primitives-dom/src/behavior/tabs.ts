/**
 * Tabs behavior primitive.
 * Provides state management, ARIA computation, and keyboard handling for tabs.
 * Follows WAI-ARIA Tabs pattern.
 */

import { type RovingFocus, createRovingFocus } from "../keyboard/roving-focus.js";

// =============================================================================
// Types
// =============================================================================

export type TabsOrientation = "horizontal" | "vertical";
export type TabsActivationMode = "automatic" | "manual";

export interface TabsBehaviorOptions {
  /** Default selected tab value */
  defaultValue?: string;
  /** Tab orientation (affects arrow key navigation) */
  orientation?: TabsOrientation;
  /** Activation mode: automatic selects on focus, manual requires Enter/Space */
  activationMode?: TabsActivationMode;
  /** Whether to loop navigation at ends */
  loop?: boolean;
  /** Callback when tab value changes */
  onValueChange?: (value: string) => void;
  /** Custom ID generator */
  generateId?: () => string;
}

export interface TabsBehaviorState {
  value: string;
  orientation: TabsOrientation;
  activationMode: TabsActivationMode;
}

export interface TabsBehaviorContext {
  tablistId: string;
  tabs: Array<{ value: string; id: string; panelId: string; disabled?: boolean }>;
}

export type TabsEvent =
  | { type: "SELECT"; value: string }
  | { type: "FOCUS"; value: string }
  | { type: "REGISTER_TAB"; value: string; disabled?: boolean }
  | { type: "UNREGISTER_TAB"; value: string };

export interface TabListProps {
  id: string;
  role: "tablist";
  "aria-orientation": TabsOrientation;
}

export interface TabTriggerProps {
  id: string;
  role: "tab";
  tabIndex: number;
  "aria-selected": "true" | "false";
  "aria-controls": string;
  "aria-disabled": "true" | undefined;
}

export interface TabPanelProps {
  id: string;
  role: "tabpanel";
  "aria-labelledby": string;
  tabIndex: 0;
  hidden: boolean;
}

export interface TabsBehavior {
  /** Current state */
  readonly state: TabsBehaviorState;
  /** Internal context */
  readonly context: TabsBehaviorContext;
  /** Send event to state machine */
  send(event: TabsEvent): void;
  /** Select a tab by value */
  select(value: string): void;
  /** Get props for tablist element */
  getTabListProps(): TabListProps;
  /** Get props for tab trigger element */
  getTriggerProps(value: string, options?: { disabled?: boolean }): TabTriggerProps;
  /** Get props for tab panel element */
  getPanelProps(value: string): TabPanelProps;
  /** Handle keyboard events on tab trigger */
  handleTriggerKeyDown(event: KeyboardEvent, value: string): void;
  /** Handle click on tab trigger */
  handleTriggerClick(value: string): void;
  /** Handle focus on tab trigger */
  handleTriggerFocus(value: string): void;
  /** Set tablist element and activate roving focus */
  setTablistElement(element: HTMLElement | null): void;
  /** Register a tab */
  registerTab(value: string, options?: { disabled?: boolean }): void;
  /** Unregister a tab */
  unregisterTab(value: string): void;
  /** Cleanup resources */
  destroy(): void;
}

// =============================================================================
// Implementation
// =============================================================================

let idCounter = 0;

function defaultGenerateId(): string {
  return `tabs-${++idCounter}`;
}

/**
 * Creates a tabs behavior primitive.
 *
 * @example
 * ```ts
 * const tabs = createTabsBehavior({
 *   defaultValue: "tab1",
 *   onValueChange: (value) => console.log("selected:", value),
 * });
 *
 * // Register tabs
 * tabs.registerTab("tab1");
 * tabs.registerTab("tab2");
 * tabs.registerTab("tab3", { disabled: true });
 *
 * // Apply props to tablist
 * const tablistProps = tabs.getTabListProps();
 * tablist.setAttribute("role", tablistProps.role);
 *
 * // Apply props to each trigger
 * const triggerProps = tabs.getTriggerProps("tab1");
 * trigger1.setAttribute("aria-selected", triggerProps["aria-selected"]);
 *
 * // Apply props to each panel
 * const panelProps = tabs.getPanelProps("tab1");
 * panel1.hidden = panelProps.hidden;
 * ```
 */
export function createTabsBehavior(options: TabsBehaviorOptions = {}): TabsBehavior {
  const {
    defaultValue = "",
    orientation = "horizontal",
    activationMode = "automatic",
    loop = true,
    onValueChange,
    generateId = defaultGenerateId,
  } = options;

  // Generate stable IDs
  const baseId = generateId();
  const tablistId = `${baseId}-tablist`;

  // Internal state
  let state: TabsBehaviorState = {
    value: defaultValue,
    orientation,
    activationMode,
  };

  let context: TabsBehaviorContext = {
    tablistId,
    tabs: [],
  };

  // Roving focus for keyboard navigation
  let rovingFocus: RovingFocus | null = null;

  function getTabId(value: string): string {
    return `${baseId}-tab-${value}`;
  }

  function getPanelId(value: string): string {
    return `${baseId}-panel-${value}`;
  }

  function setValue(value: string): void {
    if (state.value === value) return;

    const tab = context.tabs.find((t) => t.value === value);
    if (tab?.disabled) return;

    state = { ...state, value };
    onValueChange?.(value);
  }

  function send(event: TabsEvent): void {
    switch (event.type) {
      case "SELECT":
        setValue(event.value);
        break;
      case "FOCUS":
        // In automatic mode, focus also selects
        if (state.activationMode === "automatic") {
          setValue(event.value);
        }
        break;
      case "REGISTER_TAB": {
        const exists = context.tabs.some((t) => t.value === event.value);
        if (!exists) {
          context = {
            ...context,
            tabs: [
              ...context.tabs,
              {
                value: event.value,
                id: getTabId(event.value),
                panelId: getPanelId(event.value),
                disabled: event.disabled,
              },
            ],
          };
          // If no value set and this is first non-disabled tab, select it
          if (!state.value && !event.disabled) {
            state = { ...state, value: event.value };
          }
        }
        break;
      }
      case "UNREGISTER_TAB": {
        const index = context.tabs.findIndex((t) => t.value === event.value);
        if (index !== -1) {
          const newTabs = [...context.tabs];
          newTabs.splice(index, 1);
          context = { ...context, tabs: newTabs };
        }
        break;
      }
    }
  }

  function select(value: string): void {
    send({ type: "SELECT", value });
  }

  function getTabListProps(): TabListProps {
    return {
      id: tablistId,
      role: "tablist",
      "aria-orientation": state.orientation,
    };
  }

  function getTriggerProps(value: string, opts: { disabled?: boolean } = {}): TabTriggerProps {
    const { disabled = false } = opts;
    const isSelected = state.value === value;
    const tab = context.tabs.find((t) => t.value === value);

    return {
      id: tab?.id ?? getTabId(value),
      role: "tab",
      tabIndex: isSelected ? 0 : -1,
      "aria-selected": isSelected ? "true" : "false",
      "aria-controls": tab?.panelId ?? getPanelId(value),
      "aria-disabled": disabled ? "true" : undefined,
    };
  }

  function getPanelProps(value: string): TabPanelProps {
    const tab = context.tabs.find((t) => t.value === value);
    const isSelected = state.value === value;

    return {
      id: tab?.panelId ?? getPanelId(value),
      role: "tabpanel",
      "aria-labelledby": tab?.id ?? getTabId(value),
      tabIndex: 0,
      hidden: !isSelected,
    };
  }

  function handleTriggerKeyDown(event: KeyboardEvent, value: string): void {
    const tab = context.tabs.find((t) => t.value === value);
    if (tab?.disabled) return;

    // Handle Enter/Space for manual activation
    if (state.activationMode === "manual") {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        select(value);
      }
    }

    // Home/End keys
    if (event.key === "Home") {
      event.preventDefault();
      const firstEnabled = context.tabs.find((t) => !t.disabled);
      if (firstEnabled) {
        send({ type: "FOCUS", value: firstEnabled.value });
        // Focus the trigger element
        const trigger = document.getElementById(firstEnabled.id);
        trigger?.focus();
      }
    } else if (event.key === "End") {
      event.preventDefault();
      const lastEnabled = [...context.tabs].reverse().find((t) => !t.disabled);
      if (lastEnabled) {
        send({ type: "FOCUS", value: lastEnabled.value });
        // Focus the trigger element
        const trigger = document.getElementById(lastEnabled.id);
        trigger?.focus();
      }
    }

    // Arrow key navigation is handled by roving focus
  }

  function handleTriggerClick(value: string): void {
    const tab = context.tabs.find((t) => t.value === value);
    if (tab?.disabled) return;

    select(value);
  }

  function handleTriggerFocus(value: string): void {
    const tab = context.tabs.find((t) => t.value === value);
    if (tab?.disabled) return;

    send({ type: "FOCUS", value });
  }

  function setTablistElement(element: HTMLElement | null): void {
    rovingFocus?.destroy();
    rovingFocus = null;

    if (element) {
      const direction = state.orientation === "horizontal" ? "horizontal" : "vertical";

      rovingFocus = createRovingFocus({
        container: element,
        selector: '[role="tab"]:not([aria-disabled="true"])',
        direction,
        loop,
        skipDisabled: true,
        onFocus: (focusedElement) => {
          // Find the tab value from the focused element
          const tabId = focusedElement.id;
          const tab = context.tabs.find((t) => t.id === tabId);
          if (tab) {
            send({ type: "FOCUS", value: tab.value });
          }
        },
      });
    }
  }

  function registerTab(value: string, opts: { disabled?: boolean } = {}): void {
    send({ type: "REGISTER_TAB", value, disabled: opts.disabled });
  }

  function unregisterTab(value: string): void {
    send({ type: "UNREGISTER_TAB", value });
  }

  function destroy(): void {
    rovingFocus?.destroy();
    rovingFocus = null;
  }

  return {
    get state() {
      return state;
    },
    get context() {
      return context;
    },
    send,
    select,
    getTabListProps,
    getTriggerProps,
    getPanelProps,
    handleTriggerKeyDown,
    handleTriggerClick,
    handleTriggerFocus,
    setTablistElement,
    registerTab,
    unregisterTab,
    destroy,
  };
}
