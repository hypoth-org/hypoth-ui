# Contract: Factory-Generated Components

**Components**: `Icon`, `Spinner`, `VisuallyHidden`
**Generator**: `packages/react/src/utils/create-component.ts`
**Type**: Web Component wrappers (factory-generated)

## Purpose

Simple WC wrappers generated via `createComponent` factory. These components have straightforward prop-to-attribute mapping without complex event handling.

---

## Icon Component

**Path**: `packages/react/src/components/icon.tsx`
**Wraps**: `ds-icon`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | `string` | required | Lucide icon name (kebab-case) |
| size | `IconSize` | `'md'` | Icon size |
| label | `string` | - | Accessible label (omit for decorative) |
| color | `string` | - | CSS color value |
| className | `string` | - | Additional classes |

### Types

```typescript
type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
```

### Test Cases

```tsx
// Decorative icon
<Icon name="search" />
// Result: <ds-icon name="search" size="md" aria-hidden="true"></ds-icon>

// Meaningful icon
<Icon name="alert-triangle" label="Warning" />
// Result: <ds-icon name="alert-triangle" size="md" label="Warning" role="img" aria-label="Warning"></ds-icon>

// With size and color
<Icon name="heart" size="lg" color="red" />
// Result: <ds-icon name="heart" size="lg" color="red"></ds-icon>

// Ref forwarding
const ref = useRef<HTMLElement>(null);
<Icon ref={ref} name="star" />
// ref.current === ds-icon element
```

---

## Spinner Component

**Path**: `packages/react/src/components/spinner.tsx`
**Wraps**: `ds-spinner`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | `SpinnerSize` | `'md'` | Spinner size |
| label | `string` | `'Loading'` | Accessible label |
| className | `string` | - | Additional classes |

### Types

```typescript
type SpinnerSize = 'sm' | 'md' | 'lg';
```

### Test Cases

```tsx
// Default spinner
<Spinner />
// Result: <ds-spinner size="md" label="Loading"></ds-spinner>

// Custom label
<Spinner label="Fetching data..." />
// Result: <ds-spinner size="md" label="Fetching data..."></ds-spinner>

// Size variant
<Spinner size="lg" />
// Result: <ds-spinner size="lg" label="Loading"></ds-spinner>

// In loading context
<div aria-busy={true}>
  <Spinner label="Loading content" />
</div>

// Ref forwarding
const ref = useRef<HTMLElement>(null);
<Spinner ref={ref} />
// ref.current === ds-spinner element
```

---

## VisuallyHidden Component

**Path**: `packages/react/src/components/visually-hidden.tsx`
**Wraps**: `ds-visually-hidden`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| focusable | `boolean` | `false` | Show content on focus |
| className | `string` | - | Additional classes |
| children | `ReactNode` | required | Hidden content |

### Test Cases

```tsx
// Hidden label for icon button
<button>
  <Icon name="trash" />
  <VisuallyHidden>Delete item</VisuallyHidden>
</button>
// Result: <button><ds-icon...></ds-icon><ds-visually-hidden>Delete item</ds-visually-hidden></button>

// Skip link (visible on focus)
<VisuallyHidden focusable>
  <a href="#main">Skip to main content</a>
</VisuallyHidden>
// Result: <ds-visually-hidden focusable><a href="#main">Skip to main content</a></ds-visually-hidden>

// Ref forwarding
const ref = useRef<HTMLElement>(null);
<VisuallyHidden ref={ref}>Hidden</VisuallyHidden>
// ref.current === ds-visually-hidden element
```

---

## Factory Configuration

Each component is generated using:

```typescript
// icon.tsx
export const Icon = createComponent<DsIcon, IconProps>({
  tagName: 'ds-icon',
  properties: ['name', 'size', 'label', 'color'],
  defaults: { size: 'md' },
});

// spinner.tsx
export const Spinner = createComponent<DsSpinner, SpinnerProps>({
  tagName: 'ds-spinner',
  properties: ['size', 'label'],
  defaults: { size: 'md', label: 'Loading' },
});

// visually-hidden.tsx
export const VisuallyHidden = createComponent<DsVisuallyHidden, VisuallyHiddenProps>({
  tagName: 'ds-visually-hidden',
  properties: ['focusable'],
  defaults: { focusable: false },
});
```

## Common Behavior

All factory-generated components:

1. Forward refs to the underlying custom element
2. Sync props to element properties via `useEffect`
3. Pass through `className` and `style`
4. Handle boolean attributes correctly (false = removed, not "false")

## Dependencies

- React 18+ (forwardRef, useEffect)
- @ds/wc components (peer dependency)
- createComponent factory utility

## Bundle Impact

- Factory shared code: ~400 bytes
- Per component: ~100 bytes
- Total: ~700 bytes for all three
