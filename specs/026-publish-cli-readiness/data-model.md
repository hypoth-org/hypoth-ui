# Data Model: NPM Publishing & CLI Copy-Mode Readiness

**Date**: 2026-03-03 | **Branch**: `026-publish-cli-readiness`

## Entities

### Package

Represents a publishable npm module in the monorepo.

| Field | Type | Description |
|-------|------|-------------|
| name | string | npm package name (e.g., `@hypoth-ui/react`) |
| version | string | Semver version (starts at `0.1.0`) |
| license | string | Always `"MIT"` |
| description | string | One-line package description |
| repository | object | `{ type, url, directory }` pointing to monorepo + package path |
| homepage | string | URL to main documentation |
| keywords | string[] | npm search keywords |
| exports | object | Conditional exports map (types, import) |
| files | string[] | Directories/files included in npm tarball |
| tier | enum | `core` or `tooling` (not in package.json; used for README presentation) |

**Relationships**: Packages depend on other packages via `dependencies`, `peerDependencies`, or `workspace:*` (converted to version ranges on publish).

**Validation**: `license` must be `"MIT"`. `repository.directory` must match actual package location. `description` must include "Alpha" caveat.

### Component (CLI Registry)

Represents a UI component available through the CLI.

| Field | Type | Description |
|-------|------|-------------|
| name | string | Kebab-case identifier (e.g., `button`) |
| displayName | string | Human-readable name |
| version | string | Component version |
| status | enum | `alpha`, `beta`, `stable` |
| frameworks | string[] | `["react", "wc"]` |
| dependencies | object | npm packages required |
| registryDependencies | string[] | Other components required |
| files | ComponentFile[] | Source files for copy mode |
| hasTemplates | boolean | Whether template files are available for copy mode |

### ComponentFile

A single source file within a component, used by copy mode.

| Field | Type | Description |
|-------|------|-------------|
| path | string | Source path relative to templates directory |
| target | string | Target filename in user's project |
| type | enum | `tsx`, `ts`, `css`, `json` |
| framework | enum? | `react`, `wc`, or null (shared) |

### Changeset

A version bump descriptor consumed by the release pipeline.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Auto-generated unique identifier |
| packages | string[] | Affected package names |
| type | enum | `major`, `minor`, `patch` |
| summary | string | Changelog entry text |

**State transitions**: Created (in PR) → Consumed (by `changeset version`) → Published (by `changeset publish`)

## Package Name Mapping

| Internal (workspace) | Published (npm) | Tier |
|----------------------|-----------------|------|
| @hypoth-ui/react | @hypoth-ui/react | core |
| @hypoth-ui/wc | @hypoth-ui/wc | core |
| @hypoth-ui/tokens | @hypoth-ui/tokens | core |
| @hypoth-ui/css | @hypoth-ui/css | core |
| @hypoth-ui/next | @hypoth-ui/next | core |
| @hypoth-ui/primitives-dom | @hypoth-ui/primitives-dom | core |
| @hypoth-ui/docs-core | @hypoth-ui/docs-core | tooling |
| @hypoth-ui/docs-content | @hypoth-ui/docs-content | tooling |
| @hypoth-ui/docs-renderer-next | @hypoth-ui/docs-renderer-next | tooling |
| @hypoth-ui/test-utils | @hypoth-ui/test-utils | tooling |
| @hypoth-ui/a11y-audit | @hypoth-ui/a11y-audit | tooling |
| @hypoth-ui/cli | @hypoth-ui/cli | core |
