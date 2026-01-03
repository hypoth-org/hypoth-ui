# Research: Baseline Web Components

**Feature**: 007-baseline-components
**Date**: 2026-01-03

## Research Topics

### 1. Icon Library Selection

**Decision**: Use Lucide Icons with a Web Component adapter

**Rationale**:
- 1,600+ icons vs Heroicons' 316 (5x more coverage)
- Default choice of shadcn/ui - strong community adoption and ecosystem
- Mature TypeScript support with `LucideIcon` type exports
- `createElement()` API returns SVGElement directly, making Web Component wrapping straightforward
- Tree-shakable ES Modules (~200 bytes per icon gzipped)
- SSR-compatible (standard SVG output)

**Alternatives Considered**:
- **Heroicons**: Fewer icons (316), historically weaker TypeScript support, no significant advantages for our use case
- **Phosphor Icons**: Comparable to Lucide but less established in the React/design system ecosystem

**Implementation Notes**:
- Create `icon-adapter.ts` that imports icons from `lucide` package
- Use `createElement(IconName)` to generate SVG elements
- Icon component wraps SVG with sizing/color token integration

### 2. Spinner Accessibility with Reduced Motion

**Decision**: Replace rotation with opacity pulse when `prefers-reduced-motion: reduce` is active

**Rationale**:
- WCAG 2.3.3 allows essential animations but recommends alternatives
- A fully stopped spinner appears as if the app is frozen
- Opacity/color transitions are well-tolerated by users with vestibular disorders
- Major design systems (Chakra, Framer Motion) use this approach

**Alternatives Considered**:
- **Full stop**: Rejected - makes loading state ambiguous
- **Slower rotation**: Still problematic for vestibular disorders
- **Static loading text only**: Loses visual feedback

**Implementation**:
```css
@layer components {
  .ds-spinner {
    animation: ds-spin 1s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .ds-spinner {
      animation: ds-pulse 2s ease-in-out infinite;
    }
  }

  @keyframes ds-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes ds-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
}
```

### 3. VisuallyHidden CSS Technique

**Decision**: Use `clip-path: inset(50%)` technique with 1px dimensions

**Rationale**:
- Modern approach with 99.5% browser support
- Works correctly with RTL languages
- Screen magnifiers show visual cursor at correct position
- No deprecated properties required

**Alternatives Considered**:
- **position: absolute + left: -10000px**: Breaks RTL, cursor goes off-viewport
- **clip: rect(0 0 0 0)**: Deprecated, redundant with clip-path

**Critical Requirements**:
- `width: 1px; height: 1px` - Safari doesn't focus zero-dimension elements
- `white-space: nowrap` - NVDA interprets wrapped text incorrectly
- Never use `display: none` or `visibility: hidden` (hides from screen readers)

**Implementation**:
```css
@layer components {
  .ds-visually-hidden {
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  /* For focusable elements (skip links, etc.) */
  .ds-visually-hidden--focusable:not(:focus):not(:active):not(:focus-within) {
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
}
```

### 4. External Link Indicator Pattern

**Decision**: Use combination of visual icon + VisuallyHidden text for external links

**Rationale**:
- Visual users see external link icon
- Screen reader users hear "opens in new tab" announcement
- Follows WCAG 2.4.4 (Link Purpose)

**Implementation**:
```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Link text
  <ds-icon name="external-link" size="sm" aria-hidden="true"></ds-icon>
  <ds-visually-hidden>(opens in new tab)</ds-visually-hidden>
</a>
```

### 5. Text Component Semantic Element Mapping

**Decision**: Use dynamic element creation via Lit's `unsafeStatic` for `as` prop

**Rationale**:
- Light DOM requires actual element creation, not wrapper div
- Lit's `unsafeStatic` allows dynamic tag names in templates
- Validates `as` prop against allowed values at runtime

**Implementation Notes**:
- Validate `as` prop: span, p, h1-h6
- Default to `span` for invalid values (with console warning in dev)
- Use `unsafeStatic` to create the element: `html\`<${unsafeStatic(this.as)}>...</${unsafeStatic(this.as)}>\``

## Token Dependencies

Research confirmed the following tokens need to exist or be added:

| Token Path | Usage | Status |
|------------|-------|--------|
| `color.primary` | Button primary, Spinner | Exists |
| `color.link.default` | Link default color | **Needs verification** |
| `color.link.hover` | Link hover state | **Needs verification** |
| `color.link.visited` | Link visited state | **Needs verification** |
| `color.text.muted` | Text muted variant, Link muted | Exists |
| `color.semantic.success` | Text success variant | **Needs verification** |
| `color.semantic.warning` | Text warning variant | **Needs verification** |
| `color.semantic.error` | Text error variant | **Needs verification** |
| `sizing.icon.xs` - `sizing.icon.xl` | Icon sizes | **Needs creation** |
| `sizing.spinner.sm` - `sizing.spinner.lg` | Spinner sizes | **Needs creation** |
| `motion.duration.slow` | Spinner animation | **Needs verification** |
| `motion.easing.linear` | Spinner animation | **Needs verification** |

## Dependencies to Add

| Package | Version | Purpose | Bundle Impact |
|---------|---------|---------|---------------|
| `lucide` | ^0.468.0 | Icon library | ~200 bytes/icon (tree-shakable) |

Note: Using the vanilla `lucide` package, not `lucide-react`, for better Web Component integration.
