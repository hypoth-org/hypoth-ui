# Hypoth-UI Design System Architecture Audit

**Date:** 2026-01-09
**Reviewer:** Principal Engineer Assessment
**Repository:** hypoth-ui
**Version:** Post-021 Audit Remediation

---

## A) Executive Summary

### Core Value Proposition (2-4 sentences)

Hypoth-UI is a **white-label design system** providing Web Components (Lit Light DOM) with React adapters, targeting organizations that need **multi-tenant/multi-brand documentation** and **framework-agnostic component distribution**. Its key differentiation is a robust **behavior primitives layer** (`@ds/primitives-dom`) that extracts accessibility and interaction logic into framework-agnostic factories, enabling true behavioral parity across WC and React implementations.

### 5 Biggest Strengths (with evidence)

1. **Behavior Primitives Architecture** - The `@ds/primitives-dom` package (`packages/primitives-dom/src/index.ts:1-263`) provides 14+ behavior factories (dialog, menu, select, combobox, tabs, slider, etc.) that encapsulate ARIA, keyboard, and focus management. This is comparable to Radix's internal state machines but framework-agnostic.

2. **Light DOM Strategy** - Using Light DOM (`packages/wc/src/base/ds-element.ts:40-42`) enables CSS styling from external stylesheets, form participation via ElementInternals, and standard DOM APIs. This solves the Shadow DOM pain points that plague most WC libraries.

3. **DTCG Token System** - Tokens follow Design Tokens Community Group format (`packages/tokens/src/tokens/`) with semantic aliases, brand overrides (`brands/default`, `brands/acme`), and mode support (`modes/light.json`, `modes/dark.json`, `modes/high-contrast.json`). CSS custom properties are properly namespaced.

4. **CSS Layers Architecture** - Seven-layer cascade (`packages/css/src/layers/index.css:3`) provides predictable specificity: `reset < tokens < base < components < animations < utilities < overrides`. This eliminates specificity wars.

5. **Comprehensive A11y Testing** - 17 dedicated accessibility test files (`packages/wc/tests/a11y/`) using jest-axe, covering ARIA attributes, keyboard interaction, and focus management. Component manifests include explicit accessibility contracts (`packages/wc/src/components/button/manifest.json:9-15`).

### 5 Biggest Risks/Gaps (with evidence)

1. **React Component Coverage Gap** - Only ~31 of 55 components have React adapters (`packages/react/src/components/`). Missing: Accordion, AlertDialog, Breadcrumb, Command, DataTable, NavigationMenu, Pagination, Progress, ScrollArea, Skeleton, Stepper, Table (as complete implementation), Toast (partial), Tree. This forces React users back to WC or blocks adoption.

2. **No Style Props / Theme Object** - Unlike Chakra's `<Box px={4}>` or Radix's `<Button size="2">`, there's no runtime style prop system. All styling is CSS-only. This is intentional but reduces DX for React-centric teams who expect Chakra-like ergonomics.

3. **Incomplete Documentation** - 30 of 55 components lack manifest.json files (see Glob results). No searchable docs site with interactive examples. MDX content exists but isn't deployed. Component API tables are incomplete.

4. **No "Copy/Paste" Adoption Model** - Unlike shadcn/ui where you own the code, Hypoth-UI is library-only. No CLI to scaffold individual components into your codebase. The CLI package (`@ds/cli`) exists but isn't feature-complete.

5. **SSR ID Collision Risk** - Dialog behavior uses incrementing `idCounter` (`packages/primitives-dom/src/behavior/dialog.ts:109-113`). Without deterministic ID generation, server/client hydration mismatches are likely. React 18's `useId` pattern isn't integrated.

### Adoption Readiness Verdict: **Internal-Only**

**Rationale:** The architecture is sound for production use, but:
- React coverage gaps block teams wanting full React parity
- Documentation isn't production-ready for external consumers
- No copy/paste model means high coupling to library versions
- SSR edge cases need validation before Next.js RSC deployment

**Upgrade path to Production-Ready:** Complete React adapters + deploy searchable docs + add useId for SSR + verify RSC compatibility

---

## B) Repo Map & Architecture Overview

### Package Topology (Monorepo)

```
hypoth-ui/
├── packages/
│   ├── tokens/          # DTCG token definitions → CSS/JSON/TS outputs
│   ├── css/             # CSS layers (reset, tokens, base, components)
│   ├── primitives-dom/  # Framework-agnostic behavior factories (ZERO DEPS)
│   ├── wc/              # Lit Web Components (Light DOM)
│   ├── react/           # React adapters (forwardRef, use client)
│   ├── next/            # Next.js App Router loader
│   ├── docs-core/       # Documentation engine (manifest validation)
│   ├── docs-content/    # Manifests + MDX
│   ├── cli/             # Component scaffolding (WIP)
│   ├── test-utils/      # Shared testing utilities
│   └── a11y-audit/      # axe-core audit framework
├── apps/
│   ├── demo/            # Component showcase (Next.js)
│   └── docs/            # Documentation portal (Next.js)
└── tooling/             # Shared configs, generators
```

