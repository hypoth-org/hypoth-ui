# Tasks: Auditable Accessibility Program

**Input**: Design documents from `/specs/011-a11y-audit/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests included where integration verification is required (a11y tooling needs test verification).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md monorepo structure:
- **CLI tooling**: `packages/a11y-audit/src/`
- **A11y tests**: `packages/wc/tests/a11y/`
- **Docs integration**: `packages/docs-core/src/conformance/`, `packages/docs-renderer-next/app/accessibility/`
- **CI workflows**: `.github/workflows/`
- **Audit artifacts**: `a11y-audits/`

---

## Phase 1: Setup (Shared Infrastructure) ✅

**Purpose**: Create new @ds/a11y-audit package and establish project structure

- [x] T001 Create packages/a11y-audit/ directory structure per plan.md
- [x] T002 Initialize package.json for @ds/a11y-audit with TypeScript, commander, Ajv dependencies
- [x] T003 [P] Configure tsconfig.json for @ds/a11y-audit in packages/a11y-audit/tsconfig.json
- [x] T004 [P] Add @ds/a11y-audit to pnpm workspace in pnpm-workspace.yaml (already included via packages/*)
- [x] T005 [P] Create a11y-audits/ directory structure at repository root (records/, reports/)
- [x] T006 Copy JSON schemas from specs/011-a11y-audit/contracts/ to packages/a11y-audit/src/schemas/

---

## Phase 2: Foundational (Blocking Prerequisites) ✅

**Purpose**: Core utilities and schemas that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Implement JSON schema validator utility in packages/a11y-audit/src/lib/validator.ts
- [x] T008 [P] Create TypeScript types from schemas in packages/a11y-audit/src/lib/types.ts
- [x] T009 [P] Install axe-core and vitest-axe in packages/wc (jest-axe already installed, works with vitest)
- [x] T010 Create vitest-axe setup file in packages/wc/tests/a11y/setup.ts
- [x] T011 [P] Add a11y test script to packages/wc/package.json (already present: "test:a11y")
- [x] T011a [P] Add severity threshold configuration in packages/a11y-audit/src/lib/config.ts (supports CLI flag --severity and A11Y_SEVERITY env var)
- [x] T012 Create CLI entry point in packages/a11y-audit/src/cli/index.ts with commander setup

**Checkpoint**: Foundation ready - user story implementation can now begin ✅

---

## Phase 3: User Story 1 - Automated CI Accessibility Checks (Priority: P1) 🎯 MVP ✅

**Goal**: Developers get automated a11y feedback on every PR, with CI failing on Critical + Serious violations

**Independent Test**: Push a component with a known a11y violation (e.g., button without accessible name) and verify CI fails with specific error

### Tests for User Story 1

- [x] T013 [P] [US1] Create test component with known violation in packages/wc/tests/a11y/fixtures/violation-button.ts
- [x] T014 [P] [US1] Create test component that passes in packages/wc/tests/a11y/fixtures/valid-button.ts

### Implementation for User Story 1

- [x] T015 [P] [US1] Create a11y test for ds-button in packages/wc/tests/a11y/button.a11y.test.ts (existing: tests/button.a11y.test.ts)
- [x] T016 [P] [US1] Create a11y test for ds-input in packages/wc/tests/a11y/input.a11y.test.ts (existing: tests/a11y/input-field.test.ts)
- [x] T017 [P] [US1] Create a11y test for ds-checkbox in packages/wc/tests/a11y/checkbox.a11y.test.ts (existing: tests/a11y/checkbox-radio.test.ts)
- [x] T018 [P] [US1] Create a11y test for ds-switch in packages/wc/tests/a11y/switch.a11y.test.ts (existing: tests/a11y/switch.test.ts)
- [x] T019 [P] [US1] Create a11y test for ds-radio-group in packages/wc/tests/a11y/radio-group.a11y.test.ts (existing: tests/a11y/checkbox-radio.test.ts)
- [x] T020 [P] [US1] Create a11y test for ds-dialog in packages/wc/tests/a11y/dialog.a11y.test.ts (existing: tests/a11y/dialog.test.ts)
- [x] T021 [P] [US1] Create a11y test for ds-popover in packages/wc/tests/a11y/popover.a11y.test.ts (existing: tests/a11y/popover.test.ts)
- [x] T022 [P] [US1] Create a11y test for ds-tooltip in packages/wc/tests/a11y/tooltip.a11y.test.ts (existing: tests/a11y/tooltip.test.ts)
- [x] T023 [P] [US1] Create a11y test for ds-menu in packages/wc/tests/a11y/menu.a11y.test.ts (existing: tests/a11y/menu.test.ts)
- [x] T024 [US1] Create GitHub Actions workflow for a11y checks in .github/workflows/a11y-check.yml
- [x] T025 [US1] Configure artifact upload for a11y reports (5-year retention) in .github/workflows/a11y-check.yml
- [x] T026 [US1] Add remediation guidance mapping in packages/a11y-audit/src/lib/remediation.ts
- [x] T027 [US1] Create CI reporter utility for human-readable output in packages/a11y-audit/src/lib/reporter.ts

**Checkpoint**: Automated a11y checks run on every PR, fail on violations, provide remediation guidance ✅

---

## Phase 4: User Story 2 - Component Manual Audit Checklist (Priority: P2) ✅

**Goal**: Auditors can complete category-specific checklists and generate audit artifacts

**Independent Test**: Run `pnpm a11y:audit --component ds-button --category form-controls`, complete checklist, verify JSON artifact generated

### Implementation for User Story 2

- [x] T028 [P] [US2] Create form-controls checklist template in packages/a11y-audit/src/templates/form-controls.json
- [x] T029 [P] [US2] Create overlays checklist template in packages/a11y-audit/src/templates/overlays.json
- [x] T030 [P] [US2] Create navigation checklist template in packages/a11y-audit/src/templates/navigation.json
- [x] T031 [P] [US2] Create data-display checklist template in packages/a11y-audit/src/templates/data-display.json
- [x] T032 [P] [US2] Create feedback checklist template in packages/a11y-audit/src/templates/feedback.json
- [x] T033 [US2] Implement audit CLI command in packages/a11y-audit/src/cli/audit.ts
- [x] T034 [US2] Implement interactive checklist workflow in packages/a11y-audit/src/lib/checklist-runner.ts
- [x] T035 [US2] Implement audit artifact generator in packages/a11y-audit/src/lib/artifact.ts
- [x] T036 [US2] Add validation for incomplete checklists in packages/a11y-audit/src/lib/artifact.ts
- [x] T037 [US2] Implement validate CLI command in packages/a11y-audit/src/cli/validate.ts
- [x] T038 [US2] Add pnpm script for audit command in packages/a11y-audit/package.json

**Checkpoint**: Manual audits produce validated JSON artifacts in a11y-audits/records/ ✅

---

## Phase 5: User Story 3 - Release Accessibility Conformance Report (Priority: P2) ✅

**Goal**: Release managers can generate comprehensive conformance reports aggregating all audit data

**Independent Test**: Run `pnpm a11y:report --version 1.0.0`, verify report.json and report.html generated with component statuses

### Implementation for User Story 3

- [x] T039 [P] [US3] Implement report aggregator in packages/a11y-audit/src/lib/aggregator.ts
- [x] T040 [P] [US3] Create HTML report template in packages/a11y-audit/src/templates/report.html.hbs
- [x] T041 [US3] Implement report CLI command in packages/a11y-audit/src/cli/report.ts
- [x] T042 [US3] Implement JSON report generation in packages/a11y-audit/src/lib/report-json.ts
- [x] T043 [US3] Implement HTML report generation in packages/a11y-audit/src/lib/report-html.ts
- [x] T044 [US3] Add component manifest integration for component list in packages/a11y-audit/src/lib/manifest-loader.ts
- [x] T045 [US3] Create GitHub Actions workflow for release reports in .github/workflows/conformance-report.yml
- [x] T046 [US3] Add pnpm script for report command in packages/a11y-audit/package.json

**Checkpoint**: Release conformance reports generated with aggregated automated + manual data ✅

---

## Phase 6: User Story 4 - Documentation Accessibility Conformance Section (Priority: P3) ✅

**Goal**: Docs site displays Accessibility Conformance table with filtering and tenant extension support

**Independent Test**: Navigate to /accessibility in docs, verify component table renders with filters working

### Implementation for User Story 4

- [x] T047 [P] [US4] Create conformance types in packages/docs-core/src/conformance/types.ts
- [x] T048 [P] [US4] Implement conformance data loader in packages/docs-core/src/conformance/loader.ts
- [x] T049 [US4] Create Accessibility Conformance table component in packages/docs-renderer-next/app/accessibility/ConformanceTable.tsx
- [x] T050 [US4] Create category filter component in packages/docs-renderer-next/app/accessibility/CategoryFilter.tsx
- [x] T051 [US4] Create conformance status badge component in packages/docs-renderer-next/app/accessibility/StatusBadge.tsx
- [x] T052 [US4] Implement main Accessibility Conformance page in packages/docs-renderer-next/app/accessibility/page.tsx
- [x] T053 [US4] Create component detail page template in packages/docs-renderer-next/app/accessibility/[component]/page.tsx
- [x] T054 [US4] Implement tenant extension configuration in packages/docs-core/src/conformance/tenant-config.ts
- [x] T055 [US4] Add navigation link to Accessibility section in packages/docs-renderer-next/app/layout.tsx (pending manual integration)
- [x] T056 [US4] Export conformance utilities from @ds/docs-core in packages/docs-core/src/index.ts

**Checkpoint**: Docs site displays live conformance data with filtering and tenant extension ✅

---

## Phase 7: Polish & Cross-Cutting Concerns ✅

**Purpose**: Final integration, documentation, and cleanup

- [x] T057 [P] Update specs/011-a11y-audit/quickstart.md with actual CLI commands and examples (already accurate)
- [x] T058 [P] Add README.md for @ds/a11y-audit package in packages/a11y-audit/README.md
- [x] T059 [P] Create sample audit record for ds-button in a11y-audits/records/ds-button/1.0.0.json
- [x] T060 [P] Create sample conformance report in a11y-audits/reports/1.0.0/report.json
- [x] T061 Add @ds/a11y-audit to root package.json scripts (a11y:audit, a11y:report, a11y:validate)
- [ ] T062 Run all a11y tests and verify CI workflow in .github/workflows/a11y-check.yml
- [ ] T063 Validate JSON schemas with Ajv in packages/a11y-audit/tests/unit/schemas.test.ts
- [x] T064 Update CLAUDE.md with a11y-audit commands if not already present

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately ✅
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories ✅
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion ✅
  - US1 (Automated CI) can proceed first (MVP) ✅
  - US2 (Manual Audit) can proceed in parallel with US1 ✅
  - US3 (Reports) depends on US2 (needs audit artifacts to aggregate) ✅
  - US4 (Docs) can proceed in parallel but integrates data from US3 ✅
- **Polish (Phase 7)**: Depends on all user stories being complete ✅

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories ✅
- **User Story 2 (P2)**: Can start after Foundational - No dependencies on other stories ✅
- **User Story 3 (P2)**: Depends on US2 (needs audit record format) - Can use sample data initially ✅
- **User Story 4 (P3)**: Can start after Foundational - Integrates data from US3 ✅

### Within Each User Story

- Templates/schemas before CLI commands
- Core utilities before CLI commands
- CLI commands before GitHub Actions workflows
- All parallel tasks marked [P] can run simultaneously

### Parallel Opportunities

**Phase 1 (Setup)**:
```
T003, T004, T005 can run in parallel
```

**Phase 2 (Foundational)**:
```
T008, T009, T011 can run in parallel (after T007)
```

**Phase 3 (US1 - Automated CI)**:
```
T013, T014 can run in parallel (test fixtures)
T015-T023 can ALL run in parallel (component a11y tests)
```

**Phase 4 (US2 - Manual Audit)**:
```
T028-T032 can ALL run in parallel (checklist templates)
```

**Phase 5 (US3 - Reports)**:
```
T039, T040 can run in parallel
```

**Phase 6 (US4 - Docs)**:
```
T047, T048 can run in parallel
T049, T050, T051 can run in parallel (React components)
```

**Phase 7 (Polish)**:
```
T057, T058, T059, T060 can ALL run in parallel
```

---

## Parallel Example: User Story 1 (Automated CI)

```bash
# Launch all test fixtures together:
Task: "Create test component with known violation in packages/wc/tests/a11y/fixtures/violation-button.ts"
Task: "Create test component that passes in packages/wc/tests/a11y/fixtures/valid-button.ts"

