# Research: Behavior Utilities

**Feature**: 005-behavior-utilities
**Date**: 2026-01-02
**Status**: Complete

## Research Topics

### 1. Dismissable Layer Pattern

**Question**: How should dismissable layers handle Escape key and outside clicks, especially with nested layers?

**Decision**: Use a layer stack with LIFO (last-in-first-out) dismissal semantics.

**Rationale**:
- WAI-ARIA APG patterns for dialogs and menus specify that Escape dismisses the topmost layer only
- Outside click detection must exclude the trigger element to prevent re-triggering
- Event capturing phase for Escape key ensures topmost layer handles it first
- Radix UI and Adobe React Spectrum use similar stacking approaches

**Implementation approach**:
```typescript
// Module-level stack (singleton)
const layerStack: DismissableLayer[] = [];

// Each layer registers/unregisters on activate/deactivate
function activate() {
  layerStack.push(this);
  document.addEventListener("keydown", handleEscape, true); // capture phase
  document.addEventListener("pointerdown", handleOutsideClick, true);
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === "Escape" && layerStack.length > 0) {
    const topLayer = layerStack[layerStack.length - 1];
    topLayer.dismiss();
    event.stopPropagation();
  }
}
```

**Alternatives considered**:
- **Per-layer event listeners**: Each layer adds its own Escape handler. Rejected because multiple handlers fire, requiring complex coordination.
- **Custom event bubbling**: Use custom events to propagate dismiss requests. Rejected as overly complex for the use case.

---

### 2. Keyboard Activation Pattern

**Question**: How should Enter/Space activation handlers work, and should they prevent default?

**Decision**: Create a factory function that returns an event handler with configurable behavior.

**Rationale**:
- Enter should activate and allow event propagation (form submission)
- Space should prevent default scroll behavior
- Some elements (native buttons, links) don't need this; custom elements do
- Handler should call `event.preventDefault()` for Space only, not Enter
- APG button pattern: "Space and Enter activate the button"

**Implementation approach**:
```typescript
interface ActivationOptions {
  onActivate: (event: KeyboardEvent) => void;
  keys?: ("Enter" | "Space")[];  // default: both
  preventDefault?: boolean | "Space";  // default: "Space"
}

function createActivationHandler(options: ActivationOptions): (event: KeyboardEvent) => void {
  return (event: KeyboardEvent) => {
    const isSpace = event.key === " " || event.key === "Spacebar";
    const isEnter = event.key === "Enter";
    if ((isSpace && keys.includes("Space")) || (isEnter && keys.includes("Enter"))) {
      if (preventDefault === true || (preventDefault === "Space" && isSpace)) {
        event.preventDefault();
      }
      options.onActivate(event);
    }
  };
}
```

**Alternatives considered**:
- **Always preventDefault**: Rejected because Enter should allow form submission
- **Decorator pattern**: Rejected to maintain framework-agnostic approach

---

### 3. Arrow Key Navigation Pattern

**Question**: How should arrow key handlers normalize direction and handle RTL layouts?

**Decision**: Provide direction normalization with optional RTL support via configuration.

**Rationale**:
- Arrow keys should map to logical directions (next/previous) not physical directions
- RTL layouts swap horizontal direction semantics
- APG patterns specify arrow key behavior for various widgets
- Existing roving-focus.ts handles arrows; new utility provides lower-level abstraction

**Implementation approach**:
```typescript
type Direction = "up" | "down" | "left" | "right";
type LogicalDirection = "next" | "previous" | "first" | "last";

interface ArrowKeyOptions {
  orientation: "horizontal" | "vertical" | "both";
  rtl?: boolean;
  onNavigate: (direction: LogicalDirection, event: KeyboardEvent) => void;
}

function createArrowKeyHandler(options: ArrowKeyOptions): (event: KeyboardEvent) => void {
  // Maps ArrowLeft to "previous" in LTR, "next" in RTL
  // Maps ArrowRight to "next" in LTR, "previous" in RTL
  // Maps Home to "first", End to "last"
}
```

**Alternatives considered**:
- **Physical directions only**: Rejected because RTL support is essential for internationalization
- **Automatic RTL detection via `document.dir`**: Deferred; explicit option is simpler and more predictable

---

### 4. Type-Ahead Search Pattern

**Question**: How should type-ahead work, including buffer timeout and matching strategy?

**Decision**: Use a character buffer with configurable timeout (default 500ms) and prefix matching.

**Rationale**:
- WAI-ARIA listbox and menu patterns support type-ahead navigation
- 500ms timeout is standard across platforms (Windows, macOS, web)
- Prefix matching is most intuitive; substring matching can be confusing
- Match should be case-insensitive
- Buffer clears after timeout or successful navigation

