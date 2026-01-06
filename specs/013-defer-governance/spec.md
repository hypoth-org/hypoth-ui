# Feature Specification: Defer Governance Infrastructure

**Feature Branch**: `013-defer-governance`
**Created**: 2026-01-05
**Status**: Draft
**Input**: User description: "Defer governance infrastructure to reduce complexity and focus on component development."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Runs Build Without Governance (Priority: P1)

A developer clones the repository and runs the standard build commands. The build completes successfully without requiring the governance package, reducing complexity and build time.

**Why this priority**: This is the core requirement - the monorepo must function without governance. All other changes depend on this working correctly.

**Independent Test**: Can be fully tested by running `pnpm install && pnpm build && pnpm test` and verifying all commands succeed without governance-related errors.

**Acceptance Scenarios**:

1. **Given** a fresh clone of the repository, **When** developer runs `pnpm install`, **Then** installation completes without errors related to @ds/governance
2. **Given** installed dependencies, **When** developer runs `pnpm build`, **Then** all active packages build successfully
3. **Given** installed dependencies, **When** developer runs `pnpm test`, **Then** all tests pass without governance-related failures

---

### User Story 2 - Contributor Finds Archived Governance Code (Priority: P2)

A future contributor needs to reactivate governance features after the component library reaches maturity (40+ components). They can locate the archived code and follow documentation to restore it.

**Why this priority**: Preserving the work is essential but secondary to removing it from the active codebase. This ensures no code is lost.

**Independent Test**: Can be verified by navigating to the archive location and confirming all governance source files exist with clear documentation.

**Acceptance Scenarios**:

1. **Given** a repository with deferred governance, **When** contributor looks for governance code, **Then** they find it in a clearly labeled archive directory
2. **Given** archived governance code, **When** contributor reads GOVERNANCE.md, **Then** they understand why it was deferred and how to reactivate it
3. **Given** GOVERNANCE.md documentation, **When** contributor follows reactivation steps, **Then** they can restore governance to the workspace

---

### User Story 3 - CI Pipeline Runs Without Governance Gates (Priority: P2)

The CI/CD pipeline runs pull request checks and release workflows without governance gates blocking or failing builds. Only essential checks (tests, linting, type checking) remain.

**Why this priority**: CI must work without governance to unblock development velocity. Equal priority to archiving since both are needed for a functional workflow.

**Independent Test**: Can be verified by creating a test PR and confirming CI passes without governance-related steps.

**Acceptance Scenarios**:

1. **Given** a pull request, **When** CI workflow runs, **Then** no governance gate checks are executed
2. **Given** a release trigger, **When** release workflow runs, **Then** no governance checks block the release
3. **Given** CI configuration files, **When** reviewing workflow definitions, **Then** no references to @ds/governance exist

---

### User Story 4 - Developer Uses Manifest Validation (Priority: P3)

A developer working on component documentation can still validate manifests using the docs-core package. The useful validation tooling is preserved even though governance is deferred.

**Why this priority**: Manifest validation is valuable for component development quality but is a supporting feature, not blocking.

**Independent Test**: Can be verified by running `pnpm validate:manifests` and confirming it works without governance dependencies.

**Acceptance Scenarios**:

1. **Given** component manifests in docs-content, **When** developer runs `pnpm validate:manifests`, **Then** validation runs successfully using @ds/docs-core
2. **Given** docs-core package, **When** checking its dependencies, **Then** it has no dependency on @ds/governance

---

### Edge Cases

- What happens if someone tries to run removed governance scripts? Error message indicates script not found, GOVERNANCE.md explains deferral
- What happens if changeset config still references governance? The ignore list entry is removed, no impact on workflow
- What happens if a11y-audit package is accidentally affected? Validation confirms it remains fully functional with no governance dependencies

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST move packages/governance directory to `.archive/governance/` without deleting any files
- **FR-002**: System MUST update pnpm-workspace.yaml to exclude `.archive/` from workspace packages (current config uses `packages/*` which already excludes it)
- **FR-003**: System MUST remove governance-related scripts from root package.json (ds-deprecate, ds-check-gates, ds-tenant-diff)
- **FR-004**: System MUST update CLAUDE.md to remove references to governance commands and tooling
- **FR-005**: System MUST remove governance-related jobs from CI workflow (.github/workflows/ci.yml)
- **FR-006**: System MUST remove governance-related steps from release workflow (.github/workflows/release.yml)
- **FR-007**: System MUST update .changeset/config.json to remove @ds/governance from ignore list
- **FR-008**: System MUST create GOVERNANCE.md at repository root documenting what was deferred and reactivation path
- **FR-009**: System MUST preserve @ds/docs-core manifest validation functionality without modification
- **FR-010**: System MUST preserve @ds/a11y-audit package functionality without modification
- **FR-011**: System MUST preserve @ds/docs-content package functionality without modification
- **FR-012**: System MUST ensure pnpm install completes without errors after changes
- **FR-013**: System MUST ensure pnpm build completes for all remaining active packages

