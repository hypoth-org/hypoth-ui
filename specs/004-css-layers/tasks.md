# Tasks: CSS Layered Output System

**Input**: Design documents from `/specs/004-css-layers/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No explicit test tasks requested. E2E tests exist in demo app.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:
- `packages/css/src/` - CSS source files
- `packages/css/dist/` - Built output
- `apps/demo/` - Demo application
- `packages/docs-content/` - Documentation content
- `packages/docs-renderer-next/` - Docs site styles

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure build tooling and package structure is correct

- [x] T001 Verify postcss.config.js includes postcss-import plugin in packages/css/postcss.config.js
- [x] T002 [P] Update package.json exports to include layer entry points in packages/css/package.json
- [x] T003 [P] Ensure @ds/tokens is listed as dependency in packages/css/package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Complete layer structure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create tokens.css layer file that imports @ds/tokens/css in packages/css/src/layers/tokens.css
- [x] T005 [P] Create components.css layer file that aggregates @ds/wc component styles in packages/css/src/layers/components.css
- [x] T006 [P] Create empty overrides.css placeholder file in packages/css/src/layers/overrides.css
- [x] T007 Update layers/index.css to declare all 6 layers and import each layer file in packages/css/src/layers/index.css
- [x] T008 Update src/index.css entry point to import layers/index.css in packages/css/src/index.css
- [x] T009 Run build and verify dist/index.css contains all layers in correct order with pnpm --filter @ds/css build

**Checkpoint**: Foundation ready - layer structure complete, user story implementation can begin

---

## Phase 3: User Story 1 - Consistent Baseline Styling (Priority: P1) 🎯 MVP

**Goal**: Provide consistent baseline styling across vanilla HTML, Web Components, and Next.js

**Independent Test**: Import @ds/css in demo app and verify elements render with token-based styling

### Implementation for User Story 1

- [x] T010 [US1] Verify reset.css includes prefers-reduced-motion media query in packages/css/src/layers/reset.css
- [x] T011 [US1] Verify base.css styles semantic HTML elements using token variables in packages/css/src/layers/base.css
- [x] T012 [US1] Verify demo app layout.tsx imports @ds/css correctly in apps/demo/app/layout.tsx
- [x] T013 [US1] Add demo page content showing headings, paragraphs, lists, code blocks in apps/demo/app/page.tsx
- [x] T014 [US1] Build and verify bundle size is under 20KB gzipped with pnpm --filter @ds/css build

**Checkpoint**: User Story 1 complete - baseline styling works across platforms

---

## Phase 4: User Story 2 - Override Without Specificity Conflicts (Priority: P1)

**Goal**: Enable consumer overrides via the overrides layer without !important

**Independent Test**: Write a .ds-button override in overrides layer and verify it takes precedence

### Implementation for User Story 2

- [x] T015 [P] [US2] Expand utilities.css with spacing utilities (ds-m-*, ds-p-*) in packages/css/src/layers/utilities.css
- [x] T016 [P] [US2] Add display utilities (ds-flex, ds-grid, ds-block, ds-hidden) to packages/css/src/layers/utilities.css
- [x] T017 [P] [US2] Add text alignment utilities (ds-text-left, ds-text-center, ds-text-right) to packages/css/src/layers/utilities.css
- [x] T018 [P] [US2] Add color utilities (ds-text-primary, ds-bg-subtle, etc.) to packages/css/src/layers/utilities.css
- [x] T019 [US2] Verify layer order in built output shows reset < tokens < base < components < utilities < overrides

**Checkpoint**: User Story 2 complete - override mechanism proven, utilities available

---

## Phase 5: User Story 3 - Tenant-Branded Styling (Priority: P2)

**Goal**: Enable white-label branding via tenant override stylesheets

**Independent Test**: Load tenant-acme.css after @ds/css and verify brand colors appear

### Implementation for User Story 3

- [x] T020 [US3] Create tenant-acme.css with brand color overrides in apps/demo/styles/tenant-acme.css
- [x] T021 [US3] Add component overrides (square buttons) to tenant-acme.css in apps/demo/styles/tenant-acme.css
- [x] T022 [US3] Create BrandSwitcher component to toggle between default and tenant-acme in apps/demo/components/brand-switcher.tsx
- [x] T023 [US3] Integrate BrandSwitcher into demo layout in apps/demo/app/layout.tsx
- [x] T024 [US3] Add dark mode toggle that works with tenant overrides in apps/demo/components/brand-switcher.tsx

**Checkpoint**: User Story 3 complete - tenant branding works with mode switching

---

## Phase 6: User Story 4 - Documentation Rendering Integration (Priority: P2)

**Goal**: Docs site uses @ds/css layers for consistent styling with component demos

**Independent Test**: Run docs site and verify component demos match standalone rendering

### Implementation for User Story 4

- [x] T025 [US4] Update docs-renderer-next globals.css to import @ds/css in packages/docs-renderer-next/styles/globals.css
- [x] T026 [US4] Move existing docs styles into @layer overrides wrapper in packages/docs-renderer-next/styles/globals.css
- [x] T027 [US4] Verify docs navigation and layout styles don't affect component demos
- [x] T028 [US4] Ensure dark mode toggle in docs works with layered styles

**Checkpoint**: User Story 4 complete - docs site uses layered CSS correctly

---

## Phase 7: User Story 5 - Styling Guidelines Documentation (Priority: P3)

**Goal**: Provide documentation page explaining CSS layer usage and customization

**Independent Test**: Follow documentation to create a custom override and verify it works

### Implementation for User Story 5

- [x] T029 [US5] Create styling-guidelines.mdx with layer architecture explanation in packages/docs-content/guides/styling-guidelines.mdx
- [x] T030 [US5] Add tenant theming example code to styling-guidelines.mdx in packages/docs-content/guides/styling-guidelines.mdx
- [x] T031 [US5] Add component override example code to styling-guidelines.mdx in packages/docs-content/guides/styling-guidelines.mdx
- [x] T032 [US5] Add dark mode customization example to styling-guidelines.mdx in packages/docs-content/guides/styling-guidelines.mdx
- [x] T033 [US5] Add layer cascade diagram or explanation to styling-guidelines.mdx in packages/docs-content/guides/styling-guidelines.mdx

**Checkpoint**: User Story 5 complete - developers have clear documentation

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T034 Run full build across all packages with pnpm build
- [x] T035 [P] Verify demo app E2E tests still pass with pnpm --filter @ds/demo test:e2e
- [x] T036 [P] Verify CSS bundle size is under 20KB gzipped
- [x] T037 Validate layer order in DevTools by inspecting demo app elements
- [x] T038 Run quickstart.md validation - follow steps and verify they work

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 and US2 are both P1, can run in parallel
  - US3 and US4 are both P2, can run in parallel after US1/US2
  - US5 (P3) depends on all previous stories for examples
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Requires Foundational - no dependencies on other stories
- **User Story 2 (P1)**: Requires Foundational - no dependencies on other stories (can parallel with US1)
- **User Story 3 (P2)**: Requires US1/US2 complete (needs working layer system)
- **User Story 4 (P2)**: Requires US1/US2 complete (needs working layer system)
- **User Story 5 (P3)**: Requires US3/US4 complete (references tenant and docs examples)

### Within Each User Story

- Layer files before integration
- Core implementation before integrations
- Build verification after each story

### Parallel Opportunities

- T002, T003 can run in parallel (different files)
- T004, T005, T006 can run in parallel (different layer files)
- T015, T016, T017, T018 can run in parallel (different utility categories)
- US1 and US2 can run in parallel (after Foundational)
- US3 and US4 can run in parallel (after US1/US2)
- T035, T036 can run in parallel (different verification tasks)

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch all layer file creations together:
Task: "Create tokens.css layer file in packages/css/src/layers/tokens.css"
Task: "Create components.css layer file in packages/css/src/layers/components.css"
Task: "Create overrides.css placeholder in packages/css/src/layers/overrides.css"

# Then update index files (depends on above):
Task: "Update layers/index.css with all 6 layers"
```

---

## Parallel Example: User Story 2 (Utilities)

```bash
# Launch all utility categories together:
Task: "Expand spacing utilities (ds-m-*, ds-p-*)"
Task: "Add display utilities (ds-flex, ds-grid, ds-hidden)"
Task: "Add text alignment utilities (ds-text-left, etc.)"
Task: "Add color utilities (ds-text-primary, ds-bg-subtle)"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (baseline styling)
4. Complete Phase 4: User Story 2 (override mechanism)
5. **STOP and VALIDATE**: Test layer system in demo app
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Layer structure ready
2. Add User Story 1 + 2 → Test layer cascade → MVP ready!
3. Add User Story 3 → Test tenant branding → White-label ready
4. Add User Story 4 → Test docs integration → Docs ready
5. Add User Story 5 → Documentation complete → Full feature ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (baseline)
   - Developer B: User Story 2 (utilities/overrides)
3. Then:
   - Developer A: User Story 3 (tenant)
   - Developer B: User Story 4 (docs)
4. Developer A or B: User Story 5 (documentation)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Existing files (reset.css, base.css, utilities.css) need updates, not creation
