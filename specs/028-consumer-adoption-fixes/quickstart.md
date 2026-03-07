# Quickstart: Consumer Adoption Fixes

## After This Feature

### Correct Import Patterns

```tsx
// Types (server-safe, no "use client" needed)
import type { ButtonProps, DialogRootProps } from "@hypoth-ui/react";

// Runtime components (client-only)
import { DsButton, Dialog, Input } from "@hypoth-ui/react/client";
```

### Correct README Getting Started

```tsx
import '@hypoth-ui/css';
import { DsButton } from '@hypoth-ui/react/client';

export default function App() {
  return <DsButton onPress={() => console.log('clicked')}>Click me</DsButton>;
}
```

### Correct Dialog Usage

```tsx
import { Dialog } from '@hypoth-ui/react/client';

<Dialog.Root>
  <Dialog.Trigger>
    <DsButton>Open</DsButton>
  </Dialog.Trigger>
  <Dialog.Content>
    <p>Dialog content here.</p>
  </Dialog.Content>
</Dialog.Root>
```

### WC Event Pattern (After OPEN_CHANGE Migration)

```typescript
// Before (deprecated — separate events)
emitEvent(this, StandardEvents.OPEN);
emitEvent(this, StandardEvents.CLOSE);

// After (unified event with detail)
emitEvent(this, StandardEvents.OPEN_CHANGE, { detail: { open: true } });
emitEvent(this, StandardEvents.OPEN_CHANGE, { detail: { open: false } });

// Cancelable close with reason
emitEvent(this, StandardEvents.OPEN_CHANGE, {
  detail: { open: false, reason: "escape" },
  cancelable: true,
});
```

### Optional Dependencies

After FR-011, consumers using DatePicker or Icon must install:

```bash
# Only if using DatePicker/TimePicker
pnpm add date-fns @date-fns/tz

# Only if using Icon component
pnpm add lucide
```
