# Research: Advanced Form Controls

**Feature**: 017-advanced-form-controls
**Date**: 2026-01-06
**Status**: Complete

## 1. Date Library Selection

### Decision
**Use date-fns v4.x with `@date-fns/tz` for timezone support.**

### Rationale
- date-fns v4 introduced first-class timezone support via dedicated packages
- Fully tree-shakable: import only needed functions (`import { format } from 'date-fns'`)
- Explicit locale imports prevent bundle bloat (`import { de } from 'date-fns/locale'`)
- `TZDateMini` is only 761 B; `UTCDateMini` is 239 B
- DST-safe operations using `UTCDate`

### Import Pattern
```typescript
import { format, parse, addDays, startOfMonth } from 'date-fns';
import { enUS, de, fr, es, ja } from 'date-fns/locale';
import { TZDate } from '@date-fns/tz';

// Locale-aware formatting
format(new Date(), 'PPP', { locale: de }); // "6. Januar 2026"
```

### Alternatives Considered
| Alternative | Rejected Because |
|------------|------------------|
| date-fns v3 | Lacks first-class timezone support; requires third-party `date-fns-tz` |
| Temporal API | Not yet available in all browsers; polyfill adds significant weight |
| Luxon | Larger bundle (~70KB); less tree-shakeable |
| Day.js | Plugin system adds complexity; timezone via plugins |

---

## 2. Combobox Focus Management

### Decision
**Use `aria-activedescendant` (not roving tabindex). Selection independent of focus for multi-select.**

### Rationale
- APG Combobox pattern consistently uses `aria-activedescendant`
- DOM focus stays on input; visual focus indicated by `aria-activedescendant`
- For multi-select: `aria-multiselectable="true"` on listbox; Space toggles selection
- Must manually scroll referenced option into view (browsers don't auto-scroll)

### ARIA Structure
```html
<input
  role="combobox"
  aria-expanded="true"
  aria-haspopup="listbox"
  aria-activedescendant="option-3"
  aria-controls="listbox-id"
  aria-autocomplete="list"
/>
<ul role="listbox" id="listbox-id">
  <li role="option" id="option-1">Option 1</li>
  <li role="option" id="option-2">Option 2</li>
  <li role="option" id="option-3" aria-selected="true">Option 3</li>
</ul>
```

### Async Loading Pattern
```html
<input aria-busy="true" />
<ul role="listbox" aria-busy="true">
  <!-- Options populated asynchronously -->
</ul>
<div aria-live="polite">Loading suggestions...</div>
```

### Alternatives Considered
| Alternative | Rejected Because |
|------------|------------------|
| Roving tabindex | Not recommended by APG for combobox; focus should stay on input |
| Selection follows focus (multi) | Degrades accessibility; users can't review before selecting |

---

## 3. List Virtualization

### Decision
**Native Intersection Observer with `rootMargin` buffer zones. Auto-activate at >100 items.**

### Rationale
- Zero third-party dependencies (constitution compliance)
- `rootMargin` creates pre-render buffer (200-500px) for smooth scrolling
- Works well for hundreds to thousands of items
- Handles variable-height items naturally

### Implementation Pattern
```typescript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        renderItem(entry.target);
      } else {
        unrenderItem(entry.target);
      }
    });
  },
  {
    root: scrollContainer,
    rootMargin: '300px 0px 300px 0px',
    threshold: 0
  }
);
```

### Alternatives Considered
| Alternative | Rejected Because |
|------------|------------------|
| TanStack Virtual | Third-party dependency |
| react-window | Framework-specific; fixed height assumption |
| CSS content-visibility | Less control; browser heuristics may not match needs |

---

## 4. Multi-Thumb Slider ARIA

### Decision
**Two independent `role="slider"` elements, each with unique accessible names and `aria-controls` pointing to each other.**

### Rationale
- APG Multi-Thumb Slider pattern specifies each thumb as separate focusable slider
- Tab order remains constant (first thumb always before second)
- Each thumb needs unique name ("Minimum price" / "Maximum price")
- `aria-controls` creates semantic relationship between thumbs

### ARIA Structure
```html
<div role="group" aria-labelledby="price-label">
  <span id="price-label">Price range</span>

  <div
    role="slider"
    tabindex="0"
    aria-label="Minimum price"
    aria-valuemin="0"
    aria-valuemax="1000"
    aria-valuenow="200"
    aria-valuetext="$200"
    aria-controls="max-thumb"
    id="min-thumb"
  ></div>

  <div
    role="slider"
    tabindex="0"
    aria-label="Maximum price"
    aria-valuemin="0"
    aria-valuemax="1000"
    aria-valuenow="800"
    aria-valuetext="$800"
    aria-controls="min-thumb"
    id="max-thumb"
  ></div>
</div>
```

### Keyboard Navigation
| Key | Action |
|-----|--------|
| Arrow Right/Up | Increase by step |
| Arrow Left/Down | Decrease by step |
| Page Up/Down | Large step (10x) |
| Home/End | Min/max value |

### Alternatives Considered
| Alternative | Rejected Because |
|------------|------------------|
| Single slider with range | No ARIA pattern; poor AT support |
| Native `<input type="range">` | No multi-thumb support |

---

## 5. File Drag-and-Drop Accessibility

### Decision
**Always provide visible button alternative. Use ARIA live regions for announcements. Never use deprecated `aria-grabbed`/`aria-dropeffect`.**

### Rationale
- WCAG 2.5.7 (Dragging Movements) requires single-pointer alternatives
- `aria-grabbed` and `aria-dropeffect` deprecated in ARIA 1.1; no AT support
- Live regions announce drag states and upload results
- Mobile users require pointer alternatives

### Implementation Pattern
```html
<div class="file-drop-zone" role="region" aria-labelledby="drop-label">
  <span id="drop-label">Upload files</span>
  <p>Drag files here or use the button below</p>

  <!-- Always visible alternative -->
  <label>
    <span>Choose files</span>
    <input type="file" multiple accept=".pdf,.doc" />
  </label>

  <!-- Live region for announcements -->
  <div aria-live="polite" class="sr-only"></div>
</div>
```

### Event Handling
```typescript
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files);
  liveRegion.textContent = `${files.length} file(s) uploaded`;
});
```

### Alternatives Considered
| Alternative | Rejected Because |
|------------|------------------|
| aria-grabbed/aria-dropeffect | Deprecated; no AT implementation |
| Drag-only interface | Fails WCAG 2.5.7 |

---

## Summary: Technology Decisions

| Area | Decision | Dependencies | Bundle Impact |
|------|----------|--------------|---------------|
| Date handling | date-fns v4 + @date-fns/tz | date-fns@^4.0.0 | ~761 B (TZDateMini) |
| Combobox focus | aria-activedescendant | None | 0 B |
| Virtualization | Intersection Observer | None | 0 B |
| Multi-thumb slider | Dual role="slider" | None | 0 B |
| File drag-drop | Native events + live regions | None | 0 B |

---

## Resolved Clarifications

All NEEDS CLARIFICATION items from Technical Context have been resolved:

1. ✅ **Date library**: date-fns v4 with @date-fns/tz
2. ✅ **Virtualization threshold**: >100 options (from spec clarification)
3. ✅ **Async loading pattern**: Component manages state via loadItems callback (from spec clarification)
4. ✅ **Combobox ARIA pattern**: aria-activedescendant, not roving tabindex
5. ✅ **Slider accessibility**: Dual role="slider" with aria-controls
6. ✅ **Drag-drop a11y**: Live regions + button alternative
