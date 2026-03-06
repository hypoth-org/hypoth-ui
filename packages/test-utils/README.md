# @hypoth-ui/test-utils

![Alpha](https://img.shields.io/badge/status-alpha-orange)

Shared test utilities for the hypoth-ui design system. Provides helpers for rendering, querying, and asserting on Web Components and React adapters in Vitest.

## Installation

```bash
npm install @hypoth-ui/test-utils --save-dev
```

## Usage

```typescript
import { renderWc, renderReact, waitForElement } from '@hypoth-ui/test-utils';

// Render a Web Component for testing
const el = await renderWc('<ds-button variant="primary">Click</ds-button>');

// Render a React adapter for testing
const { getByRole } = renderReact(<Button variant="primary">Click</Button>);

// Wait for a custom element to be defined
await waitForElement('ds-button');
```

## Documentation

See the [main README](../../README.md) for full documentation and architecture overview.

## License

MIT
