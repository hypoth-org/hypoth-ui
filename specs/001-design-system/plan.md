# Implementation Plan: White-Label Design System Monorepo

**Branch**: `001-design-system` | **Date**: 2026-01-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-design-system/spec.md`

## Summary

Build a white-label design system monorepo with token-driven theming, Lit-based Web Components (Light DOM), React/Next.js adapters, and a headless documentation engine supporting tenant filtering. This architectural foundation spec establishes package boundaries, contracts, and tooling to support incremental feature specs.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Lit 3.x (WC only), React 18+ (adapter peer), Next.js 14+ (adapter peer)
**Storage**: N/A (file-based token sources, no database)
**Testing**: Vitest (unit/integration), Playwright (component/e2e), axe-core (a11y)
**Target Platform**: Browser (ES2022+), Node.js 20+ (build tooling)
**Project Type**: Monorepo (pnpm workspaces)
**Performance Goals**: <15KB gzipped foundation packages; Lighthouse 90+ for docs/demo
**Constraints**: Zero runtime deps for core packages; SSR/streaming compatible
**Scale/Scope**: 50+ components target; multi-tenant docs deployment

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; minimal client boundaries; SSR-friendly
  - Vanilla CSS with CSS layers; single client loader pattern for Next.js
- [x] **Accessibility**: WCAG 2.1 AA plan; APG patterns identified; a11y testing strategy defined
  - axe-core automation; APG pattern compliance per component; manual checklist requirement
- [x] **Customizability**: Uses DTCG tokens; CSS layers for overrides; no inline styles blocking customization
  - DTCG format source of truth; 6-layer CSS architecture; Light DOM for full CSS access
- [x] **Zero-dep Core**: Core packages (`@ds/tokens`, `@ds/css`, `@ds/primitives-dom`) have no runtime deps
  - Build-time only tooling; zero runtime dependencies in foundation layer
- [x] **Web Components**: Light DOM default; Lit-based; theme via CSS vars
  - Lit 3.x with `createRenderRoot() { return this; }` pattern; CSS custom properties
- [x] **Dependency Management**: Latest stable versions verified; pnpm used; bundle impact assessed
  - pnpm workspaces; exact version pinning; bundlephobia checks required

## Project Structure

### Documentation (this feature)

```text
specs/001-design-system/
├── plan.md              # This file
├── research.md          # Phase 0: Tooling and pattern research
├── data-model.md        # Phase 1: Entity schemas and relationships
├── quickstart.md        # Phase 1: Developer getting started guide
├── contracts/           # Phase 1: JSON schemas and type contracts
└── tasks.md             # Phase 2: Implementation tasks (via /speckit.tasks)
```

### Source Code (repository root)

```text
packages/
├── tokens/              # @ds/tokens - DTCG tokens + compiler
│   ├── src/
│   │   ├── tokens/      # DTCG JSON source files
│   │   └── build/       # Token compiler scripts
│   ├── dist/
│   │   ├── css/         # CSS custom properties output
│   │   └── ts/          # TypeScript constants output
│   └── package.json
│
├── css/                 # @ds/css - CSS layers + base styles
│   ├── src/
│   │   ├── layers/      # @layer definitions (reset, tokens, base, etc.)
│   │   └── base/        # Base element styles
│   ├── dist/
│   └── package.json
│
├── primitives-dom/      # @ds/primitives-dom - A11y/behavior utilities
│   ├── src/
│   │   ├── focus/       # Focus management
│   │   ├── keyboard/    # Keyboard navigation
│   │   └── aria/        # ARIA helpers
│   ├── dist/
│   └── package.json
│
├── wc/                  # @ds/wc - Lit Web Components
│   ├── src/
│   │   ├── components/  # Individual components
│   │   ├── base/        # Base component class
│   │   └── registry/    # Component registration
│   ├── dist/
│   └── package.json
│
├── react/               # @ds/react - React adapters
│   ├── src/
│   │   ├── components/  # Wrapped components
│   │   ├── primitives/  # React-only primitives (Slot, Presence)
│   │   └── utils/       # Event normalization
│   ├── dist/
│   └── package.json
│
├── next/                # @ds/next - Next.js integration
│   ├── src/
│   │   ├── loader/      # Client-side element loader
│   │   └── utils/       # SSR helpers
│   ├── dist/
│   └── package.json
│
├── docs-core/           # @ds/docs-core - Headless docs engine
│   ├── src/
│   │   ├── manifest/    # Manifest ingestion + validation
│   │   ├── content/     # MDX/frontmatter parsing
│   │   ├── nav/         # Navigation generation
│   │   └── filter/      # Edition/tenant filtering
│   ├── dist/
│   └── package.json
│
├── docs-content/        # @ds/docs-content - Base content pack
│   ├── components/      # Component MDX docs
│   ├── guides/          # Usage guides
│   ├── manifests/       # Component manifests
│   └── package.json
│
└── docs-renderer-next/  # @ds/docs-renderer-next - Next.js docs site
    ├── app/             # Next.js App Router
    ├── components/      # Docs UI components
    └── package.json

