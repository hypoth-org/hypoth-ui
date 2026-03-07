# Implementation Plan: DX Deficiency Fixes

**Branch**: `027-dx-deficiency-fixes` | **Date**: 2026-03-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/027-dx-deficiency-fixes/spec.md`

## Summary

Fix 7 developer experience deficiencies blocking adoption of @hypoth-ui packages. Critical blockers (workspace:* in peerDeps, missing "use client" directive) ship as a patch release. API consolidation (Button unification, event naming standardization) ships as a breaking alpha release. Dependency cleanup, documentation, and a new EmptyState component follow.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode, ES2022 target)
**Primary Dependencies**: Lit 3.1+ (WC), React 18+/19+ (adapters), Next.js 14+/15+ (integration), @changesets/cli (versioning)
**Storage**: File-based (package.json, registry JSON, markdown)
**Testing**: Vitest (unit), @testing-library/react (React components), axe-core (a11y)
**Target Platform**: npm registry (published packages), Node.js + browsers
**Project Type**: pnpm monorepo workspace
**Performance Goals**: N/A (package metadata and API changes, not runtime performance)
**Constraints**: Alpha-stage — breaking changes acceptable; must maintain backward compat for non-breaking phases
**Scale/Scope**: 5 packages affected (@hypoth-ui/react, @hypoth-ui/next, @hypoth-ui/wc, @hypoth-ui/css, @hypoth-ui/cli), ~15 component files for event audit, 1 new component (EmptyState)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; SSR-friendly (EmptyState is presentational). Adding `"use client"` to the main `index.ts` entry is the smallest *meaningful* boundary — every export uses React hooks, so per-component directives would be broader in total (60+ files) without reducing the client surface. `import type` is unaffected. This matches Radix UI and Ark UI's approach.
- [x] **Accessibility**: EmptyState will use semantic HTML structure with ARIA roles; no a11y regressions from API renames
- [x] **Customizability**: EmptyState uses DTCG tokens and CSS layers; no inline styles; no changes to token/layer system
- [x] **Zero-dep Core**: No new runtime dependencies added to core packages; EmptyState is purely presentational
- [x] **Web Components**: EmptyState WC uses Light DOM, Lit-based, theme via CSS vars; no changes to existing WC architecture
- [x] **Dependency Management**: Fixing workspace:* in peerDeps directly improves dependency management; peer dep ranges widened to match actual support

## Project Structure

### Documentation (this feature)

```text
specs/027-dx-deficiency-fixes/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── button-api.md    # Unified Button API contract
│   ├── event-naming.md  # Event naming convention contract
│   └── empty-state.md   # EmptyState component API contract
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
packages/
├── react/
│   ├── package.json                    # Fix workspace:* peerDep, widen React range
│   └── src/
│       ├── index.ts                    # Add "use client", unify Button export
│       ├── client.ts                   # Rename WC Button → DsButton
│       ├── components/
│       │   ├── button/button.tsx        # Headless Button (canonical)
│       │   ├── button.tsx              # WC wrapper → rename to ds-button.tsx
│       │   └── empty-state/index.tsx   # New EmptyState component
│       └── utils/
│           └── create-component.ts     # Unused factory (evaluate removal)
├── next/
│   ├── package.json                    # Widen Next.js + React peer dep ranges
│   └── src/loader/
│       └── element-loader.tsx          # (already has include/exclude)
├── wc/
│   └── src/components/
│       └── empty-state/empty-state.ts  # New EmptyState WC
├── css/
│   ├── package.json                    # Move @hypoth-ui/wc to devDependencies
│   └── src/layers/components.css       # Add empty-state styles
└── cli/
    └── templates/
        └── empty-state/               # CLI template for EmptyState

README.md                               # Add DsLoader selective loading docs
CONTRIBUTING.md                         # Add event naming convention section
```

**Structure Decision**: Monorepo structure unchanged. Changes are targeted edits to existing package.json files, entry points, and ~15 component files, plus one new component (EmptyState) following the established component pattern.

## Complexity Tracking

No constitution violations. All changes align with existing patterns and reduce complexity rather than adding it.
