# Token API Contract: CSS Custom Property Surface

**Feature**: 029-component-styling-tokens
**Date**: 2026-03-07

## Overview

This document defines the public CSS custom property API that consumers use to customize component appearance. All tokens follow the `--ds-` prefix convention and are organized into four tiers.

## Naming Grammar

```
--ds-{tier-prefix}-{property}[-{state}][-{size}]
```

### Tier Prefixes

| Tier | Prefix Pattern | Scope |
|------|---------------|-------|
| Primitive | `--ds-{category}` | `--ds-spacing-4`, `--ds-radius-md` |
| Semantic | `--ds-color-{intent}` | `--ds-color-primary-default` |
| Type | `--ds-{category}` | `--ds-form-control-*`, `--ds-action-*` |
| Component (root) | `--ds-{component}` | `--ds-button-*` |
| Component (element) | `--ds-{component}-{element}` | `--ds-select-trigger-*` |

### Property Shorthands

| Shorthand | CSS Property | Used for |
|-----------|-------------|----------|
| `bg` | `background-color` | Backgrounds |
| `color` | `color` | Text color |
| `border-color` | `border-color` | Border color |
| `border-radius` | `border-radius` | Corner radius |
| `shadow` | `box-shadow` | Elevation |
| `padding` | `padding` | Internal spacing |
| `padding-x` | `padding-inline` | Horizontal padding |
| `padding-y` | `padding-block` | Vertical padding |
| `gap` | `gap` | Child spacing |
| `height` | `height` | Component height |
| `min-height` | `min-height` | Minimum height |
| `font-size` | `font-size` | Text size |
| `font-weight` | `font-weight` | Text weight |
| `line-height` | `line-height` | Line spacing |
| `max-width` | `max-width` | Maximum width |
| `min-width` | `min-width` | Minimum width |
| `z-index` | `z-index` | Stacking order |

### State Suffixes

| Suffix | Applies when |
|--------|-------------|
| (none) | Default/resting state |
| `-hover` | Mouse hover, pointer over |
| `-active` | Mouse down, pressed |
| `-focus` | Keyboard focus visible |
| `-disabled` | Disabled attribute set |

### Size Suffixes

| Suffix | Scale |
|--------|-------|
| `-sm` | Small |
| `-md` | Medium (default) |
| `-lg` | Large |

## Type Token API

### actions

```css
/* Sizing */
--ds-action-height-sm
--ds-action-height-md
--ds-action-height-lg
--ds-action-padding-x-sm
--ds-action-padding-x-md
--ds-action-padding-x-lg
--ds-action-padding-y-sm
--ds-action-padding-y-md
--ds-action-padding-y-lg
--ds-action-font-size-sm
--ds-action-font-size-md
--ds-action-font-size-lg

/* Appearance */
--ds-action-font-weight
--ds-action-border-radius
--ds-action-gap

/* Variant colors */
--ds-action-primary-bg
--ds-action-primary-bg-hover
--ds-action-primary-bg-active
--ds-action-primary-color
--ds-action-secondary-bg
--ds-action-secondary-bg-hover
--ds-action-secondary-color
--ds-action-secondary-border-color
--ds-action-ghost-color
--ds-action-ghost-bg-hover
--ds-action-destructive-bg
--ds-action-destructive-bg-hover
--ds-action-destructive-bg-active
--ds-action-destructive-color
--ds-action-disabled-bg
--ds-action-disabled-color
--ds-action-focus-ring
```

### form-controls

```css
/* Appearance */
--ds-form-control-bg
--ds-form-control-border-color
--ds-form-control-border-color-hover
--ds-form-control-border-color-focus
--ds-form-control-border-radius
--ds-form-control-focus-ring
--ds-form-control-error-color
--ds-form-control-error-border-color
--ds-form-control-placeholder-color

/* Sizing */
--ds-form-control-height-sm
--ds-form-control-height-md
--ds-form-control-height-lg
--ds-form-control-padding-x-sm
--ds-form-control-padding-x-md
--ds-form-control-padding-x-lg
--ds-form-control-padding-y-sm
--ds-form-control-padding-y-md
--ds-form-control-padding-y-lg
--ds-form-control-font-size-sm
--ds-form-control-font-size-md
--ds-form-control-font-size-lg

/* State */
--ds-form-control-disabled-bg
--ds-form-control-disabled-color
--ds-form-control-disabled-border-color
```

### overlays

```css
--ds-overlay-bg
--ds-overlay-border-color
--ds-overlay-border-radius
--ds-overlay-shadow
--ds-overlay-padding
--ds-overlay-backdrop-color
--ds-overlay-z-index
--ds-overlay-max-width
```

### navigation

```css
--ds-nav-item-padding-x
--ds-nav-item-padding-y
--ds-nav-item-color
--ds-nav-item-color-hover
--ds-nav-item-color-active
--ds-nav-item-bg-hover
--ds-nav-item-bg-active
--ds-nav-item-border-radius
--ds-nav-indicator-color
--ds-nav-separator-color
```

### feedback

```css
--ds-feedback-border-radius
--ds-feedback-padding
--ds-feedback-font-size

/* Per-severity variants */
--ds-feedback-info-bg
--ds-feedback-info-color
--ds-feedback-info-border-color
--ds-feedback-success-bg
--ds-feedback-success-color
--ds-feedback-success-border-color
--ds-feedback-warning-bg
--ds-feedback-warning-color
--ds-feedback-warning-border-color
--ds-feedback-error-bg
--ds-feedback-error-color
--ds-feedback-error-border-color
```

