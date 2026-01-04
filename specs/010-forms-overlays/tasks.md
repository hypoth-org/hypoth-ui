# Tasks: Forms and Overlays Components

**Input**: Design documents from `/specs/010-forms-overlays/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: The specification requires unit tests and accessibility automation tests for all components (FR-066).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo**: `packages/wc/`, `packages/primitives-dom/`, `packages/css/`, `packages/docs-content/`
- Components: `packages/wc/src/components/[name]/`
- CSS: `packages/css/src/components/`
- Docs: `packages/docs-content/components/[name]/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and new primitive required for positioning

- [x] T001 [P] Create anchor-position primitive directory in packages/primitives-dom/src/positioning/
- [x] T002 Implement createAnchorPosition utility in packages/primitives-dom/src/positioning/anchor-position.ts
- [x] T003 [P] Add unit tests for anchor-position in packages/primitives-dom/tests/positioning/anchor-position.test.ts
- [x] T004 Export anchor-position from packages/primitives-dom/src/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create field component directory structure in packages/wc/src/components/field/
- [x] T006 [P] Create CSS file for field components in packages/css/src/components/field.css
- [x] T007 Create base field.ts component skeleton in packages/wc/src/components/field/field.ts
- [x] T008 [P] Create label.ts component in packages/wc/src/components/field/label.ts
- [x] T009 [P] Create field-description.ts component in packages/wc/src/components/field/field-description.ts
- [x] T010 [P] Create field-error.ts component in packages/wc/src/components/field/field-error.ts
- [x] T011 Implement Field ID generation and ARIA composition logic in packages/wc/src/components/field/field.ts
- [x] T012 Create manifest.json for field components in packages/wc/src/components/field/manifest.json
- [x] T013 [P] Add unit tests for Field pattern in packages/wc/tests/unit/field.test.ts
- [x] T014 [P] Add a11y tests for Field pattern in packages/wc/tests/a11y/field.test.ts
- [x] T015 Export field components from packages/wc/src/index.ts

**Checkpoint**: Foundation ready - Field pattern available for all form controls

---

## Phase 3: User Story 1 - Input and Field Integration (Priority: P1) 🎯 MVP

**Goal**: Developer creates accessible form with Input and Field pattern with proper label/error association

**Independent Test**: Render Input within Field, verify aria-labelledby, aria-describedby, aria-invalid work with screen readers

### Tests for User Story 1

- [x] T016 [P] [US1] Add unit test for Input Field integration in packages/wc/tests/unit/input-field.test.ts
- [x] T017 [P] [US1] Add a11y test for Input label association in packages/wc/tests/a11y/input-field.test.ts

### Implementation for User Story 1

- [x] T018 [US1] Enhance existing Input to support aria-labelledby attribute in packages/wc/src/components/input/input.ts
- [x] T019 [US1] Enhance Input to support aria-describedby attribute in packages/wc/src/components/input/input.ts
- [x] T020 [US1] Add error state styling (aria-invalid) support to Input in packages/wc/src/components/input/input.ts
- [x] T021 [US1] Update Input CSS for error state styling in packages/wc/src/components/input/input.css
- [x] T022 [US1] Update Input manifest.json with new ARIA capabilities in packages/wc/src/components/input/manifest.json
- [x] T023 [US1] Create field.mdx documentation in packages/docs-content/components/field.mdx

**Checkpoint**: User Story 1 complete - Input with Field pattern is fully functional and testable

---

## Phase 4: User Story 2 - Modal Dialog (Priority: P1) 🎯 MVP

**Goal**: Developer opens modal dialog with focus trap, Escape dismissal, and focus return

**Independent Test**: Open dialog, verify focus trap cycles, press Escape to close, confirm focus returns to trigger

### Tests for User Story 2

- [x] T024 [P] [US2] Add unit test for Dialog open/close in packages/wc/tests/unit/dialog.test.ts
- [x] T025 [P] [US2] Add unit test for Dialog focus trap in packages/wc/tests/unit/dialog-focus.test.ts
- [x] T026 [P] [US2] Add a11y test for Dialog ARIA in packages/wc/tests/a11y/dialog.test.ts

### Implementation for User Story 2