apps/
├── demo/                # Demo application (Next.js)
│   ├── app/
│   └── package.json
│
└── docs/                # Documentation site deployment
    └── package.json     # Consumes docs-renderer-next

tooling/
├── eslint-config/       # Shared ESLint configuration
├── tsconfig/            # Shared TypeScript configuration
└── vitest-config/       # Shared Vitest configuration
```

**Structure Decision**: Monorepo with pnpm workspaces. Packages organized by layer (foundation → components → adapters → docs). Apps separate from packages. Shared tooling configs in `tooling/`.

## Complexity Tracking

No constitution violations requiring justification. Architecture follows all constitution principles.

## Package Dependency Graph

```text
Foundation (0 runtime deps):
  @ds/tokens ────────────────────────────────────┐
  @ds/css ──────────────────────────────────────>│
  @ds/primitives-dom ───────────────────────────>│
                                                 │
Components:                                      │
  @ds/wc ───────> [Lit] + @ds/css + @ds/tokens ──┤
                                                 │
Adapters:                                        │
  @ds/react ────> [React peer] + @ds/wc ─────────┤
  @ds/next ─────> [Next.js peer] + @ds/react ────┤
                                                 │
Docs:                                            │
  @ds/docs-core ─> (no runtime deps) ────────────┤
  @ds/docs-content ─> @ds/docs-core ─────────────┤
  @ds/docs-renderer-next ─> @ds/docs-core ───────┘
                          + @ds/docs-content
                          + Next.js
```

## Export Strategy

All packages use explicit `exports` field in `package.json`:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./css": "./dist/css/index.css",
    "./package.json": "./package.json"
  }
}
```

- ESM-only output (no CJS)
- TypeScript declarations alongside JS
- CSS as separate entry points
- No barrel re-exports (explicit paths)

## Build Pipeline

```text
Source (DTCG JSON, TS, CSS)
    │
    ▼
┌─────────────────────────────────────────────────┐
│  Build: pnpm -r build                           │
│  ├─ @ds/tokens: style-dictionary → CSS + TS    │
│  ├─ @ds/css: PostCSS (layers, minify)          │
│  ├─ @ds/primitives-dom: tsup → ESM             │
│  ├─ @ds/wc: tsup → ESM (Lit external)          │
│  ├─ @ds/react: tsup → ESM (React external)     │
│  ├─ @ds/next: tsup → ESM (Next.js external)    │
│  ├─ @ds/docs-core: tsup → ESM                  │
│  └─ @ds/docs-renderer-next: next build         │
└─────────────────────────────────────────────────┘
    │
    ▼
Dist (ESM + CSS + Types)
```

## Testing Strategy

| Package | Unit | Integration | E2E | A11y |
|---------|------|-------------|-----|------|
| @ds/tokens | ✓ | - | - | - |
| @ds/css | ✓ | - | - | - |
| @ds/primitives-dom | ✓ | ✓ | - | ✓ |
| @ds/wc | ✓ | ✓ | - | ✓ |
| @ds/react | ✓ | ✓ | - | ✓ |
| @ds/next | - | ✓ | ✓ | - |
| @ds/docs-core | ✓ | ✓ | - | - |
| @ds/docs-renderer-next | - | - | ✓ | ✓ |

- **Unit**: Vitest
- **Integration**: Vitest + happy-dom/jsdom
- **E2E**: Playwright
- **A11y**: axe-core via @axe-core/playwright

## CI Structure

```yaml
# .github/workflows/ci.yml
jobs:
  lint:
    - pnpm lint
    - pnpm typecheck

  test:
    - pnpm test:unit
    - pnpm test:integration

  build:
    - pnpm build
    - Assert bundle sizes (constitution gate)

  a11y:
    - pnpm test:a11y
    - Must pass with 0 violations

  e2e:
    - pnpm test:e2e
    - Playwright on demo app
```

## Manifest Location & Validation

Component manifests live in `packages/docs-content/manifests/`:

```text
packages/docs-content/manifests/
├── button.json
├── input.json
├── dialog.json
└── ...
```

**Validation**:
1. JSON Schema validation at build time via `@ds/docs-core`
2. Schema defined in `specs/001-design-system/contracts/component-manifest.schema.json`
3. Build fails if any manifest is invalid
4. CI gate: `pnpm validate:manifests`

## Edition/Tenant Config Format

```json
{
  "$schema": "./edition-config.schema.json",
  "id": "enterprise-acme",
  "name": "ACME Corp Edition",
  "availabilityFilter": ["public", "enterprise"],
  "excludeComponents": ["internal-debug-panel"],
  "contentOverlays": {
    "guides/getting-started.mdx": "./overlays/getting-started.mdx"
  },
  "branding": {
    "logoUrl": "/acme-logo.svg",
    "primaryColor": "#0066cc"
  }
}
```

**Filtering Logic** (in `@ds/docs-core`):
1. Load base component manifests
2. Filter by `availabilityFilter` tags (intersection)
3. Exclude explicitly listed components
4. Apply content overlays (overlay replaces base)
5. Generate navigation from filtered set
