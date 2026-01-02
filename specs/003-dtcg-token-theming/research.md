# Research: DTCG Token-Driven Theming

**Branch**: `003-dtcg-token-theming` | **Date**: 2026-01-01

## DTCG Format Specification

### Decision: Use DTCG Format 2025.10

**Rationale**: DTCG (Design Tokens Community Group) format is the W3C Community Group standard for design tokens. The 2025.10 version is the first stable release, providing a well-defined specification for token structure, types, and references.

**Alternatives Considered**:
- Style Dictionary format: Proprietary, requires translation layer
- Figma Tokens format: Tool-specific, not standardized

### DTCG Token Structure

Every token uses these properties:

| Property | Required | Description |
|----------|----------|-------------|
| `$value` | Yes | The token's value |
| `$type` | No | Token type (inheritable from parent group) |
| `$description` | No | Human-readable description |
| `$extensions` | No | Vendor-specific metadata |

```json
{
  "color": {
    "$type": "color",
    "primary": {
      "$value": "#0066cc",
      "$description": "Primary brand color"
    }
  }
}
```

### Supported Token Types

| Type | Value Format | Example |
|------|--------------|---------|
| `color` | Hex RGB/RGBA | `#0066cc`, `#0066cc80` |
| `dimension` | Number + unit | `16px`, `1.5rem` |
| `fontFamily` | String or array | `["Inter", "sans-serif"]` |
| `fontWeight` | Number (1-1000) or keyword | `700`, `"bold"` |
| `duration` | Number + ms | `200ms` |
| `cubicBezier` | Array [P1x, P1y, P2x, P2y] | `[0.4, 0, 0.2, 1]` |
| `number` | Plain number | `1.5` |
| `shadow` | Object or array | See composite types |
| `border` | Object | `{ color, width, style }` |
| `typography` | Object | `{ fontFamily, fontSize, ... }` |
| `gradient` | Array of stops | `[{ color, position }, ...]` |
| `transition` | Object | `{ duration, delay, timingFunction }` |

### Token References (Aliases)

Tokens can reference other tokens using curly brace syntax:

```json
{
  "color": {
    "blue": {
      "500": { "$type": "color", "$value": "#3b82f6" }
    },
    "primary": { "$value": "{color.blue.500}" }
  }
}
```

References work within composite values:

```json
{
  "border": {
    "default": {
      "$type": "border",
      "$value": {
        "color": "{color.border}",
        "width": "{size.border}",
        "style": "solid"
      }
    }
  }
}
```

### Type Inheritance

Groups can declare `$type` which applies to all descendant tokens:

```json
{
  "spacing": {
    "$type": "dimension",
    "xs": { "$value": "4px" },
    "sm": { "$value": "8px" },
    "md": { "$value": "16px" }
  }
}
```

---

## CSS Scoping Strategy

### Decision: Attribute-Based Scoping with CSS Layers

**Rationale**: Attribute selectors (`[data-brand]`, `[data-mode]`) provide clear, predictable specificity. Combined with CSS `@layer`, this enables a robust cascade without specificity wars.

**Alternatives Considered**:
- Class-based scoping: Less semantic, harder to switch at runtime
- CSS-in-JS: Adds runtime overhead, violates constitution Performance principle
- Shadow DOM scoping: Breaks global theming, increases complexity

### CSS Layer Architecture

```css
@layer reset, tokens, semantic, modes, brands, components, utilities, overrides;
```

| Layer | Purpose | Priority |
|-------|---------|----------|
| `reset` | Browser normalization | Lowest |
| `tokens` | Primitive token values | |
| `semantic` | Purpose-based mappings | |
| `modes` | Light/dark/contrast overrides | |
| `brands` | Brand-specific values | |
| `components` | Component styles | |
| `utilities` | Helper classes | |
| `overrides` | Consumer customizations | Highest |

### Scoping Pattern

