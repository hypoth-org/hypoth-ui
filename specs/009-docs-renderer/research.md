# Research: Docs Renderer v1 (Next.js) + White-Label Overlay Workflow

**Feature**: 009-docs-renderer
**Date**: 2026-01-03
**Status**: Complete

## Executive Summary

This research document captures the analysis of existing codebase infrastructure, external patterns, and technical approaches for implementing the docs renderer with white-label overlay support. The research confirms that significant foundation already exists in `@ds/docs-core` and `@ds/docs-renderer-next`, and the implementation should extend rather than rebuild.

## Existing Infrastructure Analysis

### 1. @ds/docs-core Package

The headless documentation engine already provides:

#### Edition Filtering (packages/docs-core/src/filter/edition-filter.ts)
- `EditionConfig` interface with branding, features, and content overlays
- `isComponentVisibleForEdition()` - checks component visibility
- `filterComponentsForEdition()` - bulk filtering
- `isContentVisibleForEdition()` - frontmatter-based filtering
- `getEffectiveContentPath()` - overlay path resolution (foundation exists)
- Factory functions for default/enterprise editions

#### Navigation Generation (packages/docs-core/src/nav/navigation.ts)
- `NavItem` and `NavigationTree` types
- `generateNavigation()` - creates nav tree from manifests + content
- `flattenNavigation()`, `findNavItemByHref()`, `getBreadcrumbs()` utilities
- Already integrates edition filtering

#### Content Parsing (packages/docs-core/src/content/frontmatter.ts)
- `ContentFrontmatter` interface with editions, category, order
- `parseFrontmatter()`, `parseFrontmatterFromFile()` functions
- `isVisibleForEdition()` for edition-based visibility
- `extractCategories()` for nav grouping

#### Type System (packages/docs-core/src/types/manifest.ts)
- `Edition` = "core" | "pro" | "enterprise"
- `ComponentStatus` = "experimental" | "alpha" | "beta" | "stable" | "deprecated"
- `ContractManifest` - component metadata contract
- `EditionConfig` - tenant configuration (differs from filter version)
- `EditionMap` - SSR-optimized component lookup
- `DocsFrontmatter` - MDX frontmatter contract

**Gap Analysis**: Two `EditionConfig` types exist (filter vs types/manifest). Need to consolidate or document relationship.

### 2. @ds/docs-renderer-next Package

#### Current Layout (packages/docs-renderer-next/app/layout.tsx)
- Basic layout with header, sidebar, main content
- ThemeSwitcher and ThemeInitScript for dark mode
- NavSidebar integration
- No branding customization yet

#### Component Page (packages/docs-renderer-next/app/components/[id]/page.tsx)
- `generateStaticParams()` for SSG
- `generateMetadata()` for SEO
- `getCurrentEdition()` from env/config
- `loadContractManifests()` from @ds/wc
- Edition-based access control with upgrade redirect
- MDX content loading with fallback to auto-generated docs
- EditionProvider context for child components

**Existing Patterns**:
- Edition loaded from `DS_EDITION` env var or config file
- Multiple manifest loaders (contract + legacy)
- MDX rendering with MdxRenderer component

### 3. @ds/docs-content Package

#### Structure
- `manifests/` - JSON component manifests (button.json, input.json)
- `components/` - MDX component docs
- `guides/` - MDX guides
- `editions/` - Edition config examples (default.json, enterprise-sample.json)

#### Edition Config Format (editions/default.json)
```json
{
  "id": "default",
  "name": "Default Edition",
  "availabilityFilter": ["public"],
  "excludeComponents": [],
  "contentOverlays": {},
  "branding": {
    "logoUrl": "/logo.svg",
    "primaryColor": "#0066cc",
    "siteTitle": "Design System"
  },
  "features": {
    "showSourceLinks": true,
    "enableSearch": true,
    "showVersions": true
  }
}
```

## Technical Approach Research

### Content Overlay Resolution

**Current State**: `getEffectiveContentPath()` in edition-filter.ts provides basic path remapping via `contentOverlays` map.

**Required Enhancement**: Implement file-system based overlay that:
1. Accepts array of content pack roots (base + tenant)
2. Resolves paths by checking tenant pack first, falling back to base
3. Merges manifests when tenant extends base component

