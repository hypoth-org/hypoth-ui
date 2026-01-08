# @ds/wc

Lit-based Web Components with Light DOM rendering for the hypoth-ui design system.

## Installation

```bash
pnpm add @ds/wc
```

### Peer Dependencies

```bash
pnpm add @ds/css @ds/tokens
```

## Usage

```typescript
import { DsButton, DsDialog, DsInput } from "@ds/wc";
```

Or import individual components:

```typescript
import { DsButton } from "@ds/wc/components/button/button.js";
```

### Register Components

Components auto-register when imported. You can also manually register:

```typescript
import { define, DsButton } from "@ds/wc";

define("ds-button", DsButton);
```

## Components

### Core

| Component | Element | Description |
|-----------|---------|-------------|
| `DsButton` | `<ds-button>` | Interactive button with variants and sizes |
| `DsInput` | `<ds-input>` | Text input field |
| `DsTextarea` | `<ds-textarea>` | Multi-line text input |
| `DsLink` | `<ds-link>` | Styled anchor link |
| `DsText` | `<ds-text>` | Typography component |
| `DsIcon` | `<ds-icon>` | Icon display |
| `DsSpinner` | `<ds-spinner>` | Loading spinner |
| `DsVisuallyHidden` | `<ds-visually-hidden>` | Screen reader only content |

### Form Controls

| Component | Element | Description |
|-----------|---------|-------------|
| `DsField` | `<ds-field>` | Form field wrapper |
| `DsLabel` | `<ds-label>` | Form label |
| `DsFieldDescription` | `<ds-field-description>` | Field help text |
| `DsFieldError` | `<ds-field-error>` | Field error message |
| `DsCheckbox` | `<ds-checkbox>` | Checkbox input |
| `DsRadioGroup` | `<ds-radio-group>` | Radio button group container |
| `DsRadio` | `<ds-radio>` | Radio button |
| `DsSwitch` | `<ds-switch>` | Toggle switch |
| `DsSlider` | `<ds-slider>` | Range slider |
| `DsNumberInput` | `<ds-number-input>` | Numeric input with formatting |
| `DsFileUpload` | `<ds-file-upload>` | File upload control |
| `DsPinInput` | `<ds-pin-input>` | PIN/OTP input |

### Selection Controls

| Component | Element | Description |
|-----------|---------|-------------|
| `DsSelect` | `<ds-select>` | Single select dropdown |
| `DsSelectTrigger` | `<ds-select-trigger>` | Select trigger button |
| `DsSelectContent` | `<ds-select-content>` | Select dropdown content |
| `DsSelectOption` | `<ds-select-option>` | Select option |
| `DsCombobox` | `<ds-combobox>` | Searchable combobox |
| `DsComboboxInput` | `<ds-combobox-input>` | Combobox search input |
| `DsComboboxContent` | `<ds-combobox-content>` | Combobox dropdown |
| `DsComboboxOption` | `<ds-combobox-option>` | Combobox option |
| `DsComboboxTag` | `<ds-combobox-tag>` | Multi-select tag |

### Date & Time

| Component | Element | Description |
|-----------|---------|-------------|
| `DsDatePicker` | `<ds-date-picker>` | Date picker with calendar |
| `DsDatePickerCalendar` | `<ds-date-picker-calendar>` | Calendar widget |
| `DsTimePicker` | `<ds-time-picker>` | Time input picker |

### Dialogs & Overlays

| Component | Element | Description |
|-----------|---------|-------------|
| `DsDialog` | `<ds-dialog>` | Modal dialog |
| `DsDialogContent` | `<ds-dialog-content>` | Dialog content wrapper |
| `DsDialogTitle` | `<ds-dialog-title>` | Dialog title |
| `DsDialogDescription` | `<ds-dialog-description>` | Dialog description |
| `DsAlertDialog` | `<ds-alert-dialog>` | Confirmation dialog |
| `DsAlertDialogTrigger` | `<ds-alert-dialog-trigger>` | Alert dialog trigger |
| `DsAlertDialogContent` | `<ds-alert-dialog-content>` | Alert dialog content |
| `DsAlertDialogHeader` | `<ds-alert-dialog-header>` | Alert dialog header |
| `DsAlertDialogFooter` | `<ds-alert-dialog-footer>` | Alert dialog footer |
| `DsAlertDialogTitle` | `<ds-alert-dialog-title>` | Alert dialog title |
| `DsAlertDialogDescription` | `<ds-alert-dialog-description>` | Alert dialog description |
| `DsAlertDialogAction` | `<ds-alert-dialog-action>` | Primary action button |
| `DsAlertDialogCancel` | `<ds-alert-dialog-cancel>` | Cancel button |
| `DsSheet` | `<ds-sheet>` | Side panel overlay |
| `DsSheetContent` | `<ds-sheet-content>` | Sheet content |
| `DsSheetOverlay` | `<ds-sheet-overlay>` | Sheet backdrop |
| `DsSheetHeader` | `<ds-sheet-header>` | Sheet header |
| `DsSheetFooter` | `<ds-sheet-footer>` | Sheet footer |
| `DsSheetTitle` | `<ds-sheet-title>` | Sheet title |
| `DsSheetDescription` | `<ds-sheet-description>` | Sheet description |
| `DsSheetClose` | `<ds-sheet-close>` | Sheet close button |
| `DsDrawer` | `<ds-drawer>` | Mobile-friendly drawer |
| `DsDrawerContent` | `<ds-drawer-content>` | Drawer content |
| `DsDrawerHeader` | `<ds-drawer-header>` | Drawer header |
| `DsDrawerFooter` | `<ds-drawer-footer>` | Drawer footer |
| `DsDrawerTitle` | `<ds-drawer-title>` | Drawer title |
| `DsDrawerDescription` | `<ds-drawer-description>` | Drawer description |
| `DsPopover` | `<ds-popover>` | Floating popover |
| `DsPopoverContent` | `<ds-popover-content>` | Popover content |
| `DsTooltip` | `<ds-tooltip>` | Information tooltip |
| `DsTooltipContent` | `<ds-tooltip-content>` | Tooltip content |
| `DsHoverCard` | `<ds-hover-card>` | Rich preview on hover |
| `DsHoverCardContent` | `<ds-hover-card-content>` | Hover card content |

