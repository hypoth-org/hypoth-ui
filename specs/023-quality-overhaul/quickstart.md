# Quickstart: Design System Quality Overhaul

**Branch**: `023-quality-overhaul`

## Overview

This guide covers the three main deliverables:
1. Running and writing a11y tests
2. Using composite primitives
3. Fixing performance and React patterns

---

## 1. Running A11y Tests

### Run all a11y tests
```bash
pnpm test:a11y
```

### Run a11y tests for a specific component
```bash
pnpm --filter @ds/wc test -- --grep "Dialog accessibility"
```

### Writing a new a11y test

Create a file at `packages/wc/tests/a11y/[component].test.ts`:

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
    // Clean up portaled elements
    document.querySelectorAll("ds-[component]").forEach(el => el.remove());
  });

  it("should have no violations in default state", async () => {
    render(
      html`<ds-[component]>Content</ds-[component]>`,
      container
    );
    await new Promise(r => setTimeout(r, 50)); // Wait for Lit render
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no violations when disabled", async () => {
    render(
      html`<ds-[component] disabled>Content</ds-[component]>`,
      container
    );
    await new Promise(r => setTimeout(r, 50));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Add more state-specific tests...
});
```

---

## 2. Using Composite Primitives

### Modal Overlay

```typescript
import { createModalOverlay } from "@ds/primitives-dom";

// Create overlay
const modal = createModalOverlay({
  closeOnEscape: true,
  closeOnBackdrop: true,
  animated: true,
  onOpenChange: (open) => {
    console.log("Modal open:", open);
  },
  onExitComplete: () => {
    // Safe to unmount content now
    dialogContent.remove();
  }
});

// Connect elements
modal.setTriggerElement(openButton);
modal.setContentElement(dialogContent);

// Open/close
openButton.addEventListener("click", () => modal.open());
closeButton.addEventListener("click", () => modal.close());
```

### Popover Overlay

```typescript
import { createPopoverOverlay } from "@ds/primitives-dom";

const popover = createPopoverOverlay({
  trigger: buttonElement,
  placement: "bottom-start",
  offset: 8,
  flip: true,
  closeOnEscape: true,
  closeOnOutsideClick: true,
  onOpenChange: (open) => {
    popoverContent.hidden = !open;
  },
  onPositionChange: (placement) => {
    console.log("Final placement:", placement);
  }
});

popover.setContentElement(popoverContent);

// Toggle on click
buttonElement.addEventListener("click", () => popover.toggle());
```

### Selectable List

```typescript
import { createSelectableList } from "@ds/primitives-dom";

const list = createSelectableList({
  items: users,
  getItemId: (user) => user.id,
  getItemText: (user) => user.name,
  mode: "multiple",
  typeAhead: true,
  onSelectionChange: (selectedIds) => {
    console.log("Selected:", selectedIds);
  }
});

// Render in Lit
html`
  <ul ...${spread(list.getListProps())}>
    ${users.map(user => html`
      <li
        ...${spread(list.getItemProps(user.id))}
        @click=${(e) => list.select(user.id, e)}
      >
        ${user.name}
      </li>
    `)}
  </ul>
`;
```

---

## 3. ARIA Utilities

### Generate unique IDs

```typescript
import { generateAriaId } from "@ds/primitives-dom";

const titleId = generateAriaId("dialog-title");    // "dialog-title-1"
const descId = generateAriaId("dialog-desc");      // "dialog-desc-2"

dialogContent.setAttribute("aria-labelledby", titleId);
dialogContent.setAttribute("aria-describedby", descId);
```

### Connect aria-describedby

```typescript
import { connectAriaDescribedBy } from "@ds/primitives-dom";

const cleanup = connectAriaDescribedBy(inputElement, [
  helpText,
  errorMessage
]);

// Later, when disconnecting
cleanup();
```

### Announce to screen readers

```typescript
import { announce } from "@ds/primitives-dom";

