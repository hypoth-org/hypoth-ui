# Tasks: White-Label Design System Monorepo

**Input**: Design documents from `/specs/001-design-system/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are included where specified in the testing strategy (plan.md). Each package has defined test types.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo**: `packages/[package-name]/src/`, `apps/[app-name]/`
- **Tooling**: `tooling/[config-name]/`
- **Specs**: `specs/001-design-system/contracts/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Monorepo initialization and shared tooling configuration

- [x] T001 Create monorepo root structure with pnpm-workspace.yaml in /pnpm-workspace.yaml
- [x] T002 Initialize root package.json with workspaces config in /package.json
- [x] T003 [P] Create shared TypeScript config in tooling/tsconfig/tsconfig.base.json
- [x] T004 [P] Create shared ESLint config in tooling/eslint-config/index.js (replaced with Biome in /biome.json)
- [x] T005 [P] Create shared Vitest config in tooling/vitest-config/vitest.config.ts
- [x] T006 Create .gitignore with node_modules, dist, .turbo patterns in /.gitignore
- [x] T007 Create .npmrc with pnpm settings (strict-peer-dependencies) in /.npmrc

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Package scaffolds that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 [P] Scaffold @ds/tokens package structure in packages/tokens/
- [x] T009 [P] Scaffold @ds/css package structure in packages/css/
- [x] T010 [P] Scaffold @ds/primitives-dom package structure in packages/primitives-dom/
- [x] T011 [P] Scaffold @ds/wc package structure in packages/wc/
- [x] T012 [P] Scaffold @ds/react package structure in packages/react/
- [x] T013 [P] Scaffold @ds/next package structure in packages/next/
- [x] T014 [P] Scaffold @ds/docs-core package structure in packages/docs-core/
- [x] T015 [P] Scaffold @ds/docs-content package structure in packages/docs-content/
- [x] T016 [P] Scaffold @ds/docs-renderer-next package structure in packages/docs-renderer-next/
- [x] T017 [P] Scaffold demo app structure in apps/demo/
- [x] T018 [P] Scaffold docs app structure in apps/docs/
- [x] T019 Configure package.json exports field pattern for all packages (template in packages/tokens/package.json)
- [x] T020 Install and configure tsup as shared build tool in root package.json
- [x] T021 Create pnpm build script that builds packages in dependency order in /package.json

**Checkpoint**: All package scaffolds exist with valid package.json files; `pnpm install` succeeds ✅

---

## Phase 3: User Story 1 - Token-Driven Theme Consumption (Priority: P1) 🎯 MVP

**Goal**: Developers can apply custom brand themes via DTCG token files and see components styled accordingly

**Independent Test**: Create a custom token file, import it, verify a rendered HTML element uses the custom CSS variable values

### Implementation for User Story 1

- [x] T022 [P] [US1] Create DTCG primitive color tokens in packages/tokens/src/tokens/primitives/colors.json
- [x] T023 [P] [US1] Create DTCG primitive spacing tokens in packages/tokens/src/tokens/primitives/spacing.json
- [x] T024 [P] [US1] Create DTCG primitive typography tokens in packages/tokens/src/tokens/primitives/typography.json
- [x] T025 [P] [US1] Create DTCG semantic color tokens in packages/tokens/src/tokens/semantic/colors.json
- [x] T026 [P] [US1] Create DTCG semantic spacing tokens in packages/tokens/src/tokens/semantic/spacing.json
- [x] T027 [US1] Create light mode token overrides in packages/tokens/src/tokens/modes/light.json
- [x] T028 [US1] Create dark mode token overrides in packages/tokens/src/tokens/modes/dark.json
- [x] T029 [US1] Create high-contrast mode token overrides in packages/tokens/src/tokens/modes/high-contrast.json
- [x] T030 [US1] Configure Style Dictionary for DTCG format in packages/tokens/style-dictionary.config.js
- [x] T031 [US1] Implement CSS custom properties output transform in packages/tokens/src/build/css-transform.ts (inline in style-dictionary.config.js)
- [x] T032 [US1] Implement TypeScript constants output transform in packages/tokens/src/build/ts-transform.ts (inline in style-dictionary.config.js)
- [x] T033 [US1] Create token build script in packages/tokens/package.json scripts
- [x] T034 [US1] Create CSS layer declaration order in packages/css/src/layers/index.css
- [x] T035 [US1] Create CSS reset layer in packages/css/src/layers/reset.css
- [x] T036 [US1] Create CSS base element styles in packages/css/src/layers/base.css
- [x] T037 [US1] Create CSS utilities layer (spacing, typography helpers) in packages/css/src/layers/utilities.css
- [x] T038 [US1] Create PostCSS config for CSS processing in packages/css/postcss.config.js
- [x] T039 [US1] Create CSS build script that bundles all layers in packages/css/package.json scripts
- [ ] T040 [US1] Add unit tests for token compilation in packages/tokens/tests/build.test.ts
- [ ] T041 [US1] Add unit tests for CSS layer output in packages/css/tests/layers.test.ts
- [ ] T042 [US1] Verify token CSS variables are present in compiled output (integration test)

