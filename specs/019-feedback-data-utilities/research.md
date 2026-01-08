# Research: Feedback, Data Display & Utilities

**Feature**: 019-feedback-data-utilities
**Date**: 2026-01-08

## Research Summary

This document captures technology decisions and best practices for implementing feedback components, data display components, and utility primitives.

---

## 1. Toast System Architecture

### Decision: Queue-based ToastProvider with imperative API

### Rationale
- **Queue management**: Central provider manages toast lifecycle (enter, visible, exit, dismissed)
- **Imperative API**: `toast({ title, description, variant })` works from anywhere (not just inside components)
- **WC compatibility**: Export `dsToast()` global function and ToastController class for non-React usage
- **Non-focus-stealing**: Toasts use ARIA live regions (`aria-live="polite"`) instead of moving focus

### Alternatives Considered
1. **Context-only approach**: Requires components to be inside provider tree - rejected because it doesn't work for utility functions or event handlers outside React tree
2. **Event-based system**: `dispatchEvent(new CustomEvent('ds:toast'))` - considered but imperative function is more ergonomic

### Implementation Pattern
```typescript
// React
const { toast } = useToast();
toast({ title: "Saved", variant: "success" });

// WC / Vanilla JS
dsToast({ title: "Saved", variant: "success" });
// or
const controller = new ToastController();
controller.show({ title: "Saved", variant: "success" });
```

---

## 2. DataTable Virtualization Strategy

### Decision: Internal windowing with CSS transform positioning

### Rationale
- **Performance**: Only render visible rows + buffer (typically 10-20 rows vs 100k)
- **No external deps**: Implement windowing internally to maintain zero-dep constraint
- **Smooth scrolling**: Use CSS transforms for row positioning (GPU-accelerated)
- **Row height**: Support fixed row height initially; variable height adds complexity

### Alternatives Considered
1. **TanStack Virtual integration**: Excellent library but adds dependency - rejected per constitution
2. **Native scroll with lazy loading**: Simpler but doesn't meet 100k row requirement at 60fps
3. **Full virtualization library (react-window)**: React-only, doesn't work for WC

### Implementation Pattern
```typescript
// Calculate visible range
const startIndex = Math.floor(scrollTop / rowHeight);
const endIndex = Math.min(startIndex + visibleCount + buffer, totalRows);
const offsetY = startIndex * rowHeight;

// Render only visible rows with transform
<div style="transform: translateY(${offsetY}px)">
  {rows.slice(startIndex, endIndex).map(row => <Row />)}
</div>
```

---

## 3. Table Column Definition API

### Decision: Data-driven column definitions (TanStack-inspired)

### Rationale
- **Declarative**: Columns defined as data, not nested components
- **Type-safe**: TypeScript generics for row type inference
- **Flexible rendering**: Support custom cell renderers via function
- **Sortable**: Column definitions include sort configuration

### Alternatives Considered
1. **Compound components for columns**: `<Table.Column header="Name" />` - rejected because it doesn't scale for dynamic columns
2. **Pure render props**: Maximum flexibility but verbose API

### Column Definition Shape
```typescript
interface ColumnDef<TData> {
  id: string;
  header: string | (() => ReactNode);
  accessorKey?: keyof TData;
  accessorFn?: (row: TData) => unknown;
  cell?: (info: CellContext<TData>) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
}
```

---

## 4. Tree Component ARIA Pattern

### Decision: WAI-ARIA Tree pattern with roving tabindex

### Rationale
- **APG compliance**: Follow ARIA Authoring Practices Guide tree pattern exactly
- **Keyboard navigation**: Arrow keys for navigation, Enter/Space for expand, Home/End for first/last
- **Roving tabindex**: Only one item tabbable at a time (tabindex="0"), others are tabindex="-1"
- **Typeahead**: Existing `@ds/primitives-dom` type-ahead utility

### Key ARIA Attributes
```html
<ul role="tree" aria-label="File browser">
  <li role="treeitem" aria-expanded="true" aria-selected="false" tabindex="0">
    Folder
    <ul role="group">
      <li role="treeitem" aria-selected="false" tabindex="-1">File.txt</li>
    </ul>
  </li>
</ul>
```

---

## 5. Portal Implementation

### Decision: Vanilla DOM API with React.createPortal wrapper

### Rationale
- **SSR-safe**: Check `typeof document !== 'undefined'` before portal operations
- **Cleanup**: Properly remove portal container on unmount
- **Custom container**: Support rendering to custom container element (not just document.body)
- **Event bubbling**: React synthetic events still bubble correctly through portals

### Implementation Pattern
```typescript
// @ds/primitives-dom
export function createPortal(content: Element, container = document.body): () => void {
  container.appendChild(content);
  return () => container.removeChild(content);
}

// @ds/react Portal component
function Portal({ children, container }) {
  return typeof document !== 'undefined'
    ? ReactDOM.createPortal(children, container ?? document.body)
    : null;
}
```

---

## 6. FocusScope Implementation

### Decision: Extend existing focus-trap with scope semantics

### Rationale
- **Reuse**: Build on existing `@ds/primitives-dom/focus/focus-trap.ts`
- **Trap vs Scope**: FocusScope = trap + restore focus on unmount + handle dynamic content
- **MutationObserver**: Watch for DOM changes to update focusable element list

