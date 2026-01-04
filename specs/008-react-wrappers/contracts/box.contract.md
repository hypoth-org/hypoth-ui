# Contract: Box Component

**Component**: `Box`
**Path**: `packages/react/src/primitives/box.tsx`
**Type**: React-only primitive (no Web Component dependency)

## Purpose

Box is a layout primitive that applies spacing and flexbox/grid CSS classes from the design system. It supports the `asChild` pattern for semantic HTML rendering.

## API Contract

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| asChild | `boolean` | `false` | Render child element instead of div |
| p | `SpacingValue` | - | Padding all sides |
| px | `SpacingValue` | - | Padding horizontal |
| py | `SpacingValue` | - | Padding vertical |
| pt | `SpacingValue` | - | Padding top |
| pr | `SpacingValue` | - | Padding right |
| pb | `SpacingValue` | - | Padding bottom |
| pl | `SpacingValue` | - | Padding left |
| m | `SpacingValue` | - | Margin all sides |
| mx | `SpacingValue` | - | Margin horizontal |
| my | `SpacingValue` | - | Margin vertical |
| mt | `SpacingValue` | - | Margin top |
| mr | `SpacingValue` | - | Margin right |
| mb | `SpacingValue` | - | Margin bottom |
| ml | `SpacingValue` | - | Margin left |
| gap | `SpacingValue` | - | Flex/grid gap |
| display | `DisplayValue` | - | Display mode |
| flexDirection | `FlexDirection` | - | Flex direction |
| alignItems | `AlignValue` | - | Flex/grid align |
| justifyContent | `JustifyValue` | - | Flex/grid justify |
| flexWrap | `'wrap' \| 'nowrap' \| 'wrap-reverse'` | - | Flex wrap |
| flexGrow | `0 \| 1` | - | Flex grow |
| flexShrink | `0 \| 1` | - | Flex shrink |
| className | `string` | - | Additional classes |
| style | `CSSProperties` | - | Inline styles |
| children | `ReactNode` | - | Content |

### Types

```typescript
type SpacingValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
type DisplayValue = 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'none';
type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
type AlignValue = 'start' | 'end' | 'center' | 'stretch' | 'baseline';
type JustifyValue = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
```

## Behavior

### CSS Class Mapping

Props map to CSS utility classes from `@ds/css`:

| Prop | Value | CSS Class |
|------|-------|-----------|
| p | 4 | `ds-p-4` |
| px | 2 | `ds-px-2` |
| py | 3 | `ds-py-3` |
| pt | 1 | `ds-pt-1` |
| m | 4 | `ds-m-4` |
| mx | auto | `ds-mx-auto` |
| gap | 4 | `ds-gap-4` |
| display | flex | `ds-d-flex` |
| flexDirection | column | `ds-flex-col` |
| alignItems | center | `ds-items-center` |
| justifyContent | between | `ds-justify-between` |
| flexWrap | wrap | `ds-flex-wrap` |
| flexGrow | 1 | `ds-grow` |
| flexShrink | 0 | `ds-shrink-0` |

### Default Rendering

Without `asChild`, Box renders as a `<div>`:

```tsx
<Box p={4} display="flex">Content</Box>
// Renders: <div class="ds-p-4 ds-d-flex">Content</div>
```

### asChild Rendering

With `asChild`, Box renders its child with classes applied:

```tsx
<Box p={4} display="flex" asChild>
  <main>Content</main>
</Box>
// Renders: <main class="ds-p-4 ds-d-flex">Content</main>
```

## Test Cases

### Basic Rendering
```tsx
<Box p={4}>Content</Box>
// Result: <div class="ds-p-4">Content</div>

<Box p={4} className="custom">Content</Box>
// Result: <div class="ds-p-4 custom">Content</div>
```

### Spacing Props
```tsx
<Box p={4} px={6} pt={2}>Content</Box>
// Result: <div class="ds-p-4 ds-px-6 ds-pt-2">Content</div>
// Note: More specific props (px, pt) override general (p)
```

### Layout Props
```tsx
<Box display="flex" flexDirection="column" gap={4} alignItems="center">
  <span>A</span>
  <span>B</span>
</Box>
// Result: <div class="ds-d-flex ds-flex-col ds-gap-4 ds-items-center">...</div>
```

### asChild Pattern
```tsx
<Box p={6} asChild>
  <section aria-label="Hero">Content</section>
</Box>
// Result: <section aria-label="Hero" class="ds-p-6">Content</section>

// With existing className
<Box p={4} asChild>
  <nav className="main-nav">Links</nav>
</Box>
// Result: <nav class="ds-p-4 main-nav">Links</nav>
```

### Ref Forwarding
```tsx
const ref = useRef<HTMLDivElement>(null);
<Box ref={ref} p={4}>Content</Box>
// ref.current === the div element

const mainRef = useRef<HTMLElement>(null);
<Box ref={mainRef} asChild>
  <main>Content</main>
</Box>
// mainRef.current === the main element
```

## Dependencies

- React 18+ (forwardRef)
- Slot component (internal)
- @ds/css utility classes

## Bundle Impact

- Target: <800 bytes minified
- CSS classes come from @ds/css (external)