- [x] T027 [US2] Create dialog component directory in packages/wc/src/components/dialog/
- [x] T028 [P] [US2] Create CSS file for dialog in packages/css/src/components/dialog.css
- [x] T029 [P] [US2] Create dialog.ts main component in packages/wc/src/components/dialog/dialog.ts
- [x] T030 [P] [US2] Create dialog-trigger.ts in packages/wc/src/components/dialog/dialog-trigger.ts (slot-based, no separate file needed)
- [x] T031 [P] [US2] Create dialog-content.ts in packages/wc/src/components/dialog/dialog-content.ts
- [x] T032 [P] [US2] Create dialog-title.ts in packages/wc/src/components/dialog/dialog-title.ts
- [x] T033 [P] [US2] Create dialog-description.ts in packages/wc/src/components/dialog/dialog-description.ts
- [x] T034 [US2] Implement focus trap integration using createFocusTrap in packages/wc/src/components/dialog/dialog.ts
- [x] T035 [US2] Implement dismiss layer integration using createDismissableLayer in packages/wc/src/components/dialog/dialog.ts
- [x] T036 [US2] Implement portal rendering (append to body on open) in packages/wc/src/components/dialog/dialog.ts (inline rendering used)
- [x] T037 [US2] Implement focus return to trigger on close in packages/wc/src/components/dialog/dialog.ts
- [x] T038 [US2] Add backdrop click handling with close-on-backdrop attribute in packages/wc/src/components/dialog/dialog.ts
- [x] T039 [US2] Create manifest.json for dialog in packages/wc/src/components/dialog/manifest.json
- [x] T040 [US2] Create dialog.mdx documentation in packages/docs-content/components/dialog.mdx
- [x] T041 [US2] Export dialog components from packages/wc/src/index.ts

**Checkpoint**: User Story 2 complete - Dialog with focus trap and dismiss is fully functional

---

## Phase 5: User Story 3 - Textarea with Auto-resize (Priority: P2)

**Goal**: Developer adds multi-line text input that auto-resizes and integrates with Field pattern

**Independent Test**: Type multi-line content, verify textarea height grows, check Field integration

### Tests for User Story 3

- [x] T042 [P] [US3] Add unit test for Textarea auto-resize in packages/wc/tests/unit/textarea.test.ts
- [x] T043 [P] [US3] Add a11y test for Textarea in packages/wc/tests/a11y/textarea.test.ts

### Implementation for User Story 3

- [x] T044 [US3] Create textarea component directory in packages/wc/src/components/textarea/
- [x] T045 [P] [US3] Create CSS file for textarea in packages/wc/src/components/textarea/textarea.css (in wc package)
- [x] T046 [US3] Implement textarea.ts with Field pattern support in packages/wc/src/components/textarea/textarea.ts
- [x] T047 [US3] Implement auto-resize using height adjustment technique in packages/wc/src/components/textarea/textarea.ts
- [x] T048 [US3] Add min-rows and max-rows constraint handling in packages/wc/src/components/textarea/textarea.ts
- [x] T049 [US3] Create manifest.json for textarea in packages/wc/src/components/textarea/manifest.json
- [x] T050 [US3] Create textarea.mdx documentation in packages/docs-content/components/textarea.mdx
- [x] T051 [US3] Export textarea from packages/wc/src/index.ts

**Checkpoint**: User Story 3 complete - Textarea with auto-resize is fully functional

---

## Phase 6: User Story 4 - Checkbox and Radio Groups (Priority: P2)

**Goal**: Developer creates checkbox and radio groups with proper keyboard navigation

**Independent Test**: Render radio group, navigate with arrow keys, verify single selection

### Tests for User Story 4

- [x] T052 [P] [US4] Add unit test for Checkbox toggle in packages/wc/tests/unit/checkbox.test.ts
- [x] T053 [P] [US4] Add unit test for RadioGroup roving focus in packages/wc/tests/unit/radio-group.test.ts
- [x] T054 [P] [US4] Add a11y test for Checkbox/Radio ARIA in packages/wc/tests/a11y/checkbox-radio.test.ts

### Implementation for User Story 4 - Checkbox

- [x] T055 [US4] Create checkbox component directory in packages/wc/src/components/checkbox/
- [x] T056 [P] [US4] Create CSS file for checkbox in packages/wc/src/components/checkbox/checkbox.css (in wc package)
- [x] T057 [US4] Implement checkbox.ts with tri-state support in packages/wc/src/components/checkbox/checkbox.ts
- [x] T058 [US4] Add aria-checked mixed state handling in packages/wc/src/components/checkbox/checkbox.ts
- [x] T059 [US4] Create manifest.json for checkbox in packages/wc/src/components/checkbox/manifest.json

