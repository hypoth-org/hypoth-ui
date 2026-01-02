# Quickstart: DTCG Token-Driven Theming

**Branch**: `003-dtcg-token-theming` | **Date**: 2026-01-01

## Overview

This feature implements a DTCG-compliant design token pipeline that enables multi-brand and multi-mode theming. Tokens are authored in DTCG format and compiled to CSS custom properties, JSON bundles, and TypeScript types.

## Getting Started

### 1. Create a Token File

Token files live in `packages/tokens/src/tokens/`. Use DTCG format:

```json
{
  "$schema": "../../../schemas/dtcg-token.schema.json",
  "color": {
    "$type": "color",
    "primary": {
      "$value": "#0066cc",
      "$description": "Primary brand color"
    },
    "background": {
      "surface": { "$value": "#ffffff" },
      "elevated": { "$value": "#f5f5f5" }
    }
  }
}
```

### 2. Define Token Categories

Tokens must use one of the 12 standardized categories:

| Category | Purpose | Examples |
|----------|---------|----------|
| `color` | Colors | `color.primary`, `color.background.surface` |
| `typography` | Font composites | `typography.heading.h1`, `typography.body` |
| `spacing` | Margins, padding | `spacing.xs`, `spacing.md`, `spacing.xl` |
| `sizing` | Widths, heights | `sizing.button.height`, `sizing.icon.md` |
| `border` | Border composites | `border.default`, `border.focus` |
| `shadow` | Box shadows | `shadow.sm`, `shadow.lg` |
| `motion` | Durations, easing | `motion.duration.fast`, `motion.easing.default` |
| `opacity` | Opacity values | `opacity.disabled`, `opacity.overlay` |
| `z-index` | Stacking order | `z-index.modal`, `z-index.tooltip` |
| `breakpoint` | Responsive breakpoints | `breakpoint.sm`, `breakpoint.lg` |
| `icon` | Icon sizing | `icon.size.sm`, `icon.size.md` |
| `radius` | Border radius | `radius.sm`, `radius.full` |

### 3. Use Token References

Reference other tokens with curly brace syntax:

```json
{
  "color": {
    "blue": {
      "500": { "$type": "color", "$value": "#3b82f6" }
    },
    "primary": { "$value": "{color.blue.500}" },
    "interactive": { "$value": "{color.primary}" }
  }
}
```

### 4. Create Mode Overrides

Mode files override tokens for specific themes. Create in `packages/tokens/src/tokens/modes/`:

**dark.json:**
```json
{
  "color": {
    "$type": "color",
    "background": {
      "surface": { "$value": "#1a1a1a" },
      "elevated": { "$value": "#2d2d2d" }
    },
    "text": {
      "primary": { "$value": "#ffffff" }
    }
  }
}
```

### 5. Create Brand Overrides

Brand files customize tokens per brand. Create in `packages/tokens/src/tokens/brands/<brand>/`:

**tokens.json:**
```json
{
  "color": {
    "$type": "color",
    "primary": { "$value": "#7c3aed" },
    "interactive": { "$value": "{color.primary}" }
  }
}
```

### 6. Compile Tokens

```bash
# Build all token outputs
pnpm --filter @ds/tokens build
```

**Expected Output:**
```
> @ds/tokens@0.0.0 build
> tsx src/build/build.ts

Building tokens...
Loaded 139 global tokens
Loaded 2 brands
Loaded 4 modes
Written: dist/css/tokens.css
Written: dist/json/tokens.json
Written: dist/ts/index.ts
Written: dist/ts/runtime/index.ts
Build complete: 139 tokens
```

**Generated Files:**
- `dist/css/tokens.css` - CSS custom properties
- `dist/json/tokens.json` - Resolved token tree with metadata
- `dist/ts/index.ts` - TypeScript types
- `dist/ts/runtime/index.ts` - Runtime utilities

### 7. Consume Tokens in Components

Use CSS custom properties with the naming convention `--{category}-{path}`:

```css
.button {
  background: var(--color-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  color: var(--color-text-inverse);
}
```

### 8. Declare tokensUsed in Manifest

Add `tokensUsed` to component manifests:

```json
{
  "id": "button",
  "name": "Button",
  "status": "stable",
  "tokensUsed": [
    "color.primary",
    "color.text.inverse",
    "spacing.sm",
    "spacing.md",
    "radius.md"
  ]
}
```

### 9. Enable Runtime Theming

Add theme attributes to your HTML:

```html
<!DOCTYPE html>
<html data-brand="default" data-mode="light">
  <head>
    <script>
      // Set mode before render to prevent flash
      const mode = localStorage.getItem('mode') ||
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.dataset.mode = mode;
    </script>
    <link rel="stylesheet" href="@ds/tokens/css">
  </head>
</html>
```

