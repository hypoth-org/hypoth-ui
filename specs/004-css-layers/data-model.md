# Data Model: CSS Layered Output System

**Feature**: 004-css-layers
**Date**: 2026-01-01

## Overview

This feature does not involve traditional data entities (database models). Instead, the "data model" describes the CSS layer structure, file organization, and naming conventions that form the contract for the styling system.

---

## Layer Entity Model

### CSS Layer

A named cascade layer that groups related styles with defined precedence.

| Attribute | Type | Description |
|-----------|------|-------------|
| `name` | string | Layer identifier (kebab-case) |
| `precedence` | number | Order in cascade (1=lowest, 6=highest) |
| `purpose` | string | What this layer contains |
| `mutable` | boolean | Whether consumers can add to this layer |
| `source_file` | string | Path to layer's source CSS file |

### Layer Instances

| name | precedence | purpose | mutable | source_file |
|------|------------|---------|---------|-------------|
| `reset` | 1 | Browser normalization, box-sizing, reduced-motion | No | `layers/reset.css` |
| `tokens` | 2 | Design token CSS custom properties | No | `layers/tokens.css` |
| `base` | 3 | Semantic HTML element styles | No | `layers/base.css` |
| `components` | 4 | Design system component styles | No | `layers/components.css` |
| `utilities` | 5 | Utility classes for common patterns | No | `layers/utilities.css` |
| `overrides` | 6 | Consumer/tenant customizations | Yes | `layers/overrides.css` |

---

## File Structure Model

### Package Files

| Path | Purpose | Generated |
|------|---------|-----------|
| `src/index.css` | Entry point, imports all layers | No |
| `src/layers/index.css` | Layer order declaration + imports | No |
| `src/layers/reset.css` | Reset styles | No |
| `src/layers/tokens.css` | Token import wrapper | No |
| `src/layers/base.css` | Base element styles | No |
| `src/layers/components.css` | Component style aggregator | No |
| `src/layers/utilities.css` | Utility classes | No |
| `src/layers/overrides.css` | Empty placeholder | No |
| `dist/index.css` | Built, flattened, minified output | Yes |

---

## Utility Class Model

### Naming Convention

Pattern: `ds-{category}-{value}` or `ds-{property}-{value}`

### Utility Categories

| Category | Properties | Values | Example |
|----------|------------|--------|---------|
| Margin | `m`, `mt`, `mr`, `mb`, `ml`, `mx`, `my` | Token scale: `xs`, `sm`, `md`, `lg`, `xl` | `.ds-m-md` |
| Padding | `p`, `pt`, `pr`, `pb`, `pl`, `px`, `py` | Token scale: `xs`, `sm`, `md`, `lg`, `xl` | `.ds-p-lg` |
| Display | `display` | `block`, `flex`, `grid`, `inline`, `hidden` | `.ds-flex` |
| Text Align | `text` | `left`, `center`, `right` | `.ds-text-center` |
| Text Color | `text` | Token colors: `primary`, `muted`, `error` | `.ds-text-primary` |
| Background | `bg` | Token colors: `default`, `subtle`, `muted` | `.ds-bg-subtle` |

### Full Utility List

**Spacing (40 classes)**
```
.ds-m-{xs|sm|md|lg|xl}      (5)
.ds-mt-{xs|sm|md|lg|xl}     (5)
.ds-mr-{xs|sm|md|lg|xl}     (5)
.ds-mb-{xs|sm|md|lg|xl}     (5)
.ds-ml-{xs|sm|md|lg|xl}     (5)
.ds-mx-{xs|sm|md|lg|xl}     (5)
.ds-my-{xs|sm|md|lg|xl}     (5)
.ds-p-{xs|sm|md|lg|xl}      (5)
(same pattern for padding)
```

**Display (5 classes)**
```
.ds-block
.ds-inline
.ds-flex
.ds-grid
.ds-hidden
```

**Text Alignment (3 classes)**
```
.ds-text-left
.ds-text-center
.ds-text-right
```

**Colors (6 classes)**
```
.ds-text-primary
.ds-text-muted
.ds-text-error
.ds-bg-default
.ds-bg-subtle
.ds-bg-muted
```

**Total: ~54 utility classes**

---

## Tenant Override Model

### Tenant Stylesheet Structure

| Section | Purpose | Required |
|---------|---------|----------|
| Token overrides | Custom property values in `:root` | Optional |
| Component overrides | Style adjustments for specific components | Optional |
| Custom utilities | Tenant-specific utility classes | Optional |

### Example Tenant Entity

```
Tenant: acme
  Token Overrides:
    --ds-color-primary-default: #ff5500
    --ds-color-primary-hover: #e64d00
    --ds-color-primary-active: #cc4400
  Component Overrides:
    .ds-button: border-radius: 0
  Custom Utilities: (none)
```

---

## Validation Rules

### Layer Order Validation
- `@layer` declaration MUST appear before any style rules
- All 6 layers MUST be declared in single statement
- Order MUST be: `reset, tokens, base, components, utilities, overrides`

### Class Naming Validation
- All component classes MUST start with `ds-`
- Utility classes MUST follow `ds-{category}-{value}` pattern
- No bare element selectors in `components` or `utilities` layers

### Override Layer Validation
- Base package `overrides.css` MUST be empty
- Consumer overrides MUST use `@layer overrides { }` wrapper
- Token overrides MUST target `:root` or `[data-theme]`

---

## State Transitions

This feature has no state machines. CSS layers are static and declarative.

---

## Relationships

```
@ds/tokens/css ──imports──> layers/tokens.css
@ds/wc/*/css ──imports──> layers/components.css
layers/*.css ──imports──> layers/index.css
layers/index.css ──imports──> src/index.css
src/index.css ──builds──> dist/index.css
dist/index.css ──consumed-by──> apps/demo
dist/index.css ──consumed-by──> packages/docs-renderer-next
tenant-*.css ──extends──> dist/index.css
```
