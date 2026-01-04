# Feature Specification: Docs Renderer v1 (Next.js) + White-Label Overlay Workflow

**Feature Branch**: `009-docs-renderer`
**Created**: 2026-01-03
**Status**: Draft
**Input**: User description: "Docs renderer v1 (Next.js) + white-label overlay workflow - Build a customizable docs site renderer that consumes docs content packs + manifests, supports tenant editions (filtering + branding), allows tenants to add/override pages and selectively hide components/docs. Define the white-label workflow with base content pack (@ds/docs-content), tenant overlay pack (@tenant/docs-content), edition config file drives filtering + branding, nav generated from manifests/frontmatter. Implement Next docs renderer consuming docs-core, tenant overlay example, branding hooks (logo/name/colors via tokens), and search indexing strategy stub."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Render Documentation from Content Packs (Priority: P1)

A documentation site administrator wants to deploy a docs site that automatically renders component documentation and guides from content packs (manifests + MDX files). The system loads content from `@ds/docs-content`, generates navigation from manifests and frontmatter metadata, and renders pages without manual nav file maintenance.

**Why this priority**: This is the core functionality - without content rendering, no other features matter. Establishes the foundation for all overlay and customization features.

**Independent Test**: Deploy a docs site with `@ds/docs-content`, navigate to component and guide pages, verify content renders correctly and navigation reflects all available content.

**Acceptance Scenarios**:

1. **Given** a Next.js app configured with `@ds/docs-renderer-next`, **When** the site builds, **Then** all component docs from manifests are available at `/components/[id]` routes
2. **Given** guide MDX files with frontmatter, **When** the site builds, **Then** guides are available at `/guides/[id]` routes with correct metadata
3. **Given** manifests with status and edition metadata, **When** navigation renders, **Then** nav items are automatically generated and grouped by category from frontmatter
4. **Given** a component manifest with accessibility info, **When** viewing the component page, **Then** accessibility section displays APG pattern, keyboard interactions, and screen reader notes

---

### User Story 2 - Edition-Based Content Filtering (Priority: P1)

A tenant with a "pro" edition license wants their docs site to only show components and documentation available in their edition tier. Components marked as "enterprise" should be hidden, while "core" and "pro" components are visible. Upgrade prompts may appear for hidden content.

**Why this priority**: Edition filtering is essential for the white-label business model - tenants must only see content they're licensed for.

**Independent Test**: Configure edition as "pro" in edition-config.json, verify enterprise-only components are hidden from navigation and pages return 404, verify upgrade prompts appear where configured.

**Acceptance Scenarios**:

1. **Given** edition config set to "pro", **When** navigation renders, **Then** enterprise-only components are excluded from the nav
2. **Given** edition config set to "core", **When** accessing a pro component URL directly, **Then** the page shows upgrade prompt or 404 based on configuration
3. **Given** an edition config with upgrade URL, **When** viewing filtered content, **Then** upgrade prompts link to the configured URL
4. **Given** component docs with edition-specific sections, **When** rendering for "pro" edition, **Then** enterprise-only sections are hidden within the page

---

### User Story 3 - Tenant Branding Customization (Priority: P1)

A white-label tenant wants their docs site to display their company logo, name, and brand colors instead of the default design system branding. Branding is configured via edition config and applied through design tokens.

**Why this priority**: Branding is the most visible white-label feature - tenants need to present docs as their own product.

**Independent Test**: Configure branding in edition-config.json with custom logo, name, and primary color. Verify the docs site displays tenant branding throughout.

**Acceptance Scenarios**:

1. **Given** edition config with branding.name set, **When** the site renders, **Then** the tenant name appears in header and page titles
2. **Given** edition config with branding.logo URL, **When** the site renders, **Then** the logo displays in the header/sidebar
3. **Given** edition config with branding.primaryColor, **When** the site renders, **Then** accent colors use the configured value via CSS custom properties
4. **Given** no branding config, **When** the site renders, **Then** default design system branding is used

