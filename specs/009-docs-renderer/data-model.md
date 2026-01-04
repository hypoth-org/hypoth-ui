# Data Model: Docs Renderer v1 (Next.js) + White-Label Overlay Workflow

**Feature**: 009-docs-renderer
**Date**: 2026-01-03

## Overview

This document defines the data structures, relationships, and validation rules for the docs renderer with white-label overlay support. The model extends existing `@ds/docs-core` types and introduces new structures for content overlay and search indexing.

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Content Packs                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐         overlays          ┌──────────────────┐        │
│  │  Base Content    │◄─────────────────────────│  Tenant Content  │        │
│  │  Pack            │                           │  Pack            │        │
│  │  (@ds/docs-      │                           │  (@tenant/docs-  │        │
│  │   content)       │                           │   content)       │        │
│  └────────┬─────────┘                           └────────┬─────────┘        │
│           │                                              │                   │
│           │ contains                                     │ contains          │
│           ▼                                              ▼                   │
│  ┌──────────────────┐                           ┌──────────────────┐        │
│  │  Manifests[]     │                           │  Manifests[]     │        │
│  │  Components/     │                           │  Components/     │        │
│  │  Guides/         │                           │  Guides/         │        │
│  └──────────────────┘                           └──────────────────┘        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ resolved by
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Content Resolver                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    applies     ┌──────────────────┐                   │
│  │  Edition Config  │───────────────►│  Resolved        │                   │
│  │  (JSON)          │                │  Navigation      │                   │
│  └──────────────────┘                │  Tree            │                   │
│           │                          └────────┬─────────┘                   │
│           │ configures                        │                              │
│           ▼                                   │ rendered by                  │
│  ┌──────────────────┐                        ▼                              │
│  │  Branding        │               ┌──────────────────┐                    │
│  │  Context         │◄──────────────│  Next.js         │                    │
│  └──────────────────┘               │  Renderer        │                    │
│                                     └──────────────────┘                    │
│                                              │                               │
│                                              │ generates                     │
│                                              ▼                               │
│                                     ┌──────────────────┐                    │
│                                     │  Search Index    │                    │
│                                     │  (JSON)          │                    │
│                                     └──────────────────┘                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Core Entities

### 1. ContentPack

Represents a documentation content package (npm module).

```typescript
/**
 * Metadata for a documentation content pack
 */
interface ContentPack {
  /** Package identifier (e.g., "@ds/docs-content") */
  id: string;

  /** Absolute path to package root */
  root: string;

  /** Pack type: base provides foundation, overlay extends/overrides */
  type: "base" | "overlay";

  /** Priority for overlay resolution (higher = checked first) */
  priority: number;

  /** Package version from package.json */
  version: string;
}
```

**Validation Rules**:
- `id` must be valid npm package name
- `root` must be absolute path that exists
- `priority` must be unique across packs when type is "overlay"

### 2. EditionConfig (Consolidated)

Tenant-level configuration for edition filtering, branding, and features.

```typescript
/**
 * Edition configuration file schema
 * Location: edition-config.json at docs app root or tenant pack root
 */
interface EditionConfig {
  /** JSON Schema reference for IDE support */
  $schema?: string;

  /** Configuration identifier */
  id: string;

  /** Human-readable name */
  name: string;

  /** Active edition tier */
  edition: Edition;  // "core" | "pro" | "enterprise"

  /** Content pack configuration */
  contentPacks?: ContentPackConfig[];

  /** Component visibility rules */
  visibility?: {
    /** Explicitly hidden component IDs */
    hiddenComponents?: string[];
    /** Explicitly shown component IDs (overrides edition filtering) */
    shownComponents?: string[];
  };

  /** Branding customization */
  branding?: BrandingConfig;

  /** Feature toggles */
  features?: FeatureConfig;

  /** Upgrade prompt configuration */
  upgrade?: UpgradeConfig;
}

interface ContentPackConfig {
  /** Package name (e.g., "@tenant/docs-content") */
  package: string;
  /** Priority (higher = checked first for overlays) */
  priority?: number;
}

interface BrandingConfig {
  /** Display name for header and titles */
  name?: string;
  /** Logo URL (absolute or relative to public/) */
  logo?: string;
  /** Primary brand color (CSS hex) */
  primaryColor?: string;
  /** Favicon URL */
  favicon?: string;
  /** Custom CSS file URL */
  customCss?: string;
}

interface FeatureConfig {
  /** Show search input */
  search?: boolean;
  /** Show dark mode toggle */
  darkMode?: boolean;
  /** Show version switcher */
  versionSwitcher?: boolean;
  /** Show feedback widget */
  feedback?: boolean;
  /** Show source code links */
  sourceLinks?: boolean;
}

interface UpgradeConfig {
  /** URL for upgrade CTA */
  url: string;
  /** CTA button text */
  ctaText?: string;
  /** Message shown on filtered content */
  message?: string;
}
```

**Validation Rules**:
- `edition` must be valid Edition value
- `branding.primaryColor` must match hex pattern `^#[0-9a-fA-F]{6}$`
- `branding.logo` must be valid URL or relative path
- `upgrade.url` must be valid URL when specified

### 3. ResolvedContent

Result of content overlay resolution.

