# Data Model: Component Styling Tokens

**Feature**: 029-component-styling-tokens
**Date**: 2026-03-07

## Token Tier Hierarchy

```
┌──────────────────────────────────────────────┐
│  Tier 1: Core Primitives                     │
│  Raw values — colors, spacing, radii         │
│  e.g., --ds-spacing-4: 1rem                  │
│        --ds-radius-md: 0.375rem              │
│        color.primitives.blue.600: #2563eb    │
├──────────────────────────────────────────────┤
│  Tier 2: Semantic Tokens                     │
│  Purpose-driven aliases of primitives        │
│  e.g., --ds-color-primary-default            │
│        --ds-color-border-default             │
│        --ds-spacing-component-padding-sm     │
├──────────────────────────────────────────────┤
│  Tier 3: Type Tokens                         │
│  Category-level shared styling               │
│  e.g., --ds-form-control-border-radius       │
│        --ds-action-height-md                 │
│        --ds-overlay-shadow                   │
├──────────────────────────────────────────────┤
│  Tier 4: Component Tokens                    │
│  Per-component + per-sub-element overrides    │
│  e.g., --ds-button-bg                        │
│        --ds-select-trigger-bg                │
│        --ds-input-label-font-weight          │
└──────────────────────────────────────────────┘
```

**Resolution direction**: Component → Type → Semantic → Primitive. Each token references the tier above it. Consumer overrides at any tier cascade down.

## Entities

### Token (Base)

