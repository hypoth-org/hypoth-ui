# Quickstart: Customizing Component Styles

**Feature**: 029-component-styling-tokens

## How Token Tiers Work

The design system uses a four-tier token hierarchy. Each tier references the one above it:

```
Core Primitives → Semantic Tokens → Type Tokens → Component Tokens
```

You can override at any tier. Higher-tier overrides affect more components:

| Override at... | Affects... |
|---------------|-----------|
| Semantic (e.g., `--ds-color-primary-default`) | Every component using "primary" |
| Type (e.g., `--ds-form-control-border-radius`) | All form controls (Input, Select, Checkbox...) |
| Component (e.g., `--ds-button-border-radius`) | Only Button |
| Component element (e.g., `--ds-select-trigger-bg`) | Only the trigger part of Select |

## Quick Examples

### Change the primary color everywhere

The default primary is a vibrant blue (`oklch(0.55 0.19 250)`). To change it to purple, for example:

```css
:root {
  --ds-color-primary-default: oklch(0.55 0.25 300);
  --ds-color-primary-hover: oklch(0.50 0.25 300);
  --ds-color-primary-active: oklch(0.45 0.25 300);
  --ds-color-primary-foreground: oklch(1 0 0);
}
```

### Make all form controls have square corners

```css
:root {
  --ds-form-control-border-radius: 0;
}
```

### Make only buttons pill-shaped

```css
:root {
  --ds-button-border-radius: 9999px;
}
```

### Change just the dropdown part of Select

```css
:root {
  --ds-select-content-bg: oklch(0.97 0 0);
  --ds-select-content-shadow: 0 8px 24px oklch(0 0 0 / 0.15);
}
```

### Apply different styles to a page section

```css
.dashboard-sidebar {
  --ds-action-primary-bg: oklch(0.4 0.15 250);
  --ds-container-border-radius: 0.25rem;
  --ds-form-control-height-md: 1.75rem;
}
```

## Token Naming Pattern

All tokens follow: `--ds-{scope}-{element?}-{property}-{state?}`

**Guessing a token name**:
1. Start with `--ds-`
2. Add the component name: `--ds-button-`, `--ds-select-`, `--ds-dialog-`
3. For sub-elements, add the element: `--ds-select-trigger-`, `--ds-dialog-title-`
4. Add the property: `bg`, `color`, `border-radius`, `padding-x`, `font-size`, `height`
5. Add state if needed: `-hover`, `-active`, `-disabled`, `-focus`

**Example**: "I want to change the Select trigger's border when hovered" → `--ds-select-trigger-border-color-hover`

## Type Categories

| Category | Prefix | Shared by |
|----------|--------|-----------|
| Actions | `--ds-action-*` | Button, Link, IconButton, Tag |
| Form Controls | `--ds-form-control-*` | Input, Select, Checkbox, Radio, Textarea, Switch, etc. |
| Overlays | `--ds-overlay-*` | Dialog, Popover, Tooltip, Sheet, Command, etc. |
| Navigation | `--ds-nav-*` | Tabs, Breadcrumb, Pagination, Menu, etc. |
| Feedback | `--ds-feedback-*` | Alert, Badge, Toast, Progress, etc. |
| Containers | `--ds-container-*` | Card, Accordion, Table, etc. |

## Where to Put Overrides

Add your overrides in a CSS file that loads after the design system tokens:

```css
/* your-theme.css */
@layer overrides {
  :root {
    --ds-color-primary-default: oklch(0.55 0.25 300);
    --ds-button-border-radius: 9999px;
  }
}
```

The `@layer overrides` ensures your customizations take precedence over the design system defaults, regardless of source order.

## Size Variants

Components support size variants through size-indexed type tokens:

```css
:root {
  /* Make all form controls taller */
  --ds-form-control-height-sm: 2.25rem;
  --ds-form-control-height-md: 2.75rem;
  --ds-form-control-height-lg: 3.25rem;
}
```

## Dark Mode

Token overrides work with dark mode automatically. The design system redefines semantic tokens for dark mode, and your component/type overrides cascade on top:

```css
/* This works in both light and dark mode */
:root {
  --ds-button-border-radius: 9999px;
}

/* Override only in dark mode */
[data-mode="dark"] {
  --ds-container-bg: oklch(0.2 0 0);
}
```
