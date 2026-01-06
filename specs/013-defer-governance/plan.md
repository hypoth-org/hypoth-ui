# Implementation Plan: Defer Governance Infrastructure

**Branch**: `013-defer-governance` | **Date**: 2026-01-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/013-defer-governance/spec.md`

## Summary

This feature defers the governance infrastructure (@ds/governance package) to reduce monorepo complexity and focus development effort on component expansion. The governance package (deprecation registry, contribution gates, tenant diff CLI) is moved to an archive directory, removed from the active workspace, and documented for future reactivation when the component library reaches maturity (40+ components).

**Technical Approach**: Move packages/governance to .archive/governance/, remove governance-related scripts and CI jobs, create GOVERNANCE.md with reactivation instructions.

## Technical Context

**Language/Version**: TypeScript 5.3+ (existing monorepo standard)
**Primary Dependencies**: None added; removing @ds/governance from active workspace
**Storage**: N/A (file moves only)
**Testing**: Existing pnpm test suite validates no regressions
**Target Platform**: Node.js development environment (pnpm workspace)
**Project Type**: Monorepo infrastructure refactoring
**Performance Goals**: N/A (no runtime impact)
**Constraints**: Must preserve all governance code intact for future restoration
**Scale/Scope**: Single package removal affecting ~10 configuration files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: No runtime impact - governance was devDependency only
- [x] **Accessibility**: No impact - a11y-audit package explicitly preserved (FR-010)
- [x] **Customizability**: No impact - token and styling packages unaffected
- [x] **Zero-dep Core**: Improves compliance - removing a package from workspace reduces complexity
- [x] **Web Components**: No impact - @ds/wc package unaffected
- [x] **Dependency Management**: Compliant - using pnpm workspace; governance was already in ignore list

**Assessment**: This feature improves constitution compliance by reducing workspace complexity. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/013-defer-governance/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output (minimal - straightforward refactor)
├── quickstart.md        # Phase 1 output (reactivation guide reference)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code Changes (repository root)

```text
# Files to MOVE
packages/governance/           → .archive/governance/

# Files to CREATE
.archive/                      # New archive directory
GOVERNANCE.md                  # Reactivation documentation

# Files to MODIFY
package.json                   # Remove governance scripts (lines 34-36)
.changeset/config.json         # Remove @ds/governance from ignore list
.github/workflows/ci.yml       # Remove governance build/check jobs
.github/workflows/release.yml  # Remove governance gate steps
CLAUDE.md                      # Remove governance commands section
```

**Structure Decision**: This is an infrastructure refactoring task affecting repository configuration rather than application source code. No new source directories are created; the `.archive/` directory serves as a holding location for deferred packages.

## Complexity Tracking

No constitution violations. This feature reduces complexity by removing a premature package from the active workspace.

| Change | Justification |
|--------|---------------|
| New `.archive/` directory | Standard pattern for deferred work; self-documenting location |
| GOVERNANCE.md at root | Visibility for future contributors; explains deferral and restoration |
