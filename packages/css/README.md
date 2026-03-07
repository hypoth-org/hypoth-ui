# @hypoth-ui/css

CSS layers and base styles for the hypoth-ui design system. Provides a structured CSS foundation using native `@layer` for reset, tokens, base styles, component styles, utilities, and overrides.

## Installation

```bash
npm install @hypoth-ui/css
```

## Usage

### Full Bundle

```typescript
import '@hypoth-ui/css';
```

Or in HTML:

```html
<link rel="stylesheet" href="node_modules/@hypoth-ui/css/dist/index.css">
```

### Individual Layers

```typescript
import '@hypoth-ui/css/layers/reset';
import '@hypoth-ui/css/layers/tokens';
import '@hypoth-ui/css/layers/base';
import '@hypoth-ui/css/layers/components';
import '@hypoth-ui/css/layers/utilities';
import '@hypoth-ui/css/layers/overrides';
```

## CSS Layer Order

The layers are ordered from lowest to highest specificity:

1. `reset` -- Browser reset / normalize
2. `tokens` -- Design token custom properties
3. `base` -- Base element styles
4. `components` -- Component styles
5. `utilities` -- Utility classes
6. `overrides` -- Consumer overrides (highest priority)

## Documentation

See the [main README](../../README.md) for full documentation and architecture overview.

## License

MIT
