# Quickstart: Structure, Navigation & Overlays

**Phase 1 Output** | **Date**: 2026-01-07

## Installation

```bash
# Web Components
pnpm add @ds/wc @ds/css

# React
pnpm add @ds/react @ds/css
```

## Setup

### CSS Import

```css
/* Import base styles including new components */
@import "@ds/css";
```

### Web Components Registration

```typescript
// app/define-elements.ts (Next.js client boundary)
"use client";

import "@ds/wc/define";
```

### React Usage

```tsx
import { Tabs, Card, Sheet, DropdownMenu } from "@ds/react";
```

## Quick Examples

### Card

```tsx
// React
<Card>
  <Card.Header>
    <h3>Card Title</h3>
  </Card.Header>
  <Card.Content>
    <p>Card content goes here.</p>
  </Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

```html
<!-- Web Component -->
<ds-card>
  <ds-card-header>
    <h3>Card Title</h3>
  </ds-card-header>
  <ds-card-content>
    <p>Card content goes here.</p>
  </ds-card-content>
  <ds-card-footer>
    <button>Action</button>
  </ds-card-footer>
</ds-card>
```

### Tabs

```tsx
// React
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
    <Tabs.Trigger value="tab3" disabled>Tab 3</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Content for tab 1</Tabs.Content>
  <Tabs.Content value="tab2">Content for tab 2</Tabs.Content>
  <Tabs.Content value="tab3">Content for tab 3</Tabs.Content>
</Tabs>
```

```html
<!-- Web Component -->
<ds-tabs default-value="tab1">
  <ds-tabs-list>
    <ds-tabs-trigger value="tab1">Tab 1</ds-tabs-trigger>
    <ds-tabs-trigger value="tab2">Tab 2</ds-tabs-trigger>
    <ds-tabs-trigger value="tab3" disabled>Tab 3</ds-tabs-trigger>
  </ds-tabs-list>
  <ds-tabs-content value="tab1">Content for tab 1</ds-tabs-content>
  <ds-tabs-content value="tab2">Content for tab 2</ds-tabs-content>
  <ds-tabs-content value="tab3">Content for tab 3</ds-tabs-content>
</ds-tabs>
```

### Accordion

```tsx
// React - Single expand
<Accordion type="single" defaultValue="item-1" collapsible>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content for section 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Section 2</Accordion.Trigger>
    <Accordion.Content>Content for section 2</Accordion.Content>
  </Accordion.Item>
</Accordion>

// React - Multiple expand
<Accordion type="multiple" defaultValue={["item-1", "item-2"]}>
  {/* ... */}
</Accordion>
```

### AlertDialog

```tsx
// React
<AlertDialog>
  <AlertDialog.Trigger asChild>
    <Button variant="destructive">Delete Account</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your account.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Delete</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog>
```

### Sheet

```tsx
// React
<Sheet>
  <Sheet.Trigger asChild>
    <Button>Open Settings</Button>
  </Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Header>
      <Sheet.Title>Settings</Sheet.Title>
      <Sheet.Description>Configure your preferences.</Sheet.Description>
    </Sheet.Header>
    {/* Settings form */}
    <Sheet.Footer>
      <Sheet.Close asChild>
        <Button>Save</Button>
      </Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet>
```

### DropdownMenu

```tsx
// React
<DropdownMenu>
  <DropdownMenu.Trigger asChild>
    <Button>Options</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Label>Actions</DropdownMenu.Label>
    <DropdownMenu.Item onSelect={() => console.log("Edit")}>
      Edit
    </DropdownMenu.Item>
    <DropdownMenu.Item onSelect={() => console.log("Duplicate")}>
      Duplicate
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
      <DropdownMenu.SubContent>
        <DropdownMenu.Item>Archive</DropdownMenu.Item>
        <DropdownMenu.Item>Move to folder</DropdownMenu.Item>
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
    <DropdownMenu.Separator />
    <DropdownMenu.Item variant="destructive">Delete</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>
```

### Command Palette

```tsx
// React
<Command>
  <Command.Input placeholder="Search commands..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Suggestions">
      <Command.Item onSelect={() => navigate("/dashboard")}>
        Dashboard
      </Command.Item>
      <Command.Item onSelect={() => navigate("/settings")}>
        Settings
      </Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="Actions">
      <Command.Item onSelect={() => createNew()}>
        Create new...
      </Command.Item>
    </Command.Group>
  </Command.List>
</Command>
```

### Breadcrumb

```tsx
// React
<Breadcrumb>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/products">Products</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Page>Widget</Breadcrumb.Page>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb>
```

### Pagination

```tsx
// React
<Pagination totalPages={10} defaultPage={1} onPageChange={setPage}>
  <Pagination.Content>
    <Pagination.Item>
      <Pagination.Previous />
    </Pagination.Item>
    {/* Pages rendered automatically based on siblingCount/boundaryCount */}
    <Pagination.Item>
      <Pagination.Next />
    </Pagination.Item>
  </Pagination.Content>
</Pagination>
```

## Keyboard Navigation

| Component | Keys | Action |
|-----------|------|--------|
| Tabs | Arrow Left/Right | Navigate triggers |
| Tabs | Enter/Space | Select tab (manual mode) |
| Accordion | Arrow Up/Down | Navigate triggers |
| Accordion | Enter/Space | Toggle item |
| AlertDialog | Escape | Close dialog |
| AlertDialog | Tab | Move focus within dialog |
| Menu | Arrow Up/Down | Navigate items |
| Menu | Arrow Right | Open submenu |
| Menu | Arrow Left | Close submenu |
| Menu | Escape | Close menu |
| Menu | A-Z | Typeahead navigation |
| Command | Arrow Up/Down | Navigate items |
| Command | Enter | Select item |
| Command | Escape | Close palette |

## Customization

### Z-Index Configuration

```css
:root {
  /* Adjust base overlay z-index */
  --ds-z-overlay: 1000;
}
```

### Animation Duration

```css
:root {
  /* Adjust animation speeds */
  --ds-duration-fast: 150ms;
  --ds-duration-normal: 200ms;
  --ds-duration-slow: 300ms;
}

/* Disable animations for reduced motion */
@media (prefers-reduced-motion: reduce) {
  :root {
    --ds-duration-fast: 0ms;
    --ds-duration-normal: 0ms;
    --ds-duration-slow: 0ms;
  }
}
```

### Component-Specific Tokens

```css
:root {
  /* Card */
  --ds-card-border-radius: var(--ds-radius-lg);
  --ds-card-padding: var(--ds-spacing-4);

  /* Sheet */
  --ds-sheet-width: 400px;
  --ds-sheet-backdrop-color: rgba(0, 0, 0, 0.5);

  /* Menu */
  --ds-menu-min-width: 160px;
  --ds-menu-item-height: 32px;
}
```

## Next Steps

- See full API documentation in component docs
- Review accessibility guidelines per component
- Explore advanced patterns in recipes section
