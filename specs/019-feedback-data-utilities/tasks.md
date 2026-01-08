# Tasks: Feedback, Data Display & Utilities

**Input**: Design documents from `/specs/019-feedback-data-utilities/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing. Each component requires WC implementation, React wrapper, and CSS.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and utility primitives that other components depend on

- [X] T001 Create component directory structure for all new components per plan.md
- [X] T002 [P] Add semantic status color tokens (info, success, warning, danger) in packages/tokens/src/semantic/status.json
- [X] T003 [P] Create base CSS variables for feedback components in packages/css/src/components/_feedback-base.css

---

## Phase 2: Foundational (Utility Primitives - US12)

**Purpose**: Core utility primitives that MUST be complete before feedback/display components

**⚠️ CRITICAL**: Toast, dialogs, and overlays depend on Portal. FocusScope needed by complex components.

**Goal**: Provide Portal, FocusScope, ClientOnly utilities for SSR-safe, accessible component development

**Independent Test**: Use Portal to render content to document.body, FocusScope to trap focus, ClientOnly to prevent SSR

### Implementation for Utility Primitives

- [X] T004 [P] [US12] Create Portal primitive in packages/primitives-dom/src/layer/portal.ts
- [X] T005 [P] [US12] Create FocusScope primitive in packages/primitives-dom/src/focus/focus-scope.ts
- [X] T006 [P] [US12] Create ClientOnly utility in packages/primitives-dom/src/ssr/client-only.ts
- [X] T007 [US12] Export new primitives from packages/primitives-dom/src/index.ts
- [X] T008 [P] [US12] Create Portal React component in packages/react/src/primitives/portal.tsx
- [X] T009 [P] [US12] Create FocusScope React component in packages/react/src/primitives/focus-scope.tsx
- [X] T010 [P] [US12] Create ClientOnly React component in packages/react/src/primitives/client-only.tsx
- [X] T011 [US12] Export React primitives from packages/react/src/primitives/index.ts

**Checkpoint**: Foundation ready - all user story implementation can now begin

---

## Phase 3: User Story 1 - Alert (Priority: P1) 🎯 MVP

**Goal**: Display contextual status messages (info, success, warning, error) with proper ARIA roles

**Independent Test**: Create form with success/error alerts based on validation - component should announce errors immediately to screen readers

### Implementation for Alert

- [X] T012 [P] [US1] Create Alert CSS styles in packages/css/src/components/alert.css
- [X] T013 [P] [US1] Create Alert WC in packages/wc/src/components/alert/alert.ts (variants, closable, icon/action slots)
- [X] T014 [US1] Register Alert in packages/wc/src/components/alert/index.ts with define()
- [X] T015 [US1] Export Alert from packages/wc/src/index.ts
- [X] T016 [P] [US1] Create Alert React wrapper in packages/react/src/components/alert/index.tsx
- [X] T017 [US1] Export Alert from packages/react/src/index.ts and packages/react/src/client.ts

**Checkpoint**: Alert component fully functional with all 4 variants and proper ARIA roles

---

## Phase 4: User Story 2 - Toast (Priority: P1)

**Goal**: Non-blocking notifications with queue management, auto-dismiss, and imperative API

**Independent Test**: Trigger toast() calls and verify stacking, pause on hover, and dismiss behavior

**Dependencies**: Requires Portal (Phase 2) for rendering toasts to document.body

### Implementation for Toast

- [X] T018 [P] [US2] Create Toast CSS styles in packages/css/src/components/toast.css (animations, positions)
- [X] T019 [P] [US2] Create ToastProvider WC in packages/wc/src/components/toast/toast-provider.ts (queue management)
- [X] T020 [US2] Create Toast WC in packages/wc/src/components/toast/toast.ts (individual toast element)
- [X] T021 [US2] Create toast controller and dsToast() imperative API in packages/wc/src/components/toast/toast-controller.ts
- [X] T022 [US2] Register Toast components in packages/wc/src/components/toast/index.ts
- [X] T023 [US2] Export Toast from packages/wc/src/index.ts
- [X] T024 [P] [US2] Create Toast.Provider React wrapper in packages/react/src/components/toast/provider.tsx
- [X] T025 [US2] Create Toast React component in packages/react/src/components/toast/toast.tsx
- [X] T026 [US2] Create useToast hook in packages/react/src/components/toast/use-toast.ts
- [X] T027 [US2] Export Toast compound component from packages/react/src/components/toast/index.tsx
- [X] T028 [US2] Export Toast from packages/react/src/index.ts and packages/react/src/client.ts

**Checkpoint**: Toast system working with imperative API, queue management, and proper ARIA live regions

---

## Phase 5: User Story 3 - Progress (Priority: P1)

**Goal**: Show loading progress with linear/circular variants and determinate/indeterminate modes

**Independent Test**: Create file upload with progress bar tracking upload percentage and page load spinner

### Implementation for Progress

- [X] T029 [P] [US3] Create Progress CSS styles in packages/css/src/components/progress.css (linear, circular, animations)
- [X] T030 [P] [US3] Create Progress WC in packages/wc/src/components/progress/progress.ts (value, max, variant, indeterminate)
- [X] T031 [US3] Register Progress in packages/wc/src/components/progress/index.ts
- [X] T032 [US3] Export Progress from packages/wc/src/index.ts
- [X] T033 [P] [US3] Create Progress React wrapper in packages/react/src/components/progress/index.tsx
- [X] T034 [US3] Export Progress from packages/react/src/index.ts and packages/react/src/client.ts

**Checkpoint**: Progress component working with both variants and proper ARIA progressbar role

---

## Phase 6: User Story 4 - Avatar (Priority: P2)

**Goal**: Display user avatars with fallback chain (image → initials → icon) and status indicators

**Independent Test**: Create user profile card with avatar showing fallback when image fails

### Implementation for Avatar

- [X] T035 [P] [US4] Create Avatar CSS styles in packages/css/src/components/avatar.css (sizes, status indicators)
- [X] T036 [P] [US4] Create Avatar WC in packages/wc/src/components/avatar/avatar.ts (src, name, size, status)
- [X] T037 [US4] Create AvatarGroup WC in packages/wc/src/components/avatar/avatar-group.ts (max, overflow)
- [X] T038 [US4] Register Avatar components in packages/wc/src/components/avatar/index.ts
- [X] T039 [US4] Export Avatar from packages/wc/src/index.ts
- [X] T040 [P] [US4] Create Avatar React wrapper in packages/react/src/components/avatar/avatar.tsx
- [X] T041 [US4] Create AvatarGroup React wrapper in packages/react/src/components/avatar/avatar-group.tsx
- [X] T042 [US4] Export Avatar compound component from packages/react/src/components/avatar/index.tsx
- [X] T043 [US4] Export Avatar from packages/react/src/index.ts and packages/react/src/client.ts

**Checkpoint**: Avatar component with fallback chain and AvatarGroup with overflow indicator

---

## Phase 7: User Story 5 - Table (Priority: P2)

**Goal**: Structured table with sorting, row selection, and proper ARIA grid semantics

**Independent Test**: Create user management table with sortable columns and multi-row selection

**Dependencies**: Requires table behavior primitive for sorting/selection

### Implementation for Table

- [X] T044 [P] [US5] Create table behavior utility in packages/primitives-dom/src/behavior/table.ts (sorting, selection)
- [X] T045 [P] [US5] Create Table CSS styles in packages/css/src/components/table.css
- [X] T046 [P] [US5] Create Table WC in packages/wc/src/components/table/table.ts (root container)
- [X] T047 [US5] Create TableHeader WC in packages/wc/src/components/table/table-header.ts
- [X] T048 [US5] Create TableBody WC in packages/wc/src/components/table/table-body.ts
- [X] T049 [US5] Create TableRow WC in packages/wc/src/components/table/table-row.ts
- [X] T050 [US5] Create TableHead WC in packages/wc/src/components/table/table-head.ts (sortable, align)
- [X] T051 [US5] Create TableCell WC in packages/wc/src/components/table/table-cell.ts
- [X] T052 [US5] Register Table components in packages/wc/src/components/table/index.ts
- [X] T053 [US5] Export Table from packages/wc/src/index.ts
- [X] T054 [P] [US5] Create Table.Root React wrapper in packages/react/src/components/table/root.tsx
- [X] T055 [US5] Create Table sub-component React wrappers in packages/react/src/components/table/
- [X] T056 [US5] Export Table compound component from packages/react/src/components/table/index.tsx
- [X] T057 [US5] Export Table from packages/react/src/index.ts and packages/react/src/client.ts

**Checkpoint**: Table component with sorting, selection, and ARIA grid pattern

---

## Phase 8: User Story 6 - Skeleton (Priority: P2)

**Goal**: Loading placeholders with shimmer animation and reduced-motion support

**Independent Test**: Create card grid that shows skeletons before data loads

### Implementation for Skeleton

- [X] T058 [P] [US6] Create Skeleton CSS styles in packages/css/src/components/skeleton.css (shimmer animation, reduced-motion)
- [X] T059 [P] [US6] Create Skeleton WC in packages/wc/src/components/skeleton/skeleton.ts (variant, dimensions, animation)
- [X] T060 [US6] Register Skeleton in packages/wc/src/components/skeleton/index.ts
- [X] T061 [US6] Export Skeleton from packages/wc/src/index.ts
- [X] T062 [P] [US6] Create Skeleton React wrapper in packages/react/src/components/skeleton/index.tsx
- [X] T063 [US6] Export Skeleton from packages/react/src/index.ts and packages/react/src/client.ts

**Checkpoint**: Skeleton component with GPU-accelerated animation and reduced-motion compliance

---

## Phase 9: User Story 7 - Badge and Tag (Priority: P2)

**Goal**: Badge for counts/indicators and Tag for categorization with remove action

**Independent Test**: Create notification icon with count badge and article with removable tags

### Implementation for Badge

- [X] T064 [P] [US7] Create Badge CSS styles in packages/css/src/components/badge.css
- [X] T065 [P] [US7] Create Badge WC in packages/wc/src/components/badge/badge.ts (count, max, dot, variant)
- [X] T066 [US7] Register Badge in packages/wc/src/components/badge/index.ts
- [X] T067 [US7] Export Badge from packages/wc/src/index.ts
- [X] T068 [P] [US7] Create Badge React wrapper in packages/react/src/components/badge/index.tsx
- [X] T069 [US7] Export Badge from packages/react/src/index.ts and packages/react/src/client.ts

### Implementation for Tag

- [X] T070 [P] [US7] Create Tag CSS styles in packages/css/src/components/tag.css
- [X] T071 [P] [US7] Create Tag WC in packages/wc/src/components/tag/tag.ts (variant, colorScheme, removable)
- [X] T072 [US7] Register Tag in packages/wc/src/components/tag/index.ts
- [X] T073 [US7] Export Tag from packages/wc/src/index.ts
- [X] T074 [P] [US7] Create Tag React wrapper in packages/react/src/components/tag/index.tsx
- [X] T075 [US7] Export Tag from packages/react/src/index.ts and packages/react/src/client.ts

**Checkpoint**: Badge and Tag components complete with all variants

---

## Phase 10: User Story 8 - Tree (Priority: P3)

**Goal**: Hierarchical data display with expand/collapse, keyboard navigation, and ARIA tree pattern

**Independent Test**: Create file browser tree with expand/collapse and selection

**Dependencies**: Requires tree behavior primitive for keyboard navigation

### Implementation for Tree

- [X] T076 [P] [US8] Create tree behavior utility in packages/primitives-dom/src/behavior/tree.ts (keyboard nav, typeahead)
- [X] T077 [P] [US8] Create Tree CSS styles in packages/css/src/components/tree.css (indentation, expand icons)
- [X] T078 [P] [US8] Create Tree WC in packages/wc/src/components/tree/tree.ts (root with selection mode)
- [X] T079 [US8] Create TreeItem WC in packages/wc/src/components/tree/tree-item.ts (expanded, selected, disabled)
- [X] T080 [US8] Register Tree components in packages/wc/src/components/tree/index.ts
- [X] T081 [US8] Export Tree from packages/wc/src/index.ts
- [X] T082 [P] [US8] Create Tree React wrapper in packages/react/src/components/tree/tree.tsx
- [X] T083 [US8] Create TreeItem React wrapper in packages/react/src/components/tree/tree-item.tsx
- [X] T084 [US8] Export Tree compound component from packages/react/src/components/tree/index.tsx
- [X] T085 [US8] Export Tree from packages/react/src/index.ts and packages/react/src/client.ts

**Checkpoint**: Tree component with ARIA tree pattern and keyboard navigation

---

## Phase 11: User Story 9 - List (Priority: P3)

**Goal**: Collection display with keyboard navigation, selection, and typeahead

**Independent Test**: Create contact list with selection and keyboard navigation

**Dependencies**: Requires list behavior primitive for keyboard navigation

### Implementation for List

- [X] T086 [P] [US9] Create list behavior utility in packages/primitives-dom/src/behavior/list.ts (keyboard nav, typeahead)
- [X] T087 [P] [US9] Create List CSS styles in packages/css/src/components/list.css
- [X] T088 [P] [US9] Create List WC in packages/wc/src/components/list/list.ts (selection mode)
- [X] T089 [US9] Create ListItem WC in packages/wc/src/components/list/list-item.ts (leading/trailing slots)
- [X] T090 [US9] Register List components in packages/wc/src/components/list/index.ts
- [X] T091 [US9] Export List from packages/wc/src/index.ts
- [X] T092 [P] [US9] Create List React wrapper in packages/react/src/components/list/list.tsx
- [X] T093 [US9] Create ListItem React wrapper in packages/react/src/components/list/list-item.tsx
- [X] T094 [US9] Export List compound component from packages/react/src/components/list/index.tsx
- [X] T095 [US9] Export List from packages/react/src/index.ts and packages/react/src/client.ts

**Checkpoint**: List component with ARIA listbox pattern and keyboard navigation

---

## Phase 12: User Story 10 - Calendar (Priority: P3)

**Goal**: Month grid display with navigation, event rendering, and ARIA grid semantics

**Independent Test**: Create month view calendar with events displayed on dates

### Implementation for Calendar

- [X] T096 [P] [US10] Create Calendar CSS styles in packages/css/src/components/calendar.css (grid, day cells)
- [X] T097 [P] [US10] Create Calendar WC in packages/wc/src/components/calendar/calendar.ts (value, min/max, locale)
- [X] T098 [US10] Register Calendar in packages/wc/src/components/calendar/index.ts
- [X] T099 [US10] Export Calendar from packages/wc/src/index.ts
- [X] T100 [P] [US10] Create Calendar React wrapper in packages/react/src/components/calendar/index.tsx
- [X] T101 [US10] Export Calendar from packages/react/src/index.ts and packages/react/src/client.ts

**Checkpoint**: Calendar component with month navigation and ARIA grid pattern

---

## Phase 13: User Story 11 - DataTable (Priority: P3)

**Goal**: Large dataset display with virtualization, filtering, pagination, and column resizing

**Independent Test**: Create paginated, filterable table with 10,000+ rows maintaining 60fps scroll

**Dependencies**: Requires Table (Phase 7) as foundation

### Implementation for DataTable

- [ ] T102 [P] [US11] Create DataTable CSS styles in packages/css/src/components/data-table.css (virtualization, pagination)
- [ ] T103 [P] [US11] Create virtualization utility in packages/primitives-dom/src/behavior/virtual-list.ts
- [ ] T104 [US11] Create DataTable WC in packages/wc/src/components/data-table/data-table.ts (page, filter, virtualize)
- [ ] T105 [US11] Register DataTable in packages/wc/src/components/data-table/index.ts
- [ ] T106 [US11] Export DataTable from packages/wc/src/index.ts
- [ ] T107 [P] [US11] Create DataTable React wrapper in packages/react/src/components/data-table/index.tsx
- [ ] T108 [US11] Export DataTable from packages/react/src/index.ts and packages/react/src/client.ts

**Checkpoint**: DataTable with virtualization handling 100k rows at 60fps

---

## Phase 14: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, validation, and documentation

- [ ] T109 [P] Verify all components use semantic status tokens consistently
- [ ] T110 [P] Verify all animations respect prefers-reduced-motion
- [ ] T111 [P] Update packages/wc/README.md with new component documentation
- [ ] T112 [P] Update packages/react/README.md with new component documentation
- [ ] T113 Run bundle size check and verify <45KB gzipped target
- [ ] T114 Update CLI registry in packages/cli/src/registry/ with new components
- [ ] T115 Validate quickstart.md examples work correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - Portal/FocusScope BLOCK Toast and overlays
- **User Stories (Phase 3-13)**: All depend on Foundational phase completion
  - P1 stories (Alert, Toast, Progress) can proceed in parallel after Phase 2
  - P2 stories can proceed in parallel after Phase 2
  - P3 stories can proceed in parallel after Phase 2
  - DataTable (US11) depends on Table (US5) completion
- **Polish (Phase 14)**: Depends on all component phases being complete

### User Story Dependencies

| Story | Priority | Depends On | Can Start After |
|-------|----------|------------|-----------------|
| US12 (Utilities) | P1 | Setup | Phase 1 |
| US1 (Alert) | P1 | Utilities | Phase 2 |
| US2 (Toast) | P1 | Utilities (Portal) | Phase 2 |
| US3 (Progress) | P1 | Utilities | Phase 2 |
| US4 (Avatar) | P2 | Utilities | Phase 2 |
| US5 (Table) | P2 | Utilities | Phase 2 |
| US6 (Skeleton) | P2 | Utilities | Phase 2 |
| US7 (Badge/Tag) | P2 | Utilities | Phase 2 |
| US8 (Tree) | P3 | Utilities | Phase 2 |
| US9 (List) | P3 | Utilities | Phase 2 |
| US10 (Calendar) | P3 | Utilities | Phase 2 |
| US11 (DataTable) | P3 | Table (US5) | Phase 7 |

### Parallel Opportunities Per Phase

**Phase 2 (Foundational)**:
- T004, T005, T006 can run in parallel (different primitives)
- T008, T009, T010 can run in parallel (different React components)

**Phase 3-6 (P1 Components)**:
- After Phase 2, Alert (US1), Toast (US2), Progress (US3) can all start in parallel
- Within each: CSS and WC can run in parallel, React depends on WC

**Phase 6-9 (P2 Components)**:
- Avatar (US4), Table (US5), Skeleton (US6), Badge/Tag (US7) can all run in parallel
- Table is complex - allocate more time

**Phase 10-13 (P3 Components)**:
- Tree (US8), List (US9), Calendar (US10) can run in parallel
- DataTable (US11) must wait for Table (US5)

---

## Parallel Example: P1 Components

```bash
# After Phase 2 completes, launch all P1 component CSS in parallel:
Task: "Create Alert CSS styles in packages/css/src/components/alert.css"
Task: "Create Toast CSS styles in packages/css/src/components/toast.css"
Task: "Create Progress CSS styles in packages/css/src/components/progress.css"

