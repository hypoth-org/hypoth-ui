# Implementation Plan: Consumer Adoption Fixes

**Branch**: `028-consumer-adoption-fixes` | **Date**: 2026-03-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/028-consumer-adoption-fixes/spec.md`

## Summary

Fix 20 consumer adoption issues and 6 Alpha Policy violations found during downstream integration testing. Work is organized into 5 themes: peer dependency consistency, entry point architecture, documentation accuracy, Alpha Policy cleanup, and dependency optimization. Per the Alpha Policy, no backward-compatibility concerns apply — all changes are direct architectural corrections.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode, ES2022 target)
**Primary Dependencies**: Lit 3.1+ (WC), React 18+/19+ (adapters), Next.js 14+/15+/16+ (integration)
**Storage**: N/A (package configuration files only)
**Testing**: Vitest (unit tests), manual verification (README examples, peer dep resolution)
**Target Platform**: npm registry (published packages), Node.js/browser (consumer projects)
**Project Type**: Monorepo (pnpm workspaces)
**Performance Goals**: N/A (no runtime changes to component behavior)
**Constraints**: Non-breaking within each theme; per Alpha Policy, no migration concerns
**Scale/Scope**: 12 packages affected, ~15 files modified, 0 new runtime code

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Performance**: Removing `"use client"` from main entry reduces client bundle size for type-only imports. Moving date-fns/lucide to optional peers reduces install footprint. No runtime CSS-in-JS introduced.
- [x] **Accessibility**: No component behavior changes. Existing a11y tests unaffected.
- [x] **Customizability**: No token/CSS layer changes. Existing customization patterns preserved.
- [x] **Zero-dep Core**: Core packages remain zero-dep. Moving date-fns/lucide to optional peers improves WC package alignment with this principle.
- [x] **Web Components**: Event API unified (OPEN/CLOSE → OPEN_CHANGE across 11 components), `@deprecated` tags removed, `LightElement` alias removed. Light DOM, Lit, CSS vars all preserved. Event change is an architectural correction, not a behavioral regression.
- [x] **Dependency Management**: pnpm used. No new dependencies added. Dependencies moved to optional peers reduce mandatory footprint.
- [x] **Alpha Policy**: This feature directly enforces the Alpha Policy — removes deprecated tags, compat shims, migration docs, and alpha labels.

## Project Structure

### Documentation (this feature)

```text
specs/028-consumer-adoption-fixes/
├── plan.md              # This file
├── research.md          # Phase 0 output (7 research decisions)
├── spec.md              # Feature specification
├── checklists/
│   └── requirements.md  # Quality checklist
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (files modified, no new files created)

```text
packages/
├── react/
│   ├── src/
│   │   ├── index.ts              # Remove "use client", remove runtime re-exports (FR-004)
│   │   ├── client.ts             # Add 48+ missing component exports (FR-005, FR-008-010)
│   │   └── components/
│   │       └── ds-button.tsx     # Remove @deprecated tag (FR-003)
│   └── package.json              # Remove "(Alpha)" from description (FR-007)
├── wc/
│   ├── src/
│   │   ├── events/emit.ts        # Delete OPEN/CLOSE/BEFORE_CLOSE/CLICK constants (FR-014)
│   │   ├── base/ds-element.ts    # Remove LightElement alias (FR-015)
│   │   ├── base/index.ts         # Remove LightElement re-export
│   │   ├── index.ts              # Remove LightElement re-export
│   │   ├── core.ts               # Remove LightElement re-export
│   │   └── components/           # Migrate OPEN/CLOSE → OPEN_CHANGE (FR-014)
│   │       ├── sheet/sheet.ts
│   │       ├── drawer/drawer.ts
│   │       ├── alert-dialog/alert-dialog.ts
│   │       ├── dropdown-menu/dropdown-menu.ts
│   │       ├── context-menu/context-menu.ts
│   │       ├── popover/popover.ts
│   │       ├── combobox/combobox.ts
│   │       ├── hover-card/hover-card.ts
│   │       ├── collapsible/collapsible.ts
│   │       ├── date-picker/date-picker.ts
│   │       └── menu/menu.ts
│   ├── tests/base/ds-element.test.ts  # Remove LightElement compat test
│   └── package.json              # Move date-fns/lucide to optional peers (FR-011), remove "(Alpha)"
├── next/
│   └── package.json              # Add next ^16 to peer dep range (FR-001), remove "(Alpha)"
├── css/
│   └── src/layers/utilities.css  # Remove "legacy/compat" comments (FR-016)
├── primitives-dom/
│   └── src/events/README.md      # Rewrite without migration framing (FR-018)
├── docs-content/
│   └── governance/
│       └── deprecations.mdx      # Remove or archive (FR-017)
├── tokens/package.json           # Remove "(Alpha)"
├── cli/package.json              # Remove "(Alpha)"
├── docs-core/package.json        # Remove "(Alpha)"
├── docs-renderer-next/package.json # Remove "(Alpha)"
├── test-utils/package.json       # Remove "(Alpha)"
├── a11y-audit/package.json       # Remove "(Alpha)"
└── [all other packages]/package.json  # Remove "(Alpha)" where present

tooling/scripts/new-component.ts   # Rename LightElement → DSElement (FR-015)
CONTRIBUTING.md                    # Rename LightElement → DSElement (FR-015)
README.md                         # Rewrite code examples, remove alpha notice (FR-002,006,007,012)
CHANGELOG.md                      # Remove "Breaking Changes" section (Alpha Policy)
```

