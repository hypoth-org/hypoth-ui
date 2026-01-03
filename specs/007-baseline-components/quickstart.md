# Quickstart: Baseline Web Components

**Feature**: 007-baseline-components
**Date**: 2026-01-03

## Prerequisites

Before implementing, ensure you have:

1. **Development Environment**
   - Node.js 18+
   - pnpm 8+
   - TypeScript 5.3+

2. **Existing Infrastructure**
   - `@ds/wc` package with `DSElement` base class
   - `@ds/tokens` package with CSS custom properties
   - `@ds/css` package with layer structure
   - `@ds/docs-core` package with manifest validation

3. **Dependencies to Add**
   ```bash
   pnpm --filter @ds/wc add lucide@^0.468.0
   ```

## Component Implementation Pattern

Each component follows this structure:

```typescript
// packages/wc/src/components/{name}/{name}.ts
import { html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { DSElement } from '../../base/ds-element.js';
import { define } from '../../registry/define.js';
import { emitEvent, StandardEvents } from '../../events/emit.js';

export class DsComponentName extends DSElement {
  @property({ type: String, reflect: true })
  variant: VariantType = 'default';

  override render() {
    return html`
      <element class="ds-component-name ds-component-name--${this.variant}">
        <slot></slot>
      </element>
    `;
  }
}

define('ds-component-name', DsComponentName);
```

## File Checklist Per Component

For each of the 6 components, create:

- [ ] `packages/wc/src/components/{name}/{name}.ts` - Component class
- [ ] `packages/wc/src/components/{name}/{name}.css` - Styles in `@layer components`
- [ ] `packages/wc/src/components/{name}/manifest.json` - Accessibility metadata
- [ ] `packages/docs-content/components/{name}.mdx` - Documentation page
- [ ] `packages/wc/src/components/{name}/{name}.test.ts` - Unit tests
- [ ] `packages/wc/src/components/{name}/{name}.a11y.test.ts` - A11y tests

## Key Implementation Notes

### Light DOM Rendering

All components use Light DOM via `DSElement`:

```typescript
export class DSElement extends LitElement {
  protected override createRenderRoot(): HTMLElement {
    return this;  // Light DOM - no Shadow DOM
  }
}
```

### Token Consumption

Use CSS custom properties from the token system:

```css
@layer components {
  .ds-button {
    padding: var(--ds-spacing-sm) var(--ds-spacing-md);
    background: var(--ds-color-primary-default);
    border-radius: var(--ds-radius-md);
  }
}
```

### Event Emission

Use the standardized event utilities:

```typescript
import { emitEvent, StandardEvents } from '../../events/emit.js';

// In component method:
emitEvent(this, StandardEvents.CLICK, {
  detail: { originalEvent: event },
});
```

### Manifest Validation

Run validation before committing:

```bash
pnpm --filter @ds/docs-core validate --strict
```

## Testing Commands

```bash
# Run all tests
pnpm --filter @ds/wc test

# Run unit tests only
pnpm --filter @ds/wc test:unit

# Run a11y tests only
pnpm --filter @ds/wc test:a11y

# Type checking
pnpm --filter @ds/wc typecheck
```

## Implementation Order (Recommended)

1. **Button** - Existing, may need updates for loading state
2. **VisuallyHidden** - Simplest, no events, pure CSS
3. **Spinner** - Used by Button loading state
4. **Text** - Non-interactive, dynamic element rendering
5. **Link** - Interactive, external link handling
6. **Icon** - Requires Lucide adapter integration

## Common Patterns

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .ds-spinner {
    animation: ds-pulse 2s ease-in-out infinite;
  }
}
```

### Disabled State Handling

```typescript
private handleClick(event: MouseEvent): void {
  if (this.disabled || this.loading) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  // ... emit event
}
```

### ARIA Attributes

```typescript
override render() {
  return html`
    <button
      ?disabled=${this.disabled}
      aria-disabled=${this.disabled || this.loading}
      aria-busy=${this.loading}
    >
      <slot></slot>
    </button>
  `;
}
```

## Documentation Template

Each MDX doc page should include:

1. **Overview** - Component purpose and when to use
2. **Examples** - At least 3 usage examples
3. **API Reference** - Attributes, events, slots
4. **Accessibility** - Keyboard and screen reader behavior
5. **Anti-patterns** - At least 2 things NOT to do
6. **Related Components** - Links to related docs