# Launch all P1 component WCs in parallel:
Task: "Create Alert WC in packages/wc/src/components/alert/alert.ts"
Task: "Create ToastProvider WC in packages/wc/src/components/toast/toast-provider.ts"
Task: "Create Progress WC in packages/wc/src/components/progress/progress.ts"
```

---

## Implementation Strategy

### MVP First (P1 Components Only)

1. Complete Phase 1: Setup (tokens, base CSS)
2. Complete Phase 2: Foundational utilities (Portal, FocusScope, ClientOnly)
3. Complete Phase 3-5: P1 components (Alert, Toast, Progress)
4. **STOP and VALIDATE**: Test feedback components independently
5. Deploy/demo feedback layer

### Incremental Delivery

1. **Foundation**: Setup + Utilities → Basic infrastructure ready
2. **Feedback MVP**: Add Alert, Toast, Progress → Core feedback patterns available
3. **App Chrome**: Add Avatar, Badge, Tag, Skeleton → User identity and loading states
4. **Data Display**: Add Table → Basic data display ready
5. **Advanced Data**: Add List, Tree, Calendar → Navigation patterns
6. **Enterprise**: Add DataTable → Large dataset handling

### Task Counts by Story

| Phase | Story | Tasks | Parallel |
|-------|-------|-------|----------|
| 1 | Setup | 3 | 2 |
| 2 | US12 (Utilities) | 8 | 6 |
| 3 | US1 (Alert) | 6 | 3 |
| 4 | US2 (Toast) | 11 | 2 |
| 5 | US3 (Progress) | 6 | 3 |
| 6 | US4 (Avatar) | 9 | 3 |
| 7 | US5 (Table) | 14 | 3 |
| 8 | US6 (Skeleton) | 6 | 3 |
| 9 | US7 (Badge/Tag) | 12 | 6 |
| 10 | US8 (Tree) | 10 | 4 |
| 11 | US9 (List) | 10 | 4 |
| 12 | US10 (Calendar) | 6 | 3 |
| 13 | US11 (DataTable) | 7 | 3 |
| 14 | Polish | 7 | 4 |
| **Total** | | **115** | **49** |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- CSS and WC tasks can run in parallel within a story
- React wrappers depend on WC implementation
- Commit after each task or logical group
- Toast requires Portal from Phase 2 - do not start Toast before utilities complete
- DataTable requires Table - do not start DataTable before Table complete