### Responsibilities & Boundaries

| Package | Responsibility | Dependencies |
|---------|---------------|--------------|
| `@ds/tokens` | Token compilation | None (build-time only) |
| `@ds/css` | Cascade layers | `@ds/tokens`, `@ds/wc` (peer) |
| `@ds/primitives-dom` | Behavior + A11y | **Zero runtime deps** |
| `@ds/wc` | WC implementation | `@ds/primitives-dom`, `lit`, `date-fns` |
| `@ds/react` | React wrappers | `@ds/primitives-dom`, `react` (peer) |
| `@ds/next` | SSR loader | `@ds/wc` (peer), `react` (peer) |

### Component Taxonomy

**Primitives (21):** Button, Checkbox, Input, Textarea, NumberInput, Slider, Radio, Switch, PinInput, FileUpload, Text, Link, Icon, Badge, Tag, Separator, AspectRatio, Progress, Spinner, Skeleton, Tooltip, VisuallyHidden

**Composites (33):** Dialog, AlertDialog, Drawer, Sheet, Popover, HoverCard, Menu, DropdownMenu, ContextMenu, NavigationMenu, Select, Combobox, DatePicker, TimePicker, Tabs, Accordion, Collapsible, Breadcrumb, Pagination, Stepper, Command, Table, DataTable, List, Tree, Card, Avatar, Alert, Toast, Calendar, ScrollArea

**Layout (14 sub-components):** Flow, Container, Grid, Box, Page, Section, AppShell, Header, Footer, Main, Spacer, Center, Split, Wrap

### Rendering Targets

- **Web Components:** Yes (Lit 3.1+, Light DOM)
- **React:** Yes (forwardRef pattern, `use client` directives)
- **SSR/RSC:** Partial - `DsLoader` pattern for Next.js App Router, 34 files with `use client`

### Key Architectural Patterns

1. **Behavior → Component Layering**
   ```
   primitives-dom (behaviors) → wc (Lit) → react (adapters)
                              ↘ react (native implementations using same behaviors)
   ```

2. **Composition Model**
   - Slots for WC: `<slot name="trigger">`, `<slot>`
   - `asChild` for React: Slot primitive for polymorphism (`packages/react/src/primitives/slot.tsx`)
   - No compound component Context pattern in React (each part is standalone element)

3. **State Management**
   - Behavior factories with immutable state updates
   - No external state machine library (XState-like patterns inline)
   - Controlled/Uncontrolled via `defaultValue` + `value` props

---

## C) API Design & Developer Experience Review

### DX Scorecard (1-5 scale)

| Criterion | Score | Justification |
|-----------|-------|---------------|
| Naming Consistency | 4/5 | `ds-` prefix for WC, PascalCase for React. Consistent `variant`, `size` props. |
| Prop Patterns | 4/5 | `disabled`, `loading`, `open` are boolean. `onPress` vs `onClick` inconsistency (Button uses both). |
| Controlled/Uncontrolled | 4/5 | `defaultValue` + `value` pattern. Missing `onValueChange` consistently. |
| Ref Forwarding | 5/5 | All React components use `forwardRef`. WC uses native refs. |
| Event Semantics | 3/5 | Custom events `ds:open`, `ds:close`, `ds:change`. Not standard DOM events. |
| Form Compatibility | 5/5 | ElementInternals for WC (`FormAssociatedMixin`), native form controls for React. |
| TypeScript Ergonomics | 4/5 | Good types. Some `any` for mixin patterns. |
| Error Messages | 2/5 | No dev-mode warnings for common mistakes. |
| Documentation | 2/5 | Manifests exist but no deployed searchable docs. |
| Escape Hatches | 4/5 | `asChild` for React, slots for WC. CSS vars for styling. |
| Import Ergonomics | 5/5 | Granular exports: `@ds/wc/form-controls`, `@ds/wc/overlays`, etc. |
| Polymorphism | 4/5 | `asChild` in React, slot in WC. No `as` prop for HTML element swap. |
| Async State | 3/5 | `loading` prop on Button. No loading states for Select/Combobox. |
| Dark Mode | 4/5 | `data-theme="dark"` attribute. CSS vars swap. No JS API. |
| Animation Control | 4/5 | `animated` prop, `prefersReducedMotion()` utility. |

**Overall DX Score: 3.7/5**

### Concrete API Improvements

#### 1. Standardize Event Naming

