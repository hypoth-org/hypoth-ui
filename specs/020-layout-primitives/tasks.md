# Tasks: Layout Primitives & Page Composition

**Input**: Design documents from `/specs/020-layout-primitives/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in spec - tests NOT included in task list.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md, this is a monorepo with:
- CSS: `packages/css/src/components/layout/`
- Web Components: `packages/wc/src/components/layout/`
- React: `packages/react/src/components/layout/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure and shared utilities for layout components

- [x] T001 Create layout directories in packages/css/src/components/layout/, packages/wc/src/components/layout/, packages/react/src/components/layout/
- [x] T002 [P] Create shared responsive value parser utility in packages/wc/src/utils/responsive.ts
- [x] T003 [P] Create token validation utility with dev-mode warnings in packages/wc/src/utils/token-validator.ts
- [x] T004 [P] Create shared TypeScript token types in packages/wc/src/types/layout-tokens.ts
- [x] T005 [P] Create React responsive value hook in packages/react/src/hooks/use-responsive-classes.ts

---

## Phase 2: Foundational (CSS Layer Integration)

**Purpose**: Create the CSS foundation that all layout components depend on

**CRITICAL**: No component implementation can begin until this phase is complete

- [x] T006 Create layout CSS index file in packages/css/src/components/layout/index.css with @layer components imports
- [x] T007 [P] Add responsive breakpoint media query mixins in packages/css/src/components/layout/_responsive.css
- [x] T008 [P] Add spacing token CSS custom properties for layout in packages/css/src/components/layout/_tokens.css
- [x] T009 Update packages/css/src/layers/components.css to import layout/index.css

**Checkpoint**: CSS foundation ready - component implementation can now begin

---

## Phase 3: User Story 1 - Basic Page Layout with Flow (Priority: P1) MVP

**Goal**: Developers can create responsive 1D layouts that switch direction at breakpoints with token-based gaps

**Independent Test**: Create a page with Flow components using `direction={{ base: "column", md: "row" }}` and verify layout switches at md breakpoint

### CSS for User Story 1

- [x] T010 [P] [US1] Create Flow base styles and direction variants in packages/css/src/components/layout/flow.css
- [x] T011 [US1] Add responsive direction classes (@media queries) in packages/css/src/components/layout/flow.css
- [x] T012 [US1] Add gap, align, justify, wrap, inline variants in packages/css/src/components/layout/flow.css

### Web Component for User Story 1

- [x] T013 [US1] Create ds-flow Web Component in packages/wc/src/components/layout/flow.ts with direction, gap, align, justify, wrap, inline, as props
- [x] T014 [US1] Implement responsive string parser for direction/gap in packages/wc/src/components/layout/flow.ts
- [x] T015 [US1] Add data attributes output for CSS selectors in packages/wc/src/components/layout/flow.ts

### React for User Story 1

- [x] T016 [US1] Create Flow React component in packages/react/src/components/layout/flow.tsx with responsive object prop syntax
- [x] T017 [US1] Create Stack alias component (Flow direction="column") in packages/react/src/components/layout/stack.tsx
- [x] T018 [US1] Create Inline alias component (Flow direction="row") in packages/react/src/components/layout/inline.tsx

### Exports for User Story 1

- [x] T019 [US1] Export ds-flow from packages/wc/src/components/layout/index.ts
- [x] T020 [US1] Export Flow, Stack, Inline from packages/react/src/components/layout/index.ts

**Checkpoint**: Flow component fully functional - responsive direction switching works in both WC and React

---

## Phase 4: User Story 2 - Container-Constrained Content (Priority: P1)

**Goal**: Developers can constrain content width with responsive max-widths and consistent padding

**Independent Test**: Render Container with `size="lg"` and verify max-width is 1024px with centered content

### CSS for User Story 2

- [x] T021 [P] [US2] Create Container base styles with max-width and centering in packages/css/src/components/layout/container.css
- [x] T022 [US2] Add size variants (sm, md, lg, xl, 2xl, full) in packages/css/src/components/layout/container.css
- [x] T023 [US2] Add padding variants using spacing tokens in packages/css/src/components/layout/container.css

### Web Component for User Story 2