### Menus

| Component | Element | Description |
|-----------|---------|-------------|
| `DsMenu` | `<ds-menu>` | Basic menu |
| `DsMenuContent` | `<ds-menu-content>` | Menu content |
| `DsMenuItem` | `<ds-menu-item>` | Menu item |
| `DsDropdownMenu` | `<ds-dropdown-menu>` | Dropdown menu |
| `DsDropdownMenuContent` | `<ds-dropdown-menu-content>` | Dropdown content |
| `DsDropdownMenuItem` | `<ds-dropdown-menu-item>` | Dropdown item |
| `DsDropdownMenuSeparator` | `<ds-dropdown-menu-separator>` | Menu separator |
| `DsDropdownMenuLabel` | `<ds-dropdown-menu-label>` | Menu section label |
| `DsDropdownMenuCheckboxItem` | `<ds-dropdown-menu-checkbox-item>` | Checkbox menu item |
| `DsDropdownMenuRadioGroup` | `<ds-dropdown-menu-radio-group>` | Radio group |
| `DsDropdownMenuRadioItem` | `<ds-dropdown-menu-radio-item>` | Radio menu item |
| `DsContextMenu` | `<ds-context-menu>` | Right-click context menu |
| `DsContextMenuContent` | `<ds-context-menu-content>` | Context menu content |
| `DsContextMenuItem` | `<ds-context-menu-item>` | Context menu item |
| `DsContextMenuSeparator` | `<ds-context-menu-separator>` | Context menu separator |
| `DsContextMenuLabel` | `<ds-context-menu-label>` | Context menu label |

### Navigation

| Component | Element | Description |
|-----------|---------|-------------|
| `DsNavigationMenu` | `<ds-navigation-menu>` | Site navigation menu |
| `DsNavigationMenuList` | `<ds-navigation-menu-list>` | Navigation list |
| `DsNavigationMenuItem` | `<ds-navigation-menu-item>` | Navigation item |
| `DsNavigationMenuTrigger` | `<ds-navigation-menu-trigger>` | Submenu trigger |
| `DsNavigationMenuContent` | `<ds-navigation-menu-content>` | Submenu content |
| `DsNavigationMenuLink` | `<ds-navigation-menu-link>` | Navigation link |
| `DsNavigationMenuIndicator` | `<ds-navigation-menu-indicator>` | Active indicator |
| `DsNavigationMenuViewport` | `<ds-navigation-menu-viewport>` | Content viewport |
| `DsBreadcrumb` | `<ds-breadcrumb>` | Breadcrumb navigation |
| `DsBreadcrumbList` | `<ds-breadcrumb-list>` | Breadcrumb list |
| `DsBreadcrumbItem` | `<ds-breadcrumb-item>` | Breadcrumb item |
| `DsBreadcrumbLink` | `<ds-breadcrumb-link>` | Breadcrumb link |
| `DsBreadcrumbPage` | `<ds-breadcrumb-page>` | Current page indicator |
| `DsBreadcrumbSeparator` | `<ds-breadcrumb-separator>` | Breadcrumb separator |
| `DsPagination` | `<ds-pagination>` | Page navigation |
| `DsPaginationContent` | `<ds-pagination-content>` | Pagination content |
| `DsPaginationItem` | `<ds-pagination-item>` | Page item |
| `DsPaginationLink` | `<ds-pagination-link>` | Page link |
| `DsPaginationPrevious` | `<ds-pagination-previous>` | Previous page |
| `DsPaginationNext` | `<ds-pagination-next>` | Next page |
| `DsPaginationEllipsis` | `<ds-pagination-ellipsis>` | Truncation indicator |
| `DsStepper` | `<ds-stepper>` | Multi-step workflow |
| `DsStepperItem` | `<ds-stepper-item>` | Step item |
| `DsStepperTrigger` | `<ds-stepper-trigger>` | Step trigger |
| `DsStepperIndicator` | `<ds-stepper-indicator>` | Step status indicator |
| `DsStepperTitle` | `<ds-stepper-title>` | Step title |
| `DsStepperDescription` | `<ds-stepper-description>` | Step description |
| `DsStepperSeparator` | `<ds-stepper-separator>` | Step connector |
| `DsStepperContent` | `<ds-stepper-content>` | Step panel content |