---

### User Story 4 - Content Overlay and Override (Priority: P2)

A tenant wants to add custom documentation pages and override specific base content pages. They create a tenant content pack (`@tenant/docs-content`) that overlays the base pack. Tenant content takes precedence, and they can selectively hide base components.

**Why this priority**: Overlay enables tenants to customize content beyond branding - but core rendering and filtering must work first.

**Independent Test**: Create tenant content pack with one overridden page and one new page. Configure overlay in the docs app. Verify overridden content replaces base, new content appears, and hidden components are excluded.

**Acceptance Scenarios**:

1. **Given** tenant pack with `components/button.mdx`, **When** viewing `/components/button`, **Then** tenant content renders instead of base content
2. **Given** tenant pack with new `guides/custom-guide.mdx`, **When** viewing `/guides/custom-guide`, **Then** the custom guide renders and appears in navigation
3. **Given** edition config with hidden components list, **When** navigation renders, **Then** hidden components are excluded regardless of edition availability
4. **Given** tenant manifest extending base manifest, **When** loading component metadata, **Then** tenant values override base values
5. **Given** overlay enabled, **When** content not found in tenant pack, **Then** base pack content is used as fallback

---

### User Story 5 - Search Index Generation (Priority: P2)

A docs site administrator wants search functionality. The system generates a search index from rendered content at build time. The index includes component names, descriptions, page content, and metadata for filtering.

**Why this priority**: Search significantly improves docs usability but is not blocking for initial launch.

**Independent Test**: Run build, verify search index JSON is generated with all indexable content. Verify search API can query the index.

**Acceptance Scenarios**:

1. **Given** docs content with components and guides, **When** build completes, **Then** a search index file is generated in the public directory
2. **Given** edition filtering enabled, **When** index generates, **Then** only edition-available content is indexed
3. **Given** search index exists, **When** querying by component name, **Then** matching results are returned with title, description, and URL
4. **Given** content with tags in frontmatter, **When** indexing, **Then** tags are included as searchable metadata

---

### User Story 6 - Feature Toggles (Priority: P3)

A tenant wants to enable or disable specific documentation features like dark mode toggle, version switcher, or feedback widget. Features are controlled via edition config.

**Why this priority**: Feature toggles are nice-to-have customization beyond the core white-label requirements.

**Independent Test**: Configure features.darkMode: false in edition config, verify dark mode toggle is hidden. Enable feedback, verify feedback widget appears.

**Acceptance Scenarios**:

1. **Given** edition config with features.darkMode: false, **When** site renders, **Then** dark mode toggle is hidden
2. **Given** edition config with features.search: true, **When** site renders, **Then** search input is visible
3. **Given** edition config with features.feedback: true, **When** viewing a page, **Then** feedback widget is available
4. **Given** features not specified, **When** site renders, **Then** default feature set is enabled

---

### Edge Cases

- What happens when tenant overlay references a component that doesn't exist in base? Show error in development mode, exclude from build in production
- How does the system handle circular content dependencies? Detect cycles during build and fail with clear error message
- What happens when edition config file is missing? Use default "core" edition with console warning
- How does search handle very large content sets? Generate chunked index files, load relevant chunks on demand
- What happens when branding.logo URL is inaccessible? Fallback to text-only header displaying branding.name

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST load and parse component manifests from content pack directories
- **FR-002**: System MUST load and render MDX content with frontmatter metadata
- **FR-003**: System MUST generate navigation tree from manifests and frontmatter (category, order fields)
- **FR-004**: System MUST filter components and content based on edition config tier
- **FR-005**: System MUST apply tenant branding (logo, name, colors) from edition config
- **FR-006**: System MUST support content overlay with tenant pack taking precedence over base pack
- **FR-007**: System MUST allow hiding specific components via edition config
- **FR-008**: System MUST generate static pages at build time for all available content
- **FR-009**: System MUST generate search index at build time containing indexable content
- **FR-010**: System MUST support feature toggles for optional UI elements
- **FR-011**: System MUST display upgrade prompts for edition-filtered content when configured
- **FR-012**: System MUST preserve existing docs-core validation and filtering utilities
- **FR-013**: System MUST support SSR/SSG for all documentation pages

