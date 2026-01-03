# Quickstart: Web Components Platform Conventions

**Feature**: 006-wc-platform
**Date**: 2026-01-02

## Overview

This feature establishes standardized conventions for Web Components in the design system:

- **DSElement**: Base class for Light DOM components
- **Component Registry**: Centralized tag-to-class mapping
- **Event Utilities**: Standardized `ds:*` event emission
- **Next.js Loader**: Single-point registration for App Router
- **Enforcement Script**: CI check for no auto-registration

## Quick Reference

### Creating a Component

```typescript
// packages/wc/src/components/card/card.ts
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { DSElement } from '../../base/ds-element.js';
import { emitEvent } from '../../events/emit.js';

export class DsCard extends DSElement {
  @property({ reflect: true })
  variant: 'default' | 'elevated' = 'default';

  private handleClick() {
    emitEvent(this, 'select', { detail: { id: this.id } });
  }

  render() {
    return html`
      <div class="ds-card ds-card--${this.variant}" @click=${this.handleClick}>
        <slot></slot>
      </div>
    `;
  }
}

// TypeScript declaration for custom element
declare global {
  interface HTMLElementTagNameMap {
    'ds-card': DsCard;
  }
}

// DO NOT add: customElements.define('ds-card', DsCard);
// Registration happens via the centralized registry
```

### Registering a Component

```typescript
// packages/wc/src/registry/registry.ts
import { DsButton } from '../components/button/button.js';
import { DsInput } from '../components/input/input.js';
import { DsCard } from '../components/card/card.js';

export const componentRegistry = {
  'ds-button': DsButton,
  'ds-input': DsInput,
  'ds-card': DsCard,
} as const;
```

### Using in Next.js

```tsx
// app/layout.tsx
import { DsLoader } from '@ds/next/loader';

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

// app/page.tsx (Server Component - works!)
export default function Page() {
  return (
    <main>
      <ds-card variant="elevated">
        <h2>Welcome</h2>
        <ds-button variant="primary">Get Started</ds-button>
      </ds-card>
    </main>
  );
}
```

### Handling Events

```tsx
// app/components/interactive.tsx
'use client';

export function InteractiveDemo() {
  const handleSelect = (e: CustomEvent) => {
    console.log('Selected:', e.detail.id);
  };

  return (
    <ds-card
      variant="default"
      // @ts-expect-error - Custom event handling
      onds:select={handleSelect}
    >
      Click me
    </ds-card>
  );
}
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Tag name | `ds-{component}` | `ds-button`, `ds-card` |
| Attribute | `lowercase-hyphen` | `is-disabled`, `variant` |
| Event | `ds:{action}` | `ds:change`, `ds:select` |
| Class | `PascalCase` | `DsButton`, `DsCard` |

## File Structure

```
packages/wc/src/
├── base/
│   └── ds-element.ts       # DSElement base class
├── registry/
│   ├── define.ts           # Registration utilities
│   └── registry.ts         # Component registry
├── events/
│   └── emit.ts             # Event helper
├── components/
│   └── {name}/
│       ├── {name}.ts       # Component class
│       └── index.ts        # Re-exports
└── index.ts                # Public API

packages/next/src/
└── loader/
    ├── element-loader.tsx  # DsLoader component
    └── register.ts         # Registration logic
```

## Checklist: Adding a New Component

1. [ ] Create component file extending `DSElement`
2. [ ] Use `@property({ reflect: true })` for attributes that CSS targets
3. [ ] Use `emitEvent()` for custom events
4. [ ] Add TypeScript declaration for `HTMLElementTagNameMap`
5. [ ] **Do NOT** call `customElements.define()` in the component file
6. [ ] Add to `componentRegistry` in `registry.ts`
7. [ ] Export from `packages/wc/src/index.ts`
8. [ ] Run `pnpm check:auto-define` to verify no side-effects

## Common Patterns

### Boolean Attributes

```typescript
@property({ type: Boolean, reflect: true })
disabled = false;
```
```html
<ds-button disabled>Can't click</ds-button>
```

### Slot Content

```typescript
render() {
  return html`
    <div class="ds-dialog">
      <header><slot name="header"></slot></header>
      <main><slot></slot></main>
      <footer><slot name="footer"></slot></footer>
    </div>
  `;
}
```

### Cancelable Events

```typescript
const event = emitEvent(this, 'before-close', { cancelable: true });
if (!event.defaultPrevented) {
  this.close();
}
```

## Troubleshooting

### Component shows as unknown element
- Ensure `DsLoader` is in your root layout
- Check browser console for registration errors
- Verify component is in `componentRegistry`

### Events not firing
- Custom events use `ds:` prefix: listen for `ds:change`, not `change`
- In React, use `addEventListener` or custom event handling

### Styles not applying
- Light DOM means global CSS applies - check specificity
- Verify @ds/css is imported in your app

### CI failing on auto-define check
- Remove `customElements.define()` calls from component files
- Registration should only happen via the registry/loader
