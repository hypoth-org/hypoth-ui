# Research: Component & Documentation Contracts

**Branch**: `002-component-docs-contracts` | **Date**: 2026-01-01

## 1. Ajv JSON Schema Validation (TypeScript Integration)

### Decision
Use **Ajv 8.x with `JSONSchemaType<T>`** for compile-time type safety combined with runtime validation. Compile schemas once at build startup and reuse cached validators. Use **ajv-errors** plugin for custom error messages.

### Rationale
- **Type Guards**: Compiled validation functions act as type guards that narrow types after successful validation
- **Performance**: Ajv is the fastest JSON Schema validator (compilation slow, validation fast)
- **Caching**: Single Ajv instance across the application to maximize cache reuse
- **Error Messages**: ajv-errors plugin provides custom, user-friendly error messages

### TypeScript Integration Pattern
```typescript
import Ajv, { JSONSchemaType } from 'ajv';
import ajvErrors from 'ajv-errors';

const ajv = new Ajv({ allErrors: true, removeAdditional: true, useDefaults: true });
ajvErrors(ajv);

const schema: JSONSchemaType<ComponentManifest> = { /* ... */ };
const validateManifest = ajv.compile(schema); // Compile once

if (validateManifest(data)) {
  // data is now typed as ComponentManifest
}
```

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| Zod | No JSON Schema output for IDE integration; slower runtime |
| TypeBox | Less mature; Ajv is more battle-tested |
| io-ts | Steeper learning curve; less ecosystem support |

---

## 2. JSON Schema for IDE Autocomplete

### Decision
Use a **dual approach**: embed `$schema` directive in manifest files for immediate autocomplete, and configure VS Code workspace settings for project-wide enforcement. Host schemas in the repository at `packages/docs-core/src/schemas/`.

### Rationale
- **Immediate DX**: `$schema` provides instant autocomplete without any setup
- **Project Consistency**: Workspace settings ensure all team members get validation
- **Portability**: Relative paths work regardless of repository location

### Implementation Pattern
```json
// manifest.json
{
  "$schema": "../../../docs-core/src/schemas/component-manifest.schema.json",
  "id": "button",
  "name": "Button"
}

// .vscode/settings.json
{
  "json.schemas": [
    {
      "fileMatch": ["**/components/**/manifest.json"],
      "url": "./packages/docs-core/src/schemas/component-manifest.schema.json"
    }
  ]
}
```

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| SchemaStore.org | Public only; slower update cycle |
| npm package hosting | Adds publish workflow complexity |
| CDN hosting | Requires external infrastructure |

---

## 3. Next.js SSR Edition Filtering

### Decision
Use **`generateStaticParams` with environment variable filtering** for build-time content filtering. Store edition configuration in `EDITION` environment variable (server-only). Use `dynamicParams = false` to prevent 404 routes from being dynamically rendered.

### Rationale
- **Build-time optimization**: Filtering happens during build, resulting in smaller bundles
- **Server-only for security**: Edition setting not exposed to client
- **No middleware overhead**: More performant than runtime checks

### Implementation Pattern
```typescript
// lib/edition.ts
export type Edition = 'core' | 'pro' | 'enterprise';

export function getCurrentEdition(): Edition {
  return (process.env.EDITION as Edition) || 'core';
}

export function isEditionAvailable(requiredEdition: Edition): boolean {
  const hierarchy: Edition[] = ['core', 'pro', 'enterprise'];
  const current = getCurrentEdition();
  return hierarchy.indexOf(current) >= hierarchy.indexOf(requiredEdition);
}

// app/components/[id]/page.tsx
export async function generateStaticParams() {
  const edition = getCurrentEdition();
  const components = await getComponents();
  return components
    .filter(c => isEditionAvailable(c.editions[0]))
    .map(c => ({ id: c.id }));
}

export const dynamicParams = false; // 404 for non-generated routes
```

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| Middleware filtering | Runtime overhead; middleware deprecation concerns |
| Client-side filtering | Exposes all content to client |
| Config file | Environment variable simpler for CI/CD |

---

## 4. MDX Frontmatter Validation

### Decision
Use **gray-matter** (already in docs-core) for parsing, with **Ajv** for validation using the same schema approach as manifests. Implement two-phase validation: structure validation, then cross-reference validation against loaded manifests.

### Rationale
- **Consistency**: Same validation approach as manifests (Ajv + JSON Schema)
- **IDE support**: JSON Schema for frontmatter enables VS Code autocomplete in MDX
- **Cross-referencing**: Two-phase approach allows validating relationships

### Implementation Pattern
```typescript
import matter from 'gray-matter';
import Ajv from 'ajv';

// Phase 1: Structure validation
const { data: frontmatter, content } = matter(mdxContent);
if (!validateFrontmatter(frontmatter)) {
  return formatErrors(validateFrontmatter.errors, filePath);
}

// Phase 2: Cross-reference validation
const manifest = manifestMap.get(frontmatter.component);
if (!manifest) {
  return { error: `Component "${frontmatter.component}" not found` };
}
if (frontmatter.status !== manifest.status) {
  return { warning: `Status mismatch: docs say ${frontmatter.status}, manifest says ${manifest.status}` };
}
```

### Error Reporting
Line numbers for frontmatter fields require parsing YAML separately since gray-matter doesn't track source positions. For validation errors, report file path and field path.

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| zod-matter | Adds Zod dependency when Ajv already handles validation |
| remark plugin | More complex integration; separate validation pipeline |
| @github-docs/frontmatter | Different schema format (not JSON Schema) |

---

## Summary

| Topic | Decision | Key Benefit |
|-------|----------|-------------|
| **Schema Validation** | Ajv 8.x + JSONSchemaType + ajv-errors | Type guards + custom messages + fastest validation |
| **IDE Autocomplete** | $schema + workspace settings | Immediate DX + team consistency |
| **Edition Filtering** | generateStaticParams + env var | Build-time optimization + security |
| **Frontmatter Validation** | gray-matter + Ajv (same as manifests) | Consistency + cross-referencing |

## Dependencies to Add

| Package | Version | Purpose | Bundle Impact |
|---------|---------|---------|---------------|
| ajv | ^8.17.1 | JSON Schema validation | ~127KB (build-only) |
| ajv-errors | ^3.0.0 | Custom error messages | ~3KB (build-only) |

**Note**: gray-matter and glob already exist in @ds/docs-core.
