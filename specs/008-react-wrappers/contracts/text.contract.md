# Contract: Text Component

**Component**: `Text`
**Path**: `packages/react/src/components/text.tsx`
**Type**: React-only primitive (no Web Component dependency)

## Purpose

Text is a typography primitive that applies consistent text styling via CSS classes. It supports the `asChild` pattern for semantic HTML elements (h1-h6, p, etc.).

## API Contract

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| asChild | `boolean` | `false` | Render child element instead of span |
| size | `TextSize` | `'md'` | Text size |
| weight | `TextWeight` | `'normal'` | Font weight |
| variant | `TextVariant` | `'default'` | Color variant |
| truncate | `boolean` | `false` | Truncate with ellipsis |
| className | `string` | - | Additional classes |
| children | `ReactNode` | - | Text content |

### Types

```typescript
type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextVariant = 'default' | 'muted' | 'success' | 'warning' | 'error';
```

## Behavior

### CSS Class Mapping

Props map to CSS classes from `@ds/css`:

| Prop | Value | CSS Class |
|------|-------|-----------|
| size | xs | `ds-text-xs` |
| size | sm | `ds-text-sm` |
| size | md | `ds-text-md` |
| size | lg | `ds-text-lg` |
| size | xl | `ds-text-xl` |
| size | 2xl | `ds-text-2xl` |
| weight | normal | `ds-font-normal` |
| weight | medium | `ds-font-medium` |
| weight | semibold | `ds-font-semibold` |
| weight | bold | `ds-font-bold` |
| variant | default | (no class, inherits) |
| variant | muted | `ds-text-muted` |
| variant | success | `ds-text-success` |
| variant | warning | `ds-text-warning` |
| variant | error | `ds-text-error` |
| truncate | true | `ds-truncate` |

### Default Rendering

Without `asChild`, Text renders as a `<span>`:

```tsx
<Text size="lg" weight="bold">Hello</Text>
// Renders: <span class="ds-text-lg ds-font-bold">Hello</span>
```

### asChild Rendering

With `asChild`, Text renders its child with styling classes:

```tsx
<Text size="2xl" weight="bold" asChild>
  <h1>Page Title</h1>
</Text>
// Renders: <h1 class="ds-text-2xl ds-font-bold">Page Title</h1>

<Text size="md" asChild>
  <p>Paragraph text with proper styling.</p>
</Text>
// Renders: <p class="ds-text-md ds-font-normal">Paragraph text...</p>
```

## Test Cases

### Basic Rendering
```tsx
<Text>Default text</Text>
// Result: <span class="ds-text-md ds-font-normal">Default text</span>

<Text size="xl" weight="semibold">Large text</Text>
// Result: <span class="ds-text-xl ds-font-semibold">Large text</span>
```

### Variants
```tsx
<Text variant="muted">Secondary info</Text>
// Result: <span class="ds-text-md ds-font-normal ds-text-muted">...</span>

<Text variant="error">Error message</Text>
// Result: <span class="ds-text-md ds-font-normal ds-text-error">...</span>
```

### Truncation
```tsx
<Text truncate>Very long text that should be truncated...</Text>
// Result: <span class="ds-text-md ds-font-normal ds-truncate">...</span>
```

### asChild with Headings
```tsx
<Text size="2xl" weight="bold" asChild>
  <h1>Main Title</h1>
</Text>
// Result: <h1 class="ds-text-2xl ds-font-bold">Main Title</h1>

<Text size="xl" weight="semibold" asChild>
  <h2>Section Title</h2>
</Text>
// Result: <h2 class="ds-text-xl ds-font-semibold">Section Title</h2>
```

### asChild with Paragraphs
```tsx
<Text asChild>
  <p>This is a paragraph with consistent typography.</p>
</Text>
// Result: <p class="ds-text-md ds-font-normal">This is a paragraph...</p>
```

### className Merging
```tsx
<Text size="lg" className="custom-class">Content</Text>
// Result: <span class="ds-text-lg ds-font-normal custom-class">Content</span>

<Text size="lg" asChild>
  <h3 className="section-header">Section</h3>
</Text>
// Result: <h3 class="ds-text-lg ds-font-normal section-header">Section</h3>
```

### Ref Forwarding
```tsx
const ref = useRef<HTMLSpanElement>(null);
<Text ref={ref}>Content</Text>
// ref.current === the span element

const h1Ref = useRef<HTMLHeadingElement>(null);
<Text ref={h1Ref} asChild>
  <h1>Title</h1>
</Text>
// h1Ref.current === the h1 element
```

## Differences from ds-text Web Component

| Feature | ds-text (WC) | Text (React) |
|---------|--------------|--------------|
| `as` prop | Yes (renders different tags) | No (use asChild) |
| asChild | No | Yes |
| Runtime | Lit | None (CSS classes only) |
| Bundle | Included in @ds/wc | Minimal React code |

**Rationale**: The ds-text WC uses `unsafeStatic` for dynamic tag rendering, which is complex. React's asChild pattern achieves the same goal more elegantly with `cloneElement`.

## Dependencies

- React 18+ (forwardRef)
- Slot component (internal)
- @ds/css typography classes

## Bundle Impact

- Target: <600 bytes minified
- CSS classes come from @ds/css (external)