**Structure Decision**: No new files or directories. All changes modify existing files in the established monorepo structure. The deprecation policy doc (`packages/docs-content/governance/deprecations.mdx`) is deleted, not archived, since `.archive/governance/` already contains the full governance package.

## Implementation Themes

### Theme 1: Peer Dependency Consistency (FR-001, FR-013)

**Scope**: Update peer dependency ranges across all packages for consistent framework support.

**Changes**:
- `packages/next/package.json`: Add `|| ^16.0.0` to the `next` peer dep range
- Audit all packages: ensure React `^18.0.0 || ^19.0.0` and Next.js `^14.0.0 || ^15.0.0 || ^16.0.0` are consistent where applicable

**Risk**: Low. Widening peer dep ranges is additive.

### Theme 2: Entry Point Architecture (FR-004, FR-005, FR-008, FR-009, FR-010)

**Scope**: Restructure `@hypoth-ui/react` entry points so main exports types only and `/client` exports all runtime components.

**Changes**:

1. **`packages/react/src/index.ts`**:
   - Remove `"use client"` directive (line 1)
   - Remove the comment block explaining the directive (lines 3-14)
   - Remove all runtime `export { Component }` statements (lines 189-672)
   - Keep all `export type { ... }` statements (lines 16-188)
   - Keep pure utility re-exports that are server-safe: `composeEventHandlers`, `mergeClassNames`, `mergeStyles`, `mergeProps` (pure functions, no hooks/DOM)
   - Keep server-safe theme utilities (no `"use client"` in source): `getThemeScriptContent`, `getThemeScriptTag`, `getThemeScriptProps`, `parseThemeCookie`, `getSystemColorMode`, `syncThemeStorage` — these are SSR utilities used in Server Components and `layout.tsx`

2. **`packages/react/src/client.ts`**:
   - Add all 48+ missing runtime component exports (see research.md R5 for full list)
   - Organize by category matching current index.ts structure: form controls, overlays, menus, advanced inputs, structure, layout, theme, compound, hooks, primitives

**Key insight**: Each component file already has its own `"use client"` directive. Removing it from the barrel file doesn't break module resolution — consumers importing runtime components from `/client` still get the client boundary from individual files.

**Risk**: Medium. Large diff in client.ts. Mitigated by copying the exact export statements from index.ts.

### Theme 3: Documentation Accuracy (FR-002, FR-006, FR-007, FR-012)

**Scope**: Fix all README code examples, remove alpha language from README and all package descriptions.

**Changes**:

1. **`README.md`**:
   - Getting Started: Change `import { Button } from '@hypoth-ui/react'` to `import { DsButton } from '@hypoth-ui/react/client'`
   - Getting Started: Update usage example to use `<DsButton>` with `onPress`
   - React Quick-Start: Change `<Dialog>` to `<Dialog.Root>`, import from `/client`
   - Next.js example: Update `Button` import to `DsButton` from `/client`
   - Remove Alpha badge (line 5)
   - Remove Alpha Notice section (lines 190-192)

2. **Package descriptions**: Remove "(Alpha)" from 12 package.json files

3. **`CHANGELOG.md`**: Remove "Breaking Changes" section header and "No breaking changes yet (pre-1.0)" line

**Risk**: Low. Documentation-only changes.

### Theme 4: Alpha Policy Cleanup (FR-003, FR-014, FR-015, FR-016, FR-017, FR-018)

**Scope**: Remove all `@deprecated` tags, backward-compat aliases, "legacy" labels, and consumer governance docs.

