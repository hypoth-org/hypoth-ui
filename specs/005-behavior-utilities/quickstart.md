# Quickstart: Behavior Utilities

**Feature**: 005-behavior-utilities
**Date**: 2026-01-02

## Prerequisites

- Node.js 18+
- pnpm 8+
- Repository cloned and dependencies installed

```bash
pnpm install
```

## Quick Verification

### 1. Build the Package

```bash
pnpm --filter @ds/primitives-dom build
```

Expected output:
```
CLI Building entry: src/index.ts
CLI dist/index.js     X.XX KB
CLI dist/index.d.ts   X.XX KB
CLI ⚡ Build success in Xms
```

### 2. Run Tests

```bash
pnpm --filter @ds/primitives-dom test
```

Expected output:
```
✓ tests/focus-trap.test.ts (X tests)
✓ tests/roving-focus.test.ts (X tests)
✓ tests/dismissable-layer.test.ts (X tests)
✓ tests/activation.test.ts (X tests)
✓ tests/arrow-keys.test.ts (X tests)
✓ tests/type-ahead.test.ts (X tests)
```

### 3. Start Demo App

```bash
pnpm --filter @ds/demo dev
```

Navigate to:
- http://localhost:3000/primitives - Index of all demos
- http://localhost:3000/primitives/focus-trap - Focus trap demo
- http://localhost:3000/primitives/roving-focus - Roving focus demo
- http://localhost:3000/primitives/dismissable-layer - Dismissable layer demo
- http://localhost:3000/primitives/keyboard-helpers - Keyboard helpers demo
- http://localhost:3000/primitives/type-ahead - Type-ahead demo

### 4. Run E2E Tests

```bash
pnpm --filter @ds/demo test:e2e
```

## Usage Examples

### Focus Trap

```typescript
import { createFocusTrap } from "@ds/primitives-dom";

const modal = document.getElementById("modal");
const trap = createFocusTrap({
  container: modal,
  initialFocus: modal.querySelector(".close-button"),
  returnFocus: true,
});

// Activate when modal opens
trap.activate();

// Deactivate when modal closes
trap.deactivate();
```

### Roving Focus

```typescript
import { createRovingFocus } from "@ds/primitives-dom";

const toolbar = document.getElementById("toolbar");
const roving = createRovingFocus({
  container: toolbar,
  selector: '[role="button"]',
  direction: "horizontal",
  loop: true,
  skipDisabled: true,
  onFocus: (el, index) => console.log(`Focused item ${index}`),
});

// Clean up when component unmounts
roving.destroy();
```

### Dismissable Layer

```typescript
import { createDismissableLayer } from "@ds/primitives-dom";

const dropdown = document.getElementById("dropdown");
const trigger = document.getElementById("dropdown-trigger");

const layer = createDismissableLayer({
  container: dropdown,
  excludeElements: [trigger],
  onDismiss: (reason) => {
    console.log(`Dismissed via: ${reason}`);
    dropdown.hidden = true;
    layer.deactivate();
  },
});

// Activate when dropdown opens
layer.activate();
```

### Keyboard Activation

```typescript
import { createActivationHandler } from "@ds/primitives-dom";

const customButton = document.getElementById("custom-button");

const handler = createActivationHandler({
  onActivate: (event) => {
    console.log("Activated!");
    customButton.click();
  },
  keys: ["Enter", "Space"],
  preventDefault: "Space",
});

customButton.addEventListener("keydown", handler);
```

### Arrow Key Navigation

```typescript
import { createArrowKeyHandler } from "@ds/primitives-dom";

const handler = createArrowKeyHandler({
  orientation: "horizontal",
  rtl: document.dir === "rtl",
  onNavigate: (direction, event) => {
    switch (direction) {
      case "next":
        focusNextItem();
        break;
      case "previous":
        focusPreviousItem();
        break;
      case "first":
        focusFirstItem();
        break;
      case "last":
        focusLastItem();
        break;
    }
  },
});

container.addEventListener("keydown", handler);
```

### Type-Ahead Search

```typescript
import { createTypeAhead } from "@ds/primitives-dom";

const typeAhead = createTypeAhead({
  items: () => Array.from(listbox.querySelectorAll('[role="option"]')),
  getText: (item) => item.textContent?.trim() ?? "",
  onMatch: (item, index) => {
    item.focus();
    console.log(`Matched item ${index}: ${item.textContent}`);
  },
  timeout: 500,
});

listbox.addEventListener("keydown", typeAhead.handleKeyDown);

// Reset buffer when listbox closes
typeAhead.reset();
```

## Integration with Lit Components

```typescript
import { LitElement, html } from "lit";
import { createFocusTrap } from "@ds/primitives-dom";

class MyModal extends LitElement {
  private trap?: ReturnType<typeof createFocusTrap>;

  connectedCallback() {
    super.connectedCallback();
    this.trap = createFocusTrap({
      container: this,
      returnFocus: true,
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.trap?.deactivate();
  }

  open() {
    this.hidden = false;
    this.trap?.activate();
  }

  close() {
    this.trap?.deactivate();
    this.hidden = true;
  }
}
```

## Troubleshooting

### Focus trap not working

1. Verify container has focusable elements
2. Check that elements are visible (`offsetParent !== null`)
3. Ensure `activate()` is called after DOM is ready

### Roving focus not responding to arrow keys

1. Verify `selector` matches visible elements
2. Check that container has focus or a focusable child is focused
3. Confirm `direction` matches the arrow keys you're pressing

### Dismissable layer not dismissing

1. Verify `onDismiss` callback is provided
2. Check `closeOnEscape` and `closeOnOutsideClick` options
3. Ensure trigger is in `excludeElements` if toggle behavior is desired

### Type-ahead not finding matches

1. Verify `getText` returns the expected text
2. Check that `items()` returns current elements
3. Confirm typing speed is within `timeout` (default 500ms)

## Next Steps

1. Read the full documentation: `/docs/guides/behavior-utilities`
2. Explore test harness pages for interactive examples
3. Review test files for detailed usage patterns
