# Research: Structure, Navigation & Overlays

**Phase 0 Output** | **Date**: 2026-01-07

## Executive Summary

Research confirms that all required primitives and patterns exist in the codebase. No new dependencies needed. Components will follow established compound component pattern using existing `@ds/primitives-dom` utilities.

## Codebase Pattern Analysis

### Decision: Web Component Architecture

**Choice**: Extend `DSElement` base class with Light DOM rendering

**Rationale**: All existing components use this pattern. Provides consistent API, automatic Light DOM rendering, and integration with design system CSS layers.

**Alternatives Rejected**:
- Shadow DOM: Constitution prohibits by default; would break CSS customization
- Direct LitElement: Would require manual Light DOM setup in each component

**Reference Implementation**: `/packages/wc/src/components/dialog/dialog.ts`

### Decision: Compound Component Communication

**Choice**: Parent manages state; children receive methods via direct queries

**Rationale**: This pattern is established in Radio/RadioGroup, Select/SelectOption. Parent queries children with `querySelectorAll()`, sets up MutationObserver for dynamic children, and communicates via direct method calls (e.g., `child.setChecked()`).

**Alternatives Rejected**:
- Context API: Web Components don't have React-style context; would require custom implementation
- Custom events only: Less efficient for frequent state updates; harder to manage

**Reference Implementation**: `/packages/wc/src/components/radio/radio-group.ts`

### Decision: React Wrapper Pattern

**Choice**: Use `forwardRef` with `createElement` targeting custom element tag

**Rationale**: Existing wrappers use this pattern. Forwards refs properly, maps React props to DOM attributes, handles custom event forwarding.

**Alternatives Rejected**:
- HOC pattern: More complex, harder to type
- Render props: Doesn't align with compound component pattern

**Reference Implementation**: `/packages/react/src/components/popover.tsx`

## Primitive Usage Mapping

| Component | Primitives Used | Notes |
|-----------|----------------|-------|
| Tabs | `createRovingFocus` | Horizontal/vertical orientation support |
| Accordion | `createRovingFocus` | Vertical orientation |
| AlertDialog | `createFocusTrap`, `createDismissableLayer`, `createPresence` | Modal with exit animation |
| Sheet | `createFocusTrap`, `createDismissableLayer`, `createPresence`, `createAnchorPosition` | Slide-in positioning |
| Drawer | Composes Sheet | Adds swipe gesture detection |
| DropdownMenu | `createMenuBehavior` (includes roving, typeahead, dismissable) | Full menu state machine |
| ContextMenu | `createMenuBehavior` | Position at pointer |
| HoverCard | `createDismissableLayer`, `createAnchorPosition` | No focus trap (non-modal) |
| NavigationMenu | `createRovingFocus`, `createDismissableLayer` | Mega-menu pattern |
| Collapsible | `createPresence` | Animated expand/collapse |
| ScrollArea | None | Pure CSS + ResizeObserver |
| Command | `createRovingFocus`, `createTypeAhead` | Filterable list |
| Card | None | Pure structure |
| Separator | None | Pure structure with ARIA |
| AspectRatio | None | Pure CSS |
| Breadcrumb | None | Pure structure with ARIA |
| Pagination | None | Controlled state |
| Stepper | None | Controlled state with ARIA |

## APG Pattern Mapping

