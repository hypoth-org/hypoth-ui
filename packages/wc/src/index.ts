// Base class
export { DSElement, LightElement } from "./base/ds-element.js";

// Event utilities
export { emitEvent, StandardEvents } from "./events/emit.js";
export type { EmitEventOptions, StandardEventName } from "./events/emit.js";

// Registry utilities
export { define, isDefined, whenDefined } from "./registry/define.js";
export {
  getRegisteredTags,
  getComponentClass,
  getComponentClassSync,
  registerComponent,
  hasComponent,
  loadAllComponents,
} from "./registry/registry.js";
export type {
  CustomElementConstructor,
  ComponentRegistryType,
  ComponentTag,
} from "./registry/registry.js";

// Components
export { DsButton } from "./components/button/button.js";
export type { ButtonVariant, ButtonSize } from "./components/button/button.js";
export { DsInput } from "./components/input/input.js";
export type { InputType, InputSize } from "./components/input/input.js";
export { DsLink } from "./components/link/link.js";
export type { LinkVariant, DsNavigateEventDetail } from "./components/link/link.js";
export { DsText } from "./components/text/text.js";
export type { TextSize, TextWeight, TextVariant, TextAs } from "./components/text/text.js";
export { DsIcon } from "./components/icon/icon.js";
export type { IconSize } from "./components/icon/icon.js";
export { DsSpinner } from "./components/spinner/spinner.js";
export type { SpinnerSize } from "./components/spinner/spinner.js";
export { DsVisuallyHidden } from "./components/visually-hidden/visually-hidden.js";

// Field pattern components
export { DsField } from "./components/field/field.js";
export { DsLabel } from "./components/field/label.js";
export { DsFieldDescription } from "./components/field/field-description.js";
export { DsFieldError } from "./components/field/field-error.js";

// Dialog components
export { DsDialog } from "./components/dialog/dialog.js";
export type { DialogRole } from "./components/dialog/dialog.js";
export { DsDialogContent } from "./components/dialog/dialog-content.js";
export type { DialogContentSize } from "./components/dialog/dialog-content.js";
export { DsDialogTitle } from "./components/dialog/dialog-title.js";
export { DsDialogDescription } from "./components/dialog/dialog-description.js";

// Textarea component
export { DsTextarea } from "./components/textarea/textarea.js";
export type { TextareaSize } from "./components/textarea/textarea.js";

// Checkbox component
export { DsCheckbox } from "./components/checkbox/checkbox.js";

// Radio components
export { DsRadioGroup } from "./components/radio/radio-group.js";
export type { RadioOrientation } from "./components/radio/radio-group.js";
export { DsRadio } from "./components/radio/radio.js";

// Switch component
export { DsSwitch } from "./components/switch/switch.js";

// Popover components
export { DsPopover } from "./components/popover/popover.js";
export { DsPopoverContent } from "./components/popover/popover-content.js";

// Tooltip components
export { DsTooltip } from "./components/tooltip/tooltip.js";
export { DsTooltipContent } from "./components/tooltip/tooltip-content.js";

// Menu components
export { DsMenu } from "./components/menu/menu.js";
export { DsMenuContent } from "./components/menu/menu-content.js";
export { DsMenuItem } from "./components/menu/menu-item.js";

// Select components
export { DsSelect } from "./components/select/select.js";
export { DsSelectTrigger } from "./components/select/select-trigger.js";
export { DsSelectContent } from "./components/select/select-content.js";
export type { SelectContentState } from "./components/select/select-content.js";
export { DsSelectOption } from "./components/select/select-option.js";

// Combobox components
export { DsCombobox } from "./components/combobox/combobox.js";
export { DsComboboxInput } from "./components/combobox/combobox-input.js";
export { DsComboboxContent } from "./components/combobox/combobox-content.js";
export type { ComboboxContentState } from "./components/combobox/combobox-content.js";
export { DsComboboxOption } from "./components/combobox/combobox-option.js";
export { DsComboboxTag } from "./components/combobox/combobox-tag.js";

