# Quickstart: CSS Layered Output System

**Feature**: 004-css-layers
**Date**: 2026-01-01

## Prerequisites

- Node.js 18+
- pnpm 8+
- Existing hypoth-ui monorepo setup

---

## 1. Basic Usage

### Install

The `@ds/css` package is included in the monorepo. For external consumers:

```bash
pnpm add @ds/css
```

### Import in CSS

```css
@import "@ds/css";
```

### Import in Next.js

```typescript
// app/layout.tsx
import "@ds/css";
```

### Import in HTML

```html
<link rel="stylesheet" href="node_modules/@ds/css/dist/index.css">
```

---

## 2. Using Components

Components are styled via CSS classes:

```html
<!-- Button component -->
<ds-button variant="primary" size="md">
  Click me
</ds-button>

<!-- The button element receives these classes automatically -->
<!-- .ds-button .ds-button--primary .ds-button--md -->
```

---

## 3. Using Utility Classes

Apply utility classes for quick styling:

```html
<!-- Spacing utilities -->
<div class="ds-p-md ds-mb-lg">
  Content with padding and margin
</div>

<!-- Display utilities -->
<div class="ds-flex ds-gap-md">
  <span>Item 1</span>
  <span>Item 2</span>
</div>

<!-- Text utilities -->
<p class="ds-text-center ds-text-muted">
  Centered, muted text
</p>
```

---

## 4. Customizing with Overrides

### Create Override File

```css
/* styles/overrides.css */
@layer overrides {
  :root {
    /* Change primary color */
    --ds-color-primary-default: #8b5cf6;
  }

  /* Customize a component */
  .ds-button--primary {
    border-radius: 9999px; /* Pill shape */
  }
}
```

### Import After Base

```css
@import "@ds/css";
@import "./overrides.css";
```

---

## 5. Tenant Branding

### Create Tenant Stylesheet

```css
/* styles/tenant-acme.css */
@layer overrides {
  :root {
    --ds-color-primary-default: #ff5500;
    --ds-color-primary-hover: #e64d00;
  }
}
```

### Conditional Loading

```typescript
// app/layout.tsx
import "@ds/css";

// Load tenant stylesheet conditionally
if (process.env.TENANT === "acme") {
  import("./tenant-acme.css");
}
```

---

## 6. Dark Mode

Dark mode works automatically via CSS custom properties:

```html
<!-- Light mode (default) -->
<html data-mode="light">

<!-- Dark mode -->
<html data-mode="dark">
```

Toggle with JavaScript:

```typescript
document.documentElement.dataset.mode = "dark";
```

---

## 7. Development Workflow

### Build CSS

```bash
pnpm --filter @ds/css build
```

### Watch Mode

```bash
pnpm --filter @ds/css build --watch
```

### Test Layer Structure

```bash
pnpm --filter @ds/css test
```

---

## 8. Layer Reference

| Layer | Purpose | Customizable |
|-------|---------|--------------|
| `reset` | Browser normalization | No |
| `tokens` | Design token variables | Via token overrides |
| `base` | HTML element styles | No |
| `components` | Component styles | Via overrides layer |
| `utilities` | Utility classes | No |
| `overrides` | Your customizations | Yes |

---

## 9. Common Patterns

### Override Token Only

```css
@layer overrides {
  :root {
    --ds-color-primary-default: #your-color;
  }
}
```

### Override Specific Component

```css
@layer overrides {
  .ds-button--primary {
    /* your styles */
  }
}
```

### Add Custom Utility

```css
@layer overrides {
  .ds-custom-shadow {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}
```

---

## 10. Troubleshooting

### Styles Not Applied

1. Check import order - `@ds/css` must come first
2. Verify layer wrapper - overrides need `@layer overrides { }`
3. Check browser support - requires Chrome 99+, Firefox 97+, Safari 15.4+

### Override Not Working

1. Ensure override is in `@layer overrides`
2. Check selector matches base selector
3. Don't use `!important` - layer precedence handles it

### Build Errors

1. Run `pnpm install` to ensure dependencies
2. Check PostCSS config exists
3. Verify `@ds/tokens` is built first

---

## Next Steps

- Read [Layer API Contract](./contracts/layer-api.md) for full API reference
- Read [Tenant Override Contract](./contracts/tenant-override.md) for branding guide
- See [Styling Guidelines](/docs/guides/styling-guidelines) for best practices
