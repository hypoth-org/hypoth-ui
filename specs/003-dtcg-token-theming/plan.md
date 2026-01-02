# Implementation Plan: DTCG Token-Driven Theming

**Branch**: `003-dtcg-token-theming` | **Date**: 2026-01-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-dtcg-token-theming/spec.md`

## Summary

Implement a DTCG-compliant design token pipeline that enables multi-brand and multi-mode theming. The system compiles tokens from DTCG JSON format to CSS custom properties (scoped by `data-brand` and `data-mode` attributes), JSON bundles for tooling, and TypeScript types for autocomplete. Components declare `tokensUsed` in their manifests, which drives both runtime theming and automatic documentation generation.

**Approach**: Custom DTCG Compiler (per spec recommendation) - purpose-built for native DTCG support with optimized multi-brand/mode scoping.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: None for runtime (build-time only: tsx for compilation, Ajv for schema validation)
**Storage**: File-based (DTCG JSON tokens → compiled CSS/JSON/TS outputs)
**Testing**: Vitest (consistent with existing packages)
**Target Platform**: Node.js build tool + Browser runtime (CSS custom properties)
**Project Type**: Monorepo package (`@ds/tokens` enhancement + new compiler in `@ds/docs-core`)
**Performance Goals**: 500 tokens × 3 brands × 4 modes compiled in <5 seconds (SC-001)
**Constraints**: Zero runtime dependencies for token consumption; runtime mode switching <100ms (SC-002)
**Scale/Scope**: 12 token categories, 4 modes (light/dark/high-contrast/reduced-motion), unlimited brands

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; tokens compile to static CSS; zero runtime dependency for consumption
- [x] **Accessibility**: High-contrast mode and reduced-motion as first-class modes; respects `prefers-*` media queries
- [x] **Customizability**: Native DTCG format; CSS layers for overrides; no inline styles; brand switching via `data-brand` attribute
- [x] **Zero-dep Core**: `@ds/tokens` outputs have zero runtime deps; compiler is build-time only
- [x] **Web Components**: Components consume tokens via CSS custom properties (Light DOM compatible)
- [x] **Dependency Management**: No new runtime deps; build deps (tsx, Ajv) already in use

## Project Structure

### Documentation (this feature)

```text
specs/003-dtcg-token-theming/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (JSON schemas)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
packages/
├── tokens/                          # @ds/tokens - Token definitions and compiler
│   ├── src/
│   │   ├── tokens/                  # DTCG source files
│   │   │   ├── global/              # Global tokens (primitives + base semantics)
│   │   │   │   ├── color.json
│   │   │   │   ├── typography.json
│   │   │   │   ├── spacing.json
│   │   │   │   └── ...              # Other categories
│   │   │   ├── brands/              # Brand-specific overrides
│   │   │   │   ├── default/
│   │   │   │   │   └── tokens.json
│   │   │   │   └── acme/
│   │   │   │       └── tokens.json
│   │   │   └── modes/               # Mode-specific overrides
│   │   │       ├── light.json
│   │   │       ├── dark.json
│   │   │       ├── high-contrast.json
│   │   │       └── reduced-motion.json
│   │   ├── compiler/                # Custom DTCG compiler
│   │   │   ├── parser.ts            # DTCG JSON parser
│   │   │   ├── resolver.ts          # Token reference resolution + cascade
│   │   │   ├── validator.ts         # Cycle detection, undefined refs
│   │   │   └── emitters/
│   │   │       ├── css.ts           # CSS custom properties output
│   │   │       ├── json.ts          # JSON bundle output
│   │   │       └── typescript.ts    # TypeScript types output
│   │   ├── build/
│   │   │   └── build.ts             # Build orchestration
│   │   └── types/
│   │       └── dtcg.ts              # DTCG format types
│   ├── dist/                        # Compiled outputs
│   │   ├── css/
│   │   │   └── tokens.css           # All tokens with brand/mode scoping
│   │   ├── json/
│   │   │   └── tokens.json          # Resolved token tree
│   │   └── ts/
│   │       ├── index.ts             # Token path types
│   │       └── index.d.ts
│   └── tests/
│       ├── compiler/
│       └── integration/
│
├── docs-core/                       # @ds/docs-core - Validation & docs generation
│   ├── src/
│   │   ├── schemas/
│   │   │   └── tokens-used.schema.json  # Schema for tokensUsed in manifests
│   │   ├── validation/
│   │   │   └── validate-tokens-used.ts  # Validate component token references
│   │   └── generators/
│   │       └── token-docs.ts            # Generate token reference docs
│   └── tests/
│
├── wc/                              # @ds/wc - Web Components
│   └── src/components/*/manifest.json   # Add tokensUsed field
│
└── docs-content/                    # Documentation content
    └── tokens/                      # Generated token reference pages
        └── [category].mdx           # Per-category token docs
```

**Structure Decision**: Extends existing `@ds/tokens` package with custom DTCG compiler (replacing Style Dictionary). Token validation and docs generation integrate with `@ds/docs-core`. Component manifests in `@ds/wc` add `tokensUsed` declarations.

## Complexity Tracking

No constitution violations. Design aligns with all principles:
- Zero runtime deps maintained
- Build-time compilation only
- CSS custom properties for runtime theming
- Native DTCG format per constitution