// DatePicker components
export { DsDatePicker } from "./components/date-picker/date-picker.js";
export type { DatePickerMode } from "./components/date-picker/date-picker.js";
export { DsDatePickerCalendar } from "./components/date-picker/date-picker-calendar.js";
export type { CalendarState } from "./components/date-picker/date-picker-calendar.js";

// Slider component
export { DsSlider } from "./components/slider/slider.js";

// NumberInput component
export { DsNumberInput } from "./components/number-input/number-input.js";
export type { NumberInputFormat } from "./components/number-input/number-input.js";

// FileUpload component
export { DsFileUpload } from "./components/file-upload/file-upload.js";

// TimePicker component
export { DsTimePicker } from "./components/time-picker/time-picker.js";

// PinInput component
export { DsPinInput } from "./components/pin-input/pin-input.js";

// Card components
export { DsCard } from "./components/card/card.js";
export { DsCardHeader } from "./components/card/card-header.js";
export { DsCardContent } from "./components/card/card-content.js";
export { DsCardFooter } from "./components/card/card-footer.js";

// Separator component
export { DsSeparator } from "./components/separator/separator.js";
export type { SeparatorOrientation } from "./components/separator/separator.js";

// AspectRatio component
export { DsAspectRatio } from "./components/aspect-ratio/aspect-ratio.js";

// Collapsible components
export { DsCollapsible } from "./components/collapsible/collapsible.js";
export { DsCollapsibleTrigger } from "./components/collapsible/collapsible-trigger.js";
export { DsCollapsibleContent } from "./components/collapsible/collapsible-content.js";

// Tabs components
export { DsTabs, type TabsOrientation, type TabsActivationMode } from "./components/tabs/tabs.js";
export { DsTabsList } from "./components/tabs/tabs-list.js";
export { DsTabsTrigger } from "./components/tabs/tabs-trigger.js";
export { DsTabsContent } from "./components/tabs/tabs-content.js";

// Accordion components
export {
  DsAccordion,
  type AccordionType,
  type AccordionOrientation,
} from "./components/accordion/accordion.js";
export { DsAccordionItem } from "./components/accordion/accordion-item.js";
export { DsAccordionTrigger } from "./components/accordion/accordion-trigger.js";
export { DsAccordionContent } from "./components/accordion/accordion-content.js";

// AlertDialog components
export { DsAlertDialog } from "./components/alert-dialog/alert-dialog.js";
export { DsAlertDialogTrigger } from "./components/alert-dialog/alert-dialog-trigger.js";
export {
  DsAlertDialogContent,
  type AlertDialogContentSize,
} from "./components/alert-dialog/alert-dialog-content.js";
export { DsAlertDialogHeader } from "./components/alert-dialog/alert-dialog-header.js";
export { DsAlertDialogFooter } from "./components/alert-dialog/alert-dialog-footer.js";
export { DsAlertDialogTitle } from "./components/alert-dialog/alert-dialog-title.js";
export { DsAlertDialogDescription } from "./components/alert-dialog/alert-dialog-description.js";
export { DsAlertDialogAction } from "./components/alert-dialog/alert-dialog-action.js";
export { DsAlertDialogCancel } from "./components/alert-dialog/alert-dialog-cancel.js";

// Sheet components
export { DsSheet } from "./components/sheet/sheet.js";
export {
  DsSheetContent,
  type SheetSide,
  type SheetContentSize,
} from "./components/sheet/sheet-content.js";
export { DsSheetOverlay } from "./components/sheet/sheet-overlay.js";
export { DsSheetHeader } from "./components/sheet/sheet-header.js";
export { DsSheetFooter } from "./components/sheet/sheet-footer.js";
export { DsSheetTitle } from "./components/sheet/sheet-title.js";
export { DsSheetDescription } from "./components/sheet/sheet-description.js";
export { DsSheetClose } from "./components/sheet/sheet-close.js";

// Drawer components
export { DsDrawer, type DrawerSide } from "./components/drawer/drawer.js";
export { DsDrawerContent } from "./components/drawer/drawer-content.js";
export { DsDrawerHeader } from "./components/drawer/drawer-header.js";
export { DsDrawerFooter } from "./components/drawer/drawer-footer.js";
export { DsDrawerTitle } from "./components/drawer/drawer-title.js";
export { DsDrawerDescription } from "./components/drawer/drawer-description.js";

