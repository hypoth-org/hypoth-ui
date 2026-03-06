# @hypoth-ui/docs-content

![Alpha](https://img.shields.io/badge/status-alpha-orange)

Documentation content packs for the hypoth-ui design system. Contains component manifests, MDX documentation files, and edition configuration used by the docs renderer.

## Installation

```bash
npm install @hypoth-ui/docs-content
```

> **Note:** This is primarily an internal package consumed by `@hypoth-ui/docs-renderer-next`.

## Usage

### Access Manifests

```typescript
import manifest from '@hypoth-ui/docs-content/manifests/button.json';
```

### Access MDX Content

```typescript
import content from '@hypoth-ui/docs-content/components/button.mdx';
```

### Access Edition Configuration

```typescript
import edition from '@hypoth-ui/docs-content/editions/core.json';
```

## Structure

```
docs-content/
  manifests/      # Component manifest.json files
  components/     # Component documentation (MDX)
  guides/         # Guide documentation (MDX)
  editions/       # Edition configuration files
```

## Documentation

See the [main README](../../README.md) for full documentation and architecture overview.

## License

MIT
