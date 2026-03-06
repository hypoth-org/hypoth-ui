# Implementation Plan: Design System Quality Overhaul

**Branch**: `023-quality-overhaul` | **Date**: 2026-01-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/023-quality-overhaul/spec.md`

## Summary

Complete remediation of audit findings (P0-P2) focusing on:
1. **A11y Test Coverage**: Extend existing a11y tests (18 files) to cover all 55 components
2. **Composite Primitives**: Add modal/popover composites leveraging existing `createOverlayBehavior`
3. **Performance & Code Quality**: Fix scroll-area layout thrashing, React handler stability, ARIA utilities

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode, ES2022 target)
**Primary Dependencies**: Lit 3.1+ (WC), React 18+ (adapters), jest-axe 8.x (a11y testing)
**Storage**: N/A (stateless UI components)
**Testing**: Vitest (unit/a11y), Playwright (e2e), axe-core via jest-axe
**Target Platform**: Browser (ESM), Next.js 14+ (SSR/RSC compatible)
**Project Type**: Monorepo (packages/wc, packages/react, packages/primitives-dom)
**Performance Goals**: 60fps scroll, <100ms component render, tree-shakeable exports
**Constraints**: Zero runtime deps for @hypoth-ui/primitives-dom; Lit-only for @hypoth-ui/wc
**Scale/Scope**: 55 WC components, ~40 React adapters, 37 existing primitives

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime CSS-in-JS; minimal client boundaries; SSR-friendly
  - All components use CSS variables, no CSS-in-JS runtime
  - Composites are tree-shakeable pure functions
  - Scroll-area fix eliminates layout thrashing
- [x] **Accessibility**: WCAG 2.1 AA plan; APG patterns identified; a11y testing strategy defined
  - Extending axe-core tests to all 55 components
  - APG patterns documented in existing components (dialog, menu, tabs, etc.)
  - Manual testing checklist to be created per component
- [x] **Customizability**: Uses DTCG tokens; CSS layers for overrides; no inline styles blocking customization
  - Components consume tokens via CSS custom properties
  - No changes to styling strategy required
- [x] **Zero-dep Core**: Core packages (`@hypoth-ui/tokens`, `@hypoth-ui/css`, `@hypoth-ui/primitives-dom`) have no runtime deps
  - New composites add zero dependencies to @hypoth-ui/primitives-dom
  - ARIA utilities are pure functions
- [x] **Web Components**: Light DOM default; Lit-based; theme via CSS vars
  - No changes to Light DOM strategy
  - Components already use Light DOM
- [x] **Dependency Management**: Latest stable versions verified; pnpm used; bundle impact assessed
  - jest-axe 8.x already in devDependencies
  - No new runtime dependencies added

## Project Structure

### Documentation (this feature)

```text
specs/023-quality-overhaul/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (minimal - no new entities)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (TypeScript interfaces)
├── progress.md          # 128 requirement tracking items
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
packages/
├── primitives-dom/
│   └── src/
│       ├── overlay/
│       │   └── create-overlay-behavior.ts  # EXISTING - already bundles focus-trap + dismissable
│       ├── composites/                      # NEW - higher-level composites
│       │   ├── modal-overlay.ts            # Wraps overlay-behavior + presence animation
│       │   ├── popover-overlay.ts          # Wraps overlay-behavior + anchor positioning
│       │   └── selectable-list.ts          # Bundles roving-focus + type-ahead + selection
│       ├── aria/
│       │   ├── live-region.ts              # EXISTING
│       │   ├── id-generator.ts             # NEW - generateAriaId()
│       │   └── describedby.ts              # NEW - connectAriaDescribedBy()
│       └── index.ts                        # Updated exports
│
├── wc/
│   ├── src/
│   │   ├── base/
│   │   │   ├── ds-element.ts               # EXISTING
│   │   │   └── component-controller.ts     # NEW (P2) - lifecycle mixin
│   │   └── components/                      # 55 existing components
│   │       ├── scroll-area/
│   │       │   └── scroll-area-thumb.ts    # FIX - cache dimensions
│   │       └── ...
│   └── tests/
│       └── a11y/
│           ├── dialog.test.ts              # EXISTING (18 test files)
│           ├── accordion.test.ts           # NEW - remaining ~37 components
│           └── ...
│
└── react/
    └── src/
        ├── components/
        │   └── input.tsx                   # FIX - useCallback for handlers
        └── ...
```

**Structure Decision**: Extends existing monorepo structure. New composites added to `packages/primitives-dom/src/composites/`. A11y tests added to existing `packages/wc/tests/a11y/`. No new packages created.

## Complexity Tracking

> No constitution violations requiring justification. All changes align with existing patterns.

| Decision | Justification |
|----------|---------------|
| Use existing `createOverlayBehavior` | Already bundles focus-trap + dismissable-layer; composites wrap it |
| Composites in primitives-dom | Follows zero-runtime-dep constraint; pure functions |
| A11y tests in existing directory | Consistent with current test organization |

## Phase Strategy

Based on spec's "Phased with Checkpoints" approach:

### Phase 0: A11y Test Coverage + Overlay Composites (P0)
- Extend a11y tests to all 55 components (~37 new test files)
- Create `createModalOverlay` composite (wraps createOverlayBehavior + presence)
- Create `createPopoverOverlay` composite (wraps createOverlayBehavior + anchor positioning)
- CI gate: All a11y tests passing

### Phase 1: Selectable List + Performance + ARIA Utils + React Fixes (P1)
- Create `createSelectableList` composite
- Fix scroll-area dimension caching
- Extract ARIA utilities (generateAriaId, connectAriaDescribedBy, announceToScreenReader)
- Fix React handler recreation patterns
- Add missing component manifests
- Add a11y dev warnings
- CI gate: Performance metrics met, manifests validate

### Phase 2: ComponentController + High Contrast (P2)
- Create ComponentController mixin
- High contrast mode testing and fixes
- CI gate: All components pass high contrast visual tests

## Key Implementation Decisions

### 1. Overlay Composites Design

The existing `createOverlayBehavior` already handles:
- Open/close state management
- Focus trapping (modal mode)
- Dismissal (Escape, outside click)
- ARIA props computation

New composites add:
- **createModalOverlay**: `createOverlayBehavior({ modal: true })` + presence animation hooks
- **createPopoverOverlay**: `createOverlayBehavior({ modal: false })` + anchor positioning

### 2. A11y Test Pattern

Follow existing pattern from `tests/a11y/dialog.test.ts`:
```typescript
import { axe, toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);

describe("ComponentName accessibility", () => {
  // Test default state
  // Test variant states (disabled, loading, sizes)
  // Test ARIA attributes
  // Test keyboard interaction
  // Test focus management
});
```

### 3. Scroll-Area Performance Fix

Replace per-frame `getBoundingClientRect()` with:
- ResizeObserver for dimension caching
- Cached values used in scroll handler
- Recalculation only on resize events

### 4. React Handler Stability

Pattern to apply across adapters:
```typescript
// Before: Handler recreated every render
const handleChange = (e) => { ... };

// After: Stable reference
const handleChange = useCallback((e) => {
  onChangeRef.current?.(e);
}, []); // Empty deps, uses ref for latest callback
```