### Layout & Structure

| Component | Element | Description |
|-----------|---------|-------------|
| `DsCard` | `<ds-card>` | Content card |
| `DsCardHeader` | `<ds-card-header>` | Card header |
| `DsCardContent` | `<ds-card-content>` | Card body |
| `DsCardFooter` | `<ds-card-footer>` | Card footer |
| `DsSeparator` | `<ds-separator>` | Visual divider |
| `DsAspectRatio` | `<ds-aspect-ratio>` | Fixed aspect ratio container |
| `DsCollapsible` | `<ds-collapsible>` | Expandable section |
| `DsCollapsibleTrigger` | `<ds-collapsible-trigger>` | Collapsible toggle |
| `DsCollapsibleContent` | `<ds-collapsible-content>` | Collapsible content |
| `DsTabs` | `<ds-tabs>` | Tabbed interface |
| `DsTabsList` | `<ds-tabs-list>` | Tab button list |
| `DsTabsTrigger` | `<ds-tabs-trigger>` | Tab button |
| `DsTabsContent` | `<ds-tabs-content>` | Tab panel |
| `DsAccordion` | `<ds-accordion>` | Accordion container |
| `DsAccordionItem` | `<ds-accordion-item>` | Accordion section |
| `DsAccordionTrigger` | `<ds-accordion-trigger>` | Accordion toggle |
| `DsAccordionContent` | `<ds-accordion-content>` | Accordion panel |
| `DsScrollArea` | `<ds-scroll-area>` | Custom scrollable area |
| `DsScrollAreaViewport` | `<ds-scroll-area-viewport>` | Scroll viewport |
| `DsScrollAreaScrollbar` | `<ds-scroll-area-scrollbar>` | Custom scrollbar |
| `DsScrollAreaThumb` | `<ds-scroll-area-thumb>` | Scrollbar thumb |

### Command Palette

| Component | Element | Description |
|-----------|---------|-------------|
| `DsCommand` | `<ds-command>` | Command palette root |
| `DsCommandInput` | `<ds-command-input>` | Command search input |
| `DsCommandList` | `<ds-command-list>` | Command results list |
| `DsCommandItem` | `<ds-command-item>` | Command option |
| `DsCommandGroup` | `<ds-command-group>` | Command group |
| `DsCommandSeparator` | `<ds-command-separator>` | Group separator |
| `DsCommandEmpty` | `<ds-command-empty>` | Empty state |
| `DsCommandLoading` | `<ds-command-loading>` | Loading state |

### Feedback

| Component | Element | Description |
|-----------|---------|-------------|
| `DsAlert` | `<ds-alert>` | Alert message with variants (info, success, warning, error) |
| `DsToast` | `<ds-toast>` | Toast notification |
| `DsToastProvider` | `<ds-toast-provider>` | Toast container with positioning |
| `DsProgress` | `<ds-progress>` | Progress indicator (linear/circular) |

### Data Display

| Component | Element | Description |
|-----------|---------|-------------|
| `DsAvatar` | `<ds-avatar>` | User avatar with image, initials, or fallback |
| `DsAvatarGroup` | `<ds-avatar-group>` | Stacked avatar group |
| `DsTable` | `<ds-table>` | Data table root |
| `DsTableHeader` | `<ds-table-header>` | Table header section |
| `DsTableBody` | `<ds-table-body>` | Table body section |
| `DsTableRow` | `<ds-table-row>` | Table row |
| `DsTableHead` | `<ds-table-head>` | Table header cell with sorting |
| `DsTableCell` | `<ds-table-cell>` | Table data cell |
| `DsDataTable` | `<ds-data-table>` | Advanced data table with pagination/virtualization |
| `DsSkeleton` | `<ds-skeleton>` | Loading placeholder skeleton |
| `DsBadge` | `<ds-badge>` | Status badge with variants |
| `DsTag` | `<ds-tag>` | Removable tag/chip |
| `DsTree` | `<ds-tree>` | Tree view root |
| `DsTreeItem` | `<ds-tree-item>` | Expandable tree item |
| `DsList` | `<ds-list>` | List container |
| `DsListItem` | `<ds-list-item>` | Selectable list item |
| `DsCalendar` | `<ds-calendar>` | Calendar date picker |

## Architecture

### Light DOM Rendering

All components render to Light DOM for:
- CSS cascade inheritance
- Standard DOM APIs
- CSS-in-JS compatibility
- Server-side rendering

### Base Classes

- `DSElement` - Base class with Light DOM rendering
- `LightElement` - Alias for DSElement

### Events

Components emit custom events with the `ds:` prefix:

```typescript
element.addEventListener("ds:change", (e) => {
  console.log(e.detail.value);
});
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
