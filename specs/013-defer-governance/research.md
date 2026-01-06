# Research: Defer Governance Infrastructure

**Feature**: 013-defer-governance
**Date**: 2026-01-05

## Overview

This is a straightforward infrastructure refactoring task with minimal research requirements. The spec's Approach Analysis already evaluated three alternatives and recommended the `.archive/` directory approach.

## Research Topics

### 1. Archive Directory Naming Convention

**Decision**: `.archive/` (dot-prefixed)

**Rationale**:
- Dot-prefix hides directory in default `ls` output, reducing visual noise
- Common convention in monorepos (`.github/`, `.changeset/`, `.specify/`)
- Clearly signals "not part of active development"
- Works with existing pnpm-workspace.yaml pattern (`packages/*` excludes root-level directories)

**Alternatives Considered**:
- `_archive/` - Less common, underscore prefix used more for private modules
- `archive/` - Visible in default listing, may be confused with active content
- `deferred/` - Less standard, requires explanation

### 2. GOVERNANCE.md Location

**Decision**: Repository root (`/GOVERNANCE.md`)

**Rationale**:
- Maximum visibility for contributors
- Standard location for governance documentation in open-source projects
- Discoverable via GitHub's automatic file detection
- Single source of truth for governance status

**Alternatives Considered**:
- `.archive/GOVERNANCE.md` - Hidden with archived code, less discoverable
- `docs/governance.md` - Buried in docs, may be overlooked
- `specs/013-defer-governance/GOVERNANCE.md` - Feature-specific, not persistent

### 3. CI Workflow Cleanup Strategy

**Decision**: Remove governance jobs entirely (not comment out)

**Rationale**:
- Clean configuration is easier to maintain
- GOVERNANCE.md documents what was removed and how to restore
- Commented code creates confusion about intended state
- Git history preserves the original configuration

**Alternatives Considered**:
- Comment out with `# DEFERRED:` prefix - Adds noise, unclear if intentional
- Conditional `if: false` - Hacky, may cause CI parsing issues

### 4. Changeset Config Update

**Decision**: Remove `@ds/governance` from ignore list

**Rationale**:
- Package no longer exists in workspace, ignore entry is unnecessary
- Clean configuration reduces maintenance burden
- If reactivated, can be re-added to ignore list if needed

**Alternatives Considered**:
- Leave in ignore list - Causes no harm but adds confusion about non-existent package

### 5. Files to Preserve in Archive

**Decision**: Move entire `packages/governance/` directory intact

**Rationale**:
- Preserves all source code, tests, configuration
- Preserves package.json for dependency reference
- Preserves tsconfig.json for build configuration
- Allows complete restoration with minimal effort

**Files Inventory** (to be archived):
```
packages/governance/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── types/
│   ├── deprecation/
│   ├── gates/
│   ├── changelog/
│   ├── tenant/
│   └── cli/
└── gates.json
```

## Dependencies Verified

- **No runtime dependencies** from other packages on @ds/governance (confirmed via grep)
- **@ds/docs-core** has independent manifest validation (no governance import)
- **@ds/a11y-audit** is completely separate package (no governance import)

## Conclusion

No NEEDS CLARIFICATION items. All decisions are straightforward applications of standard practices for monorepo maintenance. Ready to proceed to Phase 1.
