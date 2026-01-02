# Implementation Plan: Framework-Agnostic Behavior Utilities

**Branch**: `005-behavior-utilities` | **Date**: 2026-01-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-behavior-utilities/spec.md`

## Summary

Extend the `@ds/primitives-dom` package with framework-agnostic behavior utilities for accessible components: dismissable layer (Escape/outside-click), keyboard helpers (activation, arrow keys, type-ahead), and enhanced APIs for existing focus-trap and roving-focus utilities. Create test harness pages in the demo app and usage documentation for the docs site.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode, ES2022 target)
**Primary Dependencies**: None (zero runtime deps per constitution)
**Storage**: N/A (stateless utilities with closure-captured state)
**Testing**: Vitest with happy-dom environment, axe-core for a11y
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge latest 2 versions)
**Project Type**: Monorepo package (`packages/primitives-dom`) + demo app (`apps/demo`)
**Performance Goals**: <2KB gzipped per utility, no unnecessary DOM queries
**Constraints**: Zero runtime dependencies, Light DOM only, SSR-friendly (no document access during import)
**Scale/Scope**: 4-5 utilities, ~10 test harness pages, 1 documentation guide

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; minimal client boundaries; SSR-friendly (utilities don't access DOM at import time)
- [x] **Accessibility**: WCAG 2.1 AA plan (all utilities implement APG patterns); APG patterns identified (focus-trap, roving-tabindex, combobox navigation); a11y testing strategy defined (axe-core + vitest)
- [x] **Customizability**: Uses DTCG tokens (N/A - behavior utilities, not styling); CSS layers for overrides (N/A); no inline styles blocking customization (N/A)
- [x] **Zero-dep Core**: `@ds/primitives-dom` has no runtime deps (maintained)
- [x] **Web Components**: Light DOM default (utilities work with Light DOM); Lit-based (N/A - framework-agnostic utilities); theme via CSS vars (N/A)
- [x] **Dependency Management**: Latest stable versions verified (vitest, tsup); pnpm used; bundle impact assessed (<2KB per utility)

## Project Structure

### Documentation (this feature)

```text
specs/005-behavior-utilities/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
packages/primitives-dom/
├── src/
│   ├── index.ts                    # Package exports
│   ├── focus/
│   │   └── focus-trap.ts           # Existing (enhance returnFocus)
│   ├── keyboard/
│   │   ├── roving-focus.ts         # Existing (add disabled item support)
│   │   ├── activation.ts           # NEW: Enter/Space handler
│   │   ├── arrow-keys.ts           # NEW: Arrow key normalization
│   │   └── type-ahead.ts           # NEW: Type-ahead search
│   ├── layer/
│   │   └── dismissable-layer.ts    # NEW: Escape + outside click
│   └── aria/
│       └── live-region.ts          # Existing (no changes)
├── tests/
│   ├── focus-trap.test.ts          # Existing + new tests
│   ├── roving-focus.test.ts        # Existing + new tests
│   ├── activation.test.ts          # NEW
│   ├── arrow-keys.test.ts          # NEW
│   ├── type-ahead.test.ts          # NEW
│   └── dismissable-layer.test.ts   # NEW
└── package.json

apps/demo/
├── app/
│   └── primitives/
│       ├── page.tsx                 # Primitives index page
│       ├── focus-trap/
│       │   └── page.tsx             # Focus trap demo
│       ├── roving-focus/
│       │   └── page.tsx             # Roving focus demo
│       ├── dismissable-layer/
│       │   └── page.tsx             # Dismissable layer demo
│       ├── keyboard-helpers/
│       │   └── page.tsx             # Activation + arrow keys demo
│       └── type-ahead/
│           └── page.tsx             # Type-ahead demo
└── e2e/
    └── primitives.spec.ts           # E2E tests for all primitives

packages/docs-content/
└── guides/
    └── behavior-utilities.mdx       # Usage documentation
```

**Structure Decision**: Extends existing `packages/primitives-dom` package structure. New utilities organized by category (keyboard/, layer/). Demo pages created under `apps/demo/app/primitives/` route. E2E tests in existing `apps/demo/e2e/` directory.

## Complexity Tracking

> No constitution violations requiring justification. All design decisions align with existing patterns.
