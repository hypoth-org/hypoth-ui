# Data Model: Layout Primitives & Page Composition

**Feature**: 020-layout-primitives
**Date**: 2026-01-08

## Overview

Layout primitives are stateless UI components that do not persist data. This document defines the **prop/attribute contracts** and **token value sets** that constrain component behavior.

## Token Value Sets

These are the valid token values that layout components accept. Invalid values trigger dev-mode warnings and are ignored in production.

### Spacing Tokens

Used by: `gap`, `p`, `px`, `py`, `spacing`, `size` props

| Token | CSS Value | Description |
|-------|-----------|-------------|
| `none` | `0` | No spacing |
| `xs` | `0.25rem` | 4px |
| `sm` | `0.5rem` | 8px |
| `md` | `1rem` | 16px |
| `lg` | `1.5rem` | 24px |
| `xl` | `2rem` | 32px |
| `2xl` | `3rem` | 48px |
| `3xl` | `4rem` | 64px |

### Breakpoint Tokens

Used by: Responsive value prefixes

| Token | Min Width | Description |
|-------|-----------|-------------|
| `xs` | 320px | Extra small (phones) |
| `sm` | 640px | Small (large phones) |
| `md` | 768px | Medium (tablets) |
| `lg` | 1024px | Large (laptops) |
| `xl` | 1280px | Extra large (desktops) |
| `2xl` | 1536px | Large desktops |
| `3xl` | 1920px | Wide monitors |

### Container Size Tokens

Used by: `Container.size`, `Center.maxWidth`

| Token | Max Width | Description |
|-------|-----------|-------------|
| `sm` | 640px | Narrow content |
| `md` | 768px | Medium content |
| `lg` | 1024px | Standard content |
| `xl` | 1280px | Wide content |
| `2xl` | 1536px | Extra wide |
| `full` | 100% | Full width |

### Surface Tokens

Used by: `bg` prop (Box, Page)

| Token | Description |
|-------|-------------|
| `background` | Page/app background |
| `surface` | Card/section surface |
| `surface-raised` | Elevated surface |
| `surface-sunken` | Recessed surface |
| `muted` | Subtle background |

### Radius Tokens

Used by: `radius` prop (Box)

| Token | Description |
|-------|-------------|
| `none` | 0 |
| `sm` | Small radius |
| `md` | Medium radius |
| `lg` | Large radius |
| `xl` | Extra large |
| `full` | Fully rounded |

## Component Prop Contracts

### Flow

The primary 1D layout primitive with responsive direction switching.

| Prop/Attribute | Type | Default | Description |
|----------------|------|---------|-------------|
| `direction` | `row` \| `column` \| `row-reverse` \| `column-reverse` | `row` | Flex direction (responsive) |
| `gap` | SpacingToken | `none` | Gap between children (responsive) |
| `align` | `start` \| `center` \| `end` \| `stretch` \| `baseline` | `stretch` | Cross-axis alignment |
| `justify` | `start` \| `center` \| `end` \| `between` \| `around` \| `evenly` | `start` | Main-axis alignment |
| `wrap` | `nowrap` \| `wrap` \| `wrap-reverse` | `nowrap` | Flex wrap |
| `inline` | `boolean` | `false` | Use inline-flex |
| `as` | HTMLElementTag | `div` | Rendered element |

**Responsive Syntax**:
- React: `direction={{ base: "column", md: "row" }}`
- WC: `direction="base:column md:row"`

### Container

Constrains content width with responsive max-widths and padding.

| Prop/Attribute | Type | Default | Description |
|----------------|------|---------|-------------|
| `size` | ContainerSizeToken | `lg` | Max-width constraint |
| `padding` | SpacingToken | `md` | Horizontal padding |
| `as` | HTMLElementTag | `div` | Rendered element |

### Grid

2D grid layout with responsive columns.

| Prop/Attribute | Type | Default | Description |
|----------------|------|---------|-------------|
| `columns` | `1-12` \| `auto-fit` \| `auto-fill` | `1` | Column count (responsive) |
| `gap` | SpacingToken | `md` | Gap between cells (responsive) |
| `rowGap` | SpacingToken | - | Row gap override |
| `columnGap` | SpacingToken | - | Column gap override |
| `as` | HTMLElementTag | `div` | Rendered element |

### Box

Token-only styling escape hatch.

