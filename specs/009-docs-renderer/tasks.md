# Tasks: Docs Renderer v1 (Next.js) + White-Label Overlay Workflow

**Input**: Design documents from `/specs/009-docs-renderer/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks included (not explicitly requested in specification).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo packages**: `packages/docs-core/`, `packages/docs-renderer-next/`, `packages/docs-content/`
- **New package**: `packages/docs-content-tenant-example/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and type consolidation

- [x] T001 Copy extended edition-config schema from specs/009-docs-renderer/contracts/edition-config-extended.schema.json to packages/docs-core/src/schemas/edition-config-extended.schema.json
- [x] T002 [P] Copy search-index schema from specs/009-docs-renderer/contracts/search-index.schema.json to packages/docs-core/src/schemas/search-index.schema.json
- [x] T003 [P] Copy content-pack schema from specs/009-docs-renderer/contracts/content-pack.schema.json to packages/docs-core/src/schemas/content-pack.schema.json
- [x] T004 Extend EditionConfig type in packages/docs-core/src/types/manifest.ts with contentPacks, visibility, and upgrade fields from data-model.md
- [x] T005 Add ContentPack interface to packages/docs-core/src/types/manifest.ts per data-model.md
- [x] T006 [P] Add ResolvedContent interface to packages/docs-core/src/types/manifest.ts per data-model.md
- [x] T007 [P] Add SearchIndex and SearchEntry interfaces to packages/docs-core/src/types/manifest.ts per data-model.md
- [x] T008 [P] Add BrandingContextValue interface to packages/docs-core/src/types/manifest.ts per data-model.md
- [x] T009 Export new types from packages/docs-core/src/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T010 Create content overlay resolver module at packages/docs-core/src/content/overlay.ts with resolveContent() and initContentPacks() functions
- [x] T011 Add loadEditionConfigExtended() function to packages/docs-core/src/validation/load-edition-config.ts supporting new schema fields
- [x] T012 Create schema validator for extended edition config in packages/docs-core/src/validation/schema-compiler.ts (getExtendedEditionConfigValidator)
- [x] T013 [P] Update packages/docs-core/src/index.ts to export overlay module functions
- [x] T014 [P] Update packages/docs-core/src/index.ts to export extended config loader

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Render Documentation from Content Packs (Priority: P1)

**Goal**: Deploy a docs site that automatically renders component documentation and guides from content packs with auto-generated navigation

**Independent Test**: Deploy docs site with @ds/docs-content, navigate to component and guide pages, verify content renders correctly and navigation reflects all available content

### Implementation for User Story 1

- [x] T015 [US1] Extend generateNavigation() in packages/docs-core/src/nav/navigation.ts to accept ContentPack[] and use overlay resolution for manifests
- [x] T016 [US1] Update loadValidManifests() in packages/docs-core/src/validation/validate-manifests.ts to support content pack overlay resolution
- [x] T017 [P] [US1] Create content resolver lib at packages/docs-renderer-next/lib/content-resolver.ts wrapping docs-core overlay functions for Next.js
- [x] T018 [US1] Update packages/docs-renderer-next/app/components/[id]/page.tsx to use content-resolver for MDX loading with overlay support
- [x] T019 [US1] Update packages/docs-renderer-next/app/guides/[id]/page.tsx to use content-resolver for guide loading with overlay support
- [x] T020 [US1] Update generateStaticParams() in packages/docs-renderer-next/app/components/[id]/page.tsx to use overlay-aware manifest loading
- [x] T021 [US1] Update generateStaticParams() in packages/docs-renderer-next/app/guides/[id]/page.tsx to discover guides from content packs
- [x] T022 [US1] Update packages/docs-renderer-next/components/nav-sidebar.tsx to use overlay-aware navigation generation
- [x] T023 [US1] Add accessibility section rendering in packages/docs-renderer-next/app/components/[id]/page.tsx displaying APG pattern, keyboard interactions, and screen reader notes from manifest

**Checkpoint**: At this point, User Story 1 should be fully functional - docs render from content packs with auto-generated navigation

---

## Phase 4: User Story 2 - Edition-Based Content Filtering (Priority: P1)

**Goal**: Filter components and documentation based on edition tier (core/pro/enterprise) with upgrade prompts for hidden content

**Independent Test**: Configure edition as "pro" in edition-config.json, verify enterprise-only components are hidden from navigation and show upgrade prompts

### Implementation for User Story 2

