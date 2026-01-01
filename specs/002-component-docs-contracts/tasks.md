# Tasks: Component & Documentation Contracts

**Input**: Design documents from `/specs/002-component-docs-contracts/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo structure**: `packages/<package>/src/`
- Schemas: `packages/docs-core/src/schemas/`
- Validation: `packages/docs-core/src/validation/`
- CLI: `packages/docs-core/src/cli/`
- Manifests: `packages/wc/src/components/<name>/manifest.json`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and VS Code configuration

- [x] T001 Add ajv and ajv-errors dependencies to packages/docs-core/package.json
- [x] T002 [P] Create schemas directory at packages/docs-core/src/schemas/
- [x] T003 [P] Create validation directory at packages/docs-core/src/validation/
- [x] T004 [P] Create cli directory at packages/docs-core/src/cli/
- [x] T005 [P] Create generated directory at packages/docs-core/src/generated/
- [x] T006 [P] Add VS Code settings for JSON Schema associations in .vscode/settings.json
- [x] T007 Export new modules from packages/docs-core/src/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core schemas and types that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Copy component-manifest.schema.json from specs/002-component-docs-contracts/contracts/ to packages/docs-core/src/schemas/component-manifest.schema.json
- [x] T009 [P] Copy docs-frontmatter.schema.json from specs/002-component-docs-contracts/contracts/ to packages/docs-core/src/schemas/docs-frontmatter.schema.json
- [x] T010 [P] Copy edition-config.schema.json from specs/002-component-docs-contracts/contracts/ to packages/docs-core/src/schemas/edition-config.schema.json
- [x] T011 [P] Copy edition-map.schema.json from specs/002-component-docs-contracts/contracts/ to packages/docs-core/src/schemas/edition-map.schema.json
- [x] T012 Create TypeScript types from schemas in packages/docs-core/src/types/manifest.ts
- [x] T013 [P] Create TypeScript types for validation results in packages/docs-core/src/types/validation.ts
- [x] T014 [P] Create edition utilities (hierarchy, isAvailable) in packages/docs-core/src/validation/edition-utils.ts
- [x] T015 Create schema compiler utility using Ajv in packages/docs-core/src/validation/schema-compiler.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Component Author Defines Metadata (Priority: P1) 🎯 MVP

**Goal**: Component authors can create manifest.json files with IDE autocomplete and build-time validation

**Independent Test**: Create a manifest.json with missing fields, run validation, verify clear error messages

### Implementation for User Story 1

- [x] T016 [US1] Implement manifest validator function in packages/docs-core/src/validation/validate-manifests.ts
- [x] T017 [US1] Add custom error messages for common manifest validation failures in packages/docs-core/src/validation/error-messages.ts
- [x] T018 [US1] Create manifest discovery utility (glob for manifest.json files) in packages/docs-core/src/validation/validate-manifests.ts
- [x] T019 [P] [US1] Create button component manifest at packages/wc/src/components/button/manifest.json
- [x] T020 [P] [US1] Create input component manifest at packages/wc/src/components/input/manifest.json
- [x] T021 [US1] Implement validateAllManifests function in packages/docs-core/src/validation/validate-manifests.ts
- [x] T022 [US1] Add "validate:manifests" script to packages/docs-core/package.json

**Checkpoint**: Manifest validation working - authors get autocomplete and validation errors

---

## Phase 4: User Story 2 - Documentation Author Creates Validated Docs (Priority: P1)

**Goal**: Documentation MDX files are validated against frontmatter schema and cross-referenced with manifests

**Independent Test**: Create MDX with invalid frontmatter or status mismatch, run validation, verify warnings

### Implementation for User Story 2

- [x] T023 [US2] Implement frontmatter validator function in packages/docs-core/src/validation/validate-frontmatter.ts
- [x] T024 [US2] Implement cross-reference validation (docs → manifest) in packages/docs-core/src/validation/validate-cross-refs.ts
- [x] T025 [US2] Add status mismatch warning logic to packages/docs-core/src/validation/validate-cross-refs.ts
- [x] T026 [P] [US2] Update button.mdx frontmatter to match schema in packages/docs-content/components/button.mdx
- [x] T027 [P] [US2] Update input.mdx frontmatter to match schema in packages/docs-content/components/input.mdx
- [x] T028 [US2] Implement validateAllDocs function in packages/docs-core/src/validation/validate-frontmatter.ts
- [x] T029 [US2] Create unified validate command that runs both manifest and docs validation in packages/docs-core/src/cli/validate.ts
- [x] T030 [US2] Add "validate" script to packages/docs-core/package.json (runs both validations)
- [x] T031 [US2] Add strictness mode flag (--strict for CI) to packages/docs-core/src/cli/validate.ts

**Checkpoint**: Full validation pipeline working - docs validated against manifests

---

## Phase 5: User Story 3 - Tenant Administrator Configures Edition (Priority: P2)

**Goal**: Tenants can configure edition filtering to control which components appear in docs

**Independent Test**: Set edition to "core", verify enterprise components are filtered from navigation

### Implementation for User Story 3

- [x] T032 [US3] Implement edition map generator in packages/docs-core/src/validation/generate-edition-map.ts
- [x] T033 [US3] Add "build:edition-map" script to packages/docs-core/package.json
- [x] T034 [US3] Create edition config loader utility in packages/docs-core/src/validation/load-edition-config.ts
- [x] T035 [P] [US3] Create default edition.config.json at apps/docs/edition.config.json
- [x] T036 [US3] Implement edition filter utility for navigation in packages/docs-core/src/validation/navigation-filter.ts
- [x] T037 [US3] Update generateStaticParams in packages/docs-renderer-next/app/components/[id]/page.tsx to filter by edition
- [x] T038 [US3] Create upgrade prompt page at packages/docs-renderer-next/app/edition-upgrade/page.tsx
- [x] T039 [US3] Add edition filtering to navigation component in packages/docs-renderer-next/components/nav-sidebar.tsx
- [x] T040 [US3] Integrate edition-map generation into docs build pipeline in apps/docs/package.json

**Checkpoint**: Edition filtering working - tenants see only their edition's components

---

## Phase 6: User Story 4 - Maintainer Audits Component Status (Priority: P2)

**Goal**: Maintainers can generate audit reports showing component status across the system

**Independent Test**: Run audit command, verify output includes all components with status and editions

### Implementation for User Story 4

- [x] T041 [US4] Implement audit report generator in packages/docs-core/src/cli/audit.ts
- [x] T042 [US4] Add status filtering option to audit command in packages/docs-core/src/cli/audit.ts
- [x] T043 [US4] Add JSON and markdown output formats to audit command in packages/docs-core/src/cli/audit.ts
- [x] T044 [US4] Add "audit:components" script to packages/docs-core/package.json
- [x] T045 [US4] Implement validation state aggregation in audit report in packages/docs-core/src/cli/audit.ts

**Checkpoint**: Audit reports available - maintainers can track component status

---

## Phase 7: User Story 5 - Content Publisher Updates Docs (Priority: P3)

**Goal**: Publishers can preview docs with edition filtering and hot-reload validation

**Independent Test**: Start preview with --edition=core, verify filtering and hot-reload work

### Implementation for User Story 5

- [x] T046 [US5] Add edition flag to dev server in apps/docs/package.json
- [x] T047 [US5] Implement Edition MDX component for conditional content in packages/docs-renderer-next/components/mdx/edition.tsx
- [x] T048 [US5] Register Edition component in MDX provider in packages/docs-renderer-next/components/mdx-renderer.tsx
- [x] T049 [US5] Add validation feedback to dev server console output in packages/docs-core/src/cli/validate.ts
- [x] T050 [US5] Add watch mode to validation command for hot-reload in packages/docs-core/src/cli/validate.ts

**Checkpoint**: Preview mode working - publishers can test edition-specific content

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Integration, documentation, and refinements across all stories

- [x] T051 [P] Add validation to CI workflow in .github/workflows/ci.yml
- [x] T052 [P] Update CLAUDE.md with new validation commands
- [x] T053 Run full validation suite and fix any issues
- [x] T054 [P] Add JSDoc comments to all public functions in packages/docs-core/src/
- [x] T055 Update quickstart.md in specs/002-component-docs-contracts/ with actual command outputs
- [x] T056 Run pnpm lint and fix any linting errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 and US2 can proceed in parallel (both P1)
  - US3 and US4 can proceed in parallel (both P2, after US1/US2 foundation)
  - US5 depends on US3 (needs edition filtering infrastructure)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - Uses manifests from US1 for cross-ref
- **User Story 3 (P2)**: Depends on US1 manifests being in place
- **User Story 4 (P2)**: Depends on US1 manifests being in place
- **User Story 5 (P3)**: Depends on US3 edition filtering infrastructure

### Within Each User Story

- Core utilities before validators
- Validators before CLI commands
- CLI commands before npm scripts
- Implementation before integration

### Parallel Opportunities

- T002-T006 (Setup directory creation) - all parallel
- T008-T011 (Schema copying) - all parallel
- T012-T015 (Type definitions) - T012, T013, T014 parallel
- T019-T020 (Manifest creation) - parallel
- T026-T027 (MDX updates) - parallel
- T051-T052, T054 (Polish) - parallel

---

## Parallel Example: Phase 2 Foundation

```bash
# Launch schema copying tasks together:
Task: "Copy component-manifest.schema.json..."
Task: "Copy docs-frontmatter.schema.json..."
Task: "Copy edition-config.schema.json..."
Task: "Copy edition-map.schema.json..."