**Checkpoint**: `pnpm build` produces @ds/tokens CSS + TS outputs and @ds/css layered stylesheet; custom tokens override defaults ✅

---

## Phase 4: User Story 2 - Web Component Integration (Priority: P2)

**Goal**: Developers can use `<ds-button>` and other custom elements in any framework via Light DOM Web Components

**Independent Test**: Create vanilla HTML page, import WC bundle, render `<ds-button>`, verify it uses Light DOM and responds to events

### Implementation for User Story 2

- [x] T043 [P] [US2] Create focus management utilities in packages/primitives-dom/src/focus/focus-trap.ts
- [x] T044 [P] [US2] Create keyboard navigation utilities in packages/primitives-dom/src/keyboard/roving-focus.ts
- [x] T045 [P] [US2] Create ARIA helper utilities in packages/primitives-dom/src/aria/live-region.ts
- [x] T046 [US2] Create primitives-dom barrel export in packages/primitives-dom/src/index.ts
- [x] T047 [US2] Create Light DOM base component class in packages/wc/src/base/light-element.ts
- [x] T048 [US2] Create component registration utility in packages/wc/src/registry/define.ts
- [x] T049 [US2] Implement ds-button Web Component in packages/wc/src/components/button/button.ts
- [x] T050 [US2] Create ds-button CSS in packages/wc/src/components/button/button.css
- [x] T051 [US2] Create component manifest for button in packages/docs-content/manifests/button.json
- [x] T052 [US2] Create WC barrel export with all components in packages/wc/src/index.ts
- [x] T053 [US2] Configure tsup for Lit external bundling in packages/wc/tsup.config.ts
- [ ] T054 [US2] Add unit tests for primitives-dom utilities in packages/primitives-dom/tests/
- [ ] T055 [US2] Add unit tests for ds-button component in packages/wc/tests/button.test.ts
- [ ] T056 [US2] Add a11y tests for ds-button with axe-core in packages/wc/tests/button.a11y.test.ts
- [ ] T057 [US2] Create vanilla HTML test page for WC verification in packages/wc/tests/fixtures/test.html

**Checkpoint**: `<ds-button>` renders in vanilla HTML with correct styling, Light DOM, and keyboard accessibility ✅

---

## Phase 5: User Story 3 - Next.js App Router Integration (Priority: P3)

**Goal**: Next.js developers can use design system with single client loader and minimal client boundaries

**Independent Test**: Create Next.js App Router project, add loader to layout, use `<ds-button>` in Server Component, verify streaming SSR works

### Implementation for User Story 3

- [x] T058 [P] [US3] Create React event normalization utility in packages/react/src/utils/events.ts
- [x] T059 [P] [US3] Create React component wrapper factory in packages/react/src/utils/create-component.ts
- [x] T060 [US3] Create React Button wrapper component in packages/react/src/components/button.tsx
- [x] T061 [US3] Create React barrel export in packages/react/src/index.ts
- [x] T062 [US3] Create Next.js element loader component in packages/next/src/loader/element-loader.tsx
- [x] T063 [US3] Create Next.js registration helper in packages/next/src/loader/register.ts
- [x] T064 [US3] Create Next.js barrel export in packages/next/src/index.ts
- [x] T065 [US3] Configure demo app Next.js setup in apps/demo/next.config.js
- [x] T066 [US3] Create demo app root layout with loader in apps/demo/app/layout.tsx
- [x] T067 [US3] Create demo app home page using ds-button in apps/demo/app/page.tsx
- [ ] T068 [US3] Add integration tests for React wrappers in packages/react/tests/button.test.tsx
- [ ] T069 [US3] Add E2E test for Next.js demo app in apps/demo/tests/e2e/home.test.ts
- [ ] T070 [US3] Verify Server Component rendering streams correctly (E2E assertion)