**Before:**
```tsx
// Inconsistent across components
<Button onClick={} onPress={} />  // Both exist
<Select onValueChange={} />       // Select
<Dialog onOpenChange={} />        // Dialog
```

**After:**
```tsx
// Consistent pattern
<Button onPress={} />             // Primary activation callback
<Select onValueChange={} />       // Value changes
<Dialog onOpenChange={} />        // Open state changes
```

#### 2. Add `as` Prop for Element Polymorphism

**Before:**
```tsx
<Button asChild>
  <a href="/link">Link Button</a>
</Button>
```

**After:**
```tsx
<Button as="a" href="/link">Link Button</Button>
// or
<Button asChild>...</Button>  // Keep for complex cases
```

#### 3. Add Loading States to Select/Combobox

**Before:**
```tsx
<Select>
  {isLoading ? <SelectLoading /> : items.map(...)}
</Select>
```

**After:**
```tsx
<Select loading={isLoading} loadingText="Loading options...">
  {items.map(...)}
</Select>
```

#### 4. Consistent Callback Props

**Before:**
```tsx
// Dialog
onOpenChange?: (open: boolean) => void

// Select (behavior)
onValueChange: (value) => { ... emitEvent(this, StandardEvents.CHANGE, ...) }
```

**After:**
```tsx
// All controlled components
onOpenChange?: (open: boolean) => void
onValueChange?: (value: T) => void
```

#### 5. Dev Mode Warnings

**Before:** Silent failures when misusing components

**After:**
```tsx
// In development
if (process.env.NODE_ENV !== 'production') {
  if (!this.querySelector('ds-dialog-title')) {
    console.warn('[ds-dialog] Missing required ds-dialog-title for accessibility');
  }
}
```

---

## D) Theming & Tokens (Compare to Radix Themes + Chakra/Once)

### Token Model Analysis

**Structure (DTCG-compliant):**
```
tokens/
├── primitives/     # Raw values (colors.json, spacing.json)
├── global/         # Foundation tokens (color, spacing, typography, radius, shadow, motion, z-index)
├── semantic/       # Contextual aliases (background.default → primitives.white)
├── brands/         # Brand overrides (default/, acme/)
└── modes/          # Theme modes (light, dark, high-contrast, reduced-motion)
```

**Token Coverage:**

| Category | Status | Evidence |
|----------|--------|----------|
| Color | Complete | `global/color.json`, `semantic/colors.json` |
| Typography | Complete | `global/typography.json` |
| Spacing | Complete | `global/spacing.json`, `semantic/spacing.json` |
| Radii | Complete | `global/radius.json` |
| Elevation/Shadow | Complete | `global/shadow.json` |
| Motion | Complete | `global/motion.json`, `modes/reduced-motion.json` |
| Z-Index | Complete | `global/z-index.json` |
| Breakpoints | Complete | `global/breakpoint.json` |
| Opacity | Complete | `global/opacity.json` |
| Icons | Partial | `global/icon.json` (size only, not icon library) |

**Token Consumption:**
- CSS Variables: `--ds-color-primary-default`, `--ds-spacing-md`
- TypeScript: `@ds/tokens/dist/ts/tokens.ts` (generated)
- JSON: `@ds/tokens/dist/json/tokens.json` (generated)
- No runtime style props (Chakra-like `px={4}`)

### Theme Application

**Multi-Theme Support:**
```html
<html data-theme="dark">       <!-- Dark mode -->
<html data-theme="high-contrast">  <!-- High contrast -->
<html data-theme="acme">       <!-- Brand override -->
```

**Per-Component Theming:**
```css
/* Override specific component */
ds-button {
  --ds-color-primary-default: #custom;
}
```

**SSR Safety:**
- CSS variables are SSR-safe
- Theme attribute on `<html>` is server-renderable
- No hydration mismatch for theming (CSS-only)

### Styling Strategy

**Approach:** CSS Variables + CSS Layers (no CSS-in-JS, no Tailwind)

**Pros:**
- Zero runtime cost
- SSR-safe by design
- Override-friendly via CSS cascade
- Works with any bundler

**Cons:**
- No type-safe style props
- Verbose compared to Tailwind
- No style composition utilities

### Radix Themes Parity Analysis

| Feature | Radix Themes | Hypoth-UI | Gap |
|---------|-------------|-----------|-----|
| Color scales (12 steps) | Yes | No (single values) | Missing |
| Accent color system | Yes | Partial (primary only) | Missing secondary/neutral |
| Gray scale options | Yes (6 grays) | No | Missing |
| Radius scale | Yes (1-6) | Partial (sm/md/lg) | OK |
| Scaling (1-9) | Yes | No | Missing density system |
| Panel background | Yes | Partial | Missing glass effects |
| High contrast mode | Yes | Yes | Parity |
| Dark mode | Yes | Yes | Parity |