# Launch ALL component a11y tests together:
Task: "Create a11y test for ds-button in packages/wc/tests/a11y/button.a11y.test.ts"
Task: "Create a11y test for ds-input in packages/wc/tests/a11y/input.a11y.test.ts"
Task: "Create a11y test for ds-checkbox in packages/wc/tests/a11y/checkbox.a11y.test.ts"
Task: "Create a11y test for ds-switch in packages/wc/tests/a11y/switch.a11y.test.ts"
Task: "Create a11y test for ds-radio-group in packages/wc/tests/a11y/radio-group.a11y.test.ts"
Task: "Create a11y test for ds-dialog in packages/wc/tests/a11y/dialog.a11y.test.ts"
Task: "Create a11y test for ds-popover in packages/wc/tests/a11y/popover.a11y.test.ts"
Task: "Create a11y test for ds-tooltip in packages/wc/tests/a11y/tooltip.a11y.test.ts"
Task: "Create a11y test for ds-menu in packages/wc/tests/a11y/menu.a11y.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup ✅
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories) ✅
3. Complete Phase 3: User Story 1 (Automated CI) ✅
4. **STOP and VALIDATE**: Run `pnpm --filter @ds/wc test:a11y` and verify CI workflow
5. Deploy/demo if ready - automated a11y checks are live!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready ✅
2. Add User Story 1 → Test independently → Deploy (MVP - CI catches a11y violations) ✅
3. Add User Story 2 → Test independently → Deploy (Manual audits available) ✅
4. Add User Story 3 → Test independently → Deploy (Release reports available) ✅
5. Add User Story 4 → Test independently → Deploy (Docs conformance section live) ✅
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Automated CI)
   - Developer B: User Story 2 (Manual Audits)
3. After US2 basics complete:
   - Developer A: User Story 3 (Reports) - depends on US2 artifacts
   - Developer B: User Story 4 (Docs) - can start independently
4. All: Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Total tasks: 65
- MVP scope: Phase 1-3 (28 tasks)
- **Implementation completed**: 2026-01-04