### Key Entities

- **Governance Package**: The @ds/governance package containing deprecation registry, contribution gates, tenant diff CLI, and version management tooling - currently at packages/governance/
- **Archive Directory**: The `.archive/` directory at repository root where deferred packages are stored for future reactivation
- **Reactivation Documentation**: GOVERNANCE.md file explaining deferral rationale, contents inventory, and step-by-step restoration process

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Build Reliability**: Changes must not break existing build or test workflows for active packages
- **Code Preservation**: All governance code must be preserved intact for future reactivation
- **Documentation Clarity**: Future contributors must easily understand deferral rationale and restoration process
- **Minimal Disruption**: Changes should be surgical, affecting only governance-related configuration

### Approach A: Move to .archive Directory

Move the entire packages/governance directory to a `.archive/governance/` directory at repository root. The current pnpm-workspace.yaml uses `packages/*` pattern which automatically excludes `.archive/`.

**Pros**:
- Clean separation - archived code is clearly not part of active workspace
- Git history preserved - no files deleted, just moved
- Easy restoration - move directory back to packages/ to restore
- Follows common pattern used by other monorepos for deferred work
- No workspace config changes needed (already excluded by pattern)

**Cons**:
- Creates new top-level directory (minor organizational change)
- Archived code may drift from active codebase conventions over time

### Approach B: Git Branch Archive

Keep governance on a separate git branch (e.g., `archive/governance`) and remove from main branch entirely.

**Pros**:
- Main branch stays clean with no archive directories
- Git handles the preservation natively

**Cons**:
- Harder to discover - contributors must know to look for the branch
- Risk of branch deletion during repository maintenance
- Cannot easily reference archived code alongside current code
- Requires git expertise to restore (cherry-pick or merge from archive branch)
- Branch may become stale and unmergeable over time

### Approach C: Comment Out in Workspace

Keep packages/governance in place but add exclusion to pnpm-workspace.yaml and disable scripts.

**Pros**:
- Minimal file movement
- Easy to re-enable by removing exclusion

**Cons**:
- Confusing - package exists but doesn't work
- IDE may still index and suggest imports from governance
- TypeScript may still attempt to compile or reference it
- Not a clean separation - active and deferred code mixed together
- Developers may accidentally modify deferred code

### Recommendation

**Recommended: Approach A - Move to .archive Directory**

This approach provides the cleanest separation while preserving all code and history. The `.archive/` directory pattern is widely understood and immediately signals that contents are not part of the active codebase. Restoration is straightforward: move the directory back to `packages/` and re-add scripts.

The approach scores highest on all evaluation criteria:
- Build Reliability: Workspace config already excludes non-packages/* paths
- Code Preservation: All files preserved with git history intact
- Documentation Clarity: `.archive/` is self-documenting, plus GOVERNANCE.md provides details
- Minimal Disruption: Single directory move, script removals, CI updates

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `pnpm install` completes successfully with zero governance-related warnings or errors
- **SC-002**: `pnpm build` completes successfully for all active packages
- **SC-003**: `pnpm test` passes with 100% of existing tests succeeding
- **SC-004**: Zero references to @ds/governance exist in active workspace (verified by repository-wide search)
- **SC-005**: 100% of original governance package files exist in `.archive/governance/` directory
- **SC-006**: GOVERNANCE.md contains complete reactivation steps (minimum 5 steps covering move, scripts, CI, config)
- **SC-007**: CI workflows pass without governance-related job failures
- **SC-008**: `pnpm validate:manifests` continues to work correctly via @ds/docs-core

## Assumptions

- The governance package has no runtime dependencies from other active packages (verified: it's devDependency only)
- The @ds/docs-core package's manifest validation does not depend on @ds/governance (separate functionality)
- The @ds/a11y-audit package is completely independent of governance
- Changesets versioning workflow will continue to work without governance integration
- The 40+ components threshold for considering reactivation is a guideline, not a hard requirement
- No external consumers depend on @ds/governance being published (it was internal tooling)