**Checkpoint**: Demo app loads with Lighthouse 90+; custom elements hydrate correctly; no double-registration errors ✅

---

## Phase 6: User Story 4 - Tenant-Filtered Documentation (Priority: P4)

**Goal**: Companies can generate white-label docs showing only their licensed components via edition config

**Independent Test**: Create two edition configs, generate docs for each, verify different components appear in navigation

### Implementation for User Story 4

- [x] T071 [P] [US4] Create manifest loader in packages/docs-core/src/manifest/loader.ts
- [x] T072 [P] [US4] Create manifest validator using JSON Schema in packages/docs-core/src/manifest/validator.ts
- [x] T073 [P] [US4] Create MDX frontmatter parser in packages/docs-core/src/content/frontmatter.ts
- [x] T074 [US4] Create edition filter logic in packages/docs-core/src/filter/edition-filter.ts
- [x] T075 [US4] Create navigation tree generator in packages/docs-core/src/nav/navigation.ts
- [x] T076 [US4] Create docs-core barrel export in packages/docs-core/src/index.ts
- [x] T077 [P] [US4] Create button MDX documentation in packages/docs-content/components/button.mdx
- [x] T078 [P] [US4] Create getting started guide in packages/docs-content/guides/getting-started.mdx
- [x] T079 [P] [US4] Create theming guide in packages/docs-content/guides/theming.mdx
- [x] T080 [US4] Create default edition config in packages/docs-content/editions/default.json
- [x] T081 [US4] Create sample enterprise edition config in packages/docs-content/editions/enterprise-sample.json
- [x] T082 [US4] Configure docs-renderer-next with Next.js App Router in packages/docs-renderer-next/next.config.js
- [x] T083 [US4] Create docs site layout consuming docs-core in packages/docs-renderer-next/app/layout.tsx
- [x] T084 [US4] Create dynamic component page route in packages/docs-renderer-next/app/components/[id]/page.tsx
- [x] T085 [US4] Create navigation sidebar component in packages/docs-renderer-next/components/nav-sidebar.tsx
- [x] T086 [US4] Create MDX renderer component in packages/docs-renderer-next/components/mdx-renderer.tsx
- [x] T087 [US4] Wire docs app to docs-renderer-next in apps/docs/package.json
- [ ] T088 [US4] Add unit tests for edition filter logic in packages/docs-core/tests/filter.test.ts
- [ ] T089 [US4] Add unit tests for navigation generator in packages/docs-core/tests/navigation.test.ts
- [ ] T090 [US4] Add E2E test verifying edition filtering in apps/docs/tests/e2e/filtering.test.ts

**Checkpoint**: Docs site generates in <30s; edition filter correctly hides/shows components; navigation reflects filtered content ✅

---

## Phase 7: User Story 5 - Component Development Workflow (Priority: P5)

**Goal**: Contributors can add new components with manifest validation and automatic docs integration

**Independent Test**: Add a new component following the guide, verify manifest validates and component appears in docs

### Implementation for User Story 5

- [x] T091 [P] [US5] Create component generator script in tooling/scripts/new-component.ts
- [x] T092 [P] [US5] Create component template files in tooling/templates/component/ (embedded in generator script)
- [x] T093 [US5] Create manifest validation CLI command in packages/docs-core/src/cli/validate-manifests.ts
- [x] T094 [US5] Add validate:manifests script to root package.json
- [x] T095 [US5] Create CONTRIBUTING.md with component creation guide in /CONTRIBUTING.md
- [x] T096 [US5] Add ds-input component as second example in packages/wc/src/components/input/input.ts
- [x] T097 [US5] Create ds-input manifest in packages/docs-content/manifests/input.json
- [x] T098 [US5] Create ds-input MDX documentation in packages/docs-content/components/input.mdx
- [x] T099 [US5] Add React wrapper for ds-input in packages/react/src/components/input.tsx
- [ ] T100 [US5] Add unit tests for ds-input in packages/wc/tests/input.test.ts
- [ ] T101 [US5] Add a11y tests for ds-input in packages/wc/tests/input.a11y.test.ts
- [ ] T102 [US5] Verify new component appears in docs after build (E2E test)

