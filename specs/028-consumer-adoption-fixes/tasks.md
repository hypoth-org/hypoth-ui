# Tasks: Consumer Adoption Fixes

**Input**: Design documents from `/specs/028-consumer-adoption-fixes/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No new project setup needed — all changes modify existing files in the established monorepo.

- [X] T001 Create feature branch `028-consumer-adoption-fixes` from `main`

---

## Phase 2: Foundational (Peer Dependency Consistency)

**Purpose**: Fix peer dependency ranges across all packages. MUST be complete before user story work begins to ensure consistent dependency resolution.

- [X] T002 [P] Add `|| ^16.0.0` to the `next` peer dep range in `packages/next/package.json`
- [X] T003 [P] Audit all packages for React peer dep consistency — ensure `^18.0.0 || ^19.0.0` wherever React is a peer dep
- [X] T004 [P] Audit all packages for Next.js peer dep consistency — ensure `^14.0.0 || ^15.0.0 || ^16.0.0` wherever Next.js is a peer dep

**Checkpoint**: All peer dep ranges are consistent across the monorepo. `pnpm install` succeeds with no warnings.

---

## Phase 3: User Story 1 — New Consumer Gets Working Styled Components on First Try (Priority: P1) MVP

**Goal**: README Getting Started and all code examples lead to working styled output on first attempt.

**Independent Test**: Follow the README Getting Started instructions exactly in a fresh project and verify styled output renders.

### Implementation for User Story 1

- [X] T005 [US1] Update README.md Getting Started section: change `import { Button } from '@hypoth-ui/react'` to `import { DsButton } from '@hypoth-ui/react/client'`, update usage example to `<DsButton onPress={() => ...}>Click me</DsButton>`
- [X] T006 [US1] Update README.md React Quick-Start Dialog example: change `<Dialog>` to `<Dialog.Root>`, change import source to `@hypoth-ui/react/client`
- [X] T007 [US1] Update README.md Next.js example: change `Button` import to `DsButton` from `@hypoth-ui/react/client`
- [X] T008 [US1] Audit all remaining README.md code examples against actual component API surface and fix any discrepancies

**Checkpoint**: Every README code example can be copy-pasted into a compatible project and produces the documented output.

---

## Phase 4: User Story 2 — Next.js 16 Consumer Can Install Without Overrides (Priority: P1)

**Goal**: `npm install @hypoth-ui/next` works on Next.js 16 without overrides or resolutions.

**Independent Test**: Run `npm install @hypoth-ui/next` in a Next.js 16 project — no peer dependency warnings.

### Implementation for User Story 2

- [X] T009 [US2] Verify the peer dep fix from T002 (`packages/next/package.json`) is correct and complete
- [X] T010 [US2] Verify the cross-package audit from T003/T004 covers all packages that reference React or Next.js

**Checkpoint**: All packages install cleanly on Next.js 14, 15, and 16 with React 18 and 19.

---

## Phase 5: User Story 3 — Server Component Can Import Types Without Client Boundary (Priority: P1)

**Goal**: Main entry (`@hypoth-ui/react`) exports types only, no `"use client"` directive. Server Components can safely import types.

**Independent Test**: Import `type { ButtonProps }` in a Server Component — no client bundle created.

### Implementation for User Story 3

- [X] T011 [US3] Remove `"use client"` directive (line 1) and the explanatory comment block from `packages/react/src/index.ts`
- [X] T012 [US3] Remove all runtime `export { Component }` statements from `packages/react/src/index.ts` (lines 189-672), keeping only `export type { ... }` statements, pure utility function re-exports (`composeEventHandlers`, `mergeClassNames`, `mergeStyles`, `mergeProps`), and server-safe theme utilities that lack `"use client"` directives (`getThemeScriptContent`, `getThemeScriptTag`, `getThemeScriptProps`, `parseThemeCookie`, `getSystemColorMode`, `syncThemeStorage`)

**Checkpoint**: `packages/react/src/index.ts` contains only type exports and pure utility functions. No `"use client"` directive.

---

## Phase 6: User Story 4 — Consumer Sees No Contradictory IDE Warnings (Priority: P2)

**Goal**: No `@deprecated` warnings on recommended components, no alpha language on 1.0.0 packages.

**Independent Test**: Import `DsButton` in VS Code — no strikethrough or deprecation tooltip.

### Implementation for User Story 4

- [X] T013 [P] [US4] Remove `@deprecated` JSDoc tag from `DsButton` in `packages/react/src/components/ds-button.tsx`
- [X] T014 [P] [US4] Remove "(Alpha)" from description in `packages/react/package.json`
- [X] T015 [P] [US4] Remove "(Alpha)" from description in `packages/next/package.json`
- [X] T016 [P] [US4] Remove "(Alpha)" from description in `packages/wc/package.json`
- [X] T017 [P] [US4] Remove "(Alpha)" from description in `packages/css/package.json`
- [X] T018 [P] [US4] Remove "(Alpha)" from description in `packages/tokens/package.json`
- [X] T019 [P] [US4] Remove "(Alpha)" from description in `packages/cli/package.json`
- [X] T020 [P] [US4] Remove "(Alpha)" from description in `packages/primitives-dom/package.json`
- [X] T021 [P] [US4] Remove "(Alpha)" from description in `packages/docs-core/package.json`
- [X] T022 [P] [US4] Remove "(Alpha)" from description in `packages/docs-content/package.json`
- [X] T023 [P] [US4] Remove "(Alpha)" from description in `packages/docs-renderer-next/package.json`
- [X] T024 [P] [US4] Remove "(Alpha)" from description in `packages/test-utils/package.json`
- [X] T025 [P] [US4] Remove "(Alpha)" from description in `packages/a11y-audit/package.json`
- [X] T026 [US4] Remove Alpha badge (line 5) and Alpha Notice section from `README.md`

**Checkpoint**: Zero `@deprecated` warnings on `DsButton`, zero "(Alpha)" in any package description, no alpha language in README.

---

## Phase 7: User Story 5 — All Interactive Components Available from `/client` Entry (Priority: P2)

**Goal**: Every interactive runtime component is importable from `@hypoth-ui/react/client`.

**Independent Test**: Import EmptyState, Field, Label, FieldError, Dialog, Checkbox, Switch, Select, Menu, Tabs from `/client` — all render correctly.

### Implementation for User Story 5

- [X] T027 [US5] Add all missing runtime component exports to `packages/react/src/client.ts` — form controls: Field, Label, FieldDescription, FieldError, Textarea, Checkbox, RadioGroup, Radio, Switch
- [X] T028 [P] [US5] Add missing overlay exports to `packages/react/src/client.ts` — Dialog, Popover, PopoverContent, Tooltip, TooltipContent, AlertDialog, Sheet, Drawer
- [X] T029 [P] [US5] Add missing menu exports to `packages/react/src/client.ts` — Menu, Select, Combobox, DropdownMenu, ContextMenu
- [X] T030 [P] [US5] Add missing advanced input exports to `packages/react/src/client.ts` — DatePicker, Slider, NumberInput, FileUpload, TimePicker, PinInput
- [X] T031 [P] [US5] Add missing structure exports to `packages/react/src/client.ts` — Card, Separator, AspectRatio, Collapsible, Tabs, Accordion, HoverCard, NavigationMenu, ScrollArea, Breadcrumb, Pagination, Stepper, Command
- [X] T032 [P] [US5] Add missing layout exports to `packages/react/src/client.ts` — Flow, Container, Grid, LayoutBox, Page, Section, AppShell, Spacer, Center, Split, Wrap, Stack, Inline
- [X] T033 [P] [US5] Add missing client-only theme exports to `packages/react/src/client.ts` — ThemeProvider, DensityProvider, useTheme, useThemeState, useColorMode, useDensity, useDensityContext
- [X] T033b [P] [US5] Verify server-safe theme utilities remain exported from `packages/react/src/index.ts` after T012 strips runtime re-exports — keep: getThemeScriptContent, getThemeScriptTag, getThemeScriptProps, parseThemeCookie, getSystemColorMode, syncThemeStorage (these files have no "use client" directive and are designed for SSR)
- [X] T034 [P] [US5] Add missing compound/hooks/primitives exports to `packages/react/src/client.ts` — EmptyState and parts, useStableId, useStableIds, useScopedIdGenerator, useConditionalId, Presence, usePresence

**Checkpoint**: Every runtime component from `index.ts` is also exported from `client.ts`. Zero components require mixed import paths.

---

## Phase 8: User Story 6 — Codebase Contains No Alpha Policy Violations (Priority: P2)

**Goal**: Remove all `@deprecated` tags, backward-compat aliases, "legacy" labels, migration docs, and incomplete event refactors.

**Independent Test**: Search for `@deprecated`, "backwards compatibility", "legacy", "kept for compatibility", and "migration" in active packages — zero results.

### FR-014: Complete OPEN/CLOSE → OPEN_CHANGE Migration

- [X] T035 [P] [US6] Migrate `packages/wc/src/components/sheet/sheet.ts`: replace `emitEvent(this, StandardEvents.OPEN)` with `emitEvent(this, StandardEvents.OPEN_CHANGE, { detail: { open: true } })` and `emitEvent(this, StandardEvents.CLOSE)` with `emitEvent(this, StandardEvents.OPEN_CHANGE, { detail: { open: false } })`. Add `cancelable: true` and `reason` detail for cancelable close patterns (matching Dialog pattern).
- [X] T036 [P] [US6] Migrate `packages/wc/src/components/drawer/drawer.ts`: same OPEN/CLOSE → OPEN_CHANGE pattern as T035
- [X] T037 [P] [US6] Migrate `packages/wc/src/components/alert-dialog/alert-dialog.ts`: same OPEN/CLOSE → OPEN_CHANGE pattern as T035
- [X] T038 [P] [US6] Migrate `packages/wc/src/components/dropdown-menu/dropdown-menu.ts`: same OPEN/CLOSE → OPEN_CHANGE pattern as T035
- [X] T039 [P] [US6] Migrate `packages/wc/src/components/context-menu/context-menu.ts`: same OPEN/CLOSE → OPEN_CHANGE pattern as T035
- [X] T040 [P] [US6] Migrate `packages/wc/src/components/popover/popover.ts`: same OPEN/CLOSE → OPEN_CHANGE pattern as T035
- [X] T041 [P] [US6] Migrate `packages/wc/src/components/combobox/combobox.ts`: same OPEN/CLOSE → OPEN_CHANGE pattern as T035
- [X] T042 [P] [US6] Migrate `packages/wc/src/components/hover-card/hover-card.ts`: same OPEN/CLOSE → OPEN_CHANGE pattern as T035
- [X] T043 [P] [US6] Migrate `packages/wc/src/components/collapsible/collapsible.ts`: same OPEN/CLOSE → OPEN_CHANGE pattern as T035
- [X] T044 [P] [US6] Migrate `packages/wc/src/components/date-picker/date-picker.ts`: same OPEN/CLOSE → OPEN_CHANGE pattern as T035
- [X] T045 [P] [US6] Migrate `packages/wc/src/components/menu/menu.ts`: same OPEN/CLOSE → OPEN_CHANGE pattern as T035
- [X] T046 [US6] Delete OPEN, CLOSE, BEFORE_CLOSE, and CLICK constants from `packages/wc/src/events/emit.ts` (depends on T035-T045 completing all migrations)
- [X] T047 [US6] Check React event mapping — update any React adapters that reference the old OPEN/CLOSE event names to use OPEN_CHANGE

### FR-015: Remove LightElement Alias

- [X] T048 [P] [US6] Remove `export { DSElement as LightElement }` from `packages/wc/src/base/ds-element.ts`
- [X] T049 [P] [US6] Remove `LightElement` re-export from `packages/wc/src/base/index.ts`
- [X] T050 [P] [US6] Remove `LightElement` re-export from `packages/wc/src/index.ts`
- [X] T051 [P] [US6] Remove `LightElement` re-export from `packages/wc/src/core.ts`
- [X] T052 [P] [US6] Rename `LightElement` → `DSElement` in `tooling/scripts/new-component.ts`
- [X] T053 [P] [US6] Rename `LightElement` → `DSElement` in `CONTRIBUTING.md`
- [X] T054 [US6] Remove backward-compat alias test from `packages/wc/tests/base/ds-element.test.ts`

### FR-016, FR-017, FR-018: Remove Legacy Labels & Governance Docs

- [X] T055 [P] [US6] Remove "Legacy spacing utilities (kept for compatibility)" and "Flexbox utilities (legacy, kept for compatibility)" comments from `packages/css/src/layers/utilities.css` (keep the utility classes)
- [X] T056 [P] [US6] Delete `packages/docs-content/governance/deprecations.mdx`
- [X] T057 [P] [US6] Rewrite `packages/primitives-dom/src/events/README.md` to document current event API only — remove "Migration from Legacy Events" section and migration framing

**Checkpoint**: Zero `@deprecated` tags, zero compat aliases, zero "legacy" labels, zero migration docs in active packages. All 11 WC components use OPEN_CHANGE pattern consistently.

---

## Phase 9: User Story 7 — Minimal Dependency Footprint for Basic Usage (Priority: P3)

**Goal**: Consumers using only basic components don't pull in date-fns or lucide.

**Independent Test**: Install `@hypoth-ui/wc` — `date-fns` and `lucide` are not required unless explicitly opted in.

### Implementation for User Story 7

- [X] T058 [US7] Move `date-fns`, `@date-fns/tz`, and `lucide` from `dependencies` to `peerDependencies` in `packages/wc/package.json`
- [X] T059 [US7] Add `peerDependenciesMeta` to `packages/wc/package.json` marking `date-fns`, `@date-fns/tz`, and `lucide` as `{ "optional": true }`
- [X] T060 [US7] Ensure `date-fns`, `@date-fns/tz`, and `lucide` remain in `devDependencies` in `packages/wc/package.json` for internal development/testing

**Checkpoint**: `date-fns`, `@date-fns/tz`, and `lucide` are optional peer deps. Basic component usage works without them installed.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and validation across all stories.

- [X] T061 [P] Remove "Breaking Changes" section header and "No breaking changes yet (pre-1.0)" line from `CHANGELOG.md`
- [X] T062 Run `pnpm build` and verify all packages compile successfully
- [X] T063 Run `pnpm test` and verify all existing tests pass
- [X] T064 Run `pnpm lint` and `pnpm typecheck` and fix any issues
- [X] T065 Validate quickstart.md scenarios — verify all import patterns from `specs/028-consumer-adoption-fixes/quickstart.md` work correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — peer dep consistency MUST be established first
- **User Stories (Phases 3-9)**: All depend on Phase 2 completion
  - US1 (Phase 3): Independent — README fixes only
  - US2 (Phase 4): Depends on Phase 2 (verifies peer dep work)
  - US3 (Phase 5): Independent — entry point restructuring
  - US4 (Phase 6): Independent — deprecation tag + package description cleanup
  - US5 (Phase 7): Depends on US3 (Phase 5) — client.ts exports make sense after index.ts is stripped down
  - US6 (Phase 8): Independent — WC event migration + alias removal
  - US7 (Phase 9): Independent — dependency optimization
- **Polish (Phase 10)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories
- **US2 (P1)**: Verification of Phase 2 foundational work
- **US3 (P1)**: No dependencies on other stories
- **US4 (P2)**: No dependencies on other stories
- **US5 (P2)**: Should follow US3 (removing runtime exports from index.ts informs what goes in client.ts)
- **US6 (P2)**: No dependencies on other stories. Internal dependency: T046 depends on T035-T045
- **US7 (P3)**: No dependencies on other stories

### Within US6 (Event Migration)

- T035-T045 (11 component migrations) can all run in parallel
- T046 (delete dead constants) MUST wait for all T035-T045 to complete
- T047 (React adapter check) depends on T046
- T048-T054 (LightElement removal) can all run in parallel, independent of event migration
- T055-T057 (legacy labels/docs) can all run in parallel, independent of other US6 work

### Parallel Opportunities

- Phase 2: T002, T003, T004 can all run in parallel
- Phase 6: T013-T025 can all run in parallel (different package.json files)
- Phase 7: T028-T034 can run in parallel (all editing `client.ts` but different sections — recommend sequential to avoid conflicts, or parallel if using distinct append operations)
- Phase 8: T035-T045 can all run in parallel (11 different component files)
- Phase 8: T048-T054 can all run in parallel (different files)
- Phase 8: T055-T057 can all run in parallel (different files)
- US1, US3, US4, US6, US7 can all proceed in parallel (no cross-story dependencies)

---

## Parallel Example: User Story 6

```bash
# Launch all 11 component migrations together:
Task: "Migrate sheet.ts OPEN/CLOSE → OPEN_CHANGE"
Task: "Migrate drawer.ts OPEN/CLOSE → OPEN_CHANGE"
Task: "Migrate alert-dialog.ts OPEN/CLOSE → OPEN_CHANGE"
Task: "Migrate dropdown-menu.ts OPEN/CLOSE → OPEN_CHANGE"
Task: "Migrate context-menu.ts OPEN/CLOSE → OPEN_CHANGE"
Task: "Migrate popover.ts OPEN/CLOSE → OPEN_CHANGE"
Task: "Migrate combobox.ts OPEN/CLOSE → OPEN_CHANGE"
Task: "Migrate hover-card.ts OPEN/CLOSE → OPEN_CHANGE"
Task: "Migrate collapsible.ts OPEN/CLOSE → OPEN_CHANGE"
Task: "Migrate date-picker.ts OPEN/CLOSE → OPEN_CHANGE"
Task: "Migrate menu.ts OPEN/CLOSE → OPEN_CHANGE"

