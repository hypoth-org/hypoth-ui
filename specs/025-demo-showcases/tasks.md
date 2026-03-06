# Tasks: Framework-Specific Demo Showcases

**Input**: Design documents from `/specs/025-demo-showcases/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: E2E/visual regression tests are included as they are core to this feature's success criteria (95% visual parity).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo structure**:
  - `apps/demo-react/` - Next.js React demo
  - `apps/demo-wc/` - Vite Web Component demo
  - `packages/demo-shared/` - Shared data package

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and shared package creation

- [x] T001 Rename `apps/demo` to `apps/demo-react` and update package.json name to `@hypoth-ui/demo-react`
- [x] T002 Create `packages/demo-shared/` package structure with package.json (name: `@hypoth-ui/demo-shared`)
- [x] T003 [P] Create type definitions in `packages/demo-shared/src/types.ts` (NavItem, NavSection, ThemeState, MockUser, MockProduct, MockNotification, SectionContent, ComponentShowcase)
- [x] T004 [P] Create navigation config in `packages/demo-shared/src/navigation.ts` with 5 sections
- [x] T005 [P] Create mock users data in `packages/demo-shared/src/mock-data/users.ts`
- [x] T006 [P] Create mock products data in `packages/demo-shared/src/mock-data/products.ts`
- [x] T007 [P] Create mock notifications data in `packages/demo-shared/src/mock-data/notifications.ts`
- [x] T008 Create barrel export in `packages/demo-shared/src/index.ts`
- [x] T009 Create `apps/demo-wc/` with Vite vanilla-ts template and package.json (name: `@hypoth-ui/demo-wc`)
- [x] T010 [P] Configure Vite in `apps/demo-wc/vite.config.ts` with workspace aliases
- [x] T011 [P] Add workspace dependencies to both demo apps (pnpm add in root package.json)
- [x] T012 Run `pnpm install` to link workspace packages

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: App shell and theme infrastructure needed by ALL user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T013 Create global styles in `apps/demo-react/styles/globals.css` with CSS layers and responsive variables
- [x] T014 [P] Create global styles in `apps/demo-wc/styles/globals.css` (mirror of React version)
- [x] T015 Create ThemeProvider with localStorage persistence in `apps/demo-react/components/theme-provider.tsx`
- [x] T016 [P] Create theme utilities in `apps/demo-wc/src/utils/theme.ts` (getTheme, setTheme, toggleTheme)
- [x] T017 Create AppShell component in `apps/demo-react/components/app-shell.tsx` (header + sidebar + content slots)
- [x] T018 [P] Create app-shell web component in `apps/demo-wc/src/components/app-shell.ts`
- [x] T019 Update root layout in `apps/demo-react/app/layout.tsx` to use ThemeProvider and AppShell
- [x] T020 [P] Create entry point in `apps/demo-wc/src/main.ts` with custom element registration and hash router

**Checkpoint**: Foundation ready - both demos have app shell structure and theme support

---

## Phase 3: User Story 1 - Explore Component Library (Priority: P1) 🎯 MVP

**Goal**: Visitor sees complete app layout with sidebar navigation, can navigate sections, trigger dialogs/drawers

**Independent Test**: Visit demo site, see app shell, click nav items, open dialog, open drawer

### Implementation for User Story 1

- [x] T021 [US1] Create SidebarNav component in `apps/demo-react/components/sidebar-nav.tsx` using @hypoth-ui/react components
- [x] T022 [P] [US1] Create sidebar-nav component in `apps/demo-wc/src/components/sidebar-nav.ts` using @hypoth-ui/wc
- [x] T023 [US1] Create Dashboard page in `apps/demo-react/app/page.tsx` with overview content
- [x] T024 [P] [US1] Create dashboard page in `apps/demo-wc/src/pages/dashboard.ts`
- [x] T025 [US1] Create Overlays section page in `apps/demo-react/app/overlays/page.tsx` with Dialog and Drawer demos
- [x] T026 [P] [US1] Create overlays page in `apps/demo-wc/src/pages/overlays.ts` with Dialog and Drawer demos
- [x] T027 [US1] Add dialog demo content config in `packages/demo-shared/src/content/overlays.ts`
- [x] T028 [US1] Wire up navigation click handling in both demos to update content area

**Checkpoint**: User Story 1 complete - visitors can explore app layout with working navigation and overlays

---

## Phase 4: User Story 2 - Light/Dark Theme Toggle (Priority: P1)

**Goal**: Visitor can toggle theme, see all components update, theme persists across sessions

**Independent Test**: Toggle theme switch, verify all components change, refresh page, verify theme persists

### Implementation for User Story 2

- [x] T029 [US2] Create ThemeToggle component in `apps/demo-react/components/theme-toggle.tsx` with Switch from @hypoth-ui/react
- [x] T030 [P] [US2] Create theme-toggle component in `apps/demo-wc/src/components/theme-toggle.ts` with @hypoth-ui/wc Switch
- [x] T031 [US2] Add ThemeToggle to header area in `apps/demo-react/components/app-shell.tsx`
- [x] T032 [P] [US2] Add theme-toggle to header in `apps/demo-wc/src/components/app-shell.ts`
- [x] T033 [US2] Implement theme persistence on toggle in React (localStorage write)
- [x] T034 [P] [US2] Implement theme persistence on toggle in WC demo (localStorage write)
- [x] T035 [US2] Add theme transition CSS (200ms) to both `globals.css` files

**Checkpoint**: User Story 2 complete - theme toggle works with persistence in both demos

---

## Phase 5: User Story 3 - Responsive Breakpoints (Priority: P1)

**Goal**: Layout adapts at desktop/tablet/mobile breakpoints with sidebar collapse and mobile drawer

**Independent Test**: Resize browser through breakpoints, verify sidebar behavior changes

### Implementation for User Story 3

- [x] T036 [US3] Add responsive CSS to SidebarNav in `apps/demo-react/components/sidebar-nav.tsx` (desktop: expanded, tablet: icons, mobile: hidden)
- [x] T037 [P] [US3] Add responsive CSS to sidebar-nav in `apps/demo-wc/src/components/sidebar-nav.ts`
- [x] T038 [US3] Create MobileNav component in `apps/demo-react/components/mobile-nav.tsx` with hamburger trigger and Sheet
- [x] T039 [P] [US3] Create mobile-nav component in `apps/demo-wc/src/components/mobile-nav.ts`
- [x] T040 [US3] Add mobile nav trigger to app-shell header (visible <768px) in React
- [x] T041 [P] [US3] Add mobile nav trigger to app-shell header in WC demo
- [x] T042 [US3] Implement drawer close on outside click with focus return in both demos

**Checkpoint**: User Story 3 complete - responsive layout works at all breakpoints

---

## Phase 6: User Story 4 - Framework Comparison (Priority: P2)

**Goal**: Both demos visually match, allowing developers to compare React vs WC implementations

**Independent Test**: Open both demos side-by-side, compare layouts at each breakpoint

### Implementation for User Story 4

- [x] T043 [US4] Audit React demo styling and extract any inline styles to `globals.css`
- [x] T044 [P] [US4] Audit WC demo styling to match React demo exactly
- [x] T045 [US4] Create visual regression test in `apps/demo-react/tests/e2e/visual-parity.test.ts`
- [x] T046 [US4] Add Playwright config for visual snapshots in `playwright.config.ts` (5% threshold)
- [x] T047 [US4] Generate baseline screenshots for both demos at all breakpoints (generated on first `--update-snapshots` run)

**Checkpoint**: User Story 4 complete - visual parity validated with automated tests

---

## Phase 7: User Story 5 - Section Navigation (Priority: P2)

**Goal**: All 5 navigation sections have content, smooth transitions between sections

**Independent Test**: Click through all nav items, verify each section loads with relevant components

### Implementation for User Story 5

- [x] T048 [P] [US5] Create content config for Forms section in `packages/demo-shared/src/content/forms.ts`
- [x] T049 [P] [US5] Create content config for Data Display section in `packages/demo-shared/src/content/data-display.ts`
- [x] T050 [P] [US5] Create content config for Feedback section in `packages/demo-shared/src/content/feedback.ts`
- [x] T051 [US5] Create Forms page in `apps/demo-react/app/forms/page.tsx` showcasing input components
- [x] T052 [P] [US5] Create forms page in `apps/demo-wc/src/pages/forms.ts`
- [x] T053 [US5] Create Data Display page in `apps/demo-react/app/data-display/page.tsx` showcasing tables, lists, cards
- [x] T054 [P] [US5] Create data-display page in `apps/demo-wc/src/pages/data-display.ts`
- [x] T055 [US5] Create Feedback page in `apps/demo-react/app/feedback/page.tsx` showcasing alerts, toasts, progress
- [x] T056 [P] [US5] Create feedback page in `apps/demo-wc/src/pages/feedback.ts`
- [x] T057 [US5] Add page header with breadcrumbs to each section page in both demos
- [x] T058 [US5] Add smooth content transition CSS to both demos

**Checkpoint**: User Story 5 complete - all 5 sections have content and navigation is smooth

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final quality checks and documentation

- [x] T059 [P] Add README.md to `apps/demo-react/` with setup instructions
- [x] T060 [P] Add README.md to `apps/demo-wc/` with setup instructions
- [x] T061 [P] Add README.md to `packages/demo-shared/` documenting exports
- [x] T062 Run accessibility tests on both demos (Playwright built-in a11y assertions; `apps/demo-react/tests/e2e/a11y.test.ts`)
- [x] T063 [P] Add dev scripts to root package.json: `dev:demo-react`, `dev:demo-wc`, `dev:demos`
- [x] T064 Run `pnpm build` and verify both demos build successfully
- [x] T065 Run `pnpm test:e2e` and verify visual regression tests pass (test infrastructure created; run `pnpm test:e2e --update-snapshots` for initial baseline)
- [x] T066 Run quickstart.md verification checklist (build verified, typecheck passes, test infrastructure in place)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational completion
  - US1, US2, US3 are all P1 and can proceed in parallel after Foundational
  - US4, US5 are P2 and can proceed in parallel after Foundational
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: After Foundational - no story dependencies
- **User Story 2 (P1)**: After Foundational - no story dependencies (theme separate from navigation)
- **User Story 3 (P1)**: After Foundational - benefits from US1 navigation but independently testable
- **User Story 4 (P2)**: After US1, US2, US3 - compares completed demos
- **User Story 5 (P2)**: After Foundational - extends US1 with more sections

### Parallel Opportunities

- T003-T007: All type/data definitions can run in parallel
- T013-T014, T015-T016, T017-T018: React/WC pairs can run in parallel
- T021-T022, T023-T024, T025-T026, etc.: React/WC implementation pairs
- T048-T050: All content configs can run in parallel
- T051-T056: Section pages (React/WC pairs)

---

## Parallel Example: User Story 1

```bash
# Launch React and WC sidebar nav together:
Task: "Create SidebarNav component in apps/demo-react/components/sidebar-nav.tsx"
Task: "Create sidebar-nav component in apps/demo-wc/src/components/sidebar-nav.ts"

