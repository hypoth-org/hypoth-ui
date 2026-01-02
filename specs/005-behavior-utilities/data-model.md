# Data Model: Behavior Utilities

**Feature**: 005-behavior-utilities
**Date**: 2026-01-02

## Overview

This document defines the TypeScript interfaces, types, and state structures for the behavior utilities. Since these are stateless utilities (state captured in closures), the "data model" focuses on API contracts rather than persisted entities.

## Type Definitions

### Shared Types

```typescript
/**
 * Standard direction type for navigation utilities.
 */
export type Direction = "horizontal" | "vertical" | "both";

/**
 * Logical navigation direction (locale-aware).
 */
export type LogicalDirection = "next" | "previous" | "first" | "last";

/**
 * Physical arrow key direction.
 */
export type PhysicalDirection = "up" | "down" | "left" | "right";
```

---

## Focus Trap

### Options Interface

```typescript
export interface FocusTrapOptions {
  /**
   * The container element that traps focus.
   * @required
   */
  container: HTMLElement;

  /**
   * Element to focus when trap activates.
   * If null, focuses first focusable element.
   * @default null
   */
  initialFocus?: HTMLElement | null;

  /**
   * Where to return focus when trap deactivates.
   * - `true`: Return to previously focused element
   * - `false`: Don't manage return focus
   * - `HTMLElement`: Focus specific element
   * @default true
   */
  returnFocus?: boolean | HTMLElement;

  /**
   * Element to focus if container has no focusable elements.
   * Container should be focusable (tabindex="-1") for this to work.
   * @default undefined
   */
  fallbackFocus?: HTMLElement;
}
```

### Return Interface

```typescript
export interface FocusTrap {
  /**
   * Activates the focus trap.
   * Moves focus to initialFocus or first focusable element.
   */
  activate: () => void;

  /**
   * Deactivates the focus trap.
   * Returns focus per returnFocus option.
   */
  deactivate: () => void;
}
```

### Internal State (Closure-Captured)

| Field | Type | Description |
|-------|------|-------------|
| `isActive` | `boolean` | Whether trap is currently active |
| `previouslyFocused` | `HTMLElement \| null` | Element focused before activation |

---

## Roving Focus

### Options Interface

```typescript
export interface RovingFocusOptions {
  /**
   * Container element for the roving focus group.
   * @required
   */
  container: HTMLElement;

  /**
   * CSS selector to find focusable items within container.
   * @required
   */
  selector: string;

  /**
   * Arrow key navigation direction.
   * - "horizontal": Left/Right arrows
   * - "vertical": Up/Down arrows
   * - "both": All arrow keys
   * @default "horizontal"
   */
  direction?: Direction;

  /**
   * Whether navigation wraps from last to first (and vice versa).
   * @default true
   */
  loop?: boolean;

  /**
   * Whether to skip disabled items during navigation.
   * Checks for `disabled` attribute and `aria-disabled="true"`.
   * @default true
   */
  skipDisabled?: boolean;

  /**
   * Callback invoked when focus moves to a new item.
   */
  onFocus?: (element: HTMLElement, index: number) => void;
}
```

### Return Interface

```typescript
export interface RovingFocus {
  /**
   * Sets focus to the item at the given index.
   */
  setFocusedIndex: (index: number) => void;

  /**
   * Returns the currently focused item index.
   */
  getFocusedIndex: () => number;

  /**
   * Removes event listeners and cleans up.
   */
  destroy: () => void;
}
```

### Internal State

| Field | Type | Description |
|-------|------|-------------|
| `currentIndex` | `number` | Index of currently focused item |

---

## Dismissable Layer

### Options Interface

```typescript
export interface DismissableLayerOptions {
  /**
   * The layer container element.
   * @required
   */
  container: HTMLElement;

  /**
   * Elements that should not trigger outside-click dismissal.
   * Typically includes the trigger button.
   * @default []
   */
  excludeElements?: HTMLElement[];

  /**
   * Callback invoked when layer should be dismissed.
   * @required
   */
  onDismiss: (reason: DismissReason) => void;

  /**
   * Whether Escape key dismisses the layer.
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Whether clicking outside dismisses the layer.
   * @default true
   */
  closeOnOutsideClick?: boolean;
}

export type DismissReason = "escape" | "outside-click";
```

### Return Interface

```typescript
export interface DismissableLayer {
  /**
   * Activates the dismissable layer.
   * Adds to the global layer stack and attaches event listeners.
   */
  activate: () => void;

  /**
   * Deactivates the dismissable layer.
   * Removes from the layer stack and detaches event listeners.
   */
  deactivate: () => void;
}
```

### Module State (Singleton)

| Field | Type | Description |
|-------|------|-------------|
| `layerStack` | `DismissableLayer[]` | Stack of active layers (LIFO) |

### Internal State (Closure-Captured)

| Field | Type | Description |
|-------|------|-------------|
| `isActive` | `boolean` | Whether this layer is in the stack |

---

## Keyboard Activation Handler

### Options Interface