- [x] T024 [US2] Create ds-container Web Component in packages/wc/src/components/layout/container.ts with size, padding, as props

### React for User Story 2

- [x] T025 [US2] Create Container React component in packages/react/src/components/layout/container.tsx

### Exports for User Story 2

- [x] T026 [US2] Export ds-container from packages/wc/src/components/layout/index.ts
- [x] T027 [US2] Export Container from packages/react/src/components/layout/index.ts

**Checkpoint**: Container component works with all size variants

---

## Phase 5: User Story 3 - Grid-Based Dashboard Layout (Priority: P1)

**Goal**: Developers can create responsive 2D grid layouts with column counts that adjust at breakpoints

**Independent Test**: Create Grid with `columns={{ base: 1, md: 2, lg: 3 }}` and verify column count changes

### CSS for User Story 3

- [x] T028 [P] [US3] Create Grid base styles with display grid in packages/css/src/components/layout/grid.css
- [x] T029 [US3] Add column count variants (1-12, auto-fit, auto-fill) in packages/css/src/components/layout/grid.css
- [x] T030 [US3] Add responsive column classes (@media queries) in packages/css/src/components/layout/grid.css
- [x] T031 [US3] Add gap, rowGap, columnGap variants in packages/css/src/components/layout/grid.css

### Web Component for User Story 3

- [x] T032 [US3] Create ds-grid Web Component in packages/wc/src/components/layout/grid.ts with columns, gap, rowGap, columnGap, as props
- [x] T033 [US3] Implement responsive columns parser in packages/wc/src/components/layout/grid.ts

### React for User Story 3

- [x] T034 [US3] Create Grid React component in packages/react/src/components/layout/grid.tsx

### Exports for User Story 3

- [x] T035 [US3] Export ds-grid from packages/wc/src/components/layout/index.ts
- [x] T036 [US3] Export Grid from packages/react/src/components/layout/index.ts

**Checkpoint**: Core layout trio (Flow, Container, Grid) complete - covers 80% of layouts

---

## Phase 6: User Story 4 - Box Token-Based Styling (Priority: P2)

**Goal**: Developers can apply padding, background, and radius using only design tokens

**Independent Test**: Render Box with `p="lg" bg="surface" radius="md"` and verify token-based styling applied

### CSS for User Story 4

- [x] T037 [P] [US4] Create Box base styles in packages/css/src/components/layout/box.css
- [x] T038 [US4] Add padding (p, px, py) data attribute selectors in packages/css/src/components/layout/box.css
- [x] T039 [US4] Add background and radius data attribute selectors in packages/css/src/components/layout/box.css

### Web Component for User Story 4

- [x] T040 [US4] Create ds-box Web Component in packages/wc/src/components/layout/box.ts with p, px, py, bg, radius, as props
- [x] T041 [US4] Add dev-mode token validation with console warnings in packages/wc/src/components/layout/box.ts

### React for User Story 4

- [x] T042 [US4] Create Box React component in packages/react/src/components/layout/box.tsx

### Exports for User Story 4

- [x] T043 [US4] Export ds-box from packages/wc/src/components/layout/index.ts
- [x] T044 [US4] Export Box from packages/react/src/components/layout/index.ts

**Checkpoint**: Box component works with token validation

---

## Phase 7: User Story 5 - App Shell Structure (Priority: P2)

**Goal**: Developers can create application shells with Header, Main, Footer, Sidebar regions and proper landmarks

**Independent Test**: Create AppShell with all regions, verify ARIA landmark roles present

### CSS for User Story 5

- [x] T045 [P] [US5] Create AppShell CSS Grid layout in packages/css/src/components/layout/app-shell.css
- [x] T046 [US5] Add sidebar position variants (left, right, none) in packages/css/src/components/layout/app-shell.css
- [x] T047 [P] [US5] Create Header styles with grid-area in packages/css/src/components/layout/header.css
- [x] T048 [P] [US5] Create Footer styles with grid-area in packages/css/src/components/layout/footer.css
- [x] T049 [P] [US5] Create Main styles with grid-area in packages/css/src/components/layout/main.css

### Web Components for User Story 5