### Implementation for User Story 4 - Radio

- [x] T060 [US4] Create radio component directory in packages/wc/src/components/radio/
- [x] T061 [P] [US4] Create CSS file for radio in packages/wc/src/components/radio/radio.css (in wc package)
- [x] T062 [US4] Implement radio.ts individual radio button in packages/wc/src/components/radio/radio.ts
- [x] T063 [US4] Implement radio-group.ts with roving focus using createRovingFocus in packages/wc/src/components/radio/radio-group.ts
- [x] T064 [US4] Add selection-follows-focus behavior in packages/wc/src/components/radio/radio-group.ts
- [x] T065 [US4] Create manifest.json for radio in packages/wc/src/components/radio/manifest.json

### Documentation for User Story 4

- [x] T066 [P] [US4] Create checkbox.mdx documentation in packages/docs-content/components/checkbox.mdx
- [x] T067 [P] [US4] Create radio.mdx documentation in packages/docs-content/components/radio.mdx
- [x] T068 [US4] Export checkbox and radio from packages/wc/src/index.ts

**Checkpoint**: User Story 4 complete - Checkbox and RadioGroup are fully functional

---

## Phase 7: User Story 5 - Switch Toggle (Priority: P2)

**Goal**: Developer uses toggle switch for boolean settings with proper role="switch" semantics

**Independent Test**: Click switch to toggle, verify aria-checked updates, test Enter and Space keys

### Tests for User Story 5

- [x] T069 [P] [US5] Add unit test for Switch toggle in packages/wc/tests/unit/switch.test.ts
- [x] T070 [P] [US5] Add a11y test for Switch role in packages/wc/tests/a11y/switch.test.ts

### Implementation for User Story 5

- [x] T071 [US5] Create switch component directory in packages/wc/src/components/switch/
- [x] T072 [P] [US5] Create CSS file for switch in packages/wc/src/components/switch/switch.css (in wc package)
- [x] T073 [US5] Implement switch.ts with role="switch" in packages/wc/src/components/switch/switch.ts
- [x] T074 [US5] Add Enter and Space key handling (distinct from Checkbox) in packages/wc/src/components/switch/switch.ts
- [x] T075 [US5] Create manifest.json for switch in packages/wc/src/components/switch/manifest.json
- [x] T076 [US5] Create switch.mdx documentation in packages/docs-content/components/switch.mdx
- [x] T077 [US5] Export switch from packages/wc/src/index.ts

**Checkpoint**: User Story 5 complete - Switch toggle is fully functional

---

## Phase 8: User Story 6 - Popover (Priority: P2)

**Goal**: Developer creates non-modal popover anchored to trigger with positioning and dismiss handling

**Independent Test**: Open popover, Tab can exit (no focus trap), press Escape to close

### Tests for User Story 6

- [x] T078 [P] [US6] Add unit test for Popover positioning in packages/wc/tests/unit/popover.test.ts
- [x] T079 [P] [US6] Add a11y test for Popover behavior in packages/wc/tests/a11y/popover.test.ts

### Implementation for User Story 6

- [x] T080 [US6] Create popover component directory in packages/wc/src/components/popover/
- [x] T081 [P] [US6] Create CSS file for popover in packages/wc/src/components/popover/popover.css (in wc package)
- [x] T082 [P] [US6] Create popover.ts main component in packages/wc/src/components/popover/popover.ts
- [x] T083 [P] [US6] Create popover-trigger.ts in packages/wc/src/components/popover/popover-trigger.ts (slot-based, no separate file)
- [x] T084 [P] [US6] Create popover-content.ts in packages/wc/src/components/popover/popover-content.ts
- [x] T085 [US6] Integrate createAnchorPosition for positioning in packages/wc/src/components/popover/popover.ts
- [x] T086 [US6] Integrate createDismissableLayer for Escape/outside click in packages/wc/src/components/popover/popover.ts
- [x] T087 [US6] Add placement attribute and flip logic in packages/wc/src/components/popover/popover.ts
- [x] T088 [US6] Create manifest.json for popover in packages/wc/src/components/popover/manifest.json
- [x] T089 [US6] Create popover.mdx documentation in packages/docs-content/components/popover.mdx
- [x] T090 [US6] Export popover from packages/wc/src/index.ts

