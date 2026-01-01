# Quickstart: Hypoth UI Design System

**Feature**: 001-design-system
**Date**: 2026-01-01

## Overview

This guide covers the essential steps to set up and use the Hypoth UI design system in your project.

---

## Prerequisites

- Node.js 20+
- pnpm 8+ (required by constitution)

---

## Installation

### 1. Install Packages

```bash
# Foundation (always needed)
pnpm add @ds/tokens @ds/css

# Web Components
pnpm add @ds/wc

# React adapter (optional)
pnpm add @ds/react

# Next.js integration (optional)
pnpm add @ds/next
```

### 2. Import CSS

Add to your app's entry point (e.g., `app/layout.tsx` or `styles/global.css`):

```css
/* Import tokens (CSS custom properties) */
@import '@ds/tokens/css';

/* Import base styles (reset, layers, base element styles) */
@import '@ds/css';
```

---

## Usage

### Vanilla HTML / Any Framework

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/@ds/tokens/dist/css/tokens.css">
  <link rel="stylesheet" href="node_modules/@ds/css/dist/index.css">
  <script type="module" src="node_modules/@ds/wc/dist/index.js"></script>
</head>
<body>
  <ds-button variant="primary">Click me</ds-button>
</body>
</html>
```

### Next.js App Router

**1. Create the element loader (once):**

```tsx
// components/ds-loader.tsx
'use client';

import { useEffect } from 'react';
import { registerAllElements } from '@ds/next/loader';

export function DsLoader() {
  useEffect(() => {
    registerAllElements();
  }, []);
  return null;
}
```

**2. Add to root layout:**

```tsx
// app/layout.tsx
import '@ds/tokens/css';
import '@ds/css';
import { DsLoader } from '@/components/ds-loader';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <DsLoader />
        {children}
      </body>
    </html>
  );
}
```

**3. Use components anywhere:**

```tsx
// app/page.tsx (Server Component)
export default function Page() {
  return (
    <main>
      <h1>Welcome</h1>
      <ds-button variant="primary">Get Started</ds-button>
    </main>
  );
}
```

### React (without Next.js)

```tsx
import '@ds/tokens/css';
import '@ds/css';
import { Button, Input } from '@ds/react';

function App() {
  return (
    <div>
      <Button variant="primary" onClick={() => alert('Clicked!')}>
        Click me
      </Button>
      <Input placeholder="Enter text..." />
    </div>
  );
}
```

---

## Theming

### Custom Brand Tokens

Create a custom token file in DTCG format:

```json
// tokens/brand.json
{
  "color": {
    "primary": {
      "$value": "#FF6B35",
      "$type": "color"
    },
    "secondary": {
      "$value": "#4ECDC4",
      "$type": "color"
    }
  }
}
```

Compile and import your custom tokens after the base tokens:

```css
@import '@ds/tokens/css';
@import './tokens/brand.css'; /* Your compiled brand tokens */
@import '@ds/css';
```

### Dark Mode

The design system respects `prefers-color-scheme` by default:

```css
/* Automatic mode switching */
@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode tokens applied automatically */
  }
}
```

For manual control:

```css
/* Force dark mode */
html[data-theme="dark"] {
  color-scheme: dark;
}
```

### High Contrast Mode

```css
@media (prefers-contrast: more) {
  :root {
    /* High contrast tokens applied automatically */
  }
}
```

---

## Customizing Components

### CSS Layer Overrides

Use the `overrides` layer for customizations:

```css
@layer overrides {
  .ds-button--primary {
    --ds-button-bg: var(--brand-primary);
    --ds-button-text: var(--brand-on-primary);
  }
}
```

### CSS Custom Properties

Components expose customization via CSS custom properties:

```css
ds-button {
  --ds-button-padding-x: 24px;
  --ds-button-border-radius: 8px;
}
```

---

## TypeScript Support

All packages include TypeScript declarations:

```typescript
// Type-safe token access
import { color, spacing } from '@ds/tokens';

console.log(color.primary); // '#0066CC'
console.log(spacing.md);    // '16px'
```

```typescript
// React component props are fully typed
import { Button, type ButtonProps } from '@ds/react';

const props: ButtonProps = {
  variant: 'primary',
  disabled: false,
  onClick: () => {},
};
```

---

## Verification

After setup, verify the installation:

1. **Tokens loaded**: Check DevTools for `--ds-*` CSS custom properties on `:root`
2. **Components render**: `<ds-button>` should appear styled
3. **Dark mode works**: Toggle system preference and verify colors change
4. **No console errors**: No `customElements` registration errors

---

## Next Steps

- Read the full [Component Documentation](#) for all available components
- Learn about [Theming](#) for advanced customization
- See [Accessibility](#) guidelines for WCAG compliance
- Explore [Examples](#) for common patterns
