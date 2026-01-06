# Quickstart: Animation System

**Feature**: 016-motion-system
**Date**: 2026-01-06

## Overview

This guide covers implementing the animation system for component enter/exit transitions.

## Prerequisites

- Node.js 18+
- pnpm 8+
- Familiarity with existing packages: `@ds/tokens`, `@ds/css`, `@ds/primitives-dom`, `@ds/wc`, `@ds/react`

## Implementation Order

### Phase 1: CSS Animations

1. **Create animation keyframes** in `@ds/css`
   - Add `src/layers/animations.css` with keyframe definitions
   - Add animation utility classes
   - Import in `src/index.css`

2. **Verify token integration**
   - Ensure animations reference `--ds-motion-duration-*` and `--ds-motion-easing-*` tokens
   - Verify reduced-motion mode tokens work

### Phase 2: Presence Utility

3. **Create presence utility** in `@ds/primitives-dom`
   - Add `src/animation/presence.ts`
   - Implement `createPresence()` function
   - Export from `src/index.ts`

4. **Add reduced motion detection**
   - Use `matchMedia('(prefers-reduced-motion: reduce)')`
   - Export `prefersReducedMotion()` helper

### Phase 3: Component Integration

5. **Update behavior primitives**
   - Add animation state tracking to dialog behavior
   - Integrate presence utility for exit animation timing

6. **Update overlay components** in `@ds/wc`
   - Add `data-state` attribute to content components
   - Apply CSS animations via attribute selectors
   - Wire up animation completion for close timing

### Phase 4: React Presence

7. **Create React Presence component** in `@ds/react`
   - Implement `Presence` component
   - Handle ref forwarding and animation detection
   - Add to exports

### Phase 5: Testing & Documentation

8. **Add unit tests**
   - Test presence utility
   - Test animation state transitions
   - Test reduced motion behavior

9. **Update component documentation**
   - Add animation section to overlay component docs
   - Document customization via tokens

---

## Key Files

| Package | File | Purpose |
|---------|------|---------|
| `@ds/css` | `src/layers/animations.css` | Keyframes and utility classes |
| `@ds/primitives-dom` | `src/animation/presence.ts` | Exit animation coordination |
| `@ds/wc` | `src/components/dialog/dialog.ts` | Animation integration example |
| `@ds/react` | `src/primitives/Presence.tsx` | React presence component |

---

## Usage Examples

### Web Components

```html
<!-- Dialog with default animations -->
<ds-dialog>
  <ds-dialog-content data-state="open">
    <ds-dialog-title>Animated Dialog</ds-dialog-title>
    <p>This dialog animates in and out.</p>
  </ds-dialog-content>
</ds-dialog>

<!-- Custom animation overrides -->
<ds-dialog-content
  data-state="open"
  data-animate-in="fade-in scale-in"
  data-animate-out="fade-out"
>
  ...
</ds-dialog-content>

<!-- Disable animation for specific component -->
<ds-popover-content data-state="open" data-no-animation>
  ...
</ds-popover-content>
```

### React

```tsx
import { Presence } from '@ds/react';

function AnimatedDialog({ isOpen, onClose }) {
  return (
    <Presence present={isOpen}>
      <Dialog.Content className="ds-animate-fade-in data-[state=closed]:ds-animate-fade-out">
        <Dialog.Title>Animated Dialog</Dialog.Title>
        <p>This dialog animates in and out.</p>
        <button onClick={onClose}>Close</button>
      </Dialog.Content>
    </Presence>
  );
}
```

### CSS Utility Classes

```html
<!-- Manual animation classes -->
<div class="ds-animate-fade-in">Fades in</div>
<div class="ds-animate-scale-in">Scales in</div>
<div class="ds-animate-slide-up">Slides up</div>
```

### Token Customization

```css
/* Override animation timing globally */
:root {
  --ds-motion-duration-normal: 300ms; /* slower animations */
  --ds-motion-easing-ease-out: cubic-bezier(0.34, 1.56, 0.64, 1); /* bouncy */
}

/* Per-component override */
ds-dialog-content {
  animation-duration: 400ms;
}
```

---

## Testing Commands

```bash
# Run animation-related tests
pnpm --filter @ds/primitives-dom test:unit
pnpm --filter @ds/wc test:unit
pnpm --filter @ds/react test:unit

# Typecheck
pnpm --filter @ds/primitives-dom typecheck
pnpm --filter @ds/react typecheck

# Build and verify CSS
pnpm --filter @ds/css build
```

---

## Verification Checklist

- [ ] Animations play at 60fps (check DevTools Performance tab)
- [ ] Reduced motion mode disables all animations
- [ ] Exit animations complete before element removal
- [ ] Token changes affect all animated components
- [ ] Works in SSR (no hydration mismatches)
- [ ] Bundle size ≤3KB for presence logic
