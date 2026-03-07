# Tasks: DX Deficiency Fixes

**Input**: Design documents from `/specs/027-dx-deficiency-fixes/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks included (not explicitly requested in spec).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo**: `packages/{package-name}/` — existing pnpm workspace structure

---

## Phase 1: User Story 1 - Install and import without errors (Priority: P1) MVP

**Goal**: Developers can install @hypoth-ui packages in Next.js 15 + React 19 projects without peer dependency errors, and import from `@hypoth-ui/react` in Server Components without build failures.

**Independent Test**: Install `@hypoth-ui/react` in a fresh Next.js 15 + React 19 project, import Button in a page component, verify `pnpm build` succeeds.

### Implementation for User Story 1

- [x] T001 [P] [US1] Fix `workspace:*` in peerDependencies — change `"@hypoth-ui/wc": "workspace:*"` to `"@hypoth-ui/wc": ">=0.1.0"` in `packages/react/package.json` (line 47 in peerDependencies)
- [x] T002 [P] [US1] Widen React peer dep range — change `"react": "^18.0.0"` to `"react": "^18.0.0 || ^19.0.0"` and same for `react-dom` in `packages/react/package.json` peerDependencies
- [x] T003 [P] [US1] Widen Next.js peer dep range — verify `"next": "^14.0.0 || ^15.0.0"` and `"react": "^18.0.0 || ^19.0.0"` (and react-dom) are set in `packages/next/package.json` peerDependencies (may already be done)
- [x] T004 [US1] Add `"use client";` directive as line 1 of `packages/react/src/index.ts` (before all imports and exports)
- [x] T005 [US1] Verify build passes — run `pnpm build` and `pnpm test` from repo root to confirm no regressions

**Checkpoint**: Peer deps are valid semver, "use client" prevents Server Component errors. US1 is complete and shippable as a patch release.

---

## Phase 2: User Story 2 - One Button, one API (Priority: P2)

**Goal**: `Button` resolves to exactly one component (headless) from `@hypoth-ui/react`. The WC-wrapping variant is renamed to `DsButton` and only available from `@hypoth-ui/react/client`.

**Independent Test**: Import `Button` from `@hypoth-ui/react` — get headless button. Import from `@hypoth-ui/react/client` — `Button` does not exist, `DsButton` does.

### Implementation for User Story 2

- [x] T006 [US2] Rename WC wrapper component file from `packages/react/src/components/button.tsx` to `packages/react/src/components/ds-button.tsx` — update the internal component name from `Button` to `DsButton` and export name from `Button` to `DsButton`, type from `ButtonProps` to `DsButtonProps`
- [x] T007 [US2] Update `packages/react/src/client.ts` — change `export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from "./components/button.js"` to `export { DsButton, type DsButtonProps, type ButtonVariant, type ButtonSize } from "./components/ds-button.js"`
- [x] T008 [US2] Update `packages/react/src/index.ts` — remove the `LegacyButton` re-export line (`export { Button as LegacyButton } from "./components/button.js"`) and remove legacy type re-exports (`LegacyButtonProps`, `ButtonVariant`, `ButtonSize` from `./components/button.js`). Keep the headless `Button` export from `./components/button/index.js` unchanged.
- [x] T009 [US2] Search for any internal imports of the old `./components/button.js` path across the monorepo (demo apps, tests, CLI templates) and update them to use either headless `Button` from `@hypoth-ui/react` or `DsButton` from `@hypoth-ui/react/client` as appropriate
- [x] T010 [US2] Verify build passes — run `pnpm build` and `pnpm test` from repo root

**Checkpoint**: Single canonical `Button` export. WC wrapper available as `DsButton` from client entry only.

---

## Phase 3: User Story 3 - Consistent event prop naming (Priority: P2)

**Goal**: All React adapter event props follow the `on` + PascalCase convention. The mapping is documented in CONTRIBUTING.md.

**Independent Test**: Grep all React component files for event prop declarations and verify they match the convention in `contracts/event-naming.md`.

### Implementation for User Story 3

- [x] T011 [US3] Audit all React component event props in `packages/react/src/components/` — compare each component's event props against the canonical event map in `specs/027-dx-deficiency-fixes/contracts/event-naming.md`. Record any deviations. (Research shows most are already correct; primary issue resolved by US2 Button rename.)
- [x] T012 [US3] Fix any event prop naming deviations found in the audit — update component interfaces and implementations. Based on research, the WC wrapper Button's `onClick` is the only inconsistency, and that is resolved by the DsButton rename in US2.
- [x] T013 [P] [US3] Add event naming convention section to `CONTRIBUTING.md` — include the mapping rule (`ds:kebab-case` → `onPascalCase`), the complete event map table from `contracts/event-naming.md`, and the 5 rules for new components
- [x] T014 [US3] Verify build passes — run `pnpm build` and `pnpm test` from repo root

**Checkpoint**: Event naming is consistent across all React adapters and documented for future contributors.

---

## Phase 4: User Story 4 - Clean dependency graph (Priority: P3)

**Goal**: `@hypoth-ui/css` does not list `@hypoth-ui/wc` as a runtime dependency. No circular dependency warnings when installing.

**Independent Test**: Check `packages/css/package.json` — `@hypoth-ui/wc` is in devDependencies only.

### Implementation for User Story 4

- [x] T015 [US4] Move `@hypoth-ui/wc` from `dependencies` to `devDependencies` in `packages/css/package.json` (currently at line 36 in dependencies)
- [x] T016 [US4] Verify CSS package builds correctly — run `pnpm --filter @hypoth-ui/css build` to confirm the PostCSS build still resolves WC component CSS from the workspace

**Checkpoint**: No circular dependency. CSS package is self-contained at runtime.

---

## Phase 5: User Story 5 - Selective component loading is documented (Priority: P3)

**Goal**: README documents `DsLoader`'s `include` and `exclude` props with usage examples.

**Independent Test**: Read README.md and find at least two code examples for selective loading.

### Implementation for User Story 5

- [x] T017 [P] [US5] Add selective loading section to `README.md` — under the Next.js quick-start section, add examples for `<DsLoader include={[...]} />` and `<DsLoader exclude={[...]} />`, document that `include` takes precedence, and mention `debug` and `onLoad` props
- [x] T018 [P] [US5] Add selective loading section to `packages/next/README.md` — add the same documentation with more detail including all available component tags and the `ComponentTag` type

**Checkpoint**: DsLoader selective loading is discoverable in published documentation.

---

## Phase 6: User Story 6 - Empty state pattern available (Priority: P4)

**Goal**: Developers can import and render an `EmptyState` compound component with Icon, Title, Description, and Action sub-components.

**Independent Test**: Import `EmptyState` from `@hypoth-ui/react`, render with all sub-components, verify accessible markup.

### Implementation for User Story 6

- [x] T019 [US6] Create EmptyState WC component in `packages/wc/src/components/empty-state/empty-state.ts` — Lit-based, Light DOM, registers `ds-empty-state`, `ds-empty-state-icon`, `ds-empty-state-title`, `ds-empty-state-description`, `ds-empty-state-action` tags per contract in `contracts/empty-state.md`
- [x] T020 [P] [US6] Add EmptyState CSS styles to `packages/css/src/layers/components.css` — add `.ds-empty-state` (centered flex column), `.ds-empty-state-icon` (decorative container), `.ds-empty-state-title` (heading), `.ds-empty-state-description` (muted body), `.ds-empty-state-action` (CTA container) using design tokens from contract
- [x] T021 [US6] Create EmptyState React compound component in `packages/react/src/components/empty-state/index.tsx` — implement `EmptyState`, `EmptyState.Icon`, `EmptyState.Title`, `EmptyState.Description`, `EmptyState.Action` sub-components per React API contract. Use `<section role="status">` for container, `aria-hidden="true"` on Icon, `<h3>` for Title, `<p>` for Description.
- [x] T022 [US6] Export EmptyState from `packages/react/src/index.ts` — add `export { EmptyState, type EmptyStateProps } from "./components/empty-state/index.js"` and from `packages/react/src/client.ts` if a WC-wrapping version is created
- [x] T023 [P] [US6] Register EmptyState WC in package exports — add `ds-empty-state` to the WC registry in `packages/wc/src/` (feedback.ts or data-display.ts depending on categorization) so DsLoader can discover it
- [x] T024 [P] [US6] Create EmptyState CLI template in `packages/cli/templates/empty-state/` — add React template file and register in `packages/cli/registry/components.json`
- [x] T025 [P] [US6] Create EmptyState component manifest entry — add JSON manifest to the component registry with `id: "empty-state"`, `status: "alpha"`, `platforms: ["wc", "react"]`, `a11y: { apgPattern: "custom", keyboardSupport: [], knownLimitations: [] }`, `tokensUsed: ["color.text.muted", "color.text.default", "color.icon.muted", "spacing.component.lg", "typography.heading.sm", "typography.body.md"]` per constitution Component Contract
- [x] T026 [US6] Add axe-core a11y test for EmptyState — create test in `packages/react/tests/` (or colocated `__tests__/`) that renders EmptyState with all sub-components and asserts axe-core passes, verifies `role="status"` on container, `aria-hidden="true"` on Icon, semantic `<h3>` for Title, `<p>` for Description
- [x] T027 [US6] Verify EmptyState builds and renders — run `pnpm build` and `pnpm test` from repo root

**Checkpoint**: EmptyState component available in WC, React, CSS, and CLI. Accessible markup verified.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Changesets, changelog, migration docs, and final verification across all stories.

- [x] T028 Create changeset for Phase 1 patch release — `pnpm changeset` with patch bumps for `@hypoth-ui/react` and `@hypoth-ui/next` describing peer dep and "use client" fixes
- [x] T029 Create changeset for Phase 2-6 breaking release — `pnpm changeset` with minor bump for `@hypoth-ui/react` (Button rename, EmptyState addition), patch for `@hypoth-ui/css` (dep fix), `@hypoth-ui/wc` (EmptyState WC), `@hypoth-ui/cli` (EmptyState template)
- [x] T030 Document breaking changes and migration instructions — add migration table from `contracts/button-api.md` to changeset description: `Button` from client → `DsButton`, `LegacyButton` → `DsButton`
- [x] T031 [P] Create manual a11y testing checklist for EmptyState — add checklist covering: screen reader announcement of `role="status"` content, high-contrast mode visibility of all sub-components, reduced-motion compliance (no animations), icon `aria-hidden` verified with screen reader. Link checklist from EmptyState manifest entry.
- [x] T032 Run full verification — `pnpm build && pnpm test && pnpm typecheck && pnpm lint` from repo root
- [x] T033 Run quickstart.md validation — walk through quickstart.md steps and verify each phase's changes are correct

---

## Dependencies & Execution Order

### Phase Dependencies

- **US1 (Phase 1)**: No dependencies — start immediately. **This is the MVP.**
- **US2 (Phase 2)**: Depends on US1 (both modify `packages/react/src/index.ts`)
- **US3 (Phase 3)**: Depends on US2 (Button rename resolves the main event naming inconsistency)
- **US4 (Phase 4)**: Independent — can run in parallel with US2/US3 (different package)
- **US5 (Phase 5)**: Independent — can run in parallel with US2/US3/US4 (documentation only)
- **US6 (Phase 6)**: Depends on US1 (adds exports to `index.ts` which must have "use client")
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

```
US1 (P1) ─────┬──→ US2 (P2) ──→ US3 (P2) ──→ Polish
              │
              ├──→ US4 (P3) ──────────────────→ Polish
              │
              ├──→ US5 (P3) ──────────────────→ Polish
              │
              └──→ US6 (P4) ──────────────────→ Polish