- [x] T050 [US5] Create ds-app-shell Web Component in packages/wc/src/components/layout/app-shell/app-shell.ts
- [x] T051 [P] [US5] Create ds-header Web Component with banner role in packages/wc/src/components/layout/app-shell/header.ts
- [x] T052 [P] [US5] Create ds-footer Web Component with contentinfo role in packages/wc/src/components/layout/app-shell/footer.ts
- [x] T053 [P] [US5] Create ds-main Web Component with main role in packages/wc/src/components/layout/app-shell/main.ts
- [x] T054 [P] [US5] Create ds-sidebar Web Component in packages/wc/src/components/layout/app-shell/sidebar.ts

### React for User Story 5

- [x] T055 [US5] Create AppShell compound React component in packages/react/src/components/layout/app-shell.tsx with Header, Footer, Main, Sidebar sub-components

### Exports for User Story 5

- [x] T056 [US5] Export AppShell components from packages/wc/src/components/layout/index.ts
- [x] T057 [US5] Export AppShell from packages/react/src/components/layout/index.ts

**Checkpoint**: AppShell with landmark regions works in WC and React

---

## Phase 8: User Story 6 - Section Semantic Wrapper (Priority: P2)

**Goal**: Developers can create semantic section wrappers with consistent vertical spacing

**Independent Test**: Render Section with `spacing="lg"` and verify semantic `<section>` element with correct padding

### CSS for User Story 6

- [x] T058 [P] [US6] Create Section styles with spacing variants in packages/css/src/components/layout/section.css

### Web Component for User Story 6

- [x] T059 [US6] Create ds-section Web Component in packages/wc/src/components/layout/section.ts with spacing, as props

### React for User Story 6

- [x] T060 [US6] Create Section React component in packages/react/src/components/layout/section.tsx

### Exports for User Story 6

- [x] T061 [US6] Export ds-section from packages/wc/src/components/layout/index.ts
- [x] T062 [US6] Export Section from packages/react/src/components/layout/index.ts

**Checkpoint**: Section component provides semantic wrapper with spacing

---

## Phase 9: User Story 7 - Page Wrapper (Priority: P2)

**Goal**: Developers can create page wrappers with min-height and background tokens

**Independent Test**: Render Page with short content, verify it fills viewport height

### CSS for User Story 7

- [x] T063 [P] [US7] Create Page styles with min-height and background in packages/css/src/components/layout/page.css

### Web Component for User Story 7

- [x] T064 [US7] Create ds-page Web Component in packages/wc/src/components/layout/page.ts with bg, minHeight props

### React for User Story 7

- [x] T065 [US7] Create Page React component in packages/react/src/components/layout/page.tsx

### Exports for User Story 7

- [x] T066 [US7] Export ds-page from packages/wc/src/components/layout/index.ts
- [x] T067 [US7] Export Page from packages/react/src/components/layout/index.ts

**Checkpoint**: Page component establishes full-height pages

---

## Phase 10: User Story 8 - Header/Footer Sticky Options (Priority: P3)

**Goal**: Developers can add sticky positioning and safe-area support to Header/Footer

**Independent Test**: Render Header with `sticky`, scroll page, verify header stays fixed

### CSS for User Story 8

- [x] T068 [P] [US8] Add sticky positioning styles to header.css in packages/css/src/components/layout/header.css
- [x] T069 [P] [US8] Add sticky positioning styles to footer.css in packages/css/src/components/layout/footer.css
- [x] T070 [US8] Add safe-area-inset styles using env() in packages/css/src/components/layout/header.css and footer.css

### Web Component Updates for User Story 8

- [x] T071 [US8] Add sticky and safeArea props to ds-header in packages/wc/src/components/layout/app-shell/header.ts
- [x] T072 [US8] Add sticky and safeArea props to ds-footer in packages/wc/src/components/layout/app-shell/footer.ts

### React Updates for User Story 8

- [x] T073 [US8] Add sticky and safeArea props to Header/Footer in packages/react/src/components/layout/app-shell.tsx

**Checkpoint**: Header/Footer support sticky and safe-area

---

## Phase 11: User Story 9 - Center Component (Priority: P3)

