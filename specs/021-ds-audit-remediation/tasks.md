# Tasks: Design System Audit Remediation

**Input**: Design documents from `/specs/021-ds-audit-remediation/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the specification. Tasks focus on implementation only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo**: `packages/[package-name]/src/`
- Key packages: `@ds/wc` (packages/wc/), `@ds/primitives-dom` (packages/primitives-dom/), `@ds/react` (packages/react/)

---

## Phase 1: Setup

**Purpose**: Package configuration changes that enable tree-shaking (zero code changes required)

- [x] T001 Add `"sideEffects": false` to packages/wc/package.json
- [x] T002 [P] Verify existing Vitest configuration supports form submission tests in packages/wc/vitest.config.ts

**Checkpoint**: Tree-shaking enabled for @ds/wc package

---

## Phase 2: Foundational (Form Association Base)

**Purpose**: Create shared utilities that ALL form-associated components will use

**CRITICAL**: Complete before User Story 1 implementation

- [x] T003 Create FormAssociatedMixin base class in packages/wc/src/base/form-associated.ts
- [x] T004 Export FormAssociatedMixin from packages/wc/src/base/index.ts
- [x] T005 Add TypeScript types for ElementInternals callbacks in packages/wc/src/base/form-associated.ts

**Checkpoint**: Foundation ready - form association can be added to individual components

---

## Phase 3: User Story 1 - Native Form Participation (Priority: P1) 🎯 MVP

**Goal**: Enable WC form controls to participate in native HTML form submission via ElementInternals

**Independent Test**: Wrap ds-checkbox in a `<form>`, submit, verify value appears in FormData

### Implementation for User Story 1

- [x] T006 [P] [US1] Refactor DsCheckbox to use FormAssociatedMixin in packages/wc/src/components/checkbox/checkbox.ts
- [x] T007 [P] [US1] Refactor DsSwitch to use FormAssociatedMixin in packages/wc/src/components/switch/switch.ts
- [x] T008 [P] [US1] Refactor DsRadioGroup to use FormAssociatedMixin in packages/wc/src/components/radio/radio-group.ts
- [x] T009 [P] [US1] Refactor DsRadio to work with DsRadioGroup form association in packages/wc/src/components/radio/radio.ts
- [x] T010 [P] [US1] Refactor DsSelect to use FormAssociatedMixin in packages/wc/src/components/select/select.ts
- [x] T011 [P] [US1] Refactor DsCombobox to use FormAssociatedMixin in packages/wc/src/components/combobox/combobox.ts
- [x] T012 [US1] Add custom-validation attribute support to all form controls for opt-in ds-field-error integration; verify name, value, disabled, required attribute support per FR-006
- [x] T013 [US1] Add form lifecycle callbacks (formResetCallback, formDisabledCallback) to FormAssociatedMixin in packages/wc/src/base/form-associated.ts
- [x] T014 [US1] Verify TypeScript compilation succeeds with no type errors after form association changes

**Checkpoint**: All form controls participate in native form submission. Test by wrapping in `<form>` and checking FormData.

---

## Phase 4: User Story 2 - Tree-Shaking Support (Priority: P1)

**Goal**: Enable bundlers to eliminate unused component code from @ds/wc imports

**Independent Test**: Import only DsButton, build with Vite, verify bundle <20KB and excludes Dialog code

### Implementation for User Story 2

- [x] T015 [US2] Audit all component files in packages/wc/src/components/ for module-level side effects
- [x] T016 [US2] Remove or isolate any module-level side effects that break tree-shaking
- [x] T017 [US2] Verify barrel file packages/wc/src/index.ts uses only re-exports (no execution code)
- [x] T018 [US2] Run build and verify sideEffects:false works correctly with pnpm build

**Checkpoint**: Single-component imports result in minimal bundle size (<20KB for ds-button only)

---

## Phase 5: User Story 3 - Unified Behavior Primitives for Overlays (Priority: P1)

**Goal**: Migrate WC overlay components to use shared behavior primitives from @ds/primitives-dom

**Independent Test**: Verify DsDialog uses createDialogBehavior; keyboard navigation matches React Dialog

### Implementation for User Story 3

- [x] T019 [P] [US3] Refactor DsDialog to use createDialogBehavior in packages/wc/src/components/dialog/dialog.ts
- [x] T020 [P] [US3] Refactor DsAlertDialog to use createDialogBehavior in packages/wc/src/components/alert-dialog/alert-dialog.ts
- [x] T021 [P] [US3] Refactor DsSheet to use createDialogBehavior in packages/wc/src/components/sheet/sheet.ts
- [x] T022 [P] [US3] Refactor DsDrawer to use createDialogBehavior in packages/wc/src/components/drawer/drawer.ts
- [x] T023 [US3] Remove duplicated focus-trap/dismiss-layer code from DsDialog after migration
- [x] T023a [US3] Remove duplicated focus-trap/dismiss-layer code from DsAlertDialog after migration
- [x] T024 [US3] Remove duplicated focus-trap/dismiss-layer code from DsSheet after migration
- [x] T025 [US3] Remove duplicated focus-trap/dismiss-layer code from DsDrawer after migration
- [ ] T026 [P] [US3] Refactor DsDropdownMenu to use createMenuBehavior in packages/wc/src/components/dropdown-menu/dropdown-menu.ts
- [ ] T027 [P] [US3] Refactor DsContextMenu to use createMenuBehavior in packages/wc/src/components/context-menu/context-menu.ts
- [x] T028 [US3] Verify keyboard navigation matches React implementations for all migrated overlays
- [x] T029 [US3] Run existing overlay component tests to verify no regressions

**Checkpoint**: All overlay components use shared behavior primitives; zero duplicated focus/dismiss logic

---

## Phase 6: User Story 4 - Tabs Behavior Primitive (Priority: P2)

**Goal**: Create centralized createTabsBehavior primitive and integrate into DsTabs

**Independent Test**: Create createTabsBehavior, integrate into DsTabs, verify WAI-ARIA Tabs pattern compliance

### Implementation for User Story 4

- [x] T030 [US4] Create createTabsBehavior primitive in packages/primitives-dom/src/behavior/tabs.ts
- [x] T031 [US4] Implement horizontal and vertical orientation support in createTabsBehavior
- [x] T032 [US4] Implement automatic and manual activation modes in createTabsBehavior
- [x] T033 [US4] Add getTabListProps, getTriggerProps, getPanelProps methods to createTabsBehavior
- [x] T034 [US4] Export createTabsBehavior and types from packages/primitives-dom/src/index.ts
- [ ] T035 [US4] Refactor DsTabs to use createTabsBehavior in packages/wc/src/components/tabs/tabs.ts
- [ ] T036 [US4] Refactor DsTabsList to apply props from behavior in packages/wc/src/components/tabs/tabs-list.ts
- [ ] T037 [US4] Refactor DsTabsTrigger to apply props from behavior in packages/wc/src/components/tabs/tabs-trigger.ts
- [ ] T038 [US4] Refactor DsTabsContent to apply props from behavior in packages/wc/src/components/tabs/tabs-content.ts
- [ ] T039 [US4] Remove duplicated keyboard navigation code from DsTabs after migration
- [ ] T040 [US4] Verify WAI-ARIA Tabs pattern compliance (arrow keys, Home/End, focus management)

**Checkpoint**: DsTabs uses createTabsBehavior; keyboard navigation centralized in primitives-dom

---

## Phase 7: User Story 5 - Granular Package Exports (Priority: P2)

**Goal**: Add subpath exports to @ds/wc for maximum tree-shaking certainty

**Independent Test**: Import @ds/wc/button, verify TypeScript types resolve and bundle contains only button code

### Implementation for User Story 5

- [ ] T041 [P] [US5] Create form-controls barrel file in packages/wc/src/form-controls.ts
- [ ] T042 [P] [US5] Create overlays barrel file in packages/wc/src/overlays.ts
- [ ] T043 [P] [US5] Create data-display barrel file in packages/wc/src/data-display.ts
- [ ] T044 [P] [US5] Create navigation barrel file in packages/wc/src/navigation.ts
- [ ] T045 [US5] Add exports field to packages/wc/package.json with subpath entries for categories
- [ ] T046 [US5] Add individual component subpath exports (./button, ./dialog, etc.) to packages/wc/package.json
- [ ] T047 [US5] Update packages/wc/tsup.config.ts to build multiple entry points
- [ ] T048 [US5] Verify TypeScript types resolve correctly for all subpath imports
- [ ] T049 [US5] Verify main entry (.) remains backward compatible
- [ ] T050 [US5] Build package and verify at least 10 subpath entries exist

**Checkpoint**: @ds/wc supports granular imports like @ds/wc/button with proper TypeScript support

---

## Phase 8: User Story 6 - Shared Test Harness (Priority: P3)

**Goal**: Create framework-agnostic test utilities for WC and React component testing

**Independent Test**: Write keyboard test once, run against both ds-button (WC) and Button (React)

### Implementation for User Story 6

- [ ] T051 [P] [US6] Create shared test utilities package structure in packages/test-utils/
- [ ] T052 [P] [US6] Create keyboard simulation helpers in packages/test-utils/src/keyboard.ts
- [ ] T053 [P] [US6] Create ARIA assertion helpers in packages/test-utils/src/aria.ts
- [ ] T054 [US6] Create component wrapper abstraction for WC and React in packages/test-utils/src/component.ts
- [ ] T055 [US6] Export all utilities from packages/test-utils/src/index.ts
- [ ] T056 [US6] Add packages/test-utils to pnpm workspace in pnpm-workspace.yaml
- [ ] T057 [US6] Create example shared test for button keyboard activation
- [ ] T058 [US6] Verify shared test passes against both ds-button (WC) and Button (React)

**Checkpoint**: Shared test harness enables cross-framework testing

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T059 Run full TypeScript compilation across all modified packages
- [x] T060 Run existing test suites to verify no regressions
- [ ] T061 [P] Update @ds/wc README with new import patterns
- [ ] T062 [P] Verify all checklist items in specs/021-ds-audit-remediation/checklist.md
- [ ] T063 Run quickstart.md validation scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS User Story 1
- **Phase 3 (US1 Form Association)**: Depends on Phase 2
- **Phase 4 (US2 Tree-Shaking)**: Depends on Phase 1 only (can run parallel to Phase 3)
- **Phase 5 (US3 Behavior Primitives)**: No blocking dependencies (can start after Phase 1)
- **Phase 6 (US4 Tabs Behavior)**: Depends on Phase 5 patterns but can start independently
- **Phase 7 (US5 Granular Exports)**: Depends on Phase 4 completion
- **Phase 8 (US6 Test Harness)**: No blocking dependencies
- **Phase 9 (Polish)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational (Phase 2)
- **User Story 2 (P1)**: Can start after Phase 1 - independent of other stories
- **User Story 3 (P1)**: Can start after Phase 1 - independent of other stories
- **User Story 4 (P2)**: Independent - createTabsBehavior is new code
- **User Story 5 (P2)**: Should follow US2 (tree-shaking enabled first)
- **User Story 6 (P3)**: Independent - new package

### Parallel Opportunities

**Within Phase 3 (US1)**:
```bash
# Can run in parallel (different component files):
T006: DsCheckbox
T007: DsSwitch
T008: DsRadioGroup
T010: DsSelect
T011: DsCombobox
```

**Within Phase 5 (US3)**:
```bash
# Can run in parallel (different overlay files):
T019: DsDialog
T020: DsAlertDialog
T021: DsSheet
T022: DsDrawer
T026: DsDropdownMenu
T027: DsContextMenu
```

**Within Phase 7 (US5)**:
```bash
# Can run in parallel (different barrel files):
T041: form-controls.ts
T042: overlays.ts
T043: data-display.ts
T044: navigation.ts
```

**Cross-Phase Parallelism**:
```bash
# After Phase 1 completes, these can run in parallel:
- Phase 3 (US1): Form association
- Phase 4 (US2): Tree-shaking verification
- Phase 5 (US3): Behavior primitive migration
- Phase 6 (US4): Tabs behavior
- Phase 8 (US6): Test harness
```

---

## Implementation Strategy

### MVP First (User Stories 1-3)

1. Complete Phase 1: Setup (sideEffects:false)
2. Complete Phase 2: Foundational (FormAssociatedMixin)
3. Complete Phase 3: User Story 1 (Form Association) → **MVP Milestone 1**
4. Complete Phase 4: User Story 2 (Tree-Shaking) → **MVP Milestone 2**
5. Complete Phase 5: User Story 3 (Behavior Primitives) → **MVP Milestone 3**

### Incremental Delivery

1. **Milestone 1**: Form controls work in native forms
2. **Milestone 2**: Bundle size optimized
3. **Milestone 3**: Overlay consistency achieved
4. **Milestone 4**: Tabs behavior centralized (US4)
5. **Milestone 5**: Granular imports available (US5)
6. **Milestone 6**: Test harness ready (US6)

### Suggested Order for Solo Developer

1. T001-T002 (Setup)
2. T003-T005 (Foundational)
3. T006-T014 (US1 - Form Association)
4. T015-T018 (US2 - Tree-Shaking)
5. T019-T029 (US3 - Behavior Primitives)
6. T030-T040 (US4 - Tabs Behavior)
7. T041-T050 (US5 - Granular Exports)
8. T051-T058 (US6 - Test Harness)
9. T059-T063 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks in same phase
- [Story] label maps task to specific user story for traceability
- Each user story is independently testable after completion
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No backward compatibility concerns (no existing consumers)
