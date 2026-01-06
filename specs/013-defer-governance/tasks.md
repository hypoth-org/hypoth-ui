# Tasks: Defer Governance Infrastructure

**Input**: Design documents from `/specs/013-defer-governance/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Tests**: Not required - this is an infrastructure refactoring task with validation via build/test commands.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a repository-level infrastructure refactoring affecting:
- Root configuration files (`package.json`, `CLAUDE.md`)
- CI/CD workflows (`.github/workflows/`)
- Changeset configuration (`.changeset/`)
- Package directory moves (`packages/governance/` → `.archive/governance/`)

---

## Phase 1: Setup (Archive Directory Creation)

**Purpose**: Create archive directory structure for deferred packages

- [x] T001 Create `.archive/` directory at repository root
- [x] T002 Add `.archive/README.md` explaining archive directory purpose and conventions

---

## Phase 2: User Story 1 - Build Without Governance (Priority: P1) 🎯 MVP

**Goal**: Monorepo builds and tests pass without @ds/governance package in active workspace

**Independent Test**: Run `pnpm install && pnpm build && pnpm test` - all commands succeed

### Implementation for User Story 1

- [x] T003 [US1] Move `packages/governance/` to `.archive/governance/` using git mv
- [x] T004 [US1] Remove governance scripts from `package.json` (ds-deprecate, ds-check-gates, ds-tenant-diff on lines 34-36)
- [x] T005 [US1] Update `.changeset/config.json` to remove @ds/governance from ignore array
- [x] T006 [US1] Run `pnpm install` to verify workspace resolves without governance
- [x] T007 [US1] Run `pnpm build` to verify all active packages build successfully
- [x] T008 [US1] Run `pnpm test` to verify all tests pass

**Checkpoint**: At this point, local development workflow is fully functional without governance

---

## Phase 3: User Story 2 - Archived Code Discoverable (Priority: P2)

**Goal**: Future contributors can find archived governance code and understand how to reactivate it

**Independent Test**: Navigate to `.archive/governance/` and confirm all files exist; read GOVERNANCE.md and verify reactivation steps are clear

### Implementation for User Story 2

- [x] T009 [US2] Verify all governance source files exist in `.archive/governance/` (src/, package.json, tsconfig.json, gates.json)
- [x] T010 [US2] Create `GOVERNANCE.md` at repository root with:
  - Deferral rationale (premature for 17-component library)
  - Contents inventory (what was archived)
  - Reactivation threshold (suggest 40+ components)
  - Step-by-step reactivation instructions (minimum 5 steps)

**Checkpoint**: At this point, governance code is preserved and documented for future restoration

---

## Phase 4: User Story 3 - CI Runs Without Governance (Priority: P2)

**Goal**: CI/CD pipelines pass without governance-related jobs or steps

**Independent Test**: Review CI workflow files and confirm no references to @ds/governance

### Implementation for User Story 3

- [x] T011 [P] [US3] Remove `governance-gates` job (lines 307-341) from `.github/workflows/ci.yml`
- [x] T012 [P] [US3] Remove governance check step (line 40-41) from `.github/workflows/release.yml`
- [x] T013 [P] [US3] Remove edition changelog generation step (lines 55-61) from `.github/workflows/release.yml`
- [x] T014 [US3] Verify no remaining @ds/governance references in `.github/workflows/` using grep

**Checkpoint**: At this point, CI/CD workflows are clean of governance references

---

## Phase 5: User Story 4 - Manifest Validation Works (Priority: P3)

**Goal**: Developers can still validate manifests using @ds/docs-core (not governance)

**Independent Test**: Run `pnpm validate:manifests` and confirm it works

### Implementation for User Story 4

- [x] T015 [US4] Verify `pnpm validate:manifests` command works (uses @ds/docs-core, not governance)
- [x] T016 [US4] Verify @ds/docs-core has no imports from @ds/governance using grep

**Checkpoint**: At this point, manifest validation is confirmed independent of governance

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation updates and final validation

- [x] T017 Update `CLAUDE.md` to remove governance commands section (references to ds-deprecate, ds-check-gates, ds-tenant-diff)
- [x] T018 Verify no remaining @ds/governance references in active packages using `grep -r "@ds/governance" packages/`
- [x] T019 Run full validation: `pnpm install && pnpm build && pnpm test && pnpm typecheck`
- [x] T020 Run quickstart.md verification checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup - CRITICAL for all other stories
- **User Story 2 (Phase 3)**: Depends on US1 (archive must exist)
- **User Story 3 (Phase 4)**: Depends on US1 (governance must be removed from workspace)
- **User Story 4 (Phase 5)**: Depends on US1 (independent validation)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (US1: Build Without Governance) ← MVP
    ↓
    ├── Phase 3 (US2: Archived Code Discoverable)
    ├── Phase 4 (US3: CI Without Governance)
    └── Phase 5 (US4: Manifest Validation Works)
            ↓
        Phase 6 (Polish)
```

### Parallel Opportunities

- T011, T012, T013 can run in parallel (different CI workflow files)
- US2, US3, US4 can all start after US1 completes (no cross-story dependencies)

---

## Parallel Example: CI Workflow Updates (User Story 3)

```bash
# Launch all CI file updates together:
Task: "Remove governance-gates job from .github/workflows/ci.yml"
Task: "Remove governance check step from .github/workflows/release.yml"
Task: "Remove edition changelog generation from .github/workflows/release.yml"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: User Story 1 (T003-T008)
3. **STOP and VALIDATE**: Run `pnpm install && pnpm build && pnpm test`
4. Commit with message: "feat: defer governance infrastructure to .archive"

### Incremental Delivery

1. Setup + US1 → Local development works (MVP!)
2. Add US2 → Documentation complete
3. Add US3 → CI/CD clean
4. Add US4 → Validation confirmed
5. Polish → All references cleaned

### Single Developer Recommended Order

Since this is a small refactoring task:
1. T001 → T002 → T003 → T004 → T005 (core changes)
2. T006 → T007 → T008 (validation)
3. T009 → T010 (documentation)
4. T011 → T012 → T013 → T014 (CI cleanup)
5. T015 → T016 (manifest validation)
6. T017 → T018 → T019 → T020 (polish)

---

## Notes

- All file moves use `git mv` to preserve history
- Verify each checkpoint before proceeding
- Commit after each phase completion
- This is a refactoring task - no new code, only moves and deletions
- Total estimated scope: ~10 files changed, 1 directory created, 1 new documentation file