**Implementation approach**:
```typescript
interface TypeAheadOptions {
  items: () => HTMLElement[];  // Function to get current items
  getText: (item: HTMLElement) => string;  // Extract text from item
  onMatch: (item: HTMLElement, index: number) => void;  // Handle match
  timeout?: number;  // Buffer timeout, default 500ms
}

function createTypeAhead(options: TypeAheadOptions): {
  handleKeyDown: (event: KeyboardEvent) => void;
  reset: () => void;
} {
  let buffer = "";
  let timeoutId: number | undefined;

  return {
    handleKeyDown(event: KeyboardEvent) {
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
        buffer += event.key.toLowerCase();
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => { buffer = ""; }, timeout);

        const match = items().find(item =>
          getText(item).toLowerCase().startsWith(buffer)
        );
        if (match) {
          onMatch(match, items().indexOf(match));
        }
      }
    },
    reset() {
      buffer = "";
      clearTimeout(timeoutId);
    }
  };
}
```

**Alternatives considered**:
- **Substring matching**: Rejected; less intuitive and can match unexpectedly
- **Case-sensitive matching**: Rejected; inconsistent with platform conventions
- **Wrapping search (start from current item)**: Worth considering for enhancement; deferred to keep MVP simple

---

### 5. Focus Trap Enhancements

**Question**: What enhancements are needed for the existing focus-trap utility?

**Decision**: Add support for focus sentinel elements and focus restoration customization.

**Rationale**:
- Some components (like modals with fixed headers) need focus sentinels at edges
- ReturnFocus should support specifying a different element than the original trigger
- Edge case: container has no focusable elements—should focus container itself if focusable

**Enhancements**:
```typescript
interface FocusTrapOptions {
  container: HTMLElement;
  initialFocus?: HTMLElement | null;
  returnFocus?: boolean | HTMLElement;  // ENHANCED: can be specific element
  fallbackFocus?: HTMLElement;  // NEW: focus if container has no focusables
}
```

**Alternatives considered**:
- **Focus sentinels as separate utility**: Could work but adds complexity; integrated approach is simpler
- **Auto-focus container**: Rejected; container may not be focusable

---

### 6. Roving Focus Enhancements

**Question**: What enhancements are needed for the existing roving-focus utility?

**Decision**: Add support for disabled items and dynamic item updates.

**Rationale**:
- Disabled items should be skipped during keyboard navigation
- Items may be added/removed dynamically (e.g., filter results)
- Current implementation queries items on each keydown; maintain this for dynamic support

**Enhancements**:
```typescript
interface RovingFocusOptions {
  container: HTMLElement;
  selector: string;
  direction?: Direction;
  loop?: boolean;
  skipDisabled?: boolean;  // NEW: skip [disabled] and [aria-disabled="true"]
  onFocus?: (element: HTMLElement, index: number) => void;
}
```

**Implementation detail**:
```typescript
function isDisabled(element: HTMLElement): boolean {
  return element.hasAttribute("disabled") ||
         element.getAttribute("aria-disabled") === "true";
}
```

**Alternatives considered**:
- **Separate disabled selector**: More flexible but adds API complexity; attribute check is sufficient

---

### 7. Test Harness Page Structure

**Question**: How should test harness pages be structured for E2E testing and documentation?

**Decision**: Use Next.js route segments with data-testid attributes and status indicators.

**Rationale**:
- Route-based pages are simple and predictable
- data-testid attributes enable reliable E2E selectors
- Status indicators help users understand utility state during demos
- Each page should work standalone (no required parent context)

**Page structure**:
```tsx
// apps/demo/app/primitives/focus-trap/page.tsx
export default function FocusTrapDemo() {
  return (
    <div data-testid="focus-trap-demo">
      <h1>Focus Trap</h1>
      <StatusIndicator active={isActive} />
      <button onClick={activate} data-testid="activate-btn">Activate</button>
      <div ref={containerRef} data-testid="trap-container">
        <button>First</button>
        <input type="text" />
        <button>Last</button>
      </div>
      <button onClick={deactivate} data-testid="deactivate-btn">Deactivate</button>
    </div>
  );
}
```

**Alternatives considered**:
- **Storybook**: Would add dependency; demo app already exists
- **MDX live examples**: Good for docs; separate harness pages needed for E2E isolation

---

## Summary

| Topic | Decision |
|-------|----------|
| Dismissable Layer | Layer stack with LIFO semantics, capture-phase event listeners |
| Keyboard Activation | Factory function with configurable Enter/Space handling |
| Arrow Key Navigation | Direction normalization with explicit RTL option |
| Type-Ahead | 500ms buffer timeout, case-insensitive prefix matching |
| Focus Trap | Enhanced returnFocus option, fallbackFocus for empty containers |
| Roving Focus | skipDisabled option for disabled item handling |
| Test Harnesses | Route-based pages with data-testid attributes |

All research items resolved. Ready for Phase 1: Design & Contracts.