// DropdownMenu components
export { DsDropdownMenu } from "./components/dropdown-menu/dropdown-menu.js";
export { DsDropdownMenuContent } from "./components/dropdown-menu/dropdown-menu-content.js";
export {
  DsDropdownMenuItem,
  type DropdownMenuItemVariant,
} from "./components/dropdown-menu/dropdown-menu-item.js";
export { DsDropdownMenuSeparator } from "./components/dropdown-menu/dropdown-menu-separator.js";
export { DsDropdownMenuLabel } from "./components/dropdown-menu/dropdown-menu-label.js";
export { DsDropdownMenuCheckboxItem } from "./components/dropdown-menu/dropdown-menu-checkbox-item.js";
export { DsDropdownMenuRadioGroup } from "./components/dropdown-menu/dropdown-menu-radio-group.js";
export { DsDropdownMenuRadioItem } from "./components/dropdown-menu/dropdown-menu-radio-item.js";

// ContextMenu components
export { DsContextMenu } from "./components/context-menu/context-menu.js";
export { DsContextMenuContent } from "./components/context-menu/context-menu-content.js";
export {
  DsContextMenuItem,
  type ContextMenuItemVariant,
} from "./components/context-menu/context-menu-item.js";
export { DsContextMenuSeparator } from "./components/context-menu/context-menu-separator.js";
export { DsContextMenuLabel } from "./components/context-menu/context-menu-label.js";

// HoverCard components
export { DsHoverCard } from "./components/hover-card/hover-card.js";
export {
  DsHoverCardContent,
  type HoverCardContentState,
} from "./components/hover-card/hover-card-content.js";

// NavigationMenu components
export { DsNavigationMenu } from "./components/navigation-menu/navigation-menu.js";
export { DsNavigationMenuList } from "./components/navigation-menu/navigation-menu-list.js";
export { DsNavigationMenuItem } from "./components/navigation-menu/navigation-menu-item.js";
export { DsNavigationMenuTrigger } from "./components/navigation-menu/navigation-menu-trigger.js";
export { DsNavigationMenuContent } from "./components/navigation-menu/navigation-menu-content.js";
export { DsNavigationMenuLink } from "./components/navigation-menu/navigation-menu-link.js";
export { DsNavigationMenuIndicator } from "./components/navigation-menu/navigation-menu-indicator.js";
export { DsNavigationMenuViewport } from "./components/navigation-menu/navigation-menu-viewport.js";

// ScrollArea components
export { DsScrollArea, type ScrollAreaType } from "./components/scroll-area/scroll-area.js";
export { DsScrollAreaViewport } from "./components/scroll-area/scroll-area-viewport.js";
export { DsScrollAreaScrollbar } from "./components/scroll-area/scroll-area-scrollbar.js";
export { DsScrollAreaThumb } from "./components/scroll-area/scroll-area-thumb.js";

// Breadcrumb components
export { DsBreadcrumb } from "./components/breadcrumb/breadcrumb.js";
export { DsBreadcrumbList } from "./components/breadcrumb/breadcrumb-list.js";
export { DsBreadcrumbItem } from "./components/breadcrumb/breadcrumb-item.js";
export { DsBreadcrumbLink } from "./components/breadcrumb/breadcrumb-link.js";
export { DsBreadcrumbPage } from "./components/breadcrumb/breadcrumb-page.js";
export { DsBreadcrumbSeparator } from "./components/breadcrumb/breadcrumb-separator.js";

// Pagination components
export { DsPagination } from "./components/pagination/pagination.js";
export { DsPaginationContent } from "./components/pagination/pagination-content.js";
export { DsPaginationItem } from "./components/pagination/pagination-item.js";
export { DsPaginationLink } from "./components/pagination/pagination-link.js";
export { DsPaginationPrevious } from "./components/pagination/pagination-previous.js";
export { DsPaginationNext } from "./components/pagination/pagination-next.js";
export { DsPaginationEllipsis } from "./components/pagination/pagination-ellipsis.js";

