# Tasks: Architecture Review Fixes

**Input**: Design documents from `/specs/024-arch-review-fixes/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are included only for User Story 1 (button bug fix) as it is a regression fix.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a monorepo with:
- `packages/wc/` - Web Components (Lit)
- `packages/react/` - React adapters
- `packages/cli/` - CLI tool with registry and templates
- `packages/docs-content/` - MDX documentation

---

## Phase 1: Setup

**Purpose**: Verify current state and prepare for changes

- [x] T001 Verify WC component list (55 components) in packages/wc/src/components/
- [x] T002 [P] Verify CLI registry entries (54 entries) in packages/cli/registry/components.json
- [x] T003 [P] Verify existing templates (6 templates) in packages/cli/templates/
- [x] T004 [P] Verify existing MDX docs (24 docs) in packages/docs-content/components/

---

## Phase 2: User Story 1 - Button Event Reliability (Priority: P1)

**Goal**: Fix ds-button to emit exactly one `ds:press` event per activation

**Independent Test**: Click button or press Enter/Space on focused button; verify exactly one event fires each time.

### Tests for User Story 1

- [x] T005 [US1] Write unit test for single ds:press event on mouse click in packages/wc/tests/unit/button.test.ts
- [x] T006 [P] [US1] Write unit test for single ds:press event on Enter key in packages/wc/tests/unit/button.test.ts
- [x] T007 [P] [US1] Write unit test for single ds:press event on Space key in packages/wc/tests/unit/button.test.ts
- [x] T008 [P] [US1] Write unit test verifying isKeyboard:true for keyboard activation in packages/wc/tests/unit/button.test.ts

### Implementation for User Story 1

- [x] T009 [US1] Remove `this.click()` call from handleKeyDown method in packages/wc/src/components/button/button.ts
- [x] T010 [US1] Remove unused handleActivate method in packages/wc/src/components/button/button.ts
- [x] T011 [US1] Remove onActivate callback from connectedCallback in packages/wc/src/components/button/button.ts
- [x] T012 [US1] Run button tests to verify fix: `pnpm --filter @ds/wc test -- --run button`

**Checkpoint**: Button emits exactly one ds:press event per activation (mouse click, Enter, Space)

---

## Phase 3: User Story 2 - CLI Component Installation (Priority: P2)

**Goal**: Enable `hypoth-ui add [component]` with copy mode for all 55 components

**Independent Test**: Run `hypoth-ui add accordion --style copy` and verify source files appear in configured components directory.

### Implementation for User Story 2

#### Template Infrastructure

- [x] T013 [US2] Create template sync script in packages/cli/scripts/sync-templates.sh

#### Templates Batch 1: Actions & Feedback (13 components)

- [x] T014 [P] [US2] Create template for accordion in packages/cli/templates/accordion/
- [x] T015 [P] [US2] Create template for alert in packages/cli/templates/alert/
- [x] T016 [P] [US2] Create template for alert-dialog in packages/cli/templates/alert-dialog/
- [x] T017 [P] [US2] Create template for badge in packages/cli/templates/badge/
- [x] T018 [P] [US2] Create template for progress in packages/cli/templates/progress/
- [x] T019 [P] [US2] Create template for skeleton in packages/cli/templates/skeleton/
- [x] T020 [P] [US2] Create template for spinner in packages/cli/templates/spinner/
- [x] T021 [P] [US2] Create template for toast in packages/cli/templates/toast/
- [x] T022 [P] [US2] Create template for tooltip in packages/cli/templates/tooltip/
- [x] T023 [P] [US2] Create template for link in packages/cli/templates/link/
- [x] T024 [P] [US2] Create template for icon in packages/cli/templates/icon/
- [x] T025 [P] [US2] Create template for tag in packages/cli/templates/tag/
- [x] T026 [P] [US2] Create template for separator in packages/cli/templates/separator/

#### Templates Batch 2: Forms (11 components)

- [x] T027 [P] [US2] Create template for combobox in packages/cli/templates/combobox/
- [x] T028 [P] [US2] Create template for date-picker in packages/cli/templates/date-picker/
- [x] T029 [P] [US2] Create template for time-picker in packages/cli/templates/time-picker/
- [x] T030 [P] [US2] Create template for file-upload in packages/cli/templates/file-upload/
- [x] T031 [P] [US2] Create template for number-input in packages/cli/templates/number-input/
- [x] T032 [P] [US2] Create template for pin-input in packages/cli/templates/pin-input/
- [x] T033 [P] [US2] Create template for radio in packages/cli/templates/radio/
- [x] T034 [P] [US2] Create template for slider in packages/cli/templates/slider/
- [x] T035 [P] [US2] Create template for switch in packages/cli/templates/switch/
- [x] T036 [P] [US2] Create template for text in packages/cli/templates/text/
- [x] T037 [P] [US2] Create template for textarea in packages/cli/templates/textarea/

#### Templates Batch 3: Navigation & Overlays (11 components)

- [x] T038 [P] [US2] Create template for breadcrumb in packages/cli/templates/breadcrumb/
- [x] T039 [P] [US2] Create template for menu in packages/cli/templates/menu/
- [x] T040 [P] [US2] Create template for navigation-menu in packages/cli/templates/navigation-menu/
- [x] T041 [P] [US2] Create template for pagination in packages/cli/templates/pagination/
- [x] T042 [P] [US2] Create template for tabs in packages/cli/templates/tabs/
- [x] T043 [P] [US2] Create template for stepper in packages/cli/templates/stepper/
- [x] T044 [P] [US2] Create template for context-menu in packages/cli/templates/context-menu/
- [x] T045 [P] [US2] Create template for dropdown-menu in packages/cli/templates/dropdown-menu/
- [x] T046 [P] [US2] Create template for drawer in packages/cli/templates/drawer/
- [x] T047 [P] [US2] Create template for sheet in packages/cli/templates/sheet/
- [x] T048 [P] [US2] Create template for popover in packages/cli/templates/popover/

#### Templates Batch 4: Data Display (9 components)

- [x] T049 [P] [US2] Create template for avatar in packages/cli/templates/avatar/
- [x] T050 [P] [US2] Create template for card in packages/cli/templates/card/
- [x] T051 [P] [US2] Create template for calendar in packages/cli/templates/calendar/
- [x] T052 [P] [US2] Create template for data-table in packages/cli/templates/data-table/
- [x] T053 [P] [US2] Create template for table in packages/cli/templates/table/
- [x] T054 [P] [US2] Create template for list in packages/cli/templates/list/
- [x] T055 [P] [US2] Create template for tree in packages/cli/templates/tree/
- [x] T056 [P] [US2] Create template for hover-card in packages/cli/templates/hover-card/
- [x] T057 [P] [US2] Create template for command in packages/cli/templates/command/

#### Templates Batch 5: Layout & Utilities (5 components)

- [x] T058 [P] [US2] Create template for aspect-ratio in packages/cli/templates/aspect-ratio/
- [x] T059 [P] [US2] Create template for collapsible in packages/cli/templates/collapsible/
- [x] T060 [P] [US2] Create template for scroll-area in packages/cli/templates/scroll-area/
- [x] T061 [P] [US2] Create template for layout in packages/cli/templates/layout/
- [x] T062 [P] [US2] Create template for visually-hidden in packages/cli/templates/visually-hidden/

#### Registry Updates for User Story 2

- [x] T063 [US2] Update components.json files array for all new templates in packages/cli/registry/components.json

#### Verification

- [x] T064 [US2] Verify all 55 templates exist with: `ls packages/cli/templates/ | wc -l`
- [ ] T065 [US2] Test copy mode for sample components: `hypoth-ui add accordion --style copy`

**Checkpoint**: All 55 components can be installed via `hypoth-ui add [component]` with copy mode

---

## Phase 4: User Story 3 - CLI Registry Completeness (Priority: P2)

**Goal**: Align CLI registry to include all WC components with consistent naming

**Independent Test**: Run `hypoth-ui list` and compare output against WC component list.

### Implementation for User Story 3

- [x] T066 [US3] Add `layout` entry to packages/cli/registry/components.json
- [x] T067 [P] [US3] Add `radio` entry to packages/cli/registry/components.json
- [x] T068 [US3] Verify radio-group entry exists with correct registryDependencies in packages/cli/registry/components.json
- [x] T069 [US3] Run verification: compare WC components vs CLI registry entries
- [x] T070 [US3] Test `hypoth-ui list` shows all 55+ components

**Checkpoint**: CLI registry includes all WC components with consistent naming (55 entries minimum)

---

## Phase 5: User Story 4 - Component Documentation Discovery (Priority: P3)

**Goal**: Provide MDX documentation for all 55 components

**Independent Test**: Navigate to a component's documentation page and verify it contains usage examples, props documentation, and accessibility notes.

### Implementation for User Story 4

#### MDX Docs Batch 1: Actions & Feedback (9 components)

- [x] T071 [P] [US4] Create MDX documentation for accordion in packages/docs-content/components/accordion.mdx
- [x] T072 [P] [US4] Create MDX documentation for alert in packages/docs-content/components/alert.mdx
- [x] T073 [P] [US4] Create MDX documentation for alert-dialog in packages/docs-content/components/alert-dialog.mdx
- [x] T074 [P] [US4] Create MDX documentation for badge in packages/docs-content/components/badge.mdx
- [x] T075 [P] [US4] Create MDX documentation for progress in packages/docs-content/components/progress.mdx
- [x] T076 [P] [US4] Create MDX documentation for skeleton in packages/docs-content/components/skeleton.mdx
- [x] T077 [P] [US4] Create MDX documentation for toast in packages/docs-content/components/toast.mdx
- [x] T078 [P] [US4] Create MDX documentation for tag in packages/docs-content/components/tag.mdx
- [x] T079 [P] [US4] Create MDX documentation for separator in packages/docs-content/components/separator.mdx

#### MDX Docs Batch 2: Navigation & Structure (8 components)

- [x] T080 [P] [US4] Create MDX documentation for breadcrumb in packages/docs-content/components/breadcrumb.mdx
- [x] T081 [P] [US4] Create MDX documentation for navigation-menu in packages/docs-content/components/navigation-menu.mdx
- [x] T082 [P] [US4] Create MDX documentation for pagination in packages/docs-content/components/pagination.mdx
- [x] T083 [P] [US4] Create MDX documentation for tabs in packages/docs-content/components/tabs.mdx
- [x] T084 [P] [US4] Create MDX documentation for stepper in packages/docs-content/components/stepper.mdx
- [x] T085 [P] [US4] Create MDX documentation for tree in packages/docs-content/components/tree.mdx
- [x] T086 [P] [US4] Create MDX documentation for list in packages/docs-content/components/list.mdx
- [x] T087 [P] [US4] Create MDX documentation for layout in packages/docs-content/components/layout.mdx

#### MDX Docs Batch 3: Overlays (6 components)

- [x] T088 [P] [US4] Create MDX documentation for context-menu in packages/docs-content/components/context-menu.mdx
- [x] T089 [P] [US4] Create MDX documentation for dropdown-menu in packages/docs-content/components/dropdown-menu.mdx
- [x] T090 [P] [US4] Create MDX documentation for drawer in packages/docs-content/components/drawer.mdx
- [x] T091 [P] [US4] Create MDX documentation for sheet in packages/docs-content/components/sheet.mdx
- [x] T092 [P] [US4] Create MDX documentation for hover-card in packages/docs-content/components/hover-card.mdx
- [x] T093 [P] [US4] Create MDX documentation for command in packages/docs-content/components/command.mdx

#### MDX Docs Batch 4: Data Display & Layout (8 components)

- [x] T094 [P] [US4] Create MDX documentation for avatar in packages/docs-content/components/avatar.mdx
- [x] T095 [P] [US4] Create MDX documentation for card in packages/docs-content/components/card.mdx
- [x] T096 [P] [US4] Create MDX documentation for calendar in packages/docs-content/components/calendar.mdx
- [x] T097 [P] [US4] Create MDX documentation for data-table in packages/docs-content/components/data-table.mdx
- [x] T098 [P] [US4] Create MDX documentation for table in packages/docs-content/components/table.mdx
- [x] T099 [P] [US4] Create MDX documentation for aspect-ratio in packages/docs-content/components/aspect-ratio.mdx
- [x] T10 [P] [US4] Create MDX documentation for collapsible in packages/docs-content/components/collapsible.mdx
- [x] T10 [P] [US4] Create MDX documentation for scroll-area in packages/docs-content/components/scroll-area.mdx

#### Verification

- [x] T10 [US4] Verify all 55 MDX files exist: `ls packages/docs-content/components/*.mdx | wc -l`
- [x] T10 [US4] Validate MDX frontmatter for all new docs
- [x] T10 [US4] Verify docs site builds successfully: `pnpm --filter @ds/docs-app build`

**Checkpoint**: All 55 components have MDX documentation with required sections

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T105 Run full test suite: `pnpm test`
- [x] T106 [P] Run lint and typecheck: `pnpm lint && pnpm typecheck`
- [x] T107 [P] Run CLI validation: `hypoth-ui list --installed`
- [x] T108 Update ARCHITECTURE_REVIEW.md with final coverage numbers
- [x] T109 Run quickstart.md verification checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup - P1 priority, critical bug fix
- **User Story 2 (Phase 3)**: Depends on Setup - Can run in parallel with US1
- **User Story 3 (Phase 4)**: Should run after US2 (registry entries need template references)
- **User Story 4 (Phase 5)**: Can run in parallel with US2/US3
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - isolated to button.ts
- **User Story 2 (P2)**: Independent - template creation, but should add registry entries (US3) after
- **User Story 3 (P2)**: Should follow US2 (needs template files to exist)
- **User Story 4 (P3)**: Independent - MDX docs don't depend on templates or registry

### Parallel Opportunities

**Within Phase 1:**
- All verification tasks (T001-T004) can run in parallel

**Within Phase 2 (US1):**
- Test tasks T006-T008 can run in parallel after T005

**Within Phase 3 (US2):**
- All 49 template creation tasks (T014-T062) can run in parallel
- Registry update (T063) after templates complete

**Within Phase 4 (US3):**
- Layout and radio entries (T066, T067) can run in parallel

**Within Phase 5 (US4):**
- All 31 MDX documentation tasks (T071-T101) can run in parallel

**Cross-Phase:**
- US1, US2, US4 can all run in parallel (independent file sets)
- US3 should follow US2 completion

---

## Parallel Example: Template Creation (US2)

```bash
# Launch all template tasks in parallel (different directories):
Task: "Create template for accordion in packages/cli/templates/accordion/"
Task: "Create template for alert in packages/cli/templates/alert/"
Task: "Create template for badge in packages/cli/templates/badge/"
... (all 49 template tasks)
```

## Parallel Example: MDX Documentation (US4)

```bash
# Launch all MDX tasks in parallel (different files):
Task: "Create MDX documentation for accordion in packages/docs-content/components/accordion.mdx"
Task: "Create MDX documentation for alert in packages/docs-content/components/alert.mdx"
Task: "Create MDX documentation for badge in packages/docs-content/components/badge.mdx"
... (all 31 MDX tasks)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup verification
2. Complete Phase 2: Button bug fix (US1)
3. **STOP and VALIDATE**: Button emits single event
4. Deploy bug fix immediately

### Incremental Delivery

1. **Sprint 1**: US1 (Button fix) - Critical bug fix, immediate value
2. **Sprint 2**: US2 + US3 (Templates + Registry) - Enable copy-mode adoption
3. **Sprint 3**: US4 (MDX docs) - Complete documentation coverage

### Parallel Team Strategy

With multiple developers:
1. Developer A: US1 (Button fix) → then US3 (Registry)
2. Developer B: US2 (Templates batch 1-3)
3. Developer C: US2 (Templates batch 4-5) → then US4 (MDX docs)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Template tasks copy from packages/react/src/components/ with import transformation
- MDX tasks should reference packages/wc/src/components/[name]/manifest.json for accessibility data
- Each user story should be independently completable and testable
- Commit after each batch or logical group
- Stop at any checkpoint to validate story independently
