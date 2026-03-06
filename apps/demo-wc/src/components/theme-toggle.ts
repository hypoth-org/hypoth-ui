import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getTheme, toggleTheme, onThemeChange, type Theme } from '../utils/theme';

// Import WC components (bundled exports)
import '@hypoth-ui/wc/form-controls';

/**
 * Theme toggle component using ds-switch
 * Allows users to toggle between light and dark themes
 * Uses Light DOM so global CSS styles apply
 */
@customElement('demo-theme-toggle')
export class DemoThemeToggle extends LitElement {
  @state()
  private theme: Theme = 'light';

  private unsubscribe?: () => void;

  // Use Light DOM so global CSS applies
  protected override createRenderRoot() {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.theme = getTheme();
    this.unsubscribe = onThemeChange((theme) => {
      this.theme = theme;
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }

  private handleToggle = () => {
    toggleTheme();
  };

  render() {
    const isDark = this.theme === 'dark';

    return html`
      <span class="theme-label">${isDark ? 'Dark' : 'Light'}</span>
      <ds-switch
        ?checked=${isDark}
        @ds:change=${this.handleToggle}
        aria-label="Toggle dark mode"
      ></ds-switch>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-theme-toggle': DemoThemeToggle;
  }
}
