# Data Model: Animation System

**Feature**: 016-motion-system
**Date**: 2026-01-06

## Entities

### 1. Motion Token (Existing - Extended)

Motion tokens are already defined in `@ds/tokens`. This feature uses them without modification.

**Location**: `packages/tokens/src/tokens/global/motion.json`

| Attribute | Type | Description |
|-----------|------|-------------|
| `duration.instant` | duration | 0ms - No animation |
| `duration.fast` | duration | 100ms - Micro-interactions |
| `duration.normal` | duration | 200ms - Standard transitions |
| `duration.slow` | duration | 300ms - Emphasized transitions |
| `duration.slower` | duration | 500ms - Large elements |
| `duration.slowest` | duration | 1000ms - Dramatic effect |
| `easing.linear` | cubicBezier | [0, 0, 1, 1] |
| `easing.ease` | cubicBezier | [0.25, 0.1, 0.25, 1] |
| `easing.ease-in` | cubicBezier | [0.42, 0, 1, 1] |
| `easing.ease-out` | cubicBezier | [0, 0, 0.58, 1] |
| `easing.ease-in-out` | cubicBezier | [0.42, 0, 0.58, 1] |
| `easing.spring` | cubicBezier | [0.175, 0.885, 0.32, 1.275] |
| `easing.bounce` | cubicBezier | [0.68, -0.55, 0.265, 1.55] |

**CSS Variables Output**:
```css
--ds-motion-duration-instant: 0ms;
--ds-motion-duration-fast: 100ms;
--ds-motion-duration-normal: 200ms;
--ds-motion-duration-slow: 300ms;
--ds-motion-easing-ease: cubic-bezier(0.25, 0.1, 0.25, 1);
--ds-motion-easing-ease-out: cubic-bezier(0, 0, 0.58, 1);
/* etc. */
```

---

### 2. Animation Preset

Defines a reusable animation configuration combining keyframes with timing.

| Attribute | Type | Values | Description |
|-----------|------|--------|-------------|
| `name` | string | See list below | Unique identifier |
| `keyframes` | string | CSS @keyframes name | Animation keyframes |
| `defaultDuration` | token | `duration.*` | Default timing |
| `defaultEasing` | token | `easing.*` | Default curve |
| `direction` | enum | `in`, `out` | Entry or exit |

**Available Presets**:

| Name | Keyframes | Duration | Easing | Direction |
|------|-----------|----------|--------|-----------|
| `fade-in` | `ds-fade-in` | normal | ease-out | in |
| `fade-out` | `ds-fade-out` | fast | ease-in | out |
| `scale-in` | `ds-scale-in` | normal | ease-out | in |
| `scale-out` | `ds-scale-out` | fast | ease-in | out |
| `slide-up` | `ds-slide-up` | normal | ease-out | in |
| `slide-down` | `ds-slide-down` | fast | ease-in | out |

---

### 3. Animation State

Represents the current animation lifecycle of an element.

| State | Description | CSS Selector |
|-------|-------------|--------------|
| `idle` | No animation active | `[data-state="open"]:not([data-animating])` |
| `animating-in` | Entry animation playing | `[data-state="open"][data-animating="in"]` |
| `animating-out` | Exit animation playing | `[data-state="closed"][data-animating="out"]` |
| `exited` | Animation complete, ready for unmount | N/A (element removed) |

**State Transitions**:

```
                    open()
    [hidden] ──────────────────► [animating-in]
                                       │
                                       │ animationend
                                       ▼
                                    [idle]
                                       │
                    close()            │
                                       ▼
                               [animating-out]
                                       │
                                       │ animationend
                                       ▼
                                   [exited]
                                       │
                                       │ unmount
                                       ▼
                                   [hidden]
```

---

### 4. Presence State (React)

React-specific state for managing child presence during exit animations.

| Attribute | Type | Description |
|-----------|------|-------------|
| `present` | boolean | External control (prop) |
| `isPresent` | boolean | Internal presence (derived) |
| `animationState` | AnimationState | Current animation phase |
| `ref` | RefObject | Reference to animated element |

**State Logic**:
```typescript
if (present && !isPresent) {
  // Mounting: set isPresent=true immediately
  isPresent = true;
  animationState = 'animating-in';
}

if (!present && isPresent) {
  // Unmounting: wait for exit animation
  animationState = 'animating-out';
  // On animationend: isPresent = false
}
```

---

### 5. Overlay Animation Config

Configuration for overlay-specific animation behavior.

| Component | Enter Animation | Exit Animation | Anchor-Relative |
|-----------|-----------------|----------------|-----------------|
| Dialog | fade-in + scale-in | fade-out + scale-out | No |
| Popover | fade-in + slide-up | fade-out + slide-down | Yes |
| Tooltip | fade-in | fade-out | Yes |
| Menu | fade-in + slide-down | fade-out + slide-up | Yes |

---

## Validation Rules

### Motion Tokens
- Duration values must be non-negative integers with `ms` unit
- Easing values must be valid cubic-bezier arrays with 4 numbers
- All numbers in range [-2, 2] for cubic-bezier

### Animation State
- Only one animation state active at a time
- Cannot transition from `animating-out` back to `idle` (must complete to `exited`)
- `animating-in` can be interrupted by `close()` (transitions to `animating-out`)

### Reduced Motion
- When `prefers-reduced-motion: reduce`:
  - All durations effectively become `0ms`
  - State transitions still occur, just instantaneously
  - No visual animation, functional behavior unchanged

---

## Relationships

```
┌─────────────────┐
│  Motion Token   │
│  (duration,     │
│   easing)       │
└────────┬────────┘
         │ uses
         ▼
┌─────────────────┐
│ Animation       │
│ Preset          │
│ (keyframes +    │
│  timing)        │
└────────┬────────┘
         │ applied to
         ▼
┌─────────────────┐
│ Component       │
│ (dialog,        │
│  popover, etc.) │
└────────┬────────┘
         │ tracks
         ▼
┌─────────────────┐
│ Animation       │
│ State           │
│ (idle,          │
│  animating-in,  │
│  animating-out) │
└─────────────────┘
```
