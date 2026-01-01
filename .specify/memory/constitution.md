<!--
  SYNC IMPACT REPORT
  ==================
  Version: 1.0.0 (initial)

  Principles:
  - I. Performance First
  - II. Accessibility
  - III. Customizability

  Sections:
  - Architecture Commitments
  - Component Contract
  - Documentation Contract
  - Spec Kit Discipline (includes Research Requirement)
  - Dependency Management
  - Governance

  Templates updated:
  - .specify/templates/plan-template.md: ✅ Updated (Constitution Check)
  - .specify/templates/spec-template.md: ✅ Updated (Approach Analysis section added)
  - .specify/templates/tasks-template.md: ✅ Compatible (no changes needed)

  Deferred items: None
-->

# Hypoth UI Design System Constitution

## Core Principles (Ranked by Priority)

### I. Performance First

Minimal runtime cost and small bundles are non-negotiable. All design decisions MUST optimize for:

- **Streaming SSR friendliness**: Components MUST NOT block initial HTML delivery
- **Next.js App Router compatibility**: Server Components by default; Client Components only when interactivity requires
- **Minimal client boundaries**: `'use client'` directives MUST be isolated to the smallest possible surface
- **Zero runtime styling in Core**: No CSS-in-JS runtime; CSS variables and vanilla CSS only
- **Bundle size accountability**: Every dependency addition MUST justify its byte cost

**Rationale**: Performance directly impacts user experience, SEO, and conversion. A design system that degrades performance defeats its purpose.

### II. Accessibility

WCAG 2.1 AA compliance is the floor, not the ceiling. WCAG 2.2 readiness MUST be maintained.

- **Auditable evidence required**: Every component MUST ship with automated a11y test results AND a link to manual testing checklist
- **Keyboard navigation**: Full keyboard support documented and tested for every interactive component
- **Screen reader compatibility**: ARIA patterns MUST follow APG (ARIA Authoring Practices Guide)
- **Reduced motion**: `prefers-reduced-motion` MUST be respected system-wide
- **High contrast**: High-contrast mode MUST be supported via design tokens

**Rationale**: Accessibility is a legal requirement in many jurisdictions and an ethical imperative. Retrofitting accessibility is 10x more expensive than building it in.

### III. Customizability

Token-driven theming enables multi-brand, multi-mode support without forks.

- **Token source-of-truth**: DTCG (Design Token Community Group) Format is the canonical specification
- **Multi-brand support**: Brand switching MUST be achievable via token file swap, not code changes
- **Multi-mode support**: Light, dark, high-contrast, and reduced-motion modes MUST be first-class
- **Extensibility without forks**: Consumers MUST be able to extend/override via CSS layers and token overrides
- **No style lock-in**: Components MUST NOT inline styles that prevent CSS customization

**Rationale**: Design systems serve multiple products and brands. Forks create maintenance nightmares and divergence.

## Architecture Commitments

### Token Pipeline

- **Format**: DTCG Design Tokens Format (JSON with `$value`, `$type`, `$description`)
- **Transformation**: Tokens compile to CSS custom properties, TypeScript constants, and platform-specific outputs
- **Layers**: CSS `@layer` for cascade control: `reset`, `tokens`, `base`, `components`, `utilities`, `overrides`

### Styling Strategy

- **Vanilla CSS with CSS variables**: No runtime CSS-in-JS in Core packages
- **CSS Layers**: All styles MUST declare their layer; override strategy documented per layer
- **No Shadow DOM by default**: Light DOM enables global styling and reduces complexity

### Package Architecture (Zero Runtime Deps for Core)

| Package | Purpose | Runtime Deps |
|---------|---------|--------------|
| `@ds/tokens` | Design tokens (CSS vars, TS constants) | **0** |
| `@ds/css` | Base styles, reset, utilities | **0** |
| `@ds/primitives-dom` | Vanilla DOM primitives | **0** |
| `@ds/wc` | Web Components (Lit-based) | Lit only |
| `@ds/react` | React adapters over custom elements | React peer |

