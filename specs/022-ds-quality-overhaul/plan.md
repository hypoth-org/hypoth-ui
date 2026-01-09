# Implementation Plan: Design System Quality Overhaul

**Branch**: `022-ds-quality-overhaul` | **Date**: 2026-01-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/022-ds-quality-overhaul/spec.md`

## Summary

Address all audit findings from AUDIT_REPORT.md to achieve production-ready status for the Hypoth UI Design System. This includes:
- Complete React adapter coverage (24 missing → 55 total)
- Build-time style props system (Panda/Vanilla Extract pattern)
- SSR-safe ID generation via React 18 `useId()`
- Standardized event semantics across all components
- 16-step color scales (enhanced layering), density system, responsive variants
- APG accessibility alignment for Tree, DataTable, Stepper, NavigationMenu
- Deployed documentation site with search
- CLI copy/paste model for component extraction
- Dev mode warnings for misuse detection

**Approach**: Foundation-First Refactor (Approach B from spec) - establish unified patterns first, then implement features on the new foundation.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode, ES2022 target)
**Primary Dependencies**: Lit 3.1+ (WC), React 18+ (adapters), Next.js 14+ (SSR/RSC testing)
**Storage**: N/A (stateless UI components; file-based docs/manifests)
**Testing**: Vitest (unit), axe-core (a11y automation), Playwright (integration), NVDA/VoiceOver (manual a11y)
**Target Platform**: Browser (evergreen), Node.js 18+ (SSR), Next.js App Router
**Project Type**: Monorepo with multiple packages
**Performance Goals**: Zero runtime CSS-in-JS; <5KB gzipped per component; style props tree-shakeable
**Constraints**: No hydration mismatches in SSR; WCAG 2.1 AA compliance; no breaking changes to existing WC API
**Scale/Scope**: 55 components across WC and React; 16-step color scales for 5 semantic colors; 3 density modes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; minimal client boundaries; SSR-friendly
  - Style props use build-time CSS generation (Panda/Vanilla Extract pattern)
  - React adapters use single root client loader pattern
  - ID generation uses React 18 `useId()` for SSR safety
- [x] **Accessibility**: WCAG 2.1 AA plan; APG patterns identified; a11y testing strategy defined
  - APG patterns: Tree (treeview), DataTable (grid), Stepper (custom), NavigationMenu (menubar)
  - Testing: axe-core automation + manual NVDA/VoiceOver testing + keyboard navigation verification
- [x] **Customizability**: Uses DTCG tokens; CSS layers for overrides; no inline styles blocking customization
  - 16-step color scales in DTCG format (4 bg levels, 3 interactive, 3 border, 4 solid, 2 text)
  - Density tokens (compact/default/spacious) in tokens package
  - Style props compile to CSS classes using token CSS variables
- [x] **Zero-dep Core**: Core packages (`@ds/tokens`, `@ds/css`, `@ds/primitives-dom`) have no runtime deps
  - Style props build tooling is dev dependency only
  - ID generation hooks are React-only, not in primitives-dom
- [x] **Web Components**: Light DOM default; Lit-based; theme via CSS vars
  - No changes to Light DOM strategy
  - All new WC components use Lit 3.1+
- [x] **Dependency Management**: Latest stable versions verified; pnpm used; bundle impact assessed
  - No new runtime dependencies for core packages
  - date-fns already approved for DatePicker/TimePicker (from 017)
  - Style props build tooling: evaluate Panda CSS vs Vanilla Extract bundle impact

## Project Structure

### Documentation (this feature)

```text
specs/022-ds-quality-overhaul/
├── plan.md              # This file
├── research.md          # Phase 0: Technology research
├── data-model.md        # Phase 1: Data structures and APIs
├── quickstart.md        # Phase 1: Getting started guide
├── contracts/           # Phase 1: API contracts
│   ├── style-props.ts   # Style props type definitions
│   ├── events.ts        # Event naming conventions
│   ├── density.ts       # Density system types
│   └── color-scales.ts  # 16-step color scale types
└── tasks.md             # Phase 2: Implementation tasks (/speckit.tasks)
```

### Source Code (repository root)

```text
packages/
├── tokens/                    # @ds/tokens - DTCG design tokens
│   └── src/
│       ├── colors/           # NEW: 16-step color scales
│       │   ├── primitives.json    # Raw color values (steps 1-16)
│       │   └── semantic.json      # Semantic mappings
│       ├── density/          # NEW: Density tokens
│       │   └── modes.json         # compact/default/spacious
│       └── responsive/       # NEW: Breakpoint tokens
│           └── breakpoints.json
│
├── primitives-dom/           # @ds/primitives-dom - Vanilla behaviors
│   └── src/
│       ├── id/               # NEW: ID generation utilities
│       │   └── create-id-generator.ts
│       ├── overlay/          # NEW: Shared overlay behavior
│       │   └── create-overlay-behavior.ts
│       └── events/           # NEW: Event naming constants
│           └── event-names.ts
│
├── css/                      # @ds/css - CSS layers and utilities
│   └── src/
│       ├── layers/           # Existing 7-layer system
│       └── density/          # NEW: Density utility classes
│
├── wc/                       # @ds/wc - Web Components
│   └── src/
│       ├── components/       # Existing + updated components
│       │   ├── tree/         # APG fixes: aria-level, aria-setsize, aria-posinset
│       │   ├── data-table/   # APG fixes: sort announcements
│       │   ├── stepper/      # APG fixes: aria-current="step"
│       │   ├── navigation-menu/  # APG fixes: role="menubar"
│       │   ├── select/       # Loading state support
│       │   ├── combobox/     # Loading state support
│       │   └── ...
│       └── utils/            # NEW: Dev mode warnings
│           └── dev-warnings.ts
│
├── react/                    # @ds/react - React adapters
│   └── src/
│       ├── adapters/         # Existing + 24 new adapters
│       │   ├── accordion.tsx
│       │   ├── alert-dialog.tsx
│       │   ├── breadcrumb.tsx
│       │   ├── command.tsx
│       │   ├── data-table.tsx
│       │   ├── navigation-menu.tsx
│       │   ├── pagination.tsx
│       │   ├── progress.tsx
│       │   ├── scroll-area.tsx
│       │   ├── skeleton.tsx
│       │   ├── stepper.tsx
│       │   ├── table.tsx
│       │   ├── toast.tsx
│       │   ├── tree.tsx
│       │   └── ...
│       ├── primitives/       # NEW: Style props primitives
│       │   ├── box.tsx
│       │   ├── flex.tsx
│       │   ├── grid.tsx
│       │   └── text.tsx
│       ├── hooks/            # NEW: SSR-safe hooks
│       │   └── use-stable-id.ts
│       └── theme/            # NEW: Theme system
│           ├── theme-provider.tsx     # Unified color mode + density
│           ├── density-provider.tsx   # Nested density overrides
│           ├── use-theme.ts           # useTheme() hook
│           ├── theme-script.ts        # SSR flash prevention script
│           └── storage.ts             # Persistence utilities
│
├── cli/                      # @ds/cli - CLI tool
│   └── src/
│       └── commands/
│           └── copy.ts       # NEW: Component copy command
│
├── docs-core/                # @ds/docs-core - Docs engine
│   └── src/
│       └── search/           # NEW: Search functionality
│
└── docs-renderer-next/       # Documentation site
    └── src/
        └── app/              # Next.js App Router pages
```

**Structure Decision**: Monorepo structure with feature additions distributed across existing packages per constitution. No new packages needed; all work fits within existing package boundaries.

## Complexity Tracking

No constitution violations requiring justification. All features align with existing architecture:
- Style props use build-time compilation (no runtime CSS-in-JS)
- React adapters follow existing thin wrapper pattern
- Density/color tokens extend existing DTCG pipeline
- APG fixes are internal component improvements
