import {
  type AnchorPosition,
  type DismissableLayer,
  type Option,
  type Placement,
  type Presence,
  type RovingFocus,
  type SelectBehavior,
  type TypeAhead,
  type VirtualizedList,
  createAnchorPosition,
  createDismissableLayer,
  createPresence,
  createRovingFocus,
  createSelectBehavior,
  createTypeAhead,
  prefersReducedMotion,
} from "@ds/primitives-dom";
import { html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { DSElement } from "../../base/ds-element.js";
import { FormAssociatedMixin } from "../../base/form-associated.js";
import type { ValidationFlags } from "../../base/form-associated.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

// Import child components to ensure they're registered
import type { DsSelectContent } from "./select-content.js";
import type { DsSelectOption } from "./select-option.js";
import type { DsSelectTrigger } from "./select-trigger.js";
import "./select-content.js";
import "./select-option.js";
import "./select-trigger.js";
import "./select-group.js";
import "./select-label.js";

/**
 * Select component with keyboard navigation, type-ahead, and native form participation.
 *
 * Uses ElementInternals for form association - the selected value is submitted with the form
 * and the select participates in constraint validation.
 *
 * Implements WAI-ARIA Listbox pattern with:
 * - Arrow key navigation between options
 * - Type-ahead search to jump to options
 * - Enter/Space/Click to select options
 * - Escape to close
 *
 * @element ds-select
 *
 * @slot trigger - Trigger element (ds-select-trigger with button inside)
 * @slot - Select content (ds-select-content with ds-select-option children)
 *
 * @fires ds:open-change - Fired when open state changes (detail: { open, reason })
 * @fires ds:change - Fired when value changes (detail: { value, label })
 * @fires ds:invalid - Fired when customValidation is true and validation fails
 *
 * @example
 * ```html
 * <form>
 *   <ds-select name="fruit" required>
 *     <ds-select-trigger slot="trigger">
 *       <button>Select fruit</button>
 *     </ds-select-trigger>
 *     <ds-select-content>
 *       <ds-select-option value="apple">Apple</ds-select-option>
 *       <ds-select-option value="banana">Banana</ds-select-option>
 *     </ds-select-content>
 *   </ds-select>
 *   <button type="submit">Submit</button>
 * </form>
 * ```
 */
export class DsSelect extends FormAssociatedMixin(DSElement) {
  /** Whether the select is open */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** Current selected value */
  @property({ type: String, reflect: true })
  value = "";

  /** Placement relative to trigger */
  @property({ type: String, reflect: true })
  placement: Placement = "bottom-start";

  /** Offset distance from trigger in pixels */
  @property({ type: Number })
  offset = 4;

  /** Whether to flip placement when near viewport edge */
  @property({ type: Boolean })
  flip = true;

  /** Whether to animate open/close transitions */
  @property({ type: Boolean })
  animated = true;

  /** Whether the select is disabled */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Whether the select is read-only */
  @property({ type: Boolean, reflect: true })
  readonly = false;

  /** Whether to enable type-ahead search */
  @property({ type: Boolean })
  searchable = true;

  /** Whether to show clear button */
  @property({ type: Boolean })
  clearable = false;

  /** Enable virtualization for large lists */
  @property({ type: Boolean })
  virtualize = false;

  /** Virtualization threshold (default: 100) */
  @property({ type: Number, attribute: "virtualization-threshold" })
  virtualizationThreshold = 100;

  /** Whether the select is in a loading state (e.g., fetching options) */
  @property({ type: Boolean, reflect: true })
  loading = false;

  /** Text to display/announce during loading */
  @property({ type: String, attribute: "loading-text" })
  loadingText = "Loading...";

  /**
   * Data-driven options array. Use this for programmatic option rendering.
   * When provided, options will be rendered from this array instead of slots.
   */
  @property({ attribute: false })
  items: Option<string>[] = [];

  /** Visible item IDs for virtualization */
  @state()
  private visibleItemIds = new Set<string>();

  /** Default value for form reset */
  private _defaultValue = "";

  private behavior: SelectBehavior<string> | null = null;
  private anchorPosition: AnchorPosition | null = null;
  private dismissLayer: DismissableLayer | null = null;
  private presence: Presence | null = null;
  private rovingFocus: RovingFocus | null = null;
  private typeAhead: TypeAhead | null = null;
  private virtualizedList: VirtualizedList | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private scrollHandler: (() => void) | null = null;
  private focusFirstOnOpen: "first" | "last" | "selected" | null = null;

  override connectedCallback(): void {
    // Store default value for form reset
    this._defaultValue = this.value;

    super.connectedCallback();

    // Initialize behavior
    this.behavior = createSelectBehavior({
      defaultValue: this.value || null,
      disabled: this.disabled,
      readOnly: this.readonly,
      searchable: this.searchable,
      clearable: this.clearable,
      onValueChange: (value) => {
        this.value = value ?? "";
        const option = this.getOptionByValue(value ?? "");
        emitEvent(this, StandardEvents.CHANGE, {
          detail: {
            value: value ?? "",
            label: option?.getLabel() ?? "",
          },
        });
      },
      onOpenChange: (open) => {
        this.open = open;
        emitEvent(this, StandardEvents.OPEN_CHANGE, {
          detail: { open, reason: "trigger" },
        });
      },
    });

    // Listen for trigger interactions
    this.addEventListener("click", this.handleTriggerClick);
    this.addEventListener("keydown", this.handleKeyDown);

    // Setup after first render
    this.updateComplete.then(() => {
      this.setupTriggerAccessibility();
      this.registerOptions();
      this.updateOptionStates();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleTriggerClick);
    this.removeEventListener("keydown", this.handleKeyDown);
    this.cleanup();
    this.behavior?.destroy();
    this.behavior = null;
  }

  /**
   * Opens the select.
   */
  public show(): void {
    if (this.open || this.disabled || this.loading) return;
    this.behavior?.open();
  }

  /**
   * Closes the select.
   */
  public close(): void {
    if (!this.open) return;

    const content = this.querySelector("ds-select-content") as DsSelectContent | null;

    // If animated, use presence for exit animation
    if (this.animated && content && !prefersReducedMotion()) {
      // Cleanup dismiss layer so it doesn't re-trigger
      this.dismissLayer?.deactivate();
      this.dismissLayer = null;

      // Create presence for exit animation
      this.presence = createPresence({
        onExitComplete: () => {
          this.completeClose();
        },
      });
      this.presence.hide(content);
    } else {
      // No animation - close immediately
      this.cleanup();
      this.behavior?.close();

      // Return focus to trigger
      this.getTriggerElement()?.focus();
    }
  }

  /**
   * Completes the close after exit animation.
   */
  private completeClose(): void {
    this.cleanup();
    this.behavior?.close();

    // Return focus to trigger
    this.getTriggerElement()?.focus();
  }

  /**
   * Toggles the select open/closed state.
   */
  public toggle(): void {
    if (this.open) {
      this.close();
    } else {
      this.show();
    }
  }

  /**
   * Selects a value programmatically.
   */
  public select(value: string): void {
    if (this.disabled || this.readonly) return;
    this.behavior?.select(value);
  }

  /**
   * Clears the selection.
   */
  public clear(): void {
    if (!this.clearable || this.disabled || this.readonly) return;
    this.behavior?.clear();
    this.updateOptionStates();
  }

  private getTriggerElement(): HTMLElement | null {
    const trigger = this.querySelector("ds-select-trigger") as DsSelectTrigger | null;
    return trigger?.getTriggerElement() ?? null;
  }

  private getOptions(): DsSelectOption[] {
    const content = this.querySelector("ds-select-content");
    if (!content) return [];
    return Array.from(content.querySelectorAll<DsSelectOption>("ds-select-option"));
  }

  private getEnabledOptions(): DsSelectOption[] {
    return this.getOptions().filter((opt) => !opt.disabled);
  }

  private getOptionByValue(value: string): DsSelectOption | null {
    return this.getOptions().find((opt) => opt.value === value) ?? null;
  }

  private registerOptions(): void {
    const options = this.getOptions();
    const items = options.map((opt) => ({
      value: opt.value,
      disabled: opt.disabled,
    }));
    this.behavior?.setItems(items);
    this.behavior?.setOptionCount(options.length);
  }

  private updateOptionStates(): void {
    const currentValue = this.behavior?.state.value ?? this.value;
    const highlightedValue = this.behavior?.state.highlightedValue;

    for (const option of this.getOptions()) {
      option.setSelected(option.value === currentValue);
      option.setHighlighted(option.value === highlightedValue);
    }
  }

  private handleTriggerClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const trigger = target.closest("ds-select-trigger");

    if (trigger && this.contains(trigger)) {
      event.preventDefault();
      if (this.disabled || this.loading) return;
      this.focusFirstOnOpen = this.value ? "selected" : "first";
      this.toggle();
    }

    // Handle option click
    const option = target.closest("ds-select-option") as DsSelectOption | null;
    if (option && this.contains(option) && !option.disabled) {
      event.preventDefault();
      this.selectOption(option);
    }
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement;

    // Handle trigger keys when closed
    if (!this.open) {
      const trigger = target.closest("ds-select-trigger");
      if (trigger && this.contains(trigger)) {
        this.handleTriggerKeyDown(event);
      }
      return;
    }

    // Handle content keys when open
    this.handleContentKeyDown(event);
  };

  private handleTriggerKeyDown(event: KeyboardEvent): void {
    if (this.disabled || this.loading) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        this.focusFirstOnOpen = this.value ? "selected" : "first";
        this.show();
        break;
      case "ArrowDown":
        event.preventDefault();
        this.focusFirstOnOpen = "first";
        this.show();
        break;
      case "ArrowUp":
        event.preventDefault();
        this.focusFirstOnOpen = "last";
        this.show();
        break;
    }
  }

  private handleContentKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        this.selectHighlighted();
        break;
      case "Escape":
        event.preventDefault();
        this.close();
        break;
      case "ArrowDown":
        event.preventDefault();
        this.behavior?.highlightNext();
        this.updateOptionStates();
        this.updateTriggerAria();
        break;
      case "ArrowUp":
        event.preventDefault();
        this.behavior?.highlightPrev();
        this.updateOptionStates();
        this.updateTriggerAria();
        break;
      case "Home":
        event.preventDefault();
        this.behavior?.highlightFirst();
        this.updateOptionStates();
        this.updateTriggerAria();
        break;
      case "End":
        event.preventDefault();
        this.behavior?.highlightLast();
        this.updateOptionStates();
        this.updateTriggerAria();
        break;
      case "Tab":
        // Close on tab without preventing default
        this.close();
        break;
    }
  }

  private selectOption(option: DsSelectOption): void {
    this.behavior?.select(option.value);
    this.updateOptionStates();
    this.close();
  }

  private selectHighlighted(): void {
    const highlightedValue = this.behavior?.state.highlightedValue;
    if (highlightedValue) {
      this.behavior?.select(highlightedValue);
      this.updateOptionStates();
      this.close();
    }
  }

  private handleDismiss = (): void => {
    this.close();
  };

  private setupTriggerAccessibility(): void {
    const trigger = this.querySelector("ds-select-trigger") as DsSelectTrigger | null;
    const content = this.querySelector("ds-select-content") as DsSelectContent | null;

    if (trigger && content) {
      trigger.disabled = this.disabled;
      trigger.updateAria(this.open, undefined, content.id);
    }

    // Set aria-busy on the trigger element when loading
    this.updateLoadingState();
  }

  private updateLoadingState(): void {
    const triggerElement = this.getTriggerElement();
    if (triggerElement) {
      if (this.loading) {
        triggerElement.setAttribute("aria-busy", "true");
      } else {
        triggerElement.removeAttribute("aria-busy");
      }
    }
  }

  private updateTriggerAria(): void {
    const trigger = this.querySelector("ds-select-trigger") as DsSelectTrigger | null;
    const content = this.querySelector("ds-select-content") as DsSelectContent | null;

    if (trigger && content) {
      const highlightedValue = this.behavior?.state.highlightedValue;
      const highlightedOption = highlightedValue ? this.getOptionByValue(highlightedValue) : null;
      trigger.updateAria(this.open, highlightedOption?.id, content.id);
    }
  }

  private setupPositioning(): void {
    const trigger = this.getTriggerElement();
    const content = this.querySelector("ds-select-content") as HTMLElement | null;

    if (!trigger || !content) return;

    // Setup anchor positioning
    this.anchorPosition = createAnchorPosition({
      anchor: trigger,
      floating: content,
      placement: this.placement,
      offset: this.offset,
      flip: this.flip,
      onPositionChange: (pos) => {
        content.setAttribute("data-placement", pos.placement);
      },
    });

    // Setup resize observer for repositioning
    this.resizeObserver = new ResizeObserver(() => {
      this.anchorPosition?.update();
    });
    this.resizeObserver.observe(trigger);
    this.resizeObserver.observe(content);

    // Setup scroll handler for repositioning
    this.scrollHandler = () => {
      this.anchorPosition?.update();
    };
    window.addEventListener("scroll", this.scrollHandler, { passive: true });
    window.addEventListener("resize", this.scrollHandler, { passive: true });
  }

  private setupDismissLayer(): void {
    const content = this.querySelector("ds-select-content") as HTMLElement | null;
    const trigger = this.getTriggerElement();

    if (!content) return;

    this.dismissLayer = createDismissableLayer({
      container: content,
      excludeElements: trigger ? [trigger] : [],
      onDismiss: this.handleDismiss,
      closeOnEscape: true,
      closeOnOutsideClick: true,
    });
    this.dismissLayer.activate();
  }

  private setupRovingFocus(): void {
    const content = this.querySelector("ds-select-content") as HTMLElement | null;

    if (!content) return;

    this.rovingFocus = createRovingFocus({
      container: content,
      selector: "ds-select-option:not([disabled])",
      direction: "vertical",
      loop: true,
      skipDisabled: true,
    });
  }

  private setupTypeAhead(): void {
    if (!this.searchable) return;

    const content = this.querySelector("ds-select-content") as HTMLElement | null;
    if (!content) return;

    this.typeAhead = createTypeAhead({
      items: () => this.getEnabledOptions() as HTMLElement[],
      getText: (item) => (item as DsSelectOption).getLabel(),
      onMatch: (item) => {
        const option = item as DsSelectOption;
        this.behavior?.highlight(option.value);
        this.updateOptionStates();
        this.updateTriggerAria();
        // Scroll into view
        option.scrollIntoView({ block: "nearest" });
      },
    });

    // Wire type-ahead to keydown events
    content.addEventListener("keydown", this.handleTypeAheadKeyDown);
  }

  private handleTypeAheadKeyDown = (event: KeyboardEvent): void => {
    this.typeAhead?.handleKeyDown(event);
  };

  private focusInitialItem(): void {
    const content = this.querySelector("ds-select-content");
    if (!content) return;

    const options = this.getEnabledOptions();
    if (options.length === 0) return;

    let initialIndex = 0;

    if (this.focusFirstOnOpen === "last") {
      initialIndex = options.length - 1;
    } else if (this.focusFirstOnOpen === "selected" && this.value) {
      const selectedIndex = options.findIndex((opt) => opt.value === this.value);
      if (selectedIndex >= 0) {
        initialIndex = selectedIndex;
      }
    }

    // Highlight the initial option
    const initialOption = options[initialIndex];
    if (initialOption) {
      this.behavior?.highlight(initialOption.value);
      this.updateOptionStates();
      this.rovingFocus?.setFocusedIndex(initialIndex);
      initialOption.scrollIntoView({ block: "nearest" });
    }

    this.focusFirstOnOpen = null;
  }

  private cleanup(): void {
    const content = this.querySelector("ds-select-content") as HTMLElement | null;

    // Cleanup type-ahead listener
    if (content) {
      content.removeEventListener("keydown", this.handleTypeAheadKeyDown);
    }

    // Cleanup anchor positioning
    this.anchorPosition?.destroy();
    this.anchorPosition = null;

    // Cleanup dismiss layer
    this.dismissLayer?.deactivate();
    this.dismissLayer = null;

    // Cleanup presence
    this.presence?.destroy();
    this.presence = null;

    // Cleanup roving focus
    this.rovingFocus?.destroy();
    this.rovingFocus = null;

    // Cleanup type-ahead
    this.typeAhead?.reset();
    this.typeAhead = null;

    // Cleanup virtualized list
    this.virtualizedList?.destroy();
    this.virtualizedList = null;

    // Cleanup resize observer
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    // Cleanup scroll handler
    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler);
      window.removeEventListener("resize", this.scrollHandler);
      this.scrollHandler = null;
    }
  }

  override async updated(changedProperties: Map<string, unknown>): Promise<void> {
    super.updated(changedProperties);

    if (changedProperties.has("open")) {
      this.updateTriggerAria();

      const content = this.querySelector("ds-select-content") as DsSelectContent | null;

      if (this.open) {
        // Re-register options in case they changed
        this.registerOptions();

        // Show content
        content?.removeAttribute("hidden");

        // Set data-state to open for entry animation
        if (content) {
          content.dataState = "open";
        }

        // Wait for DOM update
        await this.updateComplete;

        // Setup all behaviors
        this.setupPositioning();
        this.setupDismissLayer();
        this.setupRovingFocus();
        this.setupTypeAhead();

        // Focus initial item
        this.focusInitialItem();
      } else {
        // Set data-state to closed for exit animation
        if (content) {
          content.dataState = "closed";
        }
        // Hide content
        content?.setAttribute("hidden", "");
      }
    }

    if (changedProperties.has("value")) {
      this.updateOptionStates();
    }

    if (changedProperties.has("disabled")) {
      const trigger = this.querySelector("ds-select-trigger") as DsSelectTrigger | null;
      if (trigger) {
        trigger.disabled = this.disabled;
      }
      if (this.disabled && this.open) {
        this.close();
      }
    }

    // Handle loading state changes
    if (changedProperties.has("loading")) {
      this.updateLoadingState();
      // Close dropdown if loading starts while open
      if (this.loading && this.open) {
        this.close();
      }
    }

    // Update positioning if placement or offset changes while open
    if (this.open && (changedProperties.has("placement") || changedProperties.has("offset"))) {
      this.cleanup();
      this.setupPositioning();
      this.setupDismissLayer();
      this.setupRovingFocus();
      this.setupTypeAhead();
    }
  }

  // Form association implementation

  protected getFormValue(): string | null {
    return this.value || null;
  }

  protected getValidationAnchor(): HTMLElement | undefined {
    return this.getTriggerElement() as HTMLElement | undefined;
  }

  protected getValidationFlags(): ValidationFlags {
    if (this.required && !this.value) {
      return { valueMissing: true };
    }
    return {};
  }

  protected getValidationMessage(flags: ValidationFlags): string {
    if (flags.valueMissing) {
      return "Please select an option";
    }
    return "";
  }

  protected shouldUpdateFormValue(changedProperties: PropertyValues): boolean {
    return changedProperties.has("value");
  }

  protected shouldUpdateValidity(changedProperties: PropertyValues): boolean {
    return changedProperties.has("value");
  }

  protected onFormReset(): void {
    this.value = this._defaultValue;
    this.updateOptionStates();
  }

  protected onFormStateRestore(
    state: string | File | FormData | null,
    _mode: "restore" | "autocomplete"
  ): void {
    if (typeof state === "string") {
      this.value = state;
      this.updateOptionStates();
    }
  }

  /**
   * Returns true if using data-driven rendering.
   */
  private get isDataDriven(): boolean {
    return this.items.length > 0;
  }

  /**
   * Renders a single option from data.
   */
  private renderDataOption(item: Option<string>) {
    const currentValue = this.behavior?.state.value ?? this.value;
    const highlightedValue = this.behavior?.state.highlightedValue;
    const isSelected = item.value === currentValue;
    const isHighlighted = item.value === highlightedValue;

    return html`
      <ds-select-option
        value=${item.value}
        ?disabled=${item.disabled}
        data-selected=${isSelected || nothing}
        data-highlighted=${isHighlighted || nothing}
      >
        ${item.label}
      </ds-select-option>
    `;
  }

  /**
   * Renders data-driven options with optional virtualization.
   */
  private renderDataOptions() {
    // Use virtualization for large lists
    if (this.virtualize && this.items.length > this.virtualizationThreshold) {
      return html`
        <div class="ds-select__virtualized" style="height: ${Math.min(this.items.length * 40, 300)}px; overflow-y: auto;">
          ${repeat(
            this.items,
            (item) => item.value,
            (item) => this.renderDataOption(item)
          )}
        </div>
      `;
    }

    return repeat(
      this.items,
      (item) => item.value,
      (item) => this.renderDataOption(item)
    );
  }

  override render() {
    return html`
      <slot name="trigger"></slot>
      ${
        this.isDataDriven
          ? html`
            <ds-select-content>
              ${this.renderDataOptions()}
            </ds-select-content>
          `
          : html`<slot></slot>`
      }
    `;
  }
}

define("ds-select", DsSelect);

declare global {
  interface HTMLElementTagNameMap {
    "ds-select": DsSelect;
  }
}
