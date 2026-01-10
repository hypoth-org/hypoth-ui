# Research: Design System Quality Overhaul

**Date**: 2026-01-09
**Branch**: `023-quality-overhaul`

## Research Summary

This document consolidates findings from investigating existing codebase patterns, best practices for composite primitives, and a11y testing approaches.

---

## 1. Existing Overlay Infrastructure

### Decision: Leverage existing `createOverlayBehavior`

**Findings**:
- `packages/primitives-dom/src/overlay/create-overlay-behavior.ts` already bundles:
  - Focus trap (via `createFocusTrap`)
  - Dismissable layer (via `createDismissableLayer`)
  - ARIA props computation (`getTriggerProps`, `getContentProps`)
  - State management (open/close/toggle)
  - Focus return on close

**Rationale**: Building composites on top of this existing primitive avoids duplication and ensures consistent behavior across all overlay components.

**Alternatives Considered**:
1. **Create new overlay primitive from scratch** - Rejected: would duplicate 300+ lines of tested code
2. **Extend OverlayBehavior class** - Rejected: primitives-dom uses functional patterns, not classes

---

## 2. Presence Animation Integration

### Decision: Composites wrap `createPresence` with overlay behavior

**Findings**:
- `packages/primitives-dom/src/animation/presence.ts` provides:
  - `show(element)` - sets `data-state="open"`, listens for `animationend`
  - `hide(element)` - sets `data-state="closed"`, calls `onExitComplete` after animation
  - `prefersReducedMotion()` check - skips animations when user prefers
  - Proper cleanup of animation listeners

**Implementation Pattern**:
```typescript
export function createModalOverlay(options: ModalOverlayOptions) {
  const overlay = createOverlayBehavior({ modal: true, ...options });
  const presence = createPresence({
    onExitComplete: options.onExitComplete
  });

  return {
    open() {
      overlay.open();
      presence.show(overlay.context.contentElement);
    },
    close() {
      presence.hide(overlay.context.contentElement);
      // Actual close happens in onExitComplete
    }
  };
}
```

**Rationale**: Presence utility already handles animation timing, reduced motion, and cleanup. Composites orchestrate the coordination.

---

## 3. Anchor Positioning for Popovers

### Decision: Use existing `createAnchorPosition` with scroll/resize auto-update

**Findings**:
- `packages/primitives-dom/src/positioning/anchor-position.ts` provides:
  - CSS Anchor Positioning API support (with feature detection)
  - JavaScript fallback for unsupported browsers
  - Flip logic when near viewport edges
  - Placement options: top, bottom, left, right + alignment variants

**Missing for composites**:
- Auto-update on scroll/resize (currently manual)
- Integration with overlay lifecycle

**Implementation Pattern**:
```typescript
export function createPopoverOverlay(options: PopoverOverlayOptions) {
  const overlay = createOverlayBehavior({ modal: false, ...options });
  let position: AnchorPosition | null = null;
  let cleanup: (() => void) | null = null;

  function activate() {
    position = createAnchorPosition({
      anchor: options.trigger,
      floating: overlay.context.contentElement,
      placement: options.placement,
      flip: true
    });

    // Auto-update on scroll/resize
    const updatePosition = () => position?.update();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    cleanup = () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }

  return {
    open() {
      overlay.open();
      activate();
    },
    close() {
      cleanup?.();
      overlay.close();
    }
  };
}
```

**Rationale**: Existing anchor position handles the complex positioning math. Composite adds auto-update lifecycle.

---

## 4. Selectable List Composite Pattern

### Decision: Bundle roving-focus + type-ahead + selection state

**Findings from existing primitives**:
- `createRovingFocus()` - keyboard navigation with arrow keys, wrapping
- `createTypeAhead()` - character search with debounce
- No existing selection tracking primitive

**Required selection features**:
- Single selection mode (radio-like)
- Multi-selection mode (checkbox-like)
- Range selection (Shift+click)
- Controlled/uncontrolled modes

