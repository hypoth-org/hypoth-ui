# Tasks: Framework-Agnostic Behavior Utilities

**Input**: Design documents from `/specs/005-behavior-utilities/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Unit tests included per spec requirement "implement primitives + unit tests"

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:
- `packages/primitives-dom/src/` - Utility source files
- `packages/primitives-dom/tests/` - Unit tests
- `apps/demo/app/primitives/` - Test harness pages
- `apps/demo/e2e/` - E2E tests
- `packages/docs-content/guides/` - Documentation

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure build tooling and package structure is ready

- [x] T001 Verify @ds/primitives-dom package.json has correct exports in packages/primitives-dom/package.json
- [x] T002 [P] Create layer/ directory structure in packages/primitives-dom/src/layer/
- [x] T003 [P] Create shared types file with Direction, LogicalDirection types in packages/primitives-dom/src/types.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Add shared FOCUSABLE_SELECTOR constant to packages/primitives-dom/src/constants.ts
- [x] T005 [P] Add DEFAULT_TYPEAHEAD_TIMEOUT constant to packages/primitives-dom/src/constants.ts
- [x] T006 Update index.ts to export new types and constants in packages/primitives-dom/src/index.ts

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - Focus Management for Modal Dialogs (Priority: P1) 🎯 MVP

**Goal**: Trap Tab/Shift+Tab navigation within a container element with initial focus and return focus support

**Independent Test**: Open a modal with 3 focusable elements, press Tab repeatedly to verify focus cycles within the modal only

### Unit Tests for User Story 1

- [x] T007 [P] [US1] Add tests for enhanced returnFocus option (HTMLElement target) in packages/primitives-dom/tests/focus-trap.test.ts
- [x] T008 [P] [US1] Add tests for fallbackFocus when container has no focusables in packages/primitives-dom/tests/focus-trap.test.ts

### Implementation for User Story 1

- [x] T009 [US1] Enhance FocusTrapOptions with returnFocus: boolean | HTMLElement in packages/primitives-dom/src/focus/focus-trap.ts
- [x] T010 [US1] Add fallbackFocus option support to focus-trap in packages/primitives-dom/src/focus/focus-trap.ts
- [x] T011 [US1] Update focus-trap deactivate() to handle HTMLElement returnFocus in packages/primitives-dom/src/focus/focus-trap.ts
- [x] T012 [US1] Export enhanced FocusTrapOptions type in packages/primitives-dom/src/index.ts
- [x] T013 [US1] Verify all focus-trap tests pass with pnpm --filter @ds/primitives-dom test

**Checkpoint**: User Story 1 complete - focus trap enhanced with returnFocus and fallbackFocus options

---

## Phase 4: User Story 2 - Keyboard Navigation for Composite Widgets (Priority: P1)

**Goal**: Implement roving tabindex pattern with arrow key navigation, wrapping, and disabled item support

**Independent Test**: Navigate a 5-item horizontal toolbar with arrow keys, verify disabled items are skipped

### Unit Tests for User Story 2

- [x] T014 [P] [US2] Add tests for skipDisabled option in packages/primitives-dom/tests/roving-focus.test.ts
- [x] T015 [P] [US2] Add tests for aria-disabled="true" detection in packages/primitives-dom/tests/roving-focus.test.ts

### Implementation for User Story 2

- [x] T016 [US2] Add isDisabled() helper function to roving-focus in packages/primitives-dom/src/keyboard/roving-focus.ts
- [x] T017 [US2] Add skipDisabled option to RovingFocusOptions in packages/primitives-dom/src/keyboard/roving-focus.ts
- [x] T018 [US2] Implement disabled item skipping in navigation logic in packages/primitives-dom/src/keyboard/roving-focus.ts
- [x] T019 [US2] Export enhanced RovingFocusOptions type in packages/primitives-dom/src/index.ts
- [x] T020 [US2] Verify all roving-focus tests pass with pnpm --filter @ds/primitives-dom test

**Checkpoint**: User Story 2 complete - roving focus supports disabled item skipping

---

## Phase 5: User Story 3 - Dismissable Layers for Popovers and Menus (Priority: P1)

**Goal**: Handle Escape key and outside click dismissal with layer stacking for nested layers

**Independent Test**: Open a dropdown, press Escape to close, open again, click outside to close

### Unit Tests for User Story 3

- [x] T021 [P] [US3] Create dismissable-layer.test.ts with Escape key tests in packages/primitives-dom/tests/dismissable-layer.test.ts
- [x] T022 [P] [US3] Add outside click dismiss tests in packages/primitives-dom/tests/dismissable-layer.test.ts
- [x] T023 [P] [US3] Add layer stacking tests (LIFO dismissal) in packages/primitives-dom/tests/dismissable-layer.test.ts
- [x] T024 [P] [US3] Add excludeElements tests in packages/primitives-dom/tests/dismissable-layer.test.ts

### Implementation for User Story 3

- [x] T025 [US3] Create DismissableLayerOptions and DismissableLayer interfaces in packages/primitives-dom/src/layer/dismissable-layer.ts
- [x] T026 [US3] Implement module-level layerStack array in packages/primitives-dom/src/layer/dismissable-layer.ts
- [x] T027 [US3] Implement createDismissableLayer factory function in packages/primitives-dom/src/layer/dismissable-layer.ts
- [x] T028 [US3] Implement Escape key handler with capture phase in packages/primitives-dom/src/layer/dismissable-layer.ts
- [x] T029 [US3] Implement outside click handler with excludeElements in packages/primitives-dom/src/layer/dismissable-layer.ts
- [x] T030 [US3] Export createDismissableLayer and types in packages/primitives-dom/src/index.ts
- [x] T031 [US3] Verify all dismissable-layer tests pass with pnpm --filter @ds/primitives-dom test

**Checkpoint**: User Story 3 complete - dismissable layers work with stacking and exclusions

---

## Phase 6: User Story 4 - Keyboard Helpers for Interactive Elements (Priority: P2)

**Goal**: Provide reusable keyboard handlers for activation (Enter/Space), arrow keys, and type-ahead

**Independent Test**: Attach handlers to custom elements and verify key detection and callbacks

### Unit Tests for User Story 4

- [x] T032 [P] [US4] Create activation.test.ts with Enter/Space tests in packages/primitives-dom/tests/activation.test.ts
- [x] T033 [P] [US4] Create arrow-keys.test.ts with direction tests in packages/primitives-dom/tests/arrow-keys.test.ts
- [x] T034 [P] [US4] Add RTL tests to arrow-keys.test.ts in packages/primitives-dom/tests/arrow-keys.test.ts
- [x] T035 [P] [US4] Create type-ahead.test.ts with buffer tests in packages/primitives-dom/tests/type-ahead.test.ts
- [x] T036 [P] [US4] Add timeout tests to type-ahead.test.ts in packages/primitives-dom/tests/type-ahead.test.ts

### Implementation for User Story 4

- [x] T037 [US4] Create createActivationHandler factory in packages/primitives-dom/src/keyboard/activation.ts
- [x] T038 [US4] Create createArrowKeyHandler factory with RTL support in packages/primitives-dom/src/keyboard/arrow-keys.ts
- [x] T039 [US4] Create createTypeAhead factory with buffer management in packages/primitives-dom/src/keyboard/type-ahead.ts
- [x] T040 [US4] Export all keyboard helpers and types in packages/primitives-dom/src/index.ts
- [x] T041 [US4] Verify all keyboard helper tests pass with pnpm --filter @ds/primitives-dom test

**Checkpoint**: User Story 4 complete - keyboard helpers available for component development

---

## Phase 7: User Story 5 - Test Harness Pages for Documentation and E2E (Priority: P2)

**Goal**: Create interactive demo pages for each utility with data-testid attributes for E2E testing

**Independent Test**: Load each harness page, interact with controls, verify utility behavior

### Implementation for User Story 5

- [x] T042 [P] [US5] Create primitives index page in apps/demo/app/primitives/page.tsx
- [x] T043 [P] [US5] Create focus-trap demo page with activation controls in apps/demo/app/primitives/focus-trap/page.tsx
- [x] T044 [P] [US5] Create roving-focus demo page with orientation toggle in apps/demo/app/primitives/roving-focus/page.tsx
- [x] T045 [P] [US5] Create dismissable-layer demo page with nested layers in apps/demo/app/primitives/dismissable-layer/page.tsx
- [x] T046 [P] [US5] Create keyboard-helpers demo page with activation and arrow key demos in apps/demo/app/primitives/keyboard-helpers/page.tsx
- [x] T047 [P] [US5] Create type-ahead demo page with buffer display in apps/demo/app/primitives/type-ahead/page.tsx
- [x] T048 [US5] Create E2E test file for all primitives in apps/demo/tests/e2e/primitives.test.ts
- [x] T049 [US5] Verify all test harness pages render correctly with pnpm --filter @ds/demo dev

**Checkpoint**: User Story 5 complete - test harness pages ready for E2E testing

---

## Phase 8: User Story 6 - Usage Documentation for Component Authors (Priority: P3)

**Goal**: Provide MDX documentation with API reference, code examples, and integration patterns

**Independent Test**: Developer follows docs to add focus-trap to a custom modal component

### Implementation for User Story 6

- [x] T050 [US6] Create behavior-utilities.mdx with overview section in packages/docs-content/guides/behavior-utilities.mdx
- [x] T051 [US6] Add Focus Trap API reference and examples to behavior-utilities.mdx
- [x] T052 [US6] Add Roving Focus API reference and examples to behavior-utilities.mdx
- [x] T053 [US6] Add Dismissable Layer API reference and examples to behavior-utilities.mdx
- [x] T054 [US6] Add Keyboard Helpers API reference and examples to behavior-utilities.mdx
- [x] T055 [US6] Add Type-Ahead API reference and examples to behavior-utilities.mdx
- [x] T056 [US6] Add Lit component integration patterns section to behavior-utilities.mdx
- [x] T057 [US6] Add Light DOM considerations section to behavior-utilities.mdx

**Checkpoint**: User Story 6 complete - documentation ready for component authors

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T058 Run full build across all packages with pnpm build
- [x] T059 [P] Verify each utility is under 2KB gzipped (per SC-003) with pnpm --filter @ds/primitives-dom build
- [x] T060 [P] Run all unit tests with pnpm --filter @ds/primitives-dom test
- [x] T061 [P] Run E2E tests with pnpm --filter @ds/demo test:e2e
- [x] T062 Verify all exports match contracts/primitives-dom.d.ts
- [x] T063 Run quickstart.md validation - follow steps and verify they work
- [x] T064 [P] Add axe-core accessibility tests to verify SC-001 in packages/primitives-dom/tests/a11y.test.ts
- [x] T065 [P] Add memory leak verification test (repeated activate/deactivate cycles) per SC-007 in packages/primitives-dom/tests/memory.test.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1 (Focus Trap) and US2 (Roving Focus) can run in parallel
  - US3 (Dismissable Layer) can run in parallel with US1/US2
  - US4 (Keyboard Helpers) can run in parallel with US1/US2/US3
  - US5 (Test Harness) depends on US1-US4 completion
  - US6 (Documentation) depends on US1-US4 completion
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Requires Foundational - enhances existing focus-trap
- **User Story 2 (P1)**: Requires Foundational - enhances existing roving-focus
- **User Story 3 (P1)**: Requires Foundational - new dismissable-layer utility
- **User Story 4 (P2)**: Requires Foundational - new keyboard helper utilities
- **User Story 5 (P2)**: Requires US1-US4 (needs utilities to demo)
- **User Story 6 (P3)**: Requires US1-US4 (needs utilities to document)

### Within Each User Story

- Tests before implementation (TDD)
- Core implementation before exports
- Build verification after each story

### Parallel Opportunities

- T002, T003 can run in parallel (different files)
- T004, T005 can run in parallel (different constants)
- T007, T008 can run in parallel (different test cases)
- T014, T015 can run in parallel (different test cases)
- T021, T022, T023, T024 can run in parallel (different test files/cases)
- T032, T033, T034, T035, T036 can run in parallel (different test files)
- T042, T043, T044, T045, T046, T047 can run in parallel (different pages)
- T059, T060, T061, T064, T065 can run in parallel (different verification tasks)

---

## Parallel Example: Phase 5 (Dismissable Layer)

```bash
# Launch all tests together first:
Task: "Create dismissable-layer.test.ts with Escape key tests"
Task: "Add outside click dismiss tests"
Task: "Add layer stacking tests (LIFO dismissal)"
Task: "Add excludeElements tests"

