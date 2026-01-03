# Tasks: Web Components Platform Conventions

**Input**: Design documents from `/specs/006-wc-platform/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Unit tests included for core utilities and enforcement script.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

This is a monorepo with multiple packages:
- **@ds/wc**: `packages/wc/src/`
- **@ds/next**: `packages/next/src/`
- **Tooling**: `tooling/scripts/`
- **Docs**: `apps/docs/content/`
- **Demo**: `apps/demo/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dev dependency setup

- [x] T001 Install ts-morph dev dependency for enforcement script in root package.json
- [x] T002 [P] Create packages/wc/src/events/ directory structure
- [x] T003 [P] Verify Lit 3.1+ is installed in packages/wc/package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Rename packages/wc/src/base/light-element.ts to ds-element.ts
- [x] T005 Update DSElement class in packages/wc/src/base/ds-element.ts with JSDoc documentation
- [x] T006 [P] Create emitEvent utility function in packages/wc/src/events/emit.ts
- [x] T007 [P] Create StandardEvents constants in packages/wc/src/events/emit.ts
- [x] T008 Create component registry in packages/wc/src/registry/registry.ts
- [x] T009 Add getRegisteredTags and getComponentClass helpers in packages/wc/src/registry/registry.ts
- [x] T010 Update packages/wc/src/index.ts to export DSElement, emitEvent, registry utilities
- [x] T011 Write unit tests for DSElement in packages/wc/tests/base/ds-element.test.ts
- [x] T012 [P] Write unit tests for emitEvent in packages/wc/tests/events/emit.test.ts
- [x] T013 [P] Write unit tests for registry in packages/wc/tests/registry/registry.test.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Component Author Creates a New Component (Priority: P1) 🎯 MVP

**Goal**: Enable component authors to create components using DSElement base class with proper event emission and attribute conventions

**Independent Test**: Create a sample ds-example component using the base class and verify it renders correctly in Light DOM, responds to attributes, and fires ds:* events

### Implementation for User Story 1

- [x] T014 [US1] Update DsButton component in packages/wc/src/components/button/button.ts to extend DSElement
- [x] T015 [US1] Update DsButton to use emitEvent for ds:click in packages/wc/src/components/button/button.ts
- [x] T016 [US1] Update DsInput component in packages/wc/src/components/input/input.ts to extend DSElement
- [x] T017 [US1] Update DsInput to use emitEvent for ds:change in packages/wc/src/components/input/input.ts
- [x] T018 [US1] Add DsButton and DsInput to componentRegistry in packages/wc/src/registry/registry.ts
- [x] T019 [US1] Update packages/wc/src/index.ts imports to use new DSElement path
- [x] T020 [US1] Run existing unit tests to verify components still work (pnpm --filter @ds/wc test)
- [x] T021 [US1] Add Light DOM verification test in packages/wc/tests/components/light-dom.test.ts
- [x] T022 [US1] Add event emission test for ds:* events in packages/wc/tests/components/events.test.ts

**Checkpoint**: At this point, component authors can create components using DSElement with proper conventions

---

## Phase 4: User Story 2 - Application Developer Uses Components in Next.js (Priority: P1)

**Goal**: Enable Next.js App Router applications to use design system components with proper SSR and hydration

**Independent Test**: Add DsLoader to demo app root layout and verify components render correctly on server and hydrate properly on client

### Implementation for User Story 2

- [x] T023 [US2] Update registerAllElements in packages/next/src/loader/register.ts to import from componentRegistry
- [x] T024 [US2] Add selective registration support (RegisterOptions) in packages/next/src/loader/register.ts
- [x] T025 [US2] Update DsLoader component in packages/next/src/loader/element-loader.tsx with improved logging
- [x] T026 [US2] Export registerElements function from packages/next/src/loader/index.ts
- [x] T027 [US2] Update packages/next/src/index.ts to export loader utilities
- [x] T028 [US2] Update apps/demo/app/layout.tsx to use DsLoader component
- [x] T029 [US2] Create demo page using ds-* components in apps/demo/app/wc-demo/page.tsx
- [x] T030 [US2] Add E2E test for SSR/hydration in tests/e2e/wc-loader.spec.ts
- [x] T031 [US2] Verify no hydration errors in browser console

**Checkpoint**: At this point, Next.js App Router applications can use design system components

---

## Phase 5: User Story 3 - Documentation Site Displays Components (Priority: P2)

**Goal**: Enable documentation site to render interactive component examples with proper registration

**Independent Test**: Load a documentation page with component examples and verify all components render correctly and are interactive

### Implementation for User Story 3