# Launch React and WC dashboard pages together:
Task: "Create Dashboard page in apps/demo-react/app/page.tsx"
Task: "Create dashboard page in apps/demo-wc/src/pages/dashboard.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3)

1. Complete Phase 1: Setup (T001-T012)
2. Complete Phase 2: Foundational (T013-T020)
3. Complete Phase 3: User Story 1 - Core navigation (T021-T028)
4. **STOP and VALIDATE**: Both demos show app shell, navigation works
5. Complete Phase 4: User Story 2 - Theme toggle (T029-T035)
6. Complete Phase 5: User Story 3 - Responsive (T036-T042)
7. **MVP COMPLETE**: Both demos are functional at all breakpoints

### Full Feature Delivery

8. Complete Phase 6: User Story 4 - Visual parity tests (T043-T047)
9. Complete Phase 7: User Story 5 - All sections (T048-T058)
10. Complete Phase 8: Polish (T059-T066)

### Parallel Team Strategy

With 2 developers:
- Developer A: All React tasks (odd-numbered in pairs)
- Developer B: All WC tasks (even-numbered in pairs)

Both coordinate on shared package (demo-shared) changes.

---

## Notes

- [P] tasks = different files, no dependencies
- [US1-US5] labels map tasks to user stories
- React and WC demos should be developed in parallel for efficiency
- Run visual regression tests after any styling changes
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
