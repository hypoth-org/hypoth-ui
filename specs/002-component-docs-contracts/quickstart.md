# Quickstart: Component & Documentation Contracts

**Branch**: `002-component-docs-contracts` | **Date**: 2026-01-01

## Overview

This feature adds enforceable contracts for components and documentation through JSON Schema validation and edition-based filtering.

## Getting Started

### 1. Create a Component Manifest

Every component in `packages/wc/src/components/<name>/` needs a `manifest.json`:

```json
{
  "$schema": "../../../docs-core/src/schemas/component-manifest.schema.json",
  "id": "button",
  "name": "Button",
  "version": "1.0.0",
  "status": "stable",
  "description": "A clickable button component for user interactions",
  "editions": ["core"],
  "accessibility": {
    "apgPattern": "button",
    "keyboard": ["Enter", "Space"],
    "screenReader": "Announces as a button with current state"
  }
}
```

### 2. Add Documentation Frontmatter

MDX files in `packages/docs-content/components/<name>.mdx` must include frontmatter:

```yaml
---
title: Button
component: button
status: stable
---

# Button

A clickable button component...
```

### 3. Configure Edition (Optional)

For tenant-specific filtering, create `apps/docs/edition.config.json`:

```json
{
  "$schema": "./schemas/edition-config.schema.json",
  "edition": "pro"
}
```

### 4. Run Validation

```bash
# Validate all manifests and docs
pnpm --filter @ds/docs-core validate -- --root-dir .

# Watch mode for development
pnpm --filter @ds/docs-core validate -- --root-dir . --watch

# Validate with strictness mode (CI mode - warnings treated as errors)
pnpm --filter @ds/docs-core validate -- --root-dir . --strict

# Generate audit report
pnpm --filter @ds/docs-core audit:components -- --root-dir .
```

#### Example Validation Output

```
╔═══════════════════════════════════════════╗
║         Contract Validation Suite         ║
╚═══════════════════════════════════════════╝

Root directory: /path/to/project
Strict mode: disabled

1. Validating Component Manifests

  ✓ packages/wc/src/components/button/manifest.json
  ✓ packages/wc/src/components/input/manifest.json

2. Validating Documentation Files

  ✓ packages/docs-content/components/button.mdx
  ✓ packages/docs-content/components/input.mdx
  ✓ packages/docs-content/guides/getting-started.mdx
  ✓ packages/docs-content/guides/theming.mdx

3. Cross-Reference Validation

  Documented components: 2
  Undocumented components: 0
  Orphaned docs: 0
  Status mismatches: 0

Summary

  Manifests: 2/2 valid
  Docs: 4/4 valid
  Errors: 0
  Warnings: 0

✓ Validation passed.
```

#### Example Audit Output

```
Component Audit Report
Generated: 2026-01-01T20:44:48.221Z
Total components: 2

By Status:
  stable: 2

By Edition:
  core: 2

Documentation:
  Documented: 2
  Undocumented: 0
  With warnings: 0

Components:
┌─────────────────────┬────────────┬────────────┬───────┬─────────────────────────────┐
│ Component           │ Status     │ Editions   │ Docs  │ State                       │
├─────────────────────┼────────────┼────────────┼───────┼─────────────────────────────┤
│ Button              │ stable     │ core       │  ✓    │ ✓ valid                     │
│ Input               │ stable     │ core       │  ✓    │ ✓ valid                     │
└─────────────────────┴────────────┴────────────┴───────┴─────────────────────────────┘
```

## Key Concepts

### Edition Hierarchy

```
core → pro → enterprise
```

- **core**: Base components (available to all)
- **pro**: Includes core + professional components
- **enterprise**: Includes pro + enterprise components

### Status Values

| Status | Description |
|--------|-------------|
| `experimental` | Early development, API may change drastically |
| `alpha` | Testing phase, API unstable |
| `beta` | Feature complete, API stabilizing |
| `stable` | Production ready, API stable |
| `deprecated` | Scheduled for removal |

### Validation Modes

| Mode | Behavior | Usage |
|------|----------|-------|
| Development | Warnings only | `pnpm validate` |
| CI/Production | Errors fail build | `pnpm validate --strict` |

## File Locations

| File | Location | Purpose |
|------|----------|---------|
| Component Manifest | `packages/wc/src/components/<name>/manifest.json` | Component metadata |
| Docs Frontmatter | `packages/docs-content/components/<name>.mdx` | Documentation metadata |
| Edition Config | `apps/docs/edition.config.json` | Tenant configuration |
| JSON Schemas | `packages/docs-core/src/schemas/` | Validation schemas |
| Edition Map | `packages/docs-core/src/generated/edition-map.json` | Generated build artifact |

## IDE Setup

For VS Code autocomplete, the schemas are auto-configured via `.vscode/settings.json`. If you don't see autocomplete in manifest files, ensure:

1. File is named `manifest.json`
2. File includes `$schema` reference
3. VS Code workspace settings are loaded

## Common Tasks

### Add a New Component

1. Create component directory: `packages/wc/src/components/<name>/`
2. Add `manifest.json` with required fields
3. Create `packages/docs-content/components/<name>.mdx`
4. Run `pnpm validate` to verify

### Change Component Edition

1. Update `editions` array in manifest.json
2. Run validation to check for docs consistency
3. Regenerate edition map: `pnpm build:edition-map`

### Deprecate a Component

1. Change `status` to `deprecated` in manifest.json
2. Update docs frontmatter status to match
3. Run validation to confirm sync

## Troubleshooting

### "Component not found" Error

The docs `component` field doesn't match any manifest `id`. Check:
- Manifest exists at expected path
- `id` field matches (kebab-case)

### "Status mismatch" Warning

Docs status differs from manifest. Update frontmatter to match manifest.

### "Unknown edition" Error

Edition in manifest is not one of: `core`, `pro`, `enterprise`.

## Next Steps

- See [data-model.md](./data-model.md) for entity definitions
- See [contracts/](./contracts/) for JSON Schema files
- See [spec.md](./spec.md) for full requirements