# Then implement sequentially (file dependencies):
Task: "Create DismissableLayerOptions and DismissableLayer interfaces"
Task: "Implement module-level layerStack array"
Task: "Implement createDismissableLayer factory function"
```

---

## Parallel Example: Phase 7 (Test Harness Pages)

```bash
# Launch all pages together (different files):
Task: "Create primitives index page"
Task: "Create focus-trap demo page"
Task: "Create roving-focus demo page"
Task: "Create dismissable-layer demo page"
Task: "Create keyboard-helpers demo page"
Task: "Create type-ahead demo page"
```

---

## Implementation Strategy

### MVP First (User Stories 1, 2, 3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (focus-trap enhancements)
4. Complete Phase 4: User Story 2 (roving-focus enhancements)
5. Complete Phase 5: User Story 3 (dismissable-layer - NEW)
6. **STOP and VALIDATE**: Run all unit tests
7. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 + 2 + 3 → Core utilities enhanced → MVP ready!
3. Add User Story 4 → Keyboard helpers → Full utility suite
4. Add User Story 5 → Test harnesses → E2E ready
5. Add User Story 6 → Documentation → Full feature ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (focus-trap)
   - Developer B: User Story 2 (roving-focus)
   - Developer C: User Story 3 (dismissable-layer)
3. Then:
   - Developer A: User Story 4 (keyboard helpers)
   - Developer B: User Story 5 (test harnesses)
   - Developer C: User Story 6 (documentation)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- TDD approach: Write tests first, verify they fail, then implement
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Existing files (focus-trap.ts, roving-focus.ts) need updates, not creation