```

### Parallel Opportunities

- **Within US1**: T001, T002, T003 can all run in parallel (different files/packages)
- **After US1**: US4, US5, and US6 can start in parallel with US2 (different packages/files)
- **Within US5**: T017, T018 can run in parallel (different README files)
- **Within US6**: T020, T023, T024 can run in parallel with T019 (different files)

---

## Parallel Example: User Story 1

```bash
# Launch all peer dep fixes together (different package.json files):
Task: "T001 Fix workspace:* in packages/react/package.json"
Task: "T002 Widen React peer deps in packages/react/package.json"
Task: "T003 Widen Next.js peer deps in packages/next/package.json"

# Then sequentially:
Task: "T004 Add use client to packages/react/src/index.ts"
Task: "T005 Verify build passes"
```

## Parallel Example: After US1 completes

```bash
# These can all run in parallel since they touch different packages/files:
Task: "US2 — Button unification (packages/react/src/components/)"
Task: "US4 — CSS dep fix (packages/css/package.json)"
Task: "US5 — DsLoader docs (README.md, packages/next/README.md)"
Task: "US6 — EmptyState (packages/wc/, packages/react/, packages/css/)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: US1 (peer deps + "use client")
2. **STOP and VALIDATE**: Verify install works in Next.js 15 + React 19
3. Create changeset (T028), push, merge version PR, publish patch release
4. This unblocks all future adopters immediately

### Incremental Delivery

1. US1 → Patch release (unblocks adoption)
2. US2 + US3 + US4 → Breaking alpha release (API consolidation)
3. US5 + US6 → Patch release (docs + new component)
4. Each release is independently valuable

### Parallel Strategy

With multiple developers working simultaneously:
1. All start on US1 together (small, fast)
2. Once US1 is done:
   - Developer A: US2 → US3 (sequential, same files)
   - Developer B: US4 + US5 (quick, independent)
   - Developer C: US6 (new component, independent)
3. All converge for Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- T001 and T002 modify the same file (`packages/react/package.json`) but different sections — can be done in one edit
- US2 renames a file and updates imports — do T006 first, then T007-T009
- US3 audit (T011) may find no changes needed beyond what US2 resolved — this is expected
- US4 is a single-line change (T015) but verify build separately (T016)
- Commit after each phase checkpoint
