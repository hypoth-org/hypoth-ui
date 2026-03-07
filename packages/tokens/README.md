# @hypoth-ui/tokens

DTCG-compliant design tokens for the hypoth-ui design system. Provides CSS custom properties, JSON, and TypeScript constants for colors, spacing, typography, and more.

## Installation

```bash
npm install @hypoth-ui/tokens
```

## Usage

### CSS Custom Properties

```css
@import '@hypoth-ui/tokens/css';

.my-element {
  color: var(--ds-color-primary);
  padding: var(--ds-spacing-md);
  font-size: var(--ds-font-size-base);
}
```

### TypeScript Constants

```typescript
import { tokens } from '@hypoth-ui/tokens';

console.log(tokens.color.primary); // resolved token value
```

### JSON

```typescript
import tokenData from '@hypoth-ui/tokens/json';
```

## Documentation

See the [main README](../../README.md) for full documentation and architecture overview.

## License

MIT