**Goal**: Developers can center content horizontally/vertically with optional max-width

**Independent Test**: Render Center with `vertical maxWidth="md"`, verify centered content

### CSS for User Story 9

- [x] T074 [P] [US9] Create Center styles with horizontal/vertical centering in packages/css/src/components/layout/center.css
- [x] T075 [US9] Add maxWidth variants in packages/css/src/components/layout/center.css

### Web Component for User Story 9

- [x] T076 [US9] Create ds-center Web Component in packages/wc/src/components/layout/center.ts with maxWidth, vertical, as props

### React for User Story 9

- [x] T077 [US9] Create Center React component in packages/react/src/components/layout/center.tsx

### Exports for User Story 9

- [x] T078 [US9] Export ds-center from packages/wc/src/components/layout/index.ts
- [x] T079 [US9] Export Center from packages/react/src/components/layout/index.ts

**Checkpoint**: Center component works for horizontal and vertical centering

---

## Phase 12: User Story 10 - Split Layout (Priority: P3)

**Goal**: Developers can create two-region layouts that collapse at breakpoints

**Independent Test**: Create Split with `collapseAt="md"`, resize to verify collapse behavior

### CSS for User Story 10

- [x] T080 [P] [US10] Create Split CSS Grid layout in packages/css/src/components/layout/split.css
- [x] T081 [US10] Add ratio variants (equal, 1:2, 2:1, 1:3, 3:1) in packages/css/src/components/layout/split.css
- [x] T082 [US10] Add collapse breakpoint media queries in packages/css/src/components/layout/split.css
- [x] T083 [US10] Add reduced-motion transition support in packages/css/src/components/layout/split.css

### Web Component for User Story 10

- [x] T084 [US10] Create ds-split Web Component in packages/wc/src/components/layout/split.ts with collapseAt, gap, ratio props

### React for User Story 10

- [x] T085 [US10] Create Split React component in packages/react/src/components/layout/split.tsx

### Exports for User Story 10

- [x] T086 [US10] Export ds-split from packages/wc/src/components/layout/index.ts
- [x] T087 [US10] Export Split from packages/react/src/components/layout/index.ts

**Checkpoint**: Split component collapses responsively with motion respect

---

## Phase 13: User Story 11 - Wrap Layout (Priority: P3)

**Goal**: Developers can create wrapping row layouts for tags/chips

**Independent Test**: Render Wrap with many items, verify items wrap with consistent gaps

### CSS for User Story 11

- [x] T088 [P] [US11] Create Wrap styles with flex-wrap in packages/css/src/components/layout/wrap.css
- [x] T089 [US11] Add gap and align variants in packages/css/src/components/layout/wrap.css

### Web Component for User Story 11

- [x] T090 [US11] Create ds-wrap Web Component in packages/wc/src/components/layout/wrap.ts with gap, rowGap, align, as props

### React for User Story 11

- [x] T091 [US11] Create Wrap React component in packages/react/src/components/layout/wrap.tsx

### Exports for User Story 11

- [x] T092 [US11] Export ds-wrap from packages/wc/src/components/layout/index.ts
- [x] T093 [US11] Export Wrap from packages/react/src/components/layout/index.ts

**Checkpoint**: Wrap component handles multi-line layouts

---

## Phase 14: User Story 12 - Spacer Component (Priority: P4)

**Goal**: Developers can insert explicit spacing between elements

**Independent Test**: Insert Spacer with `size="lg"` between elements, verify correct space

### CSS for User Story 12

- [x] T094 [P] [US12] Create Spacer styles with size variants in packages/css/src/components/layout/spacer.css

### Web Component for User Story 12

- [x] T095 [US12] Create ds-spacer Web Component in packages/wc/src/components/layout/spacer.ts with size, axis props

### React for User Story 12

- [x] T096 [US12] Create Spacer React component in packages/react/src/components/layout/spacer.tsx

### Exports for User Story 12

- [x] T097 [US12] Export ds-spacer from packages/wc/src/components/layout/index.ts
- [x] T098 [US12] Export Spacer from packages/react/src/components/layout/index.ts

**Checkpoint**: All 14 layout components implemented

---

## Phase 15: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, exports, and documentation

