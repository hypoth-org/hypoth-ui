# Tasks: React Wrappers for Web Components

**Input**: Design documents from `/specs/008-react-wrappers/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Included - the spec requires >90% test coverage (SC-006).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and directory structure

- [x] T001 Create primitives directory at packages/react/src/primitives/
- [x] T002 Create types directory at packages/react/src/types/
- [x] T003 [P] Create primitives/index.ts barrel export at packages/react/src/primitives/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities that MUST be complete before ANY user story can be implemented

**These tasks are blocking** - Slot and merge-props are required by all asChild components.

- [x] T004 [P] Create event type definitions in packages/react/src/types/events.ts
- [x] T005 [P] Create polymorphic type utilities in packages/react/src/types/polymorphic.ts
- [x] T006 Implement merge-props utility with className concatenation, style merging, and event handler composition in packages/react/src/utils/merge-props.ts
- [x] T007 Write unit tests for merge-props in packages/react/tests/utils/merge-props.test.ts
- [x] T008 Implement Slot component with single-child validation, props merging, and ref forwarding in packages/react/src/primitives/slot.tsx
- [x] T009 Write unit tests for Slot (single child, props merge, event composition, ref merge) in packages/react/tests/primitives/slot.test.tsx
- [x] T010 Update create-component factory to support defaults option in packages/react/src/utils/create-component.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Type-Safe Component Usage (Priority: P1)

**Goal**: All components have typed props, event handlers, and refs with full TypeScript inference

**Independent Test**: Import any component, verify TypeScript enforces prop types, event handlers have correct signatures, refs resolve to correct element type

### Tests for User Story 1

- [x] T011 [P] [US1] Write type tests for Button props and events in packages/react/tests/components/button.test.tsx
- [x] T012 [P] [US1] Write type tests for Link props including onNavigate in packages/react/tests/components/link.test.tsx
- [x] T013 [P] [US1] Write type tests for Input props and event handlers in packages/react/tests/components/input.test.tsx

### Implementation for User Story 1

- [x] T014 [P] [US1] Implement Icon wrapper using createComponent factory in packages/react/src/components/icon.tsx
- [x] T015 [P] [US1] Implement Spinner wrapper using createComponent factory in packages/react/src/components/spinner.tsx
- [x] T016 [P] [US1] Implement VisuallyHidden wrapper using createComponent factory in packages/react/src/components/visually-hidden.tsx
- [x] T017 [US1] Implement Link wrapper with typed onNavigate event handler in packages/react/src/components/link.tsx
- [x] T018 [US1] Update existing Button wrapper with improved type exports in packages/react/src/components/button.tsx
- [x] T019 [US1] Update existing Input wrapper with improved type exports in packages/react/src/components/input.tsx
- [x] T020 [P] [US1] Write tests for Icon component in packages/react/tests/components/icon.test.tsx
- [x] T021 [P] [US1] Write tests for Spinner component in packages/react/tests/components/spinner.test.tsx
- [x] T022 [P] [US1] Write tests for VisuallyHidden component in packages/react/tests/components/visually-hidden.test.tsx

**Checkpoint**: All WC wrappers have typed props, TypeScript catches invalid prop values at compile time

---

## Phase 4: User Story 2 - asChild Polymorphism for Box/Text/Link (Priority: P1)

**Goal**: Box, Text, and Link support asChild prop for polymorphic rendering

**Independent Test**: Render Text with asChild wrapping an h1, verify output is styled h1 without nested elements

### Tests for User Story 2

- [x] T023 [P] [US2] Write tests for Box asChild behavior (semantic elements, className merge) in packages/react/tests/primitives/box.test.tsx
- [x] T024 [P] [US2] Write tests for Text asChild behavior (headings, paragraphs) in packages/react/tests/components/text.test.tsx
- [x] T025 [P] [US2] Write tests for Link asChild behavior (Next.js Link integration) in packages/react/tests/components/link.test.tsx

### Implementation for User Story 2

- [x] T026 [US2] Implement Box primitive with spacing/layout CSS class mapping and asChild support in packages/react/src/primitives/box.tsx
- [x] T027 [US2] Implement Text component (React-only) with typography CSS class mapping and asChild support in packages/react/src/components/text.tsx
- [x] T028 [US2] Add asChild support to Link wrapper using Slot in packages/react/src/components/link.tsx (update from T017)

**Checkpoint**: asChild components render single element with merged props, no wrapper elements

---

## Phase 5: User Story 3 - Event Handling with Custom Events (Priority: P1)

**Goal**: Properly typed event handlers for native and custom events

**Independent Test**: Add onNavigate to Link, click, verify handler receives typed event with href and external details

### Tests for User Story 3

- [x] T029 [P] [US3] Write tests for Link onNavigate event with typed detail in packages/react/tests/components/link.test.tsx (extend T012)
- [x] T030 [P] [US3] Write tests for Button click prevention in loading state in packages/react/tests/components/button.test.tsx
- [x] T031 [P] [US3] Write tests for Input onChange and onValueChange handlers in packages/react/tests/components/input.test.tsx

### Implementation for User Story 3

- [x] T032 [US3] Verify Link onNavigate handler receives CustomEvent with DsNavigateEventDetail in packages/react/src/components/link.tsx
- [x] T033 [US3] Verify Button onClick is not called when loading=true in packages/react/src/components/button.tsx
- [x] T034 [US3] Verify Input event handlers receive typed value and event in packages/react/src/components/input.tsx

**Checkpoint**: All event handlers are typed and work as expected

---

## Phase 6: User Story 4 - Next.js App Router Compatibility (Priority: P2)

**Goal**: Minimal client boundaries, types safe for server components

**Independent Test**: Import types in server component, import components in client component, verify no hydration errors

### Tests for User Story 4

- [x] T035 [P] [US4] Write tests verifying type-only imports have no runtime code in packages/react/tests/exports.test.ts

### Implementation for User Story 4

- [x] T036 [US4] Create client.ts with 'use client' directive exporting all interactive components in packages/react/src/client.ts
- [x] T037 [US4] Update index.ts to export types only (server-safe) in packages/react/src/index.ts
- [x] T038 [US4] Update package.json exports to include ./client entry point in packages/react/package.json

**Checkpoint**: Types importable in server components, components require 'use client'

---

## Phase 7: User Story 5 - Simple Re-exports vs Real Components (Priority: P2)

**Goal**: Clear distinction between type exports and component exports for bundle optimization

**Independent Test**: Tree-shake package, verify unused components eliminated, type-only imports add zero bytes

### Tests for User Story 5

- [x] T039 [US5] Verify sideEffects: false in package.json for tree-shaking in packages/react/package.json

### Implementation for User Story 5

- [x] T040 [US5] Add sideEffects: false to package.json in packages/react/package.json
- [x] T041 [US5] Document export types in JSDoc comments (type-only vs component) across all exports

**Checkpoint**: Bundle only includes imported components, types are zero-cost

---

## Phase 8: User Story 6 - Ref Forwarding (Priority: P2)

**Goal**: Refs resolve to underlying DOM elements with correct types

**Independent Test**: Pass ref to Button, verify ref.current is ds-button element

### Tests for User Story 6

- [x] T042 [P] [US6] Write ref forwarding tests for Button in packages/react/tests/components/button.test.tsx
- [x] T043 [P] [US6] Write ref forwarding tests for Box with asChild in packages/react/tests/primitives/box.test.tsx
- [x] T044 [P] [US6] Write callback ref tests for all components in packages/react/tests/refs.test.tsx

### Implementation for User Story 6

- [x] T045 [US6] Verify forwardRef implementation in all wrapper components
- [x] T046 [US6] Verify ref merging works correctly with asChild pattern in Slot

**Checkpoint**: All refs resolve to correct DOM elements, callback refs work

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation, and cleanup

- [x] T047 Run all tests and verify >90% coverage with pnpm --filter @ds/react test
- [x] T048 Run typecheck and verify zero TypeScript errors with pnpm --filter @ds/react typecheck
- [x] T049 Build package and verify bundle size <1KB per component with pnpm --filter @ds/react build
- [x] T050 Update primitives barrel export in packages/react/src/primitives/index.ts
- [x] T051 Validate quickstart.md examples work correctly
- [x] T052 Run full monorepo build to verify integration with pnpm build

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **US1-US3 (P1 stories)**: All depend on Foundational completion
  - US1 (Type-Safe): Can start after Foundational
  - US2 (asChild): Can start after Foundational - depends on Slot from T008
  - US3 (Events): Can start after US1 Link implementation (T017)
- **US4-US6 (P2 stories)**: Depend on US1-US3 component implementations
- **Polish (Phase 9)**: Depends on all user stories complete

### User Story Dependencies

```
Foundational (T004-T010)
        │
        ├─── US1: Type-Safe (T011-T022)
        │         └─── US3: Events (T029-T034) [needs Link from US1]
        │
        ├─── US2: asChild (T023-T028) [needs Slot from Foundational]
        │
        └─── After US1-US3 complete:
             ├─── US4: Next.js (T035-T038)
             ├─── US5: Tree-shake (T039-T041)
             └─── US6: Refs (T042-T046)