### Key Entities

- **Content Pack**: A package containing manifests, MDX docs, and assets. Base pack is `@ds/docs-content`, tenant packs overlay it.
- **Edition Config**: JSON configuration file defining edition tier, branding, hidden components, feature toggles, and upgrade URL.
- **Component Manifest**: JSON metadata about a component including id, name, status, editions, accessibility info.
- **Navigation Tree**: Generated structure of nav items with categories, ordering, and edition filtering applied.
- **Search Index**: Generated JSON containing searchable content with title, description, URL, and tags.
- **Content Overlay**: Layered content resolution where tenant content overrides base content for the same path.

## Approach Analysis *(mandatory)*

### Evaluation Criteria

- **Build Performance**: Time to generate all static pages and search index
- **Content Flexibility**: How easily tenants can customize and extend content
- **Developer Experience**: Clarity of configuration and debugging overlay issues
- **Bundle Size**: Impact on client-side JavaScript

### Approach A: File-System Based Overlay

Content packs are npm packages with standardized directory structures. At build time, a content resolver walks the file system, checking tenant pack first, then falling back to base pack. Navigation is generated by scanning frontmatter.

**Pros**:
- Simple mental model - files override files
- No runtime overhead - all resolved at build time
- Easy to debug - just check which file exists where
- Works with existing Next.js static generation

**Cons**:
- Requires npm package for each tenant (may be overhead for small customizations)
- Full rebuild required when base pack updates
- Limited programmatic control over overlay logic

### Approach B: Configuration-Driven Virtual Overlay

Content resolution is driven entirely by a configuration object that maps paths to content sources. No file system overlay; instead, a virtual layer routes requests to appropriate content.

**Pros**:
- Maximum flexibility in routing logic
- Can support non-file sources (databases, APIs)
- Fine-grained control over individual files

**Cons**:
- Complex configuration schema
- Harder to understand what content is active
- More runtime logic and potential performance impact
- Diverges from standard Next.js patterns

### Approach C: Git-Based Overlay with Merge

Use git submodules or workspace linking where tenant content is merged with base content using git-like merge strategies at build time.

**Pros**:
- Familiar git semantics for merging
- Could support partial file merges (merge frontmatter but override body)
- Version control of overlay decisions

**Cons**:
- Complex tooling requirement
- Merge conflicts need resolution strategy
- Harder for non-git-savvy users
- Over-engineered for the use case

### Recommendation

**Recommended: Approach A (File-System Based Overlay)**

This approach aligns with the constitution's preference for simplicity and build-time resolution. It leverages Next.js's existing static generation patterns, keeps the mental model simple (tenant files override base files), and requires no runtime overhead. The npm package requirement is acceptable since white-label tenants are expected to have development infrastructure.

Trade-offs acknowledged: Requiring npm packages may be overhead for very simple customizations, but this is mitigated by providing sensible defaults that work without a tenant pack.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Documentation site builds and deploys with zero configuration beyond installing packages (base content pack only)
- **SC-002**: Edition filtering correctly shows/hides 100% of components based on configured tier
- **SC-003**: Tenant content overlay successfully overrides base content for matching paths
- **SC-004**: Branding customization (logo, name, colors) applies consistently across all pages
- **SC-005**: Navigation is automatically generated from manifests/frontmatter without manual nav file
- **SC-006**: Search index is generated at build time and includes all edition-available content
- **SC-007**: Build time for 100-component docs site remains under 60 seconds
- **SC-008**: Documentation pages achieve 90+ Lighthouse performance score