| Prop/Attribute | Type | Default | Description |
|----------------|------|---------|-------------|
| `p` | SpacingToken | - | Padding (all sides) |
| `px` | SpacingToken | - | Horizontal padding |
| `py` | SpacingToken | - | Vertical padding |
| `bg` | SurfaceToken | - | Background color |
| `radius` | RadiusToken | - | Border radius |
| `as` | HTMLElementTag | `div` | Rendered element |

### Section

Semantic section wrapper with spacing.

| Prop/Attribute | Type | Default | Description |
|----------------|------|---------|-------------|
| `spacing` | SpacingToken \| `none` | `lg` | Vertical padding |
| `as` | `section` \| `article` \| `aside` | `section` | Semantic element |

### Page

Page wrapper with min-height and background.

| Prop/Attribute | Type | Default | Description |
|----------------|------|---------|-------------|
| `bg` | SurfaceToken | `background` | Page background |
| `minHeight` | `viewport` \| `full` | `viewport` | Minimum height |

### AppShell

Application structure with landmark regions.

| Prop/Attribute | Type | Default | Description |
|----------------|------|---------|-------------|
| `sidebarPosition` | `left` \| `right` \| `none` | `none` | Sidebar placement |
| `sidebarCollapsible` | `boolean` | `false` | Reserved for future |

**Slots (WC)** / **Children (React)**:
- `header` - Header region
- `sidebar` - Sidebar region
- `main` (default) - Main content
- `footer` - Footer region

### Header

Landmark header with sticky option.

| Prop/Attribute | Type | Default | Description |
|----------------|------|---------|-------------|
| `sticky` | `boolean` | `false` | Sticky positioning |
| `safeArea` | `boolean` | `false` | Safe area insets |

**ARIA**: `role="banner"` (automatic)

### Footer

Landmark footer with sticky option.

| Prop/Attribute | Type | Default | Description |
|----------------|------|---------|-------------|
| `sticky` | `boolean` | `false` | Sticky positioning |
| `safeArea` | `boolean` | `false` | Safe area insets |

**ARIA**: `role="contentinfo"` (automatic)

### Main

Main content region for skip-link targeting.

| Prop/Attribute | Type | Default | Description |
|----------------|------|---------|-------------|
| `id` | `string` | `main-content` | Skip link target ID |

**ARIA**: `role="main"` (automatic via `<main>` element)

### Spacer

Explicit space element.

| Prop/Attribute | Type | Default | Description |
|----------------|------|---------|-------------|
| `size` | SpacingToken | `md` | Space size |
| `axis` | `horizontal` \| `vertical` | `vertical` | Expansion direction |

### Center

Centers content with optional max-width.

| Prop/Attribute | Type | Default | Description |
|----------------|------|---------|-------------|
| `maxWidth` | ContainerSizeToken | - | Max width constraint |
| `vertical` | `boolean` | `false` | Vertical centering |
| `as` | HTMLElementTag | `div` | Rendered element |

### Split

Two-region layout with collapse breakpoint.

| Prop/Attribute | Type | Default | Description |
|----------------|------|---------|-------------|
| `collapseAt` | BreakpointToken | `md` | Collapse to stack below |
| `gap` | SpacingToken | `md` | Gap between regions |
| `ratio` | `equal` \| `1:2` \| `2:1` \| `1:3` \| `3:1` | `equal` | Width ratio |

### Wrap

Wrapping row layout for chips/tags.

| Prop/Attribute | Type | Default | Description |
|----------------|------|---------|-------------|
| `gap` | SpacingToken | `sm` | Gap between items |
| `rowGap` | SpacingToken | - | Row gap override |
| `align` | `start` \| `center` \| `end` | `start` | Cross-axis alignment |
| `as` | HTMLElementTag | `div` | Rendered element |

## Type Definitions (TypeScript)

```typescript
// Token types
type SpacingToken = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
type BreakpointToken = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
type ContainerSizeToken = "sm" | "md" | "lg" | "xl" | "2xl" | "full";
type SurfaceToken = "background" | "surface" | "surface-raised" | "surface-sunken" | "muted";
type RadiusToken = "none" | "sm" | "md" | "lg" | "xl" | "full";

// Responsive value type (React)
type ResponsiveValue<T> = T | Partial<Record<"base" | BreakpointToken, T>>;

// Direction types
type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
type FlexJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
```

## State Transitions

Layout components are stateless. The only state-like behavior is:

- **Responsive state**: Controlled by viewport width via CSS media queries (no JS state)
- **Sticky state**: Controlled by scroll position via CSS `position: sticky` (no JS state)
- **Safe area state**: Controlled by device via CSS `env()` (no JS state)

No component-managed state. No state transitions to track.
