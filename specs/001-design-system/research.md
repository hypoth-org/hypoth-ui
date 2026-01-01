# Research: White-Label Design System Architecture

**Feature**: 001-design-system
**Date**: 2026-01-01

## Summary

This document consolidates research findings for key architectural decisions in the design system monorepo. All decisions align with the constitution principles: Performance > Accessibility > Customizability.

---

## 1. Lit 3.x Light DOM Pattern

### Decision
Use Lit 3.x with Light DOM (no Shadow DOM) for all Web Components.

### Rationale
- **Full CSS customizability**: Consumers can style any element with external CSS
- **CSS layers compatibility**: Works naturally with `@layer` cascade control
- **Better a11y tool support**: Standard DOM structure is more reliable with screen readers
- **Simpler debugging**: Visible DOM without shadow boundaries
- **SSR-friendly**: No Declarative Shadow DOM complexity; streams as plain HTML

### Implementation Pattern

```typescript
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ds-button')
export class DsButton extends LitElement {
  @property({ type: String }) variant = 'primary';

  // Disable Shadow DOM - render to Light DOM
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <button class="ds-button ds-button--${this.variant}">
        <slot></slot>
      </button>
    `;
  }
}

// TypeScript global registration
declare global {
  interface HTMLElementTagNameMap {
    'ds-button': DsButton;
  }
}
```

### Style Management
- `static styles` does NOT work with Light DOM - styles must be external
- Use Constructable Stylesheets for efficient style injection:
  ```typescript
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(buttonStyles);
  document.adoptedStyleSheets.push(sheet);
  ```
- Alternative: Import component CSS from `@ds/css` package (preferred for this project)

### Limitations Acknowledged
- No automatic style isolation (mitigated by CSS layers + BEM naming)
- `<slot>` behavior differs from Shadow DOM (render content in-place)
- CSS variables inherit through component boundaries (desired behavior for theming)

### Alternatives Considered
1. **Shadow DOM + ::part()**: Rejected due to limited customizability
2. **Hybrid approach**: Rejected due to inconsistent developer experience

---

## 2. DTCG Token Pipeline with Style Dictionary

### Decision
Use DTCG format as token source of truth; compile with Style Dictionary 4.x.

### Rationale
- **W3C-backed standard**: DTCG reached stable version (October 2025)
- **Vendor agnostic**: Works with Figma, Tokens Studio, and custom tools
- **Style Dictionary 4.x native support**: Minimal configuration required
- **Zero runtime deps**: Build-time only transformation

### Token Organization

```
packages/tokens/src/tokens/
├── primitives/
│   ├── colors.json       # Raw color palette (blue.500, neutral.900)
│   ├── spacing.json      # Base units (4px, 8px, 16px...)
│   ├── typography.json   # Font families, weights, sizes
│   └── shadows.json      # Shadow definitions
├── semantic/
│   ├── colors.json       # Purpose-driven (primary, secondary, error)
│   ├── spacing.json      # Named scales (xs, sm, md, lg, xl)
│   └── typography.json   # Composites (heading-1, body, caption)
└── modes/
    ├── light.json        # Light mode overrides
    ├── dark.json         # Dark mode overrides
    └── high-contrast.json
```

### DTCG Format Example

```json
{
  "color": {
    "primary": {
      "$value": "#0066CC",
      "$type": "color",
      "$description": "Primary brand color for CTAs and emphasis"
    },
    "neutral": {
      "50": {
        "$value": "#FAFAFA",
        "$type": "color"
      },
      "900": {
        "$value": "#1A1A1A",
        "$type": "color"
      }
    }
  },
  "spacing": {
    "base": {
      "$value": "8px",
      "$type": "dimension",
      "$description": "Base spacing unit"
    }
  }
}
```

### Style Dictionary Configuration

```javascript
// packages/tokens/style-dictionary.config.js
import StyleDictionary from 'style-dictionary';

export default {
  source: ['src/tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
        options: {
          outputReferences: true
        }
      }]
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'dist/ts/',
      files: [{
        destination: 'tokens.ts',
        format: 'typescript/es6-declarations'
      }]
    }
  }
};
```

### Output Examples

**CSS Custom Properties:**
```css
:root {
  --ds-color-primary: #0066CC;
  --ds-color-neutral-50: #FAFAFA;
  --ds-color-neutral-900: #1A1A1A;
  --ds-spacing-base: 8px;
  --ds-spacing-md: 16px;
}
```

**TypeScript Constants:**
```typescript
export const color = {
  primary: '#0066CC',
  neutral: {
    50: '#FAFAFA',
    900: '#1A1A1A'
  }
} as const;
```

### Alternatives Considered
1. **Tailwind config as source**: Rejected - not DTCG compliant, couples to Tailwind
2. **CSS-only (no TypeScript output)**: Rejected - TypeScript types enable editor autocomplete

---

## 3. Next.js App Router Integration

### Decision
Single root client loader pattern with custom elements rendering as HTML tags in Server Components.

### Rationale
- **Minimal client boundaries**: Only one `'use client'` component at root
- **SSR/streaming compatible**: Custom elements stream as plain HTML
- **No hydration issues**: Guard checks prevent double-registration
- **Aligns with App Router philosophy**: Server Components by default

### Architecture

```
app/layout.tsx (Server Component)
├── import '@ds/css' (CSS streams with HTML)
├── import '@ds/tokens/css' (tokens available immediately)
└── <DsElementLoader /> (Client Component - single 'use client' boundary)
    └── Registers all custom elements once
