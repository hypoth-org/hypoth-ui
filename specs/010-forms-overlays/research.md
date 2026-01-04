# Research: Forms and Overlays Components

**Feature**: 010-forms-overlays
**Date**: 2026-01-04

## Research Areas

### 1. CSS Anchor Positioning with JS Fallback

**Decision**: Use CSS anchor positioning API with JavaScript fallback for unsupported browsers

**Rationale**:
- CSS anchor positioning (`anchor()`, `position-anchor`) is a native browser API for positioning elements relative to anchors
- Provides declarative, performant positioning without JavaScript for supported browsers
- Browser support as of 2026: Chrome 125+, Edge 125+ (Chromium-based), Firefox partial, Safari experimental
- JS fallback ensures compatibility with all target browsers

**Implementation Approach**:
1. Primary: CSS anchor positioning via `anchor-name` on trigger, `position-anchor` on content
2. Fallback: Detect feature support via `CSS.supports('anchor-name: --anchor')`
3. JS fallback calculates position using `getBoundingClientRect()` and applies inline styles
4. Flip logic: Detect viewport edge collision and flip placement

**Alternatives Considered**:
- Floating UI: Rejected due to bundle size (~8KB min+gzip) and constitution's zero-dep principle
- Pure CSS (no fallback): Rejected due to insufficient browser support for production use
- CSS `position: fixed` + manual calc: Essentially what the fallback does, but less maintainable

### 2. Field Pattern - ARIA Association Strategy

**Decision**: Use generated IDs with `aria-labelledby` and `aria-describedby` composition

**Rationale**:
- Field container generates unique IDs for Label, Description, and Error components
- Form control receives composed ARIA attributes pointing to present child IDs
- Error takes precedence in description (appears first in `aria-describedby`)
- Follows APG guidance for form field accessibility

**Implementation Approach**:
1. Field generates base ID on `connectedCallback` (e.g., `field-${crypto.randomUUID().slice(0,8)}`)
2. Label, Description, Error receive derived IDs: `${baseId}-label`, `${baseId}-desc`, `${baseId}-error`
3. Field observes child slots/mutations to detect which components are present
4. Field sets `aria-labelledby` and `aria-describedby` on form control child

**Alternatives Considered**:
- Explicit ID props: Rejected as too verbose for common cases
- `<label for="">`: Works for native inputs but not for custom element internals
- Context API: Web Components lack native context; would require custom event-based solution

### 3. Dialog Portal Rendering Strategy

**Decision**: Append dialog to document.body on open, remove on close

**Rationale**:
- Ensures dialog appears above all other content regardless of DOM hierarchy
- Avoids z-index stacking context issues
- Consistent with native `<dialog>` top-layer behavior
- SSR-compatible: initial render is hidden; JS activates and portals

**Implementation Approach**:
1. Dialog content renders in-place initially with `display: none`
2. On open: Clone or move content to document.body, apply styles, activate focus trap
3. On close: Move content back to original location or remove clone
4. Use `inert` attribute on background content for true modality

**Alternatives Considered**:
- Shadow DOM with `::backdrop`: Rejected per constitution (Light DOM default)
- CSS `position: fixed` in-place: Can be clipped by ancestor `overflow: hidden`
- Native `<dialog>` element: Good option but limits custom styling; consider as future enhancement

### 4. Radio Group Communication Pattern

**Decision**: Parent RadioGroup coordinates child Radio elements via direct DOM queries

**Rationale**:
- RadioGroup queries children matching `ds-radio` selector
- Maintains roving tabindex state (`tabindex="0"` on selected, `-1` on others)
- Selection changes propagate via events; group ensures single selection

**Implementation Approach**:
1. RadioGroup uses `createRovingFocus` primitive from `@ds/primitives-dom`
2. On arrow key: primitive moves focus; RadioGroup updates selection to match focus
3. Radio emits `ds:change` when selected; group listens and deselects others
4. Initial selection: First radio with `checked` attribute, or first radio if none checked

**Alternatives Considered**:
- Native `<input type="radio">`: Would require form-associated custom elements API
- Event-based registration: More complex, prone to timing issues
- MutationObserver: Overkill for this use case

### 5. Switch vs Checkbox Differentiation

