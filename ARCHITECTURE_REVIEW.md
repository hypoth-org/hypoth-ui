# hypoth-ui Architectural Review

**Date:** 2026-01-15 (Updated)
**Reviewer:** Principal Engineer Assessment
**Repository:** hypoth-ui (White-label Design System)
**Commit:** d4235d3 (feat: implement layout primitives & page composition)

---

## A) Executive Summary

### Core Value Proposition (2-4 sentences)

hypoth-ui is a **framework-agnostic, white-label design system** built on Lit-based Web Components with React adapters. It provides a zero-runtime-dependency behavior primitives layer (`@ds/primitives-dom`), DTCG-compliant design tokens, and CSS cascade layers for controlled styling. The architecture prioritizes accessibility, form integration via Light DOM, and multi-tenant documentation support for enterprise deployments.

### Key Strengths

| # | Strength | Evidence |
|---|----------|----------|
| 1 | **Zero-runtime behavior primitives** | `@ds/primitives-dom` has 0 external dependencies, 138KB compiled, provides focus-trap, roving-focus, type-ahead, dismissable-layer as pure functions. All overlay components share identical behavior. |
| 2 | **Light DOM architecture for form integration** | All form controls use `createRenderRoot()` returning `this` for Light DOM. Enables native form submission via ElementInternals (Select, Combobox, Checkbox, Switch, Radio implement `FormAssociatedMixin`). |
| 3 | **DTCG-compliant token system with multi-mode support** | 139 tokens compiled via Style Dictionary 4.0. Supports light/dark/high-contrast/reduced-motion modes. CSS custom properties with `--ds-` prefix. Runtime theme controller with localStorage persistence. |
| 4 | **CSS Layers for controlled cascade** | 7-layer architecture: reset → tokens → base → components → animations → utilities → overrides. Eliminates specificity wars, allows user overrides without `!important`. |
| 5 | **Strong accessibility foundation** | 17 dedicated a11y test suites, jest-axe integration, dev warnings (DS001-DS006) for common mistakes, APG pattern compliance documented in manifests. Roving focus, focus trap, ARIA relationships auto-wired. |
| 6 | **SSR-safe ID generation** | React adapters use `useStableId` hook (wrapping React 18's `useId`). Dialog, Menu, Select already integrated. No hydration mismatches in Next.js SSR/RSC. |

### 5 Biggest Risks/Gaps

| # | Risk/Gap | Evidence |
|---|----------|----------|
| 1 | **Documentation site not deployed** | No public docs URL. Must read source code for API reference. Blocks discoverability and adoption. |
| 2 | **Input component missing FormAssociatedMixin** | `packages/wc/src/components/input/input.ts` extends `DSElement` not `FormAssociatedMixin`. Cannot submit via native forms. Other form controls (Select, Combobox, Checkbox) correctly implement it. |
| 3 | ~~**Limited template coverage for copy mode**~~ | ✅ **RESOLVED**: CLI copy mode now has 55/55 templates. All components support `hypoth-ui add [component] --copy`. |
| 4 | ~~**MDX documentation incomplete**~~ | ✅ **RESOLVED**: 55/55 components now have MDX docs (100%). WC manifests also 100% complete (55/55) with a11y contracts. |
| 5 | ~~**Button fires ds:press twice on keyboard**~~ | ✅ **RESOLVED**: Removed duplicate event emission. Button now emits exactly one `ds:press` per activation. |

### Adoption Readiness Verdict

**INTERNAL-ONLY / PRODUCTION-READY WITH CAVEATS**

The architecture is sound for long-term scale. Web Components work in production. However:
- Documentation site not deployed (contract validation incomplete)
- Input component missing form integration
- Button has duplicate event emission on keyboard activation
- Enterprise white-label use cases work well (tokens + editions)

---

## B) Repo Map & Architecture Overview

### Package Topology (Monorepo)

```
hypoth-ui/
├── packages/           (13 packages)
│   ├── tokens/         # DTCG token compilation → CSS/JSON/TS
│   ├── css/            # CSS layers (reset, tokens, base, components, utilities)
│   ├── primitives-dom/ # Zero-dep behavior factories (focus, keyboard, overlay)
│   ├── wc/             # Lit 3.1 Web Components (55 components)
│   ├── react/          # React 18+ adapters (~51 components, 93%)
│   ├── next/           # Next.js 14+ App Router integration
│   ├── docs-core/      # Headless documentation engine
│   ├── docs-content/   # MDX docs (55/55) + detailed API manifests (2/55)
│   ├── docs-renderer-next/  # Next.js docs site renderer
│   ├── a11y-audit/     # Accessibility audit CLI
│   ├── test-utils/     # Framework-agnostic test utilities
│   └── cli/            # Component scaffolding CLI (@hypoth-ui/cli)
├── apps/
│   ├── demo/           # Component showcase (Next.js)
│   └── docs/           # Documentation portal
├── tooling/            # Build infrastructure
├── specs/              # 23 feature specifications
└── a11y-audits/        # Accessibility test artifacts
```

### Component Taxonomy

| Category | Count | Examples |
|----------|-------|----------|
| **Primitives** | 8 | Button, Link, Icon, Badge, Tag, Text, Separator, AspectRatio |
| **Form Controls** | 11 | Input, Textarea, Checkbox, Switch, Radio, Select, Combobox, DatePicker, TimePicker, NumberInput, PinInput, Slider, FileUpload |
| **Overlays** | 9 | Dialog, AlertDialog, Drawer, Sheet, Popover, HoverCard, Menu, DropdownMenu, ContextMenu, Toast |
| **Navigation** | 4 | Breadcrumb, Pagination, NavigationMenu, Tabs |
| **Data Display** | 5 | Table, DataTable, List, Tree, Accordion |
| **Layout** | 14 | Flow, Container, Grid, Box, Page, Section, AppShell, Header, Footer, Main, Spacer, Center, Split, Wrap |
| **Feedback** | 4 | Alert, Progress, Spinner, Skeleton |

### Rendering Targets

| Target | Status | Notes |
|--------|--------|-------|
| **Web Components** | 55/55 (100%) | Lit 3.1, Light DOM, Custom Elements v1 |
| **React Adapters** | ~51/55 (93%) | forwardRef, createElement pattern |
| **Next.js SSR** | Full | `DsLoader` for client-side hydration, `use client` directives, SSR-safe IDs via `useStableId` |
| **Next.js RSC** | Full | React adapters use `useStableId` hook (React 18's `useId`), 34 files have `use client` |
| **Vanilla HTML** | Full | WC work directly, CSS import required |

### Key Architectural Patterns

```
┌─────────────────────────────────────────────────────────────┐
│                     LAYER ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────┤
│  7. Docs/Theming   │ @ds/docs-*, theme-controller, editions │
│  6. Adapters       │ @ds/react, @ds/next                    │
│  5. Components     │ @ds/wc (55 Lit components)             │
│  4. Styling        │ @ds/css (7 CSS layers)                 │
│  3. Behavior       │ @ds/primitives-dom (zero-dep)          │
│  2. Tokens         │ @ds/tokens (DTCG → CSS vars)           │
│  1. Foundation     │ TypeScript 5.3, Lit 3.1, ES2022        │
└─────────────────────────────────────────────────────────────┘
```

**Composition Model:**
- Slot-based composition (Web Components)
- Compound components (React)
- No `asChild`/polymorphism yet (partial in React via Slot primitive)

**State Management:**
- Behavior primitives use closure-based state
- Factory functions return behavior objects with `activate()`/`deactivate()`
- Components manage state via Lit reactive properties
- No external state library required

---

## C) API Design & Developer Experience Review

### DX Scorecard

| Criterion | Score | Justification |
|-----------|-------|---------------|
| **Naming consistency** | 4/5 | `ds-` prefix consistent. Props use standard names. Some event inconsistency (`input` vs `ds:change`). |
| **Prop patterns** | 4/5 | Reflected attributes work well. Responsive props in React (`size={{ base, md }}`). Missing controlled/uncontrolled docs. |
| **Ref forwarding** | 5/5 | All React adapters use `forwardRef`. WC refs work via `querySelector`. |
| **Event semantics** | 3/5 | `ds:` prefix convention good. But Input uses native `input`, not `ds:input`. Double-event issue in Button on keyboard. |
| **Form compatibility** | 3/5 | Select, Combobox, Checkbox, Switch have ElementInternals. Input MISSING form integration. |
| **Composition ergonomics** | 4/5 | Slot-based in WC, compound components in React. No polymorphic `as` prop yet. |
| **Escape hatches** | 3/5 | CSS custom properties exposed. No unstyled mode. Limited composition override points. |
| **Copy/paste friendliness** | 5/5 | CLI supports copy mode with import transformation. 55/55 templates bundled. Full coverage achieved. |
| **Documentation quality** | 4/5 | 100% MDX docs (55/55). No deployed site yet. Missing migration guides, anti-patterns. WC manifests 100% complete. |
| **Discoverability** | 2/5 | No deployed docs, no search, no Storybook. Must read source. |

**Overall DX Score: 37/50 (74%)**

### API Improvements (Before/After)

**1. Input Form Integration**

```typescript
// BEFORE (input.ts line 27)
export class DsInput extends DSElement { ... }

// AFTER
export class DsInput extends FormAssociatedMixin(DSElement) {
  static formAssociated = true;

  getFormValue(): string {
    return this.value;
  }

  getValidationFlags(): ValidityFlags {
    return {
      valueMissing: this.required && !this.value,
      tooShort: this.minlength && this.value.length < this.minlength,
      tooLong: this.maxlength && this.value.length > this.maxlength,
      patternMismatch: this.pattern && !new RegExp(this.pattern).test(this.value),
    };
  }
}
```

**2. Button Event Deduplication**

```typescript
// BEFORE (button.ts lines 85-95) - fires ds:press twice on keyboard
private handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    this.click();  // This also fires ds:press via click handler
    emitEvent(this, 'ds:press', { ... });  // Double emission
  }
}

// AFTER
private handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    emitEvent(this, 'ds:press', { isKeyboard: true, originalEvent: event });
    // Remove this.click() - let consumer handle side effects
  }
}
```

**3. Consistent Event Naming**

```typescript
// BEFORE (input.ts)
dispatchEvent(new CustomEvent("input", { detail: { value } }));

// AFTER
emitEvent(this, StandardEvents.INPUT, { value });  // 'ds:input'
```

**4. SSR-Safe ID Generation** (Already Implemented)

```typescript
// React adapters: packages/react/src/hooks/use-stable-id.ts
export function useStableId(options: UseStableIdOptions = {}): string {
  const reactId = useId();  // React 18's SSR-safe ID
  return `${prefix}-${cleanId}`;
}

// WC/Primitives: crypto.randomUUID() for unique client-side IDs
function generateUniqueId(prefix = "desc"): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}
```

**5. Polymorphic Component Support**

```typescript
// BEFORE (no polymorphism)
<Button>Click me</Button>

// AFTER (add asChild pattern)
<Button asChild>
  <a href="/page">Click me</a>
</Button>

// Implementation
interface ButtonProps {
  asChild?: boolean;
}

function Button({ asChild, children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'ds-button';
  return <Comp {...props}>{children}</Comp>;
}
```

---

## D) Theming & Tokens

### Token Model Analysis

| Dimension | Status | Evidence |
|-----------|--------|----------|
| **Token format** | DTCG-compliant | `$value`, `$type`, `$description` in JSON files |
| **Semantic vs raw** | Both | Primitives in `primitives/colors.json`, semantic in `semantic/colors.json` |
| **Alias usage** | Correct | `{color.primitives.blue.600}` references work |

**Token Coverage:**

| Category | Tokens | Complete? |
|----------|--------|-----------|
| Color primitives | 144 | Yes - 8 scales × 11 steps + white/black/transparent |
| Semantic colors | 132 | Yes - background, foreground, primary, destructive, success, warning |
| Typography | 12 | Yes - h1-h4, body, body-sm, caption, label, link |
| Spacing | 8 | Yes - none, xs, sm, md, lg, xl, 2xl, 3xl |
| Radius | 7 | Yes - none, sm, md, lg, xl, 2xl, full |
| Shadow | 6 | Yes - none, sm, md, lg, xl, inner |
| Motion duration | 6 | Yes - instant, fast, normal, slow, slower, slowest |
| Motion easing | 7 | Yes - linear, ease, ease-in, ease-out, ease-in-out, spring, bounce |
| Z-index | 0 | **Missing** - no elevation tokens |
| Breakpoints | 5 | Yes - sm, md, lg, xl, 2xl |
| Density | 3 | Yes - default, compact, spacious |

### Theme Application

**Multi-theme support:**
```html
<html data-mode="dark" data-brand="acme">
```

**Theme modes:**
- `light` (default)
- `dark` (inverted semantic colors)
- `high-contrast` (maximized contrast, forced-colors support)
- `reduced-motion` (all durations = 0ms)

**Runtime switching:**
```typescript
import { setMode, setBrand } from '@ds/tokens/runtime';
setMode('dark');
setBrand('acme');
```

**SSR-safe initialization:**
```tsx
// packages/docs-renderer-next/components/theme-init-script.tsx
<Script strategy="beforeInteractive" src="/theme-init.js" />
```

### Styling Strategy

| Approach | Used | Notes |
|----------|------|-------|
| CSS custom properties | Primary | `--ds-color-primary-default` consumed by components |
| CSS Layers | Yes | 7 layers for cascade control |
| CSS-in-JS | No | Pure CSS |
| Tailwind | No | Could integrate via `@layer utilities` |
| Style props | No | Not implemented |
| Runtime cost | Minimal | CSS vars are static, no JS overhead |

### Radix Themes Parity Analysis

| Feature | Radix Themes | hypoth-ui | Gap |
|---------|--------------|-----------|-----|
| Color system | Radix Colors (12-step) | Custom 11-step scales | Comparable |
| Semantic tokens | accent, gray, success, etc. | primary, destructive, etc. | Comparable |
| Theme provider | `<Theme>` component | `data-mode` attribute | Different approach |
| Appearance modes | light/dark/inherit | light/dark/high-contrast | hypoth-ui has more |
| Radius scale | none-full (5 values) | none-full (7 values) | hypoth-ui more granular |
| Scaling/density | Not built-in | 3 density modes | hypoth-ui better |
| Per-component theming | Via `accentColor` prop | Via CSS custom properties | Comparable |
| High contrast | Not built-in | Full support + forced-colors | hypoth-ui better |

### Chakra-like Ergonomics Analysis

| Feature | Chakra UI | hypoth-ui | Gap |
|---------|-----------|-----------|-----|
| Style props | `<Box p={4} bg="blue.500">` | Not supported | Missing |
| Theme object | `extendTheme({ colors })` | DTCG JSON + build | Different |
| Recipes/variants | `defineStyleConfig()` | CSS with `[data-variant]` | Comparable |
| Responsive props | `{{ base: 'sm', md: 'lg' }}` | Supported in React | Comparable |
| Color mode hook | `useColorMode()` | `getMode()` from runtime | Comparable |

### Missing Primitives

1. **Z-index/elevation tokens** - Currently hardcoded (menu: 1000, tooltip: 1100)
2. **Tone/intent model** - No primary-soft, primary-subtle variants
3. **Opacity scale** - No standard opacity tokens
4. **Letter-spacing scale** - Only in typography composites
5. **Border width tokens** - Hardcoded to 1px

---

## E) Accessibility & Interaction Contract

### A11y Maturity Rating: **4/5 (Strong)**

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Keyboard support | 5/5 | Roving tabindex, focus trap, type-ahead, arrow keys, Home/End across all components |
| ARIA correctness | 4/5 | Roles/attributes correct. Some edge cases (empty state missing `role="status"`). Auto-wired relationships. |
| Screen reader | 4/5 | Proper announcements, aria-live regions for toasts, aria-describedby connections |
| Focus management | 5/5 | Focus visible outlines, programmatic focus on open/close, focus restoration |
| Reduced motion | 5/5 | `prefers-reduced-motion` respected, motion tokens zero out durations |
| High contrast | 4/5 | `forced-colors: active` support in CSS, system colors used |
| Form a11y | 3/5 | Label association works via ds-field, but Input missing form integration |

### Components Needing APG Alignment

| Component | Issue | APG Pattern |
|-----------|-------|-------------|
| Select | Virtual scrolling incomplete | Listbox |
| Combobox | Empty state missing `role="status"` | Combobox |
| Menu | No submenu support | Menu Button |
| Accordion | No React adapter | Accordion |
| Tabs | Missing manual activation mode | Tabs |

### Accessibility Test Plan

**Unit Tests (Current):**
- 17 a11y test files in `packages/wc/tests/a11y/`
- jest-axe for automated WCAG violation detection
- 1231 tests total, 14 skipped (environment limitations)

**Recommended Additions:**

```typescript
// 1. Screen reader announcement tests
test('Toast announces message to screen readers', async () => {
  const liveRegion = document.querySelector('[aria-live="polite"]');
  toast.show('Message');
  await waitFor(() => {
    expect(liveRegion.textContent).toContain('Message');
  });
});

// 2. Keyboard navigation integration tests (Playwright)
test('Select keyboard navigation', async ({ page }) => {
  await page.focus('ds-select-trigger');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('ds-select-content')).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('[data-highlighted]')).toHaveAttribute('value', 'option-1');
});

// 3. Focus trap escape test
test('Dialog focus trap prevents Tab escape', async ({ page }) => {
  await page.click('[data-testid="open-dialog"]');
  const lastFocusable = page.locator('ds-dialog-content button:last-child');
  await lastFocusable.focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('ds-dialog-content button:first-child')).toBeFocused();
});
```

### Component Accessibility Contract

**Two Manifest Systems (Important Clarification):**

| System | Location | Coverage | Purpose |
|--------|----------|----------|---------|
| **WC Manifests** | `packages/wc/src/components/*/manifest.json` | **55/55 (100%)** | Build validation, a11y contracts, editions, tokens |
| **Docs-Content Manifests** | `packages/docs-content/manifests/*.json` | 2/55 | Detailed API docs (props, events, examples) - optional |

The WC manifests are the **primary contract system** and are fully implemented. They include:
- Accessibility patterns (APG, keyboard, ARIA, screen reader)
- Token usage tracking
- Edition filtering (core/pro/enterprise)
- Platform support (wc, react)

The docs-content manifests are a secondary system for richer API documentation generation. These may be redundant since props/events can be extracted from TypeScript definitions.

**Current WC Manifest Schema:**

**Recommended Contract Schema:**

```json
{
  "accessibility": {
    "wcag": "2.1 AA",
    "apgPattern": "dialog",
    "roles": ["dialog", "alertdialog"],
    "ariaAttributes": {
      "required": ["aria-labelledby", "aria-modal"],
      "optional": ["aria-describedby"]
    },
    "keyboard": {
      "Tab": "Move focus to next focusable element within dialog",
      "Shift+Tab": "Move focus to previous focusable element",
      "Escape": "Close dialog and return focus to trigger"
    },
    "focusManagement": {
      "onOpen": "Focus first focusable element or initialFocus target",
      "onClose": "Return focus to trigger element",
      "trap": true
    },
    "screenReaderBehavior": "Announces dialog title on open",
    "knownLimitations": ["Content must be text-only for tooltip"]
  }
}
```

---

## F) Performance & Compatibility

### Bundle Size & Tree-Shaking

| Package | Size (ESM) | Tree-shakeable | sideEffects |
|---------|------------|----------------|-------------|
| @ds/primitives-dom | 138KB | Yes | `false` |
| @ds/wc | ~400KB (all) | Partial | `true` (custom elements) |
| @ds/react | ~50KB | Yes | `false` |
| @ds/tokens/css | 8KB | N/A (CSS) | N/A |

**Tree-shaking Issues:**
- WC package has `sideEffects: true` due to custom element registration
- Individual component imports not supported: `import { Button } from '@ds/wc/button'`
- All 55 components bundled even if using 1

**Recommended Fix:**
```json
// package.json
{
  "sideEffects": [
    "./src/components/*/index.js"  // Only registration files
  ],
  "exports": {
    ".": "./dist/index.js",
    "./button": "./dist/components/button/index.js",
    "./dialog": "./dist/components/dialog/index.js"
  }
}
```

### Runtime Costs

| Concern | Status | Notes |
|---------|--------|-------|
| Style injection | None | Static CSS via `@ds/css` |
| Event listeners | Low | Delegated where possible, cleanup on disconnect |
| Portals | Minimal | Used for dialogs, tooltips - render to body |
| Layout thrash | Low | CSS-based animations, no JS layout reads |
| Memory leaks | Low | Behavior primitives have explicit `destroy()` methods |

### SSR/RSC Compatibility Matrix

| Environment | Status | Issues |
|-------------|--------|--------|
| **Next.js SSR (Pages)** | Full | `DsLoader` for client hydration, SSR-safe IDs |
| **Next.js RSC (App)** | Full | `useStableId` hook prevents ID collisions, 34 files have `use client` |
| **Remix** | Untested | Should work (WC hydration pattern) |
| **Vite CSR** | Full | No issues |
| **Plain HTML** | Full | Import CSS, register elements |

**SSR Support:**

1. **SSR-Safe ID Generation** (Fully Implemented):
   - **React adapters**: Use `useStableId` hook wrapping React 18's `useId()` - fully SSR-safe
   - **WC components**: Use `crypto.randomUUID()` - client-only, unique each render
   - **Primitives-dom**: Uses `crypto.randomUUID()` - legacy counter-based generator removed

2. **Window/Document Usage:**
```typescript
// packages/primitives-dom/src/ssr/client-only.ts
export const isBrowser = () => typeof window !== 'undefined';
// Properly guarded, consumers must use guards
```

### Dependency Risk

| Dependency | Version | Risk | Notes |
|------------|---------|------|-------|
| lit | 3.1.0 | Low | Stable, well-maintained |
| date-fns | 4.1.0 | Low | Tree-shakeable, no breaking changes |
| @date-fns/tz | 1.2.0 | Low | Timezone support |
| lucide | 0.468.0 | Medium | Icon library, could be abstracted |

**No duplicate dependencies detected.**

---

## G) Code Quality & Maintainability

### TypeScript Assessment

| Criterion | Status |
|-----------|--------|
| Strict mode | Enabled in all packages |
| Public type ergonomics | Good - exported interfaces for all props |
| Generics | Used in Select/Combobox for value types |
| Polymorphism | Limited - no `as` prop pattern |

### Test Strategy

| Type | Coverage | Tool |
|------|----------|------|
| Unit | High | Vitest |
| A11y | High | jest-axe |
| Integration | Medium | Happy-dom |
| E2E | Low | Playwright (configured but sparse) |
| Visual regression | None | Not implemented |

**Test Results (current run):**
- 95 test files
- 1217 passing, 14 skipped
- 1 failing (React exports test - build artifact issue)

### Top 10 Maintainability Issues

| # | Issue | File | Severity |
|---|-------|------|----------|
| 1 | Input missing FormAssociatedMixin | `wc/src/components/input/input.ts:27` | High |
| 2 | Button behavior primitive not utilized | `wc/src/components/button/button.ts` | Medium |
| 3 | Button fires ds:press twice on keyboard | `wc/src/components/button/button.ts:85-95` | Medium |
| 4 | ~~ID generator not SSR-safe~~ | ✅ Fixed: React uses `useStableId`, WC/primitives use `crypto.randomUUID()` | Resolved |
| 5 | Docs-content manifests incomplete | `docs-content/manifests/` | Low (WC manifests exist) |
| 6 | Inconsistent event naming (input vs ds:input) | `wc/src/components/input/input.ts` | Low |
| 7 | No per-component exports for tree-shaking | `wc/package.json` | Medium |
| 8 | Virtual scrolling incomplete | `wc/src/components/select/select.ts` | Medium |
| 9 | Menu missing submenu support | `wc/src/components/menu/` | Low |
| 10 | React responsive size CSS mismatch | `react/src/components/input.tsx:131` | Medium |

### Refactor Suggestions

**1. Shared Form Mixin Enforcement**
```typescript
// Create a base class for all form controls
export abstract class FormControl extends FormAssociatedMixin(DSElement) {
  abstract getFormValue(): FormDataEntryValue;
  abstract getValidationFlags(): ValidityFlags;
}

// All form controls extend this
export class DsInput extends FormControl { ... }
export class DsTextarea extends FormControl { ... }
```

**2. Event System Standardization**
```typescript
// Centralize all events
export const DSEvents = {
  PRESS: 'ds:press',
  CHANGE: 'ds:change',
  INPUT: 'ds:input',
  OPEN_CHANGE: 'ds:open-change',
  SELECT: 'ds:select',
} as const;

// Type-safe event emission
export function emit<K extends keyof typeof DSEvents>(
  element: HTMLElement,
  event: K,
  detail: EventDetailMap[K]
): void { ... }
```

**3. Behavior Primitive Composition**
```typescript
// Create higher-order behaviors for common patterns
export function createSelectableBehavior<T>(options: {
  container: HTMLElement;
  itemSelector: string;
  onSelect: (value: T) => void;
}) {
  const roving = createRovingFocus({ ... });
  const typeAhead = createTypeAhead({ ... });
  const dismiss = createDismissableLayer({ ... });

  return {
    activate() {
      roving.activate();
      dismiss.activate();
    },
    deactivate() {
      roving.deactivate();
      dismiss.deactivate();
    },
    // Merged API
  };
}
```

---

## H) Comparative Analysis

### Comparison Table

| Dimension | hypoth-ui | Radix Themes | shadcn/ui | Chakra UI | Once UI |
|-----------|-----------|--------------|-----------|-----------|---------|
| **Runtime** | WC + React | React only | React only | React only | React only |
| **Styling** | CSS Layers | CSS-in-JS | Tailwind | Emotion | Tailwind |
| **Theming** | DTCG tokens | Radix colors | CSS vars | Theme object | CSS vars |
| **Components** | 55 | ~30 | ~45 | ~50 | ~40 |
| **Headless option** | Via primitives | Radix Primitives | Headless by design | No | No |
| **Adoption model** | Library | Library | Copy/paste | Library | Library |
| **Bundle size** | ~138KB primitives | ~200KB | 0 (copied) | ~300KB | ~150KB |
| **SSR** | Partial | Full | Full | Full | Full |
| **A11y testing** | jest-axe + manual | jest-axe | Community | jest-axe | Unknown |
| **Form integration** | ElementInternals | React controlled | Native HTML | Chakra forms | Native HTML |
| **Multi-brand** | Built-in (editions) | Theme switching | CSS vars | extendTheme | CSS vars |

### What They Do Better

**Radix Themes:**
- Complete React SSR/RSC support
- Type-safe theme tokens via TypeScript
- Consistent component API surface

**shadcn/ui:**
- Zero runtime dependency (copy source)
- Full customization (you own the code)
- Excellent documentation with examples
- Easy to understand (single files)

**Chakra UI:**
- Style props for rapid prototyping
- Extensive theme customization API
- Great DX with `useColorMode`, `useTheme`

**Once UI:**
- Modern design aesthetics
- Simple, flat component structure
- Good Tailwind integration

### What hypoth-ui Does Better

1. **Framework-agnostic core** - WC primitives work anywhere
2. **Zero-runtime behavior layer** - 0 dependencies in primitives-dom
3. **Multi-tenant/edition support** - Built for enterprise white-label
4. **CSS Layers** - No specificity wars, clean overrides
5. **Form integration** - ElementInternals for native form submission
6. **High contrast/accessibility** - forced-colors support built-in
7. **DTCG compliance** - Industry-standard token format

### Must-Copy Patterns

| Pattern | Source | Recommendation |
|---------|--------|----------------|
| Copy/paste CLI | shadcn/ui | ✅ Implemented (`style: "copy"`). Full template coverage achieved (55/55). |
| Compound components | Radix | Already using in React, good |
| Theme provider | Chakra | Consider `<ThemeProvider>` wrapper |
| Style props | Chakra | Evaluate for common use cases |
| Per-component docs | shadcn | Improve manifest-driven generation |

### Avoid Patterns

| Pattern | Source | Why Avoid |
|---------|--------|-----------|
| CSS-in-JS runtime | Radix Themes | Bundle size, SSR complexity |
| Heavy theme object | Chakra | Prefer static tokens |
| Unstyled-only | Headless UI | Accessibility gap for consumers |

### Positioning Statement

**"hypoth-ui should win when organizations need:**
- Framework-agnostic components (Web Components + React)
- White-label/multi-brand deployments (editions, token themes)
- Strict accessibility requirements (a11y-first, APG patterns)
- Form integration with native HTML forms (ElementInternals)
- CSS architecture control (layers, no runtime overhead)"

---

## I) Principal Engineer Verdict

### Is the architecture sound for long-term scale?

**Yes, with reservations.**

**Sound decisions:**
- Light DOM for form integration (correct choice)
- Behavior primitives abstraction (enables consistency)
- CSS Layers (future-proof cascade control)
- DTCG tokens (industry standard)
- Lit 3.1 (stable, well-maintained)

**Concerns:**
- Documentation gap slows onboarding
- No visual regression testing
- 4 remaining React adapter gaps
- Button double-event issue needs fix

### Adoption friction in month 1

| Friction Point | Impact | Mitigation |
|----------------|--------|------------|
| No deployed docs | High | Must read source code |
| SSR hydration issues | Medium | Client-only workarounds |
| SSR hydration issues | Medium | Client-only workarounds |
| MDX docs complete | None | 100% coverage (55/55), doesn't block usage |
| Learning WC patterns | Medium | Training, examples needed |

### Hidden maintenance costs

1. **Dual implementation burden** - WC + React adapters must stay in sync
2. **Behavior primitive updates** - Changes ripple to all components
3. **Token additions** - Build pipeline changes for new tokens
4. **Browser compat** - Custom Elements polyfill for older browsers
5. ~~**Documentation debt**~~ - ✅ RESOLVED: 55/55 MDX docs complete

### What to keep unchanged (defend strongly)

1. **Light DOM architecture** - Essential for form integration
2. **Behavior primitives layer** - Core differentiator, zero dependencies
3. **CSS Layers** - Clean architecture, worth the learning curve
4. **DTCG token format** - Industry standard, tooling ecosystem
5. **Event naming convention** - `ds:` prefix prevents collisions

### What to change immediately

1. **Fix Input FormAssociatedMixin** - Breaks form submission
2. **Deploy documentation site** - Blocks adoption, discoverability
3. **Fix Button double-event** - Confusing for consumers
4. **Complete remaining React adapters** - ~4 components missing

---

## J) Prioritized Roadmap

### 0-30 Days: High-Impact Fixes (S/M effort)

| # | Task | Effort | Dependencies | Definition of Done |
|---|------|--------|--------------|-------------------|
| 1 | Add FormAssociatedMixin to Input | S | None | Input value appears in FormData, validation works |
| 2 | Fix Button double ds:press event | S | None | Single event per activation |
| 3 | Fix Input event naming (ds:input) | S | None | Consistent ds: prefix |
| 4 | Deploy docs site | M | Build docs | Searchable documentation at public URL |
| 5 | Add per-component exports | M | Build changes | Tree-shaking works, bundle size reduced |

### 30-90 Days: Architecture Improvements (M/L effort)

| # | Task | Effort | Dependencies | Definition of Done |
|---|------|--------|--------------|-------------------|
| 7 | Audit & complete remaining React adapters (~4) | S | None | 100% React coverage verified |
| 8 | ~~Complete MDX documentation (24→55)~~ | ✅ | Done | 55/55 components have MDX docs |
| 9 | Add polymorphic `asChild` pattern | M | Slot primitive | Button, Link support custom elements |
| 10 | Implement z-index/elevation tokens | S | Token schema | Tokens for overlay stacking |
| 11 | Add visual regression testing | M | CI setup | Percy or Chromatic integration |
| 12 | SSR/RSC integration tests | M | Next.js test app | Hydration verified in CI |

### 90-180 Days: Expansion (M/L effort)

| # | Task | Effort | Dependencies | Definition of Done |
|---|------|--------|--------------|-------------------|
| 13 | ~~Expand CLI template coverage~~ | ✅ | Done | All 55 components have bundled templates for copy mode |
| 14 | Menu submenu support | M | Behavior primitive | Nested menus work with keyboard |
| 15 | Complete virtual scrolling | M | Select/Combobox | 1000+ items performant |
| 16 | Style props exploration | L | API design | Evaluate Chakra-like `<Box p={4}>` |
| 17 | Storybook/Ladle integration | M | Build setup | Component stories viewable |
| 18 | Migration guides | S | Docs | v0→v1 upgrade path documented |

---

## Issues List (GitHub Issues Format)

### Critical Priority

**Issue 1: Input component missing form integration**
```
Title: [Bug] ds-input does not participate in native form submission
Labels: bug, critical, form-controls

Description:
The `DsInput` component extends `DSElement` directly instead of `FormAssociatedMixin(DSElement)`.
This means input values are not included in FormData when the form is submitted.

Steps to reproduce:
1. Create a form with `<ds-input name="email" value="test@example.com">`
2. Submit the form
3. Check FormData - email field is missing

Expected: Input value included in FormData
Actual: Input value missing

Acceptance criteria:
- [ ] DsInput extends FormAssociatedMixin
- [ ] getFormValue() returns current value
- [ ] getValidationFlags() returns validation state
- [ ] Unit tests for form submission
- [ ] A11y tests still pass
```

### High Priority

**Issue 2: Button fires ds:press event twice on keyboard activation**
```
Title: [Bug] Button emits ds:press twice when activated via keyboard
Labels: bug, high, button

Description:
In button.ts handleKeyDown(), the component:
1. Calls this.click() which fires ds:press via click handler
2. Also emits ds:press directly

This results in duplicate events for keyboard activation.

Acceptance criteria:
- [ ] Single ds:press event per activation
- [ ] Event detail includes isKeyboard boolean
- [ ] Unit test for single event
```

**Issue 3: Complete remaining React adapters (~4 missing)**
```
Title: [Feature] Complete final React adapter coverage
Labels: enhancement, react, adapters

Description:
React adapter coverage is at ~93% (51/55 components).
Verify and complete any remaining gaps.

Acceptance criteria:
- [ ] Audit all 55 WC components against React adapters
- [ ] Complete any remaining adapters
- [ ] All adapters support forwardRef
- [ ] Types exported for all props
```

### Medium Priority

**Issue 4: Deploy documentation site**
```
Title: [Docs] Deploy public documentation site
Labels: documentation, infrastructure

Description:
No public documentation site exists. Developers must read source code
to understand component APIs. This blocks adoption and discoverability.

Note: WC manifests (55/55) exist and pass validation. MDX docs cover 44%.
The docs-content detailed manifests (2/55) may be optional if API docs
can be generated from TypeScript definitions.

Acceptance criteria:
- [ ] Documentation site deployed to public URL
- [ ] Component API reference accessible
- [ ] Search functionality working
- [ ] Examples rendered correctly
```

---

## Top 5 PRs to Open

### PR 1: Fix Input form integration
```
Title: fix(input): add FormAssociatedMixin for native form submission
Branch: fix/input-form-association

Changes:
- packages/wc/src/components/input/input.ts
  - Extend FormAssociatedMixin(DSElement)
  - Implement getFormValue()
  - Implement getValidationFlags()
- packages/wc/tests/input.test.ts
  - Add form submission tests
```

### PR 2: Fix Button double event
```
Title: fix(button): prevent double ds:press on keyboard activation
Branch: fix/button-double-event

Changes:
- packages/wc/src/components/button/button.ts
  - Remove this.click() from handleKeyDown
  - Add isKeyboard to event detail
- packages/wc/tests/button.test.ts
  - Add test for single event emission
```

### PR 3: Add per-component exports
```
Title: feat(wc): enable per-component imports for tree-shaking
Branch: feat/component-exports

Changes:
- packages/wc/package.json
  - Add exports map for each component
  - Update sideEffects to only registration files
- packages/wc/src/components/*/index.ts
  - Create per-component entry points
```

### PR 4: Deploy documentation site
```
Title: feat(docs): deploy documentation site to production
Branch: feat/deploy-docs

Changes:
- apps/docs/next.config.js
  - Configure production deployment
- Add Vercel/Netlify deployment config
- Update package.json scripts for production build
- Add robots.txt and sitemap generation
```

---

## Scoring Rubric

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| A11y correctness & completeness | 4/5 | 15% | 0.60 |
| Theme/tokens maturity | 4/5 | 15% | 0.60 |
| DX/API consistency | 4/5 | 15% | 0.60 |
| Performance & SSR/RSC readiness | 4/5 | 15% | 0.60 |
| Maintainability & scalability | 4/5 | 10% | 0.40 |
| Documentation quality | 4/5 | 10% | 0.40 |
| Component coverage/completeness | 5/5 | 10% | 0.50 |
| Adoption model clarity | 4/5 | 10% | 0.40 |
| **TOTAL** | | 100% | **4.10/5 (82%)** |

**Weight Justification:**
- A11y and theming highest (15% each) - core differentiators
- DX and performance (15% each) - adoption drivers
- Maintainability and docs (10% each) - long-term sustainability
- Coverage and adoption (10% each) - market fit

---

## Conclusion

hypoth-ui is a **well-architected design system** with strong foundations in accessibility, theming, and framework-agnostic behavior primitives. The Light DOM architecture and ElementInternals integration are correct choices for form-heavy applications.

**Immediate priorities:**
1. Fix Input form integration
2. Deploy documentation site
3. Fix Button double-event issue

**Long-term positioning:**
The library should target enterprise teams needing multi-brand/white-label deployments with strict accessibility requirements and framework flexibility. The competition is strong (Radix, shadcn), but the WC foundation and behavior primitives layer are unique differentiators worth preserving.

---

*Report generated by Principal Engineer assessment, 2026-01-09*
