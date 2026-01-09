# Research: Design System Quality Overhaul

**Feature**: 022-ds-quality-overhaul
**Date**: 2026-01-09
**Phase**: 0 (Technology Research)

## Executive Summary

This research evaluates technology options for the five major workstreams identified in the spec:
1. Build-time style props system
2. SSR-safe ID generation
3. 12-step color scale implementation
4. APG accessibility patterns
5. CLI copy/paste model

## 1. Build-Time Style Props System

### Problem Statement

Provide Chakra-like style props (`<Box px={4} bg="primary">`) without runtime CSS-in-JS overhead, aligned with the constitution's "Zero runtime styling in Core" requirement.

### Options Evaluated

#### Option A: Panda CSS

**Description**: Zero-runtime CSS-in-JS framework from the Chakra UI team. Compiles style props to atomic CSS at build time.

**How it works**:
```tsx
// Developer writes
<Box px={4} bg="primary.9" />

// Panda generates at build time
<div class="px_4 bg_primary-9" />

// CSS output (atomic classes)
.px_4 { padding-inline: var(--spacing-4); }
.bg_primary-9 { background: var(--colors-primary-9); }
```

**Pros**:
- Designed specifically for style props use case
- Excellent TypeScript support with token autocomplete
- Supports responsive syntax `{{ base: 2, md: 4 }}`
- Tree-shakeable - unused styles not in bundle
- Active development, good documentation

**Cons**:
- Requires build plugin integration (PostCSS/Vite/Webpack)
- Additional config file (`panda.config.ts`)
- Learning curve for team unfamiliar with atomic CSS

**Bundle impact**: 0KB runtime (build-time only)

#### Option B: Vanilla Extract + Sprinkles

**Description**: Type-safe CSS-in-TS that generates static CSS at build time. Sprinkles adds atomic utility prop support.

**How it works**:
```tsx
// Define sprinkles in .css.ts file
const sprinkles = createSprinkles(responsiveProperties);

// Use in component
<Box className={sprinkles({ px: 4, bg: 'primary.9' })} />
```

**Pros**:
- Mature, battle-tested (used by Shopify Polaris, Atlassian)
- Type-safe with excellent IDE support
- CSS output is standard, inspectable
- No runtime, full static extraction

**Cons**:
- Requires separate `.css.ts` files for styles
- Sprinkles API slightly more verbose than Panda
- Less intuitive for developers used to inline style props

**Bundle impact**: 0KB runtime (build-time only)

#### Option C: Custom Token-to-CSS Transformer

**Description**: Build a minimal custom transformer that converts style props to CSS variable references.

**How it works**:
```tsx
// Custom transformer at build time
<Box px={4} bg="primary.9" />
// Transforms to
<div style="--box-px: var(--ds-spacing-4); --box-bg: var(--ds-color-primary-9);" class="ds-box" />
```

**Pros**:
- Full control over implementation
- No external dependencies
- Can be tailored exactly to our token system

**Cons**:
- Significant development effort
- Must build responsive support from scratch
- No community, testing burden entirely on us
- Reinventing what Panda/Vanilla Extract already solve

**Bundle impact**: Depends on implementation

### Recommendation: Panda CSS

**Justification**:
1. **Performance**: Zero runtime, aligns with constitution
2. **DX**: Native style props syntax matches user expectation from spec (Chakra-like)
3. **Maintenance**: Active project with Chakra team support
4. **Integration**: PostCSS plugin works with existing build pipeline
5. **Tokens**: Native support for CSS variable tokens

**Integration plan**:
- Add `@pandacss/dev` as devDependency to `@ds/react`
- Configure `panda.config.ts` to use our DTCG tokens
- Style props only available in React (WC uses CSS classes directly)

---

## 2. SSR-Safe ID Generation

### Problem Statement

Components like Dialog, Select, and Menu generate IDs for ARIA relationships (`aria-labelledby`, `aria-controls`). These IDs must match between server and client renders to avoid hydration mismatches.

### Options Evaluated

#### Option A: React 18 `useId()`