**Decision**: Switch uses `role="switch"` with Enter+Space activation; Checkbox uses native behavior

**Rationale**:
- APG defines Switch as a distinct pattern from Checkbox
- Switch has `role="switch"` with `aria-checked`
- Switch activates on both Enter AND Space (Checkbox is Space only)
- Semantic difference: Switch = immediate effect, Checkbox = deferred (submit)

**Implementation Approach**:
1. Switch: Custom element with `role="switch"`, handles Enter and Space
2. Checkbox: Wraps native `<input type="checkbox">` for form integration
3. Both emit `ds:change` on state change
4. Visual styling differentiates: Switch has sliding toggle, Checkbox has checkmark

**Alternatives Considered**:
- Single component with mode prop: Confuses semantics and ARIA roles
- Pure CSS toggle: Cannot provide correct role for screen readers

### 6. Menu Type-ahead Integration

**Decision**: Use existing `createTypeAhead` primitive from `@ds/primitives-dom`

**Rationale**:
- Type-ahead allows users to jump to menu items by typing
- Existing primitive handles buffer timeout (500ms default), matching logic
- Integration with roving focus ensures focus moves to matched item

**Implementation Approach**:
1. Menu uses both `createRovingFocus` and `createTypeAhead` primitives
2. Type-ahead callback receives typed string, returns matching item index
3. Match logic: Case-insensitive prefix match on item text content
4. Focus moves to matched item; selection requires Enter/click

**Verification Needed**: Confirm `createTypeAhead` exists in primitives-dom (may need to be created if not present)

### 7. Tooltip Timing and Accessibility

**Decision**: Show delay 400ms, hide delay 100ms; dismiss on Escape; persistent on hover

**Rationale**:
- Show delay prevents accidental triggers during mouse movement
- Hide delay allows moving cursor from trigger to tooltip (persistent content)
- Escape dismissal provides keyboard users a way to clear tooltip
- `aria-describedby` connects trigger to tooltip content

**Implementation Approach**:
1. Trigger tracks mouseenter/mouseleave and focus/blur events
2. Show: Start 400ms timer on enter/focus; cancel on leave/blur
3. Hide: Start 100ms timer on leave/blur; cancel if re-entering tooltip
4. Tooltip content: `role="tooltip"`, positioned via anchor positioning

**Alternatives Considered**:
- Instant show: Too aggressive, triggers on accidental hovers
- Longer show delay: 700ms+ feels sluggish
- No hide delay: Tooltip flickers when moving between trigger and content

### 8. Auto-resize Textarea Strategy

**Decision**: Use hidden mirror element to calculate required height

**Rationale**:
- Textarea height should grow/shrink based on content
- Mirror element has same styling, receives same text, provides scrollHeight
- Avoids layout thrashing from direct textarea scrollHeight reads

**Implementation Approach**:
1. Create hidden mirror `<div>` with identical typography styles
2. On input: Copy value to mirror, read mirror's scrollHeight
3. Apply height to textarea (respecting min-height and max-height)
4. Debounce updates to avoid excessive recalculations

**Alternatives Considered**:
- CSS `field-sizing: content`: Not yet widely supported
- Direct scrollHeight read: Causes layout recalculation each time
- Fixed rows: Doesn't adapt to content

## Dependencies Verification

| Primitive | Location | Status |
|-----------|----------|--------|
| `createFocusTrap` | `@ds/primitives-dom/focus/focus-trap.ts` | Exists |
| `createDismissableLayer` | `@ds/primitives-dom/layer/dismissable-layer.ts` | Exists |
| `createRovingFocus` | `@ds/primitives-dom/keyboard/roving-focus.ts` | Exists |
| `createTypeAhead` | `@ds/primitives-dom/keyboard/type-ahead.ts` | Exists |
| `createActivation` | `@ds/primitives-dom/keyboard/activation.ts` | Exists |
| `createArrowKeys` | `@ds/primitives-dom/keyboard/arrow-keys.ts` | Exists |
| `createAnchorPosition` | `@ds/primitives-dom/positioning/anchor-position.ts` | **NEW** |

## Outstanding Decisions

None. All research areas resolved. Ready for Phase 1 design artifacts.
