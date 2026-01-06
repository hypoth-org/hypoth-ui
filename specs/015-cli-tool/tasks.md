# Tasks: CLI Tool for Component Installation

**Input**: Design documents from `/specs/015-cli-tool/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Unit tests included for core utilities. Integration tests deferred to quickstart validation.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, etc.)
- Include exact file paths in descriptions

## Path Conventions

- **CLI Package**: `packages/cli/src/`, `packages/cli/tests/`
- **Registry**: `packages/cli/registry/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and CLI package structure

- [x] T001 Create `packages/cli/` directory structure per plan.md
- [x] T002 Initialize `packages/cli/package.json` with @hypoth-ui/cli name, bin entry, and dependencies (commander, @clack/prompts, picocolors, execa, gray-matter)
- [x] T003 [P] Create `packages/cli/tsconfig.json` extending root config with ES2022 target
- [x] T004 [P] Create shared types in `packages/cli/src/types/index.ts` (DSConfig, ComponentRegistry, DetectionResult interfaces from data-model.md)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities that ALL commands depend on

**⚠️ CRITICAL**: No command implementation can begin until this phase is complete

- [x] T005 Implement framework detection in `packages/cli/src/utils/detect.ts` (detect framework from package.json deps, PM from lock files, TS from tsconfig)
- [x] T006 [P] Implement config management in `packages/cli/src/utils/config.ts` (read/write/validate ds.config.json)
- [x] T007 [P] Implement registry utilities in `packages/cli/src/utils/registry.ts` (load bundled registry, fetch remote, resolve dependencies)
- [x] T008 [P] Implement package installation helpers in `packages/cli/src/utils/install.ts` (run npm/pnpm/yarn/bun add with execa)
- [x] T009 [P] Implement file copy utilities in `packages/cli/src/utils/copy.ts` (copy component files with fs.promises.cp, transform imports)
- [x] T010 [P] Create initial component registry in `packages/cli/registry/components.json` with button, dialog, menu components
- [x] T011 Create CLI entry point in `packages/cli/src/index.ts` with Commander.js program setup and subcommand registration
- [x] T012 [P] Unit test for detect.ts in `packages/cli/tests/unit/detect.test.ts`
- [x] T013 [P] Unit test for config.ts in `packages/cli/tests/unit/config.test.ts`
- [x] T014 [P] Unit test for registry.ts in `packages/cli/tests/unit/registry.test.ts`

**Checkpoint**: Foundation ready - command implementation can now begin

---

## Phase 3: User Story 1 - Initialize Project (Priority: P1) 🎯 MVP

**Goal**: Developer can run `npx @hypoth-ui/cli init` to set up hypoth-ui in their project

**Independent Test**: Run `init` in fresh Next.js project, verify ds.config.json created and @hypoth-ui/tokens installed

### Implementation for User Story 1

- [x] T015 [US1] Implement init command in `packages/cli/src/commands/init.ts`:
  - Detect framework, package manager, TypeScript using detect.ts
  - Prompt user for style preference (copy/package) using @clack/prompts
  - Prompt for component and utils paths
  - Create ds.config.json using config.ts
  - Install @hypoth-ui/tokens using install.ts
  - Display success message with next steps
- [x] T016 [US1] Handle re-init scenario in init.ts: warn if ds.config.json exists, offer reset/update options
- [x] T017 [US1] Add init command to CLI entry point in `packages/cli/src/index.ts`
- [x] T018 [US1] Add error handling for missing package.json in init.ts

**Checkpoint**: `npx @hypoth-ui/cli init` works in Next.js/React projects

---

## Phase 4: User Story 2 - Add Single Component (Priority: P1) 🎯 MVP

**Goal**: Developer can run `npx @hypoth-ui/cli add button` to install a component

**Independent Test**: After init, run `add button`, verify component available (package installed or files copied)

### Implementation for User Story 2

- [x] T019 [US2] Implement add command in `packages/cli/src/commands/add.ts`:
  - Load ds.config.json using config.ts
  - Validate component name exists in registry
  - Resolve component dependencies using registry.ts
  - Check for existing components (warn without --overwrite)
  - For package mode: install npm packages using install.ts
  - For copy mode: copy files using copy.ts
  - Update ds.config.json with installed component
  - Display success message
