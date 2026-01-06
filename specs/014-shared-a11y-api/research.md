# Research: Shared Accessible Component API

**Feature**: 014-shared-a11y-api
**Date**: 2026-01-05

## Decision 1: Behavior Primitive Architecture

**Decision**: Use Machine/Connect pattern with prop getter functions

**Rationale**:
- Framework-agnostic state machines return prop objects (`getTriggerProps()`, `getContentProps()`)
- ARIA attributes computed once in the primitive, consumed identically by React and WC
- Matches existing `@ds/primitives-dom` patterns (`createFocusTrap`, `createDismissableLayer`)
- Closure-captured state with `activate()`/`deactivate()` lifecycle fits both React `useEffect` and Lit `disconnectedCallback`

**Alternatives considered**:
- XState formal state machines: More overhead than needed for UI components; existing pattern sufficient
- Headless UI library integration: Violates zero-dep constitution principle

**Example pattern**:
```typescript
// behavior/dialog.ts
function createDialogBehavior(options: DialogOptions) {
  return {
    state: { open: false },
    context: { triggerId: null, contentId: null, titleId: null },
    send(event: DialogEvent) { /* state transitions */ },
    getTriggerProps() {
      return {
        'aria-haspopup': 'dialog',
        'aria-expanded': this.state.open,
        'aria-controls': this.context.contentId,
      };
    },
    getContentProps() {
      return {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': this.context.titleId,
      };
    }
  };
}
```

---

## Decision 2: React Compound Component Pattern

**Decision**: Context-based compound components with factory function

**Rationale**:
- Context API enables flexible child placement (unlike `cloneElement` which requires direct children)
- Factory function provides built-in error boundaries when components used outside parent
- Each Root instance creates fresh context, enabling nested components without collision
- Follows Radix UI patterns, familiar to React developers

**Alternatives considered**:
- `React.Children.map` + `cloneElement`: Only works with direct children, breaks composition
- Render props: More verbose, less declarative API

**Example pattern**:
```typescript
// utils/create-context.ts
function createCompoundContext<T>(displayName: string) {
  const Context = createContext<T | null>(null);
  Context.displayName = displayName;

  function useCompoundContext(componentName: string): T {
    const context = useContext(Context);
    if (context === null) {
      throw new Error(`<${componentName}> must be used within <${displayName}>`);
    }
    return context;
  }

  return [Context.Provider, useCompoundContext] as const;
}
```

---

## Decision 3: asChild/Slot Implementation

**Decision**: Slot component with prop merging for `asChild` pattern

**Rationale**:
- Avoids TypeScript performance issues with `as` prop polymorphism
- Prop merging handles className concatenation, style merging, event handler composition
- Child handlers execute first, can prevent parent via `event.preventDefault()`
- Existing `mergeProps` utility in `@ds/react` already handles this correctly

**Alternatives considered**:
- `as` prop polymorphism: TypeScript complexity, type inference issues with generic components
- Render function pattern: Less ergonomic, requires more boilerplate

**Example usage**:
```tsx
<Dialog.Trigger asChild>
  <MyStyledButton>Open</MyStyledButton>
</Dialog.Trigger>
// Props merged: aria-haspopup, aria-expanded, onClick all applied to MyStyledButton
```

---

## Decision 4: ARIA Attribute Computation

**Decision**: Centralized in behavior primitives with generated IDs

**Rationale**:
- Single source of truth ensures React and WC produce identical accessible output
- ID relationships (`aria-labelledby`, `aria-controls`) managed by behavior
- Follows WAI-ARIA APG patterns for Dialog Modal and Menu Button

**Dialog ARIA requirements**:
| Part | Attributes |
|------|------------|
| Trigger | `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls` |
| Content | `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby` |
| Title | `id` (referenced by content) |
| Close | `aria-label` |

**Menu ARIA requirements**:
| Part | Attributes |
|------|------------|
| Trigger | `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` |
| Content | `role="menu"`, `aria-orientation`, `aria-labelledby` |
| Item | `role="menuitem"`, `tabIndex` (0 for active, -1 for others), `aria-disabled` |

---

## Decision 5: Keyboard Interaction Integration

**Decision**: Compose existing primitives from `@ds/primitives-dom`

**Rationale**:
- `createFocusTrap`: Dialog focus containment (already implemented)
- `createDismissableLayer`: Escape key and outside click (already implemented)
- `createRovingFocus`: Menu arrow key navigation (already implemented)
- `createTypeAhead`: Menu character search (already implemented)
- No new keyboard code needed; behavior primitives orchestrate existing utilities

**Composition example (Menu)**:
```typescript
const menu = createMenuBehavior({
  onOpen: () => {
    dismissLayer = createDismissableLayer({ container, onDismiss: close });
    rovingFocus = createRovingFocus({ container, selector: '[role="menuitem"]' });
    typeAhead = createTypeAhead({ items: getItems, onMatch: focusItem });
  },
  onClose: () => {
    dismissLayer?.deactivate();
    rovingFocus?.destroy();
    typeAhead?.reset();
  }
});
```

---

## Decision 6: Web Component Consumption of Primitives

**Decision**: Direct invocation in Lit lifecycle methods

**Rationale**:
- Behavior primitives are framework-agnostic (pure functions returning state + props)
- WC calls primitive methods in `connectedCallback`/`updated`/`disconnectedCallback`
- Props returned by primitives applied via Lit's `spread` or manual attribute setting
- No React-specific hooks used; same primitive instance shared

**Example integration**:
```typescript
// wc/components/dialog/dialog.ts
class DsDialog extends DSElement {
  private behavior = createDialogBehavior({
    onOpenChange: (open) => { this.open = open; }
  });

  override updated(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      this.behavior.send(this.open ? 'OPEN' : 'CLOSE');
      const contentEl = this.querySelector('[role="dialog"]');
      Object.entries(this.behavior.getContentProps()).forEach(([key, val]) => {
        contentEl?.setAttribute(key, String(val));
      });
    }
  }
}
```

---

## Sources

- [W3C WAI-ARIA APG - Dialog Modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [W3C WAI-ARIA APG - Menu Button](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)
- [Radix UI - Accessibility Overview](https://www.radix-ui.com/primitives/docs/overview/accessibility)
- [Radix UI - Slot Utility](https://www.radix-ui.com/primitives/docs/utilities/slot)
- [Zag.js - State Machine Architecture](https://zagjs.com/)
- [Kent C. Dodds - Compound Components with React Hooks](https://kentcdodds.com/blog/compound-components-with-react-hooks)
- [React TypeScript Cheatsheet - Forwarding Refs](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forward_and_create_ref/)