**Checkpoint**: `pnpm new-component` generates valid scaffold; manifest validation catches errors; new components auto-appear in docs ✅

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: CI/CD, documentation, and final quality gates

- [x] T103 [P] Create GitHub Actions CI workflow in .github/workflows/ci.yml
- [x] T104 [P] Create bundle size check action in .github/workflows/ci.yml (size-limit)
- [x] T105 [P] Create Playwright config for E2E tests in playwright.config.ts
- [x] T106 Create README.md with project overview in /README.md
- [ ] T107 Verify all packages pass linting with `pnpm lint`
- [x] T108 Verify all packages pass type checking with `pnpm typecheck`
- [x] T109 Verify foundation packages are under 15KB gzipped (constitution gate)
- [ ] T110 Run full test suite and verify all tests pass
- [ ] T111 Validate quickstart.md instructions work end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup ────────────────────────────────────────────┐
                                                           │
Phase 2: Foundational ─────────────────────────────────────┤ BLOCKS ALL
                                                           │
     ┌─────────────────────────────────────────────────────┘
     │
     ├──> Phase 3: US1 Token-Driven Theming (P1) ──┐
     │                                              │
     ├──> Phase 4: US2 Web Components (P2) ────────┤ (depends on US1 tokens)
     │                                              │
     ├──> Phase 5: US3 Next.js Integration (P3) ───┤ (depends on US2 WC)
     │                                              │
     ├──> Phase 6: US4 Tenant Docs (P4) ───────────┤ (depends on US2 manifests)
     │                                              │
     └──> Phase 7: US5 Dev Workflow (P5) ──────────┤ (depends on US4 docs-core)
                                                   │
Phase 8: Polish ───────────────────────────────────┘
```

### User Story Dependencies

- **US1 (P1)**: Foundation only - No other story dependencies
- **US2 (P2)**: Depends on US1 (tokens for component styling)
- **US3 (P3)**: Depends on US2 (Web Components to wrap)
- **US4 (P4)**: Depends on US2 (manifests for components)
- **US5 (P5)**: Depends on US4 (docs-core for validation)

### Within Each User Story

1. Create source files in dependency order (tokens → CSS → components)
2. Create test files after implementation
3. Verify checkpoint before proceeding

### Parallel Opportunities

**Setup Phase (T001-T007)**:
- T003, T004, T005 can run in parallel (different tooling packages)

**Foundational Phase (T008-T021)**:
- T008-T018 can ALL run in parallel (package scaffolds are independent)

**User Story 1 (T022-T042)**:
- T022-T026 can run in parallel (different token files)
- T027-T029 must follow T022-T026 (mode tokens reference primitives)

**User Story 2 (T043-T057)**:
- T043-T045 can run in parallel (different primitive utilities)

**User Story 4 (T071-T090)**:
- T071-T073 can run in parallel (different docs-core modules)
- T077-T079 can run in parallel (different content files)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Token-Driven Theming)
4. **STOP and VALIDATE**: Verify tokens compile to CSS + TS; CSS layers work
5. Deploy token + CSS packages if ready

### Incremental Delivery

1. **Setup + Foundational** → Monorepo ready
2. **US1** → Token system works (MVP!) ✅
3. **US2** → Web Components work in any framework
4. **US3** → Next.js integration works
5. **US4** → Docs site generates with filtering
6. **US5** → Contributors can add components
7. **Polish** → CI/CD, quality gates

### Parallel Team Strategy

With multiple developers:

1. **All**: Setup + Foundational
2. **Dev A**: US1 (Tokens + CSS)
3. **Dev B**: US2 (after US1 tokens ready)
4. **Dev C**: US4 docs-core (can start in parallel with US2)
5. **Dev D**: US3 (after US2 ready)
6. **All**: US5 + Polish

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable (except where noted in dependencies)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Run `pnpm lint && pnpm typecheck && pnpm test` before marking phase complete