**Description**: Built-in React hook that generates stable, unique IDs that are consistent between server and client.

**How it works**:
```tsx
function Dialog() {
  const id = useId();
  return (
    <>
      <h2 id={`${id}-title`}>Title</h2>
      <div aria-labelledby={`${id}-title`}>Content</div>
    </>
  );
}
```

**Pros**:
- Built into React 18, no dependencies
- Automatically SSR-safe
- IDs are scoped and unique
- Battle-tested by React team

**Cons**:
- React-only (WC needs separate solution)
- Must be called in component body (hook rules)

#### Option B: Tree-Position Based Generation

**Description**: Generate IDs based on component's position in the render tree (depth + sibling index).

**How it works**:
```tsx
// Custom context tracks position
const id = useTreePositionId(); // Returns "0-2-1" based on tree position
```

**Pros**:
- Framework-agnostic approach
- Deterministic based on structure

**Cons**:
- Complex to implement correctly
- Brittle if tree structure changes
- Significant development effort

#### Option C: Counter with Reset

**Description**: Global counter that resets at server render boundary.

**How it works**:
```tsx
let counter = 0;
export function generateId(prefix: string) {
  return `${prefix}-${counter++}`;
}
// Reset counter before each SSR render
```

**Pros**:
- Simple implementation
- Works with any framework

**Cons**:
- Requires explicit reset at SSR boundary
- Easy to forget reset, causing subtle bugs
- Race conditions in concurrent rendering

### Recommendation: React 18 `useId()` + Behavior Primitive Option