```

### Element Loader Implementation

```typescript
// packages/next/src/loader/element-loader.tsx
'use client';

import { useEffect } from 'react';

// Import all component definitions
import { DsButton } from '@ds/wc/button';
import { DsInput } from '@ds/wc/input';
// ...

const elements = [
  { tagName: 'ds-button', constructor: DsButton },
  { tagName: 'ds-input', constructor: DsInput },
  // ...
];

export function DsElementLoader() {
  useEffect(() => {
    elements.forEach(({ tagName, constructor }) => {
      if (!customElements.get(tagName)) {
        customElements.define(tagName, constructor);
      }
    });
  }, []);

  return null; // No visual output
}
```

### Usage in Server Components

```tsx
// app/page.tsx (Server Component - no 'use client')
export default function Page() {
  return (
    <main>
      <h1>Welcome</h1>
      {/* Renders as plain <ds-button> HTML tag */}
      <ds-button variant="primary">Click me</ds-button>
    </main>
  );
}
```

### Hydration Flow
1. Server renders `<ds-button>` as plain HTML tag
2. HTML streams to client immediately
3. `DsElementLoader` runs once in root layout
4. `customElements.define()` upgrades all matching tags
5. Components become interactive

### Guard Against Double-Registration

```typescript
// Essential for dynamic imports and navigation
if (!customElements.get(tagName)) {
  customElements.define(tagName, constructor);
}
```

### Alternatives Considered
1. **Per-component dynamic imports**: Rejected - too many client boundaries
2. **Blocking script in head**: Rejected - delays Time-to-First-Byte
3. **Declarative Shadow DOM**: Rejected - adds complexity, limited browser support

---

## 4. CSS Layers Architecture

### Decision
Six-layer CSS architecture for predictable cascade control.

### Layer Order (Low to High Specificity)

```css
@layer reset, tokens, base, components, utilities, overrides;
```

| Layer | Purpose | Who Writes |
|-------|---------|------------|
| `reset` | CSS reset / normalize | Design system |
| `tokens` | CSS custom properties | Design system |
| `base` | Element defaults (h1, p, a) | Design system |
| `components` | Component styles | Design system |
| `utilities` | Utility classes | Design system |
| `overrides` | Consumer customizations | Consumer |

### Entry Point

```css
/* packages/css/src/index.css */
@layer reset, tokens, base, components, utilities, overrides;

@import './layers/reset.css' layer(reset);
@import './layers/tokens.css' layer(tokens);
@import './layers/base.css' layer(base);
@import './layers/components.css' layer(components);
@import './layers/utilities.css' layer(utilities);
/* overrides layer is empty - for consumer use */
```

### Consumer Override Pattern

```css
/* Consumer's app.css */
@import '@ds/css';

@layer overrides {
  .ds-button--primary {
    --ds-button-bg: var(--brand-blue);
  }
}
```

---

## 5. Tooling Decisions

### Build Tools

| Tool | Purpose | Justification |
|------|---------|---------------|
| pnpm | Package manager | Disk efficient, workspace support, constitution mandate |
| tsup | TypeScript bundler | Zero-config, ESM-first, tree-shaking |
| Style Dictionary | Token compiler | DTCG native support, zero runtime |
| PostCSS | CSS processing | Layer support, minification, no runtime |
| Vitest | Testing | Fast, ESM-native, watch mode |
| Playwright | E2E/a11y | Cross-browser, axe-core integration |

### Version Targets

| Dependency | Version | Notes |
|------------|---------|-------|
| TypeScript | 5.x | Strict mode, ESM |
| Lit | 3.x | Light DOM support |
| React | 18+ | Peer dependency |
| Next.js | 14+ | App Router, streaming |
| Node.js | 20+ | Build tooling only |

---

## Key Takeaways

1. **Light DOM is the right choice** for maximum customizability and SSR compatibility
2. **DTCG + Style Dictionary** provides a mature, standards-based token pipeline
3. **Single root loader pattern** minimizes client JavaScript in Next.js
4. **CSS layers** solve cascade conflicts without specificity wars
5. **Zero runtime deps in foundation** is achievable with build-time tooling
