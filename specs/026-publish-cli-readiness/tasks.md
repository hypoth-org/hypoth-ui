# Tasks: NPM Publishing & CLI Copy-Mode Readiness

**Input**: Design documents from `/specs/026-publish-cli-readiness/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: No test tasks included (not explicitly requested in spec).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Foundational — Package Rename (@hypoth-ui/* → @hypoth-ui/*)

**Purpose**: Rename all packages from `@hypoth-ui/*` to `@hypoth-ui/*`. This is the blocking prerequisite for ALL user stories — every subsequent task depends on correct package names.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T001 Rename all 16 package.json `name` fields from `@ds/*` to `@hypoth-ui/*` per the mapping in data-model.md (12 publishable in `packages/*/package.json` + 4 private in `apps/*/package.json` and `packages/demo-shared/package.json`)
- [x] T002 Update all `dependencies`, `devDependencies`, and `peerDependencies` references from `@ds/*` to `@hypoth-ui/*` across all package.json files in the monorepo (approximately 56 dependency references)
- [x] T003 Batch find+replace all TypeScript/JavaScript import statements from `@ds/` to `@hypoth-ui/` across all source files in `packages/*/src/**/*.ts` and `apps/*/src/**/*.ts` (163+ files). Include both `from '@ds/` and `import '@ds/` patterns
- [x] T004 Update root `package.json` script filter references from `@ds/` to `@hypoth-ui/` (11 occurrences in pnpm filter patterns like `pnpm --filter @ds/wc`)
- [x] T005 Update `.changeset/config.json` fixed versioning pattern from `"fixed": [["@ds/*"]]` to `"fixed": [["@hypoth-ui/*"]]`
- [x] T006 Update `.changeset/edition-changelog.js` if it contains any `@ds/` references
- [x] T007 Update CLI template transform rules in `packages/cli/scripts/sync-templates.ts` — change all `@ds/` references in the `transformForCopyMode` function to `@hypoth-ui/`
- [x] T008 Update GitHub workflow files in `.github/workflows/` that reference `@ds/` filter patterns (e.g., `pnpm --filter @ds/wc` in `a11y-check.yml`, `ci.yml`)
- [x] T009 Update any spec or config files that reference `@ds/` package names (check `specs/*/`, `CLAUDE.md`, `.specify/memory/constitution.md` Package Architecture table)
- [x] T010 Run `pnpm install` to regenerate the lockfile with new package names, then validate with `pnpm build && pnpm test && pnpm typecheck && pnpm lint`

**Checkpoint**: All packages renamed. Workspace resolves correctly. Full test suite passes. All subsequent phases can begin.

---

## Phase 2: User Story 1 — Install Design System Packages from npm (Priority: P1) 🎯 MVP

**Goal**: All 12 publishable packages have correct metadata and are ready for npm publishing under `@hypoth-ui/*`.

**Independent Test**: Run `pnpm pack` on each publishable package and inspect the tarball for correct name, license, repository, keywords, and description fields.

### Implementation for User Story 1

- [x] T011 [P] [US1] Add `license`, `repository`, `keywords`, `description`, and `homepage` fields to `packages/react/package.json` using `@hypoth-ui/cli` package.json as reference template. Set license to "MIT", repository directory to "packages/react", include "Alpha" in description
- [x] T012 [P] [US1] Add publishing metadata to `packages/wc/package.json` (same fields as T011, directory "packages/wc")
- [x] T013 [P] [US1] Add publishing metadata to `packages/tokens/package.json` (directory "packages/tokens")
- [x] T014 [P] [US1] Add publishing metadata to `packages/css/package.json` (directory "packages/css")
- [x] T015 [P] [US1] Add publishing metadata to `packages/next/package.json` (directory "packages/next")
- [x] T016 [P] [US1] Add publishing metadata to `packages/primitives-dom/package.json` (directory "packages/primitives-dom")
- [x] T017 [P] [US1] Add publishing metadata to `packages/docs-core/package.json` (directory "packages/docs-core")
- [x] T018 [P] [US1] Add publishing metadata to `packages/docs-content/package.json` (directory "packages/docs-content")
- [x] T019 [P] [US1] Add publishing metadata to `packages/docs-renderer-next/package.json` (directory "packages/docs-renderer-next")
- [x] T020 [P] [US1] Add publishing metadata to `packages/test-utils/package.json` (directory "packages/test-utils")
- [x] T021 [P] [US1] Add publishing metadata to `packages/a11y-audit/package.json` (directory "packages/a11y-audit")
- [x] T022 [US1] Validate all 12 publishable packages against the metadata contract schema in `specs/026-publish-cli-readiness/contracts/package-metadata.json` — verify name pattern, license, repository.directory, keywords, description, homepage, exports, and files fields are all present and correct
- [x] T023 [US1] Run `pnpm pack --dry-run` on each publishable package to verify the tarball includes correct files and metadata. Verify `workspace:*` dependencies are listed in the tarball's package.json (changesets will convert these to real version ranges on publish). Confirm no `workspace:` protocol remains in packed output

**Checkpoint**: All 12 packages have correct publishing metadata. `pnpm pack` produces valid tarballs. Ready for npm publishing.

---

## Phase 3: User Story 2 — Copy Component Source into Project (Priority: P2)

**Goal**: The CLI supports a `--copy` flag for per-command override, and template sync auto-discovers all components with source files.

**Independent Test**: Run `npx @hypoth-ui/cli add button --copy` in a test project initialized with `--style package` and verify the button source files appear in the configured directory with transformed imports.

### Implementation for User Story 2

- [x] T024 [US2] Add `-c, --copy` option to the CLI `add` command definition in `packages/cli/src/index.ts` (add `.option("-c, --copy", "Copy component source files instead of installing package")` to the add command chain around line 45)
- [x] T025 [US2] Update the `AddOptions` type (or interface) in `packages/cli/src/commands/add.ts` to include `copy?: boolean`, then update the add command logic (around line 140) to check `options.copy` before `config.style` — if `options.copy` is true, force copy mode regardless of config
- [x] T026 [US2] Add error handling in `packages/cli/src/commands/add.ts` for when `--copy` is used on a component that has no template files — display a clear message listing which components currently support copy mode
- [x] T027 [US2] Rewrite `packages/cli/scripts/sync-templates.ts` to replace the hardcoded 14-component list with auto-discovery: scan `packages/react/src/components/` and `packages/wc/src/components/` for directories (sync a component if it exists in either framework, not requiring both), load `packages/cli/registry/components.json` to get registered names, sync only components that exist in source AND registry, log skipped components
- [x] T028 [US2] Run the updated sync-templates script (`pnpm --filter @hypoth-ui/cli sync:templates`) and verify templates are generated for all components with source files (should increase from 14 to ~54 components in `packages/cli/templates/`)
- [x] T029 [US2] Update `packages/cli/registry/components.json` to add a `hasTemplates` boolean field to each component entry reflecting whether template files were actually synced. Components without source files should have `hasTemplates: false`
- [x] T030 [US2] Build the CLI (`pnpm --filter @hypoth-ui/cli build`) and manually test: (1) `hypoth-ui add button --copy` in a package-mode project copies files, (2) `hypoth-ui add accordion` in a copy-mode project copies the newly synced accordion, (3) `hypoth-ui add` on a component without templates shows a clear error, (4) `hypoth-ui add dialog --copy` copies dialog AND its dependency components (overlay primitives), installing required npm packages

**Checkpoint**: CLI `--copy` flag works. Templates synced for all available components. Registry reflects template availability.

---

## Phase 4: User Story 3 — Discover and Choose an Installation Approach (Priority: P2)

**Goal**: Comprehensive README documentation with tiered package listing, dual getting-started guides, framework-specific examples, and package-level READMEs.

**Independent Test**: A developer with no prior hypoth-ui knowledge can follow the README instructions and have a working component in under 5 minutes.

### Implementation for User Story 3

- [x] T031 [US3] Write the repository `README.md` with: hero section (name, one-liner, Alpha badge), Core Packages table (react, wc, tokens, css, next, cli with install commands and descriptions), Getting Started — Package Mode (step-by-step npm install guide), Getting Started — Copy Mode (CLI init + add guide), comparison table (package vs copy trade-offs), framework quick-starts (React, Web Components, Next.js with code examples), Tooling & Documentation packages table (docs-core, docs-content, docs-renderer-next, test-utils, a11y-audit), Contributing section, License (MIT)
- [x] T032 [P] [US3] Write package-level `packages/react/README.md` with Alpha badge, `npm install @hypoth-ui/react` command, React component usage example (Button import and render), link to main README
- [x] T033 [P] [US3] Write package-level `packages/wc/README.md` with Alpha badge, install command, Web Component usage example (custom element tag), link to main README
- [x] T034 [P] [US3] Write package-level `packages/tokens/README.md` with Alpha badge, install command, CSS custom properties usage example, link to main README
- [x] T035 [P] [US3] Write package-level `packages/css/README.md` with Alpha badge, install command, CSS layer import example, link to main README
- [x] T036 [P] [US3] Write package-level `packages/next/README.md` with Alpha badge, install command, Next.js App Router integration example, link to main README
- [x] T037 [P] [US3] Write package-level `packages/primitives-dom/README.md` with Alpha badge, install command, DOM primitive usage example, link to main README
- [x] T038 [P] [US3] Write package-level READMEs for the 5 tooling packages (`packages/docs-core/README.md`, `packages/docs-content/README.md`, `packages/docs-renderer-next/README.md`, `packages/test-utils/README.md`, `packages/a11y-audit/README.md`) — each with Alpha badge, install command, brief usage note, and link to main README

**Checkpoint**: Repository README is comprehensive and actionable. All 12 packages have READMEs. A new developer can follow either getting-started path.

---

## Phase 5: User Story 4 — Automated Release Pipeline (Priority: P3)

**Goal**: Release workflow is validated end-to-end with NPM_TOKEN check, and the initial changeset is created for 0.1.0 release.

**Independent Test**: Trigger the release workflow with `dry_run: true` and verify it completes all steps without errors.

### Implementation for User Story 4

- [ ] T039 [US4] Add an NPM_TOKEN validation step to `.github/workflows/release.yml` before the build step — fail early with a clear error message if the secret is not configured (e.g., `run: test -n "$NPM_TOKEN" || (echo "Error: NPM_TOKEN secret not configured" && exit 1)`)
- [ ] T040 [US4] Update `.github/workflows/release.yml` to ensure the `publish` command references the correct package names post-rename (verify `pnpm release` still works with `@hypoth-ui/*` names)
- [ ] T041 [US4] Create the initial changeset file using `pnpm changeset` — select minor bump for all `@hypoth-ui/*` packages with summary "Initial alpha release (0.1.0)"
- [ ] T042 [US4] Verify the changeset file is valid by running `pnpm version-packages` locally (dry run) — confirm all package.json versions bump to 0.1.0, then revert the version changes (the actual version bump will happen via the release workflow)

**Checkpoint**: Release workflow has NPM_TOKEN validation. Initial changeset is ready. Dry-run confirms versions bump correctly.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all user stories

- [x] T043 Run full validation suite: `pnpm install && pnpm build && pnpm test && pnpm typecheck && pnpm lint` to confirm no regressions across the entire monorepo
- [x] T044 Run the quickstart.md verification steps from `specs/026-publish-cli-readiness/quickstart.md` — validate package rename, CLI copy-mode, release pipeline, and README rendering
- [x] T045 Update `CLAUDE.md` to reflect the new `@hypoth-ui/*` package names in commands and references (replace any remaining `@hypoth-ui/` references in the manual additions section)
- [x] T046 Commit all changes and push to the `026-publish-cli-readiness` branch

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies — start immediately. **BLOCKS all user stories**.
- **US1 — Metadata (Phase 2)**: Depends on Phase 1 completion
- **US2 — CLI Copy-Mode (Phase 3)**: Depends on Phase 1 completion. Can run in **parallel** with Phase 2.
- **US3 — Documentation (Phase 4)**: Depends on Phases 2 and 3 (needs final package names, descriptions, and CLI commands)
- **US4 — Release Pipeline (Phase 5)**: Depends on Phase 1 (needs correct package names in workflows)
- **Polish (Phase 6)**: Depends on all prior phases

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational — no dependencies on other stories
- **User Story 3 (P2)**: Depends on US1 (needs package descriptions for README) and US2 (needs CLI commands for copy-mode docs)
- **User Story 4 (P3)**: Can start after Foundational — no dependencies on other stories

### Parallel Opportunities

- **Phase 1**: T001–T009 can mostly run sequentially (same files), but T003 (source imports) and T008 (workflows) can run in parallel
- **Phase 2**: T011–T021 are all parallelizable (different package.json files)
- **Phase 3**: T024–T026 are sequential (same files), T027 is independent
- **Phase 4**: T032–T038 are all parallelizable (different README files), T031 must come first
- **Phases 2 + 3**: Can run entirely in parallel with each other after Phase 1
- **Phases 4 + 5**: US4 can run in parallel with US3 (different files)

---

## Parallel Example: User Story 1 (Metadata)

```bash
# All package metadata tasks can run in parallel (different files):
T011: Add metadata to packages/react/package.json
T012: Add metadata to packages/wc/package.json
T013: Add metadata to packages/tokens/package.json
T014: Add metadata to packages/css/package.json
T015: Add metadata to packages/next/package.json
T016: Add metadata to packages/primitives-dom/package.json
T017: Add metadata to packages/docs-core/package.json
T018: Add metadata to packages/docs-content/package.json
T019: Add metadata to packages/docs-renderer-next/package.json
T020: Add metadata to packages/test-utils/package.json
T021: Add metadata to packages/a11y-audit/package.json

# Then sequentially:
T022: Validate against contract schema
T023: Verify with pnpm pack
```

## Parallel Example: After Phase 1

```bash
# These two phases can run entirely in parallel:
# Stream A: User Story 1 (metadata) — T011–T023
# Stream B: User Story 2 (CLI copy-mode) — T024–T030

# Then once both complete:
# Stream C: User Story 3 (docs) — T031–T038
# Stream D: User Story 4 (release) — T039–T042 (can start earlier, after Phase 1)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Package Rename (foundational)
2. Complete Phase 2: Package Metadata (US1)
3. **STOP and VALIDATE**: Run `pnpm pack` on each package, inspect tarballs
4. Packages are ready for npm publishing

### Incremental Delivery

1. Phase 1 (Rename) → Foundation ready
2. Phase 2 (US1 — Metadata) → Packages publishable (MVP!)
3. Phase 3 (US2 — CLI) → Copy-mode fully functional
4. Phase 4 (US3 — Docs) → Developer onboarding ready
5. Phase 5 (US4 — Release) → Automated pipeline validated
6. Phase 6 (Polish) → Ship it

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- The package rename (Phase 1) is the highest-risk phase — run full test suite after completion
- T011–T021 use `@hypoth-ui/cli` package.json as the reference template for metadata field format
- Template sync (T027–T028) should increase coverage from 14 → ~54 components
- The initial changeset (T041) should NOT be committed to main until all other changes are ready
