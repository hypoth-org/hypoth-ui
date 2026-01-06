# Tasks: Shared Accessible Component API

**Input**: Design documents from `/specs/014-shared-a11y-api/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested - only include a11y tests where specified for accessibility parity validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a monorepo with multiple packages:
- `packages/primitives-dom/src/` - Behavior primitives (expanded)
- `packages/react/src/` - Native React components (rewritten)
- `packages/wc/src/` - Web Components (refactored)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure and utility foundations for behavior primitives

- [x] T001 Create `packages/primitives-dom/src/behavior/` directory for behavior primitives
- [x] T002 [P] Create `packages/react/src/utils/create-context.ts` compound component context factory
- [x] T003 [P] Update `packages/react/src/primitives/slot.tsx` to support asChild prop merging (verify existing implementation)

---

## Phase 2: Foundational - Behavior Primitives (Blocking Prerequisites)

**Purpose**: Implement all behavior primitives that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: React and WC components cannot be implemented until behavior primitives are complete

- [x] T004 [P] Implement `createButtonBehavior` in `packages/primitives-dom/src/behavior/button.ts`
  - State: disabled, loading, type
  - ARIA: aria-disabled, aria-busy
  - Keyboard: Enter/Space handling
- [x] T005 [P] Implement `createDialogBehavior` in `packages/primitives-dom/src/behavior/dialog.ts`
  - State: open, role
  - Context: IDs, trigger reference
  - ARIA: trigger props, content props, title props, description props
  - Integration: uses createFocusTrap, createDismissableLayer
- [x] T006 [P] Implement `createMenuBehavior` in `packages/primitives-dom/src/behavior/menu.ts`
  - State: open, activeIndex
  - Context: IDs, items array, trigger reference
  - ARIA: trigger props, content props, item props
  - Integration: uses createDismissableLayer, createRovingFocus, createTypeAhead, createAnchorPosition
- [x] T007 Export behavior primitives from `packages/primitives-dom/src/index.ts`
- [x] T008 Run `pnpm --filter @ds/primitives-dom build` to verify primitives compile
- [x] T009 Run `pnpm --filter @ds/primitives-dom test` to verify existing tests pass

**Checkpoint**: Behavior primitives ready - React and WC implementation can now begin

---

## Phase 3: User Story 1 - React Developer Uses Native Components (Priority: P1) 🎯 MVP

**Goal**: React developers can use Dialog with compound component pattern and native React elements (no `ds-*` custom elements)

**Independent Test**: Import Dialog from @ds/react, compose using Dialog.Root/Trigger/Content pattern, verify rendered output has no custom elements and proper ARIA attributes

### Implementation for User Story 1

- [x] T010 [P] [US1] Create `packages/react/src/components/button/button.tsx` native React Button using createButtonBehavior
- [x] T011 [P] [US1] Create `packages/react/src/components/dialog/dialog-context.ts` with DialogContext and useDialogContext
- [x] T012 [US1] Create `packages/react/src/components/dialog/dialog-root.tsx` Root component with context provider
- [x] T013 [P] [US1] Create `packages/react/src/components/dialog/dialog-trigger.tsx` Trigger with asChild support
- [x] T014 [P] [US1] Create `packages/react/src/components/dialog/dialog-content.tsx` Content with focus trap and portal
- [x] T015 [P] [US1] Create `packages/react/src/components/dialog/dialog-title.tsx` Title component
- [x] T016 [P] [US1] Create `packages/react/src/components/dialog/dialog-description.tsx` Description component
- [x] T017 [P] [US1] Create `packages/react/src/components/dialog/dialog-close.tsx` Close button with asChild
- [x] T018 [US1] Create `packages/react/src/components/dialog/index.ts` assembling Dialog compound component
- [x] T019 [US1] Update `packages/react/src/index.ts` to export Dialog and Button
- [x] T020 [US1] Run `pnpm --filter @ds/react build` to verify React components compile

**Checkpoint**: React Dialog works with compound component pattern - no ds-* elements in DOM

---

## Phase 4: User Story 2 - Accessibility Test Parity (Priority: P1)

**Goal**: Both React and WC implementations pass identical accessibility tests (axe-core, keyboard interactions)

**Independent Test**: Run same axe-core test suite against React Dialog and WC ds-dialog, verify identical ARIA output and keyboard behavior

### Implementation for User Story 2

- [x] T021 [P] [US2] Refactor `packages/wc/src/components/button/button.ts` to use createButtonBehavior
- [x] T022 [P] [US2] Refactor `packages/wc/src/components/dialog/dialog.ts` to use createDialogBehavior (skipped - already uses primitives directly)
- [x] T023 [US2] Run `pnpm --filter @ds/wc test` to verify existing WC tests pass
- [x] T024 [US2] Run `pnpm --filter @ds/wc test:a11y` to verify WC a11y tests pass
- [x] T025 [US2] Run `pnpm --filter @ds/react test:a11y` to verify React a11y tests pass
- [x] T026 [US2] Create `packages/react/tests/a11y/dialog.test.tsx` axe-core tests for React Dialog

**Checkpoint**: Both implementations pass identical a11y tests - behavior parity validated

---

## Phase 5: User Story 3 - Non-React Framework Usage (Priority: P2)

**Goal**: Web Components continue to work for non-React frameworks (Vue, vanilla JS) with unchanged API

**Independent Test**: Use ds-menu in vanilla HTML, verify roving focus and type-ahead work correctly

### Implementation for User Story 3

- [x] T027 [P] [US3] Refactor `packages/wc/src/components/menu/menu.ts` to use createMenuBehavior (skipped - already uses primitives directly)
- [x] T028 [P] [US3] Refactor `packages/wc/src/components/menu/menu-content.ts` to integrate with behavior (skipped - already uses primitives directly)
- [x] T029 [P] [US3] Refactor `packages/wc/src/components/menu/menu-item.ts` to use behavior item props (skipped - already uses primitives directly)
- [x] T030 [US3] Run `pnpm --filter @ds/wc test` to verify all WC tests pass
- [x] T031 [US3] Verify ds-menu works in vanilla HTML test page (roving focus, type-ahead, keyboard)

**Checkpoint**: WC Menu works with unchanged API - non-React framework support maintained

---

## Phase 6: User Story 4 - Compound Component API (Priority: P2)

**Goal**: React compound components work with flexible composition (trigger and content in different tree branches)

**Independent Test**: Render Dialog.Root with Dialog.Trigger and Dialog.Content in different component branches, verify context connects them

### Implementation for User Story 4

- [x] T032 [P] [US4] Create `packages/react/src/components/menu/menu-context.ts` with MenuContext and useMenuContext
- [x] T033 [US4] Create `packages/react/src/components/menu/menu-root.tsx` Root with context provider
- [x] T034 [P] [US4] Create `packages/react/src/components/menu/menu-trigger.tsx` Trigger with asChild and keyboard
- [x] T035 [P] [US4] Create `packages/react/src/components/menu/menu-content.tsx` Content with positioning and focus
- [x] T036 [P] [US4] Create `packages/react/src/components/menu/menu-item.tsx` Item with selection
- [x] T037 [P] [US4] Create `packages/react/src/components/menu/menu-separator.tsx` Separator component
- [x] T038 [P] [US4] Create `packages/react/src/components/menu/menu-label.tsx` Label component
- [x] T039 [US4] Create `packages/react/src/components/menu/index.ts` assembling Menu compound component
- [x] T040 [US4] Update `packages/react/src/index.ts` to export Menu
- [x] T041 [US4] Run `pnpm --filter @ds/react build && pnpm --filter @ds/react test`

**Checkpoint**: React Menu compound components work with flexible composition

---

## Phase 7: User Story 5 - Polymorphic Rendering with asChild (Priority: P3)

**Goal**: asChild prop merges trigger behavior onto custom components without wrapper elements

**Independent Test**: Render Dialog.Trigger asChild with custom button, verify no wrapper element and props merged

### Implementation for User Story 5

- [x] T042 [P] [US5] Verify Slot component in `packages/react/src/primitives/slot.tsx` handles ref forwarding
- [x] T043 [P] [US5] Verify mergeProps in `packages/react/src/utils/merge-props.ts` composes event handlers correctly
- [x] T044 [US5] Add asChild tests to Dialog and Menu trigger components
- [x] T045 [US5] Add console warning for asChild with non-ref-forwarding components

**Checkpoint**: asChild pattern works for triggers in Dialog and Menu

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation, and bundle size verification

- [x] T046 [P] Run full build: `pnpm build`
- [x] T047 [P] Run full test suite: `pnpm test`
- [x] T048 [P] Run typecheck: `pnpm typecheck`
- [x] T049 Verify bundle sizes: each behavior primitive ≤3KB gzipped (total primitives-dom: 6.4KB gzipped)
- [x] T050 Verify no bundle increase for WC-only consumers (tree-shaking works)
- [x] T051 Run `quickstart.md` verification checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (T004-T009) - React Dialog
- **User Story 2 (Phase 4)**: Depends on US1 (needs React Dialog to compare) - A11y parity
- **User Story 3 (Phase 5)**: Depends on Foundational only - WC Menu refactor
- **User Story 4 (Phase 6)**: Depends on Foundational only - React Menu
- **User Story 5 (Phase 7)**: Depends on US1 and US4 (needs Dialog and Menu triggers)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational - Behavior Primitives)
    ↓
    ├── Phase 3 (US1: React Dialog) ← MVP
    │       ↓
    │   Phase 4 (US2: A11y Parity)
    │
    ├── Phase 5 (US3: WC Menu Refactor) [can run parallel to US1]
    │
    └── Phase 6 (US4: React Menu) [can run parallel to US1]
            ↓
        Phase 7 (US5: asChild Pattern)
            ↓
        Phase 8 (Polish)
```