**Algorithm**:
```typescript
async function resolveContent(
  contentPath: string,
  packs: ContentPack[]
): Promise<ResolvedContent | null> {
  // Check packs in reverse order (tenant first)
  for (const pack of [...packs].reverse()) {
    const fullPath = join(pack.root, contentPath);
    if (await exists(fullPath)) {
      return { path: fullPath, source: pack.id };
    }
  }
  return null; // Not found in any pack
}
```

### Branding Integration

**Current State**: Edition config has branding fields but layout doesn't consume them.

**Required Enhancement**:
1. Create BrandingProvider context from edition config
2. Apply branding.primaryColor as CSS custom property
3. Render branding.logo in header
4. Use branding.name in page titles

**CSS Custom Property Approach** (aligns with constitution):
```css
:root {
  --ds-brand-primary: var(--tenant-primary, #0066cc);
  --ds-brand-name: var(--tenant-name, "Design System");
}
```

### Search Index Generation

**Research**: Static search index generation at build time.

**Options Evaluated**:

1. **Flexsearch** - Zero-dependency full-text search
   - Pros: No server needed, fast, small bundle
   - Cons: Index size grows with content

2. **Pagefind** - Static search by CloudCannon
   - Pros: Automatic index chunking, tiny client
   - Cons: Additional build step, external tool

3. **Custom JSON index** - Minimal approach
   - Pros: Full control, smallest footprint
   - Cons: Limited search capabilities

**Recommendation**: Start with custom JSON index (US5 is a stub), migrate to Pagefind if needed.

**Index Schema**:
```typescript
interface SearchIndex {
  version: string;
  generatedAt: string;
  entries: Array<{
    id: string;
    type: "component" | "guide";
    title: string;
    description: string;
    content: string; // First N chars of body
    url: string;
    tags: string[];
    edition: Edition;
  }>;
}
```

### Navigation Generation with Overlay

**Current State**: `generateNavigation()` takes manifests + contents but doesn't support overlay sources.

**Required Enhancement**:
1. Merge manifests from base + tenant packs
2. Tenant manifests can:
   - Add new components
   - Override base component metadata
   - Mark base components as hidden (via edition config)
3. Content frontmatter merges similarly

### Feature Toggles

**Current State**: EditionConfig has `features` object, not consumed in renderer.

**Implementation Approach**:
```typescript
// Server component checks
export function isFeatureEnabled(feature: keyof EditionConfig['features']): boolean {
  const config = getEditionConfig();
  return config.features?.[feature] ?? DEFAULT_FEATURES[feature];
}

// Conditional rendering
{isFeatureEnabled('darkMode') && <ThemeSwitcher />}
{isFeatureEnabled('search') && <SearchInput />}
```

## External Research

### Nextra (Next.js docs framework)
- File-system routing for docs
- Frontmatter-driven configuration
- Theme system via CSS variables
- Useful patterns for MDX rendering

### Docusaurus
- Plugin-based architecture
- i18n support (not needed but informative)
- Version switching patterns
- Search integration approaches

### Constitution Compliance Check

| Principle | Approach | Status |
|-----------|----------|--------|
| Performance | Build-time resolution, SSG pages | Aligned |
| Accessibility | APG nav patterns, skip links | Planned |
| Customizability | Token-based branding, CSS layers | Aligned |
| Zero-dep Core | docs-core remains dev-dep only | Aligned |

## Risks and Mitigations

### Risk 1: EditionConfig Type Divergence
Two different `EditionConfig` interfaces exist in codebase.
**Mitigation**: Consolidate to single source in types/manifest.ts, deprecate filter version.

### Risk 2: Overlay Complexity
File-system overlay adds build complexity.
**Mitigation**: Start with single-tenant mode (one overlay pack), add multi-tenant later.

### Risk 3: Search Index Size
Large content sets may produce large indices.
**Mitigation**: US5 is stub only; implement chunked loading when real search added.

## Recommendations

1. **Extend, don't rewrite** - Build on existing docs-core and docs-renderer-next
2. **Single EditionConfig** - Consolidate type definitions
3. **Content pack protocol** - Define npm package convention for content packs
4. **Stub search** - Implement index generation without UI, add UI in future iteration
5. **Example tenant pack** - Create @ds/docs-content-tenant-example to validate workflow

## References

- [DTCG Token Format](https://tr.designtokens.org/format/)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
- [Pagefind Static Search](https://pagefind.app/)
- [Nextra](https://nextra.site/)
