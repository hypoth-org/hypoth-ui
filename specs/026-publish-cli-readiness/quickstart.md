# Quickstart: NPM Publishing & CLI Copy-Mode Readiness

## Local Development Setup

```bash
# Ensure you're on the feature branch
git checkout 026-publish-cli-readiness

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests to verify baseline
pnpm test
pnpm lint
pnpm typecheck
```

## Verification Steps

### 1. Package Rename Verification

After renaming packages from `@hypoth-ui/*` to `@hypoth-ui/*`:

```bash
# Verify workspace resolution
pnpm install

# Verify all packages build
pnpm build

# Verify all tests pass
pnpm test

# Verify TypeScript resolution
pnpm typecheck

# Verify lint passes (import paths updated)
pnpm lint
```

### 2. CLI Copy-Mode Verification

```bash
# Build the CLI
pnpm --filter @hypoth-ui/cli build

# Sync templates (should auto-discover all components)
pnpm --filter @hypoth-ui/cli sync:templates

# Test in a temp project
mkdir /tmp/test-hypoth-ui && cd /tmp/test-hypoth-ui
npm init -y
npx @hypoth-ui/cli init --style copy --framework react
npx @hypoth-ui/cli add button --copy
# Verify: src/components/ui/button/ exists with transformed imports

# Test --copy flag override
npx @hypoth-ui/cli init --style package --framework react
npx @hypoth-ui/cli add button --copy
# Verify: still copies despite package mode config
```

### 3. Release Pipeline Verification

```bash
# Create a test changeset
pnpm changeset
# Select: minor, all @hypoth-ui/* packages, "Initial alpha release"

# Dry-run version bump
pnpm version-packages
# Verify: all package.json versions updated to 0.1.0

# Dry-run release workflow (from GitHub Actions UI)
# Trigger with dry_run: true
```

### 4. README Verification

```bash
# Preview README rendering
# Open README.md in a markdown previewer and verify:
# - Alpha badge renders
# - Core Packages table is complete
# - Getting Started sections have working commands
# - Framework examples are syntactically correct
# - Package links resolve to correct npm URLs
```

## Key Files to Watch

| File | Purpose |
|------|---------|
| `packages/*/package.json` | Package names and metadata |
| `.changeset/config.json` | Fixed versioning pattern |
| `packages/cli/scripts/sync-templates.ts` | Template auto-discovery |
| `packages/cli/src/index.ts` | CLI option definitions |
| `packages/cli/src/commands/add.ts` | Copy mode logic |
| `packages/cli/registry/components.json` | Component registry |
| `.github/workflows/release.yml` | Release pipeline |
| `README.md` | Repository documentation |
