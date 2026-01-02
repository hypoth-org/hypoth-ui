# CSS Layer API Contract

**Package**: `@ds/css`
**Version**: 0.1.0
**Date**: 2026-01-01

## Overview

This document defines the public CSS API contract for `@ds/css`. Breaking changes to items marked as **Stable** require a major version bump.

---

## Package Exports

### Main Entry Point

```
@ds/css → dist/index.css
```

**Stability**: Stable

Importing `@ds/css` provides:
- Complete layer structure with correct precedence
- All token CSS custom properties
- Base element styles
- Component styles
- Utility classes
- Empty overrides layer

### Individual Layer Exports (Future)

Reserved for future implementation:

```
@ds/css/layers/reset → dist/layers/reset.css
@ds/css/layers/base → dist/layers/base.css
@ds/css/layers/utilities → dist/layers/utilities.css
```

**Stability**: Experimental (not yet implemented)

---

## Layer Order Contract

**Stability**: Stable

The layer order is fixed and MUST NOT change between minor versions:

```css
@layer reset, tokens, base, components, utilities, overrides;
```

| Position | Layer | Precedence |
|----------|-------|------------|
| 1 | reset | Lowest |
| 2 | tokens | ↑ |
| 3 | base | ↑ |
| 4 | components | ↑ |
| 5 | utilities | ↑ |
| 6 | overrides | Highest |

---

## CSS Custom Properties Contract

### Token Variables

All token variables follow the pattern `--ds-{category}-{path}`.

**Stability**: Stable (defined by `@ds/tokens`)

| Category | Example Variables |
|----------|-------------------|
| Color | `--ds-color-primary-default`, `--ds-color-background-subtle` |
| Spacing | `--ds-spacing-xs`, `--ds-spacing-md`, `--ds-spacing-xl` |
| Typography | `--ds-font-size-sm`, `--ds-font-weight-bold` |
| Radius | `--ds-radius-sm`, `--ds-radius-md`, `--ds-radius-lg` |

### Component Variables

Components MAY expose additional CSS custom properties for fine-grained customization.

**Stability**: Experimental (per-component)

---

## Class Name Contract

### Component Classes

**Stability**: Stable

| Pattern | Description | Example |
|---------|-------------|---------|
| `.ds-{component}` | Base component class | `.ds-button` |
| `.ds-{component}--{variant}` | Variant modifier | `.ds-button--primary` |
| `.ds-{component}--{size}` | Size modifier | `.ds-button--lg` |
| `.ds-{component}--{state}` | State modifier | `.ds-button--loading` |
| `.ds-{component}__{element}` | Child element | `.ds-button__content` |

### Utility Classes

**Stability**: Stable

| Pattern | Description | Example |
|---------|-------------|---------|
| `.ds-m-{scale}` | Margin all sides | `.ds-m-md` |
| `.ds-m{t\|r\|b\|l}-{scale}` | Margin single side | `.ds-mt-lg` |
| `.ds-m{x\|y}-{scale}` | Margin axis | `.ds-mx-auto` |
| `.ds-p-{scale}` | Padding all sides | `.ds-p-sm` |
| `.ds-p{t\|r\|b\|l}-{scale}` | Padding single side | `.ds-pb-xl` |
| `.ds-p{x\|y}-{scale}` | Padding axis | `.ds-py-md` |
| `.ds-{display}` | Display utility | `.ds-flex`, `.ds-grid`, `.ds-hidden` |
| `.ds-text-{align}` | Text alignment | `.ds-text-center` |
| `.ds-text-{color}` | Text color | `.ds-text-primary` |
| `.ds-bg-{color}` | Background color | `.ds-bg-subtle` |

### Spacing Scale Values

**Stability**: Stable

| Value | Token Reference |
|-------|-----------------|
| `xs` | `--ds-spacing-xs` |
| `sm` | `--ds-spacing-sm` |
| `md` | `--ds-spacing-md` |
| `lg` | `--ds-spacing-lg` |
| `xl` | `--ds-spacing-xl` |

---

## Override Layer Contract

### Consumer Override Pattern

**Stability**: Stable

Consumers MUST wrap their overrides in the `overrides` layer:

```css
@layer overrides {
  /* Token overrides */
  :root {
    --ds-color-primary-default: #custom-color;
  }

  /* Component overrides */
  .ds-button {
    /* custom styles */
  }
}
```

### Guarantee

Styles in `@layer overrides` will ALWAYS take precedence over base styles, regardless of selector specificity.

---

## Breaking Change Policy

| Change Type | Version Impact |
|-------------|----------------|
| Remove layer | Major |
| Reorder layers | Major |
| Remove stable class | Major |
| Rename stable class | Major |
| Remove token variable | Major (coordinated with @ds/tokens) |
| Add new layer | Minor |
| Add new utility class | Minor |
| Add new component class | Minor |
| Modify internal implementation | Patch |

---

## Compatibility Matrix

| Environment | Support |
|-------------|---------|
| Chrome 99+ | Full |
| Firefox 97+ | Full |
| Safari 15.4+ | Full |
| Edge 99+ | Full |
| IE11 | Not supported |
| Node.js (SSR) | CSS parsed as string, no runtime |

---

## Usage Examples

### Basic Import

```css
/* In your app's global CSS */
@import "@ds/css";
```

### With Tenant Override

```css
/* In your app's global CSS */
@import "@ds/css";
@import "./tenant-acme.css";
```

### In Next.js

```typescript
// app/layout.tsx
import "@ds/css";
```

### In HTML

```html
<link rel="stylesheet" href="https://cdn.example.com/ds-css/index.css">
```