- [x] T024 [P] [US2] Extend filterNavigationForEdition() in packages/docs-core/src/validation/navigation-filter.ts to support visibility.hiddenComponents from extended config
- [x] T025 [P] [US2] Add filterContentForEdition() function to packages/docs-core/src/filter/edition-filter.ts for MDX section filtering based on frontmatter editions
- [x] T026 [US2] Update packages/docs-renderer-next/app/components/[id]/page.tsx to apply edition filtering to content sections
- [x] T027 [US2] Create upgrade prompt component at packages/docs-renderer-next/components/upgrade-prompt.tsx consuming upgrade config (url, ctaText, message)
- [x] T028 [US2] Update packages/docs-renderer-next/app/edition-upgrade/page.tsx to use new upgrade-prompt component with config-driven messaging
- [x] T029 [US2] Update packages/docs-renderer-next/components/nav-sidebar.tsx to filter nav items by edition and apply visibility.hiddenComponents

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - docs render with proper edition filtering

---

## Phase 5: User Story 3 - Tenant Branding Customization (Priority: P1)

**Goal**: Apply tenant branding (logo, name, colors) from edition config throughout the docs site

**Independent Test**: Configure branding in edition-config.json with custom logo, name, and primary color. Verify the docs site displays tenant branding throughout

### Implementation for User Story 3

- [x] T030 [P] [US3] Create BrandingContext and BrandingProvider at packages/docs-renderer-next/lib/branding-context.tsx exposing branding values from edition config
- [x] T031 [P] [US3] Create Logo component at packages/docs-renderer-next/components/branding/logo.tsx consuming branding.logo with fallback to branding.name text
- [x] T032 [P] [US3] Create BrandedHeader component at packages/docs-renderer-next/components/branding/header.tsx using Logo and branding.name
- [x] T033 [US3] Update packages/docs-renderer-next/app/layout.tsx to wrap app with BrandingProvider and use BrandedHeader
- [x] T034 [US3] Add CSS custom property injection in packages/docs-renderer-next/app/layout.tsx applying --ds-brand-primary from branding.primaryColor
- [x] T035 [US3] Update generateMetadata() in packages/docs-renderer-next/app/layout.tsx to use branding.name in page titles
- [x] T036 [US3] Update packages/docs-renderer-next/styles/globals.css to use --ds-brand-primary for accent colors via CSS layer

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should work - docs render with filtering and tenant branding

---

## Phase 6: User Story 4 - Content Overlay and Override (Priority: P2)

**Goal**: Enable tenant content packs to override and extend base content

**Independent Test**: Create tenant content pack with overridden page and new page, verify overlay works and new content appears

### Implementation for User Story 4

- [x] T037 [P] [US4] Create packages/docs-content-tenant-example/package.json with docsContent config per content-pack.schema.json
- [x] T038 [P] [US4] Create packages/docs-content-tenant-example/edition-config.json with sample branding and pro edition
- [x] T039 [P] [US4] Create packages/docs-content-tenant-example/components/button.mdx overriding base button docs with tenant-specific content
- [x] T040 [P] [US4] Create packages/docs-content-tenant-example/guides/tenant-guide.mdx as new tenant-only guide
- [x] T041 [US4] Add packages/docs-content-tenant-example to pnpm-workspace.yaml
- [x] T042 [US4] Update initContentPacks() in packages/docs-core/src/content/overlay.ts to support contentPacks array from extended edition config
- [x] T043 [US4] Update packages/docs-renderer-next/lib/content-resolver.ts to initialize content packs from edition config including tenant overlays
- [x] T044 [US4] Add manifest merge logic to packages/docs-core/src/content/overlay.ts for tenant manifests extending base manifests
- [x] T045 [US4] Update navigation generation to include tenant-only content (new guides) in packages/docs-core/src/nav/navigation.ts

**Checkpoint**: At this point, User Stories 1-4 should work - tenant overlay fully functional

---

## Phase 7: User Story 5 - Search Index Generation (Priority: P2)

**Goal**: Generate search index at build time containing indexable content

**Independent Test**: Run build, verify search index JSON is generated with all indexable content

### Implementation for User Story 5

- [x] T046 [P] [US5] Create search indexer module at packages/docs-core/src/search/indexer.ts with generateSearchIndex() function
- [x] T047 [US5] Implement content extraction in packages/docs-core/src/search/indexer.ts parsing MDX frontmatter and body for index entries
- [x] T048 [US5] Add edition filtering to packages/docs-core/src/search/indexer.ts to only index edition-available content
- [x] T049 [US5] Add build script to packages/docs-core/package.json running search index generation (build:search-index)
- [x] T050 [US5] Create CLI command at packages/docs-core/src/cli/build-search-index.ts writing search-index.json to public directory
- [x] T051 [P] [US5] Create stub search input component at packages/docs-renderer-next/components/search/search-input.tsx (UI placeholder)
- [x] T052 [US5] Export search indexer from packages/docs-core/src/index.ts

**Checkpoint**: At this point, User Stories 1-5 should work - search index generates at build time

---