### Web Components Strategy (`@ds/wc`)

- **Light DOM everywhere**: Shadow DOM MUST NOT be default; explicit opt-in only with documented justification
- **Lit framework**: Standardized on Lit for Web Component authoring
- **Theme via CSS variables**: Components consume tokens via CSS custom properties
- **Override via CSS layers**: Consumer overrides go in `overrides` layer

### Next.js Integration

- **Single root client loader pattern**: One `'use client'` boundary to define all custom elements
- **Predictable hydration**: Custom elements defined once at app root, consumed everywhere
- **Server Component friendly**: Components render as custom element tags; hydration happens client-side

### React Adapter Strategy (`@ds/react`)

- **Thin wrappers**: React components wrap custom elements, forwarding props/events
- **No polymorphism by default**: `as` prop MUST NOT exist; composition over polymorphism
- **Targeted `asChild`**: Only React-only primitives (Slot, Presence) MAY use `asChild` pattern
- **Event normalization**: Custom element events mapped to React synthetic events

## Component Contract

Every component MUST satisfy these requirements before release:

### API Stability

- **Stable public API**: Attributes, properties, events, slots, and CSS custom properties documented
- **Semantic versioning**: Breaking changes MUST increment major version
- **Deprecation policy**: Minimum 2 minor versions warning before removal

### Accessibility Requirements

- **APG pattern compliance**: Document which APG pattern the component implements
- **Keyboard interactions**: Full keyboard support documented in component docs
- **ARIA attributes**: Required ARIA roles, states, and properties documented
- **Known limitations**: Any a11y gaps MUST be documented with workaround or roadmap

### Testing Evidence

- **Unit tests**: Core logic tested
- **A11y automation**: axe-core or similar MUST pass
- **Manual checklist link**: Link to manual testing checklist (focus management, screen reader, etc.)
- **Visual regression**: Snapshot tests for appearance stability

## Documentation Contract

Documentation is a product, not an afterthought.

### Headless Docs Engine

- **Content packs**: Docs are Markdown/MDX files with frontmatter metadata
- **Renderers consume packs**: Docs engine is decoupled from presentation
- **Portable format**: No proprietary markup; standard MDX with frontmatter

### Component Manifest (Machine-Readable)

Every component MUST ship a manifest entry in JSON:

```json
{
  "id": "button",
  "name": "Button",
  "status": "stable",
  "availabilityTags": ["public"],
  "platforms": ["wc", "react", "html-recipe"],
  "a11y": {
    "apgPattern": "button",
    "keyboardSupport": ["Enter", "Space"],
    "knownLimitations": []
  },
  "tokensUsed": ["color.action", "spacing.component", "typography.label"],
  "recommendedUsage": "Primary actions, form submissions",
  "antiPatterns": "Do not use for navigation; use Link instead"
}
```

### Required Manifest Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (kebab-case) |
| `name` | string | Display name |
| `status` | enum | `alpha` \| `beta` \| `stable` |
| `availabilityTags` | array | `public`, `enterprise`, `internal-only`, `regulated` |
| `platforms` | array | `wc`, `react`, `html-recipe` |
| `a11y.apgPattern` | string | APG pattern name or `custom` |
| `a11y.keyboardSupport` | array | Supported keyboard interactions |
| `a11y.knownLimitations` | array | Documented a11y gaps |
| `tokensUsed` | array | Semantic token groups consumed |
| `recommendedUsage` | string | Short guidance (long form in MDX) |
| `antiPatterns` | string | What NOT to do (long form in MDX) |

### Edition/Tenant Filtering

- **Config-driven visibility**: Components and docs filtered by tenant config, not manual editing
- **Base + overlay model**: Base content packs + tenant-specific overlays
- **White-label ready**: Docs MUST support brand replacement without code changes

## Spec Kit Discipline

Separation of concerns in design artifacts is mandatory.