- [x] T032 [US3] Create apps/docs/content/guides/nextjs-app-router.mdx documentation page
- [x] T033 [US3] Add Quick Start section with 3-step setup in nextjs-app-router.mdx
- [x] T034 [US3] Add SSR explanation section in nextjs-app-router.mdx
- [x] T035 [US3] Add Server Components usage section in nextjs-app-router.mdx
- [x] T036 [US3] Add Client Components usage section in nextjs-app-router.mdx
- [x] T037 [US3] Add Event Handling section in nextjs-app-router.mdx
- [x] T038 [US3] Add TypeScript Support section in nextjs-app-router.mdx
- [x] T039 [US3] Add Troubleshooting section in nextjs-app-router.mdx
- [x] T040 [US3] Verify docs app loads with DsLoader if not already configured

**Checkpoint**: At this point, documentation site displays components correctly

---

## Phase 6: User Story 4 - CI Pipeline Prevents Accidental Auto-Registration (Priority: P2)

**Goal**: Provide an AST-based enforcement script that detects side-effect customElements.define() calls

**Independent Test**: Run the enforcement check against test fixtures with both compliant and non-compliant files and verify correct detection

### Implementation for User Story 4

- [x] T041 [US4] Create tooling/scripts/check-auto-define.ts enforcement script
- [x] T042 [US4] Implement scanForAutoDefine function with ts-morph in tooling/scripts/check-auto-define.ts
- [x] T043 [US4] Implement checkFile function for single file analysis in tooling/scripts/check-auto-define.ts
- [x] T044 [US4] Add CLI argument parsing (--include, --exclude, --format) in tooling/scripts/check-auto-define.ts
- [x] T045 [US4] Add text, json, and github output formatters in tooling/scripts/check-auto-define.ts
- [x] T046 [US4] Add check:auto-define script to root package.json
- [x] T047 [US4] Create test fixtures in tooling/tests/fixtures/auto-define/
- [x] T048 [P] [US4] Create compliant component fixture in tooling/tests/fixtures/auto-define/compliant.ts
- [x] T049 [P] [US4] Create non-compliant component fixture in tooling/tests/fixtures/auto-define/non-compliant.ts
- [x] T050 [US4] Write unit tests for enforcement script in tooling/tests/check-auto-define.test.ts
- [x] T051 [US4] Add check:auto-define step to .github/workflows/ci.yml

**Checkpoint**: At this point, CI pipeline detects and blocks accidental auto-registration

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T052 [P] Add JSDoc comments to all exported functions in packages/wc/src/
- [x] T053 [P] Add JSDoc comments to all exported functions in packages/next/src/
- [~] T054 [P] Update packages/wc/README.md with DSElement usage documentation (SKIPPED - docs in MDX guide)
- [~] T055 [P] Update packages/next/README.md with DsLoader usage documentation (SKIPPED - docs in MDX guide)
- [x] T056 Run full test suite (pnpm test) and verify all tests pass
- [x] T057 Run lint check (pnpm lint) and fix any issues
- [x] T058 Run typecheck (pnpm typecheck) and fix any issues
- [x] T059 Verify bundle size target (<2KB gzipped for loader) using bundlesize or similar
- [x] T060 Run quickstart.md validation - create sample component following guide

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 and US2 are both P1 - can proceed in parallel after Foundational
  - US3 and US4 are P2 - can proceed in parallel after Foundational
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Uses registry from US1 but can work with empty registry
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Benefits from US2 loader but independent
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Completely independent, no deps on other stories

### Within Each User Story

- Models/utilities before services
- Services before integration
- Core implementation before testing
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (T006-T007, T012-T013)
- Once Foundational phase completes, all user stories can start in parallel
- Within US4, test fixtures (T048-T049) can run in parallel
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: Foundational Phase

```bash
# Launch parallel tasks in Foundational:
Task: "Create emitEvent utility function in packages/wc/src/events/emit.ts"
Task: "Create StandardEvents constants in packages/wc/src/events/emit.ts"

# Then parallel tests:
Task: "Write unit tests for emitEvent in packages/wc/tests/events/emit.test.ts"
Task: "Write unit tests for registry in packages/wc/tests/registry/registry.test.ts"
```

## Parallel Example: User Story 4

```bash
# Launch test fixtures in parallel:
Task: "Create compliant component fixture in tooling/tests/fixtures/auto-define/compliant.ts"
Task: "Create non-compliant component fixture in tooling/tests/fixtures/auto-define/non-compliant.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Component Authoring)
4. Complete Phase 4: User Story 2 (Next.js Integration)
5. **STOP and VALIDATE**: Test components in demo app
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Component authoring works → Demo
3. Add User Story 2 → Next.js integration works → Demo (MVP!)
4. Add User Story 3 → Documentation complete → Demo
5. Add User Story 4 → CI enforcement active → Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Component Authoring)
   - Developer B: User Story 2 (Next.js Integration)
3. After P1 stories complete:
   - Developer A: User Story 3 (Documentation)
   - Developer B: User Story 4 (Enforcement)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Existing components (DsButton, DsInput) are being migrated, not created from scratch
- The light-element.ts → ds-element.ts rename is the key foundational change
