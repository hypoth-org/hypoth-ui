# Contracts: Docs Renderer v1

This directory contains JSON Schema contracts for the docs renderer feature.

## Schemas

### edition-config-extended.schema.json

Extended edition configuration schema that includes:
- Content pack configuration
- Component visibility overrides
- Branding customization
- Feature toggles
- Upgrade prompt configuration

**Usage**: Place as `edition-config.json` at docs app root or in tenant content pack.

### search-index.schema.json

Schema for the build-time generated search index:
- Version tracking for compatibility
- Indexed content entries with metadata
- Facets for filtering (categories, types, tags)

**Usage**: Generated to `public/search-index.json` at build time.

### content-pack.schema.json

Schema for content pack package.json configuration:
- Pack type (base vs overlay)
- Directory structure configuration
- Package exports pattern

**Usage**: Extend in package.json of content pack packages.

## Validation

These schemas can be used with Ajv for runtime validation:

```typescript
import { getEditionConfigValidator } from '@ds/docs-core';

const validate = getEditionConfigValidator();
const isValid = validate(config);
if (!isValid) {
  console.error(validate.errors);
}
```

## IDE Support

Add `$schema` property to your configuration files for IDE auto-completion:

```json
{
  "$schema": "./node_modules/@ds/docs-core/schemas/edition-config-extended.schema.json",
  "id": "my-tenant",
  "name": "My Tenant",
  "edition": "pro"
}
```
