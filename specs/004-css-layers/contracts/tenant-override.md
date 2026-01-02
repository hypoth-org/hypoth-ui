# Tenant Override Contract

**Package**: `@ds/css`
**Version**: 0.1.0
**Date**: 2026-01-01

## Overview

This document defines the contract for tenant (white-label) override stylesheets. Tenants use this pattern to customize the design system for their brand.

---

## File Structure

### Tenant Stylesheet Template

```css
/**
 * Tenant Override Stylesheet
 * Tenant: [TENANT_NAME]
 * Version: [VERSION]
 * Based on: @ds/css [BASE_VERSION]
 */

@layer overrides {
  /* Section 1: Token Overrides */
  :root {
    /* Color tokens */
    --ds-color-primary-default: [VALUE];
    --ds-color-primary-hover: [VALUE];
    --ds-color-primary-active: [VALUE];
    --ds-color-primary-foreground: [VALUE];

    /* Additional token overrides as needed */
  }

  /* Section 2: Component Overrides (optional) */
  /* Only include if component styling differs from token changes */

  /* Section 3: Custom Utilities (optional) */
  /* Only include if tenant needs additional utilities */
}
```

---

## Token Override Categories

### Recommended Overrides

These tokens are designed for brand customization:

| Token | Purpose | Default |
|-------|---------|---------|
| `--ds-color-primary-default` | Primary brand color | `#0066cc` |
| `--ds-color-primary-hover` | Primary hover state | `#0052a3` |
| `--ds-color-primary-active` | Primary active state | `#003d7a` |
| `--ds-color-primary-foreground` | Text on primary | `#ffffff` |
| `--ds-font-family-sans` | Primary font family | `system-ui` |
| `--ds-font-family-mono` | Monospace font family | `monospace` |
| `--ds-radius-sm` | Small border radius | `4px` |
| `--ds-radius-md` | Medium border radius | `6px` |
| `--ds-radius-lg` | Large border radius | `8px` |

### Advanced Overrides

These tokens affect broader styling and should be changed with care:

| Token | Purpose | Impact |
|-------|---------|--------|
| `--ds-color-background-*` | Background colors | Affects all surfaces |
| `--ds-color-foreground-*` | Text colors | Affects all text |
| `--ds-spacing-*` | Spacing scale | Affects all layouts |
| `--ds-font-size-*` | Type scale | Affects all text |

---

## Component Override Guidelines

### When to Override Components

Override component styles only when:
1. Token changes don't achieve the desired result
2. Structural changes are needed (border-radius, shadows)
3. Tenant brand guidelines require specific treatment

### Override Pattern

```css
@layer overrides {
  /* Target base class */
  .ds-button {
    border-radius: 0; /* Example: square buttons */
  }

  /* Target variants if needed */
  .ds-button--primary {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}
```

### What NOT to Override

- **Internal element classes** (e.g., `.ds-button__content`) - these are implementation details
- **State classes** (e.g., `:disabled`, `:focus-visible`) - maintain accessibility
- **Animation keyframes** - may break reduced-motion support

---

## Loading Order

### Required Order

```
1. @ds/css (base package)
2. tenant-[name].css (tenant overrides)
3. app-specific.css (optional app overrides)
```

### In CSS

```css
@import "@ds/css";
@import "./tenant-acme.css";
```

### In HTML

```html
<link rel="stylesheet" href="/css/ds.css">
<link rel="stylesheet" href="/css/tenant-acme.css">
```

### In Next.js

```typescript
// app/layout.tsx
import "@ds/css";
import "./tenant-acme.css";
```

---

## Example: Tenant Acme

Complete example tenant stylesheet:

```css
/**
 * Tenant Override Stylesheet
 * Tenant: Acme Corporation
 * Version: 1.0.0
 * Based on: @ds/css 0.1.0
 */

@layer overrides {
  /* Token Overrides */
  :root {
    /* Acme brand orange */
    --ds-color-primary-default: #ff5500;
    --ds-color-primary-hover: #e64d00;
    --ds-color-primary-active: #cc4400;
    --ds-color-primary-foreground: #ffffff;

    /* Acme prefers sharp corners */
    --ds-radius-sm: 0;
    --ds-radius-md: 0;
    --ds-radius-lg: 2px;

    /* Acme brand fonts */
    --ds-font-family-sans: "Acme Sans", system-ui, sans-serif;
  }

  /* Component Overrides */
  .ds-button {
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}
```

---

## Validation Checklist

Before deploying a tenant stylesheet:

- [ ] All overrides wrapped in `@layer overrides { }`
- [ ] Token overrides target `:root` selector
- [ ] No `!important` declarations used
- [ ] Tested with light and dark modes
- [ ] Tested with high-contrast mode
- [ ] No accessibility regressions (color contrast, focus states)
- [ ] Tested in all supported browsers

---

## Version Compatibility

| Base Version | Override Compatibility |
|--------------|------------------------|
| 0.x.x | May break between minor versions |
| 1.x.x | Compatible within major version |
| 2.x.x+ | Follow semver guarantees |

### Upgrade Path

When upgrading `@ds/css`:

1. Review changelog for token or class changes
2. Update tenant stylesheet if needed
3. Test all components with tenant override
4. Deploy tenant stylesheet update with base update
