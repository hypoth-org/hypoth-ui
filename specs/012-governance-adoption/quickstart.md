# Quickstart: Governance Implementation

**Feature**: 012-governance-adoption
**Date**: 2026-01-04

## Prerequisites

- Node.js 20+
- pnpm 10+
- Existing hypoth-ui monorepo setup

## Phase 1: Changesets Setup (Day 1)

### 1.1 Install Changesets

```bash
pnpm add -Dw @changesets/cli @changesets/changelog-github
pnpm changeset init
```

### 1.2 Configure Fixed Versioning

Create `.changeset/config.json`:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": ["@changesets/changelog-github", { "repo": "org/hypoth-ui" }],
  "commit": false,
  "fixed": [["@ds/*"]],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### 1.3 Add Edition-Aware Changeset Template

Create `.changeset/README.md`:

```markdown
# Changesets

This folder contains changeset files for pending releases.

## Creating a Changeset

Run `pnpm changeset` and follow the prompts.

**Required fields in changeset frontmatter:**
- `editions`: Array of affected editions (`core`, `pro`, `enterprise`)
- `security`: Boolean if security-related (default: false)
```

## Phase 2: Deprecation Registry (Day 1-2)

### 2.1 Create Governance Package

```bash
mkdir -p packages/governance/src/{deprecation,changelog,cli}
mkdir -p packages/governance/templates
```

### 2.2 Initialize Package

Create `packages/governance/package.json`:

```json
{
  "name": "@ds/governance",
  "version": "0.0.0",
  "type": "module",
  "description": "Governance tooling for the design system",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts",
    "deprecate": "tsx src/cli/deprecate.ts",
    "check-gates": "tsx src/cli/check-gates.ts"
  },
  "devDependencies": {
    "ajv": "^8.12.0",
    "commander": "^12.0.0",
    "tsup": "^8.0.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.0"
  }
}
```

### 2.3 Create Initial Deprecation Registry

Create `packages/governance/deprecations.json`:

```json
{
  "version": "1.0.0",
  "deprecations": []
}
```

## Phase 3: Contribution Gates (Day 2-3)

### 3.1 Create Gates Configuration

Create `packages/governance/gates.json`:

```json
{
  "version": "1.0.0",
  "gates": [
    {
      "id": "test-coverage",
      "name": "Test Coverage",
      "type": "automated",
      "threshold": 80,
      "required": true,
      "description": "Minimum 80% test coverage for new code",
      "remediation": "Add unit tests to cover uncovered code paths",
      "ci_command": "pnpm test:coverage"
    },
    {
      "id": "accessibility",
      "name": "Accessibility Tests",
      "type": "automated",
      "required": true,
      "description": "All components must pass axe-core accessibility tests",
      "remediation": "Fix accessibility violations reported by axe-core",
      "ci_command": "pnpm test:a11y"
    },
    {
      "id": "manifest-validation",
      "name": "Manifest Schema Validation",
      "type": "automated",
      "required": true,
      "description": "Component manifest must be valid JSON matching schema",
      "remediation": "Fix manifest errors reported by validation",
      "ci_command": "pnpm validate:manifests"
    },
    {
      "id": "docs-presence",
      "name": "Documentation Presence",
      "type": "automated",
      "required": true,
      "description": "Component must have MDX documentation file",
      "remediation": "Add component documentation to packages/docs-content",
      "ci_command": "pnpm validate:docs"
    },
    {
      "id": "design-review",
      "name": "Design Review",
      "type": "manual",
      "required": true,
      "applies_to": ["packages/wc/src/components/**/*"],
      "description": "New components require design team approval",
      "remediation": "Request design review in PR comments",
      "checklist_url": "https://example.com/design-review-checklist"
    },
    {
      "id": "a11y-audit",
      "name": "Accessibility Audit",
      "type": "manual",
      "required": true,
      "applies_to": ["packages/wc/src/components/**/*"],
      "description": "New components require manual accessibility audit",
      "remediation": "Complete manual a11y audit checklist",
      "checklist_url": "https://example.com/a11y-audit-checklist"
    }
  ]
}
```

