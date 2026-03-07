# @hypoth-ui/docs-core

Internal documentation engine and validation tooling for the hypoth-ui design system. Handles manifest validation, edition filtering, search indexing, and component auditing.

## Installation

```bash
npm install @hypoth-ui/docs-core
```

> **Note:** This is primarily an internal tooling package used by the documentation site and CI pipelines.

## Usage

### Validate Manifests and Documentation

```bash
pnpm --filter @hypoth-ui/docs-core validate
pnpm --filter @hypoth-ui/docs-core validate --strict
```

### Audit Components

```bash
pnpm --filter @hypoth-ui/docs-core audit:components
pnpm --filter @hypoth-ui/docs-core audit:components --json
pnpm --filter @hypoth-ui/docs-core audit:components --markdown
```

### Build Edition Map

```bash
pnpm --filter @hypoth-ui/docs-core build:edition-map
```

### Programmatic API

```typescript
import { validateManifests, buildEditionMap } from '@hypoth-ui/docs-core';

const result = await validateManifests({ strict: true });
const editionMap = await buildEditionMap('core');
```

## Documentation

See the [main README](../../README.md) for full documentation and architecture overview.

## License

MIT
