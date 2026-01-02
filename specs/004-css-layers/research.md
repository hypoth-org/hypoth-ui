# Research: CSS Layered Output System

**Feature**: 004-css-layers
**Date**: 2026-01-01

## Overview

Research findings for implementing CSS layers in `@ds/css`. All technical context items were resolved during specification; this document captures best practices research and implementation decisions.

---

## 1. CSS Layers Best Practices

### Decision
Use native CSS `@layer` with explicit layer order declaration at the top of the main stylesheet.

### Rationale
- CSS Cascade Layers (CSS `@layer`) are now supported in all evergreen browsers (Chrome 99+, Firefox 97+, Safari 15.4+)
- Layer order is determined by the first `@layer` statement, not by import order
- Explicit layer declaration ensures predictable cascade regardless of how files are loaded

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| PostCSS layer plugin | Adds build complexity; layers are invisible in source |
| CSS-in-JS with layer wrappers | Runtime overhead; breaks SSR benefits |
| No layers (specificity management) | Leads to `!important` wars; poor developer experience |

### Implementation Pattern
```css
/* Layer order declaration - must be first */
@layer reset, tokens, base, components, utilities, overrides;

/* Then import files into their layers */
@import "./layers/reset.css" layer(reset);
@import "./layers/tokens.css" layer(tokens);
/* etc. */
```

---

## 2. Token Layer Integration

### Decision
The `tokens` layer imports the CSS output from `@ds/tokens/css` using a relative path that PostCSS resolves at build time.

### Rationale
- `@ds/tokens` already outputs `dist/css/tokens.css` with all CSS custom properties
- No duplication of token definitions
- Changes in tokens package automatically flow to CSS package on rebuild

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| Copy tokens at build time | Creates sync issues; duplicates maintenance |
| Inline tokens in CSS | Violates single source of truth; breaks DTCG pipeline |
| Runtime token injection | Violates zero-runtime principle |

### Implementation Pattern
```css
/* tokens.css */
@import "@ds/tokens/css";
```

PostCSS with `postcss-import` resolves this during build.

---

## 3. Component Layer Strategy

### Decision
The `components` layer aggregates component styles from `@ds/wc` package, organized by component.

### Rationale
- Component styles already exist in `@ds/wc/src/components/*/component.css`
- Each component file already declares `@layer components` internally
- CSS package provides a single import point for all component styles

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| Duplicate styles in @ds/css | Sync issues; maintenance burden |
| No component layer | Components would need to be imported separately |
| Dynamic component loading | Runtime overhead; SSR complications |

### Implementation Pattern
```css
/* components.css */
@import "@ds/wc/button/button.css";
@import "@ds/wc/input/input.css";
/* etc. */
```

---

## 4. Utility Class Naming Convention

### Decision
Use `ds-` prefix with property-value pattern: `ds-{property}-{value}`.

### Rationale
- Prefix prevents collisions with other frameworks (Tailwind, Bootstrap)
- Property-value pattern is self-documenting
- Aligns with existing component class naming (`ds-button`, `ds-input`)

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| No prefix (e.g., `m-4`) | Collides with Tailwind; not unique to design system |
| BEM for utilities | Overly verbose for single-property utilities |
| Numeric scale (e.g., `ds-m-1`) | Less readable than semantic names |

### Implementation Pattern
```css
/* Spacing utilities using token values */
.ds-m-xs { margin: var(--ds-spacing-xs); }
.ds-m-sm { margin: var(--ds-spacing-sm); }
.ds-p-md { padding: var(--ds-spacing-md); }

/* Display utilities */
.ds-flex { display: flex; }
.ds-grid { display: grid; }
.ds-hidden { display: none; }

/* Text alignment */
.ds-text-left { text-align: left; }
.ds-text-center { text-align: center; }
.ds-text-right { text-align: right; }

/* Color utilities using token values */
.ds-text-primary { color: var(--ds-color-primary-default); }
.ds-bg-subtle { background-color: var(--ds-color-background-subtle); }
```

---

## 5. Tenant Override Pattern

### Decision
Tenants create a stylesheet that declares styles in the `overrides` layer, loaded after the base CSS.

### Rationale
- `overrides` layer has highest precedence by design
- Tenants can override tokens (CSS custom properties) or component styles
- No modification to base package required
- Works with any loading method (bundler, CDN, inline)

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| Build-time token substitution | Requires custom build per tenant |
| JavaScript theme provider | Runtime overhead; SSR complications |
| Separate tenant packages | Maintenance burden; versioning complexity |

### Implementation Pattern
```css
/* tenant-acme.css */
@layer overrides {
  :root {
    /* Override token values */
    --ds-color-primary-default: #ff5500;
    --ds-color-primary-hover: #e64d00;
    --ds-color-primary-foreground: #ffffff;
  }

  /* Optional: Override specific component styles */
  .ds-button--primary {
    border-radius: 0; /* Acme wants square buttons */
  }
}
```

---

## 6. Docs Renderer Integration

### Decision
Docs renderer imports `@ds/css` as base styling, then adds docs-specific styles in the `overrides` layer.

### Rationale
- Component demos render with same styles as production
- Docs chrome (navigation, layout) doesn't affect component demos
- Single source of truth for styling

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| Separate docs stylesheet | Component demos would differ from production |
| CSS Modules for docs | Adds complexity; layer approach is simpler |
| Inline docs styles | Hard to maintain; no cascade control |

### Implementation Pattern
```css
/* docs-renderer-next/styles/globals.css */
@import "@ds/css";

@layer overrides {
  .docs-layout { /* docs-specific layout */ }
  .docs-sidebar { /* docs-specific sidebar */ }
  /* etc. */
}
```

---

## 7. Build Output Configuration

### Decision
Use PostCSS with `postcss-import` for import resolution and `cssnano` for minification.

### Rationale
- PostCSS is already a dev dependency
- `postcss-import` handles `@import` flattening correctly with layers
- `cssnano` provides production-ready minification
- No additional runtime dependencies

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| Sass/SCSS | Adds preprocessor complexity; CSS layers are native |
| LightningCSS | Less mature PostCSS plugin ecosystem |
| No processing | Unminified output; `@import` chains slow in dev |

### Implementation Pattern
```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-import'),
    ...(process.env.NODE_ENV === 'production' ? [require('cssnano')] : [])
  ]
};
```

---

## Summary

All research items resolved. Key decisions:

| Area | Decision |
|------|----------|
| Layer syntax | Native CSS `@layer` with explicit order |
| Token integration | Import from `@ds/tokens/css` |
| Component styles | Aggregate from `@ds/wc` |
| Utility naming | `ds-{property}-{value}` pattern |
| Tenant overrides | Stylesheet with `@layer overrides` |
| Docs integration | Import base, add docs styles in overrides |
| Build tooling | PostCSS + postcss-import + cssnano |

No unresolved clarifications. Ready for Phase 1: Design & Contracts.