### Chakra-like Ergonomics Analysis

| Feature | Chakra | Hypoth-UI | Gap |
|---------|--------|-----------|-----|
| Style props (`px`, `bg`) | Yes | No | Missing |
| Theme object | Yes | No (CSS vars only) | Missing |
| Responsive syntax | Yes (`base`, `md`) | No | Missing |
| Color mode hook | Yes | No | Missing |
| Theme extensions | Yes | Partial (CSS vars) | Limited |

### Missing Primitives

1. **Color System:** No 12-step color scales, no automatic contrast calculation
2. **Density/Scaling:** No compact/comfortable/spacious modes
3. **Responsive Variants:** No breakpoint-aware component sizing
4. **Component Recipes:** No pre-configured variant combinations

---

## E) Accessibility & Interaction Contract (Compare to Headless Libs)

### Keyboard Support Analysis

| Component | Arrow Keys | Enter/Space | Escape | Tab | Typeahead | RTL |
|-----------|-----------|-------------|--------|-----|-----------|-----|
| Button | N/A | Yes | N/A | Yes | N/A | N/A |
| Dialog | N/A | N/A | Yes | Trapped | N/A | N/A |
| Menu | Yes | Yes | Yes | N/A | Yes | Partial |
| Select | Yes | Yes | Yes | Yes | Yes | Partial |
| Combobox | Yes | Yes | Yes | Yes | Yes | Partial |
| Tabs | Yes | Yes | N/A | Yes | N/A | Partial |
| Accordion | N/A | Yes | N/A | Yes | N/A | N/A |

**Evidence:** `packages/primitives-dom/src/keyboard/roving-focus.ts`, `packages/primitives-dom/src/keyboard/type-ahead.ts`

### Focus Management

- **Focus Trap:** `createFocusTrap()` (`packages/primitives-dom/src/focus/focus-trap.ts`)
- **Focus Scope:** `createFocusScope()` (`packages/primitives-dom/src/focus/focus-scope.ts`)
- **Roving Focus:** `createRovingFocus()` for lists/menus
- **Focus Return:** Implemented in dialog behavior (`context.triggerElement`)
- **Focus Visible:** Relies on `:focus-visible` CSS (no JS polyfill)

### ARIA Correctness

**Dialog Example (verified in test):**
```html
<ds-dialog-content
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-1-title"
  aria-describedby="dialog-1-description"
  tabindex="-1">
```

**Evidence:** `packages/wc/tests/a11y/dialog.test.ts:111-245`

### Screen Reader Expectations

| Component | Announcement | Status |
|-----------|-------------|--------|
| Button | "Button, [label]" | Verified |
| Dialog | "Dialog, [title]" | Verified |
| Menu | "Menu, [n] items" | Verified |
| Select | "Combobox, [value]" | Verified |
| Loading | "Loading" via aria-busy | Verified |

### Reduced Motion Support

```ts
// packages/primitives-dom/src/animation/motion-preference.ts
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

Components check this before animating (`dialog.ts:163`, `select.ts:218`).

### High Contrast Support

- Token mode: `modes/high-contrast.json`
- Applies via `data-theme="high-contrast"`
- No forced-colors-mode CSS detection

### Form Accessibility

**Label Association:**
```html
<ds-field>
  <ds-field-label for="input-1">Name</ds-field-label>
  <ds-input id="input-1" name="name"></ds-input>
  <ds-field-error>Required</ds-field-error>
</ds-field>
```

**Error Messaging:** `aria-describedby` links to error element

**Validity:** ElementInternals `setValidity()` integration (`packages/wc/src/base/form-associated.ts`)

### A11y Maturity Rating: **4/5 (Good)**

**Strengths:**
- Behavior primitives ensure ARIA correctness
- Focus management is comprehensive
- axe-core tests for all major components

**Gaps:**
- No live region announcements for dynamic content
- RTL support is partial (no logical properties)
- No forced-colors-mode support
- Missing skip-link patterns

### Components Needing APG Alignment

1. **Tree:** Needs aria-expanded, aria-level, aria-setsize, aria-posinset
2. **DataTable:** Needs sortable column announcements
3. **Stepper:** Needs aria-current for active step
4. **NavigationMenu:** Needs menubar role pattern

### Recommended Test Plan

```
Unit Tests (Vitest + jest-axe):
├── Automated axe violations
├── ARIA attribute presence
├── Keyboard event handling
└── Focus management

Integration Tests (Playwright):
├── Screen reader announcements (NVDA/VoiceOver)
├── Focus order verification
├── Reduced motion behavior
└── High contrast mode rendering

