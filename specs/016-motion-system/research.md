# Research: Animation System

**Feature**: 016-motion-system
**Date**: 2026-01-06

## Executive Summary

This research consolidates findings for implementing a CSS-first animation system. All technical decisions align with the constitution's Performance > Accessibility > Customizability priority.

---

## Research Topic 1: CSS Animation Keyframe Patterns

### Context
Need to define reusable animation keyframes for overlay components (fade, slide, scale).

### Findings

**CSS `@keyframes` with CSS Custom Properties**:
- CSS keyframes can reference CSS custom properties for dynamic timing
- GPU-accelerated properties: `transform`, `opacity` (avoid `top/left/width/height`)
- Animation direction: use `animation-direction: reverse` for exit animations OR define separate exit keyframes

**Best Practice Pattern**:
```css
@keyframes ds-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes ds-scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes ds-slide-up {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Decision
- Define 6 keyframes: `fade-in`, `fade-out`, `scale-in`, `scale-out`, `slide-up`, `slide-down`
- Use explicit exit keyframes (not `animation-direction: reverse`) for better control
- Use `transform` and `opacity` only for GPU acceleration

### Rationale
Explicit exit keyframes provide more control over asymmetric timings (e.g., faster exit than entry). Transform/opacity are compositable properties that don't trigger layout.

### Alternatives Considered
1. **Web Animations API**: More powerful but requires JavaScript; rejected for CSS-first approach
2. **CSS Transitions only**: Simpler but can't handle complex multi-step animations
3. **animation-direction: reverse**: Less explicit, harder to customize exit timing independently

---

## Research Topic 2: Presence Detection for Exit Animations

### Context
Need to detect when an element should animate out and delay DOM removal until animation completes.

### Findings

**AnimationEvent API**:
- `animationend` event fires when CSS animation completes
- Can use `element.getAnimations()` to check active animations
- Works in all modern browsers

**Pattern from Radix/Framer Motion**:
```typescript
// Presence detection pattern
function createPresence(options: {
  onExitComplete: () => void;
}) {
  return {
    startExitAnimation(element: HTMLElement) {
      const handleAnimationEnd = () => {
        element.removeEventListener('animationend', handleAnimationEnd);
        options.onExitComplete();
      };
      element.addEventListener('animationend', handleAnimationEnd);
      element.dataset.state = 'closed'; // Triggers exit animation via CSS
    }
  };
}
```

### Decision
- Create `createPresence` utility in `@ds/primitives-dom`
- Use `animationend` event to detect completion
- Use `data-state="open|closed"` attribute to trigger CSS animations
- Integrate with existing behavior primitives via state callbacks

### Rationale
Event-based detection is reliable and doesn't require polling. Data attributes provide CSS hooks without JavaScript animation logic.

### Alternatives Considered
1. **setTimeout with fixed duration**: Fragile if CSS timing changes
2. **requestAnimationFrame polling**: More complex, unnecessary overhead
3. **MutationObserver**: Overkill for this use case

---

## Research Topic 3: Reduced Motion Implementation

### Context
Must respect `prefers-reduced-motion` for accessibility compliance.

### Findings

**Existing Infrastructure**:
- `@ds/tokens` already has `modes/reduced-motion.json` that sets all durations to `0ms`
- This mode is applied via CSS class or media query

**CSS Media Query Approach**:
```css
@media (prefers-reduced-motion: reduce) {
  .ds-animate-fade-in,
  .ds-animate-scale-in {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

**Token Override Approach** (existing):
```css
[data-mode="reduced-motion"] {
  --ds-motion-duration-fast: 0ms;
  --ds-motion-duration-normal: 0ms;
  --ds-motion-duration-slow: 0ms;
}
```

### Decision
- Use both approaches for defense in depth:
  1. CSS media query for automatic browser-level detection
  2. Token override for programmatic control
- Ensure animation classes use token-based durations
- Presence utility should check `prefersReducedMotion()` and skip animation wait

### Rationale
Defense in depth ensures accessibility even if one mechanism fails. Existing token infrastructure provides consistency.

### Alternatives Considered
1. **JavaScript-only detection**: Less reliable, can miss initial render
2. **Media query only**: No programmatic override capability
3. **Token override only**: Requires page-level class, doesn't auto-detect

---

## Research Topic 4: Component Integration Pattern

### Context
Need to add animation support to existing overlay components without breaking changes.

### Findings

**Data Attribute Pattern**:
```html
<!-- Entry: data-state="open" triggers enter animation -->
<ds-dialog-content data-state="open">
  ...
</ds-dialog-content>

<!-- Exit: data-state="closed" triggers exit animation, wait for animationend -->
<ds-dialog-content data-state="closed">
  ...
</ds-dialog-content>
```

**CSS Implementation**:
```css
ds-dialog-content[data-state="open"] {
  animation: ds-fade-in var(--ds-motion-duration-normal) var(--ds-motion-easing-ease-out);
}

ds-dialog-content[data-state="closed"] {
  animation: ds-fade-out var(--ds-motion-duration-fast) var(--ds-motion-easing-ease-in);
}
```

**Behavior Integration**:
- Dialog behavior already has `open: boolean` state
- Add `animationState: 'idle' | 'animating-in' | 'animating-out'` to behavior state
- Behavior's `close()` triggers animation, waits for completion before `onOpenChange(false)`

### Decision
- Use `data-state` attribute pattern (already in use for other states)
- Add animation state tracking to behavior primitives
- Components opt-in to animation via CSS (no JavaScript required in component)
- Default animations defined in component CSS, overridable via tokens

### Rationale
Data attribute pattern is consistent with existing component patterns. Keeps animation logic in CSS, JavaScript only coordinates timing.

### Alternatives Considered
1. **Class-based**: Requires more JavaScript manipulation
2. **Inline styles**: Breaks customizability, violates constitution
3. **Animation props on components**: Increases API surface unnecessarily

---

## Research Topic 5: React Presence Component

### Context
React requires a Presence wrapper to delay unmounting for exit animations.

### Findings

**Pattern from Radix UI Presence**:
```tsx
interface PresenceProps {
  present: boolean;
  children: React.ReactElement;
}

function Presence({ present, children }: PresenceProps) {
  const [isPresent, setIsPresent] = useState(present);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (present) {
      setIsPresent(true);
    } else {
      // Wait for animation to complete
      const element = ref.current;
      if (element) {
        const handleAnimationEnd = () => {
          setIsPresent(false);
          element.removeEventListener('animationend', handleAnimationEnd);
        };
        element.addEventListener('animationend', handleAnimationEnd);
        return () => element.removeEventListener('animationend', handleAnimationEnd);
      }
      setIsPresent(false);
    }
  }, [present]);

  if (!isPresent) return null;

  return cloneElement(children, {
    ref,
    'data-state': present ? 'open' : 'closed',
  });
}
```

### Decision
- Implement `Presence` component in `@ds/react`
- Use `animationend` event detection
- Support `forceMount` prop for controlled visibility
- Integrate with reduced motion detection

### Rationale
Follows established patterns from Radix UI. Minimal API surface, works with any animatable child.

### Alternatives Considered
1. **Context-based presence**: More complex, not needed for simple case
2. **Render prop pattern**: Less ergonomic than children
3. **HOC pattern**: Outdated, hooks are preferred

---

## Summary of Decisions

| Topic | Decision | Key Rationale |
|-------|----------|---------------|
| Keyframes | 6 explicit keyframes (enter/exit pairs) | GPU-accelerated, explicit control |
| Presence | `animationend` event detection | Reliable, no polling |
| Reduced Motion | Dual: CSS media query + token override | Defense in depth |
| Component Integration | `data-state` attribute pattern | Consistent with existing patterns |
| React Presence | Clone element with ref and state | Minimal API, follows Radix pattern |
