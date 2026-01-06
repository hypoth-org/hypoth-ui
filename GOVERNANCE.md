# Governance Infrastructure (Deferred)

> **Status**: Deferred
> **Archived**: 2026-01-05
> **Location**: `.archive/governance/`

## Deferral Rationale

The `@ds/governance` package has been deferred because it is **premature for a 17-component library**. Governance tooling (deprecation tracking, contribution gates, tenant diffing) provides significant value for mature design systems with:

- Large component catalogs (40+ components)
- Multiple breaking change cycles
- Diverse tenant/edition configurations
- Teams requiring formal deprecation workflows

At the current scale (17 components), the governance overhead exceeds its benefits. The package is preserved in `.archive/` for future reactivation.

## Contents Inventory

The archived `@ds/governance` package includes:

| Directory/File | Purpose |
|----------------|---------|
| `src/changelog/` | Edition-filtered changelog generation |
| `src/cli/` | CLI commands (check-gates, deprecate, tenant-diff) |
| `src/deprecation/` | Deprecation registry and migration guides |
| `src/gates/` | Contribution gate checking system |
| `src/tenant/` | Multi-tenant configuration diffing |
| `src/schemas/` | JSON schemas for validation |
| `gates.json` | Gate configuration definitions |
| `deprecations.json` | Deprecation registry data |
| `templates/` | Markdown templates for migrations |
| `tests/` | Unit tests for all modules |

## Reactivation Threshold

Consider reactivating governance infrastructure when:

- Component count reaches **40+ components**
- Multiple **breaking changes** are planned
- **Multiple tenants/editions** require configuration diffing
- Team size exceeds **5 active contributors**
- Formal **deprecation timeline communication** is needed

## Reactivation Instructions

### Step 1: Move Package Back to Workspace

```bash
git mv .archive/governance packages/governance
```

### Step 2: Add Scripts to Root package.json

Add the following to `package.json` scripts section:

```json
{
  "scripts": {
    "ds-deprecate": "pnpm --filter @ds/governance deprecate",
    "ds-check-gates": "pnpm --filter @ds/governance check-gates",
    "ds-tenant-diff": "pnpm --filter @ds/governance tenant-diff"
  }
}
```

### Step 3: Update Changeset Configuration

Add `@ds/governance` to the ignore array in `.changeset/config.json`:

```json
{
  "ignore": ["@ds/governance"]
}
```

### Step 4: Restore CI Workflow Jobs

Reference git history (commit before deferral) for original CI configuration:

**`.github/workflows/ci.yml`**:
- Add `governance-gates` job that runs gate checks

**`.github/workflows/release.yml`**:
- Add governance check step before publishing
- Add edition changelog generation step

### Step 5: Update CLAUDE.md

Add governance commands to the Commands section:

```markdown
## Governance Commands
pnpm ds-deprecate -- <component>      # Initiate deprecation workflow
pnpm ds-check-gates                   # Verify contribution gates
pnpm ds-tenant-diff -- <tenant>       # Compare tenant configurations
```

### Step 6: Validate Installation

```bash
pnpm install
pnpm build
pnpm test
pnpm ds-check-gates  # Should report gate status
```

### Step 7: Remove This File

Once governance is fully reactivated, delete `GOVERNANCE.md` from the repository root.

## Related Documentation

- Archive directory: `.archive/README.md`
- Feature specification: `specs/013-defer-governance/`
- Original implementation: `specs/012-governance-adoption/`
