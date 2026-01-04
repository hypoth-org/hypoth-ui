# Contract: Link Component

**Component**: `Link`
**Path**: `packages/react/src/components/link.tsx`
**Type**: Web Component wrapper with asChild support

## Purpose

Link wraps the `ds-link` Web Component, providing typed props and the `onNavigate` event handler. It also supports `asChild` for Next.js Link integration.

## API Contract

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| href | `string` | required | Target URL |
| external | `boolean` | `false` | Open in new tab |
| variant | `LinkVariant` | `'default'` | Visual style |
| onNavigate | `NavigateEventHandler` | - | Navigation event handler |
| asChild | `boolean` | `false` | Render child element |
| className | `string` | - | Additional classes |
| children | `ReactNode` | - | Link content |

### Types

```typescript
type LinkVariant = 'default' | 'muted' | 'underline';

interface DsNavigateEventDetail {
  href: string;
  external: boolean;
  originalEvent: MouseEvent | KeyboardEvent;
}

type NavigateEventHandler = (event: CustomEvent<DsNavigateEventDetail>) => void;
```

## Behavior

### Standard Rendering

Without `asChild`, Link renders a `ds-link` custom element:

```tsx
<Link href="/about">About</Link>
// Renders: <ds-link href="/about" variant="default">About</ds-link>
```

### asChild Rendering

With `asChild`, Link applies styling classes to its child:

```tsx
import NextLink from 'next/link';

<Link href="/products" asChild>
  <NextLink href="/products">Products</NextLink>
</Link>
// Renders: <a href="/products" class="ds-link ds-link--default">Products</a>
```

**Note**: When using `asChild`, the underlying `ds-link` WC is NOT rendered. Styling is applied via CSS classes.

### onNavigate Event

The `onNavigate` handler receives a typed `CustomEvent`:

```tsx
<Link
  href="/dashboard"
  onNavigate={(event) => {
    console.log(event.detail.href);     // "/dashboard"
    console.log(event.detail.external); // false
    event.preventDefault();              // Prevent navigation
  }}
>
  Dashboard
</Link>
```

The event is cancelable - calling `preventDefault()` stops navigation.

### External Links

External links open in a new tab with security attributes:

```tsx
<Link href="https://example.com" external>
  External
</Link>
// Renders: <ds-link href="https://example.com" external target="_blank" rel="noopener noreferrer">
```

## Test Cases

### Basic Rendering
```tsx
<Link href="/home">Home</Link>
// Result: <ds-link href="/home" variant="default">Home</ds-link>

<Link href="/about" variant="muted">About</Link>
// Result: <ds-link href="/about" variant="muted">About</ds-link>
```

### External Links
```tsx
<Link href="https://github.com" external>GitHub</Link>
// Result: <ds-link href="https://github.com" external>GitHub</ds-link>
// (ds-link handles target="_blank" and rel internally)
```

### onNavigate Handler
```tsx
<Link href="/products" onNavigate={(e) => console.log(e.detail)}>
  Products
</Link>
// Click triggers: console.log({ href: '/products', external: false, originalEvent: MouseEvent })

// Preventing navigation
<Link
  href="/logout"
  onNavigate={(e) => {
    e.preventDefault();
    showConfirmDialog();
  }}
>
  Logout
</Link>
// Click shows dialog, does not navigate
```

### asChild with Next.js Link
```tsx
import NextLink from 'next/link';

<Link href="/dashboard" asChild>
  <NextLink href="/dashboard" prefetch={false}>
    Dashboard
  </NextLink>
</Link>
// Result: <a href="/dashboard" class="ds-link ds-link--default">Dashboard</a>
// Preserves Next.js routing and prefetch behavior
```

### asChild with Styling
```tsx
<Link href="/settings" variant="underline" asChild>
  <a href="/settings" className="custom">Settings</a>
</Link>
// Result: <a href="/settings" class="ds-link ds-link--underline custom">Settings</a>
```

### Ref Forwarding
```tsx
const ref = useRef<HTMLElement>(null);
<Link ref={ref} href="/about">About</Link>
// ref.current === ds-link element

const anchorRef = useRef<HTMLAnchorElement>(null);
<Link ref={anchorRef} href="/about" asChild>
  <a href="/about">About</a>
</Link>
// anchorRef.current === anchor element
```

## asChild Behavior Differences

| Behavior | Without asChild | With asChild |
|----------|-----------------|--------------|
| Element | `<ds-link>` | Child element |
| Styling | WC internal | CSS classes |
| onNavigate | WC event | Not available* |
| External icon | WC renders | Not rendered |

*When using `asChild`, the `onNavigate` prop is ignored because the `ds-link` WC is not rendered. Next.js Link handles its own navigation events.

## Dependencies

- React 18+ (forwardRef, useEffect)
- @ds/wc ds-link component
- Slot component (internal, for asChild)
- @ds/css link classes (for asChild styling)

## Bundle Impact

- Target: <800 bytes minified
- Plus @ds/wc peer dependency
