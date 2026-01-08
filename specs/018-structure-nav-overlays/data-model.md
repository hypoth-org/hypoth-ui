# Data Model: Structure, Navigation & Overlays

**Phase 1 Output** | **Date**: 2026-01-07

## Overview

This document defines the component APIs, state models, and relationships for all 18 components. Since these are UI components (not data persistence), the "data model" focuses on props, state, and events.

## Component State Models

### Tabs

```typescript
interface TabsState {
  value: string;           // Currently selected tab value
  orientation: "horizontal" | "vertical";
  activationMode: "automatic" | "manual";
}

// Events
type TabsChangeEvent = CustomEvent<{ value: string }>;
```

**State Transitions**:
- `idle` → `focused` (on Tab focus)
- `focused` → `selected` (on Enter/Space in manual mode, or automatic on focus)
- `selected` → `focused` (on another tab focus)

### Accordion

```typescript
interface AccordionState {
  value: string | string[];  // Expanded item(s)
  type: "single" | "multiple";
  collapsible: boolean;      // Can collapse all in single mode
  orientation: "horizontal" | "vertical";
}

// Events
type AccordionChangeEvent = CustomEvent<{ value: string | string[] }>;
```

**State Transitions**:
- `collapsed` → `expanding` (animation start)
- `expanding` → `expanded` (animation end)
- `expanded` → `collapsing` (animation start)
- `collapsing` → `collapsed` (animation end)

### AlertDialog

```typescript
interface AlertDialogState {
  open: boolean;
}

// Events
type AlertDialogOpenChangeEvent = CustomEvent<{ open: boolean }>;
```

**State Transitions**:
- `closed` → `opening` (trigger click)
- `opening` → `open` (animation end, focus trap active)
- `open` → `closing` (cancel/confirm/escape)
- `closing` → `closed` (animation end, focus returned)

### Sheet

```typescript
interface SheetState {
  open: boolean;
  side: "left" | "right" | "top" | "bottom";
}

// Events
type SheetOpenChangeEvent = CustomEvent<{ open: boolean }>;
```

**State Transitions**: Same as AlertDialog

### Drawer

```typescript
interface DrawerState extends SheetState {
  snapPoints?: number[];     // Optional snap positions (0-1)
  activeSnapPoint?: number;
}

// Events
type DrawerOpenChangeEvent = CustomEvent<{ open: boolean }>;
type DrawerSnapEvent = CustomEvent<{ snapPoint: number }>;
```

### DropdownMenu / ContextMenu

```typescript
interface MenuState {
  open: boolean;
  highlightedValue: string | null;
}

// Events
type MenuOpenChangeEvent = CustomEvent<{ open: boolean }>;
type MenuSelectEvent = CustomEvent<{ value: string }>;
```

**State Transitions**:
- `closed` → `open` (trigger click / right-click)
- `open.idle` → `open.highlighted` (arrow key / mouse move)
- `open.highlighted` → `open.submenu` (arrow right on item with submenu)
- `open` → `closed` (escape / outside click / selection)

### HoverCard

```typescript
interface HoverCardState {
  open: boolean;
}

// Events
type HoverCardOpenChangeEvent = CustomEvent<{ open: boolean }>;
```

**State Transitions**:
- `closed` → `opening` (hover delay elapsed)
- `opening` → `open` (animation end)
- `open` → `closing` (pointer leave delay)
- `closing` → `closed` (animation end)

### NavigationMenu

```typescript
interface NavigationMenuState {
  value: string;  // Currently open menu item
}

// Events
type NavigationMenuChangeEvent = CustomEvent<{ value: string }>;
```

### Collapsible

```typescript
interface CollapsibleState {
  open: boolean;
}

// Events
type CollapsibleOpenChangeEvent = CustomEvent<{ open: boolean }>;
```

### ScrollArea

```typescript
interface ScrollAreaState {
  scrollTop: number;
  scrollLeft: number;
  showVerticalScrollbar: boolean;
  showHorizontalScrollbar: boolean;
}

// No custom events - uses native scroll events
```

### Pagination

```typescript
interface PaginationState {
  page: number;
  totalPages: number;
  siblingCount: number;   // Pages shown around current
  boundaryCount: number;  // Pages shown at start/end
}

// Events
type PaginationChangeEvent = CustomEvent<{ page: number }>;
```

### Stepper

```typescript
interface StepperState {
  value: number;           // Current step index
  orientation: "horizontal" | "vertical";
}

// Events
type StepperChangeEvent = CustomEvent<{ value: number }>;
```

### Command

```typescript
interface CommandState {
  inputValue: string;
  highlightedValue: string | null;
  loading: boolean;
}

// Events
type CommandInputEvent = CustomEvent<{ value: string }>;
type CommandSelectEvent = CustomEvent<{ value: string }>;
```

