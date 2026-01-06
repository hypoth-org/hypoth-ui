# Quickstart: Defer Governance Infrastructure

**Feature**: 013-defer-governance
**Date**: 2026-01-05

## What This Feature Does

Moves the `@ds/governance` package from active workspace to `.archive/` directory, removing governance tooling from the build pipeline while preserving all code for future reactivation.

## Implementation Summary

### Step 1: Archive the Package

```bash
# Create archive directory and move governance package
mkdir -p .archive
git mv packages/governance .archive/governance
```

### Step 2: Update Root package.json

Remove these scripts:
```json
{
  "scripts": {
    "ds-deprecate": "...",      // REMOVE
    "ds-check-gates": "...",    // REMOVE
    "ds-tenant-diff": "..."     // REMOVE
  }
}
```

### Step 3: Update .changeset/config.json

Remove `@ds/governance` from the ignore array.

### Step 4: Update CI Workflows

**`.github/workflows/ci.yml`**: Remove governance build job and check-gates references.

**`.github/workflows/release.yml`**: Remove governance gate steps and changelog generation.

### Step 5: Update CLAUDE.md

Remove governance-related commands from the documentation.

### Step 6: Create GOVERNANCE.md

Create root-level documentation explaining:
- What was deferred
- Why it was deferred
- When to consider reactivation (40+ components)
- Step-by-step reactivation instructions

## Reactivation Guide (Future Reference)

When the component library reaches maturity (40+ components), governance can be reactivated:

### Reactivation Steps

1. **Move package back**:
   ```bash
   git mv .archive/governance packages/governance
   ```

2. **Add scripts to package.json**:
   ```json
   {
     "scripts": {
       "ds-deprecate": "pnpm --filter @ds/governance deprecate",
       "ds-check-gates": "pnpm --filter @ds/governance check-gates",
       "ds-tenant-diff": "pnpm --filter @ds/governance tenant-diff"
     }
   }
   ```

3. **Add to .changeset/config.json ignore list**:
   ```json
   {
     "ignore": ["@ds/governance"]
   }
   ```

4. **Restore CI workflow jobs** (reference git history for original configuration)

5. **Update CLAUDE.md** with governance commands

6. **Run validation**:
   ```bash
   pnpm install
   pnpm build
   pnpm test
   ```

## Verification Checklist

After implementation:

- [ ] `pnpm install` succeeds
- [ ] `pnpm build` succeeds for all active packages
- [ ] `pnpm test` passes
- [ ] `grep -r "@ds/governance" packages/` returns no results
- [ ] `.archive/governance/` contains all original files
- [ ] `GOVERNANCE.md` exists at repository root
- [ ] CI workflows pass

## Files Changed

| File | Change Type |
|------|-------------|
| `packages/governance/` | Moved to `.archive/governance/` |
| `package.json` | Modified (scripts removed) |
| `.changeset/config.json` | Modified (ignore entry removed) |
| `.github/workflows/ci.yml` | Modified (jobs removed) |
| `.github/workflows/release.yml` | Modified (steps removed) |
| `CLAUDE.md` | Modified (commands removed) |
| `GOVERNANCE.md` | Created |