```typescript
/**
 * Result of resolving content through overlay chain
 */
interface ResolvedContent {
  /** Content type */
  type: "manifest" | "mdx" | "asset";

  /** Original requested path (e.g., "components/button.mdx") */
  requestedPath: string;

  /** Resolved absolute file path */
  resolvedPath: string;

  /** Source pack that provided this content */
  source: {
    packId: string;
    packType: "base" | "overlay";
  };

  /** Whether content was overridden from base */
  isOverridden: boolean;

  /** Parsed content (if applicable) */
  content?: {
    frontmatter?: DocsFrontmatter;
    body?: string;
    manifest?: ContractManifest;
  };
}
```

### 4. NavigationTree (Extended)

Navigation structure with overlay metadata.

```typescript
/**
 * Extended navigation item with overlay awareness
 */
interface NavItem {
  /** Unique identifier */
  id: string;

  /** Display label */
  label: string;

  /** URL path */
  href: string;

  /** Item type */
  type: "component" | "guide" | "category" | "external";

  /** Sort order */
  order: number;

  /** Component status (for component items) */
  status?: ComponentStatus;

  /** Edition availability */
  editions?: Edition[];

  /** Content source pack */
  source?: string;

  /** Whether this overrides base content */
  isOverride?: boolean;

  /** Child items (for categories) */
  children?: NavItem[];

  /** Badge text (e.g., "New", "Beta") */
  badge?: string;
}

/**
 * Full navigation tree
 */
interface NavigationTree {
  /** Component navigation by category */
  components: NavItem[];

  /** Guide navigation by category */
  guides: NavItem[];

  /** External links section */
  external?: NavItem[];

  /** Generation metadata */
  meta: {
    generatedAt: string;
    edition: Edition;
    packs: string[];
  };
}
```

### 5. SearchIndex

Build-time generated search index.

```typescript
/**
 * Search index generated at build time
 */
interface SearchIndex {
  /** Schema version for compatibility */
  version: "1.0.0";

  /** ISO timestamp of generation */
  generatedAt: string;

  /** Edition this index was generated for */
  edition: Edition;

  /** Indexed content entries */
  entries: SearchEntry[];

  /** Category facets for filtering */
  facets: {
    categories: string[];
    types: Array<"component" | "guide">;
    tags: string[];
  };
}

interface SearchEntry {
  /** Unique entry ID */
  id: string;

  /** Content type */
  type: "component" | "guide";

  /** Page title */
  title: string;

  /** Short description */
  description: string;

  /** URL path */
  url: string;

  /** Navigation category */
  category: string;

  /** Searchable tags */
  tags: string[];

  /** Indexed body content (first N characters) */
  excerpt: string;

  /** Component status (if applicable) */
  status?: ComponentStatus;

  /** Search ranking boost */
  boost?: number;
}
```

**Index Generation Rules**:
- Only edition-available content is indexed
- Exclude draft content
- Excerpt limited to 500 characters
- Tags extracted from frontmatter + manifest
- Boost applied: title (2.0), description (1.5), excerpt (1.0)

### 6. BrandingContext

Runtime branding values for React context.

```typescript
/**
 * Branding values exposed via React context
 */
interface BrandingContextValue {
  /** Site name */
  name: string;

  /** Logo URL (resolved) */
  logo: string | null;

  /** Primary color CSS value */
  primaryColor: string;

  /** Feature flags */
  features: Required<FeatureConfig>;

  /** Current edition */
  edition: Edition;

  /** Upgrade prompt data (if applicable) */
  upgrade: UpgradeConfig | null;
}
```

## Data Flow

### Content Resolution Flow

```
1. Load EditionConfig
   ↓
2. Initialize ContentPacks (base + overlays by priority)
   ↓
3. For each content request:
   a. Check overlay packs (highest priority first)
   b. If found → return with isOverridden: true
   c. If not found → check base pack
   d. If not found → return null
   ↓
4. Apply edition filtering to resolved content
   ↓
5. Generate NavigationTree from filtered content
   ↓
6. Cache navigation for SSG
```

### Build-Time Processing

```
1. Load all content packs
   ↓
2. Resolve all content paths (manifests, MDX, assets)
   ↓
3. Filter by edition
   ↓
4. Generate:
   - NavigationTree (for sidebar)
   - SearchIndex (for search)
   - Static params (for SSG)
   ↓
5. Write to public/ directory
```

## Validation Schemas

### Edition Config Schema Location
`packages/docs-core/src/schemas/edition-config.schema.json` (existing, needs extension)

### New Schemas Required

1. **content-pack-config.schema.json** - ContentPackConfig validation
2. **search-index.schema.json** - SearchIndex validation
3. **resolved-navigation.schema.json** - NavigationTree validation

## Migration Notes

### EditionConfig Consolidation

The codebase has two EditionConfig types:
1. `packages/docs-core/src/filter/edition-filter.ts` - Runtime filtering config
2. `packages/docs-core/src/types/manifest.ts` - Tenant config contract

**Migration Strategy**:
1. Extend `types/manifest.ts` EditionConfig with missing fields
2. Update `edition-filter.ts` to import from `types/manifest.ts`
3. Add compatibility layer for existing `availabilityFilter` approach

### Backwards Compatibility

- Existing `edition-config.json` files continue to work
- New fields are optional with sensible defaults
- `contentPacks` defaults to `[@ds/docs-content]` if not specified
