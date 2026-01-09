# Implementation Plan: Design System Audit Remediation

**Branch**: `021-ds-audit-remediation` | **Date**: 2026-01-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/021-ds-audit-remediation/spec.md`

## Summary

Address comprehensive design system audit findings by implementing ElementInternals form association for WC form controls, enabling tree-shaking via sideEffects:false, migrating WC overlays to use shared behavior primitives from @ds/primitives-dom, creating a createTabsBehavior primitive, and adding granular package exports. Approach is incremental refactoring with no backward compatibility concerns.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode, ES2022 target)
**Primary Dependencies**: Lit 3.1+ (WC), React 18+ (adapter peer), @ds/primitives-dom (behavior primitives)
**Storage**: N/A (stateless UI components)
**Testing**: Vitest (unit/integration), axe-core (a11y automation)
**Target Platform**: Modern browsers - Chrome 77+, Firefox 93+, Safari 16.4+ (no polyfills)
**Project Type**: Monorepo with multiple packages
**Performance Goals**: Single-component import <15KB gzipped; zero duplicated behavior logic
**Constraints**: Zero runtime deps for core packages; Light DOM default; sideEffects:false
**Scale/Scope**: ~60+ components across @ds/wc and @ds/react packages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; tree-shaking enabled via sideEffects:false; SSR-friendly Light DOM
- [x] **Accessibility**: WCAG 2.1 AA maintained; APG patterns via shared behavior primitives; a11y testing via axe-core
- [x] **Customizability**: Uses DTCG tokens; CSS layers preserved; no inline styles blocking customization
- [x] **Zero-dep Core**: @ds/primitives-dom has zero runtime deps; behavior primitives are stateless utilities
- [x] **Web Components**: Light DOM default; Lit-based; theme via CSS vars maintained
- [x] **Dependency Management**: No new dependencies added; refactoring existing code only

## Project Structure

### Documentation (this feature)

```text
specs/021-ds-audit-remediation/
├── plan.md              # This file
├── spec.md              # Feature specification
├── checklist.md         # Quality verification checklist
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
packages/
├── primitives-dom/
│   └── src/
│       └── behavior/
│           ├── dialog.ts         # createDialogBehavior (existing)
│           ├── menu.ts           # createMenuBehavior (existing)
│           └── tabs.ts           # createTabsBehavior (NEW)
├── wc/
│   ├── package.json              # Add sideEffects:false, exports field
│   └── src/
│       ├── index.ts              # Main barrel export
│       ├── base/
│       │   └── form-associated.ts  # NEW: Form association mixin/base
│       └── components/
│           ├── checkbox/         # Add ElementInternals
│           ├── switch/           # Add ElementInternals
│           ├── radio/            # Add ElementInternals
│           ├── select/           # Add ElementInternals
│           ├── combobox/         # Add ElementInternals
│           ├── dialog/           # Migrate to createDialogBehavior
│           ├── alert-dialog/     # Migrate to createDialogBehavior
│           ├── sheet/            # Migrate to createDialogBehavior
│           ├── drawer/           # Migrate to createDialogBehavior
│           ├── dropdown-menu/    # Migrate to createMenuBehavior
│           ├── context-menu/     # Migrate to createMenuBehavior
│           └── tabs/             # Migrate to createTabsBehavior
├── test-utils/                   # NEW: Shared test harness (US6)
│   └── src/
│       ├── index.ts              # Main exports
│       ├── keyboard.ts           # Keyboard simulation helpers
│       ├── aria.ts               # ARIA assertion helpers
│       └── component.ts          # WC/React wrapper abstraction
└── react/
    └── src/
        └── components/           # Already uses behavior primitives (reference)
```

**Structure Decision**: Monorepo structure maintained. Changes span @ds/primitives-dom (new tabs behavior), @ds/wc (form association, behavior migrations, package exports), with @ds/react serving as reference implementation.

## Complexity Tracking

No constitution violations. All changes align with existing architecture:
- Form association uses standard browser APIs (ElementInternals)
- Behavior deduplication reduces complexity by reusing existing primitives
- Tree-shaking improvements require only package.json changes
- No new dependencies introduced