```typescript
export interface ActivationOptions {
  /**
   * Callback invoked when activation key is pressed.
   * @required
   */
  onActivate: (event: KeyboardEvent) => void;

  /**
   * Which keys trigger activation.
   * @default ["Enter", "Space"]
   */
  keys?: ("Enter" | "Space")[];

  /**
   * Whether to prevent default behavior.
   * - `true`: Always prevent default
   * - `false`: Never prevent default
   * - `"Space"`: Only prevent default for Space (recommended)
   * @default "Space"
   */
  preventDefault?: boolean | "Space";
}
```

### Return Type

```typescript
/**
 * Returns an event handler function suitable for keydown events.
 */
export function createActivationHandler(
  options: ActivationOptions
): (event: KeyboardEvent) => void;
```

---

## Arrow Key Handler

### Options Interface

```typescript
export interface ArrowKeyOptions {
  /**
   * Navigation orientation.
   * - "horizontal": Left/Right only
   * - "vertical": Up/Down only
   * - "both": All arrows
   * @required
   */
  orientation: Direction;

  /**
   * Whether layout is right-to-left.
   * Swaps Left/Right to Previous/Next mapping.
   * @default false
   */
  rtl?: boolean;

  /**
   * Callback invoked when navigation key is pressed.
   * @required
   */
  onNavigate: (direction: LogicalDirection, event: KeyboardEvent) => void;
}
```

### Return Type

```typescript
/**
 * Returns an event handler function suitable for keydown events.
 */
export function createArrowKeyHandler(
  options: ArrowKeyOptions
): (event: KeyboardEvent) => void;
```

### Key Mapping

| Physical Key | Horizontal (LTR) | Horizontal (RTL) | Vertical |
|--------------|------------------|------------------|----------|
| ArrowLeft | `previous` | `next` | - |
| ArrowRight | `next` | `previous` | - |
| ArrowUp | - | - | `previous` |
| ArrowDown | - | - | `next` |
| Home | `first` | `first` | `first` |
| End | `last` | `last` | `last` |

---

## Type-Ahead

### Options Interface

```typescript
export interface TypeAheadOptions {
  /**
   * Function returning current list of items.
   * Called on each keypress to support dynamic lists.
   * @required
   */
  items: () => HTMLElement[];

  /**
   * Function to extract text content from an item.
   * Used for matching against the typed buffer.
   * @required
   */
  getText: (item: HTMLElement) => string;

  /**
   * Callback invoked when a matching item is found.
   * @required
   */
  onMatch: (item: HTMLElement, index: number) => void;

  /**
   * Time in milliseconds before buffer clears.
   * @default 500
   */
  timeout?: number;
}
```

### Return Interface

```typescript
export interface TypeAhead {
  /**
   * Event handler for keydown events.
   * Handles printable characters only.
   */
  handleKeyDown: (event: KeyboardEvent) => void;

  /**
   * Clears the character buffer immediately.
   */
  reset: () => void;
}
```

### Internal State

| Field | Type | Description |
|-------|------|-------------|
| `buffer` | `string` | Accumulated typed characters |
| `timeoutId` | `number \| undefined` | Timer handle for buffer clear |

---

## Constants

```typescript
/**
 * Selector for standard focusable elements.
 * Used by focus-trap and roving-focus utilities.
 */
export const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), ' +
  'select:not([disabled]), textarea:not([disabled]), ' +
  '[tabindex]:not([tabindex="-1"])';

/**
 * Default type-ahead buffer timeout in milliseconds.
 */
export const DEFAULT_TYPEAHEAD_TIMEOUT = 500;
```

---

## Validation Rules

### Focus Trap
- `container` must be a valid DOM element
- If `initialFocus` is provided, it should be inside `container`
- If `fallbackFocus` is provided, it should be focusable (have tabindex)

### Roving Focus
- `selector` must match at least one element for meaningful operation
- `skipDisabled` checks both `disabled` attribute and `aria-disabled="true"`

### Dismissable Layer
- `onDismiss` callback is required
- `excludeElements` should not include `container` itself

### Type-Ahead
- `items()` returning empty array is valid (no match found)
- `getText` should return empty string for items without text (won't match)
- Single-character keys only (`event.key.length === 1`)
- Modifier keys (Ctrl, Meta, Alt) disable type-ahead for that keypress

---

## State Transitions

### Focus Trap State Machine

```
[Inactive] --activate()--> [Active] --deactivate()--> [Inactive]
              |                       |
              +--> focus initialFocus  +--> return focus (optional)
```

### Dismissable Layer Lifecycle

```
[Inactive] --activate()--> [Active in Stack]
                              |
         [Escape pressed] <---+--> [Outside click]
                              |
                        onDismiss()
                              |
         <--deactivate()------+
```

### Type-Ahead Buffer State

```
[Empty Buffer]
     |
     | <keypress: printable>
     v
[Buffer: "a"] --500ms timeout--> [Empty Buffer]
     |
     | <keypress: printable within timeout>
     v
[Buffer: "ab"] --500ms timeout--> [Empty Buffer]
     |
     | <match found>
     v
onMatch() called
```
