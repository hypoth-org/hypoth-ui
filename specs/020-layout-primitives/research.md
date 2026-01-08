# Research: Layout Primitives & Page Composition

**Feature**: 020-layout-primitives
**Date**: 2026-01-08

## Research Topics

### 1. Responsive Value Encoding Strategy

**Context**: Layout components need responsive props (e.g., `direction={{ base: "column", md: "row" }}`). Need to determine how React and WC handle this consistently.

**Decision**: Dual encoding with shared CSS class output

**Rationale**:
- **React**: Object syntax `{ base: "column", md: "row" }` - idiomatic for React props
- **Web Components**: String syntax `"base:column md:row"` - attributes are strings; parsed at render time
- **Shared Output**: Both generate the same CSS classes (e.g., `ds-flow--dir-column ds-flow--md:dir-row`)
- **CSS handles breakpoints**: Pre-generated media query classes apply at correct viewport widths

**Alternatives Considered**:
1. **CSS custom properties with JS updates**: Rejected - requires runtime JS, violates performance principle
2. **Inline style injection**: Rejected - blocks customization, violates constitution
3. **Container queries only**: Rejected - limited browser support for full responsive needs, though may be used as progressive enhancement

---

### 2. Token Validation Strategy

**Context**: FR-014 requires rejecting raw CSS values (e.g., `p="13px"`). Need validation approach that works in dev without production overhead.

**Decision**: Build-time TypeScript types + runtime dev-mode warnings

**Rationale**:
- **TypeScript types**: Constrain props to valid token values at compile time (e.g., `gap: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"`)
- **Dev-mode validation**: Runtime check in development warns about invalid values
- **Production behavior**: Invalid values silently ignored (no crashes, no extra bundle)
- **Class generation**: Only valid token values have corresponding CSS classes

**Alternatives Considered**:
1. **Runtime validation always**: Rejected - unnecessary production bundle size
2. **TypeScript only**: Rejected - WC attributes bypass TS; need runtime feedback for non-TS users
3. **Schema validation**: Rejected - overkill for simple token allowlist

---

### 3. Responsive Class Generation Pattern

**Context**: CSS-only responsive requires pre-generated classes for all breakpoint combinations. Need pattern that scales without combinatorial explosion.

**Decision**: Utility class pattern with data attribute selectors

**Rationale**:
- **Data attributes for props**: `data-direction="column"`, `data-gap="md"` - inspectable, specific
- **Breakpoint variants via classes**: `.ds-flow--md\:dir-row` applies at md breakpoint
- **Base styles via component class**: `.ds-flow` provides flex container defaults
- **CSS custom properties for complex values**: Grid template strings use `--ds-grid-cols` custom property

**Pattern Example**:
```css
/* Base */
.ds-flow { display: flex; }

/* Direction variants */
.ds-flow[data-direction="row"] { flex-direction: row; }
.ds-flow[data-direction="column"] { flex-direction: column; }

/* Responsive overrides */
@media (min-width: 768px) {
  .ds-flow--md\:dir-row { flex-direction: row; }
  .ds-flow--md\:dir-column { flex-direction: column; }
}
```

**Alternatives Considered**:
1. **Inline style generation**: Rejected - blocks customization
2. **All combinations as classes**: Rejected - CSS file explosion for 8 breakpoints × 8 gaps × 4 directions
3. **CSS-in-JS atomic**: Rejected - runtime dependency violates constitution

---

### 4. Polymorphic Element Rendering (`as` prop)

**Context**: All layout components need `as` prop for semantic HTML. Need pattern for both React and WC.

**Decision**: Component-specific polymorphism with semantic defaults

**Rationale**:
- **React**: Use `as` prop to change rendered element (`as="section"`)
- **React asChild**: Use Slot pattern for full element replacement (existing pattern in codebase)
- **Web Components**: Use `as` attribute; component renders appropriate inner element
- **Semantic defaults**: Each component has sensible default (Flow=div, Section=section, Header=header)

