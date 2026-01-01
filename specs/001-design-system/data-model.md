# Data Model: White-Label Design System

**Feature**: 001-design-system
**Date**: 2026-01-01

## Overview

This document defines the core entities, their schemas, and relationships for the design system architecture. All schemas are expressed in TypeScript interfaces with JSON Schema equivalents in `/contracts/`.

---

## 1. Design Token

A named design value in DTCG format.

### Schema

```typescript
interface DesignToken {
  /** The token value (required) */
  $value: string | number | object;

  /** Token type per DTCG spec (required) */
  $type: TokenType;

  /** Human-readable description (recommended) */
  $description?: string;

  /** Extensions for tooling (optional) */
  $extensions?: Record<string, unknown>;
}

type TokenType =
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'fontSize'
  | 'lineHeight'
  | 'letterSpacing'
  | 'opacity'
  | 'shadow'
  | 'border'
  | 'transition'
  | 'typography'  // Composite
  | 'gradient';
```

### Token Hierarchy

```typescript
interface TokenFile {
  /** Nested token groups */
  [groupName: string]: TokenGroup | DesignToken;
}

interface TokenGroup {
  [tokenName: string]: TokenGroup | DesignToken;
}
```

### Example

```json
{
  "color": {
    "primary": {
      "$value": "#0066CC",
      "$type": "color",
      "$description": "Primary brand color"
    }
  }
}
```

---

## 2. Component Manifest

Machine-readable metadata for a component.

### Schema

```typescript
interface ComponentManifest {
  /** Unique identifier (kebab-case) */
  id: string;

  /** Display name */
  name: string;

  /** Release status */
  status: 'alpha' | 'beta' | 'stable' | 'deprecated';

  /** Visibility/licensing tags */
  availabilityTags: AvailabilityTag[];

  /** Supported platform implementations */
  platforms: Platform[];

  /** Accessibility information */
  a11y: A11yInfo;

  /** Semantic token groups consumed */
  tokensUsed: string[];

  /** Brief usage guidance */
  recommendedUsage: string;

  /** What NOT to do */
  antiPatterns: string;

  /** Component category for navigation */
  category: string;

  /** Related components */
  relatedComponents?: string[];

  /** Version introduced */
  since?: string;
}

type AvailabilityTag =
  | 'public'
  | 'enterprise'
  | 'internal-only'
  | 'regulated';

type Platform =
  | 'wc'          // Web Component
  | 'react'       // React adapter
  | 'html-recipe'; // HTML/CSS only pattern

interface A11yInfo {
  /** APG pattern name or 'custom' */
  apgPattern: string;

  /** Keyboard interactions supported */
  keyboardSupport: string[];

  /** Known accessibility gaps */
  knownLimitations: string[];

  /** ARIA roles used */
  ariaRoles?: string[];
}
```

### Validation Rules

- `id` MUST be unique across all manifests
- `id` MUST match kebab-case pattern: `/^[a-z][a-z0-9-]*$/`
- `status` changes MUST follow: alpha → beta → stable → deprecated
- `availabilityTags` MUST contain at least one tag
- `platforms` MUST contain at least `'wc'`

### Example

```json
{
  "id": "button",
  "name": "Button",
  "status": "stable",
  "availabilityTags": ["public"],
  "platforms": ["wc", "react"],
  "a11y": {
    "apgPattern": "button",
    "keyboardSupport": ["Enter", "Space"],
    "knownLimitations": [],
    "ariaRoles": ["button"]
  },
  "tokensUsed": [
    "color.action",
    "spacing.component",
    "typography.label"
  ],
  "recommendedUsage": "Primary actions, form submissions, dialogs",
  "antiPatterns": "Do not use for navigation; use Link instead",
  "category": "actions",
  "since": "1.0.0"
}
```

---

## 3. Edition/Tenant Config

Configuration for white-label documentation filtering.

### Schema

```typescript
interface EditionConfig {
  /** JSON Schema reference */
  $schema?: string;

  /** Unique edition identifier */
  id: string;

  /** Display name */
  name: string;

  /** Included availability tags (intersection filter) */
  availabilityFilter: AvailabilityTag[];

  /** Explicitly excluded component IDs */
  excludeComponents: string[];

  /** Content file overrides (base path → overlay path) */
  contentOverlays: Record<string, string>;

  /** Branding customization */
  branding: BrandingConfig;

  /** Feature flags */
  features?: FeatureFlags;
}

interface BrandingConfig {
  /** Logo URL */
  logoUrl: string;

  /** Primary brand color (for docs site) */
  primaryColor: string;

  /** Site title */
  siteTitle?: string;

  /** Favicon URL */
  faviconUrl?: string;
}

interface FeatureFlags {
  /** Show component source links */
  showSourceLinks?: boolean;

  /** Enable search */
  enableSearch?: boolean;

  /** Show version selector */
  showVersions?: boolean;
}
```

