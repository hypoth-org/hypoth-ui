# @ds/react

React adapters for the hypoth-ui design system Web Components.

## Installation

```bash
pnpm add @ds/react
```

### Peer Dependencies

```bash
pnpm add @ds/wc react react-dom
```

## Usage

### Server Components (Next.js App Router)

Import types for server components:

```tsx
import type { ButtonProps, DialogRootProps } from "@ds/react";
```

### Client Components

For interactive components, use the client entry point:

```tsx
"use client";
import { Button, Dialog, Input } from "@ds/react/client";

function MyComponent() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>Open Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Edit Profile</Dialog.Title>
        <Input placeholder="Enter name" />
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

### Backwards Compatible Import

Components are also exported from the main entry:

```tsx
import { Button, Input, Dialog } from "@ds/react";
```

## Components

### Core

| Component | Description |
|-----------|-------------|
| `Button` | Interactive button with variants and sizes |
| `Input` | Text input field |
| `Text` | Typography component |
| `Link` | Styled anchor link |
| `Icon` | Icon display with Lucide icons |
| `Spinner` | Loading spinner |
| `VisuallyHidden` | Screen reader only content |

### Form Controls

| Component | Pattern | Description |
|-----------|---------|-------------|
| `Field` | Simple | Form field wrapper |
| `Label` | Simple | Form label |
| `FieldDescription` | Simple | Field help text |
| `FieldError` | Simple | Field error message |
| `Textarea` | Simple | Multi-line text input |
| `Checkbox` | Simple | Checkbox input |
| `RadioGroup` | Simple | Radio button group |
| `Radio` | Simple | Radio button |
| `Switch` | Simple | Toggle switch |
| `Slider` | Compound | Range slider (`Root`, `Track`, `Range`, `Thumb`) |
| `NumberInput` | Compound | Numeric input (`Root`, `Field`, `Increment`, `Decrement`) |
| `FileUpload` | Compound | File upload (`Root`, `Dropzone`, `Input`, `Item`) |
| `PinInput` | Compound | PIN/OTP input (`Root`, `Field`) |

### Selection Controls

| Component | Pattern | Description |
|-----------|---------|-------------|
| `Select` | Compound | Single select (`Root`, `Trigger`, `Value`, `Content`, `Option`, `Separator`, `Label`) |
| `Combobox` | Compound | Searchable combobox (`Root`, `Input`, `Content`, `Option`, `Tag`, `Empty`, `Loading`) |

### Date & Time

| Component | Pattern | Description |
|-----------|---------|-------------|
| `DatePicker` | Compound | Date picker (`Root`, `Trigger`, `Content`, `Calendar`) |
| `TimePicker` | Compound | Time picker (`Root`, `Segment`) |

### Dialogs & Overlays

| Component | Pattern | Description |
|-----------|---------|-------------|
| `Dialog` | Compound | Modal dialog (`Root`, `Trigger`, `Content`, `Title`, `Description`, `Close`) |
| `AlertDialog` | Compound | Confirmation dialog (`Root`, `Trigger`, `Content`, `Header`, `Footer`, `Title`, `Description`, `Action`, `Cancel`) |
| `Sheet` | Compound | Side panel (`Root`, `Trigger`, `Content`, `Header`, `Footer`, `Title`, `Description`, `Close`) |
| `Drawer` | Compound | Mobile drawer (`Root`, `Trigger`, `Content`, `Header`, `Footer`, `Title`, `Description`) |
| `Popover` | Simple | Floating popover |
| `PopoverContent` | Simple | Popover content |
| `Tooltip` | Simple | Information tooltip |
| `TooltipContent` | Simple | Tooltip content |
| `HoverCard` | Compound | Rich preview (`Root`, `Trigger`, `Content`) |

### Menus

| Component | Pattern | Description |
|-----------|---------|-------------|
| `Menu` | Compound | Basic menu (`Root`, `Trigger`, `Content`, `Item`, `Separator`, `Label`) |
| `DropdownMenu` | Compound | Dropdown menu (`Root`, `Trigger`, `Content`, `Item`, `Separator`, `Label`, `CheckboxItem`, `RadioGroup`, `RadioItem`) |
| `ContextMenu` | Compound | Right-click menu (`Root`, `Trigger`, `Content`, `Item`, `Separator`, `Label`) |

### Navigation

| Component | Pattern | Description |
|-----------|---------|-------------|
| `NavigationMenu` | Compound | Site navigation (`Root`, `List`, `Item`, `Trigger`, `Content`, `Link`, `Indicator`, `Viewport`) |
| `Breadcrumb` | Compound | Breadcrumb trail (`Root`, `List`, `Item`, `Link`, `Page`, `Separator`) |
| `Pagination` | Compound | Page navigation (`Root`, `Content`, `Item`, `Link`, `Previous`, `Next`, `Ellipsis`) |
| `Stepper` | Compound | Multi-step workflow (`Root`, `Item`, `Trigger`, `Indicator`, `Title`, `Description`, `Separator`, `Content`) |

### Layout & Structure

| Component | Pattern | Description |
|-----------|---------|-------------|
| `Card` | Compound | Content card (`Root`, `Header`, `Content`, `Footer`) |
| `Separator` | Simple | Visual divider |
| `AspectRatio` | Simple | Fixed aspect ratio container |
| `Collapsible` | Compound | Expandable section (`Root`, `Trigger`, `Content`) |
| `Tabs` | Compound | Tabbed interface (`Root`, `List`, `Trigger`, `Content`) |
| `Accordion` | Compound | Accordion (`Root`, `Item`, `Trigger`, `Content`) |
| `ScrollArea` | Compound | Custom scrollable area (`Root`, `Viewport`, `Scrollbar`, `Thumb`) |

### Command Palette

| Component | Pattern | Description |
|-----------|---------|-------------|
| `Command` | Compound | Command palette (`Root`, `Input`, `List`, `Item`, `Group`, `Separator`, `Empty`, `Loading`) |

### Feedback

| Component | Pattern | Description |
|-----------|---------|-------------|
| `Alert` | Simple | Alert message with variants (info, success, warning, error) |
| `Toast` | Compound | Toast notifications (`Provider`, + `useToast` hook) |
| `Progress` | Simple | Progress indicator (linear/circular) |

### Data Display

| Component | Pattern | Description |
|-----------|---------|-------------|
| `Avatar` | Simple | User avatar with image, initials, or fallback |
| `AvatarGroup` | Simple | Stacked avatar group |
| `Table` | Compound | Data table (`Root` as `Table`, `Header`, `Body`, `Row`, `Head`, `Cell`) |
| `DataTable` | Simple | Advanced data table with pagination/virtualization |
| `Skeleton` | Simple | Loading placeholder skeleton |
| `Badge` | Simple | Status badge with variants |
| `Tag` | Simple | Removable tag/chip |
| `Tree` | Compound | Tree view (`Root` as `Tree`, `Item` as `Tree.Item`) |
| `List` | Compound | Selectable list (`Root` as `List`, `Item` as `List.Item`) |
| `Calendar` | Simple | Calendar date picker |

### Utility Primitives

| Primitive | Description |
|-----------|-------------|
| `Portal` | Render children into a portal |
| `FocusScope` | Focus trap container |
| `ClientOnly` | Client-side only rendering |
| `useIsClient` | Hook for client-side detection |

## Compound Component Pattern

Most complex components use the compound pattern:

```tsx
import { Dialog } from "@ds/react";

