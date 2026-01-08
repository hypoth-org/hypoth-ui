# CSS Classes Contract: Layout Primitives

**Feature**: 020-layout-primitives
**Date**: 2026-01-08

## Overview

This document defines the CSS class naming conventions and structure for layout primitive components. All classes are generated in the `components` layer of the CSS cascade.

## Layer Integration

```css
/* In @ds/css */
@layer reset, tokens, base, components, animations, utilities, overrides;

/* Layout component styles go in components layer */
@layer components {
  /* All layout CSS here */
}
```

## Class Naming Convention

### Pattern

```
.ds-{component}[--{modifier}][--{breakpoint}\:{property}-{value}]
```

### Examples

```css
.ds-flow                    /* Base component */
.ds-flow--inline            /* Modifier (inline-flex) */
.ds-flow--md\:dir-row       /* Responsive variant */
```

## Flow Classes

### Base

```css
.ds-flow {
  display: flex;
  flex-direction: row;
}
```

### Direction Variants

| Attribute | Classes Applied |
|-----------|-----------------|
| `direction="row"` | `[data-direction="row"]` |
| `direction="column"` | `[data-direction="column"]` |
| `direction="row-reverse"` | `[data-direction="row-reverse"]` |
| `direction="column-reverse"` | `[data-direction="column-reverse"]` |

### Responsive Direction

| Responsive Syntax | Classes Applied |
|-------------------|-----------------|
| `direction="base:column md:row"` | `.ds-flow--md\:dir-row` |
| `direction="base:row lg:column"` | `.ds-flow--lg\:dir-column` |

### Gap Variants

| Attribute | CSS Variable |
|-----------|--------------|
| `gap="none"` | `gap: 0` |
| `gap="xs"` | `gap: var(--ds-spacing-xs)` |
| `gap="sm"` | `gap: var(--ds-spacing-sm)` |
| `gap="md"` | `gap: var(--ds-spacing-md)` |
| `gap="lg"` | `gap: var(--ds-spacing-lg)` |
| `gap="xl"` | `gap: var(--ds-spacing-xl)` |
| `gap="2xl"` | `gap: var(--ds-spacing-2xl)` |
| `gap="3xl"` | `gap: var(--ds-spacing-3xl)` |

### Other Flow Variants

```css
.ds-flow--inline { display: inline-flex; }
.ds-flow--wrap { flex-wrap: wrap; }
.ds-flow--wrap-reverse { flex-wrap: wrap-reverse; }
```

## Container Classes

### Base

```css
.ds-container {
  width: 100%;
  margin-inline: auto;
  padding-inline: var(--ds-container-padding);
  max-width: var(--ds-container-max);
}
```

### Size Variants

| Attribute | Max Width |
|-----------|-----------|
| `size="sm"` | `640px` |
| `size="md"` | `768px` |
| `size="lg"` | `1024px` |
| `size="xl"` | `1280px` |
| `size="2xl"` | `1536px` |
| `size="full"` | `100%` |

## Grid Classes

### Base

```css
.ds-grid {
  display: grid;
  gap: var(--ds-grid-gap, var(--ds-spacing-md));
}
```

### Column Variants

| Attribute | Grid Template |
|-----------|---------------|
| `columns="1"` | `grid-template-columns: repeat(1, minmax(0, 1fr))` |
| `columns="2"` | `grid-template-columns: repeat(2, minmax(0, 1fr))` |
| `columns="3"` | `grid-template-columns: repeat(3, minmax(0, 1fr))` |
| ... | ... |
| `columns="12"` | `grid-template-columns: repeat(12, minmax(0, 1fr))` |
| `columns="auto-fit"` | `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))` |
| `columns="auto-fill"` | `grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))` |

### Responsive Columns

```css
/* Example: columns="base:1 md:2 lg:3" */
.ds-grid[data-columns="1"] { ... }

@media (min-width: 768px) {
  .ds-grid--md\:cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .ds-grid--lg\:cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
```

## Box Classes

### Base

```css
.ds-box {
  /* No default styles - purely a styling container */
}
```

### Data Attribute Selectors

```css
/* Padding */
.ds-box[data-p="xs"] { padding: var(--ds-spacing-xs); }
.ds-box[data-p="sm"] { padding: var(--ds-spacing-sm); }
/* ... etc */

/* Horizontal/Vertical Padding */
.ds-box[data-px="md"] { padding-inline: var(--ds-spacing-md); }
.ds-box[data-py="lg"] { padding-block: var(--ds-spacing-lg); }

/* Background */
.ds-box[data-bg="surface"] { background: var(--ds-color-surface); }
.ds-box[data-bg="background"] { background: var(--ds-color-background); }

/* Radius */
.ds-box[data-radius="sm"] { border-radius: var(--ds-radius-sm); }
.ds-box[data-radius="md"] { border-radius: var(--ds-radius-md); }
```

