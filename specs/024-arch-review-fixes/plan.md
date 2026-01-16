# Implementation Plan: Architecture Review Fixes

**Branch**: `024-arch-review-fixes` | **Date**: 2026-01-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/024-arch-review-fixes/spec.md`

## Summary

This feature addresses four gaps identified in the architecture review:
1. **Button double-event bug** (P1): Fix `ds:press` emitting twice on keyboard activation
2. **CLI registry alignment** (P2): Add missing components (layout, radio), fix naming consistency
3. **CLI template coverage** (P2): Expand bundled templates from 6 to 54 components
4. **MDX documentation** (P3): Expand docs coverage from 24 to 55 components

Technical approach: Issue-type batching - fix each category across all components rather than component-by-component. This enables automation for templates and consistent patterns for documentation.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode, ES2022 target)
**Primary Dependencies**: Lit 3.1+ (WC), React 18+ (adapters), Commander.js (CLI)
**Storage**: File-based (JSON registry, bundled templates, MDX files)
**Testing**: Vitest (unit), jest-axe (a11y), Happy-dom (WC)
**Target Platform**: Node.js 18+ (CLI), Browser (WC/React components)
**Project Type**: Monorepo (packages/wc, packages/react, packages/cli, packages/docs-content)
**Performance Goals**: CLI template copy < 1s per component; no runtime impact on components
**Constraints**: Zero runtime dependencies in primitives-dom; templates must transform import paths
**Scale/Scope**: 55 WC components, 54 CLI registry entries, 55 MDX documentation files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: Button fix removes unnecessary `this.click()` call - improves performance. Templates are build-time only. No runtime impact.
- [x] **Accessibility**: Button fix maintains a11y - keyboard activation still works. MDX docs will document keyboard interactions and ARIA per constitution requirement.
- [x] **Customizability**: Templates support import alias transformation. No changes to token usage or CSS layers.
- [x] **Zero-dep Core**: No changes to core packages' dependency structure. CLI already has its own deps.
- [x] **Web Components**: Button fix is in Light DOM WC. No Shadow DOM introduced.
- [x] **Dependency Management**: No new dependencies required. Using existing pnpm workspace.

## Project Structure

### Documentation (this feature)

```text
specs/024-arch-review-fixes/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
packages/
├── wc/
│   └── src/components/button/button.ts    # Button fix (FR-001 to FR-003)
├── cli/
│   ├── registry/components.json           # Registry alignment (FR-004 to FR-006)
│   └── templates/                         # Template expansion (FR-007 to FR-010)
│       ├── accordion/
│       ├── alert/
│       ├── ... (54 component directories)
│       └── visually-hidden/
└── docs-content/
    └── components/                        # MDX documentation (FR-011 to FR-014)
        ├── accordion.mdx
        ├── alert.mdx
        ├── ... (55 MDX files)
        └── visually-hidden.mdx

tests/
├── packages/wc/tests/unit/button.test.ts  # Button event tests
└── packages/cli/tests/                    # CLI copy mode tests
```

**Structure Decision**: Existing monorepo structure maintained. Changes touch 4 packages: `@ds/wc` (button fix), `@hypoth-ui/cli` (registry + templates), `@ds/docs-content` (MDX docs).

## Complexity Tracking

No constitution violations. All changes align with existing patterns:
- Button fix simplifies code (removes double-emit)
- Templates follow existing 6-component pattern
- MDX docs follow existing 24-component pattern
- Registry is additive (2 entries)
