import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

/**
 * Toggle switch for boolean settings with role="switch" semantics.
 *
 * @element ds-switch
 * @fires ds:change - Fired on state change with { checked }
 *
 * @slot - Switch label
 *
 * @example
 * ```html
 * <ds-switch>Enable notifications</ds-switch>
 *
 * <ds-field>
 *   <ds-label>Dark Mode</ds-label>
 *   <ds-switch name="darkMode">Enable dark mode</ds-switch>
 *   <ds-field-description>Switch between light and dark themes</ds-field-description>
 * </ds-field>
 * ```
 */
export class DsSwitch extends DSElement {
  /** Form field name */
  @property({ type: String, reflect: true })
  name = "";

  /** Value when checked */
  @property({ type: String })
  value = "on";

  /** Checked (on) state */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Required state */
  @property({ type: Boolean, reflect: true })
  required = false;

  /** ARIA describedby - IDs of elements that describe this switch */
  @state()
  private ariaDescribedBy?: string;

  /** Label text captured from slot */
  @state()
  private labelText = "";

  /** Unique ID for label association */
  @state()
  private labelId = "";

  private attributeObserver: MutationObserver | null = null;

  override connectedCallback(): void {
    // Capture label text before Lit renders
    this.labelText = this.textContent?.trim() ?? "";
    // Generate unique ID for label
    this.labelId = `switch-label-${crypto.randomUUID().slice(0, 8)}`;

    super.connectedCallback();

    // Observe ARIA attribute changes on the host element
    this.attributeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          this.syncAriaAttributes();
        }
      }
    });

    this.attributeObserver.observe(this, {
      attributes: true,
      attributeFilter: ["aria-describedby", "aria-invalid", "aria-required", "aria-disabled"],
    });

    // Initial sync
    this.syncAriaAttributes();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.attributeObserver?.disconnect();
    this.attributeObserver = null;
  }

  /**
   * Syncs ARIA attributes from the host element to internal state.
   */
  private syncAriaAttributes(): void {
    this.ariaDescribedBy = this.getAttribute("aria-describedby") ?? undefined;

    // Sync required state from aria-required
    const ariaRequired = this.getAttribute("aria-required");
    if (ariaRequired === "true") {
      this.required = true;
    }

    // Sync disabled state from aria-disabled
    const ariaDisabled = this.getAttribute("aria-disabled");
    if (ariaDisabled === "true") {
      this.disabled = true;
    }
  }

  /**
   * Toggles the switch state.
   */
  private toggle(): void {
    if (this.disabled) return;

    this.checked = !this.checked;

    emitEvent(this, StandardEvents.CHANGE, {
      detail: {
        checked: this.checked,
      },
    });
  }

  private handleClick = (event: Event): void => {
    event.preventDefault();
    this.toggle();
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    // Both Space and Enter keys toggle the switch (distinct from checkbox)
    if ((event.key === " " || event.key === "Enter") && !this.disabled) {
      event.preventDefault();
      this.toggle();
    }
  };

  override render() {
    return html`
      <div
        class="ds-switch"
        part="container"
        @click=${this.handleClick}
      >
        <div
          role="switch"
          part="control"
          class="ds-switch__control"
          tabindex=${this.disabled ? -1 : 0}
          aria-checked=${this.checked ? "true" : "false"}
          aria-disabled=${this.disabled ? "true" : "false"}
          aria-required=${this.required ? "true" : "false"}
          aria-labelledby=${this.labelId}
          aria-describedby=${ifDefined(this.ariaDescribedBy)}
          @keydown=${this.handleKeyDown}
        >
          <span class="ds-switch__track" part="track">
            <span class="ds-switch__thumb" part="thumb"></span>
          </span>
        </div>
        <span id=${this.labelId} class="ds-switch__label" part="label">
          ${this.labelText}
        </span>
      </div>
    `;
  }
}

define("ds-switch", DsSwitch);

declare global {
  interface HTMLElementTagNameMap {
    "ds-switch": DsSwitch;
  }
}