- [x] T099 [P] Update packages/wc/src/index.ts to export all layout components
- [x] T100 [P] Update packages/react/src/index.ts to export all layout components
- [x] T101 [P] Update packages/css/src/index.css to import layout styles
- [x] T102 Verify all components have data-layout attribute for animation targeting
- [x] T103 Run typecheck across all packages
- [x] T104 Run lint across all packages
- [x] T105 Verify bundle size is under 3KB gzipped for layout components
- [ ] T106 Manual verification of SSR hydration (no layout shift)
- [x] T107 Create component manifest entries for all 14 layout components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 - BLOCKS all component work
- **User Stories 1-3 (Phase 3-5)**: P1 priority - core layout trio, can be parallelized
- **User Stories 4-7 (Phase 6-9)**: P2 priority - structural components
- **User Stories 8-11 (Phase 10-13)**: P3 priority - helper components
- **User Story 12 (Phase 14)**: P4 priority - spacer (lowest priority)
- **Polish (Phase 15)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (Flow)**: Foundation only - no story dependencies
- **US2 (Container)**: Foundation only - no story dependencies
- **US3 (Grid)**: Foundation only - no story dependencies
- **US4 (Box)**: Foundation only - no story dependencies
- **US5 (AppShell)**: Foundation only - Header/Footer/Main created here
- **US6 (Section)**: Foundation only - no story dependencies
- **US7 (Page)**: Foundation only - no story dependencies
- **US8 (Sticky Header/Footer)**: Depends on US5 (AppShell must exist)
- **US9 (Center)**: Foundation only - no story dependencies
- **US10 (Split)**: Foundation only - no story dependencies
- **US11 (Wrap)**: Foundation only - no story dependencies
- **US12 (Spacer)**: Foundation only - no story dependencies

### Within Each User Story

For each component:
1. CSS styles first
2. Web Component second
3. React wrapper third
4. Exports last

### Parallel Opportunities

**Parallel within Setup:**
- T002, T003, T004, T005 (all different files)

**Parallel within Foundational:**
- T007, T008 (different CSS files)

**Parallel User Stories (after Foundation):**
- US1, US2, US3 can run in parallel (different components)
- US4, US5, US6, US7 can run in parallel
- US9, US10, US11, US12 can run in parallel
- US8 must wait for US5

**Parallel within each User Story:**
- CSS files can parallelize with each other
- WC components marked [P] can parallelize

---

## Parallel Example: Core Layout Trio (US1, US2, US3)

```bash
# After Foundation complete, launch all core components in parallel:

# User Story 1: Flow
Task: "T010 [P] [US1] Create Flow base styles in packages/css/src/components/layout/flow.css"

# User Story 2: Container (parallel with US1)
Task: "T021 [P] [US2] Create Container base styles in packages/css/src/components/layout/container.css"

# User Story 3: Grid (parallel with US1, US2)
Task: "T028 [P] [US3] Create Grid base styles in packages/css/src/components/layout/grid.css"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational CSS
3. Complete Phase 3: Flow (US1)
4. Complete Phase 4: Container (US2)
5. Complete Phase 5: Grid (US3)
6. **STOP and VALIDATE**: Test that Flow + Container + Grid cover 80% of layouts
7. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundation → Ready
2. Add Flow → Test → Ready (US1)
3. Add Container → Test → Ready (US2)
4. Add Grid → Test → Ready (US3) **← Core trio complete, major milestone**
5. Add Box, AppShell, Section, Page → Test → Ready (US4-7)
6. Add Header/Footer sticky, Center, Split, Wrap → Test → Ready (US8-11)
7. Add Spacer → Test → Ready (US12)
8. Polish → Complete

### Suggested Stopping Points

- **After US3**: Core layout trio complete - usable for 80% of layouts
- **After US7**: All P1+P2 components complete - full page composition possible
- **After US12**: All components complete - ready for final polish

---

## Notes

- All layout components are stateless - no complex state management
- CSS-only responsive - no runtime JS for breakpoints
- Light DOM throughout - no Shadow DOM complexity
- Token validation in dev mode only - no production overhead
- Each story independently testable via quickstart.md patterns