**Implementation Pattern**:
```typescript
export interface SelectableListOptions<T> {
  items: T[];
  getItemId: (item: T) => string;
  mode: 'single' | 'multiple';
  defaultSelected?: string[];
  onSelectionChange?: (selected: string[]) => void;
}

export function createSelectableList<T>(options: SelectableListOptions<T>) {
  const roving = createRovingFocus({ ... });
  const typeAhead = createTypeAhead({ ... });
  let selected = new Set(options.defaultSelected ?? []);

  function select(id: string, event?: MouseEvent) {
    if (options.mode === 'single') {
      selected = new Set([id]);
    } else {
      if (event?.shiftKey && lastSelected) {
        // Range selection
        const range = getRange(lastSelected, id);
        range.forEach(i => selected.add(i));
      } else {
        selected.has(id) ? selected.delete(id) : selected.add(id);
      }
    }
    options.onSelectionChange?.(Array.from(selected));
  }

  return {
    ...roving,
    ...typeAhead,
    select,
    isSelected: (id: string) => selected.has(id),
    getSelectedItems: () => Array.from(selected)
  };
}
```

**Rationale**: This pattern mirrors Radix UI's `@radix-ui/react-roving-focus` + `@radix-ui/react-selection` approach but as a single composite.

---

## 5. A11y Testing Approach

### Decision: Follow existing test pattern, expand to all components

**Existing Pattern Analysis** (`tests/a11y/dialog.test.ts`):
1. Setup with `beforeEach` creating container + appending to body
2. Cleanup with `afterEach` removing elements
3. Test categories:
   - axe violations (default state)
   - axe violations (open/active states)
   - ARIA attributes (role, aria-labelledby, aria-modal)
   - Keyboard interaction (Escape, Tab)
   - Focus management (trap, return)

**Test Template**:
```typescript
import { axe, toHaveNoViolations } from "jest-axe";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/[component]/[component].js";

expect.extend(toHaveNoViolations);

describe("[ComponentName] accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    document.querySelectorAll("[ds-component]").forEach(el => el.remove());
  });

  it("should have no violations in default state", async () => {
    render(html`<ds-component>Content</ds-component>`, container);
    await new Promise(r => setTimeout(r, 50));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // State-specific tests...
  // ARIA attribute tests...
  // Keyboard tests...
});
```

**Rationale**: Consistent test structure enables easier review and maintenance. 50ms settle time accounts for Lit render cycle.

---

## 6. Scroll-Area Performance Fix

### Decision: Cache dimensions with ResizeObserver

**Current Problem** (from audit):
```typescript
// scroll-area-thumb.ts - called on every scroll event
const containerRect = container.getBoundingClientRect(); // Forces layout
const scrollHeight = viewport.scrollHeight;
const clientHeight = viewport.clientHeight;
```

**Fix Pattern**:
```typescript
let cachedDimensions = { scrollHeight: 0, clientHeight: 0, containerHeight: 0 };

// Initialize ResizeObserver
const resizeObserver = new ResizeObserver(() => {
  cachedDimensions = {
    scrollHeight: viewport.scrollHeight,
    clientHeight: viewport.clientHeight,
    containerHeight: container.getBoundingClientRect().height
  };
  updateThumb();
});
resizeObserver.observe(container);
resizeObserver.observe(viewport);

// Scroll handler uses cached values
function onScroll() {
  const scrollPercent = viewport.scrollTop /
    (cachedDimensions.scrollHeight - cachedDimensions.clientHeight);
  // Update thumb position with cached dimensions
}
```

**Rationale**: ResizeObserver fires only on actual dimension changes, not on every scroll. Eliminates per-frame layout queries.

---

## 7. React Handler Stability Pattern

### Decision: useRef + useCallback pattern for stable handlers

**Current Anti-Pattern** (`packages/react/src/components/input.tsx`):
```typescript
// Handler recreated every render
useEffect(() => {
  const handleChange = (e: Event) => { ... };
  element?.addEventListener('ds:change', handleChange);
  return () => element?.removeEventListener('ds:change', handleChange);
}, [element, onChange]); // onChange in deps causes re-subscription
```

