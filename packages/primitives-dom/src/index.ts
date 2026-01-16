// Shared types
export type { Direction, LogicalDirection } from "./types.js";

// Constants
export { FOCUSABLE_SELECTOR, DEFAULT_TYPEAHEAD_TIMEOUT } from "./constants.js";

// Focus management
export { createFocusTrap, type FocusTrap, type FocusTrapOptions } from "./focus/focus-trap.js";

export {
  createFocusScope,
  type FocusScope,
  type FocusScopeOptions,
} from "./focus/focus-scope.js";

// Keyboard navigation
export {
  createRovingFocus,
  type RovingFocus,
  type RovingFocusOptions,
} from "./keyboard/roving-focus.js";

// Keyboard helpers
export {
  createActivationHandler,
  type ActivationOptions,
} from "./keyboard/activation.js";

export {
  createArrowKeyHandler,
  type ArrowKeyOptions,
} from "./keyboard/arrow-keys.js";

export {
  createTypeAhead,
  type TypeAhead,
  type TypeAheadOptions,
} from "./keyboard/type-ahead.js";

// Layer utilities
export {
  createDismissableLayer,
  type DismissableLayer,
  type DismissableLayerOptions,
  type DismissReason,
} from "./layer/dismissable-layer.js";

export {
  createPortal,
  renderToPortal,
  type Portal,
  type PortalOptions,
} from "./layer/portal.js";

// Overlay behavior
export {
  createOverlayBehavior,
  type OverlayBehavior,
  type OverlayBehaviorOptions,
  type OverlayBehaviorState,
  type OverlayBehaviorContext,
  type OverlayEvent,
  type OverlayTriggerProps,
  type OverlayContentProps,
} from "./overlay/create-overlay-behavior.js";

// ARIA utilities
export {
  announce,
  clearAnnouncements,
  type LivePoliteness,
  type LiveRegionOptions,
} from "./aria/live-region.js";

export {
  connectAriaDescribedBy,
  connectSingleDescriber,
  addAriaDescriber,
} from "./aria/describedby.js";

// Positioning utilities
export {
  createAnchorPosition,
  type AnchorPosition,
  type AnchorPositionOptions,
  type ComputedPosition,
  type Placement,
} from "./positioning/anchor-position.js";

// Behavior primitives
export {
  createButtonBehavior,
  type ButtonBehavior,
  type ButtonBehaviorOptions,
  type ButtonBehaviorState,
  type ButtonAriaProps,
} from "./behavior/button.js";

export {
  createDialogBehavior,
  type DialogBehavior,
  type DialogBehaviorOptions,
  type DialogBehaviorState,
  type DialogBehaviorContext,
  type DialogRole,
  type DialogEvent,
  type DialogTriggerProps,
  type DialogContentProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
} from "./behavior/dialog.js";

export {
  createMenuBehavior,
  type MenuBehavior,
  type MenuBehaviorOptions,
  type MenuBehaviorState,
  type MenuBehaviorContext,
  type MenuEvent,
  type MenuTriggerProps,
  type MenuContentProps,
  type MenuItemProps,
} from "./behavior/menu.js";

export {
  createSelectBehavior,
  type SelectBehavior,
  type SelectBehaviorOptions,
  type SelectBehaviorState,
  type SelectTriggerProps,
  type SelectContentProps,
  type SelectOptionProps,
} from "./behavior/select.js";

export {
  createComboboxBehavior,
  type ComboboxBehavior,
  type ComboboxBehaviorOptions,
  type ComboboxBehaviorState,
  type ComboboxInputProps,
  type ComboboxListboxProps,
  type ComboboxOptionProps,
  type ComboboxTagProps,
  type Option,
} from "./behavior/combobox.js";

export {
  createSliderBehavior,
  type SliderBehavior,
  type SliderBehaviorOptions,
  type SliderBehaviorState,
  type SliderThumbProps,
  type SliderTrackProps,
  type ThumbType,
} from "./behavior/slider.js";

export {
  createPinInputBehavior,
  type PinInputBehavior,
  type PinInputBehaviorOptions,
  type PinInputBehaviorState,
  type PinInputContainerProps,
  type PinInputFieldProps,
} from "./behavior/pin-input.js";

export {
  createDatePickerBehavior,
  type DatePickerBehavior,
  type DatePickerBehaviorOptions,
  type DatePickerBehaviorState,
  type DatePickerMode,
  type DateRange,
  type CalendarGridProps,
  type CalendarCellProps,
} from "./behavior/date-picker.js";

export {
  createNumberInputBehavior,
  type NumberInputBehavior,
  type NumberInputBehaviorOptions,
  type NumberInputBehaviorState,
  type NumberInputProps,
} from "./behavior/number-input.js";

export {
  createFileUploadBehavior,
  formatBytes,
  type FileUploadBehavior,
  type FileUploadBehaviorOptions,
  type FileUploadBehaviorState,
  type FileInfo,
  type FileUploadError,
  type FileUploadDropzoneProps,
  type FileUploadInputProps,
} from "./behavior/file-upload.js";

export {
  createTimePickerBehavior,
  type TimePickerBehavior,
  type TimePickerBehaviorOptions,
  type TimePickerBehaviorState,
  type TimeValue,
  type TimeSegment,
  type TimeSegmentProps,
} from "./behavior/time-picker.js";

// Virtualization
export {
  createVirtualizedList,
  type VirtualizedList,
  type VirtualizedListOptions,
} from "./keyboard/virtualized-list.js";

// Animation utilities
export {
  createPresence,
  prefersReducedMotion,
  onMotionPreferenceChange,
  type AnimationState,
  type Presence,
  type PresenceOptions,
} from "./animation/index.js";

// SSR utilities
export {
  isBrowser,
  isServer,
  isDocumentReady,
  onDocumentReady,
  clientOnly,
  clientValue,
  createClientOnly,
  useClientOnly,
  type ClientOnlyOptions,
  type ClientOnlyController,
} from "./ssr/client-only.js";

// Table behavior
export {
  createTableBehavior,
  sortData,
  type TableBehavior,
  type TableBehaviorOptions,
  type SortState,
  type SelectionState,
  type SortDirection as TableSortDirection,
} from "./behavior/table.js";

// Tree behavior
export {
  createTreeBehavior,
  type TreeBehavior,
  type TreeBehaviorOptions,
  type TreeItem,
  type TreeSelectionMode as TreeBehaviorSelectionMode,
} from "./behavior/tree.js";

// List behavior
export {
  createListBehavior,
  type ListBehavior,
  type ListBehaviorOptions,
  type ListSelectionMode as ListBehaviorSelectionMode,
  type ListOrientation as ListBehaviorOrientation,
} from "./behavior/list.js";

// Tabs behavior
export {
  createTabsBehavior,
  type TabsBehavior,
  type TabsBehaviorOptions,
  type TabsBehaviorState,
  type TabsBehaviorContext,
  type TabsOrientation,
  type TabsActivationMode,
  type TabsEvent,
  type TabListProps,
  type TabTriggerProps,
  type TabPanelProps,
} from "./behavior/tabs.js";

// Composite primitives
export {
  createModalOverlay,
  type ModalOverlay,
  type ModalOverlayOptions,
  type ModalOverlayState,
} from "./composites/modal-overlay.js";

export {
  createPopoverOverlay,
  type PopoverOverlay,
  type PopoverOverlayOptions,
  type PopoverOverlayState,
} from "./composites/popover-overlay.js";

export {
  createSelectableList,
  type SelectableList,
  type SelectableListOptions,
  type SelectableListState,
  type SelectionMode,
  type ListOrientation,
} from "./composites/selectable-list.js";
