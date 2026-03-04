import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { formsSectionContent } from '@ds/demo-shared';

// Import WC components (bundled exports)
import '@ds/wc/form-controls';

/**
 * Forms page component showcasing form input components
 * Uses Light DOM so global CSS styles apply
 */
@customElement('demo-page-forms')
export class DemoPageForms extends LitElement {
  @state()
  private inputValue = '';

  @state()
  private textareaValue = '';

  @state()
  private switchChecked = false;

  @state()
  private checkboxChecked = false;

  // Use Light DOM so global CSS applies
  protected override createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="#dashboard">Dashboard</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current" aria-current="page">Forms</span>
      </nav>
      <div class="page-header">
        <h2 class="page-title">${formsSectionContent.title}</h2>
        <p class="page-description">${formsSectionContent.description}</p>
      </div>

      <!-- Input Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Input</h3>
        <p class="showcase-description">
          A text input field for collecting user data.
        </p>
        <div class="showcase-demo">
          <div class="form-group">
            <div class="form-field">
              <label for="default-input">Default Input</label>
              <ds-input
                id="default-input"
                placeholder="Enter text..."
                .value=${this.inputValue}
                @ds:change=${(e: CustomEvent) => { this.inputValue = e.detail.value; }}
              ></ds-input>
            </div>
            <div class="form-field">
              <label for="disabled-input">Disabled Input</label>
              <ds-input id="disabled-input" placeholder="Disabled" disabled></ds-input>
            </div>
          </div>
        </div>
      </div>

      <!-- Textarea Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Textarea</h3>
        <p class="showcase-description">
          A multi-line text input for longer content.
        </p>
        <div class="showcase-demo">
          <div class="form-group">
            <div class="form-field">
              <label for="textarea">Message</label>
              <ds-textarea
                id="textarea"
                placeholder="Enter your message..."
                .value=${this.textareaValue}
                rows="4"
                @ds:change=${(e: CustomEvent) => { this.textareaValue = e.detail.value; }}
              ></ds-textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Checkbox Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Checkbox</h3>
        <p class="showcase-description">
          A toggle for boolean options.
        </p>
        <div class="showcase-demo">
          <div class="checkbox-group">
            <ds-checkbox
              ?checked=${this.checkboxChecked}
              @ds:change=${(e: CustomEvent) => { this.checkboxChecked = e.detail.checked; }}
            >
              Accept terms and conditions
            </ds-checkbox>
            <ds-checkbox disabled>Disabled checkbox</ds-checkbox>
            <ds-checkbox checked>Pre-checked option</ds-checkbox>
          </div>
        </div>
      </div>

      <!-- Radio Group Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Radio Group</h3>
        <p class="showcase-description">
          A group of mutually exclusive options.
        </p>
        <div class="showcase-demo">
          <ds-radio-group value="option1">
            <ds-radio value="option1">Option 1</ds-radio>
            <ds-radio value="option2">Option 2</ds-radio>
            <ds-radio value="option3">Option 3</ds-radio>
          </ds-radio-group>
        </div>
      </div>

      <!-- Switch Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Switch</h3>
        <p class="showcase-description">
          A toggle switch for on/off states.
        </p>
        <div class="showcase-demo">
          <div class="switch-group">
            <ds-switch
              ?checked=${this.switchChecked}
              @ds:change=${(e: CustomEvent) => { this.switchChecked = e.detail.checked; }}
            >
              Enable notifications
            </ds-switch>
            <ds-switch disabled>Disabled switch</ds-switch>
            <ds-switch checked>Pre-enabled option</ds-switch>
          </div>
        </div>
      </div>

      <!-- Select Showcase -->
      <div class="showcase-card">
        <h3 class="showcase-title">Select</h3>
        <p class="showcase-description">
          A dropdown selection component.
        </p>
        <div class="showcase-demo">
          <div style="max-width: 300px;">
            <div class="form-field">
              <label>Choose an option</label>
              <ds-select>
                <ds-select-trigger>
                  <span slot="placeholder">Select an option</span>
                </ds-select-trigger>
                <ds-select-content>
                  <ds-select-option value="option1">Option 1</ds-select-option>
                  <ds-select-option value="option2">Option 2</ds-select-option>
                  <ds-select-option value="option3">Option 3</ds-select-option>
                </ds-select-content>
              </ds-select>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-page-forms': DemoPageForms;
  }
}
