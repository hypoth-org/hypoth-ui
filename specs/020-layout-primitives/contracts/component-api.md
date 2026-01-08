# Component API Contract: Layout Primitives

**Feature**: 020-layout-primitives
**Date**: 2026-01-08

## Overview

This document defines the public API contract for layout primitive components. These contracts ensure consistent behavior between React and Web Component implementations.

## Web Component Custom Elements

### Element Registration

All layout components are registered with the `ds-` prefix:

| Element | Tag Name | Base Class |
|---------|----------|------------|
| Flow | `<ds-flow>` | DSElement |
| Container | `<ds-container>` | DSElement |
| Grid | `<ds-grid>` | DSElement |
| Box | `<ds-box>` | DSElement |
| Section | `<ds-section>` | DSElement |
| Page | `<ds-page>` | DSElement |
| AppShell | `<ds-app-shell>` | DSElement |
| Header | `<ds-header>` | DSElement |
| Footer | `<ds-footer>` | DSElement |
| Main | `<ds-main>` | DSElement |
| Spacer | `<ds-spacer>` | DSElement |
| Center | `<ds-center>` | DSElement |
| Split | `<ds-split>` | DSElement |
| Wrap | `<ds-wrap>` | DSElement |

### Attribute Naming Convention

- **Kebab-case**: Multi-word attributes use kebab-case (`safe-area`, `collapse-at`)
- **Boolean attributes**: Presence indicates true (`<ds-header sticky>`)
- **Responsive syntax**: `"base:value breakpoint:value"` (e.g., `direction="base:column md:row"`)

## React Component Exports

### Named Exports

```typescript
// From @ds/react
export {
  Flow,
  Container,
  Grid,
  Box,
  Section,
  Page,
  AppShell,
  Header,
  Footer,
  Main,
  Spacer,
  Center,
  Split,
  Wrap,
  // Aliases
  Stack,  // Flow with direction="column"
  Inline, // Flow with direction="row"
} from "@ds/react/layout";
```

### Compound Component Pattern (AppShell)

```typescript
// AppShell compound component
export const AppShell: React.FC<AppShellProps> & {
  Header: React.FC<HeaderProps>;
  Footer: React.FC<FooterProps>;
  Main: React.FC<MainProps>;
  Sidebar: React.FC<SidebarProps>;
};
```

## CSS Class Contract

### Base Classes

Each component has a base class with BEM-style variants:

| Component | Base Class | Example Variants |
|-----------|------------|------------------|
| Flow | `.ds-flow` | `.ds-flow--inline` |
| Container | `.ds-container` | `.ds-container--sm` |
| Grid | `.ds-grid` | `.ds-grid--cols-3` |
| Box | `.ds-box` | (uses data attributes) |
| Section | `.ds-section` | `.ds-section--lg` |
| Page | `.ds-page` | (uses data attributes) |
| AppShell | `.ds-app-shell` | `.ds-app-shell--sidebar-left` |
| Header | `.ds-header` | `.ds-header--sticky` |
| Footer | `.ds-footer` | `.ds-footer--sticky` |
| Main | `.ds-main` | (minimal variants) |
| Spacer | `.ds-spacer` | `.ds-spacer--md` |
| Center | `.ds-center` | `.ds-center--vertical` |
| Split | `.ds-split` | `.ds-split--1-2` |
| Wrap | `.ds-wrap` | (uses data attributes) |

### Data Attributes for Dynamic Values

Token-based props use data attributes for styling:

```html
<ds-flow data-direction="column" data-gap="md">
<ds-box data-p="lg" data-bg="surface" data-radius="md">
<ds-grid data-columns="3" data-gap="lg">
```

### Responsive Class Pattern

Responsive overrides follow the pattern `.ds-{component}--{breakpoint}\:{property}-{value}`:

```css
/* Base: column on mobile */
.ds-flow[data-direction="column"] { flex-direction: column; }

/* Override: row at md breakpoint */
@media (min-width: 768px) {
  .ds-flow--md\:dir-row { flex-direction: row; }
}
```

## CSS Custom Properties

Components expose these custom properties for advanced customization:

### Layout Custom Properties

```css
/* Grid columns (set via attribute, customizable in overrides layer) */
--ds-grid-cols: 1;
--ds-grid-gap: var(--ds-spacing-md);

/* Container widths */
--ds-container-max: var(--ds-breakpoint-lg);
--ds-container-padding: var(--ds-spacing-md);

/* Split ratios */
--ds-split-first: 1fr;
--ds-split-second: 1fr;
```

## Event Contract

Layout components do not emit custom events. They are purely structural.

## Slot Contract (Web Components)

### AppShell Slots

```html
<ds-app-shell>
  <ds-header slot="header">...</ds-header>
  <ds-sidebar slot="sidebar">...</ds-sidebar>
  <ds-main>...</ds-main> <!-- default slot -->
  <ds-footer slot="footer">...</ds-footer>
</ds-app-shell>
```

### Section Heading Slot

```html
<ds-section>
  <h2 slot="heading">Section Title</h2>
  <p>Content...</p>
</ds-section>
```

## Accessibility Contract

### ARIA Roles (Automatic)

| Component | Role | Notes |
|-----------|------|-------|
| Header | `banner` | Via native `<header>` element |
| Footer | `contentinfo` | Via native `<footer>` element |
| Main | `main` | Via native `<main>` element |
| Section | - | Via native `<section>` element |

### Focus Management

Layout components do not manage focus. They render focusable content in Light DOM where standard focus behavior applies.

### Skip Link Support

```html
<!-- Recommended pattern -->
<a href="#main-content" class="ds-skip-link">Skip to content</a>
<ds-app-shell>
  <ds-header slot="header">...</ds-header>
  <ds-main id="main-content" tabindex="-1">...</ds-main>
</ds-app-shell>
```

## Version Compatibility

| Package | Minimum Version |
|---------|-----------------|
| `@ds/wc` | 1.x |
| `@ds/react` | 1.x |
| `@ds/css` | 1.x |
| `@ds/tokens` | 1.x |
