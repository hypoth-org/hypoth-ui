# Archive Directory

This directory contains deferred packages that are not part of the active workspace but are preserved for future reactivation.

## Purpose

Packages moved here are:
- **Not included** in pnpm workspace resolution
- **Not built** as part of `pnpm build`
- **Not tested** as part of `pnpm test`
- **Preserved** with full git history for future restoration

## Current Contents

| Package | Deferred Date | Reason | Reactivation Threshold |
|---------|---------------|--------|------------------------|
| `governance/` | 2026-01-05 | Premature for 17-component library | 40+ components |

## Reactivation

To reactivate a deferred package:

1. Move it back to `packages/` directory: `git mv .archive/<package> packages/<package>`
2. Follow package-specific reactivation instructions in root documentation (e.g., `GOVERNANCE.md`)
3. Run `pnpm install` to include in workspace
4. Restore any removed scripts, CI jobs, or configuration

## Conventions

- Each archived package retains its original structure
- Git history is preserved through `git mv`
- Root-level documentation (e.g., `GOVERNANCE.md`) provides reactivation details
- Archive is excluded from workspace via pnpm-workspace.yaml patterns