- [x] T020 [US2] Implement --overwrite flag handling in add.ts
- [x] T021 [US2] Implement framework compatibility check in add.ts (validate component supports user's framework)
- [x] T022 [US2] Add add command to CLI entry point in `packages/cli/src/index.ts`
- [x] T023 [US2] Add spinners and progress feedback using @clack/prompts in add.ts

**Checkpoint**: `npx @hypoth-ui/cli add button` works in both copy and package modes

---

## Phase 5: User Story 3 - Add Multiple Components (Priority: P2)

**Goal**: Developer can run `npx @hypoth-ui/cli add button dialog menu` to install multiple components

**Independent Test**: Run `add button dialog menu`, verify all three installed with deduplicated dependencies

### Implementation for User Story 3

- [x] T024 [US3] Extend add command to accept multiple component arguments in `packages/cli/src/commands/add.ts`
- [x] T025 [US3] Implement dependency deduplication when adding multiple components in add.ts
- [x] T026 [US3] Implement skip-existing behavior: warn and continue with uninstalled components
- [x] T027 [US3] Implement --all flag to add all components from registry in add.ts
- [x] T028 [US3] Add summary output showing what was installed/skipped in add.ts

**Checkpoint**: Multiple component installation works with proper deduplication

---

## Phase 6: User Story 4 - List Available Components (Priority: P2)

**Goal**: Developer can run `npx @hypoth-ui/cli list` to see available components

**Independent Test**: Run `list` without init, verify component list displays; run after init with installed components, verify checkmarks

### Implementation for User Story 4

- [x] T029 [US4] Implement list command in `packages/cli/src/commands/list.ts`:
  - Load bundled registry (works without init)
  - If ds.config.json exists, mark installed components
  - Display formatted table with name, description, status, installed indicator
  - Use picocolors for formatting
- [x] T030 [US4] Add list command to CLI entry point in `packages/cli/src/index.ts`

**Checkpoint**: `npx @hypoth-ui/cli list` works with or without initialization

---

## Phase 7: User Story 5 - Check for Updates (Priority: P3)

**Goal**: Developer can run `npx @hypoth-ui/cli diff` to see available updates

**Independent Test**: Manually modify installed component version in config, run `diff`, verify update shown

### Implementation for User Story 5

- [x] T031 [US5] Implement diff command in `packages/cli/src/commands/diff.ts`:
  - Load ds.config.json (error if not initialized)
  - Load registry (attempt remote fetch, fall back to bundled)
  - Compare installed versions with registry versions
  - Display table with component, current version, available version
  - Show "all up to date" if no updates available
- [x] T032 [US5] Add diff command to CLI entry point in `packages/cli/src/index.ts`

**Checkpoint**: `npx @hypoth-ui/cli diff` correctly identifies available updates

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple commands

- [x] T033 [P] Add --help text with examples to all commands in `packages/cli/src/commands/*.ts`
- [x] T034 [P] Add --version flag support in `packages/cli/src/index.ts`
- [x] T035 [P] Implement retry logic (3 attempts) for network operations in `packages/cli/src/utils/install.ts`
- [x] T036 Add consistent error message formatting across all commands using picocolors
- [x] T037 [P] Add README.md for CLI package in `packages/cli/README.md`
- [ ] T038 Run quickstart.md validation: test init → add button → verify working component
- [x] T039 Build CLI package and verify npx execution works

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all commands
- **User Story 1-5 (Phase 3-7)**: Depend on Foundational phase completion
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (init)**: Standalone - no dependencies on other stories
- **US2 (add single)**: Requires US1 (init) to exist conceptually, but can be developed in parallel
- **US3 (add multiple)**: Builds on US2 - same file, extends functionality
- **US4 (list)**: Standalone - works without init
- **US5 (diff)**: Requires US1 (reads config) but can be developed in parallel

### Within Each Phase

- Utilities (detect, config, registry, install, copy) can be built in parallel
- Tests can be written alongside or after implementation
- Commands depend on foundational utilities being complete

### Parallel Opportunities

Within Phase 2 (Foundational):
```
T005 detect.ts
T006 config.ts      [P] - parallel with T005, T007, T008, T009, T010
T007 registry.ts    [P]
T008 install.ts     [P]
T009 copy.ts        [P]
T010 registry JSON  [P]
T012-T014 tests     [P] - can start once corresponding utility is done
```

User Story Development:
```
US1 (init) and US4 (list) can be developed in parallel
US2 (add) depends on foundational but parallels US1
US3 (add multiple) sequentially follows US2 (same file)
US5 (diff) can parallel US3 and US4
```

---

## Parallel Example: Foundational Utilities

```bash
# Launch these in parallel after Setup is complete:
Task: "Implement framework detection in packages/cli/src/utils/detect.ts"
Task: "Implement config management in packages/cli/src/utils/config.ts"
Task: "Implement registry utilities in packages/cli/src/utils/registry.ts"
Task: "Implement package installation helpers in packages/cli/src/utils/install.ts"
Task: "Implement file copy utilities in packages/cli/src/utils/copy.ts"
Task: "Create initial component registry in packages/cli/registry/components.json"
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T014)
3. Complete Phase 3: User Story 1 - init (T015-T018)
4. Complete Phase 4: User Story 2 - add single (T019-T023)
5. **STOP and VALIDATE**: Test `init` + `add button` in fresh project
6. This is a shippable MVP!

### Incremental Delivery

1. MVP (US1 + US2) → Developer can init and add components
2. Add US3 (multiple) → Productivity improvement
3. Add US4 (list) → Discovery feature
4. Add US5 (diff) → Maintenance feature
5. Each addition is independently valuable

---

## Summary

| Phase | Task Count | Purpose |
|-------|------------|---------|
| Setup | 4 | Package structure |
| Foundational | 10 | Core utilities + tests |
| US1 (init) | 4 | Initialize project |
| US2 (add single) | 5 | Add one component |
| US3 (add multiple) | 5 | Add multiple/all |
| US4 (list) | 2 | List components |
| US5 (diff) | 2 | Check updates |
| Polish | 7 | Documentation, validation |
| **Total** | **39** | |

### MVP Scope

- **Phase 1-4**: 23 tasks
- Delivers: `init` and `add <component>` commands
- Time estimate: Developer discretion (no time estimates per guidelines)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Commit after each task or logical group
- Test utilities with unit tests before command implementation
- Validate with quickstart.md scenarios at each checkpoint