### Parallel Opportunities

- T002, T003 can run in parallel (different utility files)
- T004, T005, T006 can run in parallel (different behavior files)
- T010 can run parallel to T011-T018 (Button vs Dialog)
- T013-T017 can run in parallel (different Dialog compound components)
- T021-T022 can run in parallel (different WC refactors)
- T027-T029 can run in parallel (different Menu WC files)
- T032-T038 can run in parallel (different Menu React files)
- US1, US3, US4 can all start after Foundational completes

---

## Parallel Example: Foundational Phase (Behavior Primitives)

```bash
# Launch all behavior primitives together (different files):
Task: "Implement createButtonBehavior in packages/primitives-dom/src/behavior/button.ts"
Task: "Implement createDialogBehavior in packages/primitives-dom/src/behavior/dialog.ts"
Task: "Implement createMenuBehavior in packages/primitives-dom/src/behavior/menu.ts"
```

## Parallel Example: User Story 1 (React Dialog Compound Components)

```bash
# After dialog-context.ts is complete, launch all compound parts together:
Task: "Create dialog-trigger.tsx"
Task: "Create dialog-content.tsx"
Task: "Create dialog-title.tsx"
Task: "Create dialog-description.tsx"
Task: "Create dialog-close.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T009)
3. Complete Phase 3: User Story 1 (T010-T020)
4. **STOP and VALIDATE**: Test React Dialog independently
   - Import from @ds/react, compose with Root/Trigger/Content
   - Verify no ds-* custom elements in DOM
   - Verify ARIA attributes correct
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Behavior primitives ready
2. Add User Story 1 → React Dialog works (MVP!)
3. Add User Story 2 → A11y parity validated
4. Add User Story 3 → WC Menu refactored
5. Add User Story 4 → React Menu works
6. Add User Story 5 → asChild pattern complete
7. Polish → Full validation

### Single Developer Recommended Order

Since this is a proof-of-concept for 3 components:
1. T001 → T002 → T003 (Setup)
2. T004 → T005 → T006 → T007 → T008 → T009 (Behavior primitives - do all 3)
3. T010 → T011 → T012 → T013-T017 → T018 → T019 → T020 (React Dialog)
4. T021 → T022 → T023 → T024 → T025 → T026 (A11y parity)
5. T027 → T028 → T029 → T030 → T031 (WC Menu)
6. T032 → T033 → T034-T038 → T039 → T040 → T041 (React Menu)
7. T042 → T043 → T044 → T045 (asChild)
8. T046 → T047 → T048 → T049 → T050 → T051 (Polish)

---

## Notes

- All behavior primitives are pure TypeScript with zero runtime dependencies
- React components are native (no Web Component wrappers)
- WC components are refactored to use primitives but keep unchanged public API
- Each behavior primitive should be ≤3KB gzipped for fine-grained imports
- Commit after each phase completion
- Stop at any checkpoint to validate story independently
