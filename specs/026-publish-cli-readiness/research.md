# Research: NPM Publishing & CLI Copy-Mode Readiness

**Date**: 2026-03-03 | **Branch**: `026-publish-cli-readiness`

## R1: Package Rename Strategy (@hypoth-ui/* → @hypoth-ui/*)

**Decision**: Full rename of all package.json `name` fields from `@hypoth-ui/*` to `@hypoth-ui/*`. No dual-name strategy.

**Rationale**: pnpm workspace resolution is name-based — `workspace:*` dependencies must match the actual package.json `name`. Changesets' `fixed` pattern also matches real names. TypeScript module resolution expects imports to match package names. A dual-name approach would require custom build scripts, break workspace integrity, and create parallel version histories.

**Alternatives considered**:
- Dual-name (internal @ds, published @hypoth-ui): Not feasible — pnpm, changesets, and TypeScript all resolve by actual package name.
- publishConfig override: Cannot change the published name, only registry/access settings.
- Keep @ds scope: Risk of scope unavailability on npm; no brand attribution.

**Scope of rename**:
- 16 package.json `name` fields (12 publishable + 4 private)
- 163+ source files with `@hypoth-ui/` imports → `@hypoth-ui/` imports
- 52+ CLI template files with transform references
- Root package.json (11 script filter references)
- `.changeset/config.json` fixed pattern
- GitHub workflows (minimal — mostly use pnpm filters)
- No tsconfig path aliases to update (pure package resolution)
- pnpm-workspace.yaml unchanged (discovers by location, not name)

## R2: CLI --copy Flag Implementation

**Decision**: Add `-c, --copy` option to the `add` command that overrides `config.style` for a single invocation.

**Rationale**: The CLAUDE.md documents `hypoth-ui add button --copy` but the flag doesn't exist. The infrastructure (copyComponentFiles, import transformation) is fully implemented — only the CLI option parsing and style override logic are missing.

**Implementation location**:
- `packages/cli/src/index.ts` lines 41-50: Add `.option("-c, --copy", "Copy source files instead of installing package")`
- `packages/cli/src/commands/add.ts` lines 140-185: Check `options.copy` before checking `config.style`

**Alternatives considered**:
- Per-component config override: Over-engineered for this use case.
- Separate `copy` subcommand: Fragments the API; `--copy` flag is simpler.

## R3: Auto-Discovery Template Sync

**Decision**: Replace the hardcoded 14-component list in `sync-templates.ts` with automatic directory scanning filtered against the registry.

**Rationale**: 54 components exist in source (58 React dirs, 54 WC dirs) but only 14 are synced. Manual list maintenance doesn't scale. Auto-discovery + registry filtering ensures only registered components get templates.

**Current state**:
- Hardcoded list: button, input, textarea, checkbox, dialog, menu, popover, tooltip, select, field, icon, link, spinner, text
- React source: 58 component directories in `packages/react/src/components/`
- WC source: 54 component directories in `packages/wc/src/components/`
- Registry: 56 components defined in `packages/cli/registry/components.json`
- Gap: 40 components with source but no templates

**Implementation approach**:
1. Scan `packages/react/src/components/` and `packages/wc/src/components/` for directories
2. Load registry and extract registered component names
3. Sync only directories that exist in both source AND registry
4. Log skipped directories (source exists but not in registry)
5. Update registry `files` arrays to reflect actually synced files

**Alternatives considered**:
- Expand hardcoded list to all 54: Works but requires manual updates for each new component.
- Registry-only (no source scan): Would fail silently for components with registry entries but no source.

## R4: Changesets & Release Pipeline

**Decision**: Update changesets config to use `@hypoth-ui/*` pattern, add NPM_TOKEN validation step to release workflow.

**Rationale**: The release workflow already works end-to-end via `changesets/action@v1`. Only config updates are needed post-rename. Adding an early token validation prevents wasted CI time.

**Current release flow**:
1. Manual trigger via `workflow_dispatch`
2. Build all packages → Run tests → `changesets/action` creates version PR or publishes
3. `pnpm release` = `pnpm build && changeset publish`

**Changes needed**:
- `.changeset/config.json`: Update `"fixed": [["@hypoth-ui/*"]]` → `"fixed": [["@hypoth-ui/*"]]`
- `.github/workflows/release.yml`: Add NPM_TOKEN validation step before build
- Root `package.json`: Update all `pnpm --filter @hypoth-ui/*` script references

## R5: Documentation Structure

**Decision**: Write a comprehensive repository README with tiered package listing, dual getting-started guides, and framework-specific examples. Each publishable package gets a minimal package-level README.

**Rationale**: The README is the primary adoption touchpoint. Tiered presentation (Core vs Tooling) prevents overwhelming new developers while keeping everything discoverable. Alpha badge sets correct expectations.

**README sections planned**:
1. Hero: Name, one-liner, Alpha badge
2. Core Packages table (6): react, wc, tokens, css, next, cli
3. Getting Started — Package Mode (npm install steps)
4. Getting Started — Copy Mode (CLI init + add steps)
5. Comparison table: Package vs Copy mode trade-offs
6. Framework quick-starts: React, Web Components, Next.js
7. Tooling & Documentation packages table (5)
8. Contributing, License

**Package-level README template**:
1. Package name + Alpha badge
2. Install command
3. Basic usage example (framework-specific)
4. Link to main README and docs site
