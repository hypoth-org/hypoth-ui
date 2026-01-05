# Data Model: Governance Entities

**Feature**: 012-governance-adoption
**Date**: 2026-01-04

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│   Changeset     │       │   Deprecation   │
│   Entry         │       │   Record        │
├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │
│ packages[]      │       │ type            │
│ type            │       │ name            │
│ editions[]      │       │ deprecated_in   │
│ security        │       │ removal_target  │
│ summary         │       │ replacement     │
└────────┬────────┘       │ migration_guide │
         │                │ reason          │
         ▼                └────────┬────────┘
┌─────────────────┐                │
│   Changelog     │◄───────────────┘
│   Release       │
├─────────────────┤       ┌─────────────────┐
│ version         │       │   Contribution  │
│ date            │       │   Gate          │
│ breaking[]      │       ├─────────────────┤
│ features[]      │       │ id              │
│ fixes[]         │       │ name            │
│ deprecations[]  │       │ type            │
│ security[]      │       │ threshold       │
└─────────────────┘       │ required        │
                          │ automated       │
                          └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│   Migration     │       │   Tenant        │
│   Guide         │       │   Update        │
├─────────────────┤       ├─────────────────┤
│ id              │       │ tenant_id       │
│ from_version    │       │ current_version │
│ to_version      │       │ target_version  │
│ breaking_changes│       │ changes[]       │
│ steps[]         │       │ conflicts[]     │
│ codemods[]      │       │ security_alerts │
└─────────────────┘       └─────────────────┘
```

## Entity Definitions

### 1. Changeset Entry

Represents a single change to be included in a future release.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Auto-generated unique ID (e.g., `happy-dog-123`) |
| packages | string[] | Yes | Affected packages (e.g., `["@ds/wc", "@ds/react"]`) |
| type | enum | Yes | `major` \| `minor` \| `patch` |
| editions | string[] | Yes | Affected editions: `core`, `pro`, `enterprise` |
| security | boolean | No | True if security-related change (default: false) |
| summary | string | Yes | Human-readable change description (markdown) |

**Validation Rules**:
- `packages` must reference valid @ds/* packages
- `editions` must contain at least one valid edition
- `summary` must be non-empty, max 500 characters

**State Transitions**:
- Created → Pending (in `.changeset/` directory)
- Pending → Consumed (merged into version PR)
- Consumed → Released (published to npm)

### 2. Deprecation Record

Tracks deprecated features with sunset timeline.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique deprecation ID (kebab-case) |
| type | enum | Yes | `component` \| `api` \| `token` \| `prop` \| `event` |
| name | string | Yes | Identifier of deprecated item (e.g., `ds-old-button`) |
| deprecated_in | semver | Yes | Version when deprecation was announced |
| removal_target | semver | Yes | Target version for removal (current + 2 major) |
| replacement | string | No | Replacement item identifier (if applicable) |
| migration_guide | string | No | URL path to migration guide |
| reason | string | Yes | Brief explanation for deprecation |
| editions | string[] | Yes | Affected editions |

**Validation Rules**:
- `removal_target` must be at least 2 major versions after `deprecated_in`
- `migration_guide` path must exist in docs-content
- Cannot remove item until `removal_target` version is released

**State Transitions**:
- Announced → Active (users receive warnings)
- Active → Removable (target version released)
- Removable → Removed (item deleted from codebase)

### 3. Changelog Release

Aggregated changelog for a specific version.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| version | semver | Yes | Release version (e.g., `2.1.0`) |
| date | ISO8601 | Yes | Release date |
| summary | string | No | High-level release summary |
| breaking | ChangeEntry[] | No | Breaking changes with migration links |
| features | ChangeEntry[] | No | New features added |
| fixes | ChangeEntry[] | No | Bug fixes |
| deprecations | DeprecationRef[] | No | Newly deprecated items |
| security | ChangeEntry[] | No | Security-related changes |

**ChangeEntry**:
```typescript
interface ChangeEntry {
  description: string;
  packages: string[];
  editions: string[];
  pr?: number;
  author?: string;
  migration_guide?: string;
}
```

### 4. Contribution Gate

Defines a quality check for contributions.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique gate ID (e.g., `test-coverage`) |
| name | string | Yes | Human-readable name |
| type | enum | Yes | `automated` \| `manual` |
| threshold | number | No | Numeric threshold (e.g., 80 for coverage) |
| required | boolean | Yes | Whether gate blocks merge |
| description | string | Yes | Explanation of what gate checks |
| remediation | string | Yes | How to fix failures |

**Standard Gates**:
- `test-coverage`: Automated, threshold 80%, required
- `accessibility`: Automated, required
- `manifest-validation`: Automated, required
- `docs-presence`: Automated, required
- `design-review`: Manual, required for new components
- `a11y-audit`: Manual, required for new components

### 5. Migration Guide

Step-by-step guide for upgrading across breaking changes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Guide ID (e.g., `v1-to-v2`) |
| from_version | semver | Yes | Starting version |
| to_version | semver | Yes | Target version |
| breaking_changes | BreakingChange[] | Yes | List of breaking changes covered |
| steps | MigrationStep[] | Yes | Ordered migration steps |
| codemods | Codemod[] | No | Automated migration scripts |
| estimated_effort | string | No | Time estimate (e.g., "1-2 hours") |

**MigrationStep**:
```typescript
interface MigrationStep {
  order: number;
  title: string;
  description: string;
  before?: string;  // Code example before
  after?: string;   // Code example after
  affected_files?: string[];  // Patterns like "*.tsx"
}
```

### 6. Tenant Update Summary

Edition-filtered view of changes for a specific tenant.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tenant_id | string | Yes | Tenant identifier |
| edition | string | Yes | Tenant's edition tier |
| current_version | semver | Yes | Tenant's current version |
| target_version | semver | Yes | Version to update to |
| changes | FilteredChange[] | Yes | Changes relevant to this edition |
| conflicts | OverlayConflict[] | No | Potential conflicts with tenant overlays |
| security_alerts | SecurityAlert[] | No | Security updates requiring action |
| estimated_effort | string | No | Upgrade time estimate |

**FilteredChange**:
```typescript
interface FilteredChange {
  version: string;
  type: 'breaking' | 'feature' | 'fix' | 'deprecation' | 'security';
  description: string;
  affects_tenant: boolean;  // True if tenant uses affected component
  action_required: boolean;
}
```

**OverlayConflict**:
```typescript
interface OverlayConflict {
  path: string;           // Tenant's overridden file path
  base_changed: boolean;  // Whether base file changed
  severity: 'info' | 'warning' | 'error';
  message: string;
}
```

## File Locations

| Entity | Storage Location | Format |
|--------|-----------------|--------|
| Changeset Entry | `.changeset/*.md` | Markdown with YAML frontmatter |
| Deprecation Record | `packages/governance/deprecations.json` | JSON |
| Changelog Release | `CHANGELOG.md` (root) | Markdown |
| Contribution Gate | `packages/governance/gates.json` | JSON |
| Migration Guide | `packages/docs-content/governance/migration/*.mdx` | MDX |
| Tenant Update Summary | Generated at build time | JSON (not persisted) |