# Then after all complete:
Task: "Delete OPEN, CLOSE, BEFORE_CLOSE, CLICK constants from emit.ts"
Task: "Update React adapters for OPEN_CHANGE event mapping"

# In parallel with above, launch LightElement removal:
Task: "Remove LightElement alias from ds-element.ts"
Task: "Remove LightElement re-export from base/index.ts"
Task: "Remove LightElement re-export from wc/index.ts"
Task: "Remove LightElement re-export from wc/core.ts"
Task: "Rename LightElement → DSElement in new-component.ts"
Task: "Rename LightElement → DSElement in CONTRIBUTING.md"
Task: "Remove LightElement compat test from ds-element.test.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (peer dep consistency)
3. Complete Phase 3: US1 (README fixes) — first impression fixed
4. Complete Phase 4: US2 (Next.js 16 verification) — adoption unblocked
5. Complete Phase 5: US3 (entry point architecture) — RSC support correct
6. **STOP and VALIDATE**: New consumers can now follow the README, install on Next.js 16, and use type imports in Server Components

### Incremental Delivery

1. Setup + Foundational → Peer deps consistent
2. US1 → README leads to working styled output → MVP!
3. US2 → Next.js 16 installs cleanly
4. US3 → Server Component type imports work
5. US4 → No contradictory warnings
6. US5 → All components in `/client`
7. US6 → Alpha Policy violations cleaned up
8. US7 → Optional deps for date-fns/lucide
9. Polish → Build/test/lint verification

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (README) + US4 (alpha labels) — documentation theme
   - Developer B: US3 (entry point) + US5 (client exports) — architecture theme
   - Developer C: US6 (event migration + LightElement + legacy labels) — Alpha Policy theme
3. Then: US2 (verification), US7 (dep optimization), Polish

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All changes per Alpha Policy: no backward-compat shims, no migration guides, direct fixes only
- T027-T034 all modify `client.ts` — recommend sequential execution or careful merge
