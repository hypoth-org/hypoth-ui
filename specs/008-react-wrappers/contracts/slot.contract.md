# Contract: Slot Component

**Component**: `Slot`
**Path**: `packages/react/src/primitives/slot.tsx`
**Type**: React-only utility component

## Purpose

Slot is an internal utility component that renders its child element with merged props. It powers the `asChild` pattern used by Box, Text, and Link components.

## API Contract

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `React.ReactNode` | required | Must be a single React element |
| ...rest | `React.HTMLAttributes` | - | Props to merge onto child element |

### Behavior

1. **Single Child Requirement**
   - MUST throw error if children is not a single valid React element
   - MUST NOT accept fragments (`<></>`)
   - MUST NOT accept multiple children
   - Error message: `"Slot expects a single React element child"`

2. **Props Merging**
   - Child props take precedence over Slot props
   - Exception: `className` is concatenated (Slot className + child className)
   - Exception: `style` is merged (Slot style spread before child style)
   - Exception: Event handlers are composed (both called)

3. **Event Handler Composition**
   - Handlers starting with `on` are composed
   - Child handler executes first
   - Slot handler executes if child handler didn't call `event.preventDefault()`

4. **Ref Forwarding**
   - MUST merge Slot ref and child ref
   - Both refs receive the DOM element

## Test Cases

### Single Child Validation
```tsx
// Valid
<Slot><button>OK</button></Slot>

// Invalid - throws error
<Slot>Just text</Slot>
<Slot><>Fragment</></Slot>
<Slot><span>A</span><span>B</span></Slot>
```

### Props Merging
```tsx
// className concatenation
<Slot className="slot-class">
  <div className="child-class">Content</div>
</Slot>
// Result: <div class="slot-class child-class">Content</div>

// Child props win
<Slot data-x="slot">
  <div data-x="child">Content</div>
</Slot>
// Result: <div data-x="child">Content</div>

// Style merging
<Slot style={{ color: 'red', fontSize: 16 }}>
  <div style={{ color: 'blue' }}>Content</div>
</Slot>
// Result: <div style="color: blue; font-size: 16px">Content</div>
```

### Event Handler Composition
```tsx
<Slot onClick={() => console.log('slot')}>
  <button onClick={() => console.log('child')}>
    Click
  </button>
</Slot>
// Click logs: "child", then "slot"

// With preventDefault
<Slot onClick={() => console.log('slot')}>
  <button onClick={(e) => {
    e.preventDefault();
    console.log('child');
  }}>
    Click
  </button>
</Slot>
// Click logs: "child" only (slot handler skipped)
```

## Dependencies

- React 18+ (forwardRef, cloneElement, isValidElement, Children)
- No external dependencies

## Bundle Impact

- Target: <500 bytes minified
- Zero runtime dependencies