### containers

```css
--ds-container-bg
--ds-container-border-color
--ds-container-border-radius
--ds-container-shadow
--ds-container-padding
```

## Component Token API (Examples)

### button (actions)

```css
/* Root element */
--ds-button-height              /* → --ds-action-height-md */
--ds-button-padding-x           /* → --ds-action-padding-x-md */
--ds-button-padding-y           /* → --ds-action-padding-y-md */
--ds-button-font-size           /* → --ds-action-font-size-md */
--ds-button-font-weight         /* → --ds-action-font-weight */
--ds-button-border-radius       /* → --ds-action-border-radius */
--ds-button-gap                 /* → --ds-action-gap */

/* Primary variant */
--ds-button-primary-bg          /* → --ds-action-primary-bg */
--ds-button-primary-bg-hover    /* → --ds-action-primary-bg-hover */
--ds-button-primary-bg-active   /* → --ds-action-primary-bg-active */
--ds-button-primary-color       /* → --ds-action-primary-color */

/* Secondary variant */
--ds-button-secondary-bg        /* → --ds-action-secondary-bg */
--ds-button-secondary-bg-hover  /* → --ds-action-secondary-bg-hover */
--ds-button-secondary-color     /* → --ds-action-secondary-color */
--ds-button-secondary-border-color /* → --ds-action-secondary-border-color */

/* Ghost variant */
--ds-button-ghost-color         /* → --ds-action-ghost-color */
--ds-button-ghost-bg-hover      /* → --ds-action-ghost-bg-hover */

/* Destructive variant */
--ds-button-destructive-bg      /* → --ds-action-destructive-bg */
--ds-button-destructive-bg-hover /* → --ds-action-destructive-bg-hover */
--ds-button-destructive-color   /* → --ds-action-destructive-color */

/* States */
--ds-button-disabled-bg         /* → --ds-action-disabled-bg */
--ds-button-disabled-color      /* → --ds-action-disabled-color */
--ds-button-focus-ring          /* → --ds-action-focus-ring */
```

### select (form-controls)

```css
/* Root */
--ds-select-border-radius       /* → --ds-form-control-border-radius */

/* Trigger element */
--ds-select-trigger-bg          /* → --ds-form-control-bg */
--ds-select-trigger-border-color /* → --ds-form-control-border-color */
--ds-select-trigger-border-color-hover /* → --ds-form-control-border-color-hover */
--ds-select-trigger-height      /* → --ds-form-control-height-md */
--ds-select-trigger-padding-x   /* → --ds-form-control-padding-x-md */
--ds-select-trigger-font-size   /* → --ds-form-control-font-size-md */
--ds-select-trigger-color       /* → --ds-color-foreground-default */
--ds-select-trigger-placeholder-color /* → --ds-form-control-placeholder-color */

/* Content (dropdown) element */
--ds-select-content-bg          /* → --ds-overlay-bg */
--ds-select-content-border-color /* → --ds-overlay-border-color */
--ds-select-content-border-radius /* → --ds-overlay-border-radius */
--ds-select-content-shadow      /* → --ds-overlay-shadow */
--ds-select-content-z-index     /* → --ds-overlay-z-index */

/* Option element */
--ds-select-option-padding-x
--ds-select-option-padding-y
--ds-select-option-bg-hover
--ds-select-option-bg-active
--ds-select-option-color
```

### dialog (overlays)

```css
/* Backdrop element */
--ds-dialog-backdrop-color      /* → --ds-overlay-backdrop-color */

/* Content element */
--ds-dialog-content-bg          /* → --ds-overlay-bg */
--ds-dialog-content-border-radius /* → --ds-overlay-border-radius */
--ds-dialog-content-shadow      /* → --ds-overlay-shadow */
--ds-dialog-content-padding     /* → --ds-overlay-padding */
--ds-dialog-content-max-width   /* → --ds-overlay-max-width */
--ds-dialog-content-z-index     /* → --ds-overlay-z-index */

/* Title element */
--ds-dialog-title-font-size
--ds-dialog-title-font-weight
--ds-dialog-title-color

/* Description element */
--ds-dialog-description-font-size
--ds-dialog-description-color
```

## Consumer Override Examples

### Override a single component

```css
/* In consumer's CSS (any layer above tokens, or @layer overrides) */
:root {
  --ds-button-border-radius: 9999px;  /* pill buttons */
  --ds-button-primary-bg: oklch(0.6 0.2 145);  /* green buttons */
}
```

### Override an entire category

```css
:root {
  --ds-form-control-border-radius: 0;  /* square inputs, selects, etc. */
  --ds-form-control-border-color: oklch(0.8 0 0);  /* lighter borders */
}
```

### Override the whole theme

```css
:root {
  --ds-color-primary-default: oklch(0.55 0.25 300);  /* purple primary */
  --ds-color-primary-hover: oklch(0.50 0.25 300);
  --ds-color-primary-active: oklch(0.45 0.25 300);
  --ds-color-primary-foreground: oklch(1 0 0);
}
```

### Scoped override (section-level)

```css
.admin-panel {
  --ds-action-primary-bg: oklch(0.5 0.2 25);  /* red actions in admin */
  --ds-container-border-radius: 0.25rem;  /* tighter containers */
}
```

## Backward Compatibility

All existing `--ds-*` tokens remain valid. The new type and component tokens are additive. Existing components that already reference `--ds-color-primary-default` directly will be migrated to reference component tokens that default to the same semantic tokens, producing identical visual output.