### Filtering Logic

1. Load all component manifests
2. Keep only components where `availabilityTags` intersects with `availabilityFilter`
3. Remove any components in `excludeComponents`
4. Apply `contentOverlays` (overlay file replaces base file)
5. Generate navigation from filtered components

### Example

```json
{
  "$schema": "./edition-config.schema.json",
  "id": "enterprise-acme",
  "name": "ACME Corp Edition",
  "availabilityFilter": ["public", "enterprise"],
  "excludeComponents": ["internal-debug-panel"],
  "contentOverlays": {
    "guides/getting-started.mdx": "./overlays/acme-getting-started.mdx"
  },
  "branding": {
    "logoUrl": "/acme-logo.svg",
    "primaryColor": "#0066CC",
    "siteTitle": "ACME Design System",
    "faviconUrl": "/acme-favicon.ico"
  },
  "features": {
    "showSourceLinks": false,
    "enableSearch": true,
    "showVersions": false
  }
}
```

---

## 4. Content Pack

Documentation content structure.

### Schema

```typescript
interface ContentPack {
  /** Package name */
  name: string;

  /** Package version */
  version: string;

  /** Base content directory */
  contentDir: string;

  /** Manifest directory */
  manifestDir: string;

  /** Content file index */
  files: ContentFile[];
}

interface ContentFile {
  /** Relative path from contentDir */
  path: string;

  /** File type */
  type: 'mdx' | 'md' | 'json';

  /** Parsed frontmatter (for MDX/MD) */
  frontmatter?: ContentFrontmatter;
}

interface ContentFrontmatter {
  /** Page title */
  title: string;

  /** Brief description */
  description?: string;

  /** Navigation category */
  category?: string;

  /** Sort order within category */
  order?: number;

  /** Component ID (for component pages) */
  componentId?: string;

  /** Hide from navigation */
  hidden?: boolean;

  /** Edition-specific visibility */
  editions?: string[];
}
```

### Directory Structure

```
packages/docs-content/
├── components/
│   ├── button.mdx
│   ├── input.mdx
│   └── dialog.mdx
├── guides/
│   ├── getting-started.mdx
│   ├── theming.mdx
│   └── accessibility.mdx
├── manifests/
│   ├── button.json
│   ├── input.json
│   └── dialog.json
└── package.json
```

### Frontmatter Example

```yaml
---
title: Button
description: Buttons trigger actions or navigation
category: actions
order: 1
componentId: button
---
```

---

## 5. Navigation Tree

Generated navigation structure for docs.

### Schema

```typescript
interface NavigationTree {
  /** Root navigation items */
  items: NavigationItem[];
}

interface NavigationItem {
  /** Display label */
  label: string;

  /** URL path */
  href?: string;

  /** Nested items */
  children?: NavigationItem[];

  /** Component status badge */
  status?: 'alpha' | 'beta' | 'stable' | 'deprecated';

  /** External link */
  external?: boolean;
}
```

### Generation Rules

1. Group components by `category`
2. Sort categories alphabetically
3. Sort components within category by manifest `name`
4. Include guides as top-level items
5. Apply edition filtering before generation

---

## Entity Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                      Token Files                            │
│  (primitives, semantic, modes)                              │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ compiled by Style Dictionary
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   CSS Custom Properties                      │
│                   TypeScript Constants                       │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ consumed by
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Component Manifest                         │
│  - references tokensUsed                                    │
│  - defines a11y contract                                    │
│  - declares platforms                                       │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ indexed by
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Content Pack                               │
│  - MDX docs reference componentId                           │
│  - manifests/ contains component manifests                  │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ filtered by
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Edition Config                             │
│  - availabilityFilter                                       │
│  - excludeComponents                                        │
│  - contentOverlays                                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ generates
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Navigation Tree                            │
│  - filtered, sorted, structured                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Validation

All entities have corresponding JSON Schema files in `/contracts/`:

- `design-token.schema.json`
- `component-manifest.schema.json`
- `edition-config.schema.json`
- `content-frontmatter.schema.json`

Build-time validation ensures all files conform to schemas.
