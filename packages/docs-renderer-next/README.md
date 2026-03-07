# @hypoth-ui/docs-renderer-next

Next.js-based documentation site renderer for the hypoth-ui design system. Renders MDX content packs with edition filtering, tenant branding, search, and live component previews.

## Installation

```bash
npm install @hypoth-ui/docs-renderer-next
```

> **Note:** This is primarily an internal package used to build the documentation site.

## Usage

### Import Components

```typescript
import { NavSidebar } from '@hypoth-ui/docs-renderer-next/components/nav-sidebar';
import { MdxRenderer } from '@hypoth-ui/docs-renderer-next/components/mdx-renderer';
```

### Import Styles

```typescript
import '@hypoth-ui/docs-renderer-next/styles/globals.css';
```

### Run the Docs Site

```bash
pnpm --filter @ds/docs-app dev:core        # Core edition
pnpm --filter @ds/docs-app dev:pro         # Pro edition
pnpm --filter @ds/docs-app dev:enterprise  # Enterprise edition
```

## Documentation

See the [main README](../../README.md) for full documentation and architecture overview.

## License

MIT