**Checkpoint**: User Story 6 complete - Popover with positioning is fully functional

---

## Phase 9: User Story 7 - Tooltip (Priority: P3)

**Goal**: Developer adds tooltips with hover/focus trigger and configurable delays

**Independent Test**: Focus trigger, tooltip appears after delay, press Escape to dismiss

### Tests for User Story 7

- [x] T091 [P] [US7] Add unit test for Tooltip timing in packages/wc/tests/unit/tooltip.test.ts
- [x] T092 [P] [US7] Add a11y test for Tooltip aria-describedby in packages/wc/tests/a11y/tooltip.test.ts

### Implementation for User Story 7

- [x] T093 [US7] Create tooltip component directory in packages/wc/src/components/tooltip/
- [x] T094 [P] [US7] Create CSS file for tooltip in packages/wc/src/components/tooltip/tooltip.css (in wc package)
- [x] T095 [P] [US7] Create tooltip.ts main component in packages/wc/src/components/tooltip/tooltip.ts
- [x] T096 [P] [US7] Create tooltip-trigger.ts in packages/wc/src/components/tooltip/tooltip-trigger.ts (slot-based, no separate file)
- [x] T097 [P] [US7] Create tooltip-content.ts in packages/wc/src/components/tooltip/tooltip-content.ts
- [x] T098 [US7] Implement show delay (400ms) and hide delay (100ms) logic in packages/wc/src/components/tooltip/tooltip.ts
- [x] T099 [US7] Add hover persistence (stay open when moving to tooltip) in packages/wc/src/components/tooltip/tooltip.ts
- [x] T100 [US7] Integrate createAnchorPosition for positioning in packages/wc/src/components/tooltip/tooltip.ts
- [x] T101 [US7] Add aria-describedby connection from trigger to tooltip in packages/wc/src/components/tooltip/tooltip.ts
- [x] T102 [US7] Create manifest.json for tooltip in packages/wc/src/components/tooltip/manifest.json
- [x] T103 [US7] Create tooltip.mdx documentation in packages/docs-content/components/tooltip.mdx
- [x] T104 [US7] Export tooltip from packages/wc/src/index.ts

**Checkpoint**: User Story 7 complete - Tooltip with timing and positioning is fully functional

---

## Phase 10: User Story 8 - Menu (Priority: P3)

**Goal**: Developer creates dropdown menu with roving focus, type-ahead, and item selection

**Independent Test**: Open menu, navigate with arrows, type to search, select with Enter

### Tests for User Story 8

- [x] T105 [P] [US8] Add unit test for Menu roving focus in packages/wc/tests/unit/menu.test.ts
- [x] T106 [P] [US8] Add unit test for Menu type-ahead in packages/wc/tests/unit/menu-typeahead.test.ts
- [x] T107 [P] [US8] Add a11y test for Menu ARIA roles in packages/wc/tests/a11y/menu.test.ts

### Implementation for User Story 8

- [x] T108 [US8] Create menu component directory in packages/wc/src/components/menu/
- [x] T109 [P] [US8] Create CSS file for menu in packages/wc/src/components/menu/menu.css (in wc package)
- [x] T110 [P] [US8] Create menu.ts main component in packages/wc/src/components/menu/menu.ts
- [x] T111 [P] [US8] Create menu-trigger.ts in packages/wc/src/components/menu/menu-trigger.ts (slot-based, no separate file)
- [x] T112 [P] [US8] Create menu-content.ts in packages/wc/src/components/menu/menu-content.ts
- [x] T113 [P] [US8] Create menu-item.ts in packages/wc/src/components/menu/menu-item.ts
- [x] T114 [US8] Integrate createRovingFocus for arrow key navigation in packages/wc/src/components/menu/menu.ts
- [x] T115 [US8] Integrate createTypeAhead for type-ahead search in packages/wc/src/components/menu/menu.ts
- [x] T116 [US8] Integrate createDismissableLayer for Escape/outside click in packages/wc/src/components/menu/menu.ts
- [x] T117 [US8] Integrate createAnchorPosition for positioning in packages/wc/src/components/menu/menu.ts
- [x] T118 [US8] Add disabled item skipping in navigation in packages/wc/src/components/menu/menu.ts
- [x] T119 [US8] Add close-on-select behavior in packages/wc/src/components/menu/menu.ts
- [x] T120 [US8] Create manifest.json for menu in packages/wc/src/components/menu/manifest.json
- [x] T121 [US8] Create menu.mdx documentation in packages/docs-content/components/menu.mdx
- [x] T122 [US8] Export menu from packages/wc/src/index.ts