**Fix Pattern**:
```typescript
const onChangeRef = useRef(onChange);
onChangeRef.current = onChange;

const handleChange = useCallback((e: Event) => {
  onChangeRef.current?.(e);
}, []); // Empty deps - stable reference

useEffect(() => {
  element?.addEventListener('ds:change', handleChange);
  return () => element?.removeEventListener('ds:change', handleChange);
}, [element, handleChange]); // handleChange is stable
```

**Rationale**: The ref holds the latest callback while useCallback provides a stable function reference. This is the standard React pattern for event handlers.

---

## 8. ARIA Utilities Design

### Decision: Standalone utility functions in `primitives-dom/src/aria/`

**generateAriaId**:
```typescript
let counter = 0;
export function generateAriaId(prefix = 'aria'): string {
  return `${prefix}-${++counter}`;
}
```

**connectAriaDescribedBy**:
```typescript
export function connectAriaDescribedBy(
  element: HTMLElement,
  describers: HTMLElement[]
): () => void {
  const ids = describers.map(d => {
    if (!d.id) d.id = generateAriaId('desc');
    return d.id;
  });
  element.setAttribute('aria-describedby', ids.join(' '));

  return () => element.removeAttribute('aria-describedby');
}
```

**announceToScreenReader**:
```typescript
// Already exists: packages/primitives-dom/src/aria/live-region.ts
// Can extend with convenience wrapper
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const liveRegion = getLiveRegion(priority);
  liveRegion.textContent = message;
}
```

**Rationale**: Simple functions are tree-shakeable and have zero runtime cost when unused.

---

## 9. Component Manifest Schema

### Decision: Follow existing constitution-defined schema

**Required Fields** (from constitution):
```json
{
  "id": "component-id",
  "name": "Component Name",
  "status": "stable",
  "availabilityTags": ["public"],
  "platforms": ["wc", "react"],
  "a11y": {
    "apgPattern": "pattern-name",
    "keyboardSupport": ["Enter", "Space", "Arrow keys"],
    "knownLimitations": []
  },
  "tokensUsed": ["color.action", "spacing.component"],
  "recommendedUsage": "When to use this component",
  "antiPatterns": "When NOT to use this component"
}
```

**Rationale**: Schema already defined in constitution. Implementation is straightforward JSON creation per component.

---

## 10. Dev Warning System

### Decision: Tree-shakeable dev warnings via conditional compilation

**Pattern**:
```typescript
// utils/dev-warnings.ts
const DEV = process.env.NODE_ENV !== 'production';

export function warnA11y(code: string, message: string, element?: Element): void {
  if (DEV) {
    console.warn(`[${code}] ${message}`, element);
  }
}

// Usage in component
import { warnA11y } from '../../utils/dev-warnings.js';

connectedCallback() {
  super.connectedCallback();
  if (!this.hasAttribute('aria-label') && !this.querySelector('[slot="label"]')) {
    warnA11y('DS003', 'Component missing accessible name', this);
  }
}
```

**Rationale**: Build tools (esbuild, terser) eliminate dead code when `process.env.NODE_ENV === 'production'`.

---

## Research Gaps Resolved

| Original Gap | Resolution |
|--------------|------------|
| Overlay composite design | Build on existing `createOverlayBehavior` |
| Presence animation integration | Composites coordinate `createPresence` lifecycle |
| Selectable list pattern | Bundle roving-focus + type-ahead + selection state |
| A11y test template | Follow existing `tests/a11y/dialog.test.ts` pattern |
| Scroll-area perf fix | ResizeObserver + cached dimensions |
| React handler stability | useRef + useCallback pattern |
| ARIA utilities | Standalone functions in existing aria/ directory |
| Manifest schema | Use constitution-defined schema |
| Dev warnings | Conditional compilation via process.env check |
