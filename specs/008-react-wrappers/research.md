# Research: React Wrappers for Web Components

**Date**: 2026-01-03
**Feature**: 008-react-wrappers
**Phase**: 0 (Research)

## Problem Statement

React developers need a type-safe, ergonomic way to use the design system's Web Components. The current state requires developers to:
1. Use raw custom element tags without TypeScript support
2. Manually handle event listeners and ref forwarding
3. Deal with React's poor native support for custom element events

## Prior Art Analysis

### 1. Radix UI Slot Pattern

[Radix UI Slot](https://www.radix-ui.com/primitives/docs/utilities/slot) is the canonical implementation of the `asChild` pattern.

**Key Characteristics:**
- Uses `React.cloneElement` to merge props onto child element
- Child handlers take precedence over parent handlers
- Supports `Slot.Slottable` for components with multiple children
- Bundle: ~1.36 kB

**Implementation Details:**
```tsx
function Button({ asChild, ...props }) {
  const Comp = asChild ? Slot : "button";
  return <Comp {...props} />;
}
```

**Concerns:**
- `cloneElement` is considered legacy by React team (no removal planned)
- Fragment children not supported (must be single element)
- Ref merging requires careful implementation

### 2. Existing @ds/react Patterns

The codebase already has React wrapper patterns in `packages/react/`:

**Manual Wrapper Pattern** (button.tsx, input.tsx):
- Explicit prop destructuring with defaults
- `forwardRef` for ref forwarding
- `useEffect` for event listener attachment
- `createElement` for dynamic tag rendering

**Factory Pattern** (create-component.ts):
- Generic `createComponent<E, P>` function
- Config-driven: tagName, properties, events
- Property sync via `useEffect`
- Event listener attachment via `useEffect`

**Current Issues:**
- Factory has complex generic typing
- Both patterns duplicate ref merging logic
- No className merging for child props

### 3. Web Component Event Types

From the WC implementations:

| Component | Custom Events | Detail Type |
|-----------|---------------|-------------|
| Link | `ds:navigate` | `{ href, external, originalEvent }` |
| Button | (uses native click) | N/A |
| Input | `input`, `change` | `{ value }` |

## Design Decisions

### Decision 1: Slot Implementation

**Options:**
1. Use `@radix-ui/react-slot` as dependency
2. Implement minimal Slot from scratch
3. Use React 19 ref-as-prop pattern (future)

**Recommendation: Option 2 (Implement minimal Slot)**

Rationale:
- Constitution requires minimal dependencies
- Only need basic single-child case
- Full Radix Slot adds features we don't need (Slottable)
- ~50 lines of code vs adding dependency

**Minimal Implementation Scope:**
- Single child validation (error on multiple/fragment)
- Props merging (child wins for conflicts)
- Event handler composition (both called, child first)
- Ref merging (compose refs)
- className concatenation

### Decision 2: Component Categorization

Based on spec's hybrid approach recommendation:

| Category | Components | Pattern | Reason |
|----------|------------|---------|--------|
| Factory | Icon, Spinner, VisuallyHidden | `createComponent` | Simple prop forwarding, no complex events |
| Manual | Button, Link, Input | Explicit wrapper | Custom event handling, complex props |
| asChild | Box, Text, Link | Slot-based | Polymorphic rendering needed |

**Note:** Link appears in both Manual and asChild because:
- Needs manual wrapper for `ds-link` with `onNavigate` event
- Needs asChild support for Next.js Link integration

### Decision 3: Text Component Strategy

Two options for Text with asChild:

**Option A: React-only Text (like Box)**
- No `ds-text` dependency
- Apply CSS classes directly
- Full asChild support

**Option B: Wrap ds-text with asChild**
- Uses ds-text WC
- asChild renders child with text styling classes

**Recommendation: Option A (React-only)**

Rationale:
- `ds-text` WC uses `unsafeStatic` for dynamic tag rendering
- React can do this natively with `asChild`
- Avoids WC + React complexity for typography

### Decision 4: Box Component Design

Box is explicitly React-only per clarification. Design:

```tsx
interface BoxProps {
  asChild?: boolean;
  // Layout props (maps to CSS classes)
  p?: SpacingValue;
  px?: SpacingValue;
  py?: SpacingValue;
  m?: SpacingValue;
  mx?: SpacingValue;
  my?: SpacingValue;
  display?: 'block' | 'flex' | 'grid' | 'inline' | 'inline-flex';
  // etc.
  children: React.ReactNode;
}
```

CSS class mapping:
- `p="4"` → `class="ds-p-4"`
- `display="flex"` → `class="ds-d-flex"`

**Prerequisite:** @ds/css must export utility classes (already planned in 004-css-layers)

### Decision 5: Next.js Compatibility

**Client Boundary Strategy:**

```text
@ds/react
├── index.ts          # Type exports, server-safe
├── client.ts         # 'use client' - interactive components
└── components/*.tsx  # No directive (imported by client.ts)
```

Usage:
```tsx
// Server component - types only
import type { ButtonProps } from '@ds/react';

// Client component
'use client';
import { Button } from '@ds/react/client';
```

**Alternative considered:** Single entry with all `'use client'`
- Rejected: Forces entire import tree to be client

## Technical Spikes

### Spike 1: Event Handler Composition

Test implementation:

```tsx
function composeEventHandlers<E extends React.SyntheticEvent>(
  parentHandler?: (event: E) => void,
  childHandler?: (event: E) => void
) {
  return (event: E) => {
    childHandler?.(event);
    if (!event.defaultPrevented) {
      parentHandler?.(event);
    }
  };
}
```

### Spike 2: Ref Merging

```tsx
function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    }
  };
}
```

### Spike 3: Props Merging

```tsx
function mergeProps<T extends Record<string, unknown>>(
  slotProps: T,
  childProps: T
): T {
  const result = { ...slotProps } as T;

  for (const key in childProps) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (key === 'className') {
      result[key] = [slotValue, childValue].filter(Boolean).join(' ') as T[typeof key];
    } else if (key === 'style') {
      result[key] = { ...slotValue as object, ...childValue as object } as T[typeof key];
    } else if (key.startsWith('on') && typeof slotValue === 'function') {
      result[key] = composeEventHandlers(slotValue, childValue as any) as T[typeof key];
    } else if (childValue !== undefined) {
      result[key] = childValue;
    }
  }

  return result;
}
```

## Open Questions

### Resolved
- ~~Box relationship to WC?~~ → React-only, CSS classes only

### To Validate During Implementation
1. Does happy-dom support custom elements for tests?
   - Initial evidence: existing tests pass, so likely yes
2. Bundle size of Slot implementation vs Radix dependency?
   - Need to measure after implementation

## References

- [Radix UI Slot Documentation](https://www.radix-ui.com/primitives/docs/utilities/slot)
- [Radix UI Composition Guide](https://www.radix-ui.com/primitives/docs/guides/composition)
- [Jacob Paris: Implement asChild pattern](https://www.jacobparis.com/content/react-as-child)
- [cloneElement deprecation discussion](https://github.com/radix-ui/primitives/issues/2537)