## Component Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                     Overlay Stack                           │
│  (manages z-index, focus return, dismissal order)           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  AlertDialog ─┬─► DismissableLayer                          │
│               ├─► FocusTrap                                 │
│               └─► Presence (exit animation)                 │
│                                                             │
│  Sheet ───────┬─► DismissableLayer                          │
│               ├─► FocusTrap                                 │
│               ├─► Presence                                  │
│               └─► AnchorPosition (edge positioning)         │
│                                                             │
│  Drawer ──────┴─► Sheet (composition)                       │
│               └─► SwipeGesture (mobile)                     │
│                                                             │
│  DropdownMenu ─► MenuBehavior ─┬─► RovingFocus              │
│                                ├─► TypeAhead                │
│                                ├─► DismissableLayer         │
│                                └─► AnchorPosition           │
│                                                             │
│  ContextMenu ──► MenuBehavior (same as Dropdown)            │
│                                                             │
│  HoverCard ───┬─► DismissableLayer                          │
│               └─► AnchorPosition                            │
│                                                             │
│  NavigationMenu ─┬─► RovingFocus                            │
│                  └─► DismissableLayer                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   Structure Components                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Tabs ────────┬─► RovingFocus (TabsList)                    │
│               └─► TabsContent (conditional render)          │
│                                                             │
│  Accordion ───┬─► RovingFocus (trigger navigation)          │
│               └─► Collapsible (per item)                    │
│                                                             │
│  Collapsible ─► Presence (animated height)                  │
│                                                             │
│  Command ─────┬─► RovingFocus (list navigation)             │
│               └─► TypeAhead (filtering)                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   Pure Structure (no primitives)            │
├─────────────────────────────────────────────────────────────┤
│  Card, Separator, AspectRatio, Breadcrumb, Pagination,      │
│  Stepper, ScrollArea                                        │
└─────────────────────────────────────────────────────────────┘
```

## Compound Component Structure

### Pattern: Root/Trigger/Content

Most components follow this structure:

```typescript
// Web Component
<ds-{component}>           // Root - manages state
  <ds-{component}-trigger> // Trigger - activates overlay/change
  <ds-{component}-content> // Content - displays payload
</ds-{component}>

// React
<{Component}>
  <{Component}.Trigger />
  <{Component}.Content />
</{Component}>
```

### Component Sub-elements

| Component | Sub-elements |
|-----------|--------------|
| Card | CardHeader, CardContent, CardFooter |
| Tabs | TabsList, TabsTrigger, TabsContent |
| Accordion | AccordionItem, AccordionTrigger, AccordionContent |
| AlertDialog | AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel |
| Sheet | SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetClose |
| Drawer | DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose |
| DropdownMenu | DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent |
| ContextMenu | ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuLabel, ContextMenuCheckboxItem, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent |
| HoverCard | HoverCardTrigger, HoverCardContent |
| NavigationMenu | NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport |
| Collapsible | CollapsibleTrigger, CollapsibleContent |
| ScrollArea | ScrollAreaViewport, ScrollAreaScrollbar, ScrollAreaThumb |
| Breadcrumb | BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator |
| Pagination | PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis |
| Stepper | StepperItem, StepperTrigger, StepperIndicator, StepperTitle, StepperDescription, StepperSeparator, StepperContent |
| Command | CommandInput, CommandList, CommandEmpty, CommandLoading, CommandGroup, CommandItem, CommandSeparator |

## ARIA Mapping

| Component | Role | Key ARIA Attributes |
|-----------|------|---------------------|
| TabsList | tablist | aria-orientation |
| TabsTrigger | tab | aria-selected, aria-controls |
| TabsContent | tabpanel | aria-labelledby |
| AccordionTrigger | button | aria-expanded, aria-controls |
| AccordionContent | region | aria-labelledby |
| AlertDialogContent | alertdialog | aria-modal, aria-labelledby, aria-describedby |
| SheetContent | dialog | aria-modal, aria-labelledby, aria-describedby |
| DropdownMenuContent | menu | - |
| DropdownMenuItem | menuitem | aria-disabled |
| DropdownMenuCheckboxItem | menuitemcheckbox | aria-checked |
| DropdownMenuRadioItem | menuitemradio | aria-checked |
| HoverCardContent | - | (non-modal, no specific role) |
| NavigationMenuContent | - | aria-hidden when closed |
| Separator | separator | aria-orientation |
| Breadcrumb | navigation | aria-label="Breadcrumb" |
| BreadcrumbPage | - | aria-current="page" |
| CommandList | listbox | aria-label |
| CommandItem | option | aria-selected, aria-disabled |