```css
/* Default brand (implicit) */
:root {
  --color-primary: #0066cc;
}

/* Brand override */
:root[data-brand="acme"] {
  --color-primary: #0066cc;
}

/* Brand + mode */
:root[data-brand="acme"][data-mode="dark"] {
  --color-primary: #4da6ff;
}
```

### Specificity Guide

| Selector | Specificity |
|----------|-------------|
| `:root` | 0,0,1 |
| `[data-mode="dark"]` | 0,1,0 |
| `:root[data-brand="acme"]` | 0,1,1 |
| `:root[data-brand="acme"][data-mode="dark"]` | 0,2,1 |

Layers override this: a brand selector in the `brands` layer beats a mode selector in the `modes` layer regardless of specificity.

---

## Runtime Mode Switching

### Decision: Blocking Script + CSS Custom Properties

**Rationale**: Setting data attributes before first paint prevents flash of unstyled content (FOUC). CSS custom properties update instantly when attributes change.

**Pattern**:

```html
<html>
<head>
  <script>
    (function() {
      const mode = localStorage.getItem('mode') ||
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.dataset.mode = mode;
      document.documentElement.style.colorScheme = mode;
    })();
  </script>
  <link rel="stylesheet" href="tokens.css">
</head>
```

### User Preference Integration

```css
/* Respect system preference when no explicit mode set */
@media (prefers-color-scheme: dark) {
  :root:not([data-mode]) {
    --color-bg-surface: #1a1a1a;
  }
}

/* Explicit override takes precedence */
:root[data-mode="light"] {
  --color-bg-surface: #ffffff;
}

:root[data-mode="dark"] {
  --color-bg-surface: #1a1a1a;
}

/* High contrast mode */
@media (prefers-contrast: more) {
  :root {
    --color-text-primary: #000000;
    --focus-ring-width: 3px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-duration: 0ms;
  }
}
```

---

## Token Path to CSS Variable Naming

### Decision: Dot-to-Hyphen Conversion

**Rationale**: CSS custom properties use hyphens. Convert DTCG paths directly:

| Token Path | CSS Variable |
|------------|--------------|
| `color.background.primary` | `--color-background-primary` |
| `spacing.md` | `--spacing-md` |
| `typography.heading.h1` | `--typography-heading-h1` |

**Implementation**:

```typescript
function tokenPathToCSS(path: string): string {
  return `--${path.replace(/\./g, '-')}`;
}
```

---

## Token File Organization

### Decision: Scope-Based Directory Structure

**Rationale**: Separation by scope (global, brand, mode) enables clear override semantics and independent file editing.

```
tokens/
├── global/           # Shared across all brands/modes
│   ├── color.json    # Primitive colors + default semantics
│   ├── spacing.json
│   ├── typography.json
│   └── ...
├── brands/           # Brand-specific overrides
│   ├── default/
│   │   └── tokens.json
│   └── acme/
│       └── tokens.json
└── modes/            # Mode-specific overrides
    ├── light.json
    ├── dark.json
    ├── high-contrast.json
    └── reduced-motion.json
```

### Resolution Order (Cascade)

Per spec clarification:
1. `brand-mode` (e.g., `acme` + `dark`)
2. `brand-base` (e.g., `acme` defaults)
3. `global-mode` (e.g., global `dark`)
4. `global-base` (global defaults)

---

## CI Snapshot Strategy

### Decision: Deterministic Output + Git Diff

**Rationale**: Token compilation is deterministic. Checking compiled outputs into git enables simple `git diff` for PR reviews.

**Implementation**:
1. Compiler outputs to `dist/` with sorted, formatted files
2. CI runs compiler and checks for uncommitted changes
3. If changes exist, fail with diff report

```bash
# CI script
pnpm build:tokens
if ! git diff --quiet dist/; then
  echo "Token outputs changed. Run 'pnpm build:tokens' and commit."
  git diff dist/
  exit 1
fi
```

---

## Sources

- [DTCG Design Tokens Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/)
- [CSS Cascade Layers - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- [prefers-color-scheme - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [prefers-contrast - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast)
- [prefers-reduced-motion - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
