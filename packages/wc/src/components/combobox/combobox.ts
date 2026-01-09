import {
  type AnchorPosition,
  type ComboboxBehavior,
  type DismissableLayer,
  type Option,
  type Placement,
  type Presence,
  type RovingFocus,
  type VirtualizedList,
  createAnchorPosition,
  createComboboxBehavior,
  createDismissableLayer,
  createPresence,
  createRovingFocus,
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
import type { DsComboboxContent } from "./combobox-content.js";
import type { DsComboboxInput } from "./combobox-input.js";
import type { DsComboboxOption } from "./combobox-option.js";
import "./combobox-content.js";
import "./combobox-input.js";
import "./combobox-option.js";
import "./combobox-tag.js";

/**
 * Combobox component with async loading, multi-select, keyboard navigation, and native form participation.
 *
 * Uses ElementInternals for form association - the selected value(s) are submitted with the form
 * and the combobox participates in constraint validation.
 *
 * Implements WAI-ARIA Combobox pattern with:
 * - Text input with autocomplete suggestions
 * - Arrow key navigation between options
 * - Async loading with debounce
 * - Multi-select with tag display
 * - Enter to select, Escape to close
 *
 * @element ds-combobox
 *
 * @slot input - Input element (ds-combobox-input with input inside)
 * @slot tags - Selected value tags (for multi-select)
 * @slot - Combobox content (ds-combobox-content with ds-combobox-option children)
 *
 * @fires ds:open - Fired when combobox opens
 * @fires ds:close - Fired when combobox closes
 * @fires ds:change - Fired when value changes (detail: { value, label } or { values, labels })
 * @fires ds:input - Fired when input value changes (detail: { value })
 * @fires ds:invalid - Fired when customValidation is true and validation fails
 *
 * @example
 * ```html
 * <form>
 *   <ds-combobox name="fruit" required>
 *     <ds-combobox-input slot="input">
 *       <input placeholder="Search fruits..." />
 *     </ds-combobox-input>
 *     <ds-combobox-content>
 *       <ds-combobox-option value="apple">Apple</ds-combobox-option>
 *       <ds-combobox-option value="banana">Banana</ds-combobox-option>
 *     </ds-combobox-content>
 *   </ds-combobox>
 *   <button type="submit">Submit</button>
 * </form>
 * ```
 */
export class DsCombobox extends FormAssociatedMixin(DSElement) {
  /** Whether the combobox is open */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** Current selected value (single-select mode) */
  @property({ type: String, reflect: true })
  value = "";

  /** Current selected values (multi-select mode) */
  @property({ type: Array })
  values: string[] = [];

  /** Placement relative to input */
  @property({ type: String, reflect: true })
  placement: Placement = "bottom-start";

  /** Offset distance from input in pixels */
  @property({ type: Number })
  offset = 4;

  /** Whether to flip placement when near viewport edge */
  @property({ type: Boolean })
  flip = true;

  /** Whether to animate open/close transitions */
  @property({ type: Boolean })
  animated = true;

  /** Whether the combobox is disabled */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Enable multi-select mode */
  @property({ type: Boolean, reflect: true })
  multiple = false;

  /** Allow creating new values */
  @property({ type: Boolean })
  creatable = false;

  /** Debounce delay for async loading in milliseconds */
  @property({ type: Number })
  debounce = 300;

  /** Virtualization threshold (default: 100) */
  @property({ type: Number, attribute: "virtualization-threshold" })
  virtualizationThreshold = 100;

  /** Enable virtualization for large lists */
  @property({ type: Boolean })
  virtualize = false;

  /**
   * Async loading function. Called when input changes (after debounce).
   * Return an array of Option objects: { value: string, label: string, disabled?: boolean }
   */
  @property({ attribute: false })
  loadItems?: (query: string, signal: AbortSignal) => Promise<Option<string>[]>;

  /**
   * Data-driven options array. Use this for programmatic option rendering.
   * When provided, options will be rendered from this array instead of slots.
   */
  @property({ attribute: false })
  items: Option<string>[] = [];

  /** Whether async loading is in progress (read-only) */
  @state()
  loading = false;

  /** Error message from async loading (read-only) */
  @state()
  loadError: string | null = null;

  /** Filtered items for display */
  @state()
  private filteredItems: Option<string>[] = [];

  /** Visible item IDs for virtualization */
  @state()
  private visibleItemIds = new Set<string>();

  /** Default value for form reset (single-select) */
  private _defaultValue = "";

  /** Default values for form reset (multi-select) */
  private _defaultValues: string[] = [];

  private behavior: ComboboxBehavior<string, false> | ComboboxBehavior<string, true> | null = null;
  private anchorPosition: AnchorPosition | null = null;
  private dismissLayer: DismissableLayer | null = null;
  private presence: Presence | null = null;
  private rovingFocus: RovingFocus | null = null;
  private virtualizedList: VirtualizedList | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private scrollHandler: (() => void) | null = null;
  private loadAbortController: AbortController | null = null;
  private debounceTimeout: number | null = null;

  override connectedCallback(): void {
    // Store default value(s) for form reset
    this._defaultValue = this.value;
    this._defaultValues = [...this.values];

    super.connectedCallback();

    // Initialize behavior based on multiple prop
    this.initBehavior();

    // Listen for input interactions
    this.addEventListener("input", this.handleInput);
    this.addEventListener("keydown", this.handleKeyDown);
    this.addEventListener("click", this.handleClick);

    // Listen for tag removal
    this.addEventListener("ds:remove", this.handleTagRemove);

    // Setup after first render
    this.updateComplete.then(() => {
      this.setupInputAccessibility();
      this.registerOptions();
      this.updateOptionStates();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("input", this.handleInput);
    this.removeEventListener("keydown", this.handleKeyDown);
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("ds:remove", this.handleTagRemove);
    this.cleanup();
    this.behavior?.destroy();
    this.behavior = null;
  }

  private initBehavior(): void {
    if (this.multiple) {
      this.behavior = createComboboxBehavior<string, true>({
        defaultValue: this.values,
        multiple: true,
        creatable: this.creatable,
        debounce: this.debounce,
        virtualizationThreshold: this.virtualizationThreshold,
        disabled: this.disabled,
        onValueChange: (values) => {
          this.values = values;
          const options = this.getOptions();
          const labels = values.map((v) => {
            const opt = options.find((o) => o.value === v);
            return opt?.getLabel() ?? v;
          });
          emitEvent(this, StandardEvents.CHANGE, { detail: { values, labels } });
        },
        onInputChange: (query) => {
          emitEvent(this, "input", { detail: { value: query } });
          this.filterOptions(query);
        },
        onCreateValue: (value) => {
          emitEvent(this, "create", { detail: { value } });
        },
      });
    } else {
      this.behavior = createComboboxBehavior<string, false>({
        defaultValue: this.value || null,
        multiple: false,
        creatable: this.creatable,
        debounce: this.debounce,
        virtualizationThreshold: this.virtualizationThreshold,
        disabled: this.disabled,
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
        onInputChange: (query) => {
          emitEvent(this, "input", { detail: { value: query } });
          this.filterOptions(query);
        },
        onCreateValue: (value) => {
          emitEvent(this, "create", { detail: { value } });
        },
      });
    }
  }

  /**
   * Opens the combobox.
   */
  public show(): void {
    if (this.open || this.disabled) return;
    this.behavior?.open();
    this.open = true;
    emitEvent(this, StandardEvents.OPEN);
  }

  /**
   * Closes the combobox.
   */
  public close(): void {
    if (!this.open) return;

    const content = this.querySelector("ds-combobox-content") as DsComboboxContent | null;

    // If animated, use presence for exit animation
    if (this.animated && content && !prefersReducedMotion()) {
      this.dismissLayer?.deactivate();
      this.dismissLayer = null;

      this.presence = createPresence({
        onExitComplete: () => {
          this.completeClose();
        },
      });
      this.presence.hide(content);
    } else {
      this.cleanup();
      this.behavior?.close();
      this.open = false;
      emitEvent(this, StandardEvents.CLOSE);
    }
  }

  private completeClose(): void {
    this.cleanup();
    this.behavior?.close();
    this.open = false;
    emitEvent(this, StandardEvents.CLOSE);
  }

  /**
   * Selects a value programmatically.
   */
  public select(value: string): void {
    if (this.disabled) return;
    this.behavior?.select(value);
    this.updateOptionStates();
    if (!this.multiple) {
      this.close();
    }
  }

  /**
   * Removes a value (multi-select mode).
   */
  public removeValue(value: string): void {
    if (this.disabled || !this.multiple) return;
    (this.behavior as ComboboxBehavior<string, true>)?.remove(value);
    this.updateOptionStates();
  }

  /**
   * Clears all selections.
   */
  public clear(): void {
    if (this.disabled) return;
    this.behavior?.clear();
    this.updateOptionStates();
  }

  /**
   * Creates a new value (creatable mode).
   */
  public create(value: string): void {
    if (!this.creatable || this.disabled) return;
    this.behavior?.create(value);
  }

  private getInputWrapper(): DsComboboxInput | null {
    return this.querySelector("ds-combobox-input") as DsComboboxInput | null;
  }

  private getInputElement(): HTMLInputElement | null {
    return this.getInputWrapper()?.getInputElement() ?? null;
  }

  private getOptions(): DsComboboxOption[] {
    const content = this.querySelector("ds-combobox-content");
    if (!content) return [];
    return Array.from(content.querySelectorAll<DsComboboxOption>("ds-combobox-option"));
  }

  private getEnabledOptions(): DsComboboxOption[] {
    return this.getOptions().filter((opt) => !opt.disabled);
  }

  private getOptionByValue(value: string): DsComboboxOption | null {
    return this.getOptions().find((opt) => opt.value === value) ?? null;
  }

  private registerOptions(): void {
    const options = this.getOptions();
    const _items: Option<string>[] = options.map((opt) => ({
      value: opt.value,
      label: opt.getLabel(),
      disabled: opt.disabled,
    }));
    // Set static items on behavior (for filtering)
    // Note: behavior stores items internally via the items option
  }

  private filterOptions(query: string): void {
    const options = this.getOptions();
    const lowerQuery = query.toLowerCase();

    for (const option of options) {
      const label = option.getLabel().toLowerCase();
      const matches = !query || label.includes(lowerQuery);

      if (matches) {
        option.removeAttribute("hidden");
      } else {
        option.setAttribute("hidden", "");
      }
    }

    // Auto-highlight first visible option
    const visibleOptions = this.getEnabledOptions().filter((opt) => !opt.hasAttribute("hidden"));
    if (visibleOptions.length > 0 && visibleOptions[0]) {
      this.behavior?.highlightFirst();
      this.updateOptionStates();
    }
  }

  private updateOptionStates(): void {
    const currentValue = this.multiple
      ? ((this.behavior as ComboboxBehavior<string, true>)?.state.value ?? this.values)
      : ([this.behavior?.state.value ?? this.value].filter(Boolean) as string[]);
    const highlightedValue = this.behavior?.state.highlightedValue;

    for (const option of this.getOptions()) {
      const isSelected = currentValue.includes(option.value);
      option.setSelected(isSelected);
      option.setHighlighted(option.value === highlightedValue);
    }
  }

  private handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    if (target.tagName !== "INPUT") return;

    const value = target.value;
    this.behavior?.setInputValue(value);

    // Auto-open on input
    if (!this.open && value) {
      this.show();
    }

    // Handle async loading with debounce
    if (this.loadItems) {
      this.scheduleAsyncLoad(value);
    }
  };

  /**
   * Schedules async loading with debounce.
   */
  private scheduleAsyncLoad(query: string): void {
    // Clear previous debounce
    if (this.debounceTimeout !== null) {
      window.clearTimeout(this.debounceTimeout);
    }

    // Cancel previous request
    this.loadAbortController?.abort();

    this.debounceTimeout = window.setTimeout(() => {
      this.executeAsyncLoad(query);
    }, this.debounce);
  }

  /**
   * Executes the async load.
   */
  private async executeAsyncLoad(query: string): Promise<void> {
    if (!this.loadItems) return;

    // Create new abort controller
    this.loadAbortController = new AbortController();
    const signal = this.loadAbortController.signal;

    this.loading = true;
    this.loadError = null;

    try {
      const results = await this.loadItems(query, signal);

      // Check if aborted
      if (signal.aborted) return;

      this.items = results;
      this.filteredItems = results;
      this.loading = false;

      // Update highlighting
      if (results.length > 0) {
        this.behavior?.highlightFirst();
        this.updateOptionStates();
      }
    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      this.loading = false;
      this.loadError = error instanceof Error ? error.message : "Failed to load items";
      this.items = [];
      this.filteredItems = [];
    }
  }

  /**
   * Manually trigger async loading (useful for initial load).
   */
  public async load(query = ""): Promise<void> {
    if (!this.loadItems) return;
    await this.executeAsyncLoad(query);
  }

  private handleClick = (event: Event): void => {
    const target = event.target as HTMLElement;

    // Handle option click
    const option = target.closest("ds-combobox-option") as DsComboboxOption | null;
    if (option && this.contains(option) && !option.disabled && !option.hasAttribute("hidden")) {
      event.preventDefault();
      this.select(option.value);
    }
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement;
    const isInput = target.tagName === "INPUT";

    if (!this.open) {
      // Open on arrow down when focused on input
      if (isInput && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        event.preventDefault();
        this.show();
      }
      return;
    }

    switch (event.key) {
      case "Enter": {
        event.preventDefault();
        const highlightedValue = this.behavior?.state.highlightedValue;
        if (highlightedValue) {
          this.select(highlightedValue);
        } else if (this.creatable && isInput) {
          const inputValue = (target as HTMLInputElement).value.trim();
          if (inputValue) {
            this.create(inputValue);
          }
        }
        break;
      }
      case "Escape":
        event.preventDefault();
        this.close();
        this.getInputElement()?.focus();
        break;
      case "ArrowDown":
        event.preventDefault();
        this.behavior?.highlightNext();
        this.updateOptionStates();
        this.updateInputAria();
        this.scrollHighlightedIntoView();
        break;
      case "ArrowUp":
        event.preventDefault();
        this.behavior?.highlightPrev();
        this.updateOptionStates();
        this.updateInputAria();
        this.scrollHighlightedIntoView();
        break;
      case "Home":
        if (isInput && (target as HTMLInputElement).selectionStart === 0) {
          event.preventDefault();
          this.behavior?.highlightFirst();
          this.updateOptionStates();
          this.updateInputAria();
          this.scrollHighlightedIntoView();
        }
        break;
      case "End":
        if (
          isInput &&
          (target as HTMLInputElement).selectionEnd === (target as HTMLInputElement).value.length
        ) {
          event.preventDefault();
          this.behavior?.highlightLast();
          this.updateOptionStates();
          this.updateInputAria();
          this.scrollHighlightedIntoView();
        }
        break;
      case "Backspace":
        if (this.multiple && isInput && (target as HTMLInputElement).value === "") {
          // Remove last tag
          (this.behavior as ComboboxBehavior<string, true>)?.removeLastTag();
          this.updateOptionStates();
        }
        break;
      case "Tab":
        // Close on tab without preventing default
        this.close();
        break;
    }
  };

  private handleTagRemove = (event: Event): void => {
    const customEvent = event as CustomEvent<{ value: string }>;
    this.removeValue(customEvent.detail.value);
  };

  private scrollHighlightedIntoView(): void {
    const highlightedValue = this.behavior?.state.highlightedValue;
    if (highlightedValue) {
      const option = this.getOptionByValue(highlightedValue);
      option?.scrollIntoView({ block: "nearest" });
    }
  }

  private handleDismiss = (): void => {
    this.close();
  };

  private setupInputAccessibility(): void {
    const inputWrapper = this.getInputWrapper();
    const content = this.querySelector("ds-combobox-content") as DsComboboxContent | null;

    if (inputWrapper && content) {
      inputWrapper.disabled = this.disabled;
      inputWrapper.updateAria(this.open, undefined, content.id);
    }
  }

  private updateInputAria(): void {
    const inputWrapper = this.getInputWrapper();
    const content = this.querySelector("ds-combobox-content") as DsComboboxContent | null;

    if (inputWrapper && content) {
      const highlightedValue = this.behavior?.state.highlightedValue;
      const highlightedOption = highlightedValue ? this.getOptionByValue(highlightedValue) : null;
      inputWrapper.updateAria(this.open, highlightedOption?.id, content.id);
    }
  }

  private setupPositioning(): void {
    const input = this.getInputElement();
    const content = this.querySelector("ds-combobox-content") as HTMLElement | null;

    if (!input || !content) return;

    this.anchorPosition = createAnchorPosition({
      anchor: input,
      floating: content,
      placement: this.placement,
      offset: this.offset,
      flip: this.flip,
      onPositionChange: (pos) => {
        content.setAttribute("data-placement", pos.placement);
      },
    });

    this.resizeObserver = new ResizeObserver(() => {
      this.anchorPosition?.update();
    });
    this.resizeObserver.observe(input);
    this.resizeObserver.observe(content);

    this.scrollHandler = () => {
      this.anchorPosition?.update();
    };
    window.addEventListener("scroll", this.scrollHandler, { passive: true });
    window.addEventListener("resize", this.scrollHandler, { passive: true });
  }

  private setupDismissLayer(): void {
    const content = this.querySelector("ds-combobox-content") as HTMLElement | null;
    const input = this.getInputElement();

    if (!content) return;

    this.dismissLayer = createDismissableLayer({
      container: content,
      excludeElements: input ? [input] : [],
      onDismiss: this.handleDismiss,
      closeOnEscape: true,
      closeOnOutsideClick: true,
    });
    this.dismissLayer.activate();
  }

  private setupRovingFocus(): void {
    const content = this.querySelector("ds-combobox-content") as HTMLElement | null;

    if (!content) return;

    this.rovingFocus = createRovingFocus({
      container: content,
      selector: "ds-combobox-option:not([disabled]):not([hidden])",
      direction: "vertical",
      loop: true,
      skipDisabled: true,
    });
  }

  private cleanup(): void {
    this.anchorPosition?.destroy();
    this.anchorPosition = null;

    this.dismissLayer?.deactivate();
    this.dismissLayer = null;

    this.presence?.destroy();
    this.presence = null;

    this.rovingFocus?.destroy();
    this.rovingFocus = null;

    this.virtualizedList?.destroy();
    this.virtualizedList = null;

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler);
      window.removeEventListener("resize", this.scrollHandler);
      this.scrollHandler = null;
    }

    // Cancel any pending async operations
    if (this.debounceTimeout !== null) {
      window.clearTimeout(this.debounceTimeout);
      this.debounceTimeout = null;
    }
    this.loadAbortController?.abort();
    this.loadAbortController = null;
  }

  override async updated(changedProperties: Map<string, unknown>): Promise<void> {
    super.updated(changedProperties);

    if (changedProperties.has("open")) {
      this.updateInputAria();

      const content = this.querySelector("ds-combobox-content") as DsComboboxContent | null;

      if (this.open) {
        this.registerOptions();

        content?.removeAttribute("hidden");

        if (content) {
          content.dataState = "open";
        }

        await this.updateComplete;

        this.setupPositioning();
        this.setupDismissLayer();
        this.setupRovingFocus();

        // Highlight first option or current value
        const visibleOptions = this.getEnabledOptions().filter(
          (opt) => !opt.hasAttribute("hidden")
        );
        if (visibleOptions.length > 0) {
          this.behavior?.highlightFirst();
          this.updateOptionStates();
        }
      } else {
        if (content) {
          content.dataState = "closed";
        }
        content?.setAttribute("hidden", "");

        // Clear filter when closing
        for (const option of this.getOptions()) {
          option.removeAttribute("hidden");
        }
      }
    }

    if (changedProperties.has("value") || changedProperties.has("values")) {
      this.updateOptionStates();
    }

    if (changedProperties.has("disabled")) {
      const inputWrapper = this.getInputWrapper();
      if (inputWrapper) {
        inputWrapper.disabled = this.disabled;
      }
      if (this.disabled && this.open) {
        this.close();
      }
    }

    if (this.open && (changedProperties.has("placement") || changedProperties.has("offset"))) {
      this.cleanup();
      this.setupPositioning();
      this.setupDismissLayer();
      this.setupRovingFocus();
    }
  }

  /**
   * Returns true if using data-driven rendering.
   */
  private get isDataDriven(): boolean {
    return this.items.length > 0 || this.loadItems !== undefined;
  }

  /**
   * Renders a single option from data.
   */
  private renderDataOption(item: Option<string>) {
    const currentValue = this.multiple
      ? ((this.behavior as ComboboxBehavior<string, true>)?.state.value ?? this.values)
      : ([this.behavior?.state.value ?? this.value].filter(Boolean) as string[]);
    const highlightedValue = this.behavior?.state.highlightedValue;
    const isSelected = currentValue.includes(item.value);
    const isHighlighted = item.value === highlightedValue;

    return html`
      <ds-combobox-option
        value=${item.value}
        ?disabled=${item.disabled}
        data-selected=${isSelected || nothing}
        data-highlighted=${isHighlighted || nothing}
      >
        ${item.label}
      </ds-combobox-option>
    `;
  }

  /**
   * Renders loading state.
   */
  private renderLoading() {
    return html`
      <div class="ds-combobox__loading" role="status" aria-live="polite">
        <slot name="loading">Loading...</slot>
      </div>
    `;
  }

  /**
   * Renders error state.
   */
  private renderError() {
    return html`
      <div class="ds-combobox__error" role="alert">
        <slot name="error">${this.loadError}</slot>
      </div>
    `;
  }

  /**
   * Renders empty state.
   */
  private renderEmpty() {
    return html`
      <div class="ds-combobox__empty">
        <slot name="empty">No results found</slot>
      </div>
    `;
  }

  // Form association implementation

  protected getFormValue(): FormData | string | null {
    if (this.multiple) {
      // For multi-select, submit as FormData with multiple values
      if (this.values.length === 0) return null;
      const formData = new FormData();
      for (const val of this.values) {
        formData.append(this.name, val);
      }
      return formData;
    }
    return this.value || null;
  }

  protected getValidationAnchor(): HTMLElement | undefined {
    return this.getInputElement() as HTMLElement | undefined;
  }

  protected getValidationFlags(): ValidationFlags {
    const hasValue = this.multiple ? this.values.length > 0 : Boolean(this.value);
    if (this.required && !hasValue) {
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
    return changedProperties.has("value") || changedProperties.has("values");
  }

  protected shouldUpdateValidity(changedProperties: PropertyValues): boolean {
    return changedProperties.has("value") || changedProperties.has("values");
  }

  protected onFormReset(): void {
    if (this.multiple) {
      this.values = [...this._defaultValues];
    } else {
      this.value = this._defaultValue;
    }
    this.updateOptionStates();
  }

  protected onFormStateRestore(
    state: string | File | FormData | null,
    _mode: "restore" | "autocomplete"
  ): void {
    if (this.multiple && state instanceof FormData) {
      this.values = state.getAll(this.name) as string[];
    } else if (typeof state === "string") {
      this.value = state;
    }
    this.updateOptionStates();
  }

  /**
   * Renders data-driven options.
   */
  private renderDataOptions() {
    const items = this.filteredItems.length > 0 ? this.filteredItems : this.items;

    if (this.loading) {
      return this.renderLoading();
    }

    if (this.loadError) {
      return this.renderError();
    }

    if (items.length === 0) {
      return this.renderEmpty();
    }

    // Use virtualization for large lists
    if (this.virtualize && items.length > this.virtualizationThreshold) {
      return html`
        <div class="ds-combobox__virtualized" style="height: ${Math.min(items.length * 40, 300)}px; overflow-y: auto;">
          ${repeat(
            items,
            (item) => item.value,
            (item) => this.renderDataOption(item)
          )}
        </div>
      `;
    }

    return repeat(
      items,
      (item) => item.value,
      (item) => this.renderDataOption(item)
    );
  }

  override render() {
    return html`
      <slot name="tags"></slot>
      <slot name="input"></slot>
      ${
        this.isDataDriven
          ? html`
            <ds-combobox-content>
              ${this.renderDataOptions()}
            </ds-combobox-content>
          `
          : html`<slot></slot>`
      }
    `;
  }
}

define("ds-combobox", DsCombobox);

declare global {
  interface HTMLElementTagNameMap {
    "ds-combobox": DsCombobox;
  }
}