| Component | APG Pattern | Key Requirements |
|-----------|-------------|------------------|
| Tabs | [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) | tablist/tab/tabpanel roles; arrow key navigation |
| Accordion | [Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) | region with aria-expanded; h3 wrappers optional |
| AlertDialog | [Alert Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/) | role="alertdialog"; aria-labelledby/describedby |
| DropdownMenu | [Menu Button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) | menu/menuitem roles; arrow navigation |
| ContextMenu | [Menu](https://www.w3.org/WAI/ARIA/apg/patterns/menu/) | Same as dropdown; pointer positioning |
| NavigationMenu | [Disclosure Navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) | Expandable navigation regions |
| Breadcrumb | [Breadcrumb](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/) | nav landmark; aria-current="page" |
| Command | [Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) | listbox/option roles; typeahead |

## CSS Layer Strategy

All component styles will be added to the `components` layer per existing convention:

```css
@layer components {
  /* Component styles here */
}
```

**Z-Index Custom Properties**:
```css
:root {
  --ds-z-overlay: 1000;
  --ds-z-dropdown: calc(var(--ds-z-overlay) + 100);
  --ds-z-modal: calc(var(--ds-z-overlay) + 200);
  --ds-z-popover: calc(var(--ds-z-overlay) + 300);
  --ds-z-tooltip: calc(var(--ds-z-overlay) + 400);
}
```

## Animation Patterns

Existing `createPresence` primitive handles:
- Entry animations via CSS classes
- Exit animations with cleanup callback
- `prefers-reduced-motion` respect

**Sheet/Drawer slide animations**:
```css
[data-state="open"] { animation: slide-in 200ms ease-out; }
[data-state="closed"] { animation: slide-out 150ms ease-in; }

@media (prefers-reduced-motion: reduce) {
  [data-state] { animation: none; }
}
```

## Event Naming Convention

All custom events use `ds:` prefix per existing convention:

| Event | Usage |
|-------|-------|
| `ds:open` | Overlay opened |
| `ds:close` | Overlay closed |
| `ds:change` | Value changed (tabs, accordion) |
| `ds:select` | Item selected (menu, command) |
| `ds:navigate` | Navigation occurred (pagination, stepper) |

## Bundle Size Estimation

Based on existing component sizes:
- Dialog: ~3KB
- Popover: ~2.5KB
- Select (full): ~8KB

**Estimated totals**:
| Category | Components | Est. Size |
|----------|------------|-----------|
| Structure | Card, Tabs, Accordion | ~6KB |
| Overlays | AlertDialog, Sheet, Drawer | ~8KB |
| Menus | Dropdown, Context, HoverCard, Navigation | ~12KB |
| Utilities | Collapsible, Separator, AspectRatio, ScrollArea | ~4KB |
| Navigation | Breadcrumb, Pagination, Stepper, Command | ~8KB |
| **Total** | 18 components | **~38KB** |

Within 40KB target with room for overhead.

## Open Questions Resolved

1. **Sheet vs Drawer**: Clarified - Drawer composes Sheet with mobile enhancements
2. **Z-index strategy**: Clarified - CSS custom property `--ds-z-overlay` as configurable base
3. **Focus management**: Use existing `createFocusTrap` for modals, skip for non-modal overlays
4. **Typeahead**: Use existing `createTypeAhead` for menus and Command palette
5. **Swipe gestures**: Drawer-specific; implement with touch event handlers (no new primitive needed)

## Implementation Order Recommendation

Based on dependency analysis and priority tiers:

1. **Foundation** (no deps on new components):
   - Card, Separator, AspectRatio (pure structure)
   - Collapsible (uses presence only)

2. **Structure primitives** (P1):
   - Tabs (roving focus)
   - Accordion (roving focus + collapsible pattern)

3. **Modal overlays** (P1):
   - AlertDialog (focus trap + dismissable + presence)

4. **Panel overlays** (P2):
   - Sheet (focus trap + dismissable + presence + positioning)
   - Drawer (composes Sheet)

5. **Menu family** (P2):
   - DropdownMenu (menu behavior)
   - ContextMenu (menu behavior + pointer positioning)
   - HoverCard (dismissable + positioning)
   - NavigationMenu (roving focus + dismissable)

6. **Utilities** (P3):
   - ScrollArea (ResizeObserver + custom scrollbar)

7. **Navigation** (P4):
   - Breadcrumb, Pagination, Stepper (pure structure + ARIA)
   - Command (roving focus + typeahead + filtering)