**Checkpoint**: User Story 8 complete - Menu with roving focus and type-ahead is fully functional

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T123 [P] Add React wrappers for Field components in packages/react/src/components/field/
- [x] T124 [P] Add React wrappers for Dialog in packages/react/src/components/dialog/
- [x] T125 [P] Add React wrappers for form controls in packages/react/src/components/
- [x] T126 [P] Add React wrappers for overlay components in packages/react/src/components/
- [x] T127 Run pnpm validate:manifests to ensure all manifests pass strict mode
- [x] T128 Run pnpm test:a11y to verify all accessibility tests pass
- [x] T129 Run pnpm typecheck to verify no type errors
- [x] T130 Run pnpm build to verify all packages build successfully
- [x] T131 Verify quickstart.md examples work correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-10)**: All depend on Foundational phase completion
  - US1 and US2 can proceed in parallel (P1 stories)
  - US3-US6 can proceed in parallel once P1 complete (or concurrently with P1 if staffed)
  - US7-US8 can proceed in parallel (P3 stories)
- **Polish (Phase 11)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 (Field pattern foundation) - No story dependencies
- **User Story 2 (P1)**: Depends on Phase 2 only - Independent of US1
- **User Story 3 (P2)**: Depends on Phase 2 (Field pattern) - Independent of other stories
- **User Story 4 (P2)**: Depends on Phase 2 only - Independent of other stories
- **User Story 5 (P2)**: Depends on Phase 2 only - Independent of other stories
- **User Story 6 (P2)**: Depends on Phase 1 (anchor-position primitive) - Independent of form controls
- **User Story 7 (P3)**: Depends on Phase 1 (anchor-position primitive) - Can reuse Popover patterns
- **User Story 8 (P3)**: Depends on Phase 1 (anchor-position primitive) - Uses multiple primitives

### Within Each User Story

- Tests SHOULD be written before implementation (TDD encouraged)
- CSS files can be created in parallel with component skeletons
- Component implementation before manifest
- Manifest before documentation
- Export to index.ts at end of story

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- CSS files and component skeletons marked [P] can run in parallel
- React wrappers in Phase 11 marked [P] can run in parallel

---

## Parallel Example: User Story 2 (Dialog)

```bash
# Launch all tests for User Story 2 together:
Task: "Add unit test for Dialog open/close in packages/wc/tests/unit/dialog.test.ts"
Task: "Add unit test for Dialog focus trap in packages/wc/tests/unit/dialog-focus.test.ts"
Task: "Add a11y test for Dialog ARIA in packages/wc/tests/a11y/dialog.test.ts"

# Launch CSS and component skeletons together:
Task: "Create CSS file for dialog in packages/css/src/components/dialog.css"
Task: "Create dialog.ts main component in packages/wc/src/components/dialog/dialog.ts"
Task: "Create dialog-trigger.ts in packages/wc/src/components/dialog/dialog-trigger.ts"
Task: "Create dialog-content.ts in packages/wc/src/components/dialog/dialog-content.ts"
Task: "Create dialog-title.ts in packages/wc/src/components/dialog/dialog-title.ts"
Task: "Create dialog-description.ts in packages/wc/src/components/dialog/dialog-description.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (anchor-position primitive)
2. Complete Phase 2: Foundational (Field pattern)
3. Complete Phase 3: User Story 1 (Input + Field)
4. Complete Phase 4: User Story 2 (Dialog)
5. **STOP and VALIDATE**: Test both stories independently
6. Deploy/demo if ready - core form and overlay patterns established

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 + 2 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 3-6 → Test independently → Deploy/Demo (P2 features)
4. Add User Story 7-8 → Test independently → Deploy/Demo (P3 features)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Input + Field)
   - Developer B: User Story 2 (Dialog)
   - Developer C: User Story 3 (Textarea)
   - Developer D: User Story 4 (Checkbox + Radio)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Total tasks: 131
- All components require manifest.json and MDX documentation per FR-061, FR-062