Manual Checklist:
├── VoiceOver + Safari
├── NVDA + Chrome
├── JAWS + Edge
├── Dragon NaturallySpeaking
└── Switch control navigation
```

### Accessibility Contract Enforcement

**Current:** Manifests include `accessibility` field with:
- `apgPattern`: Reference to WAI-ARIA APG pattern
- `keyboard`: Supported keys
- `screenReader`: Expected announcements
- `ariaPatterns`: Required ARIA attributes

**Example:** `packages/wc/src/components/button/manifest.json:9-15`

**Enforcement:** Validation via `pnpm validate:manifests`, but not enforced in CI for a11y contract compliance.

---

## F) Performance & Compatibility

### Bundle Size & Tree-Shaking

**Package Sizes (built):**
```
@ds/wc:      1.8 MB (all components)
@ds/react:   584 KB
@ds/css:     144 KB
@ds/tokens:  144 KB
```

**Tree-Shaking Configuration:**
- `"sideEffects": false` in `packages/wc/package.json`
- Granular exports: `@ds/wc/form-controls`, `@ds/wc/overlays`, etc.
- ESM-only (`"type": "module"`)

**Single Component Import:**
```ts
// Tree-shakeable
import { DsButton } from '@ds/wc/primitives';
// Full bundle
import { DsButton } from '@ds/wc';
```

### Runtime Costs

| Cost | Description | Mitigation |
|------|-------------|------------|
| Lit Runtime | ~16KB gzipped | Unavoidable for WC |
| date-fns | DatePicker/TimePicker only | Tree-shakes |
| Behavior Factories | Created per-component | Lightweight closures |
| Portal Creation | Dialog/Popover/Menu | Single portal per type |
| Event Listeners | Keyboard handlers | Cleaned up on disconnect |

### SSR/RSC Compatibility

**Analysis:**

| Pattern | Status | Evidence |
|---------|--------|----------|
| `use client` | 34 files | Grep: `packages/react/src` |
| `useLayoutEffect` | Not used | Safe |
| `window/document` | Guarded | `isBrowser()` check |
| Deterministic IDs | **RISK** | `idCounter++` pattern |
| Dynamic imports | Used in DsLoader | OK |

**ID Collision Risk:**
```ts
// packages/primitives-dom/src/behavior/dialog.ts:109-113
let idCounter = 0;
function defaultGenerateId(): string {
  return `dialog-${++idCounter}`;
}
```

**Recommendation:** Use `generateId` option with React 18's `useId()` or `crypto.randomUUID()`.

### Dependency Risk

**Direct Dependencies:**
- `lit@3.1.0` - Stable, maintained by Google
- `date-fns@4.1.0` - Stable, tree-shakeable
- `lucide@0.468.0` - Icon library, optional

**No Vulnerability Concerns:** Clean `pnpm audit`

### Compatibility Matrix

| Environment | Status | Notes |
|-------------|--------|-------|
| Next.js SSR | Works | DsLoader pattern |
| Next.js RSC | **Caution** | ID collision risk |
| Remix | Untested | Should work |
| Vite CSR | Works | |
| Plain HTML | Works | Import `@ds/wc` |
| Astro | Untested | Should work (Islands) |

### Performance Quick Wins

1. **Lazy-load DatePicker** - 40KB due to date-fns
2. **Virtualize long lists** - Already supported via `virtualize` prop
3. **Code-split overlays** - Dialog/Sheet/Drawer can be async
4. **Preload critical CSS** - `@ds/css/dist/index.css`

---

## G) Code Quality & Maintainability

### TypeScript Analysis

**Configuration:**
```json
// tsconfig.base.json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true,
  "target": "ES2022"
}
```

**Type Ergonomics:**
- Component props have explicit interfaces
- Generics used for Select/Combobox value types
- Mixin patterns require `any[]` (acknowledged via biome-ignore)

### Test Strategy

| Test Type | Coverage | Tool |
|-----------|----------|------|
| Unit | Good | Vitest |
| A11y | 17 files | jest-axe |
| Integration | Minimal | Playwright (configured) |
| Visual Regression | None | - |
| Shared Tests | 1 file | `@ds/test-utils` |

**Test Counts:**
- WC: 950 tests passing
- React: 250 tests passing

### Linting/Formatting

**Tool:** Biome 1.9.4
**Configuration:** `biome.json`
- TypeScript strict checks
- Import organization
- 100-character line width
- Consistent formatting

### Build Tooling

| Tool | Purpose |
|------|---------|
| tsup | Bundle WC/React packages |
| tsx | TypeScript runner for scripts |
| PostCSS | CSS imports + minification |
| style-dictionary | Token compilation |
| changesets | Versioning |

### Contribution Model

**Component Generator:**
```bash
pnpm new-component card layout "A container for grouping content"
```

Creates:
- WC implementation
- CSS file
- React wrapper
- Manifest
- MDX documentation

### Top 10 Maintainability Issues

1. **ID Counter Pattern** - `dialog.ts:109` - Use factory with injected ID generator
2. **Mixin `any[]`** - `form-associated.ts:35,152` - Unavoidable for TypeScript mixins
3. **Duplicated dismiss logic** - Dialog/Sheet/Drawer share patterns - Extract `useOverlay` hook
4. **Inconsistent event prefixes** - Some `ds:`, some `on*` - Standardize
5. **No error boundaries** - React components lack error fallbacks
6. **Missing loading states** - Select/Combobox async scenarios
7. **Hardcoded timeouts** - `setTimeout(resolve, 100)` in tests - Use `waitFor`
8. **No dev warnings** - Silent failures for missing required children
9. **Partial RTL support** - Arrow keys but no logical CSS properties
10. **No performance monitoring** - No metrics for bundle impact

### Refactor Suggestions

1. **Extract Overlay Primitive**
   ```ts
   // packages/primitives-dom/src/behavior/overlay.ts
   export function createOverlayBehavior(options: OverlayOptions) {
     // Shared: positioning, dismiss, focus trap, animation
   }
   ```

2. **Create React useOverlay Hook**
   ```ts
   // packages/react/src/hooks/use-overlay.ts
   export function useOverlay(options: UseOverlayOptions) {
     const [open, setOpen] = useState(false);
     const behavior = useMemo(() => createOverlayBehavior(options), []);
     // Shared logic for Dialog, Sheet, Drawer, Popover
   }
   ```

3. **Standardize ID Generation**
   ```ts
   // packages/primitives-dom/src/utils/id.ts
   export function createIdGenerator(prefix: string) {
     let counter = 0;
     return () => `${prefix}-${++counter}`;
   }

   // Allow injection for SSR
   export const IdContext = createContext<() => string>(() => crypto.randomUUID());
   ```

---

## H) Comparative Analysis

### Comparison Table

| Dimension | Hypoth-UI | Radix Themes | shadcn/ui | Chakra UI | Once UI |
|-----------|-----------|--------------|-----------|-----------|---------|
| **Architecture** | WC + React adapters | React-only | Copy/paste | React + Emotion | React + CSS vars |
| **Styling** | CSS Layers | Tailwind + CSS vars | Tailwind | CSS-in-JS | CSS vars |
| **Theming** | DTCG tokens | Radix Colors | Tailwind config | Theme object | Design tokens |
| **Bundle** | Tree-shakeable | Tree-shakeable | Zero (copy) | Moderate | Moderate |
| **SSR** | Partial risk | Full | Full | Full | Full |
| **A11y** | Behavior primitives | Internal | Radix-based | Built-in | Built-in |
| **Docs** | Incomplete | Excellent | Excellent | Excellent | Good |
| **Adoption** | Library-only | Library | Copy/paste | Library | Library |
| **Components** | 55 | 28 | 40+ | 60+ | 30+ |
| **Framework** | WC + React | React | React | React | React |

### What They Do Better

**Radix Themes:**
- 12-step color scales with automatic contrast
- Density scaling (1-9)
- Panel backgrounds with blur effects
- Comprehensive documentation with live examples

**shadcn/ui:**
- Zero-dependency (you own the code)
- CLI for scaffolding individual components
- Deep Tailwind integration
- Community recipes and examples

**Chakra UI:**
- Style props (`<Box px={4} bg="red.500">`)
- Theme extensions via JS objects
- Responsive array syntax (`fontSize={['sm', 'md', 'lg']}`)
- Built-in motion/animation utilities

**Once UI:**
- Clean design token architecture
- Figma integration
- Comprehensive spacing system
- Modern aesthetic defaults

### What Hypoth-UI Does Better

1. **Framework Agnostic Core** - Behavior primitives work with any framework
2. **Web Component Support** - Use in non-React environments (Vue, Angular, vanilla)
3. **Light DOM** - No Shadow DOM styling pain
4. **White-Label Architecture** - Multi-brand token system built-in
5. **CSS Layers** - Predictable cascade without specificity hacks
6. **Form Association** - Native ElementInternals integration

### Must-Copy Patterns

1. **From Radix:** 12-step color scales, density system
2. **From shadcn:** CLI for component scaffolding, copy/paste option
3. **From Chakra:** Style props for quick prototyping, responsive syntax
4. **From Once:** Design token documentation, Figma sync

### Avoid Patterns

1. **From Radix:** Complex compound component APIs (keep simpler)
2. **From Chakra:** Heavy CSS-in-JS runtime (stay CSS-only)
3. **From shadcn:** Requiring Tailwind (stay framework-agnostic)

### Positioning Statement

**"Hypoth-UI should win when you need:**
- Web Components that work across frameworks
- White-label/multi-tenant documentation
- CSS-only theming without runtime cost
- Light DOM for form integration and standard DOM APIs
- Teams building design systems, not just consuming them"

---

## I) Principal Engineer Verdict

### Is the Architecture Sound for Long-Term Scale?

**Yes, with caveats.**

The behavior primitives layer is the right abstraction. Extracting ARIA, keyboard, and focus logic into framework-agnostic factories ensures behavioral parity across WC and React implementations. This is comparable to how Radix and React Aria work internally, but exposed as a public API.

The Light DOM decision is bold and correct for the use cases targeted (form integration, CSS styling, standard DOM APIs). Shadow DOM's isolation model creates more problems than it solves for design system components.

**However:**
- The React implementation gap (24 missing components) is a scaling risk
- SSR ID generation needs deterministic solution before Next.js RSC
- Documentation infrastructure exists but isn't deployed

### Month 1 Adoption Friction

1. **"Where are the React components?"** - Teams will immediately hit coverage gaps
2. **"How do I customize this?"** - No style props, must learn CSS vars
3. **"Where are the docs?"** - Manifests exist but no searchable docs site
4. **"How do I install just Button?"** - Granular exports exist but not documented

### Hidden Maintenance Costs

1. **Dual Implementation Sync** - WC and React must stay in sync. Behavior primitives help but UI rendering still diverges.
2. **Token Compilation Pipeline** - DTCG → CSS/JSON/TS adds build complexity
3. **Light DOM CSS Specificity** - Without Shadow DOM encapsulation, CSS conflicts are possible
4. **Multi-Brand Testing** - Each brand token set needs visual regression testing

### What to Keep (Defend Strongly)

1. **Behavior Primitives** - Core differentiator, don't abandon
2. **Light DOM** - Correct decision for target use cases
3. **CSS Layers** - Solves real specificity problems
4. **DTCG Tokens** - Industry standard, future-proof
5. **Granular Exports** - Essential for tree-shaking

### What to Change Immediately

1. **Fix SSR ID Generation** - Ship deterministic IDs before RSC claims
2. **Complete React Coverage** - Missing components block adoption
3. **Deploy Documentation** - Can't evaluate what you can't see
4. **Add Dev Warnings** - Help developers avoid mistakes

---

## J) Prioritized Roadmap

### 0-30 Days: High-Impact Fixes (Effort: S/M)

| Task | Effort | Dependency | Definition of Done |
|------|--------|------------|-------------------|
| Fix SSR ID generation | M | None | `useId()` integration, no hydration mismatch |
| Add dev-mode warnings | S | None | Warns for missing required children |
| Document granular exports | S | None | README updated with import examples |
| Deploy docs site | M | docs-renderer | Searchable, live examples |
| Add error boundaries (React) | S | None | Graceful error handling |

### 30-90 Days: Architecture Improvements (Effort: M/L)

| Task | Effort | Dependency | Definition of Done |
|------|--------|------------|-------------------|
| Complete React adapters | L | None | All 55 components have React versions |
| Add 12-step color scales | M | Token system | `color.blue.1-12` tokens |
| Add density system | M | Token system | `size="1-5"` prop support |
| Create CLI component scaffold | M | None | `npx @ds/cli add button` works |
| Add style props (optional) | L | React package | `<Box px={4}>` syntax |
| RTL full support | M | CSS + behaviors | Logical properties, RTL arrow keys |

### 90-180 Days: Expansion (Effort: L)

| Task | Effort | Dependency | Definition of Done |
|------|--------|------------|-------------------|
| Visual regression testing | L | CI setup | Percy/Chromatic integration |
| Figma token sync | M | Token system | Design ↔ Code parity |
| Copy/paste mode (shadcn-like) | L | CLI | `npx @ds/cli copy button` outputs source |
| RSC compatibility audit | M | SSR fixes | All components work in RSC |
| Performance monitoring | M | Build system | Bundle size CI checks |
| Live region announcements | S | A11y | Toast/Alert/Progress announce changes |

### Sequencing

```
Phase 1 (0-30 days):
├── SSR ID fix (blocks RSC)
├── Dev warnings (low effort, high value)
└── Deploy docs (blocks adoption)