## Phase 8: User Story 6 - Feature Toggles (Priority: P3)

**Goal**: Enable/disable documentation features via edition config

**Independent Test**: Configure features.darkMode: false, verify toggle is hidden; enable feedback, verify widget appears

### Implementation for User Story 6

- [x] T053 [P] [US6] Create useFeatures() hook at packages/docs-renderer-next/lib/branding-context.tsx reading feature flags from BrandingContext
- [x] T054 [P] [US6] Create FeedbackWidget stub component at packages/docs-renderer-next/components/feedback/feedback-widget.tsx
- [x] T055 [US6] Update packages/docs-renderer-next/app/layout.tsx to conditionally render ThemeSwitcher based on features.darkMode
- [x] T056 [US6] Update packages/docs-renderer-next/app/layout.tsx to conditionally render SearchInput based on features.search
- [x] T057 [US6] Update packages/docs-renderer-next/app/layout.tsx to conditionally render FeedbackWidget based on features.feedback
- [x] T058 [US6] Add default feature values to packages/docs-core/src/validation/load-edition-config.ts (darkMode: true, search: true, feedback: false)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T059 [P] Add error handling for missing edition config in packages/docs-core/src/validation/load-edition-config.ts with console warning and default to core edition
- [x] T060 [P] Add error handling for inaccessible branding.logo URL in packages/docs-renderer-next/components/branding/logo.tsx with fallback to text
- [x] T061 [P] Add development mode error for tenant overlay referencing non-existent base component in packages/docs-core/src/content/overlay.ts
- [x] T062 [P] Add cycle detection for content dependencies in packages/docs-core/src/content/overlay.ts with clear error message
- [x] T063 Update packages/docs-renderer-next/README.md with quickstart documentation
- [x] T064 Add skip link for accessibility in packages/docs-renderer-next/app/layout.tsx
- [x] T065 Verify all pages have proper landmark roles (main, nav, header) in packages/docs-renderer-next/app/layout.tsx
- [x] T066 Run build and verify Lighthouse performance score >= 90

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1 → P2 → P3)
  - US1, US2, US3 are all P1 but have internal dependencies
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Depends on US1 navigation infrastructure but can develop filtering in parallel
- **User Story 3 (P1)**: Can develop branding components in parallel with US1/US2, layout integration after US1
- **User Story 4 (P2)**: Depends on US1 content resolution infrastructure
- **User Story 5 (P2)**: Depends on US1 content loading and US2 edition filtering
- **User Story 6 (P3)**: Depends on US3 branding context

### Within Each User Story

- Core infrastructure before UI components
- Models/types before services
- Services before rendering
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- T017, T024, T025, T030, T031, T032, T037, T038, T039, T040, T046, T051, T053, T054 can run in parallel within their respective phases
- Schema copies (T001, T002, T003) are fully parallel
- Type additions (T005, T006, T007, T008) are fully parallel

---

## Parallel Example: Phase 1 Setup

```bash
# Launch all schema copies together:
Task: "Copy extended edition-config schema to packages/docs-core/src/schemas/"
Task: "Copy search-index schema to packages/docs-core/src/schemas/"
Task: "Copy content-pack schema to packages/docs-core/src/schemas/"

# Launch all type additions together:
Task: "Add ContentPack interface to packages/docs-core/src/types/manifest.ts"
Task: "Add ResolvedContent interface to packages/docs-core/src/types/manifest.ts"
Task: "Add SearchIndex interface to packages/docs-core/src/types/manifest.ts"
Task: "Add BrandingContextValue interface to packages/docs-core/src/types/manifest.ts"
```

---

## Parallel Example: User Story 3 Components

```bash
# Launch all branding components together:
Task: "Create BrandingContext at packages/docs-renderer-next/lib/branding-context.tsx"
Task: "Create Logo component at packages/docs-renderer-next/components/branding/logo.tsx"
Task: "Create BrandedHeader at packages/docs-renderer-next/components/branding/header.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Recommended Delivery Order (P1 First)

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Docs render from content packs
3. Add User Story 2 → Test independently → Edition filtering works
4. Add User Story 3 → Test independently → Branding applies (P1 complete!)
5. Add User Story 4 → Test independently → Overlay works (P2 starts)
6. Add User Story 5 → Test independently → Search index generates
7. Add User Story 6 → Test independently → Feature toggles work (P3 complete!)
8. Polish phase → Production ready

### Incremental Delivery

Each user story adds value without breaking previous stories:
- US1: Basic docs rendering
- US2: +Edition filtering
- US3: +Tenant branding
- US4: +Content overlay
- US5: +Search index
- US6: +Feature toggles

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Extend existing packages rather than creating new ones (per research.md recommendation)
- No runtime CSS-in-JS - all styling via CSS custom properties and layers