## Section Classes

### Base

```css
.ds-section {
  padding-block: var(--ds-section-spacing, var(--ds-spacing-lg));
}
```

### Spacing Variants

```css
.ds-section[data-spacing="none"] { padding-block: 0; }
.ds-section[data-spacing="sm"] { padding-block: var(--ds-spacing-sm); }
.ds-section[data-spacing="md"] { padding-block: var(--ds-spacing-md); }
.ds-section[data-spacing="lg"] { padding-block: var(--ds-spacing-lg); }
.ds-section[data-spacing="xl"] { padding-block: var(--ds-spacing-xl); }
```

## Page Classes

### Base

```css
.ds-page {
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport for mobile */
  background: var(--ds-page-bg, var(--ds-color-background));
}
```

## AppShell Classes

### Base

```css
.ds-app-shell {
  display: grid;
  min-height: 100vh;
  min-height: 100dvh;
  grid-template-areas:
    "header"
    "main"
    "footer";
  grid-template-rows: auto 1fr auto;
}
```

### Sidebar Variants

```css
.ds-app-shell[data-sidebar="left"] {
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: auto 1fr;
}

.ds-app-shell[data-sidebar="right"] {
  grid-template-areas:
    "header header"
    "main sidebar"
    "footer footer";
  grid-template-columns: 1fr auto;
}
```

## Header/Footer Classes

### Base

```css
.ds-header {
  grid-area: header;
}

.ds-footer {
  grid-area: footer;
}
```

### Sticky Variants

```css
.ds-header[data-sticky] {
  position: sticky;
  top: 0;
  z-index: var(--ds-z-sticky);
}

.ds-footer[data-sticky] {
  position: sticky;
  bottom: 0;
  z-index: var(--ds-z-sticky);
}
```

### Safe Area Variants

```css
.ds-header[data-safe-area] {
  padding-top: env(safe-area-inset-top, 0px);
}

.ds-footer[data-safe-area] {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```

## Main Classes

```css
.ds-main {
  grid-area: main;
}

.ds-main:focus {
  outline: none; /* Outline handled by skip-link focus */
}
```

## Spacer Classes

```css
.ds-spacer {
  flex: none;
}

.ds-spacer[data-axis="vertical"] {
  height: var(--ds-spacer-size, var(--ds-spacing-md));
  width: 100%;
}

.ds-spacer[data-axis="horizontal"] {
  width: var(--ds-spacer-size, var(--ds-spacing-md));
  height: 100%;
}
```

## Center Classes

```css
.ds-center {
  display: flex;
  justify-content: center;
}

.ds-center--vertical {
  align-items: center;
  min-height: 100%;
}

.ds-center[data-max-width] {
  max-width: var(--ds-center-max);
  margin-inline: auto;
}
```

## Split Classes

```css
.ds-split {
  display: grid;
  grid-template-columns: var(--ds-split-first) var(--ds-split-second);
  gap: var(--ds-split-gap, var(--ds-spacing-md));
}

/* Collapse at breakpoint */
@media (max-width: 767px) {
  .ds-split--collapse-md {
    grid-template-columns: 1fr;
  }
}
```

### Ratio Variants

```css
.ds-split[data-ratio="equal"] { --ds-split-first: 1fr; --ds-split-second: 1fr; }
.ds-split[data-ratio="1-2"] { --ds-split-first: 1fr; --ds-split-second: 2fr; }
.ds-split[data-ratio="2-1"] { --ds-split-first: 2fr; --ds-split-second: 1fr; }
.ds-split[data-ratio="1-3"] { --ds-split-first: 1fr; --ds-split-second: 3fr; }
.ds-split[data-ratio="3-1"] { --ds-split-first: 3fr; --ds-split-second: 1fr; }
```

## Wrap Classes

```css
.ds-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ds-wrap-gap, var(--ds-spacing-sm));
}
```

## Responsive Class Generation

All responsive classes follow this pattern per breakpoint:

```css
@media (min-width: 640px) {  /* sm */
  .ds-flow--sm\:dir-row { flex-direction: row; }
  .ds-flow--sm\:dir-column { flex-direction: column; }
  .ds-flow--sm\:gap-md { gap: var(--ds-spacing-md); }
  .ds-grid--sm\:cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  /* ... etc for all responsive props */
}

@media (min-width: 768px) {  /* md */
  .ds-flow--md\:dir-row { flex-direction: row; }
  /* ... etc */
}

/* Repeat for lg, xl, 2xl, 3xl */
```