// Stepper components
export { DsStepper, type StepperOrientation } from "./components/stepper/stepper.js";
export { DsStepperItem } from "./components/stepper/stepper-item.js";
export { DsStepperTrigger } from "./components/stepper/stepper-trigger.js";
export { DsStepperIndicator } from "./components/stepper/stepper-indicator.js";
export { DsStepperTitle } from "./components/stepper/stepper-title.js";
export { DsStepperDescription } from "./components/stepper/stepper-description.js";
export { DsStepperSeparator } from "./components/stepper/stepper-separator.js";
export { DsStepperContent } from "./components/stepper/stepper-content.js";

// Command components
export { DsCommand } from "./components/command/command.js";
export { DsCommandInput } from "./components/command/command-input.js";
export { DsCommandList } from "./components/command/command-list.js";
export { DsCommandItem } from "./components/command/command-item.js";
export { DsCommandGroup } from "./components/command/command-group.js";
export { DsCommandSeparator } from "./components/command/command-separator.js";
export { DsCommandEmpty } from "./components/command/command-empty.js";
export { DsCommandLoading } from "./components/command/command-loading.js";

// Alert component
export { DsAlert, type AlertVariant } from "./components/alert/index.js";

// Toast components
export { DsToast } from "./components/toast/toast.js";
export { DsToastProvider } from "./components/toast/toast-provider.js";
export {
  ToastController,
  dsToast,
  getGlobalToastController,
  setGlobalToastController,
  type ToastOptions,
  type ToastData,
  type ToastVariant,
  type ToastPosition,
  type ToastState,
  type ToastAction,
  type ToastControllerOptions,
} from "./components/toast/index.js";

// Progress component
export {
  DsProgress,
  type ProgressVariant,
  type ProgressSize,
} from "./components/progress/index.js";

// Avatar components
export {
  DsAvatar,
  DsAvatarGroup,
  type AvatarSize,
  type AvatarShape,
  type AvatarStatus,
} from "./components/avatar/index.js";

// Table components
export {
  DsTable,
  DsTableHeader,
  DsTableBody,
  DsTableRow,
  DsTableHead,
  DsTableCell,
  type TableSize,
  type TableAlign,
  type SortDirection,
} from "./components/table/index.js";

// Skeleton component
export {
  DsSkeleton,
  type SkeletonVariant,
  type SkeletonSize,
  type SkeletonWidth,
  type SkeletonAnimation,
} from "./components/skeleton/index.js";

// Badge component
export {
  DsBadge,
  type BadgeVariant,
  type BadgeSize,
  type BadgePosition,
} from "./components/badge/index.js";

// Tag component
export { DsTag, type TagVariant, type TagSize } from "./components/tag/index.js";

// Tree components
export {
  DsTree,
  DsTreeItem,
  type TreeSelectionMode,
  type TreeSize,
} from "./components/tree/index.js";

// List components
export {
  DsList,
  DsListItem,
  type ListSelectionMode,
  type ListOrientation,
  type ListSize,
} from "./components/list/index.js";

// Calendar component
export { DsCalendar, type CalendarSize } from "./components/calendar/index.js";

// DataTable component
export {
  DsDataTable,
  type DataTableColumn,
  type DataTableSort,
  type DataTablePagination,
  type DataTableSortDirection,
} from "./components/data-table/index.js";

// Layout primitives
export {
  DsFlow,
  DsContainer,
  DsGrid,
  DsBox,
  DsPage,
  DsSection,
  DsAppShell,
  DsHeader,
  DsFooter,
  DsMain,
  DsSpacer,
  DsCenter,
  DsSplit,
  DsWrap,
} from "./components/layout/index.js";
export type {
  SpacingToken,
  BreakpointToken,
  ContainerSizeToken,
  SurfaceToken,
  RadiusToken,
  FlexDirection,
  FlexAlign,
  FlexJustify,
  FlexWrap,
  GridColumns,
  SplitRatio,
  SpacerAxis,
} from "./components/layout/index.js";