Switch modes at runtime using the theme controller:

```javascript
import { setMode, setBrand, toggleMode, onModeChange } from '@ds/tokens/runtime';

// Set mode directly
setMode('dark');

// Toggle between light/dark
toggleMode();

// Switch brand
setBrand('acme');

// Listen for mode changes
const unsubscribe = onModeChange((mode) => {
  console.log('Mode changed to:', mode);
});
```

Or use the DOM API directly:

```javascript
// Toggle dark mode
document.documentElement.dataset.mode = 'dark';

// Switch brand
document.documentElement.dataset.brand = 'acme';
```

## Key Concepts

### Token Resolution Cascade

Tokens resolve in this order (first match wins):
1. Brand + Mode (e.g., `acme` + `dark`)
2. Brand base (e.g., `acme` defaults)
3. Global + Mode (e.g., global `dark`)
4. Global base (fallback)

### CSS Scoping

Generated CSS uses attribute selectors with `@layer` for proper cascade:

```css
/* Default tokens (from actual build output) */
@layer tokens {
:root {
  --border-default: 1px solid #e5e7eb;
  --color-background-surface: #ffffff;
  --color-primary: #0066cc;
  --color-text-primary: #111827;
  --motion-duration-fast: 100ms;
  --spacing-md: 1rem;
  /* ... 139 tokens total */
}
}

/* Dark mode overrides */
@layer tokens.modes {
:root[data-mode="dark"] {
  --color-background-surface: #1a1a1a;
  --color-text-primary: #f9fafb;
}
}

/* Brand overrides */
@layer tokens.brands {
:root[data-brand="acme"] {
  --color-primary: #7c3aed;
}
}
```

### User Preference Respect

The system automatically respects:
- `prefers-color-scheme`: Sets initial mode
- `prefers-contrast`: Applies high-contrast tokens
- `prefers-reduced-motion`: Disables motion tokens

## Generated TypeScript Types

The compiler generates TypeScript union types for type-safe token access:

```typescript
/** color token paths */
export type ColorTokenPath =
  | 'color.background.elevated'
  | 'color.background.subtle'
  | 'color.background.surface'
  | 'color.primary'
  | 'color.text.primary'
  // ... 16 color tokens

/** spacing token paths */
export type SpacingTokenPath =
  | 'spacing.xs' | 'spacing.sm' | 'spacing.md'
  | 'spacing.lg' | 'spacing.xl'
  // ... 8 spacing tokens

/** All token paths */
export type TokenPath =
  | ColorTokenPath | SpacingTokenPath | ...;
```

## Commands

```bash
# Build tokens
pnpm --filter @ds/tokens build

# Validate token references
pnpm --filter @ds/docs-core validate:tokens

# Generate token docs
pnpm --filter @ds/docs-core build:token-docs

# Validate component tokensUsed
pnpm --filter @ds/docs-core validate
```

## File Locations

| File | Location | Purpose |
|------|----------|---------|
| Global tokens | `packages/tokens/src/tokens/global/` | Base token definitions (color, spacing, typography, sizing, motion, opacity, z-index, breakpoint, icon, radius, shadow, border) |
| Brand tokens | `packages/tokens/src/tokens/brands/<name>/tokens.json` | Brand overrides (default, acme) |
| Mode tokens | `packages/tokens/src/tokens/modes/` | Mode overrides (light, dark, high-contrast, reduced-motion) |
| CSS output | `packages/tokens/dist/css/tokens.css` | Compiled CSS custom properties |
| JSON output | `packages/tokens/dist/json/tokens.json` | Resolved tree with metadata |
| TS types | `packages/tokens/dist/ts/index.ts` | TypeScript path types |
| Runtime utils | `packages/tokens/dist/ts/runtime/index.ts` | Theme controller utilities |
| Token docs | `packages/docs-content/tokens/` | Generated docs per category |

## Troubleshooting

### "Unknown token reference" Error

Token references a path that doesn't exist. Check:
- Token path is spelled correctly
- Referenced token exists in global or same scope
- Circular reference is not present

### "Invalid token category" Error

Token path doesn't start with valid category. Use one of:
`color`, `typography`, `spacing`, `sizing`, `border`, `shadow`, `motion`, `opacity`, `z-index`, `breakpoint`, `icon`, `radius`

### "Circular reference detected" Error

Two tokens reference each other. Check the error message for the cycle path and break the cycle.

### Mode switching causes flicker

Ensure the mode-setting script runs in `<head>` before stylesheets load:

```html
<head>
  <script>/* set mode here */</script>
  <link rel="stylesheet" href="tokens.css">
</head>
```

## Next Steps

- See [data-model.md](./data-model.md) for entity definitions
- See [contracts/](./contracts/) for JSON schemas
- See [spec.md](./spec.md) for full requirements
