# Data Model: Web Components Platform Conventions

**Feature**: 006-wc-platform
**Date**: 2026-01-02

## Entities

### DSElement (Base Class)

The foundational Lit class that all design system components extend.

| Property | Type | Description |
|----------|------|-------------|
| - | - | Extends LitElement with no additional properties |

**Behavior**:
- `createRenderRoot()` returns `this` for Light DOM rendering
- Inherits all LitElement lifecycle methods
- Components extending this class render directly into the host element

**Relationships**:
- Extended by: All `ds-*` component classes (DsButton, DsInput, etc.)

---

### ComponentRegistry

A static mapping of tag names to component class constructors.

| Property | Type | Description |
|----------|------|-------------|
| entries | `Record<string, CustomElementConstructor>` | Map of tag name to class |

**Structure**:
```typescript
{
  'ds-button': typeof DsButton,
  'ds-input': typeof DsInput,
  // ... all component mappings
}
```

**Validation Rules**:
- Tag names MUST match pattern `ds-{component-name}` (lowercase, hyphen-separated)
- Each tag name MUST map to exactly one class
- Classes MUST extend DSElement

**State Transitions**: N/A (static data structure)

---

### DsLoader (React Component)

The Next.js client component that triggers element registration.

| Property | Type | Description |
|----------|------|-------------|
| onLoad | `() => void` (optional) | Callback fired after registration completes |

**Internal State**:
| State | Type | Description |
|-------|------|-------------|
| isLoaded | boolean | Whether registration has completed |

**Lifecycle**:
1. Component mounts (client-side only)
2. `useEffect` triggers `registerAllElements()`
3. Registration iterates through ComponentRegistry
4. Each element defined via `customElements.define()`
5. `onLoad` callback fired (if provided)
6. Component renders `null` (no DOM output)

---

### EnforcementResult

Output from the auto-define detection script.

| Field | Type | Description |
|-------|------|-------------|
| filePath | string | Path to the scanned file |
| violations | Violation[] | List of detected side-effect registrations |
| passed | boolean | Whether file has no violations |

### Violation

Individual detection of a side-effect registration.

| Field | Type | Description |
|-------|------|-------------|
| line | number | Line number of the call |
| column | number | Column number of the call |
| tagName | string | The tag name being registered (if determinable) |
| code | string | Snippet of the offending code |

---

## Event Model

### Custom Event Structure

All design system custom events follow this structure:

| Property | Value | Description |
|----------|-------|-------------|
| type | `ds:{event-name}` | Namespaced event name |
| bubbles | `true` | Event bubbles up the DOM tree |
| composed | `true` | Event crosses shadow boundaries |
| detail | `unknown` | Event-specific payload |

**Naming Convention**:
- Format: `ds:{action}` (e.g., `ds:click`, `ds:change`, `ds:dismiss`)
- Action names: lowercase, hyphen-separated for multi-word
- Examples: `ds:select`, `ds:value-change`, `ds:open`, `ds:close`

---

## Attribute Model

### Attribute Naming Convention

| Pattern | Example | Description |
|---------|---------|-------------|
| Single word | `variant`, `size`, `disabled` | Lowercase |
| Multi-word | `is-disabled`, `aria-label` | Lowercase with hyphens |
| Boolean | `disabled`, `readonly` | Presence indicates true |
| Enumerated | `variant="primary"` | Lowercase values |

**Property-Attribute Reflection**:
- Properties using `@property({ reflect: true })` sync to attributes
- Attribute changes update properties automatically (Lit behavior)
- Boolean attributes: presence = true, absence = false

---

## Registration Model

### Registration State Machine

```
[Unregistered] → define() → [Registered]
                     ↓
              (already defined)
                     ↓
              [Warning logged]
```

**Guards**:
- `customElements.get(tagName)` checks before define
- `typeof customElements === "undefined"` guards SSR environment

### Registration Order

Components are registered in the order they appear in ComponentRegistry. Order is deterministic but not guaranteed to matter (each element is independent).

---

## File Structure Model

### Component File Structure

```
packages/wc/src/components/{component-name}/
├── {component-name}.ts      # Component class (exports only, no define())
├── {component-name}.css     # Component styles (optional)
└── index.ts                 # Re-exports for barrel
```

### Registration File Structure

```
packages/wc/src/
├── base/
│   └── ds-element.ts        # DSElement base class
├── registry/
│   ├── define.ts            # define(), isDefined(), whenDefined() utilities
│   └── registry.ts          # ComponentRegistry export
├── events/
│   └── emit.ts              # emitEvent() helper
└── index.ts                 # Public API exports
```

---

## Type Definitions

### CustomElementConstructor
```typescript
type CustomElementConstructor = new (...args: unknown[]) => HTMLElement;
```

### ComponentRegistry Type
```typescript
type ComponentRegistry = Record<string, CustomElementConstructor>;
```

### DsLoaderProps
```typescript
interface DsLoaderProps {
  onLoad?: () => void;
}
```

### EnforcementResult
```typescript
interface EnforcementResult {
  filePath: string;
  violations: Violation[];
  passed: boolean;
}

interface Violation {
  line: number;
  column: number;
  tagName: string | null;
  code: string;
}
```