**Changes**:

1. **Remove `@deprecated` tag from DsButton**:
   - `packages/react/src/components/ds-button.tsx`: Remove `@deprecated` from DsButton JSDoc

2. **Complete OPEN/CLOSE → OPEN_CHANGE migration and delete dead constants**:
   - Migrate 11 WC components from separate `StandardEvents.OPEN`/`StandardEvents.CLOSE` calls to unified `StandardEvents.OPEN_CHANGE` with `{ detail: { open: true/false } }`:
     - `packages/wc/src/components/sheet/sheet.ts` (4 calls)
     - `packages/wc/src/components/drawer/drawer.ts` (4 calls)
     - `packages/wc/src/components/alert-dialog/alert-dialog.ts` (3 calls)
     - `packages/wc/src/components/dropdown-menu/dropdown-menu.ts` (4 calls)
     - `packages/wc/src/components/context-menu/context-menu.ts` (4 calls)
     - `packages/wc/src/components/popover/popover.ts` (3 calls)
     - `packages/wc/src/components/combobox/combobox.ts` (3 calls)
     - `packages/wc/src/components/hover-card/hover-card.ts` (3 calls)
     - `packages/wc/src/components/collapsible/collapsible.ts` (1 call)
     - `packages/wc/src/components/date-picker/date-picker.ts` (3 calls)
     - `packages/wc/src/components/menu/menu.ts` (3 calls)
   - Pattern: `emitEvent(this, StandardEvents.OPEN)` → `emitEvent(this, StandardEvents.OPEN_CHANGE, { detail: { open: true } })`
   - Pattern: `emitEvent(this, StandardEvents.CLOSE)` → `emitEvent(this, StandardEvents.OPEN_CHANGE, { detail: { open: false } })`
   - For cancelable close patterns: add `cancelable: true` and `reason` detail (matching Dialog pattern)
   - After all migrations: delete OPEN, CLOSE, BEFORE_CLOSE, CLICK constants from `packages/wc/src/events/emit.ts`
   - Update React event mapping if any React adapters reference the old event names

2. **Remove LightElement alias**:
   - `packages/wc/src/base/ds-element.ts`: Remove `export { DSElement as LightElement }`
   - `packages/wc/src/base/index.ts`: Remove `LightElement` re-export
   - `packages/wc/src/index.ts`: Remove `LightElement` re-export
   - `packages/wc/src/core.ts`: Remove `LightElement` re-export
   - `tooling/scripts/new-component.ts`: Change `LightElement` → `DSElement`
   - `CONTRIBUTING.md`: Change `LightElement` → `DSElement`
   - `packages/wc/tests/base/ds-element.test.ts`: Remove backward-compat alias test

3. **Remove "legacy/compat" CSS labels**:
   - `packages/css/src/layers/utilities.css`: Remove "Legacy spacing utilities (kept for compatibility)" and "Flexbox utilities (legacy, kept for compatibility)" comments. Keep the utility classes themselves.

4. **Remove governance docs**:
   - Delete `packages/docs-content/governance/deprecations.mdx`

5. **Rewrite events README**:
   - `packages/primitives-dom/src/events/README.md`: Remove "Migration from Legacy Events" section. Document current event API only.

**Risk**: Medium. OPEN_CHANGE migration touches 11 component files (~35 emitEvent calls) — mechanical but needs careful cancelable/reason handling to match Dialog pattern. LightElement removal needs migration of tooling/docs references. Run existing tests after each component migration to catch regressions.

### Theme 5: Dependency Optimization (FR-011)

**Scope**: Move date-fns, @date-fns/tz, and lucide from direct dependencies to optional peer dependencies in `@hypoth-ui/wc`.

**Changes**:

1. **`packages/wc/package.json`**:
   - Move from `dependencies` to `peerDependencies`:
     ```json
     "date-fns": "^4.1.0",
     "@date-fns/tz": "^1.2.0",
     "lucide": "^0.468.0"
     ```
   - Add `peerDependenciesMeta`:
     ```json
     "peerDependenciesMeta": {
       "date-fns": { "optional": true },
       "@date-fns/tz": { "optional": true },
       "lucide": { "optional": true }
     }
     ```
   - Keep in `devDependencies` for internal development/testing

**Risk**: Medium. Components that use these deps (DatePicker, TimePicker, Icon) will fail at runtime if consumer hasn't installed them. No built-in error message mechanism exists — this is acceptable per Alpha Policy (no users yet), but should be revisited at beta.
