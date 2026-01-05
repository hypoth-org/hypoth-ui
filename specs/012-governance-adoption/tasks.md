# Tasks: Governance, Versioning & Adoption Playbook

**Input**: Design documents from `/specs/012-governance-adoption/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Unit tests included for governance tooling utilities.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:
- Governance tooling: `packages/governance/`
- Docs content: `packages/docs-content/governance/`
- Root files: `CONTRIBUTING.md`, `CHANGELOG.md`, `.changeset/`
- CI: `.github/workflows/`, `.github/PULL_REQUEST_TEMPLATE.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize governance package and changesets tooling

- [x] T001 Install @changesets/cli and @changesets/changelog-github as devDependencies in root package.json
- [x] T002 Run `pnpm changeset init` to create .changeset/ directory
- [x] T003 Configure fixed versioning in .changeset/config.json for all @ds/* packages
- [x] T004 [P] Create packages/governance/ directory structure per plan.md
- [x] T005 [P] Create packages/governance/package.json with dependencies (commander, ajv)
- [x] T006 [P] Create packages/governance/tsconfig.json with strict mode configuration
- [x] T007 Add @ds/governance to pnpm workspace packages in pnpm-workspace.yaml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and types that all user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Create packages/governance/src/types/index.ts with shared TypeScript interfaces (DeprecationRecord, ChangesetEntry, ContributionGate, MigrationGuide)
- [x] T009 [P] Create packages/governance/src/schemas/deprecation-registry.schema.json from contracts/
- [x] T010 [P] Create packages/governance/src/schemas/changeset-entry.schema.json from contracts/
- [x] T011 [P] Create packages/governance/src/schemas/contribution-gates.schema.json from contracts/
- [x] T012 [P] Create packages/governance/src/schemas/migration-guide.schema.json from contracts/
- [x] T013 Create packages/governance/src/validation/schema-validator.ts with AJV-based validator utility
- [x] T014 Create packages/governance/src/index.ts exporting all public APIs
- [x] T015 Create packages/governance/deprecations.json with empty initial registry
- [x] T016 Create packages/governance/gates.json with standard gate definitions (test-coverage, accessibility, manifest-validation, docs-presence, design-review, a11y-audit)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Semantic Versioning and Change Visibility (Priority: P1)

**Goal**: Enable teams to understand release changes via semantic versions and auto-generated changelogs

**Independent Test**: Publish a test release with mixed changes and verify changelog generation with correct version bumps

### Tests for User Story 1

- [ ] T017 [P] [US1] Create packages/governance/tests/unit/changelog/generator.test.ts with tests for changelog generation
- [ ] T018 [P] [US1] Create packages/governance/tests/unit/changelog/filter.test.ts with tests for edition filtering

### Implementation for User Story 1

- [ ] T019 [P] [US1] Create packages/governance/src/changelog/types.ts with ChangelogRelease and ChangeEntry interfaces
- [ ] T020 [P] [US1] Create packages/governance/src/changelog/parser.ts to parse changesets from .changeset/ directory
- [ ] T021 [US1] Create packages/governance/src/changelog/generator.ts to generate CHANGELOG.md content from changesets
- [ ] T022 [US1] Create packages/governance/src/changelog/filter.ts to filter changelog entries by edition
- [ ] T023 [US1] Create .changeset/edition-changelog.js custom changelog generator with edition metadata support
- [ ] T024 [US1] Create packages/docs-content/governance/versioning.mdx documenting semver policy and change definitions
- [ ] T025 [US1] Update root CHANGELOG.md with initial version and format template

**Checkpoint**: Changelog generation works with edition filtering

---

## Phase 4: User Story 2 - Deprecation and Migration Workflow (Priority: P1)

**Goal**: Enable maintainers to deprecate features with proper warnings and migration guidance

**Independent Test**: Deprecate a test component and verify warnings appear in docs and at dev time

### Tests for User Story 2

- [ ] T026 [P] [US2] Create packages/governance/tests/unit/deprecation/registry.test.ts with tests for registry CRUD operations
- [ ] T027 [P] [US2] Create packages/governance/tests/unit/deprecation/validator.test.ts with tests for deprecation rule validation
- [ ] T028 [P] [US2] Create packages/governance/tests/unit/deprecation/warnings.test.ts with tests for warning generation

### Implementation for User Story 2

- [ ] T029 [P] [US2] Create packages/governance/src/deprecation/registry.ts to load/save deprecations.json
- [ ] T030 [P] [US2] Create packages/governance/src/deprecation/validator.ts to validate deprecation rules (2 major version window)
- [ ] T031 [US2] Create packages/governance/src/deprecation/warnings.ts to generate console warnings for deprecated API usage
- [ ] T032 [US2] Create packages/governance/src/cli/deprecate.ts CLI command to add new deprecations
- [ ] T033 [US2] Create packages/governance/templates/migration-guide.md template for migration documentation
- [ ] T034 [US2] Create packages/docs-content/governance/deprecation-policy.mdx documenting deprecation windows and process
- [ ] T035 [US2] Create packages/docs-content/governance/migration/template.mdx sample migration guide structure
- [ ] T036 [US2] Add deprecate script to packages/governance/package.json

**Checkpoint**: Deprecation workflow works with warnings and migration templates

---

## Phase 5: User Story 3 - Tenant Update Tracking (Priority: P1)

**Goal**: Enable tenants to view edition-filtered changelogs and track upstream changes

**Independent Test**: Generate a tenant update summary showing only changes for a specific edition

### Tests for User Story 3

- [ ] T037 [P] [US3] Create packages/governance/tests/unit/tenant/update-summary.test.ts with tests for update summary generation
- [ ] T038 [P] [US3] Create packages/governance/tests/unit/tenant/conflict-detector.test.ts with tests for overlay conflict detection

### Implementation for User Story 3

- [ ] T039 [P] [US3] Create packages/governance/src/tenant/types.ts with TenantUpdateSummary, FilteredChange, OverlayConflict interfaces
- [ ] T040 [P] [US3] Create packages/governance/src/tenant/update-summary.ts to generate edition-filtered update summaries
- [ ] T041 [US3] Create packages/governance/src/tenant/conflict-detector.ts to detect base content changes affecting tenant overlays
- [ ] T042 [US3] Create packages/governance/src/tenant/security-flagger.ts to flag security updates prominently
- [ ] T043 [US3] Create packages/governance/src/cli/tenant-diff.ts CLI command to generate tenant update summary
- [ ] T044 [US3] Add tenant-diff script to packages/governance/package.json

**Checkpoint**: Tenant update tracking works with edition filtering and conflict detection

---

## Phase 6: User Story 4 - Contribution Gates and Quality Checks (Priority: P2)

**Goal**: Enable automated and manual quality gates for component contributions

**Independent Test**: Submit a PR missing documentation and verify gate failure with clear remediation guidance

### Tests for User Story 4

- [ ] T045 [P] [US4] Create packages/governance/tests/unit/gates/validator.test.ts with tests for gate configuration validation
- [ ] T046 [P] [US4] Create packages/governance/tests/unit/gates/runner.test.ts with tests for gate execution logic

### Implementation for User Story 4

- [ ] T047 [P] [US4] Create packages/governance/src/gates/loader.ts to load gates.json configuration
- [ ] T048 [P] [US4] Create packages/governance/src/gates/runner.ts to execute automated gates and report results
- [ ] T049 [US4] Create packages/governance/src/cli/check-gates.ts CLI command to validate contribution gates
- [ ] T050 [US4] Create .github/workflows/contribution-gates.yml GitHub Actions workflow for automated gates
- [ ] T051 [US4] Create .github/PULL_REQUEST_TEMPLATE.md with checklist for manual gates
- [ ] T052 [US4] Create packages/governance/templates/pr-template.md component PR template
- [ ] T053 [US4] Create packages/governance/templates/component-scaffold/ directory with starter files for new components
- [ ] T054 [US4] Add check-gates script to packages/governance/package.json

**Checkpoint**: Contribution gates work in CI with clear feedback on failures

---

## Phase 7: User Story 5 - Quick Start Adoption Guide (Priority: P2)

**Goal**: Enable new teams to adopt the design system in under 30 minutes

**Independent Test**: Developer unfamiliar with system follows guide and successfully renders branded components

### Implementation for User Story 5

- [ ] T055 [P] [US5] Create packages/docs-content/governance/quick-start.mdx with 30-minute adoption guide
- [ ] T056 [P] [US5] Create packages/docs-content/governance/react-nextjs.mdx with React/Next.js-specific instructions
- [ ] T057 [P] [US5] Create packages/docs-content/governance/vanilla-js.mdx with vanilla JS instructions
- [ ] T058 [P] [US5] Create packages/docs-content/governance/vue.mdx with Vue instructions
- [ ] T059 [P] [US5] Create packages/docs-content/governance/angular.mdx with Angular instructions
- [ ] T060 [US5] Create packages/docs-content/governance/troubleshooting.mdx with common issues and solutions
- [ ] T061 [US5] Create packages/docs-content/governance/theming.mdx with token customization guide
- [ ] T062 [US5] Update packages/docs-content/manifest.json to include governance documentation entries

**Checkpoint**: Adoption guides complete and accessible from docs site navigation

---

## Phase 8: User Story 6 - Release Process Automation (Priority: P3)

**Goal**: Enable maintainers to release with automated changelog generation and version bumping

**Independent Test**: Run release process and verify packages published with correct versions and changelogs

### Implementation for User Story 6

- [ ] T063 [P] [US6] Create .github/workflows/release.yml GitHub Actions workflow for automated releases
- [ ] T064 [P] [US6] Create packages/governance/src/release/version-bumper.ts utility for version bump validation
- [ ] T065 [US6] Create packages/governance/src/release/publish-checker.ts to verify all gates pass before publish
- [ ] T066 [US6] Create packages/docs-content/governance/release-process.mdx documenting the release workflow
- [ ] T067 [US6] Create packages/governance/templates/release-notes.md template for release notes
- [ ] T068 [US6] Add release script to root package.json for triggering releases

**Checkpoint**: Release process automated with changesets integration

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Contributor documentation and final integration

- [ ] T069 Create CONTRIBUTING.md at repository root with contribution workflow and guidelines
- [ ] T070 [P] Update root package.json with governance scripts (deprecate, check-gates, tenant-diff)
- [ ] T071 [P] Create packages/governance/README.md with package documentation
- [ ] T072 Build packages/governance and verify all exports work
- [ ] T073 Run all governance package tests and verify passing
- [ ] T074 Validate governance docs render correctly in docs site
- [ ] T075 Test changesets workflow end-to-end with sample changeset

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1, US2, US3 are all P1 priority - can proceed in parallel
  - US4, US5 are P2 priority - can start after Foundation or in parallel with P1 stories
  - US6 is P3 priority - can start after Foundation, may depend on US1 changelog work
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - Versioning)**: No dependencies on other stories
- **User Story 2 (P1 - Deprecation)**: No dependencies on other stories
- **User Story 3 (P1 - Tenant Tracking)**: Depends on US1 changelog filtering logic
- **User Story 4 (P2 - Gates)**: No dependencies on other stories
- **User Story 5 (P2 - Adoption)**: No dependencies on other stories (docs only)
- **User Story 6 (P3 - Release)**: Integrates with US1 changelog generation

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Types/interfaces before implementation
- Core utilities before CLI commands
- Implementation before documentation
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks T001-T007: T004-T006 can run in parallel
- All Foundational tasks T008-T016: T009-T012 can run in parallel
- US1 tests T017-T018 can run in parallel
- US2 tests T026-T028 can run in parallel
- US3 tests T037-T038 can run in parallel
- US4 tests T045-T046 can run in parallel
- US5 implementation T055-T059 can all run in parallel (different files)
- US6 implementation T063-T064 can run in parallel

---

## Parallel Example: User Story 5

```bash
# Launch all framework guides together (all [P] marked):
Task: "Create packages/docs-content/governance/quick-start.mdx"
Task: "Create packages/docs-content/governance/react-nextjs.mdx"
Task: "Create packages/docs-content/governance/vanilla-js.mdx"
Task: "Create packages/docs-content/governance/vue.mdx"
Task: "Create packages/docs-content/governance/angular.mdx"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Versioning)
4. Complete Phase 4: User Story 2 (Deprecation)
5. Complete Phase 5: User Story 3 (Tenant Tracking)
6. **STOP and VALIDATE**: Test all P1 stories independently
7. Deploy/demo if ready - core governance is functional

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test changelog generation → MVP versioning!
3. Add User Story 2 → Test deprecation workflow → MVP deprecation!
4. Add User Story 3 → Test tenant tracking → MVP tenant support!
5. Add User Story 4 → Test contribution gates → Quality gates active!
6. Add User Story 5 → Validate adoption guides → Onboarding ready!
7. Add User Story 6 → Test release automation → Full automation!

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Versioning)
   - Developer B: User Story 2 (Deprecation)
   - Developer C: User Story 3 (Tenant Tracking)
3. Then:
   - Developer A: User Story 4 (Gates)
   - Developer B: User Story 5 (Adoption)
   - Developer C: User Story 6 (Release)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All governance tooling is devDependencies only (zero runtime impact)