**Justification**:
1. **React adapters**: Use `useId()` hook directly - zero effort, proven solution
2. **WC/Primitives**: Add `generateId` option to behavior primitives, allowing custom ID generator injection
3. **Default fallback**: For non-React environments, use crypto.randomUUID() (acceptable since WC don't SSR)

**Implementation**:
```typescript
// @ds/react/hooks/use-stable-id.ts
export function useStableId(prefix?: string) {
  const id = useId();
  return prefix ? `${prefix}-${id}` : id;
}

// @ds/primitives-dom - behavior accepts optional ID generator
interface BehaviorOptions {
  generateId?: () => string;
}
```

---

## 3. 16-Step Color Scale Implementation

### Problem Statement

Current tokens have single color values. Need multi-step scales for nuanced UI with enhanced layering support. The industry-standard 12-step (Radix) provides only 2 background levels, which is insufficient for modern layered UIs (page → card → nested card → deep nested).

### Options Evaluated

#### Option A: 12-Step (Radix Standard)

**Description**: Use Radix Colors' 12-step model directly.

**Radix scale semantics**:
- Steps 1-2: App backgrounds (only 2 levels)
- Steps 3-5: Component backgrounds (hover, active states)
- Steps 6-7: Borders and separators
- Steps 8-9: Solid backgrounds
- Steps 10: Low-contrast text
- Steps 11-12: High-contrast text

**Pros**:
- Industry standard (Radix, Linear, Vercel)
- Well-researched WCAG contrast ratios

**Cons**:
- Only 2 background levels - insufficient for nested UIs
- Limited solid color states (2 steps)

#### Option B: 16-Step Extended Scale

**Description**: Extend to 16 steps for better layering and more solid color states.

**16-step allocation**:
- Steps 1-4: Backgrounds (page, card, nested, deep nested)
- Steps 5-7: Interactive backgrounds (normal, hover, active)
- Steps 8-10: Borders (subtle, default, strong)
- Steps 11-14: Solid colors (default, hover, active, emphasis)
- Steps 15-16: Text (muted, default)

**Pros**:
- 4 background levels for complex layered UIs
- 4 solid color states for nuanced interactions
- Symmetric dark mode inversion (1↔16)
- More flexibility for designers

**Cons**:
- Non-standard (developers familiar with Radix need to learn new mapping)
- Adjacent steps may be harder to distinguish visually
- More tokens to maintain (16 × colors instead of 12)

#### Option C: 12-Step + Alpha Overlay

**Description**: Keep 12 primitive steps but add alpha variants for layering.

**Pros**:
- Radix compatibility
- Infinite layering gradations

**Cons**:
- Mixed mental model (steps vs alphas)
- Alpha compositing can be unpredictable

### Recommendation: 16-Step Extended Scale (Option B)

**Justification**:
1. **Layering**: 4 distinct background levels for modern nested UIs (dashboards, settings panels, nested cards)
2. **Flexibility**: More solid color states for button/badge variations
3. **Symmetry**: Clean 1↔16 dark mode inversion
4. **DTCG alignment**: Explicit steps are cleaner than alpha variants in token files

**Token structure**:
```json
{
  "color": {
    "blue": {
      "1": { "$value": "#fafcff", "$description": "Page background" },
      "2": { "$value": "#f5f9ff", "$description": "Raised surface" },
      "3": { "$value": "#edf4ff", "$description": "Nested surface" },
      "4": { "$value": "#e1edff", "$description": "Deep nested" },
      "5": { "$value": "#d3e4ff", "$description": "Element background" },
      "6": { "$value": "#c1d9ff", "$description": "Element hover" },
      "7": { "$value": "#a8c8ff", "$description": "Element active" },
      "8": { "$value": "#8ab4ff", "$description": "Subtle border" },
      "9": { "$value": "#6a9eff", "$description": "Default border" },
      "10": { "$value": "#4a88ff", "$description": "Strong border" },
      "11": { "$value": "#0066cc", "$description": "Solid default" },
      "12": { "$value": "#0059b3", "$description": "Solid hover" },
      "13": { "$value": "#004d99", "$description": "Solid active" },
      "14": { "$value": "#004080", "$description": "Solid emphasis" },
      "15": { "$value": "#003366", "$description": "Muted text" },
      "16": { "$value": "#001d3d", "$description": "Default text" }
    },
    "primary": {
      "default": { "$value": "{color.blue.11}" },
      "hover": { "$value": "{color.blue.12}" },
      "active": { "$value": "{color.blue.13}" },
      "subtle": { "$value": "{color.blue.2}" },
      "muted": { "$value": "{color.blue.15}" },
      "foreground": { "$value": "#ffffff" }
    }
  }
}
```

---

## 4. APG Accessibility Patterns

### Problem Statement

Four components need APG pattern alignment: Tree, DataTable, Stepper, NavigationMenu.

### Research by Component

#### Tree (WAI-ARIA Treeview Pattern)

**Required ARIA attributes**:
- `role="tree"` on container
- `role="treeitem"` on each node
- `aria-expanded` on expandable nodes
- `aria-selected` for selection
- `aria-level` (1-based depth)
- `aria-setsize` (siblings count)
- `aria-posinset` (position among siblings)

**Keyboard interactions**:
- Arrow Up/Down: Navigate items
- Arrow Right: Expand or move to first child
- Arrow Left: Collapse or move to parent
- Home/End: First/last item
- * (asterisk): Expand all siblings

**Current gaps** (from audit):
- Missing `aria-level`, `aria-setsize`, `aria-posinset`
- Need to calculate these from tree structure

#### DataTable (WAI-ARIA Grid Pattern)

**Required ARIA attributes**:
- `role="grid"` on table
- `role="rowgroup"` on thead/tbody
- `role="row"` on tr
- `role="columnheader"` on th
- `role="gridcell"` on td
- `aria-sort` on sortable headers
- Live region for sort announcements

**Keyboard interactions**:
- Arrow keys: Navigate cells
- Home/End: First/last cell in row
- Ctrl+Home/End: First/last cell in grid
- Page Up/Down: Scroll by page

**Current gaps**:
- Sort changes don't announce to screen readers
- Need `aria-live` region for announcements

#### Stepper (Custom Pattern)

**Note**: No APG pattern exists for steppers. Use custom implementation based on best practices.

**Recommended ARIA**:
- `role="group"` on stepper container
- `aria-label="Progress"` on container
- `aria-current="step"` on active step
- Progress described via `aria-labelledby`

**Research sources**: Deque patterns, Inclusive Components

#### NavigationMenu (WAI-ARIA Menubar Pattern)

**Required ARIA attributes**:
- `role="menubar"` on container
- `role="menuitem"` on top-level items
- `role="menu"` on submenus
- `aria-haspopup` on items with submenus
- `aria-expanded` on expandable items

**Keyboard interactions**:
- Left/Right: Navigate menubar items
- Down: Open submenu or move down in submenu
- Up: Move up in submenu
- Escape: Close submenu
- Enter/Space: Activate item

**Current gaps**:
- Audit indicates menubar pattern not fully implemented
- Need role corrections throughout hierarchy

---

## 5. CLI Copy/Paste Model

### Problem Statement

Provide shadcn/ui-style component copying so developers can own source code without library version coupling.

### Options Evaluated

#### Option A: Source Template Extraction

**Description**: CLI copies component source files to user's project, updating imports.

**How it works**:
```bash
npx @ds/cli copy button

# Creates in user's project:
# components/ui/button.tsx
# components/ui/button.css
```

**Implementation approach**:
1. Store "copyable" versions of components in CLI package
2. Transform imports to relative paths
3. Copy dependencies recursively
4. Generate index file for exports

**Pros**:
- Full shadcn/ui compatibility
- Users own the code
- No version coupling

**Cons**:
- Must maintain two versions (npm + copy)
- Import transformation is complex
- Users may diverge and miss bug fixes

#### Option B: Ejectable Components

**Description**: Components work from npm by default, but can be "ejected" to local source when customization is needed.

**How it works**:
```bash
npx @ds/cli eject button
# Copies to project and updates import map
```

**Pros**:
- Gradual adoption (use npm until you need to customize)
- Clear mental model (ejecting is commitment)

**Cons**:
- Mixed model may be confusing
- Still have import transformation complexity

### Recommendation: Option A (Source Template Extraction)

**Justification**:
1. **User expectation**: shadcn/ui set the standard, users expect this model
2. **Simplicity**: Clear mental model - copied files are yours
3. **Implementation**: Store templates alongside npm source, CLI handles transforms

**CLI command design**:
```bash
# Copy single component
npx @ds/cli copy button

# Copy with dependencies
npx @ds/cli copy dialog
# Prompts: "Dialog requires: Button, Portal. Copy all? (Y/n)"

# List available components
npx @ds/cli list

# Configure output directory
npx @ds/cli init
# Creates ds.config.json with outputDir, tsconfig paths
```

---

## Technology Stack Summary

| Workstream | Technology | Rationale |
|------------|------------|-----------|
| Style Props | Panda CSS | Zero-runtime, native style prop syntax, token integration |
| SSR IDs | React useId() + primitive option | Built-in solution, no dependencies |
| Color Scales | 16-step DTCG + OKLCH generation | Enhanced layering (4 bg levels), symmetric dark mode |
| APG Patterns | Manual implementation | Component-specific, no library needed |
| CLI Copy | Source templates + transforms | shadcn/ui-style, user ownership |
| Density | rem units + density-specific token sets | Pre-computed values, no runtime calc() |

---

## 6. Density System and Flexible Units

### Problem Statement

For density (compact/default/spacious) to work, spacing values must be in relative units (`rem`) not fixed `px`. A density multiplier applied to the root affects all `rem`-based values, but `px` values remain fixed and break the density system.

### Current State Audit

Need to audit existing token outputs and component CSS for `px` usage:
- Token spacing values (should output `rem`)
- Component CSS (should use token CSS variables, not hardcoded `px`)
- Typography (line-height, letter-spacing may use `px`)

### Options Evaluated

#### Option A: Full rem Migration

**Description**: Convert all spacing, sizing, and typography tokens to `rem`. Density applies via root `font-size` multiplier.

**How it works**:
```css
/* Density modes via root font-size */
:root { font-size: 16px; } /* default */
:root[data-density="compact"] { font-size: 14px; }
:root[data-density="spacious"] { font-size: 18px; }

/* All tokens in rem */
--ds-spacing-4: 1rem;    /* 16px at default, 14px at compact */
--ds-font-size-md: 1rem; /* scales with density */
```

**Pros**:
- Simple density switching (single CSS property)
- Browser-native scaling
- Respects user font-size preferences

**Cons**:
- Breaks pixel-perfect designs
- May cause unexpected scaling of things that shouldn't scale (borders, icons)
- Hard to have selective density (some things scale, some don't)

#### Option B: CSS Custom Property Multiplier

**Description**: Keep `rem` base but use CSS calc with density multiplier variable.

**How it works**:
```css
:root {
  --ds-density-scale: 1;
  --ds-spacing-4: calc(1rem * var(--ds-density-scale));
}

[data-density="compact"] { --ds-density-scale: 0.875; }
[data-density="spacious"] { --ds-density-scale: 1.125; }
```

**Pros**:
- Fine-grained control over what scales
- Can exclude certain tokens from scaling (borders, icons)
- Doesn't affect browser font-size setting

**Cons**:
- More complex token definitions
- `calc()` in every token is verbose

#### Option C: Density-Specific Token Sets

**Description**: Separate token files for each density mode with pre-computed values.

**How it works**:
```css
/* tokens-default.css */
--ds-spacing-4: 1rem;
--ds-padding-button: 0.5rem 1rem;

/* tokens-compact.css */
--ds-spacing-4: 0.875rem;
--ds-padding-button: 0.375rem 0.75rem;

/* tokens-spacious.css */
--ds-spacing-4: 1.125rem;
--ds-padding-button: 0.625rem 1.25rem;
```

**Pros**:
- Explicit values for each density
- No runtime calculation
- Full control over each token per density

**Cons**:
- Token maintenance burden (3x token definitions)
- Larger CSS output (though can be optimized with CSS layers)

### Recommendation: Option C (Density-Specific Token Sets)

**Justification**:
1. **Control**: Designers want explicit control over compact/spacious values, not just math
2. **Performance**: No runtime `calc()` - values are pre-computed at build time
3. **Flexibility**: Some tokens should scale differently (padding vs border-radius)
4. **DTCG alignment**: Fits naturally with DTCG modes (`$extensions: { mode: "compact" }`)

### Implementation Requirements

1. **Token audit**: Identify all `px` values in current tokens
2. **rem conversion**: Convert spacing/sizing tokens to `rem` base
3. **Density modes**: Create compact/default/spacious token variants
4. **Component CSS audit**: Replace any hardcoded `px` with token variables
5. **Exception list**: Document what intentionally stays in `px`:
   - Borders: `1px` borders are intentional for crisp lines
   - Box shadows: `px` for consistent shadows across densities
   - Icon sizes: May be fixed or use separate icon-size tokens

### Migration Strategy

```bash
# Audit for px usage
grep -r "px" packages/tokens/src/
grep -r "px" packages/css/src/
grep -r "px" packages/wc/src/ --include="*.css"
```

**Expected findings**:
- Spacing values → convert to rem
- Font sizes → already rem (verify)
- Line heights → convert to unitless or rem
- Border widths → keep px (intentional)
- Border radius → convert to rem (scales with density)
- Box shadows → keep px (doesn't scale)

---

## Open Questions

1. **Panda CSS version**: Should we pin to a specific version or use latest? (Recommendation: pin to latest stable at implementation time)
2. **Color scale tooling**: Build OKLCH interpolation ourselves or use a library like Culori? (Recommendation: evaluate Culori, it's ~10KB and well-maintained)
3. **CLI framework**: Continue with Commander.js (already in use) or evaluate alternatives? (Recommendation: keep Commander.js, it's working)
4. **px audit scope**: How thorough should the px-to-rem migration be? (Recommendation: full audit, convert all spacing/sizing, document exceptions)

## Next Steps

1. Create data-model.md with type definitions for all new APIs
2. Create contracts/ with TypeScript interfaces
3. Create quickstart.md for developer onboarding