// Polite (default) - waits for idle
announce("Form saved successfully");

// Assertive - interrupts immediately
announce("Error: Connection lost", { politeness: "assertive" });
```

---

## 4. Dev Warnings

Dev warnings appear in development mode only:

```
[DS003] Dialog missing aria-labelledby. Add <ds-dialog-title> inside <ds-dialog-content>.
```

### Warning Codes

| Code | Issue |
|------|-------|
| DS001 | Missing required child element |
| DS002 | Invalid prop combination |
| DS003 | Accessibility violation |
| DS004 | Deprecated usage |
| DS005 | Missing context |
| DS006 | Invalid value |

### Disabling warnings (not recommended)

```typescript
// In component
import { suppressWarning } from "@ds/wc/utils/dev-warnings";

suppressWarning("DS003"); // Suppress specific warning
```

---

## 5. React Handler Pattern

When creating React adapters, use the ref + useCallback pattern:

```typescript
// packages/react/src/components/input.tsx

export function DsInput({ onChange, ...props }) {
  const ref = useRef<HTMLElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Stable handler reference
  const handleChange = useCallback((e: Event) => {
    const customEvent = e as CustomEvent<{ value: string }>;
    onChangeRef.current?.(customEvent.detail.value);
  }, []);

  useEffect(() => {
    const element = ref.current;
    element?.addEventListener("ds:change", handleChange);
    return () => element?.removeEventListener("ds:change", handleChange);
  }, [handleChange]);

  return createElement("ds-input", { ref, ...props });
}
```

---

## 6. Scroll Area Performance

The scroll-area thumb now uses cached dimensions:

```typescript
// packages/wc/src/components/scroll-area/scroll-area-thumb.ts

// Dimensions cached, updated only on resize
private cachedDimensions = { scrollHeight: 0, clientHeight: 0 };

private resizeObserver = new ResizeObserver(() => {
  this.cachedDimensions = {
    scrollHeight: this.viewport.scrollHeight,
    clientHeight: this.viewport.clientHeight
  };
  this.updateThumb();
});

// Scroll handler uses cached values - no layout queries
private onScroll = () => {
  const { scrollHeight, clientHeight } = this.cachedDimensions;
  const scrollPercent = this.viewport.scrollTop / (scrollHeight - clientHeight);
  this.thumb.style.transform = `translateY(${scrollPercent * 100}%)`;
};
```

---

## 7. High Contrast Mode Testing

Components include CSS fallbacks for Windows High Contrast Mode (forced-colors).

### Testing in Chrome DevTools

1. Open DevTools (F12)
2. Open Rendering panel (Cmd+Shift+P → "Show Rendering")
3. Scroll to "Emulate CSS media feature forced-colors"
4. Select "active"

### What to Verify

- **Focus indicators**: 2px solid Highlight outline visible on all interactive elements
- **Form controls**: Clear borders, checked states use Highlight color
- **Buttons**: Visible borders, primary variant uses Highlight background
- **Dialogs/overlays**: 3px solid border, Canvas background
- **Links**: Underlined, use LinkText/VisitedText colors

### CSS Structure

```css
@media (forced-colors: active) {
  ds-button {
    forced-color-adjust: none;
    border: 2px solid ButtonText;
    background: ButtonFace;
    color: ButtonText;
  }

  ds-button:focus-visible {
    outline: 2px solid Highlight;
    outline-offset: 2px;
  }
}
```

High contrast styles are in `@layer high-contrast` which takes precedence over component styles but not overrides.

---

## Verification Checklist

After implementation, verify:

- [ ] `pnpm test:a11y` passes for all 55 components
- [ ] `pnpm --filter @ds/docs-core validate:manifests` passes
- [ ] DevTools Performance shows 60fps scroll in scroll-area
- [ ] React DevTools shows stable handler references
- [ ] Dev warnings appear in dev mode, absent in production build
- [ ] Focus indicators visible in forced-colors mode