**Implementation Pattern (WC)**:
```typescript
@property({ reflect: true }) as: string = "div";

render() {
  const Tag = this.as as keyof HTMLElementTagNameMap;
  return html`<${unsafeStatic(Tag)} class="ds-flow" ...><slot></slot></${unsafeStatic(Tag)}>`;
}
```

**Alternatives Considered**:
1. **No polymorphism**: Rejected - limits semantic HTML usage
2. **Wrapper element always**: Rejected - extra DOM nodes, styling complexity
3. **Shadow DOM with slot**: Rejected - constitution requires Light DOM

---

### 5. AppShell Region Pattern

**Context**: AppShell needs Header, Main, Footer, Sidebar regions with proper landmarks. Need composition pattern.

**Decision**: Compound component pattern with slotted regions

**Rationale**:
- **Named slots (WC)**: `<ds-app-shell><ds-header slot="header">...</ds-header></ds-app-shell>`
- **Children composition (React)**: `<AppShell><AppShell.Header>...</AppShell.Header></AppShell>`
- **Landmark roles automatic**: Header renders with `role="banner"`, Footer with `role="contentinfo"`, Main with `role="main"`
- **CSS Grid layout**: AppShell uses CSS Grid for region positioning; Sidebar placement via attribute

**Alternatives Considered**:
1. **Render props pattern**: Rejected - more complex, less readable
2. **Single component with many props**: Rejected - poor composition, hard to style individual regions
3. **Fully separate components**: Rejected - lose layout coordination; each region needs context

---

### 6. Container Query Integration (Progressive Enhancement)

**Context**: Spec mentions optional container query support for future enhancement.

**Decision**: Defer to future; document upgrade path

**Rationale**:
- **Media queries first**: Full browser support, meets all current requirements
- **Container queries as enhancement**: Can be added later for component-relative sizing
- **No breaking changes**: Container queries would be additive (e.g., new `cq` responsive prefix)
- **Browser support improving**: Once baseline, can add without major refactor

**Upgrade Path**:
1. Add `container-type: inline-size` to Container component
2. Add `@container` variants to CSS (e.g., `.ds-flow--cq-sm\:dir-row`)
3. Update responsive value parser to handle `cq-` prefix
4. Document migration from viewport to container breakpoints

---

### 7. Skip Link Integration for Main

**Context**: Main component must be suitable as skip-link target (FR-023).

**Decision**: Automatic `id` with documented skip-link pattern

**Rationale**:
- **Default id**: `<ds-main id="main-content">` provides stable target
- **Customizable**: `id` prop/attribute allows override
- **tabindex for focus**: Add `tabindex="-1"` to enable programmatic focus
- **Documentation recipe**: Show skip-link implementation in component docs

**Skip Link Recipe**:
```html
<a href="#main-content" class="ds-skip-link">Skip to content</a>
...
<ds-main id="main-content">...</ds-main>
```

---

### 8. Sticky Header/Footer with Safe Area

**Context**: Header/Footer need sticky positioning with safe-area-inset support for notched devices.

**Decision**: CSS-only sticky with safe-area CSS variables

**Rationale**:
- **Sticky via CSS**: `position: sticky; top: 0;` - no JS needed
- **Safe area via env()**: `padding-top: env(safe-area-inset-top, 0px);`
- **Opt-in via attribute**: `sticky` and `safe-area` boolean attributes
- **No z-index collisions**: Use design token for z-index (e.g., `--ds-z-sticky`)

**CSS Pattern**:
```css
.ds-header[data-sticky] {
  position: sticky;
  top: 0;
  z-index: var(--ds-z-sticky);
}

.ds-header[data-safe-area] {
  padding-top: env(safe-area-inset-top, 0px);
}
```

---

## Summary

All research topics resolved with decisions that:
- Align with constitution principles (Performance > Accessibility > Customizability)
- Use existing codebase patterns (Light DOM, DSElement, CSS layers)
- Require no new dependencies
- Support full React + WC feature parity