# Launch type definition tasks together:
Task: "Create TypeScript types in manifest.ts"
Task: "Create TypeScript types in validation.ts"
Task: "Create edition utilities in edition-utils.ts"
```

---

## Parallel Example: User Stories 1 & 2

```bash
# After Phase 2, US1 and US2 can start in parallel:

# Developer A - User Story 1:
Task: "T016 [US1] Implement manifest validator..."
Task: "T017 [US1] Add custom error messages..."

# Developer B - User Story 2:
Task: "T023 [US2] Implement frontmatter validator..."
Task: "T024 [US2] Implement cross-reference validation..."
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Manifest Validation)
4. Complete Phase 4: User Story 2 (Docs Validation)
5. **STOP and VALIDATE**: Run full validation, verify error messages
6. Deploy/demo if ready - basic contracts enforced

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 + US2 → Test validation → Deploy (Contracts MVP!)
3. Add US3 → Test edition filtering → Deploy (Multi-tenant ready)
4. Add US4 → Test audit reports → Deploy (Governance tools)
5. Add US5 → Test preview mode → Deploy (Full DX)

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Manifest Validation)
   - Developer B: User Story 2 (Docs Validation)
3. After US1/US2:
   - Developer A: User Story 3 (Edition Filtering)
   - Developer B: User Story 4 (Audit Reports)
4. Then: User Story 5 (Preview Mode)

---

## Summary

| Phase | Tasks | Parallel | Story |
|-------|-------|----------|-------|
| Setup | T001-T007 | 5 | - |
| Foundational | T008-T015 | 6 | - |
| User Story 1 | T016-T022 | 2 | US1 |
| User Story 2 | T023-T031 | 2 | US2 |
| User Story 3 | T032-T040 | 1 | US3 |
| User Story 4 | T041-T045 | 0 | US4 |
| User Story 5 | T046-T050 | 0 | US5 |
| Polish | T051-T056 | 3 | - |

**Total Tasks**: 56
**Parallel Opportunities**: 19 tasks can run in parallel within their phases

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Schemas are copied from specs/contracts/ to ensure consistency with design