```

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Type definitions before component implementation
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 2 (Foundational):**
- T004, T005 can run in parallel (different type files)

**Phase 3 (US1):**
- T011, T012, T013 can run in parallel (different test files)
- T014, T015, T016 can run in parallel (factory components)
- T020, T021, T022 can run in parallel (component tests)

**Phase 4 (US2):**
- T023, T024, T025 can run in parallel (different test files)

**Phase 5 (US3):**
- T029, T030, T031 can run in parallel (different test files)

**Phase 8 (US6):**
- T042, T043, T044 can run in parallel (different test files)

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch type definitions in parallel:
Task: "Create event type definitions in packages/react/src/types/events.ts"
Task: "Create polymorphic type utilities in packages/react/src/types/polymorphic.ts"

# After types, launch these in parallel:
Task: "Implement merge-props utility in packages/react/src/utils/merge-props.ts"
Task: "Update create-component factory in packages/react/src/utils/create-component.ts"
```

## Parallel Example: Phase 3 (US1 Factory Components)

```bash
# Launch all factory wrappers together:
Task: "Implement Icon wrapper using createComponent factory"
Task: "Implement Spinner wrapper using createComponent factory"
Task: "Implement VisuallyHidden wrapper using createComponent factory"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: US1 - Type-Safe Component Usage
4. Complete Phase 4: US2 - asChild Polymorphism
5. Complete Phase 5: US3 - Event Handling
6. **STOP and VALIDATE**: Run tests, verify TypeScript, test asChild manually
7. Deploy/demo if ready - this is a functional MVP

### Incremental Delivery

1. Foundational → Types and utilities ready
2. Add US1 → Type-safe wrappers work → Test
3. Add US2 → asChild pattern works → Test
4. Add US3 → Events typed correctly → Test (MVP Complete!)
5. Add US4 → Next.js compatibility verified
6. Add US5 → Bundle optimization confirmed
7. Add US6 → Refs verified → Full feature complete

### Suggested MVP Scope

**US1 + US2 + US3** (all P1 priorities) = MVP

This delivers:
- All 7 wrapper components with typed props
- Box, Text, Link with asChild support
- Typed event handlers including onNavigate
- Ready for production React usage

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Button and Input already exist - tasks update/extend them
- Box and Text are React-only (no WC dependency)
- Link needs both WC wrapper AND asChild support
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