| File | Purpose | Contains |
|------|---------|----------|
| `spec.md` | WHAT and WHY | Requirements, user stories, acceptance criteria, **approach analysis** |
| `plan.md` | HOW | Architecture decisions, technology choices, structure |
| `tasks.md` | Actionable steps | Ordered implementation tasks |

**Enforcement**: Code reviews MUST verify correct separation. Implementation details in `spec.md` is a review blocker. Requirements in `tasks.md` is a review blocker.

### Research Requirement

Every spec MUST include an **Approach Analysis** section that documents research into implementation alternatives. This requirement ensures informed decision-making and creates a record of why specific approaches were chosen.

**Required content**:

1. **Approaches Considered**: Minimum 2 distinct approaches (3+ for complex features)
2. **Pros/Cons Analysis**: Each approach MUST list concrete advantages and disadvantages
3. **Evaluation Criteria**: Criteria MUST align with constitution principles (Performance, Accessibility, Customizability)
4. **Recommendation**: Clear recommendation with justification referencing the analysis

**Approach Analysis format**:

```markdown
## Approach Analysis

### Evaluation Criteria
- [Criterion 1]: [Why it matters for this feature]
- [Criterion 2]: [Why it matters for this feature]

### Approach A: [Name]
[Brief description]

**Pros**:
- [Concrete advantage]

**Cons**:
- [Concrete disadvantage]

### Approach B: [Name]
[Brief description]

**Pros**:
- [Concrete advantage]

**Cons**:
- [Concrete disadvantage]

### Recommendation
**Recommended: Approach [X]**

[Justification referencing evaluation criteria and constitution principles]
```

**Enforcement**: Specs without Approach Analysis are incomplete and MUST NOT proceed to planning phase.

## Dependency Management

### Package Manager

- **pnpm required**: All installations MUST use pnpm for consistency and disk efficiency
- **Workspace protocol**: Internal packages use `workspace:*` protocol

### Version Policy

- **Check before install**: Before adding ANY dependency, search for the latest stable version
- **Pin versions**: Exact versions in `package.json` (`1.2.3` not `^1.2.3`)
- **Audit regularly**: `pnpm audit` MUST pass in CI

### Dependency Addition Process

1. Search for latest stable version (npm, GitHub releases)
2. Evaluate bundle impact (bundlephobia or similar)
3. Check for security advisories
4. Document justification in PR description
5. Add to approved dependencies list if new

## Governance

### Amendment Process

1. Propose change via ADR (Architecture Decision Record)
2. Discussion period: minimum 1 week
3. Approval: Requires maintainer consensus
4. Migration plan: Breaking changes require documented migration path
5. Version bump: Follow semantic versioning for constitution changes

### Versioning Policy

- **Semantic versioning**: MAJOR.MINOR.PATCH
- **MAJOR**: Backward-incompatible principle changes, removal of guarantees
- **MINOR**: New principles, expanded guidance, new sections
- **PATCH**: Clarifications, typo fixes, non-semantic changes

### Contribution Gates

All PRs MUST pass these gates before merge:

- [ ] **A11y evidence**: Automated tests pass; manual checklist completed
- [ ] **Performance check**: Bundle size delta reported; no regressions without justification
- [ ] **API stability**: Public API changes documented; breaking changes follow deprecation policy
- [ ] **Spec Kit discipline**: Correct artifact separation verified

### ADR Requirements

- **Unresolved decisions**: If a technical decision is unresolved, write an ADR before shipping
- **No irreversible APIs**: Do NOT ship public APIs before resolving open ADRs that affect them
- **ADR format**: Follow standard ADR format (Context, Decision, Consequences)

### Compliance Review

- All PRs MUST verify compliance with this constitution
- Complexity MUST be justified against simplicity principles
- Performance regressions MUST be justified and approved

**Version**: 1.0.0 | **Ratified**: 2026-01-01 | **Last Amended**: 2026-01-01
