# Implementation Plan: Component & Documentation Contracts

**Branch**: `002-component-docs-contracts` | **Date**: 2026-01-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-component-docs-contracts/spec.md`

## Summary

Define enforceable contracts for components and documentation through a JSON Schema-based manifest system. Components in `packages/wc/src/components/<name>/manifest.json` declare metadata (name, status, accessibility notes, edition tags). MDX documentation frontmatter is validated against manifests. Edition filtering (core → pro → enterprise hierarchy) controls navigation and page generation. Build-time validation with Ajv; configurable strictness (warnings in dev, errors in CI). Approach C (Hybrid) selected: JSON Schema for authoring DX, build-time validation, lightweight runtime map for SSR-based filtering.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Ajv 8.x (JSON Schema validation), gray-matter (frontmatter parsing), glob (file discovery)
**Storage**: File-based (manifest.json per component, edition-map.json generated)
**Testing**: Vitest (unit tests), Playwright (E2E for edition filtering in docs site)
**Target Platform**: Node.js 20+ (build tooling), Next.js 14+ (docs site SSR)
**Project Type**: Monorepo (pnpm workspaces)
**Performance Goals**: Validation of 100 components in <5 seconds; generated edition-map.json <10KB
**Constraints**: Zero runtime deps in core packages; validation must not block dev server startup
**Scale/Scope**: ~10-50 components initially; ~100 components at scale

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: JSON Schema validation is build-time only; no runtime overhead. Edition filtering via static SSR, no client JS required for filtering.
- [x] **Accessibility**: Manifest schema includes structured a11y metadata (keyboard, screenReader, ariaPatterns); a11y section required in manifest.
- [x] **Customizability**: Manifests use DTCG-aligned patterns; edition config is external; no hard-coded filtering logic.
- [x] **Zero-dep Core**: Validation tooling is build-time only in `@ds/docs-core`; manifest.json files have no runtime deps.
- [x] **Web Components**: Manifests live alongside WC source; Light DOM pattern unaffected.
- [x] **Dependency Management**: Ajv is build-time only; gray-matter already in docs-core; no new runtime deps.

## Project Structure

### Documentation (this feature)

```text
specs/002-component-docs-contracts/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (JSON Schemas)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
packages/
├── wc/
│   └── src/components/
│       ├── button/
│       │   ├── button.ts
│       │   └── manifest.json         # NEW: Component manifest
│       └── input/
│           ├── input.ts
│           └── manifest.json         # NEW: Component manifest
│
├── docs-core/
│   └── src/
│       ├── schemas/                  # NEW: JSON Schema definitions
│       │   ├── component-manifest.schema.json
│       │   └── docs-frontmatter.schema.json
│       ├── validation/               # NEW: Validation utilities
│       │   ├── validate-manifests.ts
│       │   ├── validate-frontmatter.ts
│       │   └── edition-filter.ts
│       ├── cli/                      # NEW: CLI commands
│       │   ├── validate.ts
│       │   └── audit.ts
│       └── generated/                # NEW: Build outputs
│           └── edition-map.json
│
├── docs-content/
│   └── components/
│       ├── button.mdx                # Existing: frontmatter validated
│       └── input.mdx                 # Existing: frontmatter validated
│
└── docs-renderer-next/
    └── app/
        ├── components/
        │   └── [id]/
        │       └── page.tsx          # Updated: edition filtering
        └── edition-upgrade/
            └── page.tsx              # NEW: Upgrade prompt page

apps/
└── docs/
    └── edition.config.json           # NEW: Tenant edition config
```

**Structure Decision**: Extends existing monorepo structure. Schemas and validation live in `@ds/docs-core` (build-time package). Manifests co-located with component source in `@ds/wc`. Edition config at app level for tenant customization.

## Complexity Tracking

No constitution violations. All additions are build-time tooling with zero runtime impact on core packages.
