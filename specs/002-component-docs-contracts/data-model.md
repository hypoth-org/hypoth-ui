# Data Model: Component & Documentation Contracts

**Branch**: `002-component-docs-contracts` | **Date**: 2026-01-01

## Entities

### ComponentManifest

Structured metadata for a component. Lives in the WC package as `packages/wc/src/components/<name>/manifest.json`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `$schema` | string | Yes | Reference to JSON Schema for IDE support |
| `id` | string | Yes | Unique identifier (kebab-case, e.g., `button`) |
| `name` | string | Yes | Display name (e.g., `Button`) |
| `version` | string | Yes | Semver version (e.g., `1.0.0`) |
| `status` | enum | Yes | `experimental` \| `alpha` \| `beta` \| `stable` \| `deprecated` |
| `description` | string | Yes | Short description (1-2 sentences) |
| `editions` | array | Yes | Array of edition tags: `core`, `pro`, `enterprise` |
| `accessibility` | object | Yes | Accessibility metadata (see nested structure) |
| `tokensUsed` | array | No | Semantic token groups consumed |
| `recommendedUsage` | string | No | Short guidance on when to use |
| `antiPatterns` | string | No | What NOT to do |
| `platforms` | array | No | `wc`, `react`, `html-recipe` |

#### Accessibility (nested)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `apgPattern` | string | Yes | APG pattern name or `custom` |
| `keyboard` | array | Yes | Supported keyboard interactions (e.g., `["Enter", "Space"]`) |
| `screenReader` | string | Yes | Screen reader behavior notes |
| `ariaPatterns` | array | No | ARIA roles/states used |
| `knownLimitations` | array | No | Documented a11y gaps |

### DocsFrontmatter

YAML frontmatter in MDX files. Lives in `packages/docs-content/components/<name>.mdx`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Page title |
| `description` | string | No | Meta description for SEO |
| `component` | string | Yes | Reference to component id (must match manifest) |
| `status` | enum | Yes | Must match component manifest status |
| `editions` | array | No | Override editions (defaults to manifest editions) |
| `lastUpdated` | date | No | Last content update date |
| `draft` | boolean | No | If true, excluded from production build |

### EditionConfig

Tenant-level configuration. Lives in `apps/docs/edition.config.json`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `edition` | enum | Yes | Active edition: `core`, `pro`, `enterprise` |
| `branding` | object | No | Brand overrides (logo, colors) |
| `features` | object | No | Feature flags for additional capabilities |

### EditionMap (Generated)

Build-time generated file for SSR filtering. Lives in `packages/docs-core/src/generated/edition-map.json`.

| Field | Type | Description |
|-------|------|-------------|
| `components` | object | Map of component id → edition array |
| `generatedAt` | string | ISO timestamp of generation |
| `version` | string | Schema version for compatibility |

### ValidationResult

Output from validation utilities (TypeScript type, not stored).

| Field | Type | Description |
|-------|------|-------------|
| `valid` | boolean | Overall validation result |
| `errors` | array | Array of ValidationError |
| `warnings` | array | Array of ValidationWarning |

#### ValidationError

| Field | Type | Description |
|-------|------|-------------|
| `file` | string | Absolute file path |
| `field` | string | JSON path to invalid field |
| `message` | string | Human-readable error message |
| `code` | string | Error code for programmatic handling |

#### ValidationWarning

| Field | Type | Description |
|-------|------|-------------|
| `file` | string | Absolute file path |
| `field` | string | JSON path to field |
| `message` | string | Human-readable warning message |
| `code` | string | Warning code |

## Relationships

```
┌─────────────────────┐
│  ComponentManifest  │
│  (packages/wc/...)  │
└─────────┬───────────┘
          │ references
          ▼
┌─────────────────────┐     generates     ┌─────────────────────┐
│   DocsFrontmatter   │ ◄──────────────── │     EditionMap      │
│ (packages/docs-     │                   │    (generated/)     │
│  content/...)       │                   └─────────────────────┘
└─────────┬───────────┘                             ▲
          │                                         │
          │ validated against                       │ reads
          ▼                                         │
┌─────────────────────┐                   ┌─────────────────────┐
│  ValidationResult   │                   │    EditionConfig    │
│   (runtime type)    │                   │   (apps/docs/...)   │
└─────────────────────┘                   └─────────────────────┘
```

## Validation Rules

### Manifest Validation (FR-002)

1. All required fields must be present
2. `id` must be kebab-case (`^[a-z][a-z0-9-]*$`)
3. `version` must be valid semver
4. `status` must be one of allowed values
5. `editions` must contain at least one valid edition
6. `accessibility.keyboard` must not be empty

### Frontmatter Validation (FR-006, FR-007)

1. All required fields must be present
2. `component` must reference an existing manifest id
3. `status` should match manifest status (warning if mismatch)
4. `editions` must be subset of manifest editions

### Cross-Reference Validation (FR-008)

1. Docs referencing deleted components → error
2. Docs with status different from manifest → warning
3. Docs using deprecated props in examples → warning (future: AST parsing)

## State Transitions

### Component Status Lifecycle

```
experimental → alpha → beta → stable → deprecated
     │          │       │       │
     └──────────┴───────┴───────┴─────── (can skip stages)
                                         (cannot go backwards without major version)
```

### Edition Hierarchy

```
core ⊂ pro ⊂ enterprise

- core: Base components available to all tenants
- pro: Includes core + professional-tier components
- enterprise: Includes pro + enterprise-tier components
```

## Indexes / Lookups

### By Component ID
- Primary lookup for manifest → frontmatter relationship
- Used by validation to cross-reference

### By Edition
- Generated edition-map provides O(1) lookup
- Used by SSR to filter navigation and routes

### By Status
- Used by audit command to filter components
- Supports: `--status=deprecated`, `--status=beta`, etc.