Phase 2 (30-90 days):
├── React coverage (blocks enterprise adoption)
├── Color/density system (matches Radix parity)
└── CLI scaffold (DX improvement)

Phase 3 (90-180 days):
├── Visual regression (quality gate)
├── Copy/paste mode (shadcn parity)
└── RSC audit (Next.js 14+ requirement)
```

---

## Scoring Rubric

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| A11y Correctness | 4/5 | 20% | 0.80 |
| Theme/Tokens Maturity | 4/5 | 15% | 0.60 |
| DX/API Consistency | 3.5/5 | 15% | 0.53 |
| Performance/SSR | 3/5 | 15% | 0.45 |
| Maintainability | 4/5 | 10% | 0.40 |
| Documentation | 2/5 | 10% | 0.20 |
| Component Coverage | 4/5 | 10% | 0.40 |
| Adoption Clarity | 3/5 | 5% | 0.15 |
| **TOTAL** | | **100%** | **3.53/5** |

**Weight Justification:**
- A11y highest because it's non-negotiable for enterprise
- Theme/Tokens and DX equal because both drive adoption
- Performance/SSR high due to Next.js dominance
- Documentation lower because it's fixable quickly
- Adoption clarity lowest because it's a marketing/docs problem

---

## Appendix: Issues List (GitHub-Ready)

### Issue 1: SSR ID Generation Causes Hydration Mismatch

**Title:** `fix(primitives-dom): Replace idCounter with deterministic ID generation`

**Description:**
The `createDialogBehavior` and other behavior factories use an incrementing `idCounter` that produces different IDs on server vs client, causing React hydration mismatches in SSR/RSC environments.

**Acceptance Criteria:**
- [ ] Add `generateId` option to all behavior factories
- [ ] Create `useStableId()` React hook using `useId()`
- [ ] Update Next.js loader to inject deterministic ID generator
- [ ] Add hydration mismatch test case

---

### Issue 2: Missing React Adapters for 24 Components

**Title:** `feat(react): Complete React adapter coverage`

**Description:**
24 WC components lack React adapters, blocking React-only teams from adopting the full component set.

**Missing:** Accordion, AlertDialog, Avatar (complete), Badge, Breadcrumb, Calendar, Card (complete), Collapsible, Command, ContextMenu, DataTable, Drawer, DropdownMenu, HoverCard, List, NavigationMenu, Pagination, Progress, ScrollArea, Separator, Skeleton, Stepper, Table (complete), Tabs (complete), Toast (complete), Tree

**Acceptance Criteria:**
- [ ] Create React adapter for each missing component
- [ ] Add unit tests
- [ ] Add a11y tests
- [ ] Export from `@ds/react`

---

### Issue 3: Deploy Searchable Documentation Site

**Title:** `docs: Deploy component documentation with search and live examples`

**Description:**
Component manifests and MDX content exist but aren't deployed. External consumers cannot evaluate the library.

**Acceptance Criteria:**
- [ ] Deploy `apps/docs` to Vercel/Netlify
- [ ] Add Algolia/Pagefind search
- [ ] Add live component playgrounds
- [ ] Generate API tables from manifests

---

### Issue 4: Add Development Mode Warnings

**Title:** `feat(wc): Add dev-mode warnings for common mistakes`

**Description:**
Components fail silently when misused. Add warnings for missing required children, invalid prop combinations, etc.

**Acceptance Criteria:**
- [ ] Warn if Dialog missing DialogTitle
- [ ] Warn if Select missing SelectTrigger
- [ ] Warn if Form control missing Field wrapper
- [ ] Warnings only in development mode

---

### Issue 5: Add 12-Step Color Scales

**Title:** `feat(tokens): Add 12-step color scales (Radix-like)`

**Description:**
Current token system has single values per color. Radix Themes uses 12-step scales for flexible UI composition.

**Acceptance Criteria:**
- [ ] Add `color.blue.1-12` tokens
- [ ] Add automatic contrast calculation
- [ ] Add scale for each semantic color (primary, success, warning, error)
- [ ] Update documentation

---

## Appendix: Top 5 PRs to Open

1. **PR: Fix SSR ID Generation**
   - Files: `packages/primitives-dom/src/behavior/*.ts`, `packages/react/src/hooks/use-stable-id.ts`
   - Changes: Add `generateId` option, create `useStableId` hook

2. **PR: Add Missing React Components (Batch 1)**
   - Files: `packages/react/src/components/accordion/`, `packages/react/src/components/alert-dialog/`, etc.
   - Changes: Implement 8 missing components (Accordion, AlertDialog, Breadcrumb, Calendar, Collapsible, Command, ContextMenu, DataTable)

3. **PR: Deploy Documentation Site**
   - Files: `apps/docs/*`, `.github/workflows/docs.yml`
   - Changes: Add Vercel deploy config, add search, configure domain

4. **PR: Add Dev Mode Warnings**
   - Files: `packages/wc/src/components/dialog/dialog.ts`, `packages/wc/src/components/select/select.ts`
   - Changes: Add `if (process.env.NODE_ENV !== 'production')` checks

5. **PR: Add 12-Step Color Scales**
   - Files: `packages/tokens/src/tokens/primitives/colors.json`, `packages/tokens/src/tokens/semantic/colors.json`
   - Changes: Expand color tokens to 12-step scales

---

*End of Audit Report*