<Dialog.Root>
  <Dialog.Trigger>
    <Button>Open</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Dialog Title</Dialog.Title>
    <Dialog.Description>Description text</Dialog.Description>
    <Dialog.Close>
      <Button variant="ghost">Close</Button>
    </Dialog.Close>
  </Dialog.Content>
</Dialog.Root>
```

## Primitives

| Primitive | Description |
|-----------|-------------|
| `Box` | Layout primitive with style props |
| `Slot` | Render children with merged props |
| `Presence` | Animate mount/unmount |
| `usePresence` | Hook for presence state |

## Utilities

```tsx
import {
  createEventHandler,
  composeEventHandlers,
  mergeClassNames,
  mergeStyles,
  mergeProps
} from "@ds/react";
```

| Utility | Description |
|---------|-------------|
| `createEventHandler` | Create typed event handlers |
| `composeEventHandlers` | Compose multiple handlers |
| `mergeClassNames` | Merge class name strings |
| `mergeStyles` | Merge style objects |
| `mergeProps` | Merge prop objects |

## Event Handling

Components emit custom events that are wrapped as React callbacks:

```tsx
<Select.Root onValueChange={(value) => console.log(value)}>
  {/* ... */}
</Select.Root>

<Command.Root onSelect={(value) => handleCommand(value)}>
  {/* ... */}
</Command.Root>
```

## Scripts

```bash
pnpm build       # Build the package
pnpm typecheck   # Type check
pnpm test        # Run unit tests
pnpm test:a11y   # Run accessibility tests
```

## License

MIT