### 3.2 Create GitHub Actions Workflow

Create `.github/workflows/contribution-gates.yml`:

```yaml
name: Contribution Gates

on:
  pull_request:
    branches: [main]

jobs:
  automated-gates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Test Coverage
        run: pnpm test:coverage

      - name: Accessibility Tests
        run: pnpm test:a11y

      - name: Manifest Validation
        run: pnpm validate:manifests

      - name: Documentation Check
        run: pnpm validate:docs

      - name: Changeset Check
        run: pnpm changeset status
```

## Phase 4: Documentation (Day 3-4)

### 4.1 Create Governance Docs Structure

```bash
mkdir -p packages/docs-content/governance/migration
```

### 4.2 Create Quick Start Guide

Create `packages/docs-content/governance/quick-start.mdx`:

```mdx
---
title: Quick Start Guide
description: Get started with the design system in 30 minutes
category: governance
order: 1
editions: [core, pro, enterprise]
---

# Quick Start Guide

Get the design system running in your project in under 30 minutes.

## Step 1: Install Packages

\`\`\`bash
pnpm add @ds/tokens @ds/css @ds/wc
\`\`\`

## Step 2: Import Styles

\`\`\`css
/* Import in your global CSS */
@import '@ds/css';
\`\`\`

## Step 3: Register Components

\`\`\`typescript
// In your app entry point
import '@ds/wc/auto-define';
\`\`\`

## Step 4: Use Components

\`\`\`html
<ds-button variant="primary">Click me</ds-button>
\`\`\`

## Next Steps

- [Theming Guide](/governance/theming)
- [Component Reference](/components)
- [Framework Guides](/governance/frameworks)
```

### 4.3 Create Root CONTRIBUTING.md

Create `CONTRIBUTING.md` at repository root:

```markdown
# Contributing to Hypoth UI

Thank you for contributing to the design system!

## Getting Started

1. Fork and clone the repository
2. Run `pnpm install`
3. Run `pnpm build`
4. Run `pnpm test`

## Creating a Changeset

Every PR that changes packages must include a changeset:

\`\`\`bash
pnpm changeset
\`\`\`

## Quality Gates

Your PR must pass these gates:

- [ ] Test coverage >= 80%
- [ ] Accessibility tests pass
- [ ] Manifest validation passes
- [ ] Documentation present

For new components, you also need:

- [ ] Design review approval
- [ ] Manual accessibility audit

## Commit Message Format

We use conventional commits:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
```

## Phase 5: PR Template (Day 4)

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description

<!-- Describe your changes -->

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist

- [ ] I have added a changeset (`pnpm changeset`)
- [ ] Tests pass locally (`pnpm test`)
- [ ] Accessibility tests pass (`pnpm test:a11y`)
- [ ] Documentation is updated

### For New Components

- [ ] Design review requested
- [ ] Manual a11y audit completed
- [ ] Component manifest added
- [ ] MDX documentation added

## Breaking Changes

<!-- If breaking, describe migration path -->

## Screenshots

<!-- If UI changes, add screenshots -->
```

## Verification Checklist

After completing all phases:

- [ ] `pnpm changeset init` runs without errors
- [ ] `.changeset/config.json` has fixed versioning for `@ds/*`
- [ ] `packages/governance` builds successfully
- [ ] GitHub Actions workflow runs on PRs
- [ ] `CONTRIBUTING.md` is accessible at repo root
- [ ] PR template appears when creating new PRs
- [ ] Quick start guide renders in docs site

## Next Steps

1. Run `/speckit.tasks` to generate implementation tasks
2. Implement deprecation registry CLI
3. Add edition-filtered changelog generation
4. Create framework-specific adoption guides