### Features
- `trap`: Boolean to enable/disable focus trapping
- `restoreFocus`: Return focus to trigger element on unmount (default: true)
- `autoFocus`: Focus first focusable element on mount (default: true)

---

## 7. ClientOnly SSR Strategy

### Decision: Two-pass rendering with useEffect

### Rationale
- **Hydration safety**: Never render children on server; render null
- **Effect-based mounting**: Use useEffect/connectedCallback to render children client-side
- **No flash**: Children only appear after hydration is complete

### Implementation Pattern
```typescript
// React
function ClientOnly({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? children : null;
}

// WC (Lit)
class DsClientOnly extends LitElement {
  private _mounted = false;

  connectedCallback() {
    super.connectedCallback();
    this._mounted = true;
    this.requestUpdate();
  }

  render() {
    return this._mounted ? html`<slot></slot>` : nothing;
  }
}
```

---

## 8. Skeleton Animation Performance

### Decision: CSS animation with `will-change` and reduced-motion support

### Rationale
- **GPU acceleration**: Use `transform` and `opacity` for shimmer effect
- **Reduced motion**: Disable animation or use simple pulse when `prefers-reduced-motion`
- **Consistent timing**: All skeletons on page share same animation timing for visual coherence

### CSS Pattern
```css
@keyframes ds-skeleton-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.ds-skeleton::after {
  animation: ds-skeleton-shimmer 1.5s infinite;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .ds-skeleton::after {
    animation: none;
    opacity: 0.7;
  }
}
```

---

## 9. Progress ARIA Implementation

### Decision: Use progressbar role with proper value announcements

### Rationale
- **Determinate mode**: Set `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- **Indeterminate mode**: Omit `aria-valuenow` (per spec), set `aria-valuetext="Loading..."`
- **Percentage announcement**: Use `aria-valuetext` for user-friendly announcements ("50% complete")

### Markup Pattern
```html
<!-- Determinate -->
<div role="progressbar"
     aria-valuenow="50"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-valuetext="50% complete">
  <div class="ds-progress-bar" style="width: 50%"></div>
</div>

<!-- Indeterminate -->
<div role="progressbar"
     aria-valuetext="Loading..."
     aria-busy="true">
  <div class="ds-progress-indeterminate"></div>
</div>
```

---

## 10. Calendar Grid Accessibility

### Decision: ARIA grid pattern with date cell semantics

### Rationale
- **Grid navigation**: Arrow keys move between days following grid pattern
- **Month navigation**: Additional controls for month/year navigation
- **Screen reader**: Announce day, month, year on focus; indicate today and selected

### Markup Pattern
```html
<div role="grid" aria-label="January 2026">
  <div role="rowgroup">
    <div role="row">
      <div role="columnheader">Sun</div>
      <!-- ... -->
    </div>
  </div>
  <div role="rowgroup">
    <div role="row">
      <div role="gridcell" tabindex="0" aria-selected="true">1</div>
      <div role="gridcell" tabindex="-1">2</div>
      <!-- ... -->
    </div>
  </div>
</div>
```

---

## 11. Alert Role Selection

### Decision: Dynamic role based on variant severity

### Rationale
- **role="alert"**: For error and warning variants - announced immediately
- **role="status"**: For info and success variants - announced at next opportunity
- **Avoids spam**: status role doesn't interrupt user, better for frequent notifications

### Implementation
```typescript
const role = ['error', 'warning'].includes(variant) ? 'alert' : 'status';
```

---

## 12. Avatar Fallback Chain

### Decision: Image → Initials → Default icon with graceful degradation

### Rationale
- **Progressive enhancement**: Show image if available, fallback gracefully
- **Error handling**: Listen for `onerror` on img element to trigger fallback
- **Initials generation**: Extract first letters from name prop (e.g., "John Doe" → "JD")

### Implementation Pattern
```typescript
// Fallback state machine: loading → loaded | error
const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

// Render priority: image (if loaded) → initials (if name) → default icon
```

---

## 13. Existing Primitives Audit

### Available from `@ds/primitives-dom`

| Primitive | Location | Usage in This Spec |
|-----------|----------|-------------------|
| focus-trap | `focus/focus-trap.ts` | Base for FocusScope |
| dismissable-layer | `layer/dismissable-layer.ts` | Not directly needed |
| roving-focus | `behavior/` (implicit) | Tree, List navigation |
| type-ahead | `keyboard/` (check) | Tree, List typeahead |

### New Primitives to Create

| Primitive | Location | Purpose |
|-----------|----------|---------|
| portal | `layer/portal.ts` | Render to document.body |
| focus-scope | `focus/focus-scope.ts` | Enhanced focus-trap |
| client-only | `ssr/client-only.ts` | SSR boundary |
| list-behavior | `behavior/list.ts` | List keyboard navigation |
| tree-behavior | `behavior/tree.ts` | Tree keyboard navigation |
| table-behavior | `behavior/table.ts` | Table sorting/selection |

---

## References

- WAI-ARIA APG Tree Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
- WAI-ARIA APG Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
- TanStack Table Architecture: https://tanstack.com/table/latest/docs/introduction
- Sonner Toast Library (API inspiration): https://sonner.emilkowal.ski/