| Field | Type | Description |
|-------|------|-------------|
| `path` | string | Dot-notation path (e.g., `color.primary.default`) |
| `$value` | string | Raw value or DTCG reference (e.g., `{color.primitives.blue.600}`) |
| `$type` | enum | DTCG type: `color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `cubicBezier`, `shadow`, `number` |
| `$description` | string | Human-readable description |
| `tier` | enum | `primitive`, `semantic`, `type`, `component` |
| `cssVariable` | string | Compiled CSS variable name (e.g., `--ds-color-primary-default`) |

### Type Token Category

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Category identifier: `form-controls`, `overlays`, `navigation`, `feedback`, `containers`, `actions` |
| `tokens` | Token[] | Shared tokens for this category |
| `components` | string[] | Component IDs belonging to this category |

### Component Token Set

| Field | Type | Description |
|-------|------|-------------|
| `componentId` | string | Component identifier (e.g., `button`, `select`) |
| `category` | string | Type token category this component belongs to |
| `rootTokens` | Token[] | Tokens for the component root element |
| `elementTokens` | Record<string, Token[]> | Tokens per sub-element (e.g., `trigger`, `content`, `label`) |

## Category → Component Mapping

### form-controls

| Component | Sub-elements | Notes |
|-----------|-------------|-------|
| `input` | `field`, `label` | Has CSS file |
| `select` | `trigger`, `value`, `icon`, `content`, `option`, `group`, `label`, `search` | Has CSS file, existing internal tokens |
| `checkbox` | `control`, `indicator`, `label` | Has CSS file |
| `radio` | `control`, `indicator`, `label` | Has CSS file |
| `textarea` | `field` | Has CSS file |
| `switch` | `track`, `thumb`, `label` | Has CSS file |
| `number-input` | `field`, `increment`, `decrement`, `prefix`, `suffix` | Has CSS file, existing internal tokens |
| `pin-input` | `field`, `separator` | Has CSS file, existing internal tokens |
| `combobox` | `input`, `tag`, `content`, `option` | Has CSS file, existing internal tokens |
| `time-picker` | `segment`, `separator`, `icon`, `dropdown`, `option` | Has CSS file |
| `date-picker` | `trigger`, `content`, `calendar` | Has CSS file, existing internal tokens |
| `slider` | `track`, `range`, `thumb`, `tooltip`, `ticks` | Has CSS file, existing internal tokens |
| `file-upload` | — | No CSS file (needs creation) |
| `field` | — | No CSS file (wrapper, may inherit from form-controls type tokens) |
| `calendar` | `header`, `grid`, `cell` | Has CSS file (used internally by date-picker) |

### overlays

| Component | Sub-elements | Notes |
|-----------|-------------|-------|
| `dialog` | `backdrop`, `content`, `title`, `description`, `close` | Shares pattern with alert-dialog |
| `alert-dialog` | `backdrop`, `content`, `header`, `footer`, `title`, `description` | Has CSS file, existing internal tokens |
| `popover` | `content`, `arrow` | Has CSS file |
| `tooltip` | `content`, `arrow` | Has CSS file |
| `sheet` | `overlay`, `content`, `header`, `footer`, `title`, `description`, `close` | Has CSS file, existing internal tokens |
| `drawer` | — | No CSS file (may share sheet pattern) |
| `hover-card` | — | No CSS file |
| `context-menu` | `content`, `item`, `separator`, `label` | Has CSS file |
| `dropdown-menu` | — | No CSS file (may share menu pattern) |
| `command` | `input`, `list`, `item`, `group`, `separator`, `empty` | Has CSS file |

### navigation

| Component | Sub-elements | Notes |
|-----------|-------------|-------|
| `tabs` | `list`, `trigger`, `content` | Has CSS file |
| `breadcrumb` | `list`, `item`, `link`, `page`, `separator` | Has CSS file |
| `pagination` | `item`, `link`, `previous`, `next`, `ellipsis` | Has CSS file |
| `navigation-menu` | `list`, `item`, `trigger`, `content`, `viewport`, `link`, `indicator` | Has CSS file |
| `menu` | `content`, `item` | Has CSS file |

### feedback

| Component | Sub-elements | Notes |
|-----------|-------------|-------|
| `alert` | — | No CSS file (needs creation) |
| `badge` | — | No CSS file (needs creation) |
| `toast` | — | No CSS file (needs creation) |
| `progress` | — | No CSS file (needs creation) |
| `spinner` | — | Has CSS file (minimal) |
| `skeleton` | — | No CSS file (needs creation) |
| `empty-state` | — | No CSS file |
| `stepper` | `item`, `indicator`, `separator`, `trigger`, `title`, `description`, `content` | Has CSS file |
| `avatar` | `image`, `fallback` | Has CSS file |

### containers

| Component | Sub-elements | Notes |
|-----------|-------------|-------|
| `card` | `header`, `content`, `footer` | Has CSS file |
| `accordion` | `item`, `trigger`, `content` | Has CSS file |
| `collapsible` | `trigger`, `content` | Has CSS file |
| `table` | — | No CSS file (needs creation) |
| `data-table` | — | No CSS file (complex, may share table tokens) |
| `scroll-area` | `viewport`, `scrollbar`, `thumb` | Has CSS file |
| `tree` | — | No CSS file |
| `list` | — | No CSS file |
| `separator` | — | Has CSS file |
| `aspect-ratio` | — | Has CSS file (structural) |
| `layout` | — | Has CSS file (structural) |
| `text` | — | Has CSS file (typography primitive) |

### actions

| Component | Sub-elements | Notes |
|-----------|-------------|-------|
| `button` | `spinner`, `content`, `icon` | Has CSS file |
| `link` | — | Has CSS file |
| `icon` | — | Has CSS file (minimal) |
| `tag` | — | No CSS file (needs creation) |

### excluded

| Component | Reason |
|-----------|--------|
| `visually-hidden` | A11y utility — no visual tokens needed (renders off-screen) |

## Size Token Scale

Applies to form-controls and actions categories:

| Size | Height | Padding-X | Padding-Y | Font-Size | Icon-Size |
|------|--------|-----------|-----------|-----------|-----------|
| `sm` | `2rem` | `0.75rem` | `0.25rem` | `0.75rem` | `0.875rem` |
| `md` | `2.25rem` | `1rem` | `0.375rem` | `0.875rem` | `1rem` |
| `lg` | `2.75rem` | `1.5rem` | `0.5rem` | `1rem` | `1.25rem` |

## State Token Pattern

Component tokens follow this state pattern where applicable:

| State | Suffix | Example |
|-------|--------|---------|
| Default | (none) | `--ds-button-bg` |
| Hover | `-hover` | `--ds-button-bg-hover` |
| Active/Pressed | `-active` | `--ds-button-bg-active` |
| Focus | `-focus` | `--ds-button-border-color-focus` |
| Disabled | `-disabled` | `--ds-button-bg-disabled` |

## Mode Integration

Mode overrides (dark, high-contrast) apply at the semantic tier. Lower tiers inherit automatically:

```
Dark mode redefines:
  --ds-color-primary-default → dark variant
    ↓ cascades to
  --ds-action-primary-bg (type tier, references semantic)
    ↓ cascades to
  --ds-button-bg (component tier, references type)
    ↓ cascades to
  .ds-button { background: var(--ds-button-bg) }
```

Component-level overrides applied by consumers take precedence over mode changes (CSS cascade order).
